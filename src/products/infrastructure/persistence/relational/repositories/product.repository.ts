import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Product, ProductStatus } from '../../../../domain/product';
import {
  FindAllResult,
  FindForPublicOptions,
  FindForVendorOptions,
  ProductAbstractRepository,
} from '../../product.abstract.repository';
import { ProductEntity } from '../entities/product.entity';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class ProductRelationalRepository implements ProductAbstractRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  async findForVendor(opts: FindForVendorOptions): Promise<FindAllResult> {
    const { vendorId, status, page, limit } = opts;
    const where: Record<string, unknown> = { vendorId };
    if (status) where.status = status;
    const [rows, total] = await this.repo.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data: rows.map(ProductMapper.toDomain), total };
  }

  async findForPublic(opts: FindForPublicOptions): Promise<FindAllResult> {
    const { region, categoryId, q, page, limit } = opts;
    const qb = this.repo
      .createQueryBuilder('p')
      .where('p.status = :status', { status: ProductStatus.ACTIVE });

    if (categoryId) {
      qb.andWhere('p.category_id = :categoryId', { categoryId });
    }

    if (region) {
      qb.andWhere(
        new Brackets((b) => {
          b.where('cardinality(p.supported_region_ids) = 0').orWhere(
            ':region = ANY(p.supported_region_ids)',
            { region },
          );
        }),
      );
    }

    if (q && q.trim().length > 0) {
      const term = `%${q.trim()}%`;
      qb.andWhere(
        new Brackets((b) => {
          b.where("p.name_translations->>'en' ILIKE :term", { term }).orWhere(
            "p.name_translations->>'ar' ILIKE :term",
            { term },
          );
        }),
      );
    }

    qb.orderBy('p.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [rows, total] = await qb.getManyAndCount();
    return { data: rows.map(ProductMapper.toDomain), total };
  }

  async findById(id: string): Promise<Product | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? ProductMapper.toDomain(row) : null;
  }

  async findByVendorIdAndSlug(
    vendorId: string,
    slug: string,
  ): Promise<Product | null> {
    const row = await this.repo.findOne({ where: { vendorId, slug } });
    return row ? ProductMapper.toDomain(row) : null;
  }

  async create(
    input: Omit<Product, 'createdAt' | 'updatedAt'>,
  ): Promise<Product> {
    const entity = this.repo.create(input);
    const saved = await this.repo.save(entity);
    return ProductMapper.toDomain(saved);
  }

  async update(id: string, patch: Partial<Product>): Promise<Product> {
    await this.repo.update({ id }, patch);
    const row = await this.repo.findOneOrFail({ where: { id } });
    return ProductMapper.toDomain(row);
  }

  async setStatus(id: string, status: ProductStatus): Promise<Product> {
    return this.update(id, { status });
  }
}
