import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocaleEntity } from '../../../../locales/infrastructure/persistence/relational/entities/locale.entity';
import { uuidv7Generate } from '../../../../utils/uuid';

const SEED: Array<
  Pick<LocaleEntity, 'code' | 'nativeName' | 'isRtl' | 'isEnabled'>
> = [
  { code: 'en', nativeName: 'English', isRtl: false, isEnabled: true },
  { code: 'ar', nativeName: 'العربية', isRtl: true, isEnabled: true },
];

@Injectable()
export class LocaleSeedService {
  constructor(
    @InjectRepository(LocaleEntity)
    private readonly repository: Repository<LocaleEntity>,
  ) {}

  async run(): Promise<void> {
    for (const row of SEED) {
      const exists = await this.repository.findOne({
        where: { code: row.code },
      });
      if (!exists) {
        await this.repository.save(
          this.repository.create({ ...row, id: uuidv7Generate() }),
        );
      }
    }
  }
}
