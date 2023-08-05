import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../models/dto/user/createUserDto';
import { LoginUserDto } from '../models/dto/user/LoginUserDto';
import { ReturnUserDto } from '../models/dto/user/returnUserDto';
import { ResponseTransformInterceptor } from '../interceptors/response-transform-interceptor.service';

@Controller('auth')
export class AuthController {
  private static responseTransformInterceptor = new ResponseTransformInterceptor(ReturnUserDto);

  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: LoginUserDto) {
    return this.authService.logIn(user.email, user.password);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(AuthController.responseTransformInterceptor)
  signup(@Body() user: CreateUserDto): Promise<ReturnUserDto> {
    return this.authService.signup(user);
  }

  @Get('verify')
  verify(@Query('token') token: string) {
    return this.authService.verify(token);
  }
}
