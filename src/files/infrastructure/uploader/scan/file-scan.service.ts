import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { scanBuffer, Verdict } from 'pompelmi';

@Injectable()
export class FileScanService {
  async scanBuffer(buffer: Buffer): Promise<void> {
    let result: symbol;

    try {
      result = await scanBuffer(buffer, {
        host: process.env.CLAMAV_HOST ?? '127.0.0.1',
        port: Number(process.env.CLAMAV_PORT ?? 3310),
      });
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'fileScanUnavailable',
        },
      });
    }

    if (result === Verdict.Malicious) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'fileMalwareDetected',
        },
      });
    }

    if (result === Verdict.ScanError) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          file: 'fileScanError',
        },
      });
    }
  }
}
