import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInitialTables1748687772184 implements MigrationInterface {
  name = 'CreateInitialTables1748687772184';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "region" ("zipCodes" text array, "operatingHours" jsonb, "serviceTypes" jsonb, "centroidLat" numeric(9,6), "centroidLon" numeric(9,6), "boundary" geometry(Polygon,4326), "name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."settings_settingstype_enum" AS ENUM('invoice', 'billing', 'payment', 'tax', 'commission', 'notification', 'reminder', 'alert', 'waste', 'collection', 'processing', 'recycling', 'disposal', 'marketplace', 'listing', 'bidding', 'transaction', 'preferences', 'privacy', 'accessibility', 'compliance', 'certification', 'reporting', 'audit', 'api', 'integration', 'security', 'rate_limiting', 'localization', 'language', 'currency', 'timezone', 'theme', 'layout', 'dashboard', 'system', 'maintenance', 'backup', 'scaling', 'carbon_accounting', 'sustainability', 'routing', 'vehicle', 'driver')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."settings_subjecttype_enum" AS ENUM('tenant', 'user', 'system', 'collector', 'facility')`,
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("config" jsonb NOT NULL, "settingsType" "public"."settings_settingstype_enum" NOT NULL, "subjectType" "public"."settings_subjecttype_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."kyc_details_status_enum" AS ENUM('pending', 'verified', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."kyc_details_subjecttype_enum" AS ENUM('user', 'tenant')`,
    );
    await queryRunner.query(
      `CREATE TABLE "kyc_details" ("verifiedBy" integer, "verifiedAt" TIMESTAMP, "submittedAt" TIMESTAMP, "status" "public"."kyc_details_status_enum" NOT NULL DEFAULT 'pending', "documentData" jsonb, "documentNumber" character varying, "documentType" character varying, "subjectType" "public"."kyc_details_subjecttype_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_83983b321401e4ca9ebcc3317db" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "role" ("id" integer NOT NULL, "name" character varying NOT NULL, "tenantId" uuid NOT NULL, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "status" ("id" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e12743a7086ec826733f54e1d95" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "file" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "path" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("phoneNumber" character varying, "countryCode" character varying, "id" SERIAL NOT NULL, "email" character varying, "password" character varying, "provider" character varying NOT NULL DEFAULT 'email', "socialId" character varying, "firstName" character varying, "lastName" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "tenantId" uuid NOT NULL, "photoId" uuid, "roleId" integer, "statusId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "REL_75e2be4ce11d447ef43be0e374" UNIQUE ("photoId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9bd2fe7a8e694dedc4ec2f666f" ON "user" ("socialId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58e4dbff0e1a32a9bdc861bb29" ON "user" ("firstName") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f0e1b4ecdca13b177e2e3a0613" ON "user" ("lastName") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."onboarding_status_enum" AS ENUM('pending', 'completed', 'skipped', 'failed', 'not_applicable')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."onboarding_entitytype_enum" AS ENUM('user', 'tenant')`,
    );
    await queryRunner.query(
      `CREATE TABLE "onboarding" ("completedAt" TIMESTAMP, "metadata" jsonb, "isSkippable" boolean NOT NULL, "isRequired" boolean NOT NULL, "order" integer NOT NULL, "status" "public"."onboarding_status_enum" NOT NULL DEFAULT 'pending', "description" character varying NOT NULL, "name" character varying NOT NULL, "stepKey" character varying NOT NULL, "entityType" "public"."onboarding_entitytype_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "performedByTenantId" uuid NOT NULL, "performedByUserId" integer NOT NULL, CONSTRAINT "PK_b8b6cfe63674aaee17874f033cf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_49e82aae0315cc14bfb94de878" ON "onboarding" ("entityType") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tenant_type_code_enum" AS ENUM('platform_owner', 'community_group', 'recycling_company', 'collection_agency', 'municipality', 'enterprise', 'educational_institution', 'healthcare_provider', 'non_profit_organization', 'government_agency', 'technology_company', 'retail_business', 'manufacturing_company', 'transportation_service', 'financial_institution', 'agricultural_business', 'energy_provider', 'construction_company', 'hospitality_business', 'generic')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenant_type" ("description" character varying, "code" "public"."tenant_type_code_enum" NOT NULL, "name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4c0533c3a7e87116891dec23578" UNIQUE ("code"), CONSTRAINT "PK_4a98ba209be6df3b80a4feb5838" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenant" ("databaseConfig" jsonb NOT NULL, "domain" character varying, "schemaName" character varying, "address" character varying, "primaryPhone" character varying, "primaryEmail" character varying, "name" character varying, "isActive" boolean NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "logoId" uuid, "typeId" uuid, CONSTRAINT "REL_0ed69b4239b1f892b96798065a" UNIQUE ("logoId"), CONSTRAINT "PK_da8c6efd67bb301e810e56ac139" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_type_enum" AS ENUM('asset', 'liability', 'equity', 'revenue', 'expense')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_notificationchannel_enum" AS ENUM('EMAIL', 'SMS', 'WEBHOOK')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_notificationtype_enum" AS ENUM('ALERT', 'REMINDER', 'REPORT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("type" "public"."account_type_enum" NOT NULL, "active" boolean NOT NULL, "callbackUrl" character varying, "notificationChannel" "public"."account_notificationchannel_enum", "notificationType" "public"."account_notificationtype_enum", "receiveNotification" boolean NOT NULL, "balance" integer NOT NULL, "number" character varying, "description" character varying NOT NULL, "name" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_payable_accounttype_enum" AS ENUM('asset', 'liability', 'equity', 'revenue', 'expense')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_payable_transactiontype_enum" AS ENUM('CREDIT', 'DEBIT', 'TRANSFER', 'REFUND', 'WRITE_OFF', 'LATE_FEE', 'ADJUSTMENT', 'CREDIT_MEMO', 'INVOICE_PAYMENT', 'CHARGEBACK', 'PAYMENT', 'DISCOUNT', 'FEE', 'TAX', 'INTEREST', 'REVERSAL', 'PREPAYMENT', 'OVERPAYMENT', 'UNDERPAYMENT', 'ESCALATION_CHARGE', 'SERVICE_CHARGE', 'PENALTY', 'CASH_RECEIPT', 'ALLOCATION', 'MANUAL_ENTRY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts_payable" ("accountType" "public"."accounts_payable_accounttype_enum" NOT NULL, "salePrice" integer, "purchasePrice" integer, "quantity" integer NOT NULL, "itemDescription" character varying, "itemName" character varying NOT NULL, "amount" integer NOT NULL, "transactionType" "public"."accounts_payable_transactiontype_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_d4579aa8c6efa870a8ced890861" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vendor" ("paymentTerms" character varying, "contactEmail" character varying, "name" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_931a23f6231a57604f5a0e32780" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vendor_bill" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "accountsPayableId" uuid, "vendorId" uuid NOT NULL, CONSTRAINT "REL_1dec4c6373cd299c63326e3d21" UNIQUE ("accountsPayableId"), CONSTRAINT "PK_40642a4b9508c9b9beaaa5a9a19" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenant_config" ("value" jsonb NOT NULL, "key" character varying NOT NULL, "tenantId" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1739ef7722e16d9cfe91c38d34a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."residence_type_enum" AS ENUM('APARTMENT', 'HOUSE', 'DUPLEX', 'CONDO', 'TOWNHOUSE', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "residence" ("type" "public"."residence_type_enum" NOT NULL DEFAULT 'OTHER', "isActive" boolean NOT NULL, "charge" integer NOT NULL, "name" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "regionId" uuid NOT NULL, "tenantId" uuid NOT NULL, CONSTRAINT "PK_618d05a83dac6021158cd01919a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exemption" ("description" character varying, "endDate" TIMESTAMP NOT NULL, "startDate" TIMESTAMP NOT NULL, "reason" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "invoiceId" uuid, "residenceId" uuid, "regionId" uuid, "customerId" integer, CONSTRAINT "PK_45ebb0c677806e7e5e5469964b5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_plan_type_enum" AS ENUM('FLAT_MONTHLY', 'PER_WEIGHT', 'TIERED', 'PREPAID', 'CREDIT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_plan" ("description" character varying, "name" character varying NOT NULL, "isActive" boolean NOT NULL, "unit" character varying NOT NULL, "minimumCharge" numeric(10,2) NOT NULL DEFAULT '0', "rateStructure" jsonb, "type" "public"."payment_plan_type_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_db12dcbce4ef547fa9879a0aca0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."discount_type_enum" AS ENUM('FIXED', 'PERCENTAGE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "discount" ("description" character varying, "minVolume" integer, "isActive" boolean NOT NULL, "validTo" TIMESTAMP NOT NULL, "validFrom" TIMESTAMP NOT NULL, "value" numeric(5,2) NOT NULL DEFAULT '0', "type" "public"."discount_type_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "regionId" uuid, "customerId" integer, "planId" uuid, CONSTRAINT "PK_d05d8712e429673e459e7f1cddb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_receivable_accounttype_enum" AS ENUM('asset', 'liability', 'equity', 'revenue', 'expense')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_receivable_transactiontype_enum" AS ENUM('CREDIT', 'DEBIT', 'TRANSFER', 'REFUND', 'WRITE_OFF', 'LATE_FEE', 'ADJUSTMENT', 'CREDIT_MEMO', 'INVOICE_PAYMENT', 'CHARGEBACK', 'PAYMENT', 'DISCOUNT', 'FEE', 'TAX', 'INTEREST', 'REVERSAL', 'PREPAYMENT', 'OVERPAYMENT', 'UNDERPAYMENT', 'ESCALATION_CHARGE', 'SERVICE_CHARGE', 'PENALTY', 'CASH_RECEIPT', 'ALLOCATION', 'MANUAL_ENTRY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts_receivable" ("accountType" "public"."accounts_receivable_accounttype_enum" NOT NULL, "amount" integer NOT NULL, "transactionType" "public"."accounts_receivable_transactiontype_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_7a4fd7cf394ef2c2abfed284d9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."invoice_status_enum" AS ENUM('PENDING', 'PAID', 'CANCELLED', 'OVERDUE', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice" ("invoiceNumber" character varying NOT NULL, "amountDue" numeric(10,2) NOT NULL DEFAULT '0', "amountPaid" numeric(10,2) NOT NULL DEFAULT '0', "breakdown" jsonb NOT NULL, "status" "public"."invoice_status_enum" NOT NULL DEFAULT 'PENDING', "dueDate" TIMESTAMP, "amount" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "exemptionId" uuid, "discountId" uuid, "accountsReceivableId" uuid, "customerId" integer, CONSTRAINT "REL_8fcaf303327698a840c6a04177" UNIQUE ("accountsReceivableId"), CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_aggregator" ("logo" character varying, "isActive" boolean NOT NULL, "config" jsonb, "name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_2d65d5adbb8e4fad86d4eb41f2e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_notification_status_enum" AS ENUM('pending', 'completed', 'failed', 'cancelled', 'reversed')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_notification_payment_method_enum" AS ENUM('mobile_money', 'credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto', 'ussd', 'agency_banking')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_notification_currency_enum" AS ENUM('KES', 'USD', 'EUR', 'GBP', 'NGN', 'ZAR', 'UGX', 'TZS', 'RWF')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_notification_provider_enum" AS ENUM('mpesa', 'airtel_money', 'equity_bank', 'kcb_bank', 'cooperative_bank', 'absa', 'ncba', 'safaricom', 'paypal', 'flutterwave', 'paystack', 'stripe', 'coinbase')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_notification" ("processed_at" TIMESTAMP, "processed" boolean NOT NULL DEFAULT false, "raw_payload" jsonb NOT NULL, "status" "public"."payment_notification_status_enum" NOT NULL, "received_at" TIMESTAMP NOT NULL, "payment_method" "public"."payment_notification_payment_method_enum" NOT NULL, "currency" "public"."payment_notification_currency_enum" NOT NULL, "amount" numeric NOT NULL, "external_txn_id" character varying NOT NULL, "provider" "public"."payment_notification_provider_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "aggregatorId" uuid NOT NULL, CONSTRAINT "PK_ae851104ce3761a083209783d81" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_method" ("config" jsonb, "processorType" character varying NOT NULL, "name" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_7744c2b2dd932c9cf42f2b9bc3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_status_enum" AS ENUM('pending', 'completed', 'failed', 'cancelled', 'reversed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("status" "public"."payment_status_enum" NOT NULL DEFAULT 'pending', "paymentDate" TIMESTAMP NOT NULL, "amount" numeric(10,2) NOT NULL DEFAULT '0', "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "invoiceId" uuid, "notificationId" uuid, "paymentMethodId" uuid, "customerId" integer, CONSTRAINT "REL_dd9ca51143c93241dd07016f0d" UNIQUE ("notificationId"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction" ("creditAccountName" character varying, "debitAccountName" character varying, "creditAmount" integer NOT NULL, "debitAmount" integer NOT NULL, "owner" character varying, "amount" integer NOT NULL, "description" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "paymentId" uuid NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" SERIAL NOT NULL, "hash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d2f174ef04fb312fdebd0ddc5" ON "session" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reminder_channel_enum" AS ENUM('EMAIL', 'SMS', 'PUSH')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reminder_status_enum" AS ENUM('SCHEDULED', 'SENT', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "reminder" ("message" character varying, "channel" "public"."reminder_channel_enum" NOT NULL, "status" "public"."reminder_status_enum" NOT NULL DEFAULT 'SCHEDULED', "scheduledAt" TIMESTAMP NOT NULL, "sentAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "userId" integer, "invoiceId" uuid, CONSTRAINT "PK_9ec029d17cb8dece186b9221ede" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventory" ("unitOfMeasure" character varying, "materialType" character varying, "accountType" character varying NOT NULL, "salePrice" integer, "purchasePrice" integer NOT NULL, "quantity" integer NOT NULL, "itemDescription" character varying, "itemName" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."customer_plan_status_enum" AS ENUM('trial', 'active', 'suspended', 'inactive', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_plan" ("customSchedule" jsonb, "nextPaymentDate" TIMESTAMP, "status" "public"."customer_plan_status_enum" NOT NULL DEFAULT 'active', "customRates" jsonb, "endDate" TIMESTAMP, "startDate" TIMESTAMP NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "assignedById" integer, CONSTRAINT "PK_8f8e7240de887aae547688903ae" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "credit_balance" ("auditLog" jsonb, "amount" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "customerId" integer NOT NULL, CONSTRAINT "REL_d78a241ce70f49fb9f80d78f6a" UNIQUE ("customerId"), CONSTRAINT "PK_0b0df850847d6f9d5969728bc07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."audit_log_action_enum" AS ENUM('create', 'read', 'update', 'delete', 'complete_step', 'skip_step', 'restart_step', 'login', 'logout', 'password_change', 'password_reset_request', 'password_reset_complete', 'assign_role', 'remove_role', 'update_permissions', 'invite_user', 'activate_user', 'deactivate_user', 'create_tenant', 'update_tenant', 'delete_tenant', 'switch_tenant', 'upload', 'download', 'export', 'import', 'update_settings', 'reset_settings', 'view_audit_log', 'export_audit_log', 'system_start', 'system_shutdown', 'system_error', 'send_notification', 'read_notification', 'archive', 'restore', 'tag', 'untag')`,
    );
    await queryRunner.query(
      `CREATE TABLE "audit_log" ("status" character varying, "description" character varying, "beforeState" jsonb, "afterState" jsonb, "entityId" character varying, "entityType" character varying NOT NULL, "action" "public"."audit_log_action_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "performedByUserId" integer, "performedByTenantId" uuid, CONSTRAINT "PK_07fefa57f7f5ab8fc3f52b3ed0b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_regions_region" ("userId" integer NOT NULL, "regionId" uuid NOT NULL, CONSTRAINT "PK_01aac7f0120ad731078bf7786f2" PRIMARY KEY ("userId", "regionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0252300651acd5cbf815645395" ON "user_regions_region" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dbbbcbac1f75c3aca60e371c20" ON "user_regions_region" ("regionId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "account_owner_user" ("accountId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_a94aa68eef768f0a1d3d99f0442" PRIMARY KEY ("accountId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a54b6ef97fee0107ea51d0cdd3" ON "account_owner_user" ("accountId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_44c05a3ad5f7ef9b00d4a35204" ON "account_owner_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts_payable_account_account" ("accountsPayableId" uuid NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "PK_d884aa12145843fc3a1107e1086" PRIMARY KEY ("accountsPayableId", "accountId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ec10cd430dd5efe1ef6ab1c70b" ON "accounts_payable_account_account" ("accountsPayableId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_93923009c71d47935e8a163ba4" ON "accounts_payable_account_account" ("accountId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts_payable_owner_user" ("accountsPayableId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_101af223f23d24f29bcbd57766d" PRIMARY KEY ("accountsPayableId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8f908463e85077b1fb65e6b5e2" ON "accounts_payable_owner_user" ("accountsPayableId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ff119c3679ebee9a68f5b2620d" ON "accounts_payable_owner_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "residence_occupants_user" ("residenceId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_8c4fa1c9e16c1049f7af3780b32" PRIMARY KEY ("residenceId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_85ec57103a142cba21f202f59d" ON "residence_occupants_user" ("residenceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6f135e350fdddcd8e043f1ea5c" ON "residence_occupants_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts_receivable_account_account" ("accountsReceivableId" uuid NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "PK_73d17bffc9b21d48fa084e24f30" PRIMARY KEY ("accountsReceivableId", "accountId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b2e31f79324a45ddd22ece2d58" ON "accounts_receivable_account_account" ("accountsReceivableId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ecf9be2bc84204e60c192c2e03" ON "accounts_receivable_account_account" ("accountId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts_receivable_owner_user" ("accountsReceivableId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_b98db81832a1fdfd341b1aa28d6" PRIMARY KEY ("accountsReceivableId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9cc2d5d3c56e56172646c6826a" ON "accounts_receivable_owner_user" ("accountsReceivableId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f8335b79cf4cffec01aa450873" ON "accounts_receivable_owner_user" ("userId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice_plan_payment_plan" ("invoiceId" uuid NOT NULL, "paymentPlanId" uuid NOT NULL, CONSTRAINT "PK_a3119960afdcd7e872d32651a1c" PRIMARY KEY ("invoiceId", "paymentPlanId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_069481c468512e2d739b8837a8" ON "invoice_plan_payment_plan" ("invoiceId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c16ae294050dfd61eb89493809" ON "invoice_plan_payment_plan" ("paymentPlanId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_credit_account_account" ("transactionId" uuid NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "PK_7d8ae586e30fe1e944f0cede1d2" PRIMARY KEY ("transactionId", "accountId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fd6369cca49afa7ae79459cd35" ON "transaction_credit_account_account" ("transactionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5b6fa243d01cc672f3110fe230" ON "transaction_credit_account_account" ("accountId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "transaction_debit_account_account" ("transactionId" uuid NOT NULL, "accountId" uuid NOT NULL, CONSTRAINT "PK_b931b2dcb4575bd1590f10973f0" PRIMARY KEY ("transactionId", "accountId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_726fb659152f396480b77f6572" ON "transaction_debit_account_account" ("transactionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_348674af7bbd6a1cd1cc9bf301" ON "transaction_debit_account_account" ("accountId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_plan_plan_payment_plan" ("customerPlanId" uuid NOT NULL, "paymentPlanId" uuid NOT NULL, CONSTRAINT "PK_9e90c112d6f296603816d3cf461" PRIMARY KEY ("customerPlanId", "paymentPlanId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7d1d518fa7f0913ae20309662b" ON "customer_plan_plan_payment_plan" ("customerPlanId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cca9ae196a37fae65a7484ff30" ON "customer_plan_plan_payment_plan" ("paymentPlanId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_plan_customer_user" ("customerPlanId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_b9e7be567ccd307c37aaa898b92" PRIMARY KEY ("customerPlanId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ca52d375966a365db7b2db6c7c" ON "customer_plan_customer_user" ("customerPlanId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_60d8ef9796c33640fabde40a54" ON "customer_plan_customer_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "region" ADD CONSTRAINT "FK_aaf7ebdc7470c865314f414b241" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD CONSTRAINT "FK_1fa41192963d6275ba8952f02a9" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD CONSTRAINT "FK_9175e059b0a720536f7726a88c7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD CONSTRAINT "FK_78f4992112d203106339e1b20e6" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD CONSTRAINT "FK_295d21c339b0985283e10f683ae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_1751a572e91385a09d41c624714" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_685bf353c85f23b6f848e4dcded" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_dc18daa696860586ba4667a9d31" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding" ADD CONSTRAINT "FK_f2b4996085f742144bf56f95ca5" FOREIGN KEY ("performedByTenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding" ADD CONSTRAINT "FK_c714c740e7e6ecf255fbe8d2860" FOREIGN KEY ("performedByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD CONSTRAINT "FK_0ed69b4239b1f892b96798065a1" FOREIGN KEY ("logoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD CONSTRAINT "FK_38c7bb1a7983b359f34b63a0fd6" FOREIGN KEY ("typeId") REFERENCES "tenant_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_6d5184542539a16abc28d80084e" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_payable" ADD CONSTRAINT "FK_d01c893c5a92cb70b0089d67ba3" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor" ADD CONSTRAINT "FK_d5631577208943c2003699af66b" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_bill" ADD CONSTRAINT "FK_083596b0b38b19dc4872e9610a4" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_bill" ADD CONSTRAINT "FK_1dec4c6373cd299c63326e3d21b" FOREIGN KEY ("accountsPayableId") REFERENCES "accounts_payable"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_bill" ADD CONSTRAINT "FK_110c7cfe94fb18def787758ec4f" FOREIGN KEY ("vendorId") REFERENCES "vendor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence" ADD CONSTRAINT "FK_bffa18d20b4a268de41fa3d4664" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence" ADD CONSTRAINT "FK_57d4a46e1bf22f67d2e2807010e" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exemption" ADD CONSTRAINT "FK_15fc57e69bcb80a9d1f711b3bb8" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exemption" ADD CONSTRAINT "FK_1c77964743fb39b7c1a61a1f1de" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exemption" ADD CONSTRAINT "FK_05dbd0cf7d482038b99b7aac6ba" FOREIGN KEY ("residenceId") REFERENCES "residence"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exemption" ADD CONSTRAINT "FK_dfbfd072b7c7821a71a6f4e823e" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exemption" ADD CONSTRAINT "FK_0299e7a986c9716995642badc2d" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_plan" ADD CONSTRAINT "FK_2c643fa40f9b3a2e6c77fe20b2b" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ADD CONSTRAINT "FK_6e7d1396be015cb18f79d98e971" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ADD CONSTRAINT "FK_a30743dd394e390693724306a6c" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ADD CONSTRAINT "FK_c80875112f2212b1891973ded8b" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" ADD CONSTRAINT "FK_a78603e4c7dbb27b8488ec9c170" FOREIGN KEY ("planId") REFERENCES "payment_plan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_receivable" ADD CONSTRAINT "FK_c42ac8546125b0ab2c3184181e5" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_7fb52a5f267f53b7d93af3d8c3c" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_049e1811988edfdea771cc5b8f6" FOREIGN KEY ("exemptionId") REFERENCES "exemption"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_155dbd04e0e50bf0956ad125f3a" FOREIGN KEY ("discountId") REFERENCES "discount"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_8fcaf303327698a840c6a041777" FOREIGN KEY ("accountsReceivableId") REFERENCES "accounts_receivable"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_925aa26ea12c28a6adb614445ee" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_aggregator" ADD CONSTRAINT "FK_9fd2877137ba18153d1c42e29ac" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_notification" ADD CONSTRAINT "FK_19e7cdb7e1e06079dd5ae788b8e" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_notification" ADD CONSTRAINT "FK_49aa24b60aaa7c092c2d502c558" FOREIGN KEY ("aggregatorId") REFERENCES "payment_aggregator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_method" ADD CONSTRAINT "FK_706daac2bd13030bf525ac5227a" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_6959c37c3acf0832103a2535703" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_87223c7f1d4c2ca51cf69927844" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_dd9ca51143c93241dd07016f0db" FOREIGN KEY ("notificationId") REFERENCES "payment_notification"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_fb76bf2f52ca15e599f50bb34ae" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_method"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_967ae37468fd0c08ea0fec41720" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_59362ae6c545b38be85351a0cca" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_26ba3b75368b99964d6dea5cc2c" FOREIGN KEY ("paymentId") REFERENCES "payment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" ADD CONSTRAINT "FK_17ec44e7573c39526c538081cbd" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" ADD CONSTRAINT "FK_c4cc144b2a558182ac6d869d2a4" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" ADD CONSTRAINT "FK_b00895c523b1b267c3243afa76b" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" ADD CONSTRAINT "FK_e2bdaec9ee21465752bb01cd040" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan" ADD CONSTRAINT "FK_9b1f0e98868dc1f495884f15f77" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan" ADD CONSTRAINT "FK_7f18a5fdf060737c35c1d587345" FOREIGN KEY ("assignedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "credit_balance" ADD CONSTRAINT "FK_6d7d6fe724ba5629b4e37bcef21" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "credit_balance" ADD CONSTRAINT "FK_d78a241ce70f49fb9f80d78f6aa" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_log" ADD CONSTRAINT "FK_6d4b82b8ac14815d3d270f6a21a" FOREIGN KEY ("performedByUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_log" ADD CONSTRAINT "FK_8b77a50166b9b8eb12241399544" FOREIGN KEY ("performedByTenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_regions_region" ADD CONSTRAINT "FK_0252300651acd5cbf815645395d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_regions_region" ADD CONSTRAINT "FK_dbbbcbac1f75c3aca60e371c200" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_owner_user" ADD CONSTRAINT "FK_a54b6ef97fee0107ea51d0cdd36" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_owner_user" ADD CONSTRAINT "FK_44c05a3ad5f7ef9b00d4a352045" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_payable_account_account" ADD CONSTRAINT "FK_ec10cd430dd5efe1ef6ab1c70bc" FOREIGN KEY ("accountsPayableId") REFERENCES "accounts_payable"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_payable_account_account" ADD CONSTRAINT "FK_93923009c71d47935e8a163ba4d" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_payable_owner_user" ADD CONSTRAINT "FK_8f908463e85077b1fb65e6b5e2e" FOREIGN KEY ("accountsPayableId") REFERENCES "accounts_payable"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_payable_owner_user" ADD CONSTRAINT "FK_ff119c3679ebee9a68f5b2620d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence_occupants_user" ADD CONSTRAINT "FK_85ec57103a142cba21f202f59d2" FOREIGN KEY ("residenceId") REFERENCES "residence"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence_occupants_user" ADD CONSTRAINT "FK_6f135e350fdddcd8e043f1ea5c5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_receivable_account_account" ADD CONSTRAINT "FK_b2e31f79324a45ddd22ece2d587" FOREIGN KEY ("accountsReceivableId") REFERENCES "accounts_receivable"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_receivable_account_account" ADD CONSTRAINT "FK_ecf9be2bc84204e60c192c2e03c" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_receivable_owner_user" ADD CONSTRAINT "FK_9cc2d5d3c56e56172646c6826a2" FOREIGN KEY ("accountsReceivableId") REFERENCES "accounts_receivable"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_receivable_owner_user" ADD CONSTRAINT "FK_f8335b79cf4cffec01aa450873c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_plan_payment_plan" ADD CONSTRAINT "FK_069481c468512e2d739b8837a83" FOREIGN KEY ("invoiceId") REFERENCES "invoice"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_plan_payment_plan" ADD CONSTRAINT "FK_c16ae294050dfd61eb894938092" FOREIGN KEY ("paymentPlanId") REFERENCES "payment_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_credit_account_account" ADD CONSTRAINT "FK_fd6369cca49afa7ae79459cd35c" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_credit_account_account" ADD CONSTRAINT "FK_5b6fa243d01cc672f3110fe230b" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_debit_account_account" ADD CONSTRAINT "FK_726fb659152f396480b77f65721" FOREIGN KEY ("transactionId") REFERENCES "transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_debit_account_account" ADD CONSTRAINT "FK_348674af7bbd6a1cd1cc9bf3012" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan_plan_payment_plan" ADD CONSTRAINT "FK_7d1d518fa7f0913ae20309662b1" FOREIGN KEY ("customerPlanId") REFERENCES "customer_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan_plan_payment_plan" ADD CONSTRAINT "FK_cca9ae196a37fae65a7484ff30d" FOREIGN KEY ("paymentPlanId") REFERENCES "payment_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan_customer_user" ADD CONSTRAINT "FK_ca52d375966a365db7b2db6c7cf" FOREIGN KEY ("customerPlanId") REFERENCES "customer_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan_customer_user" ADD CONSTRAINT "FK_60d8ef9796c33640fabde40a54a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer_plan_customer_user" DROP CONSTRAINT "FK_60d8ef9796c33640fabde40a54a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan_customer_user" DROP CONSTRAINT "FK_ca52d375966a365db7b2db6c7cf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan_plan_payment_plan" DROP CONSTRAINT "FK_cca9ae196a37fae65a7484ff30d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan_plan_payment_plan" DROP CONSTRAINT "FK_7d1d518fa7f0913ae20309662b1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_debit_account_account" DROP CONSTRAINT "FK_348674af7bbd6a1cd1cc9bf3012"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_debit_account_account" DROP CONSTRAINT "FK_726fb659152f396480b77f65721"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_credit_account_account" DROP CONSTRAINT "FK_5b6fa243d01cc672f3110fe230b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction_credit_account_account" DROP CONSTRAINT "FK_fd6369cca49afa7ae79459cd35c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_plan_payment_plan" DROP CONSTRAINT "FK_c16ae294050dfd61eb894938092"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice_plan_payment_plan" DROP CONSTRAINT "FK_069481c468512e2d739b8837a83"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_receivable_owner_user" DROP CONSTRAINT "FK_f8335b79cf4cffec01aa450873c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_receivable_owner_user" DROP CONSTRAINT "FK_9cc2d5d3c56e56172646c6826a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_receivable_account_account" DROP CONSTRAINT "FK_ecf9be2bc84204e60c192c2e03c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_receivable_account_account" DROP CONSTRAINT "FK_b2e31f79324a45ddd22ece2d587"`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence_occupants_user" DROP CONSTRAINT "FK_6f135e350fdddcd8e043f1ea5c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence_occupants_user" DROP CONSTRAINT "FK_85ec57103a142cba21f202f59d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_payable_owner_user" DROP CONSTRAINT "FK_ff119c3679ebee9a68f5b2620d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_payable_owner_user" DROP CONSTRAINT "FK_8f908463e85077b1fb65e6b5e2e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_payable_account_account" DROP CONSTRAINT "FK_93923009c71d47935e8a163ba4d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_payable_account_account" DROP CONSTRAINT "FK_ec10cd430dd5efe1ef6ab1c70bc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_owner_user" DROP CONSTRAINT "FK_44c05a3ad5f7ef9b00d4a352045"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_owner_user" DROP CONSTRAINT "FK_a54b6ef97fee0107ea51d0cdd36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_regions_region" DROP CONSTRAINT "FK_dbbbcbac1f75c3aca60e371c200"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_regions_region" DROP CONSTRAINT "FK_0252300651acd5cbf815645395d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_log" DROP CONSTRAINT "FK_8b77a50166b9b8eb12241399544"`,
    );
    await queryRunner.query(
      `ALTER TABLE "audit_log" DROP CONSTRAINT "FK_6d4b82b8ac14815d3d270f6a21a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "credit_balance" DROP CONSTRAINT "FK_d78a241ce70f49fb9f80d78f6aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "credit_balance" DROP CONSTRAINT "FK_6d7d6fe724ba5629b4e37bcef21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan" DROP CONSTRAINT "FK_7f18a5fdf060737c35c1d587345"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan" DROP CONSTRAINT "FK_9b1f0e98868dc1f495884f15f77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory" DROP CONSTRAINT "FK_e2bdaec9ee21465752bb01cd040"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" DROP CONSTRAINT "FK_b00895c523b1b267c3243afa76b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" DROP CONSTRAINT "FK_c4cc144b2a558182ac6d869d2a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reminder" DROP CONSTRAINT "FK_17ec44e7573c39526c538081cbd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_26ba3b75368b99964d6dea5cc2c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_59362ae6c545b38be85351a0cca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_967ae37468fd0c08ea0fec41720"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_fb76bf2f52ca15e599f50bb34ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_dd9ca51143c93241dd07016f0db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_87223c7f1d4c2ca51cf69927844"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_6959c37c3acf0832103a2535703"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_method" DROP CONSTRAINT "FK_706daac2bd13030bf525ac5227a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_notification" DROP CONSTRAINT "FK_49aa24b60aaa7c092c2d502c558"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_notification" DROP CONSTRAINT "FK_19e7cdb7e1e06079dd5ae788b8e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_aggregator" DROP CONSTRAINT "FK_9fd2877137ba18153d1c42e29ac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_925aa26ea12c28a6adb614445ee"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_8fcaf303327698a840c6a041777"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_155dbd04e0e50bf0956ad125f3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_049e1811988edfdea771cc5b8f6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_7fb52a5f267f53b7d93af3d8c3c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_receivable" DROP CONSTRAINT "FK_c42ac8546125b0ab2c3184181e5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" DROP CONSTRAINT "FK_a78603e4c7dbb27b8488ec9c170"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" DROP CONSTRAINT "FK_c80875112f2212b1891973ded8b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" DROP CONSTRAINT "FK_a30743dd394e390693724306a6c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "discount" DROP CONSTRAINT "FK_6e7d1396be015cb18f79d98e971"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_plan" DROP CONSTRAINT "FK_2c643fa40f9b3a2e6c77fe20b2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exemption" DROP CONSTRAINT "FK_0299e7a986c9716995642badc2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exemption" DROP CONSTRAINT "FK_dfbfd072b7c7821a71a6f4e823e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exemption" DROP CONSTRAINT "FK_05dbd0cf7d482038b99b7aac6ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exemption" DROP CONSTRAINT "FK_1c77964743fb39b7c1a61a1f1de"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exemption" DROP CONSTRAINT "FK_15fc57e69bcb80a9d1f711b3bb8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence" DROP CONSTRAINT "FK_57d4a46e1bf22f67d2e2807010e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence" DROP CONSTRAINT "FK_bffa18d20b4a268de41fa3d4664"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_bill" DROP CONSTRAINT "FK_110c7cfe94fb18def787758ec4f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_bill" DROP CONSTRAINT "FK_1dec4c6373cd299c63326e3d21b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_bill" DROP CONSTRAINT "FK_083596b0b38b19dc4872e9610a4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor" DROP CONSTRAINT "FK_d5631577208943c2003699af66b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_payable" DROP CONSTRAINT "FK_d01c893c5a92cb70b0089d67ba3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_6d5184542539a16abc28d80084e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" DROP CONSTRAINT "FK_38c7bb1a7983b359f34b63a0fd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" DROP CONSTRAINT "FK_0ed69b4239b1f892b96798065a1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding" DROP CONSTRAINT "FK_c714c740e7e6ecf255fbe8d2860"`,
    );
    await queryRunner.query(
      `ALTER TABLE "onboarding" DROP CONSTRAINT "FK_f2b4996085f742144bf56f95ca5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_dc18daa696860586ba4667a9d31"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_c28e52f758e7bbc53828db92194"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_75e2be4ce11d447ef43be0e374f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_685bf353c85f23b6f848e4dcded"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "FK_1751a572e91385a09d41c624714"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" DROP CONSTRAINT "FK_295d21c339b0985283e10f683ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" DROP CONSTRAINT "FK_78f4992112d203106339e1b20e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP CONSTRAINT "FK_9175e059b0a720536f7726a88c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP CONSTRAINT "FK_1fa41192963d6275ba8952f02a9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "region" DROP CONSTRAINT "FK_aaf7ebdc7470c865314f414b241"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_60d8ef9796c33640fabde40a54"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ca52d375966a365db7b2db6c7c"`,
    );
    await queryRunner.query(`DROP TABLE "customer_plan_customer_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cca9ae196a37fae65a7484ff30"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7d1d518fa7f0913ae20309662b"`,
    );
    await queryRunner.query(`DROP TABLE "customer_plan_plan_payment_plan"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_348674af7bbd6a1cd1cc9bf301"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_726fb659152f396480b77f6572"`,
    );
    await queryRunner.query(`DROP TABLE "transaction_debit_account_account"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5b6fa243d01cc672f3110fe230"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fd6369cca49afa7ae79459cd35"`,
    );
    await queryRunner.query(`DROP TABLE "transaction_credit_account_account"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c16ae294050dfd61eb89493809"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_069481c468512e2d739b8837a8"`,
    );
    await queryRunner.query(`DROP TABLE "invoice_plan_payment_plan"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f8335b79cf4cffec01aa450873"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9cc2d5d3c56e56172646c6826a"`,
    );
    await queryRunner.query(`DROP TABLE "accounts_receivable_owner_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ecf9be2bc84204e60c192c2e03"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b2e31f79324a45ddd22ece2d58"`,
    );
    await queryRunner.query(`DROP TABLE "accounts_receivable_account_account"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f135e350fdddcd8e043f1ea5c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_85ec57103a142cba21f202f59d"`,
    );
    await queryRunner.query(`DROP TABLE "residence_occupants_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ff119c3679ebee9a68f5b2620d"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8f908463e85077b1fb65e6b5e2"`,
    );
    await queryRunner.query(`DROP TABLE "accounts_payable_owner_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_93923009c71d47935e8a163ba4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ec10cd430dd5efe1ef6ab1c70b"`,
    );
    await queryRunner.query(`DROP TABLE "accounts_payable_account_account"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_44c05a3ad5f7ef9b00d4a35204"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a54b6ef97fee0107ea51d0cdd3"`,
    );
    await queryRunner.query(`DROP TABLE "account_owner_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dbbbcbac1f75c3aca60e371c20"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0252300651acd5cbf815645395"`,
    );
    await queryRunner.query(`DROP TABLE "user_regions_region"`);
    await queryRunner.query(`DROP TABLE "audit_log"`);
    await queryRunner.query(`DROP TYPE "public"."audit_log_action_enum"`);
    await queryRunner.query(`DROP TABLE "credit_balance"`);
    await queryRunner.query(`DROP TABLE "customer_plan"`);
    await queryRunner.query(`DROP TYPE "public"."customer_plan_status_enum"`);
    await queryRunner.query(`DROP TABLE "inventory"`);
    await queryRunner.query(`DROP TABLE "reminder"`);
    await queryRunner.query(`DROP TYPE "public"."reminder_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."reminder_channel_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d2f174ef04fb312fdebd0ddc5"`,
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
    await queryRunner.query(`DROP TABLE "payment_method"`);
    await queryRunner.query(`DROP TABLE "payment_notification"`);
    await queryRunner.query(
      `DROP TYPE "public"."payment_notification_provider_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."payment_notification_currency_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."payment_notification_payment_method_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."payment_notification_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "payment_aggregator"`);
    await queryRunner.query(`DROP TABLE "invoice"`);
    await queryRunner.query(`DROP TYPE "public"."invoice_status_enum"`);
    await queryRunner.query(`DROP TABLE "accounts_receivable"`);
    await queryRunner.query(
      `DROP TYPE "public"."accounts_receivable_transactiontype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."accounts_receivable_accounttype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "discount"`);
    await queryRunner.query(`DROP TYPE "public"."discount_type_enum"`);
    await queryRunner.query(`DROP TABLE "payment_plan"`);
    await queryRunner.query(`DROP TYPE "public"."payment_plan_type_enum"`);
    await queryRunner.query(`DROP TABLE "exemption"`);
    await queryRunner.query(`DROP TABLE "residence"`);
    await queryRunner.query(`DROP TYPE "public"."residence_type_enum"`);
    await queryRunner.query(`DROP TABLE "tenant_config"`);
    await queryRunner.query(`DROP TABLE "vendor_bill"`);
    await queryRunner.query(`DROP TABLE "vendor"`);
    await queryRunner.query(`DROP TABLE "accounts_payable"`);
    await queryRunner.query(
      `DROP TYPE "public"."accounts_payable_transactiontype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."accounts_payable_accounttype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(
      `DROP TYPE "public"."account_notificationtype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."account_notificationchannel_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."account_type_enum"`);
    await queryRunner.query(`DROP TABLE "tenant"`);
    await queryRunner.query(`DROP TABLE "tenant_type"`);
    await queryRunner.query(`DROP TYPE "public"."tenant_type_code_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_49e82aae0315cc14bfb94de878"`,
    );
    await queryRunner.query(`DROP TABLE "onboarding"`);
    await queryRunner.query(`DROP TYPE "public"."onboarding_entitytype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."onboarding_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f0e1b4ecdca13b177e2e3a0613"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58e4dbff0e1a32a9bdc861bb29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9bd2fe7a8e694dedc4ec2f666f"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "file"`);
    await queryRunner.query(`DROP TABLE "status"`);
    await queryRunner.query(`DROP TABLE "role"`);
    await queryRunner.query(`DROP TABLE "kyc_details"`);
    await queryRunner.query(
      `DROP TYPE "public"."kyc_details_subjecttype_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."kyc_details_status_enum"`);
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(`DROP TYPE "public"."settings_subjecttype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."settings_settingstype_enum"`);
    await queryRunner.query(`DROP TABLE "region"`);
  }
}
