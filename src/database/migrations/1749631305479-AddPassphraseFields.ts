import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPassphraseFields1749631305479 implements MigrationInterface {
  name = 'AddPassphraseFields1749631305479';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "passphrase" ("location" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_a1768f39c05609bb76464bfd0f9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "passphrase" ADD CONSTRAINT "FK_759a693ed2fa634697b4e2f4cc7" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "passphrase" DROP CONSTRAINT "FK_759a693ed2fa634697b4e2f4cc7"`,
    );
    await queryRunner.query(`DROP TABLE "passphrase"`);
  }
}
