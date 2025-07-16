import { plainToInstance } from 'class-transformer';
import { RoleEnum } from '../../roles/roles.enum';
import { RoleGroupsDict } from '../types/const.type';
/**
 * For single object transformation using role-based group serialization
 */
export function GroupPlainToInstance<T, V>(
  cls: new () => T,
  data: V,
  roles: RoleEnum[] = [],
): T {
  const groups = roles.map((role) => RoleGroupsDict[role]);
  return plainToInstance(cls, data, { groups });
}

/**
 * For array of objects transformation using role-based group serialization
 */
export function GroupPlainToInstances<T, V>(
  cls: new () => T,
  data: V[],
  roles: RoleEnum[] = [],
): T[] {
  const groups = roles.map((role) => RoleGroupsDict[role]);
  return plainToInstance(cls, data, { groups });
}
