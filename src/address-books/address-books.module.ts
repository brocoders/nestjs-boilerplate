import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { AddressBooksService } from './address-books.service';
import { AddressBooksController } from './address-books.controller';
import { RelationalAddressBookPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,
    // do not remove this comment
    RelationalAddressBookPersistenceModule,
  ],
  controllers: [AddressBooksController],
  providers: [AddressBooksService],
  exports: [AddressBooksService, RelationalAddressBookPersistenceModule],
})
export class AddressBooksModule {}
