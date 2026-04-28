import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProduct1777297391804 implements MigrationInterface {
  name = 'CreateProduct1777297391804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."product_status_enum" AS ENUM('DRAFT', 'ACTIVE', 'ARCHIVED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL, "vendor_id" uuid NOT NULL, "category_id" uuid, "slug" character varying(96) NOT NULL, "name_translations" jsonb NOT NULL, "description_translations" jsonb NOT NULL DEFAULT '{}'::jsonb, "status" "public"."product_status_enum" NOT NULL DEFAULT 'DRAFT', "base_currency" character varying(3) NOT NULL, "supported_region_ids" uuid array NOT NULL DEFAULT ARRAY[]::uuid[], "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_product_vendor_slug" UNIQUE ("vendor_id", "slug"), CONSTRAINT "PK_product_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_vendor_id" ON "product" ("vendor_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_category_id" ON "product" ("category_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_status" ON "product" ("status") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_product_vendor_id" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_product_category_id" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_product_category_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_product_vendor_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_product_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_product_category_id"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_product_vendor_id"`);
    await queryRunner.query(`DROP TABLE "product"`);
    await queryRunner.query(`DROP TYPE "public"."product_status_enum"`);
  }
}
