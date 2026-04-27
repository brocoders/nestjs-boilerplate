import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { RoleEnum } from '../roles/roles.enum';
import { Vendor } from './domain/vendor';
import { VendorsService } from './vendors.service';
import { VendorListQueryDto } from './dto/vendor-list-query.dto';

@ApiTags('Admin · Vendors')
@ApiBearerAuth('jwt')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.admin)
@Controller({ path: 'admin/vendors', version: '1' })
export class VendorAdminController {
  constructor(private readonly service: VendorsService) {}

  @Get()
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/Vendor' } },
        total: { type: 'number' },
      },
    },
  })
  list(@Query() query: VendorListQueryDto) {
    return this.service.list(query);
  }

  @Patch(':id/approve')
  @ApiOkResponse({ type: Vendor })
  approve(@Param('id', ParseUUIDPipe) id: string): Promise<Vendor> {
    return this.service.approve(id);
  }

  @Patch(':id/reject')
  @ApiOkResponse({ type: Vendor })
  reject(@Param('id', ParseUUIDPipe) id: string): Promise<Vendor> {
    return this.service.reject(id);
  }

  @Patch(':id/suspend')
  @ApiOkResponse({ type: Vendor })
  suspend(@Param('id', ParseUUIDPipe) id: string): Promise<Vendor> {
    return this.service.suspend(id);
  }

  @Patch(':id/reinstate')
  @ApiOkResponse({ type: Vendor })
  reinstate(@Param('id', ParseUUIDPipe) id: string): Promise<Vendor> {
    return this.service.reinstate(id);
  }
}
