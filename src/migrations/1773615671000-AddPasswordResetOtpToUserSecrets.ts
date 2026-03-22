import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPasswordResetOtpToUserSecrets1773615671000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_secrets');
    if (!table) return;

    if (!table.findColumnByName('password_reset_otp')) {
      await queryRunner.addColumn(
        'user_secrets',
        new TableColumn({
          name: 'password_reset_otp',
          type: 'varchar',
          isNullable: true,
        }),
      );
    }

    if (!table.findColumnByName('password_reset_otp_expires_at')) {
      await queryRunner.addColumn(
        'user_secrets',
        new TableColumn({
          name: 'password_reset_otp_expires_at',
          type: 'timestamp',
          isNullable: true,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_secrets');
    if (!table) return;

    if (table.findColumnByName('password_reset_otp')) {
      await queryRunner.dropColumn('user_secrets', 'password_reset_otp');
    }

    if (table.findColumnByName('password_reset_otp_expires_at')) {
      await queryRunner.dropColumn(
        'user_secrets',
        'password_reset_otp_expires_at',
      );
    }
  }
}
