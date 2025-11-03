import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feature } from './domain/feature.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FeatureResponseDto } from './dto/feature-response.dto';

@Injectable()
export class FeaturesService {
  constructor(
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
  ) {}

  async create(
    createFeatureDto: CreateFeatureDto,
  ): Promise<FeatureResponseDto> {
    const feature = this.featureRepository.create(createFeatureDto);
    const savedFeature = await this.featureRepository.save(feature);
    return this.mapToResponseDto(savedFeature);
  }

  async findAll(): Promise<FeatureResponseDto[]> {
    const features = await this.featureRepository.find({
      order: { createdAt: 'DESC' },
    });
    return features.map((feature) => this.mapToResponseDto(feature));
  }

  async findOne(id: string): Promise<FeatureResponseDto> {
    const feature = await this.featureRepository.findOne({ where: { id } });
    if (!feature) {
      throw new Error('Feature not found');
    }
    return this.mapToResponseDto(feature);
  }

  async update(
    id: string,
    updateFeatureDto: UpdateFeatureDto,
  ): Promise<FeatureResponseDto> {
    await this.featureRepository.update(id, updateFeatureDto);
    const updatedFeature = await this.findOne(id);
    return updatedFeature;
  }

  async remove(id: string): Promise<void> {
    const result = await this.featureRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Feature not found');
    }
  }

  private mapToResponseDto(feature: Feature): FeatureResponseDto {
    return {
      id: feature.id,
      title: feature.title,
      description: feature.description,
      createdAt: feature.createdAt,
      updatedAt: feature.updatedAt,
    };
  }
}
