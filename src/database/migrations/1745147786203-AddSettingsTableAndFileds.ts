import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSettingsTableAndFileds1745147786203
  implements MigrationInterface
{
  name = 'AddSettingsTableAndFileds1745147786203';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."settings_settingstype_enum" AS ENUM('invoice', 'billing', 'payment', 'tax', 'commission', 'notification', 'reminder', 'alert', 'waste', 'collection', 'processing', 'recycling', 'disposal', 'marketplace', 'listing', 'bidding', 'transaction', 'preferences', 'privacy', 'accessibility', 'compliance', 'certification', 'reporting', 'audit', 'api', 'integration', 'security', 'rate_limiting', 'localization', 'language', 'currency', 'timezone', 'theme', 'layout', 'dashboard', 'maintenance', 'backup', 'scaling', 'carbon_accounting', 'sustainability', 'routing', 'vehicle', 'driver')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."settings_subjecttype_enum" AS ENUM('tenant', 'user', 'system', 'collector', 'facility')`,
    );
    await queryRunner.query(
      `CREATE TABLE "settings" ("config" jsonb NOT NULL, "settingsType" "public"."settings_settingstype_enum" NOT NULL, "subjectType" "public"."settings_subjecttype_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD CONSTRAINT "FK_1fa41192963d6275ba8952f02a9" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ADD CONSTRAINT "FK_9175e059b0a720536f7726a88c7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "settings" DROP CONSTRAINT "FK_9175e059b0a720536f7726a88c7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" DROP CONSTRAINT "FK_1fa41192963d6275ba8952f02a9"`,
    );
    await queryRunner.query(`DROP TABLE "settings"`);
    await queryRunner.query(`DROP TYPE "public"."settings_subjecttype_enum"`);
    await queryRunner.query(`DROP TYPE "public"."settings_settingstype_enum"`);
  }
}
