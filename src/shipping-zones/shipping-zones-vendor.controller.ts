import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { ShippingZone } from './domain/shipping-zone';
import { CreateShippingZoneDto } from './dto/create-shipping-zone.dto';
import { UpdateShippingZoneDto } from './dto/update-shipping-zone.dto';
import { ShippingZonesService } from './shipping-zones.service';

@ApiTags('Vendor · Shipping zones')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'vendor/shipping-zones', version: '1' })
export class ShippingZonesVendorController {
  constructor(private readonly service: ShippingZonesService) {}

  @Get()
  @ApiOkResponse({ type: ShippingZone, isArray: true })
  async list(@Req() req: Request): Promise<ShippingZone[]> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.listMine(vendor.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: ShippingZone })
  async create(
    @Req() req: Request,
    @Body() dto: CreateShippingZoneDto,
  ): Promise<ShippingZone> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.create(vendor.id, {
      name: dto.name,
      countryCodes: dto.countryCodes,
      regionCodes: dto.regionCodes,
      costMinorUnits: dto.costMinorUnits,
      currencyCode: dto.currencyCode,
      freeAboveMinorUnits: dto.freeAboveMinorUnits ?? null,
      estDeliveryDaysMin: dto.estDeliveryDaysMin,
      estDeliveryDaysMax: dto.estDeliveryDaysMax,
    });
  }

  @Patch(':id')
  @ApiOkResponse({ type: ShippingZone })
  async update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateShippingZoneDto,
  ): Promise<ShippingZone> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    return this.service.update(vendor.id, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async remove(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const userId = (req.user as { id: number }).id;
    const vendor = await this.service.getCallingActiveVendor(userId);
    await this.service.delete(vendor.id, id);
  }
}
