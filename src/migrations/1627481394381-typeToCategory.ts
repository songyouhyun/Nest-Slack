import { MigrationInterface, QueryRunner } from 'typeorm';

export class typeToCategory1627481394381 implements MigrationInterface {
  name = 'typeToCategory1627481394381';

  // up = 실제 변경할 내용
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `category` TO `type`',
    );
  }

  // down = ROLLBACK 할 내용
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `mentions` RENAME COLUMN `type` TO `category`',
    );
  }
}
