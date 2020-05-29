import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Presence } from './presence.entity';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class PresenceService {
  constructor(
    @InjectRepository(Presence)
    private presenceRepository: Repository<Presence>,
  ) {}

  findAll(): Promise<Presence[]> {
    return this.presenceRepository.find();
  }

  @RabbitSubscribe({
    exchange: 'presence',
    routingKey: 'bot.presence.update',
    queue: 'record-presence',
  })
  public async storePresence(msg: {
    bot_id: string;
    online: boolean;
  }): Promise<void> {
    await this.presenceRepository.save({
      // eslint-disable-next-line @typescript-eslint/camelcase
      bot_id: msg.bot_id,
      online: msg.online,
      when: new Date(),
    });
  }
}
