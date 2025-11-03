import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OrganizationMembersService } from './organization-members.service';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto';
import { OrganizationMemberResponseDto } from './dto/organization-member-response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Organization Members')
@Controller('organization-members')
export class OrganizationMembersController {
  constructor(
    private readonly organizationMembersService: OrganizationMembersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new organization member' })
  @ApiResponse({
    status: 201,
    description: 'Organization member created successfully',
    type: OrganizationMemberResponseDto,
  })
  create(
    @Body() createOrganizationMemberDto: CreateOrganizationMemberDto,
  ): Promise<OrganizationMemberResponseDto> {
    return this.organizationMembersService.create(createOrganizationMemberDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all organization members' })
  @ApiResponse({
    status: 200,
    description: 'List of organization members',
    type: [OrganizationMemberResponseDto],
  })
  findAll(): Promise<OrganizationMemberResponseDto[]> {
    return this.organizationMembersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an organization member by ID' })
  @ApiResponse({
    status: 200,
    description: 'Organization member found',
    type: OrganizationMemberResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Organization member not found' })
  findOne(@Param('id') id: string): Promise<OrganizationMemberResponseDto> {
    return this.organizationMembersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update an organization member' })
  @ApiResponse({
    status: 200,
    description: 'Organization member updated successfully',
    type: OrganizationMemberResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateOrganizationMemberDto: UpdateOrganizationMemberDto,
  ): Promise<OrganizationMemberResponseDto> {
    return this.organizationMembersService.update(
      id,
      updateOrganizationMemberDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete an organization member' })
  @ApiResponse({
    status: 200,
    description: 'Organization member deleted successfully',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.organizationMembersService.remove(id);
  }
}
