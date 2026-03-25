import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Voucher } from './voucher.entity';

@Entity('data_plans')
export class DataPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'data_limit' })
  dataLimit: string; // e.g., '1.5GB', '10GB'

  @Column('decimal', { precision: 12, scale: 2 })
  price: number;

  @Column({ default: '30 days' })
  validity: string;

  @Column({ type: 'int', default: 1 })
  devices: number;

  @Column({ type: 'int', default: 5 })
  upload: number;

  @Column({ type: 'int', default: 8 })
  download: number;

  @Column({ name: 'payment_link', nullable: true })
  paymentLink: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @OneToMany(() => Voucher, (voucher) => voucher.dataPlan)
  vouchers: Voucher[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
