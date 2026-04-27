import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { FxRateFetcherService } from './fx-rate-fetcher.service';

@Processor('fx-rates')
export class FxRateProcessor extends WorkerHost {
  private readonly log = new Logger(FxRateProcessor.name);

  constructor(private readonly fetcher: FxRateFetcherService) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.log.log(`FX job ${job.id} starting`);
    await this.fetcher.fetchAndStore();
  }
}
