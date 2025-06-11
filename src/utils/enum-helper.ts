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
