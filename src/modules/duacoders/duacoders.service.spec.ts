import { Test, TestingModule } from '@nestjs/testing';
import { DuacodersService } from './duacoders.service';

describe('DuacodersService', () => {
  let service: DuacodersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DuacodersService],
    }).compile();

    service = module.get<DuacodersService>(DuacodersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
