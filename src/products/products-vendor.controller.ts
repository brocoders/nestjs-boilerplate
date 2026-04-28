import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { Product } from './domain/product';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { VendorProductListQueryDto } from './dto/product-list-query.dto';

@ApiTags('Vendor · Products')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'vendor/products', version: '1' })
export class ProductsVendorController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/Product' },
        },
        total: { type: 'number' },
      },
    },
  })
  async list(@Req() req: Request, @Query() query: VendorProductListQueryDto) {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.listForVendor(vendor.id, query);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: Product })
  async create(
    @Req() req: Request,
    @Body() dto: CreateProductDto,
  ): Promise<Product> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.createByVendor(vendor, {
      slug: dto.slug,
      nameTranslations: dto.nameTranslations,
      descriptionTranslations: dto.descriptionTranslations,
      categoryId: dto.categoryId ?? null,
      baseCurrency: dto.baseCurrency,
      supportedRegionIds: dto.supportedRegionIds,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: Product })
  async getOne(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.getMineById(vendor.id, id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Product })
  async update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.updateByVendor(vendor.id, id, dto);
  }

  @Post(':id/publish')
  @ApiOkResponse({ type: Product })
  async publish(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.publishByVendor(vendor.id, id);
  }

  @Post(':id/archive')
  @ApiOkResponse({ type: Product })
  async archive(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.archiveByVendor(vendor.id, id);
  }

  @Delete(':id')
  @ApiOkResponse({ type: Product })
  async softDelete(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.archiveByVendor(vendor.id, id);
  }
}
