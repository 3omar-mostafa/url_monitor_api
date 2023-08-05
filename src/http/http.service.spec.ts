import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from './http.service';
import { HttpModule as Http } from '@nestjs/axios/dist/http.module';
import { NotificationModule } from '../notification/notification.module';
import { closeMongoConnection, rootMongooseTestModule } from '../../test/utils/in-memory-mongodb';

describe('HttpService', () => {
  let service: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), Http, NotificationModule],
      providers: [HttpService],
      exports: [HttpService],
    }).compile();

    service = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(async () => {
    await closeMongoConnection();
  });
});
