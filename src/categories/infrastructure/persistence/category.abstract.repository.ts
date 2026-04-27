import { Category } from '../../domain/category';

export abstract class CategoryAbstractRepository {
  abstract findAll(opts: { activeOnly: boolean }): Promise<Category[]>;
  abstract findById(id: string): Promise<Category | null>;
  abstract findBySlug(slug: string): Promise<Category | null>;
  abstract create(
    input: Omit<Category, 'createdAt' | 'updatedAt'>,
  ): Promise<Category>;
  abstract update(id: string, patch: Partial<Category>): Promise<Category>;
  abstract delete(id: string): Promise<void>;
}
