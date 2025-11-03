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
import { FeaturesService } from './features.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { FeatureResponseDto } from './dto/feature-response.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Features')
@Controller('features')
export class FeaturesController {
  constructor(private readonly featuresService: FeaturesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a new feature' })
  @ApiResponse({
    status: 201,
    description: 'Feature created successfully',
    type: FeatureResponseDto,
  })
  create(
    @Body() createFeatureDto: CreateFeatureDto,
  ): Promise<FeatureResponseDto> {
    return this.featuresService.create(createFeatureDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all features' })
  @ApiResponse({
    status: 200,
    description: 'List of features',
    type: [FeatureResponseDto],
  })
  findAll(): Promise<FeatureResponseDto[]> {
    return this.featuresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a feature by ID' })
  @ApiResponse({
    status: 200,
    description: 'Feature found',
    type: FeatureResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Feature not found' })
  findOne(@Param('id') id: string): Promise<FeatureResponseDto> {
    return this.featuresService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a feature' })
  @ApiResponse({
    status: 200,
    description: 'Feature updated successfully',
    type: FeatureResponseDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateFeatureDto: UpdateFeatureDto,
  ): Promise<FeatureResponseDto> {
    return this.featuresService.update(id, updateFeatureDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Delete a feature' })
  @ApiResponse({ status: 200, description: 'Feature deleted successfully' })
  remove(@Param('id') id: string): Promise<void> {
    return this.featuresService.remove(id);
  }
}
