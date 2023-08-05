import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule as Jwt } from '@nestjs/jwt';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    Jwt.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const defaultExpirationTime = '1h';

        const publicKeyOptions = {
          privateKey: configService.get('JWT_PRIVATE_KEY'),
          publicKey: configService.get('JWT_PUBLIC_KEY'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION_TIME', defaultExpirationTime),
            algorithm: configService.get('JWT_ALGORITHM', 'RS256'),
          },
        };

        const secretKeyOptions = {
          secret: configService.get('JWT_SECRET_KEY'),
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRATION_TIME', defaultExpirationTime),
            algorithm: configService.get('JWT_ALGORITHM', 'HS256'),
          },
        };

        return configService.get('JWT_PRIVATE_KEY') ? publicKeyOptions : secretKeyOptions;
      },
      inject: [ConfigService],
    }),
  ],
  providers: [JwtService],
  exports: [JwtService],
})
export class JwtModule {}
