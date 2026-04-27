import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
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
import { ProductsService } from './products.service';
import { ProductVariant } from './domain/product-variant';
import { VariantPrice } from './domain/variant-price';
import { VariantStock } from './domain/variant-stock';
import { GenerateVariantsDto } from './dto/generate-variants.dto';
import { SetVariantPriceDto } from './dto/set-variant-price.dto';
import { SetVariantStockDto } from './dto/set-variant-stock.dto';

@ApiTags('Vendor · Variants')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'vendor/products', version: '1' })
export class ProductsVariantsVendorController {
  constructor(private readonly service: ProductsService) {}

  @Post(':id/variants/generate')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ProductVariant, isArray: true })
  async generate(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) productId: string,
    @Body() dto: GenerateVariantsDto,
  ): Promise<ProductVariant[]> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.generateVariants(vendor.id, productId, {
      optionTypes: dto.optionTypes.map((t) => ({
        slug: t.slug,
        nameTranslations: t.nameTranslations,
        values: t.values.map((v) => ({
          slug: v.slug,
          valueTranslations: v.valueTranslations,
          swatchColor: v.swatchColor ?? null,
        })),
      })),
    });
  }

  @Get(':id/variants')
  @ApiOkResponse({ type: ProductVariant, isArray: true })
  async list(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) productId: string,
  ): Promise<ProductVariant[]> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.listVariantsForVendor(vendor.id, productId);
  }

  @Patch(':id/variants/:vid/prices')
  @ApiOkResponse({ type: VariantPrice })
  async setPrice(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) productId: string,
    @Param('vid', ParseUUIDPipe) variantId: string,
    @Body() dto: SetVariantPriceDto,
  ): Promise<VariantPrice> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.setVariantPrice(vendor.id, productId, variantId, {
      regionId: dto.regionId,
      priceMinorUnits: dto.priceMinorUnits,
      compareAtPriceMinorUnits: dto.compareAtPriceMinorUnits ?? null,
    });
  }

  @Patch(':id/variants/:vid/stock')
  @ApiOkResponse({ type: VariantStock })
  async setStock(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) productId: string,
    @Param('vid', ParseUUIDPipe) variantId: string,
    @Body() dto: SetVariantStockDto,
  ): Promise<VariantStock> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.setVariantStock(vendor.id, productId, variantId, {
      quantity: dto.quantity,
    });
  }
}
