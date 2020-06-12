import { Test, TestingModule } from '@nestjs/testing';
import { PresenceController } from './presence.controller';

describe('Presence Controller', () => {
  let controller: PresenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresenceController],
    }).compile();

    controller = module.get<PresenceController>(PresenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
