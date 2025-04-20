import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplatesService } from './templates.service';
import { TemplatesController } from './templates.controller';
import { StandardClause } from './entities/standard-clause.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandardClause])],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {} 