import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PricingsService } from './pricings.service';
import { CreatePricingDto } from './dto/create-pricing.dto';
import { UpdatePricingDto } from './dto/update-pricing.dto';
import { PricingResponseDto } from './dto/pricing-response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Pricings')
@Controller('pricings')
export class PricingsController {
  constructor(private readonly pricingsService: PricingsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new pricing' })
  @ApiResponse({
    status: 201,
    description: 'Pricing created successfully',
    type: PricingResponseDto,
  })
  create(
    @Body() createPricingDto: CreatePricingDto,
  ): Promise<PricingResponseDto> {
    return this.pricingsService.create(createPricingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pricings' })
  @ApiResponse({
    status: 200,
    description: 'List of pricings',
    type: [PricingResponseDto],
  })
  findAll(): Promise<PricingResponseDto[]> {
    return this.pricingsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pricing by ID' })
  @ApiResponse({
    status: 200,
    description: 'Pricing found',
    type: PricingResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Pricing not found' })
  findOne(@Param('id') id: string): Promise<PricingResponseDto> {
    return this.pricingsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a pricing' })
  @ApiResponse({
    status: 200,
    description: 'Pricing updated successfully',
    type: PricingResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updatePricingDto: UpdatePricingDto,
  ): Promise<PricingResponseDto> {
    return this.pricingsService.update(id, updatePricingDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a pricing' })
  @ApiResponse({ status: 200, description: 'Pricing deleted successfully' })
  remove(@Param('id') id: string): Promise<void> {
    return this.pricingsService.remove(id);
  }
}
