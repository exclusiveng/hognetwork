import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFinalSchema1711180388001 implements MigrationInterface {
    name = 'UpdateFinalSchema1711180388001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Update data_plans table safely
        await queryRunner.query(`DO $$ BEGIN 
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='data_plans' AND column_name='devices') THEN
                ALTER TABLE "data_plans" ADD "devices" integer NOT NULL DEFAULT 1;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='data_plans' AND column_name='upload') THEN
                ALTER TABLE "data_plans" ADD "upload" integer NOT NULL DEFAULT 5;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='data_plans' AND column_name='download') THEN
                ALTER TABLE "data_plans" ADD "download" integer NOT NULL DEFAULT 8;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='data_plans' AND column_name='payment_link') THEN
                ALTER TABLE "data_plans" ADD "payment_link" character varying;
            END IF;
        END $$;`);

        // Update settings table safely
        await queryRunner.query(`DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='site_name') THEN
                ALTER TABLE "settings" ADD "site_name" character varying;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='manual_payment_bank_name') THEN
                ALTER TABLE "settings" ADD "manual_payment_bank_name" character varying;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='manual_payment_account_number') THEN
                ALTER TABLE "settings" ADD "manual_payment_account_number" character varying;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='manual_payment_account_name') THEN
                ALTER TABLE "settings" ADD "manual_payment_account_name" character varying;
            END IF;
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='notifications') THEN
                ALTER TABLE "settings" ADD "notifications" text;
            END IF;
        END $$;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert settings table
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "notifications"`);
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "manual_payment_account_name"`);
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "manual_payment_account_number"`);
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "manual_payment_bank_name"`);
        await queryRunner.query(`ALTER TABLE "settings" DROP COLUMN "site_name"`);

        // Revert data_plans table
        await queryRunner.query(`ALTER TABLE "data_plans" DROP COLUMN "payment_link"`);
        await queryRunner.query(`ALTER TABLE "data_plans" DROP COLUMN "download"`);
        await queryRunner.query(`ALTER TABLE "data_plans" DROP COLUMN "upload"`);
        await queryRunner.query(`ALTER TABLE "data_plans" DROP COLUMN "devices"`);
    }
}
