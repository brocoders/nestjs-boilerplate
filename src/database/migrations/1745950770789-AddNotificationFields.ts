import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotificationFields1745950770789 implements MigrationInterface {
  name = 'AddNotificationFields1745950770789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "category" character varying NOT NULL DEFAULT 'general'`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "isRead" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "isDelivered" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "notification" ADD "data" jsonb`);
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "topic" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "message" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "title" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "deviceId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_0f828a02012d80b83068a893672" FOREIGN KEY ("deviceId") REFERENCES "device"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_0f828a02012d80b83068a893672"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "deviceId"`,
    );
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "message"`);
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "topic"`);
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "data"`);
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "isDelivered"`,
    );
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "isRead"`);
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "category"`,
    );
  }
}
