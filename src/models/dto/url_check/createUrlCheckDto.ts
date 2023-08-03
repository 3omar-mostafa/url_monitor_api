import { OmitType } from '@nestjs/mapped-types';
import { UrlCheck } from '../../UrlCheck';

export class CreateUrlCheckDto extends OmitType(UrlCheck, ['id', '_id', 'isUp', 'user']) {}
