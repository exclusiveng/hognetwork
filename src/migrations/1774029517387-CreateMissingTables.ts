import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMissingTables1774029517387 implements MigrationInterface {
    name = 'CreateMissingTables1774029517387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create table api_keys safely
        await queryRunner.query(`CREATE TABLE IF NOT EXISTS "api_keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(50) NOT NULL, "key_hash" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "last_used_at" TIMESTAMP, "company_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5c8a79801b44bd27b79228e1dad" PRIMARY KEY ("id"))`);

        // Safely drop constraint and column from user_subscriptions
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'UQ_231fb0a9f0973d67e3941ccdbbc') THEN
                    ALTER TABLE "user_subscriptions" DROP CONSTRAINT "UQ_231fb0a9f0973d67e3941ccdbbc";
                END IF;
            END
            $$;
        `);
        await queryRunner.query(`ALTER TABLE "user_subscriptions" DROP COLUMN IF EXISTS "lemonsqueezySubscriptionId"`);

        // Safely add columns to user_secrets
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_secrets' AND column_name = 'password_reset_otp') THEN
                    ALTER TABLE "user_secrets" ADD COLUMN "password_reset_otp" character varying;
                END IF;
            END
            $$;
        `);
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_secrets' AND column_name = 'password_reset_otp_expires_at') THEN
                    ALTER TABLE "user_secrets" ADD COLUMN "password_reset_otp_expires_at" TIMESTAMP;
                END IF;
            END
            $$;
        `);

        // Safe defaults for rulesets
        await queryRunner.query(`ALTER TABLE "rulesets" ALTER COLUMN "trustScore" SET DEFAULT '4.5'`);
        await queryRunner.query(`ALTER TABLE "rulesets" ALTER COLUMN "scanAccuracy" SET DEFAULT '98.2'`);

        // Safely add foreign key to api_keys
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_8396859f08e7ad26726c9b3860e') THEN
                    ALTER TABLE "api_keys" ADD CONSTRAINT "FK_8396859f08e7ad26726c9b3860e" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_8396859f08e7ad26726c9b3860e') THEN
                    ALTER TABLE "api_keys" DROP CONSTRAINT "FK_8396859f08e7ad26726c9b3860e";
                END IF;
            END
            $$;
        `);
        await queryRunner.query(`ALTER TABLE "rulesets" ALTER COLUMN "scanAccuracy" SET DEFAULT 98.2`);
        await queryRunner.query(`ALTER TABLE "rulesets" ALTER COLUMN "trustScore" SET DEFAULT 4.5`);
        await queryRunner.query(`ALTER TABLE "user_secrets" DROP COLUMN IF EXISTS "password_reset_otp_expires_at"`);
        await queryRunner.query(`ALTER TABLE "user_secrets" DROP COLUMN IF EXISTS "password_reset_otp"`);
        
        // Safely add column back
        await queryRunner.query(`
             DO $$
             BEGIN
                 IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_subscriptions' AND column_name = 'lemonsqueezySubscriptionId') THEN
                     ALTER TABLE "user_subscriptions" ADD "lemonsqueezySubscriptionId" character varying;
                     ALTER TABLE "user_subscriptions" ADD CONSTRAINT "UQ_231fb0a9f0973d67e3941ccdbbc" UNIQUE ("lemonsqueezySubscriptionId");
                 END IF;
             END
             $$;
         `);
        await queryRunner.query(`DROP TABLE IF EXISTS "api_keys"`);
    }

}
