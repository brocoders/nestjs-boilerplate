import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { InfinityPaginationResponseDto } from '../dto/infinity-pagination-response.dto';

export function ApiInfinityPaginatedResponse<TModel extends Type<unknown>>(
  model: TModel,
  description = 'Paginated response',
) {
  return applyDecorators(
    ApiExtraModels(InfinityPaginationResponseDto, model),
    ApiOkResponse({
      description,
      schema: {
        allOf: [
          { $ref: getSchemaPath(InfinityPaginationResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
}
