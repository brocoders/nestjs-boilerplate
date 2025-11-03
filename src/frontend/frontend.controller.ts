import { Controller, Get, Render } from '@nestjs/common';
import { CompanyProfileService } from '../company-profile/company-profile.service';

@Controller()
export class FrontendController {
  constructor(private readonly companyProfileService: CompanyProfileService) {}

  @Get('/')
  @Render('layouts/pages/home')
  async getHome() {
    const companyData =
      await this.companyProfileService.getCompanyProfileData();

    return {
      title: 'Selamat datang Farida!',
      theme: 'dark-theme.css',
      name: 'far company',
      produkList: companyData.produkList,
      strukturOrganisasi: companyData.strukturOrganisasi,
      fiturList: companyData.fiturList,
      pricingList: companyData.pricingList,
    };
  }
}
