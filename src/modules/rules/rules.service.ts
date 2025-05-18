import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rule } from '../../entities/rule.entity';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule)
    private readonly ruleRepository: Repository<Rule>,
  ) {}

  private validateThresholds(dto: CreateRuleDto | UpdateRuleDto) {
    if (
      dto.similarityThreshold !== undefined &&
      dto.deviationAllowedPct !== undefined
    ) {
      throw new BadRequestException(
        'similarityThreshold and deviationAllowedPct cannot both be set',
      );
    }
    // pattern validation is now handled by the IsValidRegex decorator at the DTO level
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
