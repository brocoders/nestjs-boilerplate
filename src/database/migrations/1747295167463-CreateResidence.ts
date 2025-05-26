import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResidence1747295167463 implements MigrationInterface {
  name = 'CreateResidence1747295167463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."residence_type_enum" AS ENUM('APARTMENT', 'HOUSE', 'DUPLEX', 'CONDO', 'TOWNHOUSE', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "residence" ("type" "public"."residence_type_enum" NOT NULL DEFAULT 'OTHER', "isActive" boolean NOT NULL, "charge" integer NOT NULL, "name" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "regionId" uuid NOT NULL, "tenantId" uuid NOT NULL, CONSTRAINT "PK_618d05a83dac6021158cd01919a" PRIMARY KEY ("id"))`,
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
      `ALTER TYPE "public"."settings_settingstype_enum" RENAME TO "settings_settingstype_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."settings_settingstype_enum" AS ENUM('invoice', 'billing', 'payment', 'tax', 'commission', 'notification', 'reminder', 'alert', 'waste', 'collection', 'processing', 'recycling', 'disposal', 'marketplace', 'listing', 'bidding', 'transaction', 'preferences', 'privacy', 'accessibility', 'compliance', 'certification', 'reporting', 'audit', 'api', 'integration', 'security', 'rate_limiting', 'localization', 'language', 'currency', 'timezone', 'theme', 'layout', 'dashboard', 'system', 'maintenance', 'backup', 'scaling', 'carbon_accounting', 'sustainability', 'routing', 'vehicle', 'driver')`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ALTER COLUMN "settingsType" TYPE "public"."settings_settingstype_enum" USING "settingsType"::"text"::"public"."settings_settingstype_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."settings_settingstype_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence" ADD CONSTRAINT "FK_bffa18d20b4a268de41fa3d4664" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence" ADD CONSTRAINT "FK_57d4a46e1bf22f67d2e2807010e" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence_occupants_user" ADD CONSTRAINT "FK_85ec57103a142cba21f202f59d2" FOREIGN KEY ("residenceId") REFERENCES "residence"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence_occupants_user" ADD CONSTRAINT "FK_6f135e350fdddcd8e043f1ea5c5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "residence_occupants_user" DROP CONSTRAINT "FK_6f135e350fdddcd8e043f1ea5c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence_occupants_user" DROP CONSTRAINT "FK_85ec57103a142cba21f202f59d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence" DROP CONSTRAINT "FK_57d4a46e1bf22f67d2e2807010e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "residence" DROP CONSTRAINT "FK_bffa18d20b4a268de41fa3d4664"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."settings_settingstype_enum_old" AS ENUM('invoice', 'billing', 'payment', 'tax', 'commission', 'notification', 'reminder', 'alert', 'waste', 'collection', 'processing', 'recycling', 'disposal', 'marketplace', 'listing', 'bidding', 'transaction', 'preferences', 'privacy', 'accessibility', 'compliance', 'certification', 'reporting', 'audit', 'api', 'integration', 'security', 'rate_limiting', 'localization', 'language', 'currency', 'timezone', 'theme', 'layout', 'dashboard', 'maintenance', 'backup', 'scaling', 'carbon_accounting', 'sustainability', 'routing', 'vehicle', 'driver')`,
    );
    await queryRunner.query(
      `ALTER TABLE "settings" ALTER COLUMN "settingsType" TYPE "public"."settings_settingstype_enum_old" USING "settingsType"::"text"::"public"."settings_settingstype_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."settings_settingstype_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."settings_settingstype_enum_old" RENAME TO "settings_settingstype_enum"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6f135e350fdddcd8e043f1ea5c"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_85ec57103a142cba21f202f59d"`,
    );
    await queryRunner.query(`DROP TABLE "residence_occupants_user"`);
    await queryRunner.query(`DROP TABLE "residence"`);
    await queryRunner.query(`DROP TYPE "public"."residence_type_enum"`);
  }
}
