import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTenantRelationship1745132189825
  implements MigrationInterface
{
  name = 'CreateUserTenantRelationship1745132189825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "tenantId" uuid NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_685bf353c85f23b6f848e4dcded" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_685bf353c85f23b6f848e4dcded"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "tenantId"`);
  }
}
