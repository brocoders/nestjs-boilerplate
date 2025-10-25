// -----------------------------------------------------------------------------
// Helpers to document enveloped CMC responses in Swagger
// -----------------------------------------------------------------------------

import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { CmcStatusDto } from '../dto/cmc-base.response.dto';

/**
 * Ok response: { data: Model, status: CmcStatusDto }
 */
export function ApiCmcEnvelopeOkResponse<Model extends Type<unknown>>(
  model: Model,
  description?: string,
) {
  return applyDecorators(
    ApiExtraModels(CmcStatusDto, model),
    ApiOkResponse({
      description: description ?? 'Successful CMC response',
      schema: {
        type: 'object',
        properties: {
          data: { $ref: getSchemaPath(model) },
          status: { $ref: getSchemaPath(CmcStatusDto) },
        },
      },
    }),
  );
}

/**
 * Ok response for arrays: { data: Model[], status: CmcStatusDto }
 */
export function ApiCmcArrayEnvelopeOkResponse<Model extends Type<unknown>>(
  model: Model,
  description?: string,
) {
  return applyDecorators(
    ApiExtraModels(CmcStatusDto, model),
    ApiOkResponse({
      description: description ?? 'Successful CMC response (array)',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(model) },
          },
          status: { $ref: getSchemaPath(CmcStatusDto) },
        },
      },
    }),
  );
}

/**
 * Ok response for keyed maps: { data: Record<string, Model>, status: CmcStatusDto }
 */
export function ApiCmcMapEnvelopeOkResponse<Model extends Type<unknown>>(
  model: Model,
  description?: string,
) {
  return applyDecorators(
    ApiExtraModels(CmcStatusDto, model),
    ApiOkResponse({
      description:
        description ?? 'Successful CMC response (map keyed by id/symbol)',
      schema: {
        type: 'object',
        properties: {
          data: {
            type: 'object',
            additionalProperties: { $ref: getSchemaPath(model) },
          },
          status: { $ref: getSchemaPath(CmcStatusDto) },
        },
      },
    }),
  );
}
