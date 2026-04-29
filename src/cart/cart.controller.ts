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
import { CartService } from './cart.service';
import { Cart } from './domain/cart';
import { CartItem } from './domain/cart-item';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('Buyer · Cart')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'cart', version: '1' })
export class CartController {
  constructor(private readonly service: CartService) {}

  @Get()
  @ApiOkResponse({ type: Cart })
  async getCurrent(@Req() req: Request): Promise<Cart> {
    const userId = (req.user as { id: number }).id;
    return this.service.getCurrent(userId);
  }

  @Post('items')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: CartItem })
  async addItem(
    @Req() req: Request,
    @Body() dto: AddCartItemDto,
  ): Promise<CartItem> {
    const userId = (req.user as { id: number }).id;
    return this.service.addItem(userId, dto.variantId, dto.quantity);
  }

  @Patch('items/:id')
  @ApiOkResponse({ type: CartItem })
  async updateItem(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const userId = (req.user as { id: number }).id;
    return this.service.updateQuantity(userId, id, dto.quantity);
  }

  @Delete('items/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async removeItem(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const userId = (req.user as { id: number }).id;
    await this.service.removeItem(userId, id);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async clear(@Req() req: Request): Promise<void> {
    const userId = (req.user as { id: number }).id;
    await this.service.clear(userId);
  }
}
