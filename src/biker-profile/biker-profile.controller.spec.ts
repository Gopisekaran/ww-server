import { Test, TestingModule } from '@nestjs/testing';
import { BikerProfileController } from './biker-profile.controller';
import { BikerProfileService } from './biker-profile.service';

describe('BikerProfileController', () => {
  let controller: BikerProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BikerProfileController],
      providers: [BikerProfileService],
    }).compile();

    controller = module.get<BikerProfileController>(BikerProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
