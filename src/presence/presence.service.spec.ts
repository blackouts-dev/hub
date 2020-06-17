import { Test, TestingModule } from '@nestjs/testing';
import { PresenceService, Status } from './presence.service';

describe('PresenceService', () => {
  let service: PresenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresenceService],
    }).compile();

    service = module.get<PresenceService>(PresenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate bot statuses properly', () => {
    const now = new Date(1592396538670);
    expect(PresenceService.getStatus([{ guild_id: '1', online: true, when: now }])).toEqual(Status.Up);
  });
});
