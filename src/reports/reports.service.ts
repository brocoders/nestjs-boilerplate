import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  // ----------------- Financial Accounting Reports -----------------

  async getIncomeStatement(startDate: string, endDate: string) {
    await Promise.resolve();
    return {
      period: { startDate, endDate },
      revenue: 120000,
      expenses: {
        salaries: 30000,
        utilities: 8000,
        fuel: 5000,
        maintenance: 7000,
        depreciation: 4000,
        admin: 6000,
      },
      totalExpenses: 60000,
      profit: 60000,
    };
  }

  async getBalanceSheet(asOfDate: string) {
    await Promise.resolve();
    return {
      asOfDate,
      assets: {
        cash: 50000,
        accountsReceivable: 30000,
        equipment: 40000,
        vehicles: 20000,
        prepaidExpenses: 5000,
      },
      liabilities: {
        loans: 20000,
        accountsPayable: 15000,
      },
      equity: {
        retainedEarnings: 40000,
        ownerEquity: 50000,
      },
    };
  }

  async getCashFlow(startDate: string, endDate: string) {
    await Promise.resolve();
    return {
      period: { startDate, endDate },
      operating: 25000,
      investing: -10000,
      financing: 7000,
      netCashFlow: 22000,
      breakdown: {
        receivedPayments: 60000,
        paidSalaries: -25000,
        fuelCosts: -3000,
      },
    };
  }

  async getTrialBalance(asOfDate: string) {
    await Promise.resolve();
    return [
      { account: 'Cash', debit: 20000, credit: 0 },
      { account: 'Sales Revenue', debit: 0, credit: 35000 },
      { account: 'Accounts Payable', debit: 0, credit: 5000 },
      { account: 'Utilities Expense', debit: 2000, credit: 0 },
      asOfDate,
    ];
  }

  async getGeneralLedger(startDate: string, endDate: string) {
    await Promise.resolve();
    return [
      {
        date: startDate,
        account: 'Cash',
        debit: 5000,
        credit: 0,
        description: 'Customer payment received',
        reference: 'INV-1234',
      },
      {
        date: endDate,
        account: 'Sales Revenue',
        debit: 0,
        credit: 5000,
        description: 'Service rendered to customer',
        reference: 'INV-1234',
      },
    ];
  }

  async getAccountsReceivableAging() {
    await Promise.resolve();
    return [
      {
        customer: 'ACME Ltd.',
        current: 5000,
        '30_days': 2000,
        '60_days': 1000,
      },
      { customer: 'Beta Inc.', current: 0, '30_days': 1500, '60_days': 2500 },
    ];
  }

  async getAccountsPayableAging() {
    await Promise.resolve();
    return [
      { vendor: 'WasteCorp', current: 3000, '30_days': 1000, '60_days': 0 },
      {
        vendor: 'Green Supplies',
        current: 0,
        '30_days': 2000,
        '60_days': 1500,
      },
    ];
  }

  async getInventoryValuation() {
    await Promise.resolve();
    return {
      totalValue: 15000,
      items: [
        { name: 'Plastic Bins', count: 120, value: 6000 },
        { name: 'Waste Bags', count: 500, value: 3000 },
        { name: 'Protective Gear', count: 200, value: 6000 },
      ],
    };
  }

  async getUnappliedPayments() {
    await Promise.resolve();
    return [
      { customer: 'Alice', amount: 1500 },
      { customer: 'Bob', amount: 850 },
    ];
  }

  async getOverpayments() {
    await Promise.resolve();
    return [
      { customer: 'Carol', invoice: 'INV-0087', amount: 250 },
      { customer: 'Dave', invoice: 'INV-0091', amount: 400 },
    ];
  }

  // ----------------- Operational & Statistical Reports -----------------

  async getRevenueByCustomer() {
    await Promise.resolve();
    return [
      { customer: 'Alice', revenue: 20000 },
      { customer: 'Bob', revenue: 18000 },
      { customer: 'Carol', revenue: 15000 },
    ];
  }

  async getRevenueByPlan() {
    await Promise.resolve();
    return [
      { plan: 'Standard', revenue: 30000 },
      { plan: 'Premium', revenue: 50000 },
      { plan: 'Enterprise', revenue: 20000 },
    ];
  }

  async getPaymentMethodSummary() {
    await Promise.resolve();
    return [
      { method: 'Cash', transactions: 100, amount: 10000 },
      { method: 'Bank Transfer', transactions: 50, amount: 25000 },
      { method: 'Mpesa', transactions: 120, amount: 40000 },
    ];
  }

  async getDiscountsSummary() {
    await Promise.resolve();
    return [
      { type: 'Seasonal', count: 20, totalAmount: 5000 },
      { type: 'Referral', count: 12, totalAmount: 3000 },
    ];
  }

  async getExemptionsSummary() {
    await Promise.resolve();
    return [
      { type: 'Senior Citizen', granted: 10 },
      { type: 'Low Income Household', granted: 8 },
    ];
  }

  async getRemindersPerformance() {
    await Promise.resolve();
    return {
      totalSent: 600,
      delivered: 570,
      failed: 30,
      byChannel: {
        SMS: 400,
        Email: 150,
        Push: 50,
      },
    };
  }

  async getCollectionCompliance() {
    await Promise.resolve();
    return {
      totalScheduled: 1000,
      completed: 920,
      missed: 80,
      complianceRate: '92%',
    };
  }

  async getBinUsageStats() {
    await Promise.resolve();
    return {
      totalBins: 300,
      rotations: 1500,
      averagePerCustomer: 5,
    };
  }

  async getCreditBalanceSummary() {
    await Promise.resolve();
    return [
      { customer: 'John Doe', balance: 200 },
      { customer: 'Jane Smith', balance: 350 },
      { customer: 'Sam K.', balance: 100 },
    ];
  }

  async getActiveVsInactiveCustomers() {
    await Promise.resolve();
    return {
      active: 1100,
      inactive: 250,
      newThisMonth: 100,
    };
  }

  async getFailedPayments() {
    await Promise.resolve();
    return [
      {
        customer: 'Maxwell',
        amount: 120,
        reason: 'Card declined',
        attempts: 2,
        lastAttempt: new Date().toISOString(),
      },
    ];
  }

  async getRevenueGrowth(period: string) {
    await Promise.resolve();
    return {
      period,
      data: [
        { month: 'Jan', revenue: 10000 },
        { month: 'Feb', revenue: 15000 },
        { month: 'Mar', revenue: 18000 },
      ],
    };
  }

  async getRegionPerformance() {
    await Promise.resolve();
    return [
      { region: 'Central', revenue: 30000, collectionRate: 92 },
      { region: 'East', revenue: 25000, collectionRate: 85 },
      { region: 'West', revenue: 28000, collectionRate: 89 },
    ];
  }

  // ----------------- Dashboards per Role -----------------

  async getPlatformOwnerStats() {
    await Promise.resolve();
    return {
      totalRevenue: 250000,
      totalCustomers: 3000,
      activePlans: 5,
      activeRegions: 4,
    };
  }

  async getAdminDashboardStats() {
    await Promise.resolve();
    return {
      totalUsers: 120,
      newUsersToday: 5,
      systemHealth: 'Good',
      activeSessions: 30,
    };
  }

  async getAgentDashboardStats(agentId: string) {
    await Promise.resolve();
    return {
      agentId,
      managedCustomers: 200,
      successfulCollections: 150,
      missedCollections: 10,
    };
  }

  async getCustomerDashboardStats(customerId: string) {
    await Promise.resolve();
    return {
      customerId,
      invoicesIssued: 12,
      invoicesPaid: 10,
      outstandingBalance: 100,
      serviceStatus: 'Active',
    };
  }

  async getManagerDashboardStats(regionId: string) {
    await Promise.resolve();
    return {
      regionId,
      activeAgents: 10,
      complianceRate: 94,
      complaintsThisMonth: 3,
    };
  }

  async getFinanceDashboardStats() {
    await Promise.resolve();
    return {
      incomeStatement: {
        revenue: 100000,
        expenses: 65000,
        profit: 35000,
      },
      receivables: 30000,
      payables: 18000,
      cashOnHand: 20000,
    };
  }

  async getGuestDashboardStats() {
    await Promise.resolve();
    return {
      publicStats: {
        registeredUsers: 5000,
        coverageRegions: 8,
        binsInCirculation: 1200,
      },
      message: 'Welcome to the public waste services portal.',
    };
  }
}
