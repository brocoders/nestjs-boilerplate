import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../../../domain/category';
import { CategoryAbstractRepository } from '../../category.abstract.repository';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class CategoryRelationalRepository implements CategoryAbstractRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
  ) {}

  async findAll(opts: { activeOnly: boolean }): Promise<Category[]> {
    const rows = await this.repo.find({
      where: opts.activeOnly ? { isActive: true } : undefined,
      order: { position: 'ASC', slug: 'ASC' },
    });
    return rows.map(CategoryMapper.toDomain);
  }

  async findById(id: string): Promise<Category | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? CategoryMapper.toDomain(row) : null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const row = await this.repo.findOne({ where: { slug } });
    return row ? CategoryMapper.toDomain(row) : null;
  }

  async create(
    input: Omit<Category, 'createdAt' | 'updatedAt'>,
  ): Promise<Category> {
    const saved = await this.repo.save(this.repo.create(input));
    return CategoryMapper.toDomain(saved);
  }

  async update(id: string, patch: Partial<Category>): Promise<Category> {
    await this.repo.update({ id }, patch);
    const row = await this.repo.findOneOrFail({ where: { id } });
    return CategoryMapper.toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete({ id });
  }
}
