import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StandardClausesService } from './standard-clauses.service';
import { CreateStandardClauseDto } from './dto/create-standard-clause.dto';
import { StandardClause } from '../../entities/standard-clause.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UpdateStandardClauseDto } from './dto/update-standard-clause.dto';

@ApiTags('standard-clauses')
@Controller('standard-clauses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StandardClausesController {
  constructor(private readonly standardClausesService: StandardClausesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new standard clause' })
  @ApiResponse({ status: 201, description: 'The standard clause has been successfully created.', type: StandardClause })
  create(@Body() createStandardClauseDto: CreateStandardClauseDto): Promise<StandardClause> {
    return this.standardClausesService.create(createStandardClauseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all standard clauses' })
  @ApiResponse({ status: 200, description: 'Return all standard clauses.', type: [StandardClause] })
  findAll(): Promise<StandardClause[]> {
    return this.standardClausesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a standard clause by id' })
  @ApiResponse({ status: 200, description: 'Return the standard clause.', type: StandardClause })
  @ApiResponse({ status: 404, description: 'Standard clause not found.' })
  findOne(@Param('id') id: string): Promise<StandardClause> {
    return this.standardClausesService.findOne(+id);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get standard clauses by type' })
  @ApiResponse({ status: 200, description: 'Return the standard clauses of specified type.', type: [StandardClause] })
  findByType(@Param('type') type: string): Promise<StandardClause[]> {
    return this.standardClausesService.findByType(type);
  }

  @Get('contract-type/:contractType')
  @ApiOperation({ summary: 'Get standard clauses by contract type' })
  @ApiResponse({ status: 200, description: 'Return clauses for the contract type.', type: [StandardClause] })
  findByContractType(@Param('contractType') contractType: string): Promise<StandardClause[]> {
    return this.standardClausesService.findByContractType(contractType);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a standard clause' })
  @ApiResponse({ status: 200, description: 'The standard clause has been successfully updated.', type: StandardClause })
  @ApiResponse({ status: 404, description: 'Standard clause not found.' })
  update(
    @Param('id') id: string,
    @Body() updateStandardClauseDto: UpdateStandardClauseDto,
  ): Promise<StandardClause> {
    return this.standardClausesService.update(+id, updateStandardClauseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a standard clause' })
  @ApiResponse({ status: 200, description: 'The standard clause has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Standard clause not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.standardClausesService.remove(+id);
  }
} 