import validationOptions from '../validation-options';
import { ValidationError } from '@nestjs/common';

describe('validationOptions', () => {
  it('should format validation errors', () => {
    const errors: ValidationError[] = [
      {
        property: 'name',
        children: [],
        constraints: { isString: 'must be string' },
      } as ValidationError,
    ];

    // @ts-expect-error - using partial ValidationError object
    const exception = validationOptions.exceptionFactory(errors);
    const response = (exception as any).getResponse();
    expect(response).toEqual({
      status: 422,
      errors: { name: 'must be string' },
    });
  });
});
