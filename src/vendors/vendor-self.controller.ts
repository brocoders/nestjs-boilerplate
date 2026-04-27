import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Vendor } from './domain/vendor';
import { VendorsService } from './vendors.service';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import type { Request } from 'express';

@ApiTags('Vendor (self)')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'vendor', version: '1' })
export class VendorSelfController {
  constructor(private readonly service: VendorsService) {}

  @Get('me')
  @ApiOkResponse({ type: Vendor })
  async getMe(@Req() req: Request): Promise<Vendor> {
    const userId = (req.user as { id: number }).id;
    const v = await this.service.getByUserId(userId);
    if (!v) throw new NotFoundException('You do not have a vendor account');
    return v;
  }

  @Patch('me')
  @ApiOkResponse({ type: Vendor })
  async updateMe(
    @Req() req: Request,
    @Body() dto: UpdateVendorDto,
  ): Promise<Vendor> {
    const userId = (req.user as { id: number }).id;
    return this.service.updateMine(userId, dto);
  }
}
