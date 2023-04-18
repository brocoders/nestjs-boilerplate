import { TransformFnParams } from 'class-transformer/types/interfaces';

export const lowerCaseTransformer = (
  params: TransformFnParams,
): string | null | undefined => params.value?.toLowerCase().trim();
