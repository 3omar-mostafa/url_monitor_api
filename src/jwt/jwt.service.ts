import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService as Jwt } from '@nestjs/jwt';
import { User } from '../models/User';
import { JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt/dist/interfaces';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: Jwt) {}

  async generateJwtToken(user: User, payload?) {
    if (!payload) {
      payload = { sub: user.id, firstName: user.firstName, email: user.email, isVerified: user.isVerified };
    }
    return this.signAsync(payload);
  }

  verify(token: string, options?: JwtVerifyOptions): any {
    try {
      return this.jwtService.verify(token, options);
    } catch (err) {
      console.log('JWT Verify Error: ' + err.message);
      return null;
    }
  }

  async signAsync(payload: string, options?: Omit<JwtSignOptions, keyof jwt.SignOptions>): Promise<string> {
    return this.jwtService.signAsync(payload, options);
  }

  sign(payload: string, options?: Omit<JwtSignOptions, keyof jwt.SignOptions>): string {
    return this.jwtService.sign(payload, options);
  }
}
