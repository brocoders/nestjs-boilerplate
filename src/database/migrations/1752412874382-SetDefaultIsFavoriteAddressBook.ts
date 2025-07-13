import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetDefaultIsFavoriteAddressBook1752412874382
  implements MigrationInterface
{
  name = 'SetDefaultIsFavoriteAddressBook1752412874382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address_book" ALTER COLUMN "isFavorite" SET DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address_book" ALTER COLUMN "isFavorite" DROP DEFAULT`,
    );
  }
}
