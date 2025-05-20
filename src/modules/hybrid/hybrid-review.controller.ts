import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { HybridReviewService } from './hybrid-review.service';

@Controller('hybrid')
export class HybridReviewController {
  constructor(private readonly hybridService: HybridReviewService) {}

  @Post('ingest')
  async ingestContract(
    @Body()
    body: {
      contractId: string;
      title: string;
      sources: Array<string>;
    },
  ) {
    const text = await this.hybridService.extractText(body.sources);
    const clauses = await this.hybridService.extractClauses(text);
    await this.hybridService.saveContract(body.contractId, body.title, clauses);
    return { clauseCount: clauses.length };
  }

  @Get('search')
  async search(@Query('q') q: string) {
    return this.hybridService.searchClauses(q);
  }
}
