import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { uuidv7Generate } from '../utils/uuid';
import { Product, ProductStatus } from './domain/product';
import { ProductVariant } from './domain/product-variant';
import { VariantPrice } from './domain/variant-price';
import { VariantStock } from './domain/variant-stock';
import { ProductAbstractRepository } from './infrastructure/persistence/product.abstract.repository';
import { ProductVariantAbstractRepository } from './infrastructure/persistence/product-variant.abstract.repository';
import { VendorsService } from '../vendors/vendors.service';
import { VendorStatus, Vendor } from '../vendors/domain/vendor';
import { CategoriesService } from '../categories/categories.service';
import { RegionsService } from '../regions/regions.service';

export interface CreateProductInput {
  slug: string;
  nameTranslations: Record<string, string>;
  descriptionTranslations?: Record<string, string>;
  categoryId?: string | null;
  baseCurrency: string;
  supportedRegionIds?: string[];
}

export interface UpdateProductInput {
  slug?: string;
  nameTranslations?: Record<string, string>;
  descriptionTranslations?: Record<string, string>;
  categoryId?: string | null;
  baseCurrency?: string;
  supportedRegionIds?: string[];
}

export interface ListForVendorOptions {
  status?: ProductStatus;
  page?: number;
  limit?: number;
}

export interface ListForPublicOptions {
  region?: string;
  categorySlug?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface GenerateVariantsInput {
  optionTypes: Array<{
    slug: string;
    nameTranslations: Record<string, string>;
    values: Array<{
      slug: string;
      valueTranslations: Record<string, string>;
      swatchColor?: string | null;
    }>;
  }>;
}

export interface SetVariantPriceInput {
  regionId: string;
  priceMinorUnits: string;
  compareAtPriceMinorUnits?: string | null;
}

export interface SetVariantStockInput {
  quantity: number;
}

export interface PublicProductDetail extends Product {
  variants: ProductVariant[];
}

@Injectable()
export class ProductsService {
  constructor(
    private readonly repo: ProductAbstractRepository,
    private readonly variants: ProductVariantAbstractRepository,
    private readonly vendors: VendorsService,
    private readonly categories: CategoriesService,
    private readonly regions: RegionsService,
  ) {}

  async listForPublic(opts: ListForPublicOptions) {
    const page = opts.page ?? 1;
    const limit = Math.min(opts.limit ?? 20, 100);

    let categoryId: string | undefined;
    if (opts.categorySlug) {
      const cat = await this.categories.getBySlug(opts.categorySlug);
      categoryId = cat.id;
    }

    let regionId: string | undefined;
    if (opts.region) {
      const region = await this.regions.findByCode(opts.region.toUpperCase());
      if (region) regionId = region.id;
    }

    return this.repo.findForPublic({
      region: regionId,
      categoryId,
      q: opts.q,
      page,
      limit,
    });
  }

  async getBySlugForPublic(
    vendorSlug: string,
    productSlug: string,
    regionCode?: string,
  ): Promise<PublicProductDetail> {
    const vendor = await this.vendors.findBySlug(vendorSlug);
    if (!vendor) throw new NotFoundException('Product not found');
    const product = await this.repo.findByVendorIdAndSlug(
      vendor.id,
      productSlug,
    );
    if (!product || product.status !== ProductStatus.ACTIVE) {
      throw new NotFoundException('Product not found');
    }

    let resolvedVariants: ProductVariant[] = [];
    if (regionCode) {
      const region = await this.regions.findByCode(regionCode.toUpperCase());
      if (region) {
        resolvedVariants =
          await this.variants.findActiveVariantsWithRegionPrice(
            product.id,
            region.id,
          );
      }
    }

    return Object.assign(new Product(), product, {
      variants: resolvedVariants,
    }) as PublicProductDetail;
  }

  listForVendor(vendorId: string, opts: ListForVendorOptions) {
    return this.repo.findForVendor({
      vendorId,
      status: opts.status,
      page: opts.page ?? 1,
      limit: Math.min(opts.limit ?? 20, 100),
    });
  }

  async getMineById(vendorId: string, productId: string): Promise<Product> {
    const product = await this.repo.findById(productId);
    if (!product) throw new NotFoundException('Product not found');
    if (product.vendorId !== vendorId) {
      throw new ForbiddenException('You do not own this product');
    }
    return product;
  }

