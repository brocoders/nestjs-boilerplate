import { ProductOptionType } from '../../domain/product-option-type';
import { ProductOptionValue } from '../../domain/product-option-value';
import { ProductVariant } from '../../domain/product-variant';
import { VariantPrice } from '../../domain/variant-price';
import { VariantStock } from '../../domain/variant-stock';

export interface CreateOptionTypeInput {
  id: string;
  productId: string;
  slug: string;
  nameTranslations: Record<string, string>;
  position: number;
}

export interface CreateOptionValueInput {
  id: string;
  optionTypeId: string;
  slug: string;
  valueTranslations: Record<string, string>;
  swatchColor?: string | null;
  position: number;
}

export interface CreateVariantInput {
  id: string;
  productId: string;
  sku: string;
  weightGrams: number;
  isActive: boolean;
  optionValueIds: Array<{ optionTypeId: string; optionValueId: string }>;
}

export interface UpsertVariantPriceInput {
  variantId: string;
  regionId: string;
  currencyCode: string;
  priceMinorUnits: string;
  compareAtPriceMinorUnits?: string | null;
}

export interface UpsertVariantStockInput {
  variantId: string;
  quantity: number;
}

export abstract class ProductVariantAbstractRepository {
  abstract clearForProduct(productId: string): Promise<void>;
  abstract createOptionTypes(
    types: CreateOptionTypeInput[],
  ): Promise<ProductOptionType[]>;
  abstract createOptionValues(
    values: CreateOptionValueInput[],
  ): Promise<ProductOptionValue[]>;
  abstract createVariants(
    inputs: CreateVariantInput[],
  ): Promise<ProductVariant[]>;
  abstract findVariantById(variantId: string): Promise<ProductVariant | null>;
  abstract findVariantsForProduct(productId: string): Promise<ProductVariant[]>;
  abstract findOptionTypesForProduct(
    productId: string,
  ): Promise<ProductOptionType[]>;
  abstract findActiveVariantsWithRegionPrice(
    productId: string,
    regionId: string,
  ): Promise<ProductVariant[]>;
  abstract upsertVariantPrice(
    input: UpsertVariantPriceInput,
  ): Promise<VariantPrice>;
  abstract upsertVariantStock(
    input: UpsertVariantStockInput,
  ): Promise<VariantStock>;
}
