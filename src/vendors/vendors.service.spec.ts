import { Test } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { VendorsService } from './vendors.service';
import { VendorAbstractRepository } from './infrastructure/persistence/vendor.abstract.repository';
import { Vendor, VendorStatus } from './domain/vendor';
import { SettingsService } from '../settings/settings.service';
import { RegionsService } from '../regions/regions.service';
import { UsersService } from '../users/users.service';
import { DEFAULT_SETTINGS } from '../settings/domain/setting';
import { Region } from '../regions/domain/region';
import { RoleEnum } from '../roles/roles.enum';

describe('VendorsService', () => {
  let service: VendorsService;
  let repo: jest.Mocked<VendorAbstractRepository>;
  let settings: jest.Mocked<SettingsService>;
  let regions: jest.Mocked<RegionsService>;
  let users: jest.Mocked<UsersService>;

  const region: Region = Object.assign(new Region(), {
    id: 'region-sa',
    code: 'SA',
    nameTranslations: { en: 'Saudi Arabia', ar: 'السعودية' },
    currencyCode: 'SAR',
    defaultLocale: 'ar',
    isEnabled: true,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const buildVendor = (overrides: Partial<Vendor> = {}): Vendor =>
    Object.assign(new Vendor(), {
      id: 'v-1',
      userId: 12,
      slug: 'sample-shop',
      nameTranslations: { en: 'Sample Shop' },
      descriptionTranslations: {},
      logoFileId: null,
      bannerFileId: null,
      status: VendorStatus.PENDING,
      defaultRegionId: region.id,
      supportedRegionIds: [region.id],
      returnWindowDays: 14,
      shipsFromCountry: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        VendorsService,
        {
          provide: VendorAbstractRepository,
          useValue: {
            findAll: jest.fn(),
            findById: jest.fn(),
            findBySlug: jest.fn(),
            findByUserId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            setStatus: jest.fn(),
          },
        },
        {
          provide: SettingsService,
          useValue: { get: jest.fn(), getValue: jest.fn() },
        },
        {
          provide: RegionsService,
          useValue: { findByCode: jest.fn(), getDefault: jest.fn() },
        },
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();
    service = moduleRef.get(VendorsService);
    repo = moduleRef.get(VendorAbstractRepository);
    settings = moduleRef.get(SettingsService);
    regions = moduleRef.get(RegionsService);
    users = moduleRef.get(UsersService);
  });

  describe('signup', () => {
    it('should create user + PENDING vendor when vendors_auto_approve is false', async () => {
      settings.get.mockResolvedValue({
        ...DEFAULT_SETTINGS,
        vendors_auto_approve: false,
      });
      regions.getDefault.mockResolvedValue(region);
      users.create.mockResolvedValue({ id: 12 } as never);
      repo.findBySlug.mockResolvedValue(null);
      repo.create.mockImplementation((input) =>
        Promise.resolve(buildVendor(input as Partial<Vendor>)),
      );

      const result = await service.signup({
        email: 'shop@example.com',
        password: 'Pass1234!',
        firstName: 'S',
        lastName: 'Shop',
        name: 'Sample Shop',
      });

      expect(users.create).toHaveBeenCalled();
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          status: VendorStatus.PENDING,
          userId: 12,
        }),
      );
      expect(result.status).toBe(VendorStatus.PENDING);
    });

    it('should auto-grant Vendor role when vendors_auto_approve is true', async () => {
      settings.get.mockResolvedValue({
        ...DEFAULT_SETTINGS,
        vendors_auto_approve: true,
      });
      regions.getDefault.mockResolvedValue(region);
      users.create.mockResolvedValue({ id: 12 } as never);
      repo.findBySlug.mockResolvedValue(null);
      repo.create.mockImplementation((input) =>
        Promise.resolve(
          buildVendor({
            ...(input as Partial<Vendor>),
            status: VendorStatus.ACTIVE,
          }),
        ),
      );

      const result = await service.signup({
        email: 'shop@example.com',
        password: 'Pass1234!',
        firstName: 'S',
        lastName: 'Shop',
        name: 'Sample Shop',
      });

      expect(users.update).toHaveBeenCalledWith(
        12,
        expect.objectContaining({ role: { id: RoleEnum.vendor } }),
      );
      expect(result.status).toBe(VendorStatus.ACTIVE);
    });
  });

  describe('approve / reject / suspend / reinstate', () => {
    it('should grant Vendor role on approve', async () => {
      const pending = buildVendor({ status: VendorStatus.PENDING });
      repo.findById.mockResolvedValue(pending);
      repo.setStatus.mockResolvedValue({
        ...pending,
        status: VendorStatus.ACTIVE,
      });

      const result = await service.approve('v-1');

      expect(repo.setStatus).toHaveBeenCalledWith('v-1', VendorStatus.ACTIVE);
      expect(users.update).toHaveBeenCalledWith(
        12,
        expect.objectContaining({ role: { id: RoleEnum.vendor } }),
      );
      expect(result.status).toBe(VendorStatus.ACTIVE);
    });

    it('should refuse approve when vendor is not PENDING', async () => {
      repo.findById.mockResolvedValue(
        buildVendor({ status: VendorStatus.ACTIVE }),
      );
      await expect(service.approve('v-1')).rejects.toBeInstanceOf(
        ForbiddenException,
      );
    });

    it('should suspend an ACTIVE vendor', async () => {
      const active = buildVendor({ status: VendorStatus.ACTIVE });
      repo.findById.mockResolvedValue(active);
      repo.setStatus.mockResolvedValue({
        ...active,
        status: VendorStatus.SUSPENDED,
      });
      const result = await service.suspend('v-1');
      expect(result.status).toBe(VendorStatus.SUSPENDED);
    });

    it('should reinstate a SUSPENDED vendor', async () => {
      const suspended = buildVendor({ status: VendorStatus.SUSPENDED });
      repo.findById.mockResolvedValue(suspended);
      repo.setStatus.mockResolvedValue({
        ...suspended,
        status: VendorStatus.ACTIVE,
      });
      const result = await service.reinstate('v-1');
      expect(result.status).toBe(VendorStatus.ACTIVE);
    });

    it('should throw NotFound when vendor does not exist', async () => {
      repo.findById.mockResolvedValue(null);
      await expect(service.approve('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('getByUserId', () => {
    it('should return null when user has no vendor account', async () => {
      repo.findByUserId.mockResolvedValue(null);
      expect(await service.getByUserId(99)).toBeNull();
    });
  });
});
