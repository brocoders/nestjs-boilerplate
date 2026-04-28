import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { uuidv7Generate } from '../utils/uuid';
import { Category } from './domain/category';
import { CategoryAbstractRepository } from './infrastructure/persistence/category.abstract.repository';

export interface CreateCategoryInput {
  parentId?: string | null;
  slug: string;
  nameTranslations: Record<string, string>;
  icon?: string | null;
  position?: number;
}

export interface UpdateCategoryInput {
  parentId?: string | null;
  slug?: string;
  nameTranslations?: Record<string, string>;
  icon?: string | null;
  position?: number;
  isActive?: boolean;
}

@Injectable()
export class CategoriesService {
  constructor(private readonly repo: CategoryAbstractRepository) {}

  list(activeOnly: boolean): Promise<Category[]> {
    return this.repo.findAll({ activeOnly });
  }

  async getBySlug(slug: string): Promise<Category> {
    const c = await this.repo.findBySlug(slug);
    if (!c) throw new NotFoundException('Category not found');
    return c;
  }

  async getById(id: string): Promise<Category> {
    const c = await this.repo.findById(id);
    if (!c) throw new NotFoundException('Category not found');
    return c;
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const existing = await this.repo.findBySlug(input.slug);
    if (existing) throw new ConflictException('Slug already in use');
    if (input.parentId) {
      const parent = await this.repo.findById(input.parentId);
      if (!parent) throw new NotFoundException('Parent category not found');
    }
    return this.repo.create({
      id: uuidv7Generate(),
      parentId: input.parentId ?? null,
      slug: input.slug,
      nameTranslations: input.nameTranslations,
      icon: input.icon ?? null,
      position: input.position ?? 0,
      isActive: true,
    });
  }

  async update(id: string, patch: UpdateCategoryInput): Promise<Category> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Category not found');

    if (patch.slug && patch.slug !== existing.slug) {
      const conflict = await this.repo.findBySlug(patch.slug);
      if (conflict && conflict.id !== id) {
        throw new ConflictException('Slug already in use');
      }
    }

    if (patch.parentId !== undefined && patch.parentId !== null) {
      if (patch.parentId === id) {
        throw new ConflictException('Category cannot be its own parent');
      }
      const parent = await this.repo.findById(patch.parentId);
      if (!parent) throw new NotFoundException('Parent category not found');
    }

    const allowed: Partial<Category> = {};
    if (patch.parentId !== undefined) allowed.parentId = patch.parentId;
    if (patch.slug !== undefined) allowed.slug = patch.slug;
    if (patch.nameTranslations !== undefined)
      allowed.nameTranslations = patch.nameTranslations;
    if (patch.icon !== undefined) allowed.icon = patch.icon;
    if (patch.position !== undefined) allowed.position = patch.position;
    if (patch.isActive !== undefined) allowed.isActive = patch.isActive;

    return this.repo.update(id, allowed);
  }

  async delete(id: string): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Category not found');
    return this.repo.delete(id);
  }
}
