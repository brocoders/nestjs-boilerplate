import { Test } from '@nestjs/testing';
import { RegionsService } from './regions.service';
import { RegionAbstractRepository } from './infrastructure/persistence/region.abstract.repository';
import { Region } from './domain/region';

describe('RegionsService', () => {
  let service: RegionsService;
  let repo: jest.Mocked<RegionAbstractRepository>;

  const sa: Region = Object.assign(new Region(), {
    id: '0190a4d5-3d23-7c2a-bb50-9c0f3a59c1a0',
    code: 'SA',
    nameTranslations: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
    currencyCode: 'SAR',
    defaultLocale: 'ar',
    isEnabled: true,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RegionsService,
        {
          provide: RegionAbstractRepository,
          useValue: {
            findAllEnabled: jest.fn(),
            findByCode: jest.fn(),
            findDefault: jest.fn(),
          },
        },
      ],
    }).compile();
    service = moduleRef.get(RegionsService);
    repo = moduleRef.get(RegionAbstractRepository);
  });

  it('should list enabled regions', async () => {
    repo.findAllEnabled.mockResolvedValue([sa]);
    expect(await service.listEnabled()).toEqual([sa]);
  });

  it('should find a region by code', async () => {
    repo.findByCode.mockResolvedValue(sa);
    expect(await service.findByCode('SA')).toEqual(sa);
  });

  it('should resolve the default region', async () => {
    repo.findDefault.mockResolvedValue(sa);
    expect(await service.getDefault()).toEqual(sa);
  });

  it('should throw when no default region exists', async () => {
    repo.findDefault.mockResolvedValue(null);
    await expect(service.getDefault()).rejects.toThrow(/no default region/i);
  });
});