  async createByVendor(
    vendor: Vendor,
    dto: CreateProductInput,
  ): Promise<Product> {
    const dup = await this.repo.findByVendorIdAndSlug(vendor.id, dto.slug);
    if (dup) throw new ConflictException('Slug already in use for this vendor');

    if (dto.categoryId) {
      await this.categories.getById(dto.categoryId);
    }

    const defaultRegion = await this.regions.getDefault();
    const supported = dto.supportedRegionIds?.length
      ? dto.supportedRegionIds
      : Array.from(
          new Set([...(vendor.supportedRegionIds ?? []), defaultRegion.id]),
        );

    return this.repo.create({
      id: uuidv7Generate(),
      vendorId: vendor.id,
      categoryId: dto.categoryId ?? null,
      slug: dto.slug,
      nameTranslations: dto.nameTranslations,
      descriptionTranslations: dto.descriptionTranslations ?? {},
      status: ProductStatus.DRAFT,
      baseCurrency: dto.baseCurrency,
      supportedRegionIds: supported,
    });
  }

  async updateByVendor(
    vendorId: string,
    productId: string,
    patch: UpdateProductInput,
  ): Promise<Product> {
    const existing = await this.getMineById(vendorId, productId);

    if (patch.slug && patch.slug !== existing.slug) {
      const conflict = await this.repo.findByVendorIdAndSlug(
        vendorId,
        patch.slug,
      );
      if (conflict && conflict.id !== productId) {
        throw new ConflictException('Slug already in use for this vendor');
      }
    }

    if (patch.categoryId !== undefined && patch.categoryId !== null) {
      await this.categories.getById(patch.categoryId);
    }

    const allowed: Partial<Product> = {};
    if (patch.slug !== undefined) allowed.slug = patch.slug;
    if (patch.nameTranslations !== undefined)
      allowed.nameTranslations = patch.nameTranslations;
    if (patch.descriptionTranslations !== undefined)
      allowed.descriptionTranslations = patch.descriptionTranslations;
    if (patch.categoryId !== undefined) allowed.categoryId = patch.categoryId;
    if (patch.baseCurrency !== undefined)
      allowed.baseCurrency = patch.baseCurrency;
    if (patch.supportedRegionIds !== undefined)
      allowed.supportedRegionIds = patch.supportedRegionIds;

    return this.repo.update(productId, allowed);
  }

  async publishByVendor(vendorId: string, productId: string): Promise<Product> {
    const existing = await this.getMineById(vendorId, productId);
    if (existing.status === ProductStatus.ACTIVE) return existing;
    return this.repo.setStatus(productId, ProductStatus.ACTIVE);
  }

  async archiveByVendor(vendorId: string, productId: string): Promise<Product> {
    const existing = await this.getMineById(vendorId, productId);
    if (existing.status === ProductStatus.ARCHIVED) return existing;
    return this.repo.setStatus(productId, ProductStatus.ARCHIVED);
  }

  async getCallingActiveVendor(userId: number): Promise<Vendor> {
    const v = await this.vendors.getByUserId(userId);
    if (!v) {
      throw new ForbiddenException('You do not have a vendor account');
    }
    if (v.status !== VendorStatus.ACTIVE) {
      throw new ForbiddenException('Your vendor account is not active');
    }
    return v;
  }

  // ── Variants ────────────────────────────────────────────────────────

