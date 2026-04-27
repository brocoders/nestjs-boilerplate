import { Vendor, VendorStatus } from '../../domain/vendor';

export interface FindAllOptions {
  status?: VendorStatus;
  page: number;
  limit: number;
}

export interface FindAllResult {
  data: Vendor[];
  total: number;
}

export abstract class VendorAbstractRepository {
  abstract findAll(options: FindAllOptions): Promise<FindAllResult>;
  abstract findById(id: string): Promise<Vendor | null>;
  abstract findBySlug(slug: string): Promise<Vendor | null>;
  abstract findByUserId(userId: number): Promise<Vendor | null>;
  abstract create(
    input: Omit<Vendor, 'createdAt' | 'updatedAt'>,
  ): Promise<Vendor>;
  abstract update(id: string, patch: Partial<Vendor>): Promise<Vendor>;
  abstract setStatus(id: string, status: VendorStatus): Promise<Vendor>;
}
