import { Module } from '@nestjs/common';
import { FireblocksCwWalletRepository } from '../fireblocks-cw-wallet.repository';
import { FireblocksCwWalletRelationalRepository } from './repositories/fireblocks-cw-wallet.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FireblocksCwWalletEntity } from './entities/fireblocks-cw-wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FireblocksCwWalletEntity])],
  providers: [
    {
      provide: FireblocksCwWalletRepository,
      useClass: FireblocksCwWalletRelationalRepository,
    },
  ],
  exports: [FireblocksCwWalletRepository],
})
export class RelationalFireblocksCwWalletPersistenceModule {}
