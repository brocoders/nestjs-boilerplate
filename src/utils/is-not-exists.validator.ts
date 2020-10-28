import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getRepository } from 'typeorm';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

@ValidatorConstraint({ name: 'IsNotExist', async: true })
export class IsNotExist implements ValidatorConstraintInterface {
  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0];
    const currentValue: any = validationArguments.object;
    const entity: any = await getRepository(repository).findOne({
      [validationArguments.property]: value,
    });

    if (entity && entity.id === currentValue?.id) {
      return true;
    }

    return !entity;
  }
}
