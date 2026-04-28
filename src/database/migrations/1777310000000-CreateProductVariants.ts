import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductVariants1777310000000 implements MigrationInterface {
  name = 'CreateProductVariants1777310000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. product_option_type
    await queryRunner.query(
      `CREATE TABLE "product_option_type" ("id" uuid NOT NULL, "product_id" uuid NOT NULL, "slug" character varying(48) NOT NULL, "name_translations" jsonb NOT NULL, "position" smallint NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_product_option_type_product_slug" UNIQUE ("product_id", "slug"), CONSTRAINT "PK_product_option_type_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_option_type_product_id" ON "product_option_type" ("product_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_option_type" ADD CONSTRAINT "FK_product_option_type_product_id" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // 2. product_option_value
    await queryRunner.query(
      `CREATE TABLE "product_option_value" ("id" uuid NOT NULL, "option_type_id" uuid NOT NULL, "slug" character varying(48) NOT NULL, "value_translations" jsonb NOT NULL, "swatch_color" character varying(9), "position" smallint NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_product_option_value_type_slug" UNIQUE ("option_type_id", "slug"), CONSTRAINT "PK_product_option_value_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_option_value_option_type_id" ON "product_option_value" ("option_type_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_option_value" ADD CONSTRAINT "FK_product_option_value_option_type_id" FOREIGN KEY ("option_type_id") REFERENCES "product_option_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // 3. product_variant
    await queryRunner.query(
      `CREATE TABLE "product_variant" ("id" uuid NOT NULL, "product_id" uuid NOT NULL, "sku" character varying(64) NOT NULL, "weight_grams" integer NOT NULL DEFAULT 0, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_product_variant_product_sku" UNIQUE ("product_id", "sku"), CONSTRAINT "PK_product_variant_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_variant_product_id" ON "product_variant" ("product_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant" ADD CONSTRAINT "FK_product_variant_product_id" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // 4. product_variant_option_value
    await queryRunner.query(
      `CREATE TABLE "product_variant_option_value" ("variant_id" uuid NOT NULL, "option_type_id" uuid NOT NULL, "option_value_id" uuid NOT NULL, CONSTRAINT "PK_product_variant_option_value" PRIMARY KEY ("variant_id", "option_type_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_product_variant_option_value_option_value_id" ON "product_variant_option_value" ("option_value_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant_option_value" ADD CONSTRAINT "FK_product_variant_option_value_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant_option_value" ADD CONSTRAINT "FK_product_variant_option_value_option_type_id" FOREIGN KEY ("option_type_id") REFERENCES "product_option_type"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant_option_value" ADD CONSTRAINT "FK_product_variant_option_value_option_value_id" FOREIGN KEY ("option_value_id") REFERENCES "product_option_value"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // 5. variant_price
    await queryRunner.query(
      `CREATE TABLE "variant_price" ("id" uuid NOT NULL, "variant_id" uuid NOT NULL, "region_id" uuid NOT NULL, "currency_code" character varying(3) NOT NULL, "price_minor_units" bigint NOT NULL, "compare_at_price_minor_units" bigint, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_variant_price_variant_region" UNIQUE ("variant_id", "region_id"), CONSTRAINT "ck_variant_price_non_negative" CHECK ("price_minor_units" >= 0 AND ("compare_at_price_minor_units" IS NULL OR "compare_at_price_minor_units" >= 0)), CONSTRAINT "PK_variant_price_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_variant_price_variant_id" ON "variant_price" ("variant_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_variant_price_region_id" ON "variant_price" ("region_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "variant_price" ADD CONSTRAINT "FK_variant_price_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "variant_price" ADD CONSTRAINT "FK_variant_price_region_id" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // 6. variant_stock
    await queryRunner.query(
      `CREATE TABLE "variant_stock" ("variant_id" uuid NOT NULL, "quantity" integer NOT NULL DEFAULT 0, "reserved_quantity" integer NOT NULL DEFAULT 0, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "ck_variant_stock_non_negative" CHECK ("quantity" >= 0 AND "reserved_quantity" >= 0), CONSTRAINT "PK_variant_stock_variant_id" PRIMARY KEY ("variant_id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "variant_stock" ADD CONSTRAINT "FK_variant_stock_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // variant_stock
    await queryRunner.query(
      `ALTER TABLE "variant_stock" DROP CONSTRAINT "FK_variant_stock_variant_id"`,
    );
    await queryRunner.query(`DROP TABLE "variant_stock"`);

    // variant_price
    await queryRunner.query(
      `ALTER TABLE "variant_price" DROP CONSTRAINT "FK_variant_price_region_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "variant_price" DROP CONSTRAINT "FK_variant_price_variant_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_variant_price_region_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_variant_price_variant_id"`,
    );
    await queryRunner.query(`DROP TABLE "variant_price"`);

    // product_variant_option_value
    await queryRunner.query(
      `ALTER TABLE "product_variant_option_value" DROP CONSTRAINT "FK_product_variant_option_value_option_value_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant_option_value" DROP CONSTRAINT "FK_product_variant_option_value_option_type_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variant_option_value" DROP CONSTRAINT "FK_product_variant_option_value_variant_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_product_variant_option_value_option_value_id"`,
    );
    await queryRunner.query(`DROP TABLE "product_variant_option_value"`);

    // product_variant
    await queryRunner.query(
      `ALTER TABLE "product_variant" DROP CONSTRAINT "FK_product_variant_product_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_product_variant_product_id"`,
    );
    await queryRunner.query(`DROP TABLE "product_variant"`);

    // product_option_value
    await queryRunner.query(
      `ALTER TABLE "product_option_value" DROP CONSTRAINT "FK_product_option_value_option_type_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_product_option_value_option_type_id"`,
    );
    await queryRunner.query(`DROP TABLE "product_option_value"`);

    // product_option_type
    await queryRunner.query(
      `ALTER TABLE "product_option_type" DROP CONSTRAINT "FK_product_option_type_product_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_product_option_type_product_id"`,
    );
    await queryRunner.query(`DROP TABLE "product_option_type"`);
  }
}
