import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganizationMemberDto } from './create-organization-member.dto';

export class UpdateOrganizationMemberDto extends PartialType(
  CreateOrganizationMemberDto,
) {}
