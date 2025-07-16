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
