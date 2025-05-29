import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedPaymentPlanAgain1748488858318
  implements MigrationInterface
{
  name = 'UpdatedPaymentPlanAgain1748488858318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_payable_accounttype_enum" AS ENUM('asset', 'liability', 'equity', 'revenue', 'expense')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_payable_transactiontype_enum" AS ENUM('CREDIT', 'DEBIT', 'TRANSFER', 'REFUND')`,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts_payable" ("accountType" "public"."accounts_payable_accounttype_enum" NOT NULL, "salePrice" integer, "purchasePrice" integer, "quantity" integer NOT NULL, "itemDescription" character varying, "itemName" character varying NOT NULL, "amount" integer NOT NULL, "transactionType" "public"."accounts_payable_transactiontype_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_d4579aa8c6efa870a8ced890861" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vendor_bill" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "accountsPayableId" uuid, "vendorId" uuid NOT NULL, CONSTRAINT "REL_1dec4c6373cd299c63326e3d21" UNIQUE ("accountsPayableId"), CONSTRAINT "PK_40642a4b9508c9b9beaaa5a9a19" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "vendor" ("paymentTerms" character varying, "contactEmail" character varying, "name" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_931a23f6231a57604f5a0e32780" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exemption" ("endDate" TIMESTAMP NOT NULL, "startDate" TIMESTAMP NOT NULL, "reason" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "invoiceId" uuid, "residenceId" uuid, "regionId" uuid, "customerId" integer, CONSTRAINT "PK_45ebb0c677806e7e5e5469964b5" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "discount" ("isActive" boolean NOT NULL, "validTo" TIMESTAMP NOT NULL, "validFrom" TIMESTAMP NOT NULL, "value" numeric(5,2) NOT NULL DEFAULT '0', "type" "public"."discount_type_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "regionId" uuid, "customerId" integer, "planId" uuid, CONSTRAINT "PK_d05d8712e429673e459e7f1cddb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_receivable_accounttype_enum" AS ENUM('asset', 'liability', 'equity', 'revenue', 'expense')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."accounts_receivable_transactiontype_enum" AS ENUM('CREDIT', 'DEBIT', 'TRANSFER', 'REFUND')`,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts_receivable" ("accountType" "public"."accounts_receivable_accounttype_enum" NOT NULL, "amount" integer NOT NULL, "transactionType" "public"."accounts_receivable_transactiontype_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_7a4fd7cf394ef2c2abfed284d9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."invoice_status_enum" AS ENUM('PENDING', 'PAID', 'CANCELLED', 'OVERDUE', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice" ("amountDue" numeric(10,2) NOT NULL DEFAULT '0', "amountPaid" numeric(10,2) NOT NULL DEFAULT '0', "breakdown" jsonb NOT NULL, "status" "public"."invoice_status_enum" NOT NULL DEFAULT 'PENDING', "dueDate" TIMESTAMP, "amount" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "exemptionId" uuid, "discountId" uuid, "accountsReceivableId" uuid, "customerId" integer, CONSTRAINT "REL_8fcaf303327698a840c6a04177" UNIQUE ("accountsReceivableId"), CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment_aggregator" ("config" jsonb, "name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_2d65d5adbb8e4fad86d4eb41f2e" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "tenant_config" ("value" jsonb NOT NULL, "key" character varying NOT NULL, "tenantId" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1739ef7722e16d9cfe91c38d34a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reminder_channel_enum" AS ENUM('EMAIL', 'SMS', 'PUSH')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."reminder_status_enum" AS ENUM('SCHEDULED', 'SENT', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "reminder" ("channel" "public"."reminder_channel_enum" NOT NULL, "status" "public"."reminder_status_enum" NOT NULL DEFAULT 'SCHEDULED', "scheduledAt" TIMESTAMP NOT NULL, "sentAt" TIMESTAMP, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "userId" integer, "invoiceId" uuid, CONSTRAINT "PK_9ec029d17cb8dece186b9221ede" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventory" ("unitOfMeasure" character varying, "materialType" character varying, "accountType" character varying NOT NULL, "salePrice" integer, "purchasePrice" integer NOT NULL, "quantity" integer NOT NULL, "itemDescription" character varying, "itemName" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "credit_balance" ("auditLog" jsonb, "amount" integer NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "customerId" integer NOT NULL, CONSTRAINT "REL_d78a241ce70f49fb9f80d78f6a" UNIQUE ("customerId"), CONSTRAINT "PK_0b0df850847d6f9d5969728bc07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."customer_plan_status_enum" AS ENUM('active', 'suspended', 'inactive', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer_plan" ("customSchedule" jsonb, "nextPaymentDate" TIMESTAMP, "status" "public"."customer_plan_status_enum" NOT NULL DEFAULT 'active', "customRates" jsonb, "endDate" TIMESTAMP, "startDate" TIMESTAMP NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "assignedById" integer, CONSTRAINT "PK_8f8e7240de887aae547688903ae" PRIMARY KEY ("id"))`,
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
      `ALTER TABLE "user" ADD "phoneNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "countryCode" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_notification" ADD "tenantId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_notification" ADD "aggregatorId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ALTER COLUMN "databaseConfig" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "accounts_payable" ADD CONSTRAINT "FK_d01c893c5a92cb70b0089d67ba3" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "vendor" ADD CONSTRAINT "FK_d5631577208943c2003699af66b" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "credit_balance" ADD CONSTRAINT "FK_6d7d6fe724ba5629b4e37bcef21" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "credit_balance" ADD CONSTRAINT "FK_d78a241ce70f49fb9f80d78f6aa" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan" ADD CONSTRAINT "FK_9b1f0e98868dc1f495884f15f77" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan" ADD CONSTRAINT "FK_7f18a5fdf060737c35c1d587345" FOREIGN KEY ("assignedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "customer_plan" DROP CONSTRAINT "FK_7f18a5fdf060737c35c1d587345"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer_plan" DROP CONSTRAINT "FK_9b1f0e98868dc1f495884f15f77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "credit_balance" DROP CONSTRAINT "FK_d78a241ce70f49fb9f80d78f6aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "credit_balance" DROP CONSTRAINT "FK_6d7d6fe724ba5629b4e37bcef21"`,
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
      `ALTER TABLE "vendor" DROP CONSTRAINT "FK_d5631577208943c2003699af66b"`,
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
      `ALTER TABLE "accounts_payable" DROP CONSTRAINT "FK_d01c893c5a92cb70b0089d67ba3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ALTER COLUMN "databaseConfig" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_notification" DROP COLUMN "aggregatorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment_notification" DROP COLUMN "tenantId"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "countryCode"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
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
    await queryRunner.query(`DROP TABLE "customer_plan"`);
    await queryRunner.query(`DROP TYPE "public"."customer_plan_status_enum"`);
    await queryRunner.query(`DROP TABLE "credit_balance"`);
    await queryRunner.query(`DROP TABLE "inventory"`);
    await queryRunner.query(`DROP TABLE "reminder"`);
    await queryRunner.query(`DROP TYPE "public"."reminder_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."reminder_channel_enum"`);
    await queryRunner.query(`DROP TABLE "tenant_config"`);
    await queryRunner.query(`DROP TABLE "transaction"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TYPE "public"."payment_status_enum"`);
    await queryRunner.query(`DROP TABLE "payment_method"`);
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
    await queryRunner.query(`DROP TABLE "vendor"`);
    await queryRunner.query(`DROP TABLE "vendor_bill"`);
    await queryRunner.query(`DROP TABLE "accounts_payable"`);
    await queryRunner.query(
      `DROP TYPE "public"."accounts_payable_transactiontype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."accounts_payable_accounttype_enum"`,
    );
  }
}
