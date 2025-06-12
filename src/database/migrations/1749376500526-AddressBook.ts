import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddressBook1749376500526 implements MigrationInterface {
  name = 'AddressBook1749376500526';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "address_book" ("isFavorite" boolean, "notes" character varying, "memo" character varying, "tag" character varying, "assetType" character varying NOT NULL, "blockchain" character varying NOT NULL, "address" character varying NOT NULL, "label" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_188a02dee277dd0f9e488fdf06f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "address_book" ADD CONSTRAINT "FK_b9ed809222f0f7b4ea4085016c2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address_book" DROP CONSTRAINT "FK_b9ed809222f0f7b4ea4085016c2"`,
    );
    await queryRunner.query(`DROP TABLE "address_book"`);
  }
}
