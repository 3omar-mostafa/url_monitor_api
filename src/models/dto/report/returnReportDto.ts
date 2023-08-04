import { Expose, Type } from 'class-transformer';
import { HistoryElement } from '../../Report';

export class ReturnReportDto {
  @Expose()
  status: string;

  @Expose()
  availability: number;

  @Expose()
  outages: number;

  @Expose()
  downtime: number;

  @Expose()
  uptime: number;

  @Expose()
  responseTime: number;

  @Expose()
  @Type(() => HistoryElement)
  history: HistoryElement[];
}
