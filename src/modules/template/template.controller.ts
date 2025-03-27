import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TemplateService } from './template.service';
import { CreateStandardClauseDto } from './dto/create-standard-clause.dto';
import { UpdateStandardClauseDto } from './dto/update-standard-clause.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('templates')
@Controller('templates')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new standard clause template' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  create(@Body() createStandardClauseDto: CreateStandardClauseDto) {
    return this.templateService.create(createStandardClauseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all standard clause templates' })
  @ApiResponse({ status: 200, description: 'Return all templates' })
  findAll() {
    return this.templateService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a template by id' })
  @ApiResponse({ status: 200, description: 'Return the template' })
  findOne(@Param('id') id: string) {
    return this.templateService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a template' })
  @ApiResponse({ status: 200, description: 'Template updated successfully' })
  update(@Param('id') id: string, @Body() updateStandardClauseDto: UpdateStandardClauseDto) {
    return this.templateService.update(id, updateStandardClauseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a template' })
  @ApiResponse({ status: 200, description: 'Template deleted successfully' })
  remove(@Param('id') id: string) {
    return this.templateService.remove(id);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get templates by type' })
  @ApiResponse({ status: 200, description: 'Return templates of specified type' })
  findByType(@Param('type') type: string) {
    return this.templateService.findByType(type);
  }

  @Get('jurisdiction/:jurisdiction')
  @ApiOperation({ summary: 'Get templates by jurisdiction' })
  @ApiResponse({ status: 200, description: 'Return templates for specified jurisdiction' })
  findByJurisdiction(@Param('jurisdiction') jurisdiction: string) {
    return this.templateService.findByJurisdiction(jurisdiction);
  }

  @Post(':id/compare')
  @ApiOperation({ summary: 'Compare a clause with a template' })
  @ApiResponse({ status: 200, description: 'Comparison completed successfully' })
  compareClause(
    @Param('id') id: string,
    @Body('clauseText') clauseText: string,
  ) {
    return this.templateService.compareClause(clauseText, id);
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Get template versions' })
  @ApiResponse({ status: 200, description: 'Return template versions' })
  getTemplateVersions(@Param('id') id: string) {
    return this.templateService.getTemplateVersions(id);
  }
} 