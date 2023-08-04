import { Expose, Type } from 'class-transformer';
import { ReturnReportDto } from './returnReportDto';
import { ObjectId } from 'mongoose';

export class ReturnMultiReportsDto {
  @Expose()
  id: ObjectId | string;

  @Expose()
  url: string;

  @Expose()
  @Type(() => ReturnReportDto)
  report: ReturnReportDto;
}
