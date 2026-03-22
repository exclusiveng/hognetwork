import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DataPlan } from './dataplan.entity';

@Entity('vouchers')
export class Voucher {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({ name: 'data_plan_id' })
  dataPlanId: string;

  @ManyToOne(() => DataPlan, (plan) => plan.vouchers)
  @JoinColumn({ name: 'data_plan_id' })
  dataPlan: DataPlan;

  @Column({ name: 'is_used', default: false })
  isUsed: boolean;

  @Column({ name: 'used_at', nullable: true, type: 'timestamp' })
  usedAt: Date;

  @Column({ name: 'used_by_email', nullable: true })
  usedByEmail: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
