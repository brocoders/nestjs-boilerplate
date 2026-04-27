import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class FxRateScheduler implements OnModuleInit {
  private readonly log = new Logger(FxRateScheduler.name);

  constructor(@InjectQueue('fx-rates') private readonly queue: Queue) {}

  async onModuleInit(): Promise<void> {
    // Daily at 02:00 UTC. Idempotent — BullMQ replaces the existing repeatable job
    // with the same key on each boot.
    await this.queue.add(
      'fetch-daily',
      {},
      {
        repeat: { pattern: '0 2 * * *' },
        jobId: 'fx-fetch-daily',
        removeOnComplete: 100,
        removeOnFail: 100,
      },
    );
    this.log.log('Scheduled daily FX fetch at 02:00 UTC');
  }
}
