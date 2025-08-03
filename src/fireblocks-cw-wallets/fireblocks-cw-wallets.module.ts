import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { FireblocksCwWalletsService } from './fireblocks-cw-wallets.service';
import { FireblocksCwWalletsController } from './fireblocks-cw-wallets.controller';
import { RelationalFireblocksCwWalletPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    // do not remove this comment
    RelationalFireblocksCwWalletPersistenceModule,
  ],
  controllers: [FireblocksCwWalletsController],
  providers: [FireblocksCwWalletsService],
  exports: [
    FireblocksCwWalletsService,
    RelationalFireblocksCwWalletPersistenceModule,
  ],
})
export class FireblocksCwWalletsModule {}
