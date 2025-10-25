import 'reflect-metadata';
export const META_ENABLED_CONFIG_PATHS = 'toggleable:configPaths';
export const META_SERVICE_TOKENS = 'toggleable:serviceTokens';
export const META_CONFIG_MODE = 'toggleable:configMode';
export type ConfigMode = 'all' | 'any';

/**
 * Use to declare config path(s) that must be true to allow a request.
 * Example: @RequireEnabled('cmc.enable') or @RequireEnabled(['cmc.enable','http.enabled'], { mode: 'all' })
 */
export function RequireEnabled(
  paths: string | string[],
  options?: { mode?: ConfigMode },
): ClassDecorator & MethodDecorator {
  const list = Array.isArray(paths) ? paths : [paths];
  const mode = options?.mode ?? 'all';
  return (
    target: any,
    _propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    const metaTarget = descriptor?.value ?? target;
    Reflect.defineMetadata(META_ENABLED_CONFIG_PATHS, list, metaTarget);
    Reflect.defineMetadata(META_CONFIG_MODE, mode, metaTarget);
  };
}

/**
 * Use to declare one or more service providers that must be "ready".
 * The guard will resolve each and call ensureReady() if it exists,
 * otherwise fall back to checkIfEnabled().
 */
export function RequireServiceReady(
  tokens: any | any[],
): ClassDecorator & MethodDecorator {
  const list = Array.isArray(tokens) ? tokens : [tokens];
  return (
    target: any,
    _propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    const metaTarget = descriptor?.value ?? target;
    Reflect.defineMetadata(META_SERVICE_TOKENS, list, metaTarget);
  };
}
