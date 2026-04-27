import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFxRates1777254860322 implements MigrationInterface {
  name = 'CreateFxRates1777254860322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "fx_rate" ("id" uuid NOT NULL, "base_currency" character varying(3) NOT NULL, "quote_currency" character varying(3) NOT NULL, "rate" numeric(18,8) NOT NULL, "fetched_date" date NOT NULL, "source" character varying(32) NOT NULL DEFAULT 'exchangerate.host', "fetched_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_fx_rate_pair_day" UNIQUE ("base_currency", "quote_currency", "fetched_date"), CONSTRAINT "PK_172deb302807396e0da8f0aafe0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58b4b154e112a54073d2d24a8d" ON "fx_rate" ("base_currency", "quote_currency") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58b4b154e112a54073d2d24a8d"`,
    );
    await queryRunner.query(`DROP TABLE "fx_rate"`);
  }
}
