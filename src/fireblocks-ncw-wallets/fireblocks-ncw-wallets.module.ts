import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { FireblocksNcwWalletsService } from './fireblocks-ncw-wallets.service';
import { FireblocksNcwWalletsController } from './fireblocks-ncw-wallets.controller';
import { RelationalFireblocksNcwWalletPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalFireblocksNcwWalletPersistenceModule,
  ],
  controllers: [FireblocksNcwWalletsController],
  providers: [FireblocksNcwWalletsService],
  exports: [
    FireblocksNcwWalletsService,
    RelationalFireblocksNcwWalletPersistenceModule,
  ],
})
export class FireblocksNcwWalletsModule {}
