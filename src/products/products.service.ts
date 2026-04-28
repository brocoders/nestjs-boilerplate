import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { uuidv7Generate } from '../utils/uuid';
import { Product, ProductStatus } from './domain/product';
import { ProductAbstractRepository } from './infrastructure/persistence/product.abstract.repository';
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

@Injectable()
export class ProductsService {
  constructor(
    private readonly repo: ProductAbstractRepository,
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
  ): Promise<Product> {
    const vendor = await this.vendors.findBySlug(vendorSlug);
    if (!vendor) throw new NotFoundException('Product not found');
    const product = await this.repo.findByVendorIdAndSlug(
      vendor.id,
      productSlug,
    );
    if (!product || product.status !== ProductStatus.ACTIVE) {
      throw new NotFoundException('Product not found');
    }
    return product;
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
}
