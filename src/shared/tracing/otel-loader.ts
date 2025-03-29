import { sdk } from './otel-sdk';

export async function bootstrapOpenTelemetry() {
  await sdk.start();
  console.log('OpenTelemetry SDK started');

  process.on('SIGTERM', async () => {
    await sdk.shutdown();
    console.log('OpenTelemetry SDK stopped');
  });
}
