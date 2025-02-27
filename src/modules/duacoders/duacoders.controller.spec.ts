import { Test, TestingModule } from '@nestjs/testing';
import { DuacodersController } from './duacoders.controller';

describe('DuacodersController', () => {
  let controller: DuacodersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DuacodersController],
    }).compile();

    controller = module.get<DuacodersController>(DuacodersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
