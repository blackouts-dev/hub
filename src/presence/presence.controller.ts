import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ParseBigIntPipe } from '../parse-big-int.pipe';
import { PresenceService, TimelineEntry } from './presence.service';

@Controller('presence')
export class PresenceController {
  constructor(private service: PresenceService) {}

  @Get(':botId')
  async queryBot(@Param('botId', ParseBigIntPipe) botId: bigint): Promise<TimelineEntry[]> {
    const uptimeStats = await this.service.uptimeStats(botId.toString());

    if (uptimeStats.length === 0) {
      throw new NotFoundException('No presence data recorded');
    }

    const timeline = PresenceService.getTimeline(uptimeStats);

    return timeline;
  }
}
