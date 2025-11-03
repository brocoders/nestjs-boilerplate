import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { OrganizationMembersService } from '../organization-members/organization-members.service';
import { FeaturesService } from '../features/features.service';
import { PricingsService } from '../pricings/pricings.service';

@Injectable()
export class CompanyProfileService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly organizationMembersService: OrganizationMembersService,
    private readonly featuresService: FeaturesService,
    private readonly pricingsService: PricingsService,
  ) {}

  async getCompanyProfileData() {
    const [produkList, strukturOrganisasi, fiturList, pricingList] =
      await Promise.all([
        this.productsService.findAll(),
        this.organizationMembersService.findAll(),
        this.featuresService.findAll(),
        this.pricingsService.findAll(),
      ]);

    return {
      produkList,
      strukturOrganisasi,
      fiturList,
      pricingList,
    };
  }
}
