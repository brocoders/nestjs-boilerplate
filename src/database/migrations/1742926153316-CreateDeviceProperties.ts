import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDeviceProperties1742926153316 implements MigrationInterface {
  name = 'CreateDeviceProperties1742926153316';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" ADD "isActive" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD "model" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD "appVersion" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD "osVersion" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD "platform" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD "deviceToken" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD "userId" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "device" ADD CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "device" DROP CONSTRAINT "FK_9eb58b0b777dbc2864820228ebc"`,
    );
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "deviceToken"`);
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "platform"`);
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "osVersion"`);
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "appVersion"`);
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "model"`);
    await queryRunner.query(`ALTER TABLE "device" DROP COLUMN "isActive"`);
  }
}
