import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Category } from './domain/category';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller({ path: 'categories', version: '1' })
export class CategoriesPublicController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  @ApiOkResponse({ type: Category, isArray: true })
  list(): Promise<Category[]> {
    return this.service.list(true);
  }

  @Get(':slug')
  @ApiOkResponse({ type: Category })
  getBySlug(@Param('slug') slug: string): Promise<Category> {
    return this.service.getBySlug(slug);
  }
}
