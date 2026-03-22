import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveLemonSqueezy1742252847000 implements MigrationInterface {
    name = 'RemoveLemonSqueezy1742252847000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Safely drop the lemonsqueezySubscriptionId column if it still exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'user_subscriptions'
                    AND column_name = 'lemonsqueezySubscriptionId'
                ) THEN
                    ALTER TABLE "user_subscriptions" DROP COLUMN "lemonsqueezySubscriptionId";
                END IF;
            END
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Re-add column if rolling back
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'user_subscriptions'
                    AND column_name = 'lemonsqueezySubscriptionId'
                ) THEN
                    ALTER TABLE "user_subscriptions"
                    ADD COLUMN "lemonsqueezySubscriptionId" character varying UNIQUE;
                END IF;
            END
            $$;
        `);
    }
}
