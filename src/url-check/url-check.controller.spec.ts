import { Test, TestingModule } from '@nestjs/testing';
import { UrlCheckController } from './url-check.controller';
import { JwtModule } from '../jwt/jwt.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Models } from '../models/constants';
import { UrlCheck, UrlCheckSchema } from '../models/UrlCheck';
import { Report } from '../models/Report';
import { UrlCheckService } from './url-check.service';
import { closeMongoConnection, rootMongooseTestModule } from '../../test/utils/in-memory-mongodb';
import mongoose from 'mongoose';

describe('UrlCheckController', () => {
  let controller: UrlCheckController;
  let service: UrlCheckService;

  const user: any = {
    id: new mongoose.Types.ObjectId(),
    firstName: 'John',
    lastName: 'Doe',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule,
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Models.URL_CHECK, schema: UrlCheckSchema }]),
      ],
      providers: [UrlCheckService],
      exports: [UrlCheckService, MongooseModule],
      controllers: [UrlCheckController],
    }).compile();

    controller = module.get<UrlCheckController>(UrlCheckController);
    service = module.get<UrlCheckService>(UrlCheckService);
  });

  afterAll(async () => {
    await closeMongoConnection();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    let result: any;
    let actual: any;

    beforeEach(async () => {
      result = new UrlCheck();
      result.id = new mongoose.Types.ObjectId();

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      actual = await controller.findOne(user, result.id);
    });

    it('it should return url check', async () => {
      expect(actual).toBe(result);
    });

    it('it should call service with correct params', async () => {
      expect(service.findOne).toHaveBeenCalledWith(user.id, result.id);
    });
  });

  describe('findAll', () => {
    let result: any;
    let actual: any;

    beforeEach(async () => {
      result = [{ id: new mongoose.Types.ObjectId() }, { id: new mongoose.Types.ObjectId() }];

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      actual = await controller.findAll(user);
    });

    it('it should return url check array', async () => {
      expect(actual).toBe(result);
    });

    it('it should call service with correct params', async () => {
      expect(service.findAll).toHaveBeenCalledWith(user.id);
    });
  });

  describe('create', () => {
    let result: any;
    let actual: any;

    beforeEach(async () => {
      result = new UrlCheck();
      result.id = new mongoose.Types.ObjectId();

      jest.spyOn(service, 'create').mockResolvedValue(result);

      actual = await controller.create(user, result);
    });

    it('it should return url check', async () => {
      expect(actual).toBe(result);
    });

    it('it should call service with correct params', async () => {
      expect(service.create).toHaveBeenCalledWith(user.id, result);
    });
  });

  describe('unsubscribe', () => {
    let result: any;
    let actual: any;
    const token = 'token';

    beforeEach(async () => {
      result = [{ id: new mongoose.Types.ObjectId() }, { id: new mongoose.Types.ObjectId() }];

      jest.spyOn(service, 'unsubscribe').mockResolvedValue(result);

      actual = await controller.unsubscribe(token);
    });

    it('it should return url check array', async () => {
      expect(actual).toBe(result);
    });

    it('it should call service with correct params', async () => {
      expect(service.unsubscribe).toHaveBeenCalledWith(token);
    });
  });

  describe('getReportsByTag', () => {
    let result: any;
    let actual: any;
    const tag = 'tag';

    beforeEach(async () => {
      result = {
        status: 'success',
        message: 'You have successfully unsubscribed',
      };

      jest.spyOn(service, 'findReportsByTag').mockResolvedValue(result);

      actual = await controller.getReportsByTag(user, tag);
    });

    it('it should return success object', async () => {
      expect(actual).toBe(result);
    });

    it('it should call service with correct params', async () => {
      expect(service.findReportsByTag).toHaveBeenCalledWith(user.id, tag);
    });
  });

  describe('findReport', () => {
    let result: any;
    let report: any;
    let actual: any;

    beforeEach(async () => {
      result = new UrlCheck();
      result.id = new mongoose.Types.ObjectId();

      report = new Report();

      jest.spyOn(service, 'findReport').mockResolvedValue(report);

      actual = await controller.findReport(user, result.id);
    });

    it('it should return report', async () => {
      expect(actual).toBe(report);
    });

    it('it should call service with correct params', async () => {
      expect(service.findReport).toHaveBeenCalledWith(user.id, result.id);
    });
  });

  describe('update', () => {
    let result: any;
    let actual: any;

    beforeEach(async () => {
      result = new UrlCheck();
      result.id = new mongoose.Types.ObjectId();

      jest.spyOn(service, 'update').mockResolvedValue(result);

      actual = await controller.update(user, result.id, result);
    });

    it('it should return url check', async () => {
      expect(actual).toBe(result);
    });

    it('it should call service with correct params', async () => {
      expect(service.update).toHaveBeenCalledWith(user.id, result.id, result);
    });
  });

  describe('delete', () => {
    let urlCheck: any;
    let actual: any;
    let result: any;

    beforeEach(async () => {
      urlCheck = new UrlCheck();
      urlCheck.id = new mongoose.Types.ObjectId();

      result = {
        status: 'success',
        message: 'Url check was deleted successfully',
      };

      jest.spyOn(service, 'delete').mockResolvedValue(result);

      actual = await controller.delete(user, urlCheck.id);
    });

    it('it should return delete successfully object', async () => {
      expect(actual).toEqual(result);
    });

    it('it should call service with correct params', async () => {
      expect(service.delete).toHaveBeenCalledWith(user.id, urlCheck.id);
    });
  });

  describe('deleteAll', () => {
    let result: any;
    let actual: any;

    beforeEach(async () => {
      result = {
        status: 'success',
        message: `All your url checks were deleted successfully`,
      };

      jest.spyOn(service, 'deleteAll').mockResolvedValue(result);

      actual = await controller.deleteAll(user);
    });

    it('it should return delete successfully object', async () => {
      expect(actual).toEqual(result);
    });

    it('it should call service with correct params', async () => {
      expect(service.deleteAll).toHaveBeenCalledWith(user.id);
    });
  });
});
