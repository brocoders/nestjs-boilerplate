import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationMemberSeedService } from './organization-member-seed.service';
import { OrganizationMember } from '../../../../organization-members/domain/organization-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationMember])],
  providers: [OrganizationMemberSeedService],
  exports: [OrganizationMemberSeedService],
})
export class OrganizationMemberSeedModule {}
