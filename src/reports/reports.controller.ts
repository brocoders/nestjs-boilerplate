import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({ path: 'reports', version: '1' })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // 📊 FINANCIAL ACCOUNTING REPORTS

  @Get('income-statement')
  @ApiOkResponse({ description: 'Income Statement (Profit & Loss)' })
  getIncomeStatement(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getIncomeStatement(startDate, endDate);
  }

  @Get('balance-sheet')
  @ApiOkResponse({ description: 'Balance Sheet' })
  getBalanceSheet(@Query('asOfDate') asOfDate: string) {
    return this.reportsService.getBalanceSheet(asOfDate);
  }

  @Get('cash-flow')
  @ApiOkResponse({ description: 'Cash Flow Statement' })
  getCashFlowStatement(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getCashFlow(startDate, endDate);
  }

  @Get('trial-balance')
  @ApiOkResponse({ description: 'Trial Balance' })
  getTrialBalance(@Query('asOfDate') asOfDate: string) {
    return this.reportsService.getTrialBalance(asOfDate);
  }

  @Get('general-ledger')
  @ApiOkResponse({ description: 'General Ledger Entries' })
  getGeneralLedger(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getGeneralLedger(startDate, endDate);
  }

  @Get('ar-aging')
  @ApiOkResponse({ description: 'Accounts Receivable Aging Report' })
  getAccountsReceivableAging() {
    return this.reportsService.getAccountsReceivableAging();
  }

  @Get('ap-aging')
  @ApiOkResponse({ description: 'Accounts Payable Aging Report' })
  getAccountsPayableAging() {
    return this.reportsService.getAccountsPayableAging();
  }

  @Get('inventory-valuation')
  @ApiOkResponse({ description: 'Inventory Valuation Report' })
  getInventoryValuation() {
    return this.reportsService.getInventoryValuation();
  }

  @Get('unapplied-payments')
  @ApiOkResponse({ description: 'Unapplied Payments Report' })
  getUnappliedPayments() {
    return this.reportsService.getUnappliedPayments();
  }

  @Get('overpayments')
  @ApiOkResponse({ description: 'Customer Overpayments Report' })
  getOverpayments() {
    return this.reportsService.getOverpayments();
  }

  // 📈 OPERATIONAL & STATISTICAL REPORTS

  @Get('revenue-by-customer')
  @ApiOkResponse({ description: 'Revenue by Customer Report' })
  getRevenueByCustomer() {
    return this.reportsService.getRevenueByCustomer();
  }

  @Get('revenue-by-plan')
  @ApiOkResponse({ description: 'Revenue by Payment Plan Report' })
  getRevenueByPlan() {
    return this.reportsService.getRevenueByPlan();
  }

  @Get('payment-method-summary')
  @ApiOkResponse({
    description: 'Summary of Payments by Method (Cash, Bank, Mpesa, etc.)',
  })
  getPaymentMethodSummary() {
    return this.reportsService.getPaymentMethodSummary();
  }

  @Get('discounts-summary')
  @ApiOkResponse({ description: 'Summary of Discounts Applied' })
  getDiscountsSummary() {
    return this.reportsService.getDiscountsSummary();
  }

  @Get('exemptions-summary')
  @ApiOkResponse({ description: 'Summary of Exemptions Granted' })
  getExemptionsSummary() {
    return this.reportsService.getExemptionsSummary();
  }

  @Get('reminders-performance')
  @ApiOkResponse({ description: 'Reminder Notification Delivery Performance' })
  getRemindersPerformance() {
    return this.reportsService.getRemindersPerformance();
  }

  @Get('collection-compliance')
  @ApiOkResponse({ description: 'Waste Collection Compliance vs. Schedule' })
  getCollectionCompliance() {
    return this.reportsService.getCollectionCompliance();
  }

  @Get('bin-usage-stats')
  @ApiOkResponse({ description: 'Bin Usage and Rotation Statistics' })
  getBinUsageStats() {
    return this.reportsService.getBinUsageStats();
  }

  @Get('credit-balance-summary')
  @ApiOkResponse({ description: 'Summary of Credit Balances' })
  getCreditBalanceSummary() {
    return this.reportsService.getCreditBalanceSummary();
  }

  @Get('active-vs-inactive-customers')
  @ApiOkResponse({ description: 'Active vs Inactive Customers Overview' })
  getActiveVsInactiveCustomers() {
    return this.reportsService.getActiveVsInactiveCustomers();
  }

  @Get('failed-payments')
  @ApiOkResponse({ description: 'Failed Payment Attempts Report' })
  getFailedPayments() {
    return this.reportsService.getFailedPayments();
  }

  @Get('revenue-growth')
  @ApiOkResponse({ description: 'Revenue Growth Over Time' })
  getRevenueGrowth(@Query('period') period: string) {
    return this.reportsService.getRevenueGrowth(period);
  }

  @Get('region-performance')
  @ApiOkResponse({ description: 'Revenue and Collection by Region' })
  getRegionPerformance() {
    return this.reportsService.getRegionPerformance();
  }

  @Get('dashboard/platform-owner')
  @ApiOkResponse({ description: 'Stats for Platform Owner Dashboard' })
  getPlatformOwnerStats() {
    return this.reportsService.getPlatformOwnerStats();
  }

  @Get('dashboard/admin')
  @ApiOkResponse({ description: 'Stats for Admin Dashboard' })
  getAdminDashboardStats() {
    return this.reportsService.getAdminDashboardStats();
  }

  @Get('dashboard/agent')
  @ApiOkResponse({ description: 'Stats for Agent Dashboard' })
  getAgentDashboardStats(@Query('agentId') agentId: string) {
    return this.reportsService.getAgentDashboardStats(agentId);
  }

  @Get('dashboard/customer')
  @ApiOkResponse({ description: 'Stats for Customer Dashboard' })
  getCustomerDashboardStats(@Query('customerId') customerId: string) {
    return this.reportsService.getCustomerDashboardStats(customerId);
  }

  @Get('dashboard/manager')
  @ApiOkResponse({ description: 'Stats for Manager Dashboard' })
  getManagerDashboardStats(@Query('regionId') regionId: string) {
    return this.reportsService.getManagerDashboardStats(regionId);
  }

  @Get('dashboard/finance')
  @ApiOkResponse({ description: 'Stats for Finance Dashboard' })
  getFinanceDashboardStats() {
    return this.reportsService.getFinanceDashboardStats();
  }

  @Get('dashboard/guest')
  @ApiOkResponse({ description: 'Stats for Guest or Basic User Dashboard' })
  getGuestDashboardStats() {
    return this.reportsService.getGuestDashboardStats();
  }
}
