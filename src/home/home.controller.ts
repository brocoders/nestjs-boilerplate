import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { HomeService } from './home.service';

@ApiTags('Home')
@Controller()
export class HomeController {
  constructor(private readonly service: HomeService) {}

  @Get()
  appInfo() {
    return this.service.appInfo();
  }
}
