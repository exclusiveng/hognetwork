import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePaystackToFlutterwave1773600473816 implements MigrationInterface {
    name = 'UpdatePaystackToFlutterwave1773600473816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Rename column only if the OLD name still exists (guard against already-migrated DBs)
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'user_subscriptions'
                    AND column_name = 'paystackSubscriptionCode'
                ) THEN
                    ALTER TABLE "user_subscriptions" RENAME COLUMN "paystackSubscriptionCode" TO "flutterwaveTransactionId";
                END IF;
            END
            $$;
        `);

        // Ensure the flutterwaveTransactionId column exists (add it if it was never created at all)
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'user_subscriptions'
                    AND column_name = 'flutterwaveTransactionId'
                ) THEN
                    ALTER TABLE "user_subscriptions" ADD COLUMN "flutterwaveTransactionId" character varying UNIQUE;
                END IF;
            END
            $$;
        `);

        // Rename constraint only if the old constraint name still exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'UQ_7751edfdbbd09821513382e1040'
                ) THEN
                    ALTER TABLE "user_subscriptions" RENAME CONSTRAINT "UQ_7751edfdbbd09821513382e1040" TO "UQ_f7e7d98aec6bd19a6e6c87c8461";
                END IF;
            END
            $$;
        `);

        // Set rulesets defaults (safe to run unconditionally)
        await queryRunner.query(`ALTER TABLE "rulesets" ALTER COLUMN "trustScore" SET DEFAULT '4.5'`);
        await queryRunner.query(`ALTER TABLE "rulesets" ALTER COLUMN "scanAccuracy" SET DEFAULT '98.2'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rulesets" ALTER COLUMN "scanAccuracy" SET DEFAULT 98.2`);
        await queryRunner.query(`ALTER TABLE "rulesets" ALTER COLUMN "trustScore" SET DEFAULT 4.5`);

        // Rename constraint back – only if the new name exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM pg_constraint WHERE conname = 'UQ_f7e7d98aec6bd19a6e6c87c8461'
                ) THEN
                    ALTER TABLE "user_subscriptions" RENAME CONSTRAINT "UQ_f7e7d98aec6bd19a6e6c87c8461" TO "UQ_7751edfdbbd09821513382e1040";
                END IF;
            END
            $$;
        `);

        // Rename column back – only if flutterwaveTransactionId still exists
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1 FROM information_schema.columns
                    WHERE table_name = 'user_subscriptions'
                    AND column_name = 'flutterwaveTransactionId'
                ) THEN
                    ALTER TABLE "user_subscriptions" RENAME COLUMN "flutterwaveTransactionId" TO "paystackSubscriptionCode";
                END IF;
            END
            $$;
        `);
    }

}
