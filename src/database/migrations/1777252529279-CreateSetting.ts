import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSetting1777252529279 implements MigrationInterface {
  name = 'CreateSetting1777252529279';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "setting" ("id" smallint NOT NULL, "values" jsonb NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fcb21187dc6094e24a48f677bed" PRIMARY KEY ("id"))`,
    );
    // Seed singleton config row (id=1). Idempotent on re-run.
    await queryRunner.query(
      `INSERT INTO "setting" ("id", "values", "updated_at")
       VALUES (1, $1::jsonb, now())
       ON CONFLICT ("id") DO NOTHING`,
      [
        JSON.stringify({
          multi_region_enabled: false,
          vendors_auto_approve: false,
          products_auto_approve: false,
          default_region_code: 'SA',
          default_locale_code: 'ar',
        }),
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "setting"`);
  }
}
