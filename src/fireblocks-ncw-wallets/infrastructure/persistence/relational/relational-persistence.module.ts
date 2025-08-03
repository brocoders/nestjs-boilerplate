import { Module } from '@nestjs/common';
import { FireblocksNcwWalletRepository } from '../fireblocks-ncw-wallet.repository';
import { FireblocksNcwWalletRelationalRepository } from './repositories/fireblocks-ncw-wallet.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FireblocksNcwWalletEntity } from './entities/fireblocks-ncw-wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FireblocksNcwWalletEntity])],
  providers: [
    {
      provide: FireblocksNcwWalletRepository,
      useClass: FireblocksNcwWalletRelationalRepository,
    },
  ],
  exports: [FireblocksNcwWalletRepository],
})
export class RelationalFireblocksNcwWalletPersistenceModule {}
