import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    Jwt.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          privateKey: configService.get('JWT_PRIVATE_KEY'),
          publicKey: configService.get('JWT_PUBLIC_KEY'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION_TIME'),
            algorithm: configService.get('JWT_ALGORITHM'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
