import {
  ZodTypeAny,
  ZodObject,
  ZodArray,
  ZodEnum,
  ZodString,
  ZodNumber,
  ZodBoolean,
  ZodEffects,
} from 'zod';

function getType(zodType: ZodTypeAny): string {
  if (zodType instanceof ZodString) return 'string';
  if (zodType instanceof ZodNumber) return 'number';
  if (zodType instanceof ZodBoolean) return 'boolean';
  if (zodType instanceof ZodEnum)
    return `enum(${zodType._def.values.join(', ')})`;
  if (zodType instanceof ZodArray)
    return `array of ${getType(zodType._def.type)}`;
  if (zodType instanceof ZodObject) return 'object';
  if (zodType instanceof ZodEffects) return getType(zodType._def.schema);
  return 'unknown';
}

function describeZodSchema(zodType: ZodTypeAny, indent = 2): string {
  if (zodType instanceof ZodObject) {
    const shape = zodType.shape;
    const entries = Object.entries(shape).map(([key, value]) => {
      const v = value as ZodTypeAny;
      const desc = v.description ? ` // ${v.description}` : '';
      return `${' '.repeat(indent)}"${key}": ${describeZodSchema(v, indent + 2)}${desc}`;
    });
    return `{
${entries.join(',\n')}
${' '.repeat(indent - 2)}}`;
  }
  if (zodType instanceof ZodArray) {
    return `[${describeZodSchema(zodType._def.type, indent + 2)}]`;
  }
  if (zodType instanceof ZodEnum) {
    return `"${zodType._def.values.join('" | "')}"`;
  }
  return getType(zodType);
}

export function zodSchemaToPromptDescription(zodType: ZodTypeAny): string {
  return describeZodSchema(zodType);
}