  async generateVariants(
    vendorId: string,
    productId: string,
    dto: GenerateVariantsInput,
  ): Promise<ProductVariant[]> {
    const product = await this.getMineById(vendorId, productId);

    if (!dto.optionTypes || dto.optionTypes.length === 0) {
      throw new UnprocessableEntityException(
        'optionTypes must contain at least one entry',
      );
    }

    // Reject duplicate option-type slugs in the same payload.
    const typeSlugs = new Set<string>();
    for (const t of dto.optionTypes) {
      if (typeSlugs.has(t.slug)) {
        throw new UnprocessableEntityException(
          `Duplicate option type slug: ${t.slug}`,
        );
      }
      typeSlugs.add(t.slug);

      const valueSlugs = new Set<string>();
      for (const v of t.values) {
        if (valueSlugs.has(v.slug)) {
          throw new UnprocessableEntityException(
            `Duplicate option value slug "${v.slug}" in type "${t.slug}"`,
          );
        }
        valueSlugs.add(v.slug);
      }
      if (t.values.length === 0) {
        throw new UnprocessableEntityException(
          `Option type "${t.slug}" must have at least one value`,
        );
      }
    }

    // One-shot generate: wipe any existing options/variants for the product.
    await this.variants.clearForProduct(productId);

    // Create option types preserving payload order.
    const optionTypeRows = await this.variants.createOptionTypes(
      dto.optionTypes.map((t, idx) => ({
        id: uuidv7Generate(),
        productId,
        slug: t.slug,
        nameTranslations: t.nameTranslations,
        position: idx,
      })),
    );

    // Create values for each type.
    const valuesByTypeSlug = new Map<
      string,
      Array<{ id: string; slug: string }>
    >();
    const allValueInputs: Array<{
      id: string;
      optionTypeId: string;
      slug: string;
      valueTranslations: Record<string, string>;
      swatchColor: string | null;
      position: number;
    }> = [];
    dto.optionTypes.forEach((t, tIdx) => {
      const typeRow = optionTypeRows[tIdx];
      const created: Array<{ id: string; slug: string }> = [];
      t.values.forEach((v, vIdx) => {
        const id = uuidv7Generate();
        allValueInputs.push({
          id,
          optionTypeId: typeRow.id,
          slug: v.slug,
          valueTranslations: v.valueTranslations,
          swatchColor: v.swatchColor ?? null,
          position: vIdx,
        });
        created.push({ id, slug: v.slug });
      });
      valuesByTypeSlug.set(t.slug, created);
    });
    await this.variants.createOptionValues(allValueInputs);

    // Cartesian product across option types, preserving payload order.
    type Combo = Array<{
      optionTypeId: string;
      optionValueId: string;
      typeSlug: string;
      valueSlug: string;
    }>;
    let combos: Combo[] = [[]];
    dto.optionTypes.forEach((t, tIdx) => {
      const typeRow = optionTypeRows[tIdx];
      const valueRows = valuesByTypeSlug.get(t.slug)!;
      const next: Combo[] = [];
      for (const combo of combos) {
        for (const vr of valueRows) {
          next.push([
            ...combo,
            {
              optionTypeId: typeRow.id,
              optionValueId: vr.id,
              typeSlug: t.slug,
              valueSlug: vr.slug,
            },
          ]);
        }
      }
      combos = next;
    });

    // Build variants — sku derived from product slug + value slugs.
    const variantInputs = combos.map((combo) => ({
      id: uuidv7Generate(),
      productId,
      sku: this.buildSku(
        product.slug,
        combo.map((c) => c.valueSlug),
      ),
      weightGrams: 0,
      isActive: true,
      optionValueIds: combo.map((c) => ({
        optionTypeId: c.optionTypeId,
        optionValueId: c.optionValueId,
      })),
    }));

    return this.variants.createVariants(variantInputs);
  }

  private buildSku(productSlug: string, valueSlugs: string[]): string {
    const raw = [productSlug, ...valueSlugs].join('-');
    // sku column is 64 chars; trim if needed.
    return raw.length <= 64 ? raw : raw.slice(0, 64);
  }

  async listVariantsForVendor(
    vendorId: string,
    productId: string,
  ): Promise<ProductVariant[]> {
    await this.getMineById(vendorId, productId);
    return this.variants.findVariantsForProduct(productId);
  }

  async setVariantPrice(
    vendorId: string,
    productId: string,
    variantId: string,
    dto: SetVariantPriceInput,
  ): Promise<VariantPrice> {
    await this.getMineById(vendorId, productId);
    const variant = await this.variants.findVariantById(variantId);
    if (!variant || variant.productId !== productId) {
      throw new NotFoundException('Variant not found');
    }

    const region = await this.regions.findById(dto.regionId);
    if (!region) {
      throw new UnprocessableEntityException('Unknown regionId');
    }

    return this.variants.upsertVariantPrice({
      variantId,
      regionId: region.id,
      currencyCode: region.currencyCode,
      priceMinorUnits: dto.priceMinorUnits,
      compareAtPriceMinorUnits: dto.compareAtPriceMinorUnits ?? null,
    });
  }

  async setVariantStock(
    vendorId: string,
    productId: string,
    variantId: string,
    dto: SetVariantStockInput,
  ): Promise<VariantStock> {
    await this.getMineById(vendorId, productId);
    const variant = await this.variants.findVariantById(variantId);
    if (!variant || variant.productId !== productId) {
      throw new NotFoundException('Variant not found');
    }
    return this.variants.upsertVariantStock({
      variantId,
      quantity: dto.quantity,
    });
  }
}
