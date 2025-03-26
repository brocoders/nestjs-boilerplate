// src/shared/tracing/otel-loader.ts
import { sdk } from './otel-sdk';
// import { printAllMetricsEvery } from './print-metrics.service';

export async function bootstrapOpenTelemetry() {
    await sdk.start();
    console.log('OpenTelemetry SDK started');
    // printAllMetricsEvery(10);

    process.on('SIGTERM', async () => {
        await sdk.shutdown();
        console.log('OpenTelemetry SDK stopped');
    });
}
