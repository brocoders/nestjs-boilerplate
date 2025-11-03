import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../../../products/domain/product.entity';

@Injectable()
export class ProductSeedService {
  constructor(
    @InjectRepository(Product)
    private repository: Repository<Product>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save([
        this.repository.create({
          judul: 'Produk A',
          deskripsi: 'Deskripsi produk A yang sangat bagus.',
          jumlah: 10,
        }),
        this.repository.create({
          judul: 'Produk B',
          deskripsi: 'Deskripsi produk B dengan fitur unggulan.',
          jumlah: 25,
        }),
        this.repository.create({
          judul: 'Produk C',
          deskripsi: 'Deskripsi produk C untuk kebutuhan sehari-hari.',
          jumlah: 5,
        }),
      ]);
    }
  }
}
