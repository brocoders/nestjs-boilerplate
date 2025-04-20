import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionEntity } from '../../../../regions/infrastructure/persistence/relational/entities/region.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RegionSeedService {
  constructor(
    @InjectRepository(RegionEntity)
    private repository: Repository<RegionEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    /*    const regions = [
      {
        name: 'Nairobi Central',
        boundary: {
          type: 'Polygon',
          coordinates: [
            [
              [36.8219, -1.2921],
              [36.895, -1.2921],
              [36.895, -1.2335],
              [36.8219, -1.2335],
              [36.8219, -1.2921],
            ],
          ],
        },
        centroidLat: -1.2628,
        centroidLon: 36.8584,
        serviceTypes: ['residential', 'commercial'],
        operatingHours: {
          days: ['mon-fri'],
          startTime: '08:00',
          endTime: '17:00',
        },
        zipCodes: ['00100', '00101'],
      },
    ]; */

    if (count === 0) {
      await this.repository.save(this.repository.create({}));
    }
  }
}
