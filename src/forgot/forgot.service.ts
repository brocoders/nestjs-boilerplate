import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'src/utils/types/deep-partial.type';
import { FindOptions } from 'src/utils/types/find-options.type';
import { Repository } from 'typeorm';
import { Forgot } from './forgot.entity';

@Injectable()
export class ForgotService {
  constructor(
    @InjectRepository(Forgot)
    private forgotRepository: Repository<Forgot>,
  ) {}

  async findOneEntity(options: FindOptions<Forgot>) {
    return this.forgotRepository.findOne({
      where: options.where,
    });
  }

  async findManyEntities(options: FindOptions<Forgot>) {
    return this.forgotRepository.find({
      where: options.where,
    });
  }

  async saveEntity(data: DeepPartial<Forgot>) {
    return this.forgotRepository.save(this.forgotRepository.create(data));
  }

  async softDelete(id: number): Promise<void> {
    await this.forgotRepository.softDelete(id);
  }
}
