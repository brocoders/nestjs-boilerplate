import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HomeService {
  constructor(private configService: ConfigService) {}

  appInfo() {
    return { name: this.configService.get('app.name') };
  }
}
