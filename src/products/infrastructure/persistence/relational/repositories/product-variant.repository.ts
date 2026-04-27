import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { uuidv7Generate } from '../../../../../utils/uuid';
import { ProductOptionType } from '../../../../domain/product-option-type';
import { ProductOptionValue } from '../../../../domain/product-option-value';
import { ProductVariant } from '../../../../domain/product-variant';
import { VariantPrice } from '../../../../domain/variant-price';
import { VariantStock } from '../../../../domain/variant-stock';
import {
  CreateOptionTypeInput,
  CreateOptionValueInput,
  CreateVariantInput,
  ProductVariantAbstractRepository,
  UpsertVariantPriceInput,
  UpsertVariantStockInput,
} from '../../product-variant.abstract.repository';
import { ProductOptionTypeEntity } from '../entities/product-option-type.entity';
import { ProductOptionValueEntity } from '../entities/product-option-value.entity';
import { ProductVariantEntity } from '../entities/product-variant.entity';
import { ProductVariantOptionValueEntity } from '../entities/product-variant-option-value.entity';
import { VariantPriceEntity } from '../entities/variant-price.entity';
import { VariantStockEntity } from '../entities/variant-stock.entity';
import { ProductOptionTypeMapper } from '../mappers/product-option-type.mapper';
import { ProductOptionValueMapper } from '../mappers/product-option-value.mapper';
import { ProductVariantMapper } from '../mappers/product-variant.mapper';
import { VariantPriceMapper } from '../mappers/variant-price.mapper';
import { VariantStockMapper } from '../mappers/variant-stock.mapper';

@Injectable()
export class ProductVariantRelationalRepository implements ProductVariantAbstractRepository {
  constructor(
    @InjectRepository(ProductOptionTypeEntity)
    private readonly optionTypeRepo: Repository<ProductOptionTypeEntity>,
    @InjectRepository(ProductOptionValueEntity)
    private readonly optionValueRepo: Repository<ProductOptionValueEntity>,
    @InjectRepository(ProductVariantEntity)
    private readonly variantRepo: Repository<ProductVariantEntity>,
    @InjectRepository(ProductVariantOptionValueEntity)
    private readonly variantOptionValueRepo: Repository<ProductVariantOptionValueEntity>,
    @InjectRepository(VariantPriceEntity)
    private readonly priceRepo: Repository<VariantPriceEntity>,
    @InjectRepository(VariantStockEntity)
    private readonly stockRepo: Repository<VariantStockEntity>,
  ) {}

  async clearForProduct(productId: string): Promise<void> {
    // Variants cascade-delete their option-value links, prices, and stock.
    // Option types/values cascade-delete from the product side too,
    // but variant rows have FKs onto option_type_id / option_value_id, so
    // delete variants first, then option types (which take their values).
    await this.variantRepo.delete({ productId });
    await this.optionTypeRepo.delete({ productId });
  }

  async createOptionTypes(
    inputs: CreateOptionTypeInput[],
  ): Promise<ProductOptionType[]> {
    if (inputs.length === 0) return [];
    const entities = inputs.map((i) => this.optionTypeRepo.create(i));
    const saved = await this.optionTypeRepo.save(entities);
    return saved.map((e) => {
      e.values = [];
      return ProductOptionTypeMapper.toDomain(e);
    });
  }

  async createOptionValues(
    inputs: CreateOptionValueInput[],
  ): Promise<ProductOptionValue[]> {
    if (inputs.length === 0) return [];
    const entities = inputs.map((i) =>
      this.optionValueRepo.create({
        ...i,
        swatchColor: i.swatchColor ?? null,
      }),
    );
    const saved = await this.optionValueRepo.save(entities);
    return saved.map(ProductOptionValueMapper.toDomain);
  }

  async createVariants(
    inputs: CreateVariantInput[],
  ): Promise<ProductVariant[]> {
    if (inputs.length === 0) return [];
    const variantEntities = inputs.map((i) =>
      this.variantRepo.create({
        id: i.id,
        productId: i.productId,
        sku: i.sku,
        weightGrams: i.weightGrams,
        isActive: i.isActive,
      }),
    );
    const savedVariants = await this.variantRepo.save(variantEntities);

    const linkRows: ProductVariantOptionValueEntity[] = [];
    for (const i of inputs) {
      for (const ref of i.optionValueIds) {
        linkRows.push(
          this.variantOptionValueRepo.create({
            variantId: i.id,
            optionTypeId: ref.optionTypeId,
            optionValueId: ref.optionValueId,
          }),
        );
      }
    }
    if (linkRows.length > 0) {
      await this.variantOptionValueRepo.save(linkRows);
    }

    return this.findVariantsByIds(savedVariants.map((v) => v.id));
  }

