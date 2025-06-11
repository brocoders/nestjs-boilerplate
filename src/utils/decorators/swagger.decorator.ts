import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

interface ApiCustomResponseOptions {
  type: any;
  omittedFields?: string[]; // Fields to omit
  description?: string; // Description of the response
  isArray?: boolean; // Indicates if the response is an array
}

export function ApiOkCustomResponse({
  type,
  omittedFields = [],
  description = 'Request successful',
  isArray = true,
}: ApiCustomResponseOptions) {
  const filteredSchema = {
    type: 'object',
    allOf: [
      { $ref: getSchemaPath(type) }, // Reference the original schema
    ],
  };

  if (omittedFields.length > 0) {
    // Dynamically define properties while excluding omitted fields
    const properties = Object.keys(type.prototype)
      .filter((key) => !omittedFields.includes(key)) // Exclude omitted fields
      .map((key) => [key, {}]); // Create key-value pairs
    // Assign the filtered properties to the schema
    filteredSchema['properties'] = Object.fromEntries(properties);
  }

  return applyDecorators(
    ApiExtraModels(type),
    ApiOkResponse({
      description,
      schema: isArray
        ? {
            type: 'array',
            items: filteredSchema,
          }
        : filteredSchema, // Support both array and single object
    }),
  );
}
