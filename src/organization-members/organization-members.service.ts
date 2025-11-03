import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationMember } from './domain/organization-member.entity';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto';
import { OrganizationMemberResponseDto } from './dto/organization-member-response.dto';

@Injectable()
export class OrganizationMembersService {
  constructor(
    @InjectRepository(OrganizationMember)
    private readonly organizationMemberRepository: Repository<OrganizationMember>,
  ) {}

  async create(
    createOrganizationMemberDto: CreateOrganizationMemberDto,
  ): Promise<OrganizationMemberResponseDto> {
    const organizationMember = this.organizationMemberRepository.create(
      createOrganizationMemberDto,
    );
    const savedOrganizationMember =
      await this.organizationMemberRepository.save(organizationMember);
    return this.mapToResponseDto(savedOrganizationMember);
  }

  async findAll(): Promise<OrganizationMemberResponseDto[]> {
    const organizationMembers = await this.organizationMemberRepository.find({
      order: { createdAt: 'DESC' },
    });
    return organizationMembers.map((member) => this.mapToResponseDto(member));
  }

  async findOne(id: string): Promise<OrganizationMemberResponseDto> {
    const organizationMember = await this.organizationMemberRepository.findOne({
      where: { id },
    });
    if (!organizationMember) {
      throw new Error('Organization member not found');
    }
    return this.mapToResponseDto(organizationMember);
  }

  async update(
    id: string,
    updateOrganizationMemberDto: UpdateOrganizationMemberDto,
  ): Promise<OrganizationMemberResponseDto> {
    await this.organizationMemberRepository.update(
      id,
      updateOrganizationMemberDto,
    );
    const updatedOrganizationMember = await this.findOne(id);
    return updatedOrganizationMember;
  }

  async remove(id: string): Promise<void> {
    const result = await this.organizationMemberRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Organization member not found');
    }
  }

  private mapToResponseDto(
    organizationMember: OrganizationMember,
  ): OrganizationMemberResponseDto {
    return {
      id: organizationMember.id,
      image: organizationMember.image,
      title: organizationMember.title,
      description: organizationMember.description,
      createdAt: organizationMember.createdAt,
      updatedAt: organizationMember.updatedAt,
    };
  }
}
