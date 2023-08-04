import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';

export type ReportDocument = HydratedDocument<Report>;

@Schema({ _id: false })
export class HistoryElement {
  /**
   * Timestamp were we received the response of the URL request
   */
  @Prop({ required: true })
  @Expose()
  timestamp: Date;

  /**
   * Status code of the response in case we received a response
   */
  @Prop()
  @Expose()
  statusCode?: number;

  /**
   * The total time, in seconds, between sending the request and receiving the response
   * Defaults to timeout in case the request did not succeed
   */
  @Prop()
  @Expose()
  responseTime?: number;
}

const HistoryElementSchema = SchemaFactory.createForClass(HistoryElement);

@Schema({ _id: false })
export class Report {
  /**
   * The current status of the URL
   */
  @Prop()
  status: string;

  /**
   * Percentage of the URL availability
   */
  @Prop({
    get: function (this: Report) {
      return 100 * (this.availableRequestsCount / this.requestsCount);
    },
  })
  readonly availability: number;

  /**
   * The total number of URL downtimes
   */
  outages: number;

  /**
   * The total time, in seconds, of the URL downtime
   */
  @Prop({ default: 0 })
  downtime: number;

  /**
   * The total time, in seconds, of the URL uptime
   */
  @Prop({ default: 0 })
  uptime: number;

  /**
   * The average response time for the URL
   */
  @Prop({
    get: function (this: Report) {
      return this.totalResponseTime / this.requestsCount;
    },
  })
  readonly responseTime: number;

  /**
   * Timestamped logs of the polling requests
   */
  @Prop({ type: [HistoryElementSchema], _id: false })
  history: HistoryElement[];

  /**
   * The total number of succeeded requests made to the URL
   */
  @Prop({ default: 0 })
  availableRequestsCount: number;

  /**
   * The total number of failed requests made to the URL
   */
  @Prop({ default: 0, alias: 'outages' })
  unavailableRequestsCount: number;

  /**
   * The total number of requests made to the URL
   */
  @Prop({
    get: function (this: Report) {
      return this.availableRequestsCount + this.unavailableRequestsCount;
    },
  })
  readonly requestsCount: number;

  /**
   * The total response time, in seconds, of the requests made to the URL
   */
  @Prop({ default: 0 })
  totalResponseTime: number;

  constructor() {
    this.history = [];
    this.uptime = 0;
    this.downtime = 0;
    this.outages = 0;
    this.availableRequestsCount = 0;
    this.unavailableRequestsCount = 0;
    this.totalResponseTime = 0;
  }
}

const ReportSchema = SchemaFactory.createForClass(Report);

export { ReportSchema };
