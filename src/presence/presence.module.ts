import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presence } from './presence.entity';
import { PresenceService } from './presence.service';

@Module({
  imports: [TypeOrmModule.forFeature([Presence])],
  providers: [PresenceService],
  controllers: [],
})
export class PresenceModule {}
