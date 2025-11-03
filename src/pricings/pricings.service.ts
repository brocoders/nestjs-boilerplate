import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pricing } from './domain/pricing.entity';
import { CreatePricingDto } from './dto/create-pricing.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';
import { PricingResponseDto } from './dto/pricing-response.dto';

@Injectable()
export class PricingsService {
  constructor(
    @InjectRepository(Pricing)
    private readonly pricingRepository: Repository<Pricing>,
  ) {}

  async create(
    createPricingDto: CreatePricingDto,
  ): Promise<PricingResponseDto> {
    const pricing = this.pricingRepository.create(createPricingDto);
    const savedPricing = await this.pricingRepository.save(pricing);
    return this.mapToResponseDto(savedPricing);
  }

  async findAll(): Promise<PricingResponseDto[]> {
    const pricings = await this.pricingRepository.find({
      order: { createdAt: 'DESC' },
    });
    return pricings.map((pricing) => this.mapToResponseDto(pricing));
  }

  async findOne(id: string): Promise<PricingResponseDto> {
    const pricing = await this.pricingRepository.findOne({ where: { id } });
    if (!pricing) {
      throw new Error('Pricing not found');
    }
    return this.mapToResponseDto(pricing);
  }

  async update(
    id: string,
    updatePricingDto: UpdatePricingDto,
  ): Promise<PricingResponseDto> {
    await this.pricingRepository.update(id, updatePricingDto);
    const updatedPricing = await this.findOne(id);
    return updatedPricing;
  }

  async remove(id: string): Promise<void> {
    const result = await this.pricingRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Pricing not found');
    }
  }

  private mapToResponseDto(pricing: Pricing): PricingResponseDto {
    return {
      id: pricing.id,
      title: pricing.title,
      price: pricing.price,
      features: pricing.features,
      createdAt: pricing.createdAt,
      updatedAt: pricing.updatedAt,
    };
  }
}
