import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { transformAndValidate } from 'class-transformer-validator';
import { Repository } from 'typeorm';
import { Presence } from './presence.entity';

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(Presence)
    private presenceRepository: Repository<Presence>,
  ) {}

  findAll(): Promise<Presence[]> {
    return this.presenceRepository.find();
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
