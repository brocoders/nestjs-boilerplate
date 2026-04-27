import { Product, ProductStatus } from '../../domain/product';

export interface FindForVendorOptions {
  vendorId: string;
  status?: ProductStatus;
  page: number;
  limit: number;
}

export interface FindForPublicOptions {
  region?: string;
  categoryId?: string;
  q?: string;
  page: number;
  limit: number;
}

export interface FindAllResult {
  data: Product[];
  total: number;
}

export abstract class ProductAbstractRepository {
  abstract findForVendor(opts: FindForVendorOptions): Promise<FindAllResult>;
  abstract findForPublic(opts: FindForPublicOptions): Promise<FindAllResult>;
  abstract findById(id: string): Promise<Product | null>;
  abstract findByVendorIdAndSlug(
    vendorId: string,
    slug: string,
  ): Promise<Product | null>;
  abstract create(
    input: Omit<Product, 'createdAt' | 'updatedAt'>,
  ): Promise<Product>;
  abstract update(id: string, patch: Partial<Product>): Promise<Product>;
  abstract setStatus(id: string, status: ProductStatus): Promise<Product>;
}
