import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { StandardClause } from './entities/standard-clause.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StandardClause])],
  controllers: [TemplateController],
  providers: [TemplateService],
  exports: [TemplateService],
})
export class TemplateModule {}
