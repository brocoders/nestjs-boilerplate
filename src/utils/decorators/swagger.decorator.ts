import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  getSchemaPath,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { RoleEnum } from '../../roles/roles.enum';
import { RoleGroupsDict } from '../types/const.type';
import { capitalizeFirst } from '../transformers/text.transformer';

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

export function ApiOperationRoles(
  summary: string,
  roles?: RoleEnum[],
  extraDescription?: string,
) {
  const selectedRoles =
    roles && roles.length > 0
      ? roles
      : (Object.keys(RoleGroupsDict).map(Number) as RoleEnum[]);

  const rolesText = selectedRoles
    .map((r) => `**${capitalizeFirst(RoleGroupsDict[r])}**`)
    .join(', ');

  const descriptionLines = [`**Allowed Roles:** ${rolesText}`];

  if (extraDescription) {
    descriptionLines.push(capitalizeFirst(extraDescription));
  }

  return applyDecorators(
    ApiOperation({
      summary,
      description: descriptionLines.join('\n\n'),
    }),
  );
}
