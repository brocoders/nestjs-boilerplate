import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { VendorSignupDto } from './dto/vendor-signup.dto';
import { Vendor } from './domain/vendor';

@ApiTags('Vendor (public)')
@Controller({ path: 'vendor', version: '1' })
export class VendorPublicController {
  constructor(private readonly service: VendorsService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: Vendor })
  signup(@Body() dto: VendorSignupDto): Promise<Vendor> {
    return this.service.signup(dto);
  }
}
