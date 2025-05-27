import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateCreditBalanceDto } from './dto/create-credit-balance.dto';
import { UpdateCreditBalanceDto } from './dto/update-credit-balance.dto';
import { CreditBalanceRepository } from './infrastructure/persistence/credit-balance.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { CreditBalance } from './domain/credit-balance';

@Injectable()
export class CreditBalancesService {
  constructor(
    // Dependencies here
    private readonly creditBalanceRepository: CreditBalanceRepository,
  ) {}

  async create(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createCreditBalanceDto: CreateCreditBalanceDto,
  ) {
    // Do not remove comment below.
    // <creating-property />

    return this.creditBalanceRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.creditBalanceRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: CreditBalance['id']) {
    return this.creditBalanceRepository.findById(id);
  }

  findByIds(ids: CreditBalance['id'][]) {
    return this.creditBalanceRepository.findByIds(ids);
  }

  async update(
    id: CreditBalance['id'],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateCreditBalanceDto: UpdateCreditBalanceDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.creditBalanceRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
    });
  }

  remove(id: CreditBalance['id']) {
    return this.creditBalanceRepository.remove(id);
  }
}
