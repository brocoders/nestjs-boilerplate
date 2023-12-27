import { Module } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { UsersRelationalRepository } from './repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    {
      provide: UserRepository,
      useClass: UsersRelationalRepository,
    },
  ],
  exports: [UserRepository],
})
export class RelationalUserPersistenceModule {}
