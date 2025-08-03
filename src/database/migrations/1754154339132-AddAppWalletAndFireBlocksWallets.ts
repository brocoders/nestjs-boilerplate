import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAppWalletAndFireBlocksWallets1754154339132
  implements MigrationInterface
{
  name = 'AddAppWalletAndFireBlocksWallets1754154339132';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "wallet" ("active" boolean NOT NULL, "label" character varying, "provider" character varying NOT NULL, "lockupId" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fireblocks_ncw_wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c57b43f0aa40bdd82204f159f0d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "fireblocks_cw_wallet" ("assets" character varying, "metadata" character varying, "vaultType" character varying NOT NULL, "autoFuel" boolean NOT NULL, "hiddenOnUI" boolean NOT NULL, "name" character varying NOT NULL, "referenceId" character varying NOT NULL, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_146f8e1a2b5bef2f6fa9b56fab9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`,
    );
    await queryRunner.query(`DROP TABLE "fireblocks_cw_wallet"`);
    await queryRunner.query(`DROP TABLE "fireblocks_ncw_wallet"`);
    await queryRunner.query(`DROP TABLE "wallet"`);
  }
}
