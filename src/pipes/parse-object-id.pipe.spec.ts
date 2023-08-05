import { ParseObjectIdPipe } from './parse-object-id.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ParseObjectIdPipe', () => {
  it('should be defined', () => {
    expect(new ParseObjectIdPipe()).toBeDefined();
  });

  it('should parse ObjectId', () => {
    const pipe = new ParseObjectIdPipe();
    const result = pipe.transform('5a2345678901234567890123');
    expect(result).toBeDefined();
  });

  it('should not parse invalid ObjectId', () => {
    const pipe = new ParseObjectIdPipe();
    expect(() => {
      pipe.transform('invalid');
    }).toThrow(BadRequestException);
  });
});
