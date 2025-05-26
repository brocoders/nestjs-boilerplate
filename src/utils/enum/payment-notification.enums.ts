export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REVERSED = 'reversed',
}

export enum PaymentMethod {
  MOBILE_MONEY = 'mobile_money',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer',
  CRYPTO = 'crypto',
  USSD = 'ussd',
  AGENCY_BANKING = 'agency_banking',
}

export enum Currency {
  KES = 'KES',
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  NGN = 'NGN',
  ZAR = 'ZAR',
  UGX = 'UGX',
  TZS = 'TZS',
  RWF = 'RWF',
}

export enum PaymentProvider {
  MPESA = 'mpesa',
  AIRTEL_MONEY = 'airtel_money',
  EQUITY_BANK = 'equity_bank',
  KCB_BANK = 'kcb_bank',
  COOPERATIVE_BANK = 'cooperative_bank',
  ABSA = 'absa',
  NCBA = 'ncba',
  SAFARICOM = 'safaricom', // for M-PESA APIs, merchant integrations
  PAYPAL = 'paypal',
  FLUTTERWAVE = 'flutterwave',
  PAYSTACK = 'paystack',
  STRIPE = 'stripe',
  COINBASE = 'coinbase',
}
