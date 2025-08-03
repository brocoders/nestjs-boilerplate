import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { WalletsController } from './wallets.controller';
import { RelationalWalletPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    // do not remove this comment
    RelationalWalletPersistenceModule,
  ],
  controllers: [WalletsController],
  providers: [WalletsService],
  exports: [WalletsService, RelationalWalletPersistenceModule],
})
export class WalletsModule {}
