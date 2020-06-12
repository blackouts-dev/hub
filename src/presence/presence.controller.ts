import { Controller, Get, Logger, Param } from '@nestjs/common';
import { Presence } from './presence.entity';
import { PresenceService } from './presence.service';

@Controller('presence')
export class PresenceController {
  constructor(private service: PresenceService) {}

  @Get(':botId')
  async queryBot(@Param('botId') botId: string): Promise<Presence[]> {
    // we should do actual validation here
    // and use actual DTO or smth
    const id = BigInt(botId);

    Logger.debug({ botId }, 'presence controller hell');

    const presences = await this.service.queryBot(id);

    return presences;
  }
}
