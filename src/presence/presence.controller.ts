import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ParseBigIntPipe } from 'src/parse-big-int.pipe';
import { PresenceService } from './presence.service';
import { UptimeStat } from './uptime-stat.dto';

@Controller('presence')
export class PresenceController {
  constructor(private service: PresenceService) {}

  @Get(':botId')
  async queryBot(@Param('botId', ParseBigIntPipe) botId: bigint): Promise<UptimeStat[]> {
    const uptimeStats = await this.service.uptimeStats(botId.toString());

    if (uptimeStats.length === 0) {
      throw new NotFoundException('No presence data recorded');
    }

    return uptimeStats;
  }
}
