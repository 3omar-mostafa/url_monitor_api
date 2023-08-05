import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { Models } from '../src/models/constants';
import { UserSchema } from '../src/models/User';
import { JwtModule } from '../src/jwt/jwt.module';
import { NotificationModule } from '../src/notification/notification.module';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { UsersService } from '../src/users/users.service';
import { JwtStrategy } from '../src/auth/jwt.strategy';
import { closeMongoConnection, rootMongooseTestModule } from './utils/in-memory-mongodb';
import { Types } from 'mongoose';
import { NotificationService } from '../src/notification/notification.service';
import { JwtService } from '../src/jwt/jwt.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let notificationService;
  let jwtService: JwtService;

  beforeAll(() => {
    process.env.JWT_SECRET_KEY = 'password123';
    process.env.JWT_EXPIRATION_TIME = '10m';
    process.env.HOST_DOMAIN = 'http://localhost';
  });

  const moduleInit = async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        rootMongooseTestModule(),
        MongooseModule.forFeature([{ name: Models.USER, schema: UserSchema }]),
        JwtModule,
        NotificationModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, UsersService, JwtStrategy],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    notificationService = app.get<NotificationService>(NotificationService);
    jwtService = app.get<JwtService>(JwtService);

    await app.init();
  };

  const moduleTeardown = async () => {
    await closeMongoConnection();
    await app.close();
  };

  describe('Create User Endpoint (POST /auth/signup)', () => {
    describe('When called with valid data', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        password: 'password123',
      };

      let res: request.Response;

      beforeAll(async () => {
        await moduleInit();
        jest.spyOn(notificationService, 'sendEmailVerification');
        res = await request(app.getHttpServer()).post('/auth/signup').send(user);
      });

      afterAll(async () => {
        await moduleTeardown();
      });

      it('then it should have http status code 201 created', () => {
        expect(res.statusCode).toBe(HttpStatus.CREATED);
      });

      it('then it should return a valid user', async () => {
        expect(res.body.email).toBe(user.email);
        expect(res.body.firstName).toBe(user.firstName);
        expect(res.body.lastName).toBe(user.lastName);
        expect(res.body.password).toBeUndefined();
        expect(res.body.id).toBeDefined();
        expect(Types.ObjectId.isValid(res.body.id)).toBeTruthy();
      });

      it('then it should send email verification', async () => {
        expect(notificationService.sendEmailVerification).toBeCalled();
      });
    });

    describe('When called with invalid email', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'this is not a valid email',
        password: 'password123',
      };

      let res: request.Response;

      beforeAll(async () => {
        await moduleInit();
        jest.spyOn(notificationService, 'sendEmailVerification');
        res = await request(app.getHttpServer()).post('/auth/signup').send(user);
      });

      afterAll(async () => {
        await moduleTeardown();
      });

      it('then it should have http status code 400 bad request', () => {
        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it('then it should return a validation error', async () => {
        expect(res.body.message).toContain('email must be an email');
      });

      it('then it should not send email verification', async () => {
        expect(notificationService.sendEmailVerification).not.toBeCalled();
      });
    });

    describe('When called with short password', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'this is not a valid email',
        password: '<8chars',
      };

      let res: request.Response;

      beforeAll(async () => {
        await moduleInit();
        jest.spyOn(notificationService, 'sendEmailVerification');
        res = await request(app.getHttpServer()).post('/auth/signup').send(user);
      });

      afterAll(async () => {
        await moduleTeardown();
      });

      it('then it should have http status code 400 bad request', () => {
        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it('then it should return a validation error', async () => {
        expect(res.body.message).toContain('password must be longer than or equal to 8 characters');
      });

      it('then it should not send email verification', async () => {
        expect(notificationService.sendEmailVerification).not.toBeCalled();
      });
    });

    describe('When called with no password', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
      };

      let res: request.Response;

      beforeAll(async () => {
        await moduleInit();
        jest.spyOn(notificationService, 'sendEmailVerification');
        res = await request(app.getHttpServer()).post('/auth/signup').send(user);
      });

      afterAll(async () => {
        await moduleTeardown();
      });

      it('then it should have http status code 400 bad request', () => {
        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it('then it should return a validation error', async () => {
        expect(res.body.message).toContain('password should not be empty');
      });

      it('then it should not send email verification', async () => {
        expect(notificationService.sendEmailVerification).not.toBeCalled();
      });
    });

    describe('When called with duplicate email', () => {
      const user = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@test.com',
        password: 'password123',
      };

      let res: request.Response;

      beforeAll(async () => {
        await moduleInit();
        await request(app.getHttpServer()).post('/auth/signup').send(user);
        jest.spyOn(notificationService, 'sendEmailVerification');
        res = await request(app.getHttpServer()).post('/auth/signup').send(user);
      });

      afterAll(async () => {
        await moduleTeardown();
      });

      it('then it should have http status code 400 bad request', () => {
        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it('then it should return a validation error', async () => {
        expect(res.body.message).toContain(`User '${user.email}' already exists`);
      });

      it('then it should not send email verification', async () => {
        expect(notificationService.sendEmailVerification).not.toBeCalled();
      });
    });
  });

  describe('Login Endpoint (POST /auth/login)', () => {
    let user = {
      id: null,
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@test.com',
      password: 'password123',
    };

    const credentials = {
      email: 'test@test.com',
      password: 'password123',
    };

    let verificationUrl: string;

    const loginEndpointInit = async () => {
      await moduleInit();
      jest.spyOn(notificationService, 'sendEmailVerification');

      const response = await request(app.getHttpServer()).post('/auth/signup').send(user);

      verificationUrl = await notificationService.sendEmailVerification.mock.calls[0][1];
      const url = new URL(verificationUrl);
      verificationUrl = verificationUrl.toString().substring(url.origin.length); // Get relative path

      user = { ...user, ...response.body };
    };

    describe('When called with valid data, but email is not verified', () => {
      let res: request.Response;

      beforeAll(async () => {
        await loginEndpointInit();
        res = await request(app.getHttpServer()).post('/auth/login').send(credentials);
      });

      afterAll(async () => {
        await moduleTeardown();
      });

      it('then it should have http status code 401 unauthorized', () => {
        expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      });

      it('then it should return a detailed message', async () => {
        expect(res.body.message).toContain('Please verify your email address');
      });

      it('then it should not return a token', async () => {
        expect(jwtService.verify(res.body.token)).toBeNull();
      });
    });

    describe('When called with valid data', () => {
      let res: request.Response;

      beforeAll(async () => {
        await loginEndpointInit();
        await request(app.getHttpServer()).get(verificationUrl);
        res = await request(app.getHttpServer()).post('/auth/login').send(credentials);
      });

      afterAll(async () => {
        await moduleTeardown();
      });

      it('then it should have http status code 200 ok', () => {
        expect(res.statusCode).toBe(HttpStatus.OK);
      });

      it('then it should return a valid jwt token', async () => {
        expect(res.body.token).toBeDefined();
        expect(jwtService.verify(res.body.token)).not.toBeNull();
        const jwtPayload = jwtService.decode(res.body.token);
        expect(jwtPayload.sub).toBe(user.id);
        expect(jwtPayload.isVerified).toBeTruthy();
      });
    });

    describe('When calling verify email multiple times', () => {
      let res: request.Response;

      beforeAll(async () => {
        await loginEndpointInit();

        await request(app.getHttpServer()).get(verificationUrl);
        res = await request(app.getHttpServer()).get(verificationUrl);
      });

      afterAll(async () => {
        await moduleTeardown();
      });

      it('then it should have http status code 400 bad request', () => {
        expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
      });

      it('then it should return a validation error', async () => {
        expect(res.body.message).toContain(`mail ${user.email} is already verified, you can login now`);
      });
    });
  });
});
