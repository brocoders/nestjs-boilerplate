export function mapEnvType<T>(
  input: string | undefined,
  mapping: Record<string, T>,
  defaultValue: T,
): T {
  if (!input) return defaultValue;
  const v = input.trim().toLowerCase();
  return mapping[v] ?? defaultValue;
}
