import { z } from 'zod';
import { zodSchemaToPromptDescription } from '../zod-schema-to-prompt';

describe('zodSchemaToPromptDescription', () => {
  it('should convert object schema to prompt description', () => {
    const schema = z.object({
      name: z.string().describe('user name'),
      age: z.number(),
    });
    const description = zodSchemaToPromptDescription(schema);
    expect(description).toBe(
      '{\n  "name": string // user name,\n  "age": number\n}',
    );
  });

  it('should handle enums and arrays', () => {
    const schema = z.object({
      tags: z.array(z.enum(['a', 'b'])),
    });
    const description = zodSchemaToPromptDescription(schema);
    expect(description).toBe('{\n  "tags": ["a" | "b"]\n}');
  });
});
