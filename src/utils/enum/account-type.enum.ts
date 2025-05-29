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
}
export enum DiscountTypeEnum {
  FIXED_AMOUNT = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}
