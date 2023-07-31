import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../models/User';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() user: User) {
    return this.authService.logIn(user.email, user.password);
  }

  @Post('signup')
  signup(@Body() user: User) {
    return this.authService.signup(user);
  }

  @Get('verify')
  verify(@Query('token') token: string) {
    return this.authService.verify(token);
  }
}
