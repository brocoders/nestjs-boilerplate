import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { safeRegex } from 'safe-regex2';

@ValidatorConstraint({ async: false })
export class IsValidRegexConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    if (typeof value !== 'string' || value.trim() === '') return false;
    try {
      if (!safeRegex(value)) return false;

      new RegExp(value);
      return true;
    } catch {
      return false;
    }
  }

  defaultMessage() {
    return 'pattern must be a valid and safe regular expression';
  }
}

export function IsValidRegex(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidRegexConstraint,
    });
  };
}
