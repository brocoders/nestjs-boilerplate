import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';


@Module({

  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
