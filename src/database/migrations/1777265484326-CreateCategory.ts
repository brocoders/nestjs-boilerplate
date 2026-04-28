import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategory1777265484326 implements MigrationInterface {
  name = 'CreateCategory1777265484326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "category" ("id" uuid NOT NULL, "parent_id" uuid, "slug" character varying(64) NOT NULL, "name_translations" jsonb NOT NULL, "icon" character varying(128), "position" smallint NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "uq_category_slug" UNIQUE ("slug"), CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fc7596b06cc4354acc517b465b" ON "category" ("is_active") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1117b4fcb3cd4abb4383e1c274" ON "category" ("parent_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "category" ADD CONSTRAINT "FK_1117b4fcb3cd4abb4383e1c2743" FOREIGN KEY ("parent_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "category" DROP CONSTRAINT "FK_1117b4fcb3cd4abb4383e1c2743"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1117b4fcb3cd4abb4383e1c274"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fc7596b06cc4354acc517b465b"`,
    );
    await queryRunner.query(`DROP TABLE "category"`);
  }
}
