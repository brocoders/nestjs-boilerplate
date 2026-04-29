import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderTables1777330000000 implements MigrationInterface {
  name = 'CreateOrderTables1777330000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Enums ─────────────────────────────────────────────────────────
    await queryRunner.query(
      `CREATE TYPE "public"."order_payment_method_enum" AS ENUM('COD')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_payment_status_enum" AS ENUM('PENDING', 'COLLECTED', 'FAILED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."sub_order_fulfillment_status_enum" AS ENUM('AWAITING_CONFIRMATION', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED')`,
    );

    // ── 1. order ──────────────────────────────────────────────────────
    await queryRunner.query(
      `CREATE TABLE "order" (` +
        `"id" uuid NOT NULL, ` +
        `"buyer_id" integer NOT NULL, ` +
        `"public_code" character varying(16) NOT NULL, ` +
        `"region_id" uuid NOT NULL, ` +
        `"currency_code" character varying(3) NOT NULL, ` +
        `"subtotal_minor" bigint NOT NULL, ` +
        `"shipping_minor" bigint NOT NULL, ` +
        `"total_minor" bigint NOT NULL, ` +
        `"payment_method" "public"."order_payment_method_enum" NOT NULL, ` +
        `"payment_status" "public"."order_payment_status_enum" NOT NULL DEFAULT 'PENDING', ` +
        `"address_snapshot" jsonb NOT NULL, ` +
        `"placed_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), ` +
        `"created_at" TIMESTAMP NOT NULL DEFAULT now(), ` +
        `"updated_at" TIMESTAMP NOT NULL DEFAULT now(), ` +
        `CONSTRAINT "uq_order_public_code" UNIQUE ("public_code"), ` +
        `CONSTRAINT "ck_order_subtotal_non_negative" CHECK ("subtotal_minor" >= 0), ` +
        `CONSTRAINT "ck_order_shipping_non_negative" CHECK ("shipping_minor" >= 0), ` +
        `CONSTRAINT "ck_order_total_non_negative" CHECK ("total_minor" >= 0), ` +
        `CONSTRAINT "PK_order_id" PRIMARY KEY ("id")` +
        `)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_order_buyer_placed_at" ON "order" ("buyer_id", "placed_at" DESC)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_order_public_code" ON "order" ("public_code")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_order_buyer_id" FOREIGN KEY ("buyer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_order_region_id" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );

    // ── 2. sub_order ──────────────────────────────────────────────────
    await queryRunner.query(
      `CREATE TABLE "sub_order" (` +
        `"id" uuid NOT NULL, ` +
        `"order_id" uuid NOT NULL, ` +
        `"vendor_id" uuid NOT NULL, ` +
        `"subtotal_minor" bigint NOT NULL, ` +
        `"shipping_minor" bigint NOT NULL, ` +
        `"total_minor" bigint NOT NULL, ` +
        `"fulfillment_status" "public"."sub_order_fulfillment_status_enum" NOT NULL DEFAULT 'AWAITING_CONFIRMATION', ` +
        `"tracking_number" character varying(64), ` +
        `"courier_name" character varying(64), ` +
        `"packed_at" TIMESTAMP WITH TIME ZONE, ` +
        `"shipped_at" TIMESTAMP WITH TIME ZONE, ` +
        `"delivered_at" TIMESTAMP WITH TIME ZONE, ` +
        `"created_at" TIMESTAMP NOT NULL DEFAULT now(), ` +
        `"updated_at" TIMESTAMP NOT NULL DEFAULT now(), ` +
        `CONSTRAINT "uq_sub_order_order_vendor" UNIQUE ("order_id", "vendor_id"), ` +
        `CONSTRAINT "ck_sub_order_subtotal_non_negative" CHECK ("subtotal_minor" >= 0), ` +
        `CONSTRAINT "ck_sub_order_shipping_non_negative" CHECK ("shipping_minor" >= 0), ` +
        `CONSTRAINT "ck_sub_order_total_non_negative" CHECK ("total_minor" >= 0), ` +
        `CONSTRAINT "PK_sub_order_id" PRIMARY KEY ("id")` +
        `)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_sub_order_vendor_status" ON "sub_order" ("vendor_id", "fulfillment_status")`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_order" ADD CONSTRAINT "FK_sub_order_order_id" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_order" ADD CONSTRAINT "FK_sub_order_vendor_id" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );

    // ── 3. order_item ─────────────────────────────────────────────────
    await queryRunner.query(
      `CREATE TABLE "order_item" (` +
        `"id" uuid NOT NULL, ` +
        `"sub_order_id" uuid NOT NULL, ` +
        `"variant_id" uuid NOT NULL, ` +
        `"product_id" uuid NOT NULL, ` +
        `"vendor_id" uuid NOT NULL, ` +
        `"quantity" integer NOT NULL, ` +
        `"unit_price_snapshot" bigint NOT NULL, ` +
        `"currency_snapshot" character varying(3) NOT NULL, ` +
        `"name_snapshot_translations" jsonb NOT NULL, ` +
        `"image_snapshot_url" text, ` +
        `"sku_snapshot" character varying(64) NOT NULL, ` +
        `"created_at" TIMESTAMP NOT NULL DEFAULT now(), ` +
        `CONSTRAINT "ck_order_item_quantity_positive" CHECK ("quantity" > 0), ` +
        `CONSTRAINT "ck_order_item_unit_price_non_negative" CHECK ("unit_price_snapshot" >= 0), ` +
        `CONSTRAINT "PK_order_item_id" PRIMARY KEY ("id")` +
        `)`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_order_item_sub_order_id" ON "order_item" ("sub_order_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_order_item_sub_order_id" FOREIGN KEY ("sub_order_id") REFERENCES "sub_order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_order_item_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_variant"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // order_item
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_order_item_variant_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_order_item_sub_order_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_order_item_sub_order_id"`,
    );
    await queryRunner.query(`DROP TABLE "order_item"`);

    // sub_order
    await queryRunner.query(
      `ALTER TABLE "sub_order" DROP CONSTRAINT "FK_sub_order_vendor_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_order" DROP CONSTRAINT "FK_sub_order_order_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_sub_order_vendor_status"`,
    );
    await queryRunner.query(`DROP TABLE "sub_order"`);

    // order
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_order_region_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_order_buyer_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_order_public_code"`);
    await queryRunner.query(`DROP INDEX "public"."idx_order_buyer_placed_at"`);
    await queryRunner.query(`DROP TABLE "order"`);

    // Enums
    await queryRunner.query(
      `DROP TYPE "public"."sub_order_fulfillment_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."order_payment_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."order_payment_method_enum"`);
  }
}
