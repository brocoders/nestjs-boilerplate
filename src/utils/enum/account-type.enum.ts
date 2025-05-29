export enum AccountTypeEnum {
  asset = 'asset',
  liability = 'liability',
  equity = 'equity',
  revenue = 'revenue',
  expense = 'expense',
}

export enum NotificationChannelEnum {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WEBHOOK = 'WEBHOOK',
}

export enum NotificationTypeEnum {
  ALERT = 'ALERT',
  REMINDER = 'REMINDER',
  REPORT = 'REPORT',
}

export enum TransactionTypeEnum {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
  TRANSFER = 'TRANSFER',
  REFUND = 'REFUND',
  WRITE_OFF = 'WRITE_OFF',
  LATE_FEE = 'LATE_FEE',
  ADJUSTMENT = 'ADJUSTMENT',
  CREDIT_MEMO = 'CREDIT_MEMO',
  INVOICE_PAYMENT = 'INVOICE_PAYMENT',
  CHARGEBACK = 'CHARGEBACK',
  PAYMENT = 'PAYMENT',
  DISCOUNT = 'DISCOUNT',
  FEE = 'FEE',
  TAX = 'TAX',
  INTEREST = 'INTEREST',
  REVERSAL = 'REVERSAL',
  PREPAYMENT = 'PREPAYMENT',
  OVERPAYMENT = 'OVERPAYMENT',
  UNDERPAYMENT = 'UNDERPAYMENT',
  ESCALATION_CHARGE = 'ESCALATION_CHARGE',
  SERVICE_CHARGE = 'SERVICE_CHARGE',
  PENALTY = 'PENALTY',
  CASH_RECEIPT = 'CASH_RECEIPT',
  ALLOCATION = 'ALLOCATION',
  MANUAL_ENTRY = 'MANUAL_ENTRY',
}

export enum DiscountTypeEnum {
  FIXED_AMOUNT = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}
