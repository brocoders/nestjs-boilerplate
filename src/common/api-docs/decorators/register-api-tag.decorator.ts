import { applyDecorators } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerTagRegistry } from '../swagger-tag.registry';

/**
 * Unified decorator to register and apply Swagger tags.
 */
export function RegisterApiTag(
  name: string,
  description?: string,
  reference?: string,
) {
  SwaggerTagRegistry.getInstance().registerTag(name, description, reference);
  return applyDecorators(ApiTags(name));
}
