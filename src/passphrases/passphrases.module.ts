import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { PassphrasesService } from './passphrases.service';
import { PassphrasesController } from './passphrases.controller';
import { RelationalPassphrasePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    // do not remove this comment
    RelationalPassphrasePersistenceModule,
  ],
  controllers: [PassphrasesController],
  providers: [PassphrasesService],
  exports: [PassphrasesService, RelationalPassphrasePersistenceModule],
})
export class PassphrasesModule {}
