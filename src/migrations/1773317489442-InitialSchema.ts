import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1773317489442 implements MigrationInterface {
    name = 'InitialSchema1773317489442'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create user_secrets table if it doesn't exist
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "user_secrets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "user_id" uuid NOT NULL,
                "github_access_token" character varying,
                "github_refresh_token" character varying,
                "github_token_expires_at" TIMESTAMP,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_c584286beb5ef2c823312479b4f" UNIQUE ("user_id"),
                CONSTRAINT "PK_215249fa12819f0ac12e21e51fe" PRIMARY KEY ("id")
            )
        `);

        // 2. Add foreign key for user_secrets -> users safely
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'FK_c584286beb5ef2c823312479b4f') THEN
                    ALTER TABLE "user_secrets" ADD CONSTRAINT "FK_c584286beb5ef2c823312479b4f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
                END IF;
            END
            $$;
        `);

        // 3. Migrate existing tokens (only if the old columns exist)
        await queryRunner.query(`
            DO $$
            BEGIN
                IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'github_access_token') THEN
                    INSERT INTO "user_secrets" ("user_id", "github_access_token", "github_refresh_token", "github_token_expires_at")
                    SELECT "id", "github_access_token", "github_refresh_token", "github_token_expires_at"
                    FROM "users"
                    ON CONFLICT ("user_id") DO NOTHING;
                END IF;
            END
            $$;
        `);

        // 4. Drop old GitHub token columns from users safely
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "github_access_token"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "github_refresh_token"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "github_token_expires_at"`);

        // 5. Create processed_webhooks table if it doesn't exist
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "processed_webhooks" (
                "eventId" character varying NOT NULL,
                "provider" character varying NOT NULL,
                "eventType" character varying NOT NULL,
                "processed_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_d4e033737a3efbfd01ec1ff9880" PRIMARY KEY ("eventId")
            )
        `);

        // 6. Create performance indices safely
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_rulesets_company_public" ON "rulesets" ("company_id", "isPublic")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_rulesets_company_created" ON "rulesets" ("company_id", "created_at")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_projects_company_created" ON "projects" ("company_id", "created_at")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_subscriptions_company_status" ON "user_subscriptions" ("company_id", "status")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse operations safely
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_subscriptions_company_status"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_projects_company_created"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_rulesets_company_created"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_rulesets_company_public"`);

        await queryRunner.query(`DROP TABLE IF EXISTS "processed_webhooks"`);
        
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "github_access_token" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "github_refresh_token" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "github_token_expires_at" TIMESTAMP`);

        await queryRunner.query(`ALTER TABLE "user_secrets" DROP CONSTRAINT IF EXISTS "FK_c584286beb5ef2c823312479b4f"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "user_secrets"`);
    }
}
