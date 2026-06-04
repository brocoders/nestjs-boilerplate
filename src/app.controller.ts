import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly service: AppService) {}

  @Get()
  appInfo() {
    return this.service.appInfo();
  }
}
