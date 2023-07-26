import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../models/User';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Post('login')
  login(@Body() user: User) {
    return this.authService.logIn(user.email, user.password);
  }

  @Post('signup')
  signup(@Body() user: User) {
    return this.authService.signup(user);
  }
}
