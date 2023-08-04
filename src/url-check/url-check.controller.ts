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
  UseInterceptors,
} from '@nestjs/common';
import { UrlCheckService } from './url-check.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetCurrentUser } from '../auth/get-user.decorator';
import { User } from '../models/User';
import { ObjectId } from 'mongoose';
import { ParseObjectIdPipe } from '../pipes/parse-object-id.pipe';
import { CreateUrlCheckDto } from '../models/dto/url_check/createUrlCheckDto';
import { UpdateUrlCheckDto } from '../models/dto/url_check/updateUrlCheckDto';
import { ReturnUrlCheckDto } from '../models/dto/url_check/returnUrlCheckDto';
import { ResponseTransformInterceptor } from '../interceptors/response-transform-interceptor.service';
import { ReturnReportDto } from '../models/dto/report/returnReportDto';
import { Report } from '../models/Report';

@Controller('url-check')
export class UrlCheckController {
  private static responseTransformInterceptor = new ResponseTransformInterceptor(ReturnUrlCheckDto);

  constructor(private readonly urlCheckService: UrlCheckService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UrlCheckController.responseTransformInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async create(@GetCurrentUser() user: User, @Body() urlCheck: CreateUrlCheckDto): Promise<ReturnUrlCheckDto> {
    return this.urlCheckService.create(user.id, urlCheck);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UrlCheckController.responseTransformInterceptor)
  async findAll(@GetCurrentUser() user: User): Promise<ReturnUrlCheckDto[]> {
    return this.urlCheckService.findAll(user.id);
  }

  @Get('unsubscribe')
  async unsubscribe(@Query('token') token: string) {
    return this.urlCheckService.unsubscribe(token);
  }

  @Get(':urlCheckId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UrlCheckController.responseTransformInterceptor)
  async findOne(
    @GetCurrentUser() user: User,
    @Param('urlCheckId', ParseObjectIdPipe) urlCheckId: ObjectId,
  ): Promise<ReturnUrlCheckDto> {
    return this.urlCheckService.findOne(user.id, urlCheckId);
  }

  @Get(':urlCheckId/report')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(new ResponseTransformInterceptor(ReturnReportDto))
  async findReport(
    @GetCurrentUser() user: User,
    @Param('urlCheckId', ParseObjectIdPipe) urlCheckId: ObjectId,
  ): Promise<Report> {
    const urlCheck = await this.urlCheckService.findOne(user.id, urlCheckId);
    return urlCheck.report;
  }

  @Put(':urlCheckId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(UrlCheckController.responseTransformInterceptor)
  async update(
    @GetCurrentUser() user: User,
    @Param('urlCheckId', ParseObjectIdPipe) urlCheckId: ObjectId,
    @Body() urlCheck: UpdateUrlCheckDto,
  ): Promise<ReturnUrlCheckDto> {
    return this.urlCheckService.update(user.id, urlCheckId, urlCheck);
  }

  @Delete(':urlCheckId')
  @UseGuards(JwtAuthGuard)
  async delete(@GetCurrentUser() user: User, @Param('urlCheckId', ParseObjectIdPipe) urlCheckId: ObjectId) {
    await this.urlCheckService.delete(user.id, urlCheckId);
    return {
      status: 'success',
      message: 'Url check was deleted successfully',
    };
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteAll(@GetCurrentUser() user: User) {
    await this.urlCheckService.deleteAll(user.id);
    return {
      status: 'success',
      message: `All your url checks were deleted successfully`,
    };
  }
}
