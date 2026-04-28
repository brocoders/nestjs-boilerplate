import { Category } from '../../../../domain/category';
import { CategoryEntity } from '../entities/category.entity';

export class CategoryMapper {
  static toDomain(entity: CategoryEntity): Category {
    const d = new Category();
    d.id = entity.id;
    d.parentId = entity.parentId;
    d.slug = entity.slug;
    d.nameTranslations = entity.nameTranslations;
    d.icon = entity.icon;
    d.position = entity.position;
    d.isActive = entity.isActive;
    d.createdAt = entity.createdAt;
    d.updatedAt = entity.updatedAt;
    return d;
  }
}
