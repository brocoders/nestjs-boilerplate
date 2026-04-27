import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVendor1777263652511 implements MigrationInterface {
  name = 'CreateVendor1777263652511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."vendor_status_enum" AS ENUM('PENDING', 'ACTIVE', 'SUSPENDED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "vendor" ("id" uuid NOT NULL, "user_id" integer NOT NULL, "slug" character varying(64) NOT NULL, "name_translations" jsonb NOT NULL, "description_translations" jsonb NOT NULL DEFAULT '{}'::jsonb, "logo_file_id" uuid, "banner_file_id" uuid, "status" "public"."vendor_status_enum" NOT NULL DEFAULT 'PENDING', "default_region_id" uuid NOT NULL, "supported_region_ids" uuid array NOT NULL DEFAULT ARRAY[]::uuid[], "return_window_days" smallint NOT NULL DEFAULT '14', "ships_from_country" character varying(2), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_vendor_slug" UNIQUE ("slug"), CONSTRAINT "uq_vendor_user" UNIQUE ("user_id"), CONSTRAINT "REL_139dbded1008da1588c16f34a4" UNIQUE ("user_id"), CONSTRAINT "PK_931a23f6231a57604f5a0e32780" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_53f9fb2b46229d8e6df07fea9b" ON "vendor" ("status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor" ADD CONSTRAINT "FK_139dbded1008da1588c16f34a40" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor" ADD CONSTRAINT "FK_8fead3e269400b8d404bf717018" FOREIGN KEY ("logo_file_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor" ADD CONSTRAINT "FK_1d0d6c7e8c6e8236e09bfd4be2a" FOREIGN KEY ("banner_file_id") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendor" DROP CONSTRAINT "FK_1d0d6c7e8c6e8236e09bfd4be2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor" DROP CONSTRAINT "FK_8fead3e269400b8d404bf717018"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor" DROP CONSTRAINT "FK_139dbded1008da1588c16f34a40"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_53f9fb2b46229d8e6df07fea9b"`,
    );
    await queryRunner.query(`DROP TABLE "vendor"`);
    await queryRunner.query(`DROP TYPE "public"."vendor_status_enum"`);
  }
}
