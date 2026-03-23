import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1711180388000 implements MigrationInterface {
  name = 'InitialMigration1711180388000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type for user roles
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE "public"."users_role_enum" AS ENUM('super_admin', 'admin');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password_hash" character varying NOT NULL,
        "role" "public"."users_role_enum" NOT NULL DEFAULT 'admin',
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create data_plans table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "data_plans" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "data_limit" character varying NOT NULL,
        "price" numeric(12,2) NOT NULL,
        "validity" character varying NOT NULL DEFAULT '30 days',
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_data_plans" PRIMARY KEY ("id")
      )
    `);

    // Create vouchers table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "vouchers" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "code" character varying NOT NULL,
        "data_plan_id" uuid NOT NULL,
        "is_used" boolean NOT NULL DEFAULT false,
        "used_at" TIMESTAMP,
        "used_by_email" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_vouchers_code" UNIQUE ("code"),
        CONSTRAINT "PK_vouchers" PRIMARY KEY ("id")
      )
    `);

    // Create payments table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "payments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "reference" character varying NOT NULL,
        "data_plan_id" uuid NOT NULL,
        "voucher_id" uuid,
        "amount" numeric(12,2) NOT NULL,
        "customer_email" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_payments_reference" UNIQUE ("reference"),
        CONSTRAINT "REL_payments_voucher" UNIQUE ("voucher_id"),
        CONSTRAINT "PK_payments" PRIMARY KEY ("id")
      )
    `);

    // Create settings table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "settings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "logo_url" character varying,
        "background_url" character varying,
        "contact_email" character varying,
        "contact_phone" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_settings" PRIMARY KEY ("id")
      )
    `);

    // Enable uuid-ossp extension (required for uuid_generate_v4)
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "vouchers"
      ADD CONSTRAINT "FK_vouchers_data_plan"
      FOREIGN KEY ("data_plan_id") REFERENCES "data_plans"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "payments"
      ADD CONSTRAINT "FK_payments_data_plan"
      FOREIGN KEY ("data_plan_id") REFERENCES "data_plans"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "payments"
      ADD CONSTRAINT "FK_payments_voucher"
      FOREIGN KEY ("voucher_id") REFERENCES "vouchers"("id")
      ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_payments_voucher"`);
    await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT IF EXISTS "FK_payments_data_plan"`);
    await queryRunner.query(`ALTER TABLE "vouchers" DROP CONSTRAINT IF EXISTS "FK_vouchers_data_plan"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE IF EXISTS "payments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vouchers"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "data_plans"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "settings"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);

    // Drop enum type
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."users_role_enum"`);
  }
}
