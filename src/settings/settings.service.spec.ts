import { Test } from '@nestjs/testing';
import { SettingsService } from './settings.service';
import { SettingAbstractRepository } from './infrastructure/persistence/setting.abstract.repository';
import { DEFAULT_SETTINGS, SettingsShape } from './domain/setting';

describe('SettingsService', () => {
  let service: SettingsService;
  let repo: jest.Mocked<SettingAbstractRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        SettingsService,
        {
          provide: SettingAbstractRepository,
          useValue: { get: jest.fn(), update: jest.fn() },
        },
      ],
    }).compile();
    service = moduleRef.get(SettingsService);
    repo = moduleRef.get(SettingAbstractRepository);
  });

  it('should return defaults when settings row is empty', async () => {
    repo.get.mockResolvedValue({ ...DEFAULT_SETTINGS });
    expect(await service.get()).toEqual(DEFAULT_SETTINGS);
  });

  it('should expose typed getValue for a single key', async () => {
    const stored: SettingsShape = {
      ...DEFAULT_SETTINGS,
      multi_region_enabled: true,
    };
    repo.get.mockResolvedValue(stored);
    expect(await service.getValue('multi_region_enabled')).toBe(true);
  });

  it('should expose only the public subset via publicSubset', async () => {
    const stored: SettingsShape = {
      ...DEFAULT_SETTINGS,
      multi_region_enabled: true,
      default_region_code: 'EG',
      default_locale_code: 'en',
      vendors_auto_approve: true, // private — must NOT appear in result
      products_auto_approve: true, // private — must NOT appear in result
    };
    repo.get.mockResolvedValue(stored);
    const pub = await service.publicSubset();
    expect(pub).toEqual({
      multi_region_enabled: true,
      default_region_code: 'EG',
      default_locale_code: 'en',
    });
    expect(pub).not.toHaveProperty('vendors_auto_approve');
    expect(pub).not.toHaveProperty('products_auto_approve');
  });

  it('should patch settings via update', async () => {
    const next: SettingsShape = {
      ...DEFAULT_SETTINGS,
      multi_region_enabled: true,
    };
    repo.update.mockResolvedValue(next);
    expect(await service.update({ multi_region_enabled: true })).toEqual(next);
    expect(repo.update).toHaveBeenCalledWith({ multi_region_enabled: true });
  });
});
