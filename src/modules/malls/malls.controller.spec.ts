import { Test, TestingModule } from '@nestjs/testing';
import { MallsController } from './malls.controller';
import { MallsService } from './malls.service';

describe('MallsController', () => {
  let controller: MallsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MallsController],
      providers: [MallsService],
    }).compile();

    controller = module.get<MallsController>(MallsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
