import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { getEnumErrorMessage, isValidEnumValue } from '../helpers/enum.helper';
import { RoleGroupsDict } from '../types/const.type';
import { RoleEnum } from '../../roles/roles.enum';

@Injectable()
export class ValidateEnumTransformer implements PipeTransform {
  constructor(
    private readonly enumType: object,
    private readonly fieldName: string,
  ) {}

  transform(value: any) {
    if (!isValidEnumValue(this.enumType, value)) {
      throw new BadRequestException(
        getEnumErrorMessage(this.enumType, this.fieldName),
      );
    }
    return value;
  }
}

// Helper to get serialization groups from a list of roles
export function RoleGroups(roles: RoleEnum[]): { groups: string[] } {
  return {
    groups: roles.map((role) => {
      const group = RoleGroupsDict[role];
      if (!group) {
        throw new Error(`Unknown RoleEnum value: ${role}`);
      }
      return group;
    }),
  };
}
