import { MigrationInterface /** QueryRunner **/ } from 'typeorm';

export class AddKycDetailsFields1745138722127 implements MigrationInterface {
  name = 'AddKycDetailsFields1745138722127';

  public async up(/**queryRunner: QueryRunner**/): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" ADD "verifiedBy" integer`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" ADD "verifiedAt" TIMESTAMP`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" ADD "submittedAt" TIMESTAMP`,
    // );
    // await queryRunner.query(
    //   `CREATE TYPE "public"."kyc_details_status_enum" AS ENUM('pending', 'verified', 'rejected')`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" ADD "status" "public"."kyc_details_status_enum" NOT NULL DEFAULT 'pending'`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" ADD "documentData" jsonb`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" ADD "documentNumber" character varying`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" ADD "documentType" character varying`,
    // );
    // await queryRunner.query(
    //   `CREATE TYPE "public"."kyc_details_subjecttype_enum" AS ENUM('user', 'tenant')`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" ADD "subjectType" "public"."kyc_details_subjecttype_enum" NOT NULL`,
    // );
  }

  public async down(/**queryRunner: QueryRunner**/): Promise<void> {
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" DROP COLUMN "subjectType"`,
    // );
    // await queryRunner.query(
    //   `DROP TYPE "public"."kyc_details_subjecttype_enum"`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" DROP COLUMN "documentType"`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" DROP COLUMN "documentNumber"`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" DROP COLUMN "documentData"`,
    // );
    // await queryRunner.query(`ALTER TABLE "kyc_details" DROP COLUMN "status"`);
    // await queryRunner.query(`DROP TYPE "public"."kyc_details_status_enum"`);
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" DROP COLUMN "submittedAt"`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" DROP COLUMN "verifiedAt"`,
    // );
    // await queryRunner.query(
    //   `ALTER TABLE "kyc_details" DROP COLUMN "verifiedBy"`,
    // );
  }
}
