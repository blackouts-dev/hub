import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformAndValidate } from 'class-transformer-validator';
import { Repository } from 'typeorm';
import { Presence } from './presence.entity';
import { UptimeStat } from './uptime-stat.dto';

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
