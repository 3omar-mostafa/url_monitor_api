import { Test, TestingModule } from '@nestjs/testing';
import { UrlCheckService } from './url-check.service';

describe('UrlCheckService', () => {
  let service: UrlCheckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlCheckService],
    }).compile();

    service = module.get<UrlCheckService>(UrlCheckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
