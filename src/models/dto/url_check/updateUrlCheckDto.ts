import { OmitType, PartialType } from '@nestjs/mapped-types';
import { UrlCheck } from '../../UrlCheck';

export class UpdateUrlCheckDto extends OmitType(PartialType(UrlCheck), ['id', '_id', 'isUp', 'user', 'url']) {}