  private async findVariantsByIds(ids: string[]): Promise<ProductVariant[]> {
    if (ids.length === 0) return [];
    const rows = await this.variantRepo.find({
      where: { id: In(ids) },
      relations: { optionValues: true, prices: true, stock: true },
    });
    // Preserve insertion order
    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids
      .map((id) => byId.get(id))
      .filter((r): r is ProductVariantEntity => !!r)
      .map(ProductVariantMapper.toDomain);
  }

  async findVariantById(variantId: string): Promise<ProductVariant | null> {
    const row = await this.variantRepo.findOne({
      where: { id: variantId },
      relations: { optionValues: true, prices: true, stock: true },
    });
    return row ? ProductVariantMapper.toDomain(row) : null;
  }

  async findVariantsForProduct(productId: string): Promise<ProductVariant[]> {
    const rows = await this.variantRepo.find({
      where: { productId },
      relations: { optionValues: true, prices: true, stock: true },
      order: { createdAt: 'ASC' },
    });
    return rows.map(ProductVariantMapper.toDomain);
  }

  async findOptionTypesForProduct(
    productId: string,
  ): Promise<ProductOptionType[]> {
    const rows = await this.optionTypeRepo.find({
      where: { productId },
      relations: { values: true },
      order: { position: 'ASC' },
    });
    return rows.map(ProductOptionTypeMapper.toDomain);
  }

  async findActiveVariantsWithRegionPrice(
    productId: string,
    regionId: string,
  ): Promise<ProductVariant[]> {
    // Pull variants + their option-value links; prices filtered to region.
    const rows = await this.variantRepo
      .createQueryBuilder('v')
      .leftJoinAndSelect('v.optionValues', 'ov')
      .leftJoinAndSelect('v.prices', 'p', 'p.region_id = :regionId', {
        regionId,
      })
      .leftJoinAndSelect('v.stock', 's')
      .where('v.product_id = :productId', { productId })
      .andWhere('v.is_active = true')
      .orderBy('v.created_at', 'ASC')
      .getMany();

    return rows
      .filter((r) => (r.prices?.length ?? 0) > 0)
      .filter((r) => (r.stock?.quantity ?? 0) > 0)
      .map(ProductVariantMapper.toDomain);
  }

  async upsertVariantPrice(
    input: UpsertVariantPriceInput,
  ): Promise<VariantPrice> {
    const existing = await this.priceRepo.findOne({
      where: { variantId: input.variantId, regionId: input.regionId },
    });
    if (existing) {
      existing.currencyCode = input.currencyCode;
      existing.priceMinorUnits = input.priceMinorUnits;
      existing.compareAtPriceMinorUnits =
        input.compareAtPriceMinorUnits ?? null;
      const saved = await this.priceRepo.save(existing);
      return VariantPriceMapper.toDomain(saved);
    }
    const created = this.priceRepo.create({
      id: uuidv7Generate(),
      variantId: input.variantId,
      regionId: input.regionId,
      currencyCode: input.currencyCode,
      priceMinorUnits: input.priceMinorUnits,
      compareAtPriceMinorUnits: input.compareAtPriceMinorUnits ?? null,
    });
    const saved = await this.priceRepo.save(created);
    return VariantPriceMapper.toDomain(saved);
  }

  async upsertVariantStock(
    input: UpsertVariantStockInput,
  ): Promise<VariantStock> {
    const existing = await this.stockRepo.findOne({
      where: { variantId: input.variantId },
    });
    if (existing) {
      existing.quantity = input.quantity;
      const saved = await this.stockRepo.save(existing);
      return VariantStockMapper.toDomain(saved);
    }
    const created = this.stockRepo.create({
      variantId: input.variantId,
      quantity: input.quantity,
      reservedQuantity: 0,
    });
    const saved = await this.stockRepo.save(created);
    return VariantStockMapper.toDomain(saved);
  }
}
