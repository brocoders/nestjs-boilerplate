import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as _ from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rule } from '../../entities/rule.entity';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import * as safeRegex from 'safe-regex';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
  ) {}

  private validateThresholds(dto: CreateRuleDto | UpdateRuleDto) {
    if (dto.similarityThreshold !== undefined && dto.deviationAllowedPct !== undefined) {
      throw new BadRequestException('similarityThreshold and deviationAllowedPct cannot both be set');
    }
    if (dto.pattern) {
      try {
        // Validate regex safety before constructing
        if (!safeRegex(dto.pattern)) {
          throw new Error('pattern is potentially unsafe and may be vulnerable to ReDoS');
        }
        // eslint-disable-next-line no-new
        new RegExp(dto.pattern);
      } catch (e) {
        throw new BadRequestException(`pattern is not a valid or safe regex: ${e.message}`);
      }
    }
  }

  async create(dto: CreateRuleDto): Promise<Rule> {
    this.validateThresholds(dto);
    const rule = this.ruleRepository.create(dto);
    return this.ruleRepository.save(rule);
  }

  async findAll(): Promise<Rule[]> {
    return this.ruleRepository.find();
  }

  async findOne(id: string): Promise<Rule> {
    const rule = await this.ruleRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }
    return rule;
  }

  async update(id: string, dto: UpdateRuleDto): Promise<Rule> {
    const rule = await this.findOne(id);
    this.validateThresholds(dto);
    Object.assign(rule, dto);
    return this.ruleRepository.save(rule);
  }

  async remove(id: string): Promise<void> {
    const rule = await this.findOne(id);
    await this.ruleRepository.remove(rule);
  }
}
