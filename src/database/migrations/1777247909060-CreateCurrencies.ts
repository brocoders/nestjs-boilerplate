import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCurrencies1777247909060 implements MigrationInterface {
  name = 'CreateCurrencies1777247909060';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "currency" ("code" character varying(3) NOT NULL, "symbol" character varying(8) NOT NULL, "decimal_places" smallint NOT NULL DEFAULT '2', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_723472e41cae44beb0763f4039c" PRIMARY KEY ("code"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "currency"`);
  }
}
