import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { IsArray, IsString, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { HybridReviewService } from './hybrid-review.service';

class IngestDto {
  @IsString()
  contractId!: string;

  @IsString()
  title!: string;

  @IsArray()
  @ArrayNotEmpty()
  @Type(() => String)
  sources!: string[];

  @IsString()
  contractType!: string;
}

@Controller('hybrid')
export class HybridReviewController {
  constructor(private readonly hybridService: HybridReviewService) {}

  @Post('ingest')
  async ingestContract(
    @Body()
    body: IngestDto,
  ) {
    const text = await this.hybridService.extractText(body.sources);
    const clauses = await this.hybridService.extractClauses(
      text,
      body.contractType,
    );
    await this.hybridService.saveContract(body.contractId, body.title, clauses);
    return { clauseCount: clauses.length };
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return this.hybridService.searchClauses(q);
  }
}
