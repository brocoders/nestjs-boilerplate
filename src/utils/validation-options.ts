import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';

type ValidationErrorsTree = {
  [key: string]: string | ValidationErrorsTree;
};

function generateErrors(errors: ValidationError[]): ValidationErrorsTree {
  return errors.reduce<ValidationErrorsTree>(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.property]:
        (currentValue.children?.length ?? 0) > 0
          ? generateErrors(currentValue.children ?? [])
          : Object.values(currentValue.constraints ?? {}).join(', '),
    }),
    {},
  );
}

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    return new UnprocessableEntityException({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: generateErrors(errors),
    });
  },
};

export default validationOptions;
