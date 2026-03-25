import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'logo_url', nullable: true })
  logoUrl: string;

  @Column({ name: 'background_url', nullable: true })
  backgroundUrl: string;

  @Column({ name: 'contact_email', nullable: true })
  contactEmail: string;

  @Column({ name: 'contact_phone', nullable: true })
  contactPhone: string;

  @Column({ name: 'site_name', nullable: true })
  siteName: string;

  @Column({ name: 'manual_payment_bank_name', nullable: true })
  manualPaymentBankName: string;

  @Column({ name: 'manual_payment_account_number', nullable: true })
  manualPaymentAccountNumber: string;

  @Column({ name: 'manual_payment_account_name', nullable: true })
  manualPaymentAccountName: string;

  @Column({ type: 'text', nullable: true })
  notifications: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
