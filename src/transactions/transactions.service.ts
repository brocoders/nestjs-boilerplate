import { PaymentsService } from '../payments/payments.service';
import { Payment } from '../payments/domain/payment';

import { AccountsService } from '../accounts/accounts.service';
import { Account } from '../accounts/domain/account';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionRepository } from './infrastructure/persistence/transaction.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Transaction } from './domain/transaction';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject(forwardRef(() => PaymentsService))
    private readonly paymentService: PaymentsService,

    private readonly accountService: AccountsService,

    // Dependencies here
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    // Do not remove comment below.
    // <creating-property />
    const paymentObject = await this.paymentService.findById(
      createTransactionDto.payment.id,
    );
    if (!paymentObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          payment: 'notExists',
        },
      });
    }
    const payment = paymentObject;

    const creditAccountObjects = await this.accountService.findByIds(
      createTransactionDto.creditAccount.map((entity) => entity.id),
    );
    if (
      creditAccountObjects.length !== createTransactionDto.creditAccount.length
    ) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          creditAccount: 'notExists',
        },
      });
    }
    const creditAccount = creditAccountObjects;

    const debitAccountObjects = await this.accountService.findByIds(
      createTransactionDto.debitAccount.map((entity) => entity.id),
    );
    if (
      debitAccountObjects.length !== createTransactionDto.debitAccount.length
    ) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          debitAccount: 'notExists',
        },
      });
    }
    const debitAccount = debitAccountObjects;

    return this.transactionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      payment,

      creditAccountName: createTransactionDto.creditAccountName,

      debitAccountName: createTransactionDto.debitAccountName,

      creditAmount: createTransactionDto.creditAmount,

      debitAmount: createTransactionDto.debitAmount,

      owner: createTransactionDto.owner,

      creditAccount,

      debitAccount,

      amount: createTransactionDto.amount,

      description: createTransactionDto.description,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.transactionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Transaction['id']) {
    return this.transactionRepository.findById(id);
  }

  findByIds(ids: Transaction['id'][]) {
    return this.transactionRepository.findByIds(ids);
  }

  async update(
    id: Transaction['id'],

    updateTransactionDto: UpdateTransactionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let payment: Payment | undefined = undefined;

    if (updateTransactionDto.payment) {
      const paymentObject = await this.paymentService.findById(
        updateTransactionDto.payment.id,
      );
      if (!paymentObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            payment: 'notExists',
          },
        });
      }
      payment = paymentObject;
    }

    let creditAccount: Account[] | undefined = undefined;

    if (updateTransactionDto.creditAccount) {
      const creditAccountObjects = await this.accountService.findByIds(
        updateTransactionDto.creditAccount.map((entity) => entity.id),
      );
      if (
        creditAccountObjects.length !==
        updateTransactionDto.creditAccount.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            creditAccount: 'notExists',
          },
        });
      }
      creditAccount = creditAccountObjects;
    }

    let debitAccount: Account[] | undefined = undefined;

    if (updateTransactionDto.debitAccount) {
      const debitAccountObjects = await this.accountService.findByIds(
        updateTransactionDto.debitAccount.map((entity) => entity.id),
      );
      if (
        debitAccountObjects.length !== updateTransactionDto.debitAccount.length
      ) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            debitAccount: 'notExists',
          },
        });
      }
      debitAccount = debitAccountObjects;
    }

    return this.transactionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      payment,

      creditAccountName: updateTransactionDto.creditAccountName,

      debitAccountName: updateTransactionDto.debitAccountName,

      creditAmount: updateTransactionDto.creditAmount,

      debitAmount: updateTransactionDto.debitAmount,

      owner: updateTransactionDto.owner,

      creditAccount,

      debitAccount,

      amount: updateTransactionDto.amount,

      description: updateTransactionDto.description,
    });
  }

  remove(id: Transaction['id']) {
    return this.transactionRepository.remove(id);
  }
}
