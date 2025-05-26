import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePaymentNotificationTable1748247210083
  implements MigrationInterface
{
  name = 'CreatePaymentNotificationTable1748247210083';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
      `CREATE TABLE "payment_notification" ("processed_at" TIMESTAMP, "processed" boolean NOT NULL DEFAULT false, "raw_payload" jsonb NOT NULL, "status" "public"."payment_notification_status_enum" NOT NULL, "received_at" TIMESTAMP NOT NULL, "payment_method" "public"."payment_notification_payment_method_enum" NOT NULL, "currency" "public"."payment_notification_currency_enum" NOT NULL, "amount" numeric NOT NULL, "external_txn_id" character varying NOT NULL, "provider" "public"."payment_notification_provider_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ae851104ce3761a083209783d81" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
  }
}
