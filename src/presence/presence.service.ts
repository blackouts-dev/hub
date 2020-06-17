import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformAndValidate } from 'class-transformer-validator';
import { Repository } from 'typeorm';
import { Presence } from './presence.entity';
import { UptimeStat } from './uptime-stat.dto';

/**
 * A bot's status at a point in time.
 */
export enum Status {
  Up = 'up',
  Down = 'down',
  Partial = 'partial',
}

/**
 * An entry in a bot uptime timeline.
 */
export interface TimelineEntry {
  status: Status;
  when: Date;
}

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(Presence)
    public presenceRepository: Repository<Presence>,
  ) {}

  public async uptimeStats(botId: string): Promise<UptimeStat[]> {
    const bots = await this.presenceRepository.find({ where: { bot_id: botId }, order: { when: 'DESC' }, select: ['guild_id', 'online', 'when'] });

    return bots;
  }

  static getStatus(history: readonly UptimeStat[]): Status {
    const uniqueGuilds = [...new Set(history.map((item) => item.guild_id))];
    const statuses: boolean[] = uniqueGuilds.map((id) => {
      return [...history].reverse().find((item) => item.guild_id === id).online;
    });

    let containedTrue = false;
    if (statuses.every((x) => (x && !containedTrue ? (containedTrue = x) : x))) {
      return Status.Up;
    } else {
      return containedTrue ? Status.Partial : Status.Down;
    }
  }

  static getTimeline(history: readonly UptimeStat[]): TimelineEntry[] {
    return (
      history
        .map((presence, i) => ({ status: PresenceService.getStatus(history.slice(0, i + 1)), when: presence.when }))
        // Consolidate consecutive parts
        .reduce((target, item, index, source) => {
          if (!source[index - 1] || item.status !== source[index - 1].status) {
            target.push(item);
          }

          return target;
        }, [])
    );
  }

  /**
   * Executed when a presence is reported by the Discord bot.
   * @param msg The message from the bot
   */
  @RabbitSubscribe({
    exchange: 'presence',
    routingKey: 'bot.presence.update',
    queue: 'record-presence',
  })
  public async onPresenceUpdate(msg: Record<string, unknown>): Promise<void> {
    let presence: Presence;

    try {
      presence = await transformAndValidate(Presence, msg);
    } catch (error) {
      Logger.error('Invalid message from RabbitMQ', error);
    }

    Logger.debug(presence);

    this.presenceRepository.insert(presence);
  }
}
