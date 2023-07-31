import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UrlCheckService } from './url-check.service';
import { UrlCheck } from 'src/models/UrlCheck';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetCurrentUser } from '../auth/get-user.decorator';
import { User } from '../models/User';
import { ObjectId } from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';

@Controller('url-check')
export class UrlCheckController {
  constructor(private readonly urlCheckService: UrlCheckService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@GetCurrentUser() user: User, @Body() urlCheck: UrlCheck): Promise<UrlCheck> {
    urlCheck.user = user;
    return this.urlCheckService.create(urlCheck);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@GetCurrentUser() user: User): Promise<UrlCheck[]> {
    return this.urlCheckService.findAll(user.id);
  }

  @Get('unsubscribe')
  async unsubscribe(@Query('token') token: string) {
    return this.urlCheckService.unsubscribe(token);
  }

  @Get(':urlCheckId')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @GetCurrentUser() user: User,
    @Param('urlCheckId', ParseObjectIdPipe) urlCheckId: ObjectId,
  ): Promise<UrlCheck> {
    return this.urlCheckService.findOne(user.id, urlCheckId);
  }

  @Put(':urlCheckId')
  @UseGuards(JwtAuthGuard)
  async update(
    @GetCurrentUser() user: User,
    @Param('urlCheckId', ParseObjectIdPipe) urlCheckId: ObjectId,
    @Body() urlCheck: UrlCheck,
  ): Promise<UrlCheck> {
    urlCheck.id = urlCheckId;
    return this.urlCheckService.update(user, urlCheck);
  }

  @Delete(':urlCheckId')
  @UseGuards(JwtAuthGuard)
  async delete(
    @GetCurrentUser() user: User,
    @Param('urlCheckId', ParseObjectIdPipe) urlCheckId: ObjectId,
  ): Promise<any> {
    return this.urlCheckService.delete(user.id, urlCheckId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteAll(@GetCurrentUser() user: User): Promise<any> {
    return this.urlCheckService.deleteAll(user.id);
  }
}
