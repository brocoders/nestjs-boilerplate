import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { uuidv7Generate } from '../../../../utils/uuid';

const SEED: Array<
  Pick<
    RegionEntity,
    'code' | 'nameTranslations' | 'currencyCode' | 'defaultLocale' | 'isDefault'
  >
> = [
  {
    code: 'SA',
    nameTranslations: {
      en: 'Saudi Arabia',
      ar: 'المملكة العربية السعودية',
    },
    currencyCode: 'SAR',
    defaultLocale: 'ar',
    isDefault: true,
  },
  {
    code: 'AE',
    nameTranslations: {
      en: 'United Arab Emirates',
      ar: 'الإمارات العربية المتحدة',
    },
    currencyCode: 'AED',
    defaultLocale: 'ar',
    isDefault: false,
  },
  {
    code: 'EG',
    nameTranslations: { en: 'Egypt', ar: 'مصر' },
    currencyCode: 'EGP',
    defaultLocale: 'ar',
    isDefault: false,
  },
];

@Injectable()
export class RegionSeedService {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly repo: Repository<RegionEntity>,
  ) {}

  async run(): Promise<void> {
    for (const row of SEED) {
      const exists = await this.repo.findOne({ where: { code: row.code } });
      if (!exists) {
        await this.repo.save(
          this.repo.create({ ...row, id: uuidv7Generate() }),
        );
      }
    }
  }
}
