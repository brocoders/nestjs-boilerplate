import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandardClause } from './entities/standard-clause.entity';
import { CreateStandardClauseDto } from './dto/create-standard-clause.dto';
import { UpdateStandardClauseDto } from './dto/update-standard-clause.dto';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(StandardClause)
    private readonly standardClauseRepository: Repository<StandardClause>,
  ) {}

  async create(createStandardClauseDto: CreateStandardClauseDto): Promise<StandardClause> {
    const standardClause = this.standardClauseRepository.create({
      ...createStandardClauseDto,
      isActive: true,
      isLatest: true,
      version: '1.0.0',
      nextVersions: [],
    });
    return this.standardClauseRepository.save(standardClause);
  }

  async findAll(): Promise<StandardClause[]> {
    return this.standardClauseRepository.find({
      where: { isActive: true, isLatest: true },
    });
  }

  async findOne(id: string): Promise<StandardClause> {
    const standardClause = await this.standardClauseRepository.findOne({
      where: { id, isActive: true },
    });
    if (!standardClause) {
      throw new NotFoundException(`Standard clause with ID ${id} not found`);
    }
    return standardClause;
  }

  async update(id: string, updateStandardClauseDto: UpdateStandardClauseDto): Promise<StandardClause> {
    const standardClause = await this.findOne(id);
    
    // If there are significant changes, create a new version
    if (this.hasSignificantChanges(standardClause, updateStandardClauseDto)) {
      // Mark current version as not latest
      standardClause.isLatest = false;
      await this.standardClauseRepository.save(standardClause);

      // Create new version
      const newVersion = this.standardClauseRepository.create({
        ...updateStandardClauseDto,
        previousVersion: standardClause,
        isActive: true,
        isLatest: true,
        version: this.incrementVersion(standardClause.version),
        nextVersions: [],
      });
      return this.standardClauseRepository.save(newVersion);
    }

    // Otherwise, update existing version
    Object.assign(standardClause, updateStandardClauseDto);
    return this.standardClauseRepository.save(standardClause);
  }

  async remove(id: string): Promise<void> {
    const standardClause = await this.findOne(id);
    standardClause.isActive = false;
    await this.standardClauseRepository.save(standardClause);
  }

  async findByType(type: string): Promise<StandardClause[]> {
    return this.standardClauseRepository.find({
      where: { type, isActive: true, isLatest: true },
    });
  }

  async findByJurisdiction(jurisdiction: string): Promise<StandardClause[]> {
    return this.standardClauseRepository.find({
      where: { jurisdiction, isActive: true, isLatest: true },
    });
  }

  async compareClause(clauseText: string, templateId: string): Promise<{
    similarity: number;
    isCompliant: boolean;
    deviations: any[];
  }> {
    const template = await this.findOne(templateId);
    const similarity = this.calculateSimilarity(clauseText, template.text);
    const deviations = this.checkDeviations(clauseText, template);
    const isCompliant = this.isCompliantWithDeviations(deviations, template.allowedDeviations || []);

    return {
      similarity,
      isCompliant,
      deviations,
    };
  }

  async getTemplateVersions(id: string): Promise<StandardClause[]> {
    const currentVersion = await this.findOne(id);
    const versions: StandardClause[] = [currentVersion];
    let previousVersion = currentVersion.previousVersion;

    while (previousVersion) {
      versions.push(previousVersion);
      previousVersion = previousVersion.previousVersion;
    }

    return versions.reverse();
  }

  private hasSignificantChanges(current: StandardClause, update: UpdateStandardClauseDto): boolean {
    return (
      update.text !== current.text ||
      JSON.stringify(update.allowedDeviations) !== JSON.stringify(current.allowedDeviations) ||
      update.type !== current.type ||
      update.jurisdiction !== current.jurisdiction
    );
  }

  private incrementVersion(version: string): string {
    const [major, minor, patch] = version.split('.').map(Number);
    return `${major}.${minor}.${patch + 1}`;
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // Simple implementation - can be enhanced with more sophisticated algorithms
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  }

  private checkDeviations(clauseText: string, template: StandardClause): any[] {
    // Implementation for checking deviations
    // This is a placeholder - actual implementation would depend on specific requirements
    return [];
  }

  private isCompliantWithDeviations(deviations: any[], allowedDeviations: any[]): boolean {
    // Implementation for checking compliance with allowed deviations
    // This is a placeholder - actual implementation would depend on specific requirements
    return true;
  }
} 