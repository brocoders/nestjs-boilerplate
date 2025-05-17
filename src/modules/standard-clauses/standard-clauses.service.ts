import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandardClause } from '../../entities/standard-clause.entity';
import { CreateStandardClauseDto } from './dto/create-standard-clause.dto';
import { UpdateStandardClauseDto } from './dto/update-standard-clause.dto';

@Injectable()
export class StandardClausesService {
  constructor(
    @InjectRepository(StandardClause)
    private standardClauseRepository: Repository<StandardClause>,
  ) {}

  async create(createStandardClauseDto: CreateStandardClauseDto): Promise<StandardClause> {
    const standardClause = this.standardClauseRepository.create(createStandardClauseDto);
    return this.standardClauseRepository.save(standardClause);
  }

  async findAll(): Promise<StandardClause[]> {
    return this.standardClauseRepository.find();
  }

  async findOne(id: number): Promise<StandardClause> {
    const standardClause = await this.standardClauseRepository.findOne({ where: { id } });
    if (!standardClause) {
      throw new NotFoundException(`Standard clause with ID ${id} not found`);
    }
    return standardClause;
  }

  async findByType(type: string): Promise<StandardClause[]> {
    return this.standardClauseRepository.find({ where: { type } });
  }

  async findByContractType(contractType: string): Promise<StandardClause[]> {
    return this.standardClauseRepository.find({ where: { contractType } });
  }

  async update(id: number, updateStandardClauseDto: UpdateStandardClauseDto): Promise<StandardClause> {
    const standardClause = await this.findOne(id);
    Object.assign(standardClause, updateStandardClauseDto);
    return this.standardClauseRepository.save(standardClause);
  }

  async remove(id: number): Promise<void> {
    const result = await this.standardClauseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Standard clause with ID ${id} not found`);
    }
  }
} 