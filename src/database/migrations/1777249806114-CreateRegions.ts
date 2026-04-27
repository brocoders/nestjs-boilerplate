import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRegions1777249806114 implements MigrationInterface {
  name = 'CreateRegions1777249806114';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "region" ("id" uuid NOT NULL, "code" character varying(2) NOT NULL, "name_translations" jsonb NOT NULL, "currency_code" character varying(3) NOT NULL, "default_locale" character varying(8) NOT NULL, "is_enabled" boolean NOT NULL DEFAULT true, "is_default" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_74f7723fdff738f92929c0056cb" UNIQUE ("code"), CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`,
    );
    // Enforces at most one default region; non-default rows are not constrained.
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_region_default_unique" ON "region" ("is_default") WHERE "is_default" = true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_region_default_unique"`);
    await queryRunner.query(`DROP TABLE "region"`);
  }
}
