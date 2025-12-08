import { Test, TestingModule } from '@nestjs/testing';
import { BikerProfileService } from './biker-profile.service';

describe('BikerProfileService', () => {
  let service: BikerProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BikerProfileService],
    }).compile();

    service = module.get<BikerProfileService>(BikerProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
