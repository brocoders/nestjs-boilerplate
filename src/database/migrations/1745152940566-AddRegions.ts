import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRegions1745152940566 implements MigrationInterface {
  name = 'AddRegions1745152940566';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "region" ("zipCodes" character varying, "operatingHours" character varying, "serviceTypes" character varying, "centroidLon" integer, "centroidLat" character varying, "boundary" character varying, "name" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tenantId" uuid NOT NULL, CONSTRAINT "PK_5f48ffc3af96bc486f5f3f3a6da" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_regions_region" ("userId" integer NOT NULL, "regionId" uuid NOT NULL, CONSTRAINT "PK_01aac7f0120ad731078bf7786f2" PRIMARY KEY ("userId", "regionId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0252300651acd5cbf815645395" ON "user_regions_region" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dbbbcbac1f75c3aca60e371c20" ON "user_regions_region" ("regionId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "region" ADD CONSTRAINT "FK_aaf7ebdc7470c865314f414b241" FOREIGN KEY ("tenantId") REFERENCES "tenant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_regions_region" ADD CONSTRAINT "FK_0252300651acd5cbf815645395d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_regions_region" ADD CONSTRAINT "FK_dbbbcbac1f75c3aca60e371c200" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_regions_region" DROP CONSTRAINT "FK_dbbbcbac1f75c3aca60e371c200"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_regions_region" DROP CONSTRAINT "FK_0252300651acd5cbf815645395d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "region" DROP CONSTRAINT "FK_aaf7ebdc7470c865314f414b241"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dbbbcbac1f75c3aca60e371c20"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0252300651acd5cbf815645395"`,
    );
    await queryRunner.query(`DROP TABLE "user_regions_region"`);
    await queryRunner.query(`DROP TABLE "region"`);
  }
}
