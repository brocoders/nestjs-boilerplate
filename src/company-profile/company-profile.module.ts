import { Module } from '@nestjs/common';
import { CompanyProfileService } from './company-profile.service';
import { ProductsModule } from '../products/products.module';
import { OrganizationMembersModule } from '../organization-members/organization-members.module';
import { FeaturesModule } from '../features/features.module';
import { PricingsModule } from '../pricings/pricings.module';

@Module({
  imports: [
    ProductsModule,
    OrganizationMembersModule,
    FeaturesModule,
    PricingsModule,
  ],
  providers: [CompanyProfileService],
  exports: [CompanyProfileService],
})
export class CompanyProfileModule {}
