import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { Rule } from '../../entities/rule.entity';

@ApiTags('rules')
@Controller('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Get()
  @ApiOperation({ summary: 'List rules' })
  @ApiResponse({ status: 200, type: [Rule] })
  findAll() {
    return this.rulesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get rule by id' })
  @ApiResponse({ status: 200, type: Rule })
  findOne(@Param('id') id: string) {
    return this.rulesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create rule' })
  @ApiResponse({ status: 201, type: Rule })
  create(@Body() dto: CreateRuleDto) {
    return this.rulesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update rule' })
  @ApiResponse({ status: 200, type: Rule })
  update(@Param('id') id: string, @Body() dto: UpdateRuleDto) {
    return this.rulesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete rule' })
  @ApiResponse({ status: 200 })
  remove(@Param('id') id: string) {
    return this.rulesService.remove(id);
  }
}
