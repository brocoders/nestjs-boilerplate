import { Module } from '@nestjs/common';
import { CategoriesPublicController } from './categories-public.controller';
import { CategoriesAdminController } from './categories-admin.controller';
import { CategoriesService } from './categories.service';
import { RelationalCategoryPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [RelationalCategoryPersistenceModule],
  controllers: [CategoriesPublicController, CategoriesAdminController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
