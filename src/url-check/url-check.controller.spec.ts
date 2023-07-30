import { Test, TestingModule } from '@nestjs/testing';
import { UrlCheckController } from './url-check.controller';

describe('UrlCheckController', () => {
  let controller: UrlCheckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlCheckController],
    }).compile();

    controller = module.get<UrlCheckController>(UrlCheckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
