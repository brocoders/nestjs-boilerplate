import { Test } from '@nestjs/testing';
import { LocalesService } from './locales.service';
import { LocaleAbstractRepository } from './infrastructure/persistence/locale.abstract.repository';
import { Locale } from './domain/locale';

describe('LocalesService', () => {
  let service: LocalesService;
  let repo: jest.Mocked<LocaleAbstractRepository>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        LocalesService,
        {
          provide: LocaleAbstractRepository,
          useValue: {
            findAllEnabled: jest.fn(),
            findByCode: jest.fn(),
            findById: jest.fn(),
          },
        },
      ],
    }).compile();
    service = moduleRef.get(LocalesService);
    repo = moduleRef.get(LocaleAbstractRepository);
  });

  it('should list enabled locales', async () => {
    const ar: Locale = Object.assign(new Locale(), {
      id: '1',
      code: 'ar',
      nativeName: 'العربية',
      isRtl: true,
      isEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    repo.findAllEnabled.mockResolvedValue([ar]);
    const result = await service.listEnabled();
    expect(result).toEqual([ar]);
    expect(repo.findAllEnabled).toHaveBeenCalled();
  });

  it('should find a locale by code', async () => {
    const en: Locale = Object.assign(new Locale(), {
      id: '2',
      code: 'en',
      nativeName: 'English',
      isRtl: false,
      isEnabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    repo.findByCode.mockResolvedValue(en);
    expect(await service.findByCode('en')).toEqual(en);
    expect(repo.findByCode).toHaveBeenCalledWith('en');
  });

  it('should return null when locale code is not found', async () => {
    repo.findByCode.mockResolvedValue(null);
    expect(await service.findByCode('xx')).toBeNull();
  });
});
