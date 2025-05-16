import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccountsTable1747393574185 implements MigrationInterface {
  name = 'CreateAccountsTable1747393574185';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
      `CREATE TABLE "account_owner_user" ("accountId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_a94aa68eef768f0a1d3d99f0442" PRIMARY KEY ("accountId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a54b6ef97fee0107ea51d0cdd3" ON "account_owner_user" ("accountId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_44c05a3ad5f7ef9b00d4a35204" ON "account_owner_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_6d5184542539a16abc28d80084e" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_owner_user" ADD CONSTRAINT "FK_a54b6ef97fee0107ea51d0cdd36" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_owner_user" ADD CONSTRAINT "FK_44c05a3ad5f7ef9b00d4a352045" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "account_owner_user" DROP CONSTRAINT "FK_44c05a3ad5f7ef9b00d4a352045"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account_owner_user" DROP CONSTRAINT "FK_a54b6ef97fee0107ea51d0cdd36"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_6d5184542539a16abc28d80084e"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_44c05a3ad5f7ef9b00d4a35204"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a54b6ef97fee0107ea51d0cdd3"`,
    );
    await queryRunner.query(`DROP TABLE "account_owner_user"`);
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(
      `DROP TYPE "public"."account_notificationtype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."account_notificationchannel_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."account_type_enum"`);
  }
}
