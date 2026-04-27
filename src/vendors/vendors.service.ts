import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { uuidv7Generate } from '../utils/uuid';
import { Vendor, VendorStatus } from './domain/vendor';
import { VendorAbstractRepository } from './infrastructure/persistence/vendor.abstract.repository';
import { SettingsService } from '../settings/settings.service';
import { RegionsService } from '../regions/regions.service';
import { UsersService } from '../users/users.service';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';

const SLUG_MAX_LEN = 64;
const SLUG_RETRY_LIMIT = 5;

export interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  name: string;
  description?: string;
}

@Injectable()
export class VendorsService {
  constructor(
    private readonly repo: VendorAbstractRepository,
    private readonly settings: SettingsService,
    private readonly regions: RegionsService,
    private readonly users: UsersService,
  ) {}

  async signup(input: SignupInput): Promise<Vendor> {
    const settings = await this.settings.get();
    const autoApprove = settings.vendors_auto_approve;
    const defaultRegion = await this.regions.getDefault();

    const user = await this.users.create({
      email: input.email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
      status: { id: StatusEnum.active },
      role: { id: RoleEnum.user },
    } as never);

    const slug = await this.uniqueSlug(input.name);
    const status = autoApprove ? VendorStatus.ACTIVE : VendorStatus.PENDING;

    const vendor = await this.repo.create({
      id: uuidv7Generate(),
      userId: (user as { id: number }).id,
      slug,
      nameTranslations: { en: input.name },
      descriptionTranslations: input.description
        ? { en: input.description }
        : {},
      logoFileId: null,
      bannerFileId: null,
      status,
      defaultRegionId: defaultRegion.id,
      supportedRegionIds: [defaultRegion.id],
      returnWindowDays: 14,
      shipsFromCountry: null,
    });

    if (status === VendorStatus.ACTIVE) {
      await this.grantVendorRole(vendor.userId);
    }

    return vendor;
  }

  async getById(id: string): Promise<Vendor> {
    const v = await this.repo.findById(id);
    if (!v) throw new NotFoundException('Vendor not found');
    return v;
  }

  async getByUserId(userId: number): Promise<Vendor | null> {
    return this.repo.findByUserId(userId);
  }

  async list(opts: { status?: VendorStatus; page?: number; limit?: number }) {
    return this.repo.findAll({
      status: opts.status,
      page: opts.page ?? 1,
      limit: Math.min(opts.limit ?? 20, 100),
    });
  }

  async updateMine(userId: number, patch: Partial<Vendor>): Promise<Vendor> {
    const mine = await this.repo.findByUserId(userId);
    if (!mine) throw new NotFoundException('You do not have a vendor account');
    const allowed: Partial<Vendor> = {
      nameTranslations: patch.nameTranslations,
      descriptionTranslations: patch.descriptionTranslations,
      logoFileId: patch.logoFileId,
      bannerFileId: patch.bannerFileId,
      returnWindowDays: patch.returnWindowDays,
      shipsFromCountry: patch.shipsFromCountry,
      supportedRegionIds: patch.supportedRegionIds,
    };
    return this.repo.update(mine.id, this.stripUndefined(allowed));
  }

  async approve(id: string): Promise<Vendor> {
    const v = await this.getById(id);
    if (v.status !== VendorStatus.PENDING) {
      throw new ForbiddenException('Only PENDING vendors can be approved');
    }
    const updated = await this.repo.setStatus(id, VendorStatus.ACTIVE);
    await this.grantVendorRole(v.userId);
    return updated;
  }

  async reject(id: string): Promise<Vendor> {
    const v = await this.getById(id);
    if (v.status !== VendorStatus.PENDING) {
      throw new ForbiddenException('Only PENDING vendors can be rejected');
    }
    return this.repo.setStatus(id, VendorStatus.SUSPENDED);
  }

  async suspend(id: string): Promise<Vendor> {
    const v = await this.getById(id);
    if (v.status === VendorStatus.PENDING) {
      throw new ForbiddenException(
        'PENDING vendors should be rejected, not suspended',
      );
    }
    return this.repo.setStatus(id, VendorStatus.SUSPENDED);
  }

  async reinstate(id: string): Promise<Vendor> {
    const v = await this.getById(id);
    if (v.status !== VendorStatus.SUSPENDED) {
      throw new ForbiddenException('Only SUSPENDED vendors can be reinstated');
    }
    return this.repo.setStatus(id, VendorStatus.ACTIVE);
  }

  private async grantVendorRole(userId: number): Promise<void> {
    await this.users.update(userId, { role: { id: RoleEnum.vendor } } as never);
  }

  private async uniqueSlug(name: string): Promise<string> {
    const base = this.slugify(name);
    if (!(await this.repo.findBySlug(base))) return base;
    for (let i = 0; i < SLUG_RETRY_LIMIT; i++) {
      const candidate = `${base}-${i + 2}`.slice(0, SLUG_MAX_LEN);
      if (!(await this.repo.findBySlug(candidate))) return candidate;
    }
    throw new ConflictException('Could not allocate a unique slug');
  }

  private slugify(name: string): string {
    return (
      name
        .trim()
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, SLUG_MAX_LEN) || 'shop'
    );
  }

  private stripUndefined<T extends object>(obj: T): T {
    const out = {} as T;
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined) (out as Record<string, unknown>)[k] = v;
    }
    return out;
  }
}
