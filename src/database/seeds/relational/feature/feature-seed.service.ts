import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feature } from '../../../../features/domain/feature.entity';

@Injectable()
export class FeatureSeedService {
  constructor(
    @InjectRepository(Feature)
    private repository: Repository<Feature>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save([
        this.repository.create({
          title: 'Integrasi Cepat',
          description: 'Mudah diintegrasikan dengan sistem Anda tanpa hambatan.',
        }),
        this.repository.create({
          title: 'Keamanan Tinggi',
          description: 'Data Anda terlindungi dengan enkripsi dan autentikasi modern.',
        }),
        this.repository.create({
          title: 'Dukungan 24/7',
          description: 'Tim kami siap membantu kapan pun Anda butuh.',
        }),
      ]);
    }
  }
}
