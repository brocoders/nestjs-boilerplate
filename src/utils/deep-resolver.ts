async function deepResolvePromises(input: unknown): Promise<unknown> {
  if (input instanceof Promise) {
    return await input;
  }

  if (Array.isArray(input)) {
    const resolvedArray = await Promise.all(input.map(deepResolvePromises));
    return resolvedArray;
  }

  if (input instanceof Date) {
    return input;
  }

  if (typeof input === 'object' && input !== null) {
    const resolvedObject: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input)) {
      resolvedObject[key] = await deepResolvePromises(value);
    }

    return resolvedObject;
  }

  return input;
}

export default deepResolvePromises;
