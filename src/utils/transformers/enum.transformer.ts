import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { isValidEnumValue, getEnumErrorMessage } from '../enum-helper';

@Injectable()
export class ValidateEnumTransformer implements PipeTransform {
  constructor(
    private readonly enumType: object,
    private readonly fieldName: string,
  ) {}

  transform(value: any) {
    if (!isValidEnumValue(this.enumType, value)) {
      throw new BadRequestException(
        getEnumErrorMessage(this.enumType, this.fieldName),
      );
    }
    return value;
  }
}
