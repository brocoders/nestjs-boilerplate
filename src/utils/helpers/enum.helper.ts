export function coerceEnumValue(input: unknown): string | number | undefined {
  if (input === null || input === undefined) return undefined;
  if (typeof input === 'string' || typeof input === 'number') return input;
  if (typeof input === 'object') {
    const maybeId = (input as any)?.id;
    if (typeof maybeId === 'string' || typeof maybeId === 'number')
      return maybeId;
  }
  return undefined;
}

export function getEnumErrorMessage(
  enumType: object,
  fieldName: string,
): string {
  const validValues = Object.values(enumType).join(', ');
  return `${fieldName} must be one of: ${validValues}`;
}

export function isValidEnumValue(enumType: object, value: string): boolean {
  return Object.values(enumType).includes(value);
}

// Dynamically create RoleGroups from the enum
export function createEnumNameMap<T extends Record<string, string | number>>(
  enumType: T,
): Record<T[keyof T], string> {
  return (
    Object.entries(enumType)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_key, value]) => typeof value === 'number')
      .reduce(
        (acc, [key, value]) => {
          acc[value as T[keyof T]] = key.toLowerCase();
          return acc;
        },
        {} as Record<T[keyof T], string>,
      )
  );
}

export function getEnumKeyByValue<T extends Record<string, string | number>>(
  enumType: T,
  value: string | number,
): string | undefined {
  return Object.keys(enumType).find((key) => enumType[key] === value);
}

export function getEnumText<T extends Record<string, string | number>>(
  enumType: T,
  value: unknown,
): string | undefined {
  const coerced = coerceEnumValue(value);
  if (coerced === undefined) return undefined;
  const key = getEnumKeyByValue(enumType, coerced);
  if (!key) return undefined;
  return key;
}

export function mapEnumToText<T extends Record<string, string | number>>(
  enumType: T,
): Record<T[keyof T], string> {
  const result = {} as Record<T[keyof T], string>;
  Object.values(enumType).forEach((value) => {
    const text = getEnumText(enumType, value);
    if (text !== undefined) {
      result[value as T[keyof T]] = text;
    }
  });
  return result;
}
