import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CheckoutService, QuoteResult } from './checkout.service';
import { QuoteDto } from './dto/quote.dto';

@ApiTags('Buyer · Checkout')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'checkout', version: '1' })
export class CheckoutController {
  constructor(private readonly checkout: CheckoutService) {}

  @Post('quote')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description:
      'Per-vendor breakdown of the buyer cart (subtotals, shipping, totals). ' +
      'Read-only — does not place an order.',
  })
  async quote(
    @Req() req: Request,
    @Body() dto: QuoteDto,
  ): Promise<QuoteResult> {
    const userId = (req.user as { id: number }).id;
    return this.checkout.quote(userId, {
      fullName: dto.address.fullName,
      phone: dto.address.phone,
      country: dto.address.country,
      region: dto.address.region ?? null,
      city: dto.address.city,
      postalCode: dto.address.postalCode ?? null,
      street: dto.address.street,
      notes: dto.address.notes ?? null,
    });
  }
}
