import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandardClause } from '../../entities/standard-clause.entity';
import { StandardClausesService } from './standard-clauses.service';
import { StandardClausesController } from './standard-clauses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StandardClause])],
  controllers: [StandardClausesController],
  providers: [StandardClausesService],
  exports: [StandardClausesService],
})
export class StandardClausesModule {} 