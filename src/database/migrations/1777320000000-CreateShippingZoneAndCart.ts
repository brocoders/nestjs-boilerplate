import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShippingZoneAndCart1777320000000 implements MigrationInterface {
  name = 'CreateShippingZoneAndCart1777320000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. shipping_zone
    await queryRunner.query(
      `CREATE TABLE "shipping_zone" ("id" uuid NOT NULL, "vendor_id" uuid NOT NULL, "name" character varying(64) NOT NULL, "country_codes" character varying(2) array NOT NULL DEFAULT '{}', "region_codes" character varying(64) array NOT NULL DEFAULT '{}', "cost_minor_units" bigint NOT NULL, "currency_code" character varying(3) NOT NULL, "free_above_minor_units" bigint, "est_delivery_days_min" smallint NOT NULL, "est_delivery_days_max" smallint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "ck_shipping_zone_cost_non_negative" CHECK ("cost_minor_units" >= 0 AND ("free_above_minor_units" IS NULL OR "free_above_minor_units" >= 0)), CONSTRAINT "ck_shipping_zone_delivery_days" CHECK ("est_delivery_days_min" >= 0 AND "est_delivery_days_max" >= "est_delivery_days_min"), CONSTRAINT "PK_shipping_zone_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_shipping_zone_vendor_id" ON "shipping_zone" ("vendor_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "shipping_zone" ADD CONSTRAINT "FK_shipping_zone_vendor_id" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );

    // 2. cart
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" uuid NOT NULL, "user_id" integer NOT NULL, "region_id" uuid NOT NULL, "currency_code" character varying(3) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_cart_user" UNIQUE ("user_id"), CONSTRAINT "PK_cart_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_cart_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_cart_region_id" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );

    // 3. cart_item
    await queryRunner.query(
      `CREATE TABLE "cart_item" ("id" uuid NOT NULL, "cart_id" uuid NOT NULL, "variant_id" uuid NOT NULL, "quantity" integer NOT NULL, "unit_price_snapshot" bigint NOT NULL, "currency_snapshot" character varying(3) NOT NULL, "added_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_cart_item_cart_variant" UNIQUE ("cart_id", "variant_id"), CONSTRAINT "ck_cart_item_quantity_positive" CHECK ("quantity" > 0), CONSTRAINT "ck_cart_item_unit_price_non_negative" CHECK ("unit_price_snapshot" >= 0), CONSTRAINT "PK_cart_item_id" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cart_item_cart_id" ON "cart_item" ("cart_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_cart_item_cart_id" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" ADD CONSTRAINT "FK_cart_item_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // cart_item
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_cart_item_variant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_item" DROP CONSTRAINT "FK_cart_item_cart_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_cart_item_cart_id"`);
    await queryRunner.query(`DROP TABLE "cart_item"`);

    // cart
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_cart_region_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_cart_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "cart"`);

    // shipping_zone
    await queryRunner.query(
      `ALTER TABLE "shipping_zone" DROP CONSTRAINT "FK_shipping_zone_vendor_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_shipping_zone_vendor_id"`,
    );
    await queryRunner.query(`DROP TABLE "shipping_zone"`);
  }
}
