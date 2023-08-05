import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secretOrKey = configService.get('JWT_PUBLIC_KEY') || configService.get('JWT_SECRET_KEY');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secretOrKey,
    });
  }

  async validate(jwtPayload): Promise<any> {
    return { id: jwtPayload.sub, firstName: jwtPayload.firstName, email: jwtPayload.email };
  }
}
