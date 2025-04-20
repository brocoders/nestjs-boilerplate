import { MigrationInterface, QueryRunner } from 'typeorm';

export class LatestChanges1745163536016 implements MigrationInterface {
  name = 'LatestChanges1745163536016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // First enable PostGIS extension
    //TODO
    //await queryRunner.query('CREATE EXTENSION IF NOT EXISTS postgis');

    // Then proceed with other changes
    await queryRunner.query(
      `CREATE TYPE "public"."kyc_details_status_enum" AS ENUM('pending', 'verified', 'rejected')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."kyc_details_subjecttype_enum" AS ENUM('user', 'tenant')`,
    );
    // await queryRunner.query(
    //   `CREATE TYPE "public"."kyc_details_status_enum" AS ENUM('pending', 'verified', 'rejected')`,
    // );
    // await queryRunner.query(
    //   `CREATE TYPE "public"."kyc_details_subjecttype_enum" AS ENUM('user', 'tenant')`,
    // );
    await queryRunner.query(
      `CREATE TABLE "kyc_details" ("verifiedBy" integer, "verifiedAt" TIMESTAMP, "submittedAt" TIMESTAMP, "status" "public"."kyc_details_status_enum" NOT NULL DEFAULT 'pending', "documentData" jsonb, "documentNumber" character varying, "documentType" character varying, "subjectType" "public"."kyc_details_subjecttype_enum" NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_83983b321401e4ca9ebcc3317db" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "role" ADD "tenantId" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD "domain" character varying`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."tenant_type_code_enum" RENAME TO "tenant_type_code_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tenant_type_code_enum" AS ENUM('platform_owner', 'community_group', 'recycling_company', 'collection_agency', 'municipality', 'enterprise', 'educational_institution', 'healthcare_provider', 'non_profit_organization', 'government_agency', 'technology_company', 'retail_business', 'manufacturing_company', 'transportation_service', 'financial_institution', 'agricultural_business', 'energy_provider', 'construction_company', 'hospitality_business', 'generic')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant_type" ALTER COLUMN "code" TYPE "public"."tenant_type_code_enum" USING "code"::"text"::"public"."tenant_type_code_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."tenant_type_code_enum_old"`);
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "zipCodes"`);
    await queryRunner.query(`ALTER TABLE "region" ADD "zipCodes" text array`);
    await queryRunner.query(
      `ALTER TABLE "region" DROP COLUMN "operatingHours"`,
    );
    await queryRunner.query(`ALTER TABLE "region" ADD "operatingHours" jsonb`);
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "serviceTypes"`);
    await queryRunner.query(`ALTER TABLE "region" ADD "serviceTypes" jsonb`);
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "centroidLat"`);
    await queryRunner.query(
      `ALTER TABLE "region" ADD "centroidLat" numeric(9,6)`,
    );
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "centroidLon"`);
    await queryRunner.query(
      `ALTER TABLE "region" ADD "centroidLon" numeric(9,6)`,
    );
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "boundary"`);
    //TODO
    // await queryRunner.query(
    //   `ALTER TABLE "region" ADD "boundary" geometry(Polygon,4326)`,
    // );
    await queryRunner.query(`
      ALTER TABLE "region" ADD "boundary" jsonb
    `);
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD CONSTRAINT "FK_78f4992112d203106339e1b20e6" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD CONSTRAINT "FK_295d21c339b0985283e10f683ae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role" ADD CONSTRAINT "FK_1751a572e91385a09d41c624714" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role" DROP CONSTRAINT "FK_1751a572e91385a09d41c624714"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" DROP CONSTRAINT "FK_295d21c339b0985283e10f683ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" DROP CONSTRAINT "FK_78f4992112d203106339e1b20e6"`,
    );
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "boundary"`);
    await queryRunner.query(
      `ALTER TABLE "region" ADD "boundary" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "centroidLon"`);
    await queryRunner.query(`ALTER TABLE "region" ADD "centroidLon" integer`);
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "centroidLat"`);
    await queryRunner.query(
      `ALTER TABLE "region" ADD "centroidLat" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "serviceTypes"`);
    await queryRunner.query(
      `ALTER TABLE "region" ADD "serviceTypes" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "region" DROP COLUMN "operatingHours"`,
    );
    await queryRunner.query(
      `ALTER TABLE "region" ADD "operatingHours" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "region" DROP COLUMN "zipCodes"`);
    await queryRunner.query(
      `ALTER TABLE "region" ADD "zipCodes" character varying`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tenant_type_code_enum_old" AS ENUM('community_group', 'recycling_company', 'collection_agency', 'municipality', 'enterprise', 'educational_institution', 'healthcare_provider', 'non_profit_organization', 'government_agency', 'technology_company', 'retail_business', 'manufacturing_company', 'transportation_service', 'financial_institution', 'agricultural_business', 'energy_provider', 'construction_company', 'hospitality_business', 'generic')`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant_type" ALTER COLUMN "code" TYPE "public"."tenant_type_code_enum_old" USING "code"::"text"::"public"."tenant_type_code_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."tenant_type_code_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."tenant_type_code_enum_old" RENAME TO "tenant_type_code_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "domain"`);
    await queryRunner.query(`ALTER TABLE "role" DROP COLUMN "tenantId"`);
    await queryRunner.query(`DROP TABLE "kyc_details"`);
    await queryRunner.query(
      `DROP TYPE "public"."kyc_details_subjecttype_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."kyc_details_status_enum"`);
  }
}
