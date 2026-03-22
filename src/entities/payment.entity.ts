import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { DataPlan } from './dataplan.entity';
import { Voucher } from './voucher.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  reference: string;

  @Column({ name: 'data_plan_id' })
  dataPlanId: string;

  @ManyToOne(() => DataPlan)
  @JoinColumn({ name: 'data_plan_id' })
  dataPlan: DataPlan;

  @Column({ name: 'voucher_id', nullable: true })
  voucherId: string;

  @OneToOne(() => Voucher)
  @JoinColumn({ name: 'voucher_id' })
  voucher: Voucher;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ name: 'customer_email' })
  customerEmail: string;

  @Column({ name: 'status', default: 'pending' }) // e.g., 'pending', 'completed', 'failed'
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
