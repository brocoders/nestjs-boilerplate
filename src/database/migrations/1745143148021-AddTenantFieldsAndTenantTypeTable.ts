import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantFieldsAndTenantTypeTable1745143148021
  implements MigrationInterface
{
  name = 'AddTenantFieldsAndTenantTypeTable1745143148021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."tenant_type_code_enum" AS ENUM('community_group', 'recycling_company', 'collection_agency', 'municipality', 'enterprise', 'educational_institution', 'healthcare_provider', 'non_profit_organization', 'government_agency', 'technology_company', 'retail_business', 'manufacturing_company', 'transportation_service', 'financial_institution', 'agricultural_business', 'energy_provider', 'construction_company', 'hospitality_business', 'generic')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenant_type" ("description" character varying, "code" "public"."tenant_type_code_enum" NOT NULL, "name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4c0533c3a7e87116891dec23578" UNIQUE ("code"), CONSTRAINT "PK_4a98ba209be6df3b80a4feb5838" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD "schemaName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD "address" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD "primaryPhone" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD "primaryEmail" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD "name" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "tenant" ADD "logoId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD CONSTRAINT "UQ_0ed69b4239b1f892b96798065a1" UNIQUE ("logoId")`,
    );
    await queryRunner.query(`ALTER TABLE "tenant" ADD "typeId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD CONSTRAINT "FK_0ed69b4239b1f892b96798065a1" FOREIGN KEY ("logoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD CONSTRAINT "FK_38c7bb1a7983b359f34b63a0fd6" FOREIGN KEY ("typeId") REFERENCES "tenant_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenant" DROP CONSTRAINT "FK_38c7bb1a7983b359f34b63a0fd6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" DROP CONSTRAINT "FK_0ed69b4239b1f892b96798065a1"`,
    );
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "typeId"`);
    await queryRunner.query(
      `ALTER TABLE "tenant" DROP CONSTRAINT "UQ_0ed69b4239b1f892b96798065a1"`,
    );
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "logoId"`);
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "primaryEmail"`);
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "primaryPhone"`);
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "address"`);
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "schemaName"`);
    await queryRunner.query(`DROP TABLE "tenant_type"`);
    await queryRunner.query(`DROP TYPE "public"."tenant_type_code_enum"`);
  }
}
