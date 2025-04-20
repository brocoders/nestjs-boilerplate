import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddKycDetails1745134929693 implements MigrationInterface {
  name = 'AddKycDetails1745134929693';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tenant" DROP CONSTRAINT "FK_7e9514d9b3815c4c9c059dc6a2d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_73a44889926ed74ebd527dc9a96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" DROP CONSTRAINT "UQ_7e9514d9b3815c4c9c059dc6a2d"`,
    );
    await queryRunner.query(`ALTER TABLE "tenant" DROP COLUMN "kycDetailsId"`);
    await queryRunner.query(
      `ALTER TABLE "kyc_details" DROP COLUMN "verifiedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" DROP COLUMN "submittedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "kyc_details" DROP COLUMN "status"`);
    await queryRunner.query(
      `ALTER TABLE "kyc_details" DROP COLUMN "documentData"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" DROP COLUMN "documentNumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" DROP COLUMN "documentType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" DROP COLUMN "subjectType"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_73a44889926ed74ebd527dc9a96"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "kycDetailsId"`);
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD "tenantId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD CONSTRAINT "FK_78f4992112d203106339e1b20e6" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD CONSTRAINT "FK_295d21c339b0985283e10f683ae" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "kyc_details" DROP CONSTRAINT "FK_295d21c339b0985283e10f683ae"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" DROP CONSTRAINT "FK_78f4992112d203106339e1b20e6"`,
    );
    await queryRunner.query(`ALTER TABLE "kyc_details" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "kyc_details" DROP COLUMN "tenantId"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "kycDetailsId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_73a44889926ed74ebd527dc9a96" UNIQUE ("kycDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD "subjectType" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD "documentType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD "documentNumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD "documentData" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD "status" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD "submittedAt" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "kyc_details" ADD "verifiedAt" TIMESTAMP`,
    );
    await queryRunner.query(`ALTER TABLE "tenant" ADD "kycDetailsId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD CONSTRAINT "UQ_7e9514d9b3815c4c9c059dc6a2d" UNIQUE ("kycDetailsId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_73a44889926ed74ebd527dc9a96" FOREIGN KEY ("kycDetailsId") REFERENCES "kyc_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tenant" ADD CONSTRAINT "FK_7e9514d9b3815c4c9c059dc6a2d" FOREIGN KEY ("kycDetailsId") REFERENCES "kyc_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
