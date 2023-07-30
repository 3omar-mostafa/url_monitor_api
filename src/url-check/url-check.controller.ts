import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UrlCheckService } from './url-check.service';
import { UrlCheck } from 'src/models/UrlCheck';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetCurrentUser } from '../auth/get-user.decorator';
import { User } from '../models/User';
import { ObjectId } from 'mongoose';

@Controller('url-check')
@UseGuards(JwtAuthGuard)
export class UrlCheckController {
  constructor(private readonly urlCheckService: UrlCheckService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@GetCurrentUser() user: User, @Body() urlCheck: UrlCheck): Promise<UrlCheck> {
    urlCheck.user = user;
    return this.urlCheckService.create(urlCheck);
  }

  @Get()
  async findAll(@GetCurrentUser() user: User): Promise<UrlCheck[]> {
    return this.urlCheckService.findAll(user.id);
  }

  @Get(':urlCheckId')
  async findOne(
    @GetCurrentUser() user: User,
    @Param('urlCheckId') urlCheckId: ObjectId,
  ): Promise<UrlCheck> {
    return this.urlCheckService.findOne(user.id, urlCheckId);
  }

  @Put(':urlCheckId')
  async update(
    @GetCurrentUser() user: User,
    @Param('urlCheckId') urlCheckId: ObjectId,
    @Body() urlCheck: UrlCheck,
  ): Promise<UrlCheck> {
    urlCheck.id = urlCheckId;
    return this.urlCheckService.update(user, urlCheck);
  }

  @Delete(':urlCheckId')
  async delete(
    @GetCurrentUser() user: User,
    @Param('urlCheckId') urlCheckId: ObjectId,
  ): Promise<any> {
    return this.urlCheckService.delete(user.id, urlCheckId);
  }

  @Delete()
  async deleteAll(@GetCurrentUser() user: User): Promise<any> {
    return this.urlCheckService.deleteAll(user.id);
  }
}
