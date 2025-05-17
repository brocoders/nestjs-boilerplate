import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandardClause } from './entities/standard-clause.entity';
import { CreateStandardClauseDto } from './dto/create-standard-clause.dto';
import { UpdateStandardClauseDto } from './dto/update-standard-clause.dto';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(StandardClause)
    private standardClauseRepository: Repository<StandardClause>,
  ) {}

  async create(createStandardClauseDto: CreateStandardClauseDto): Promise<StandardClause> {
    const clause = this.standardClauseRepository.create({
      isActive: true,
      ...createStandardClauseDto,
    });
    return this.standardClauseRepository.save(clause);
  }

  async findAll(): Promise<StandardClause[]> {
    return this.standardClauseRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<StandardClause> {
    const clause = await this.standardClauseRepository.findOne({
      where: { id, isActive: true },
    });
    
    if (!clause) {
      throw new NotFoundException(`Standard clause with ID "${id}" not found`);
    }
    
    return clause;
  }

  async update(id: string, updateStandardClauseDto: UpdateStandardClauseDto): Promise<StandardClause> {
    const clause = await this.findOne(id);
    Object.assign(clause, updateStandardClauseDto);
    return this.standardClauseRepository.save(clause);
  }

  async remove(id: string): Promise<void> {
    const clause = await this.findOne(id);
    clause.isActive = false;
    await this.standardClauseRepository.save(clause);
  }

  async findByType(type: string): Promise<StandardClause[]> {
    return this.standardClauseRepository.find({
      where: { type, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findByJurisdiction(jurisdiction: string): Promise<StandardClause[]> {
    return this.standardClauseRepository.find({
      where: { jurisdiction, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }
} 