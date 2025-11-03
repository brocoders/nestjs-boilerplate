import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pricing } from '../../../../pricings/domain/pricing.entity';

@Injectable()
export class PricingSeedService {
  constructor(
    @InjectRepository(Pricing)
    private repository: Repository<Pricing>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save([
        this.repository.create({
          title: 'Paket 4 Channel',
          price: 'Rp 3.400.000',
          features: [
            '4 Dahua Camera 2MP',
            '1 DVR DH-XVR4104',
            '1 HDD 500GB',
            'Free biaya pemasangan',
            'Free setting akses dari internet',
            'Free Kabel 100M',
          ],
        }),
        this.repository.create({
          title: 'Paket 8 Channel',
          price: 'Rp 5.400.000',
          features: [
            '8 Dahua Camera 2MP',
            '1 DVR DH-XVR4108',
            '1 HDD 500GB',
            '1 PSU 12V 10A',
            'Free biaya pemasangan',
            'Free setting akses dari internet',
            'Free Kabel 200M',
          ],
        }),
        this.repository.create({
          title: 'Paket 16 Channel',
          price: 'Rp 9.800.000',
          features: [
            '16 Dahua Camera 2MP',
            '1 DVR DH-XVR8116',
            '1 HDD 1TB',
            '1 PSU 12V 20A',
            'Free biaya pemasangan',
            'Free setting akses dari internet',
            'Free Kabel 300M',
          ],
        }),
      ]);
    }
  }
}
