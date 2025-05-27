import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateExemptionDto } from './dto/create-exemption.dto';
import { UpdateExemptionDto } from './dto/update-exemption.dto';
import { ExemptionRepository } from './infrastructure/persistence/exemption.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Exemption } from './domain/exemption';

@Injectable()
export class ExemptionsService {
  constructor(
    // Dependencies here
    private readonly exemptionRepository: ExemptionRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createExemptionDto: CreateExemptionDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.exemptionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.exemptionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Exemption['id']) {
    return this.exemptionRepository.findById(id);
  }

  findByIds(ids: Exemption['id'][]) {
    return this.exemptionRepository.findByIds(ids);
  }

  async update(
    id: Exemption['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateExemptionDto: UpdateExemptionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.exemptionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: Exemption['id']) {
    return this.exemptionRepository.remove(id);
  }
}
