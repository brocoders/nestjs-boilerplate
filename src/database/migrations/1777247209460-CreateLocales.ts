import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocales1777247209460 implements MigrationInterface {
  name = 'CreateLocales1777247209460';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "locale" ("id" uuid NOT NULL, "code" character varying(8) NOT NULL, "native_name" character varying(64) NOT NULL, "is_rtl" boolean NOT NULL DEFAULT false, "is_enabled" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_03f3269461e7b003dca6b1699f4" UNIQUE ("code"), CONSTRAINT "PK_4b7a3ebe8ec48f1bb2c4b80e349" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "locale"`);
  }
}
