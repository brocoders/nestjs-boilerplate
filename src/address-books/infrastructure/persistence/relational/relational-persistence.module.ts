import { Module } from '@nestjs/common';
import { AddressBookRepository } from '../address-book.repository';
import { AddressBookRelationalRepository } from './repositories/address-book.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressBookEntity } from './entities/address-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressBookEntity])],
  providers: [
    {
      provide: AddressBookRepository,
      useClass: AddressBookRelationalRepository,
    },
  ],
  exports: [AddressBookRepository],
})
export class RelationalAddressBookPersistenceModule {}
