import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { Payment } from '../entities/payment.entity';
import { Voucher } from '../entities/voucher.entity';
import { DataPlan } from '../entities/dataplan.entity';
import { AppError } from '../utils/errors';

export class PurchaseController {
  private static paymentRepo = AppDataSource.getRepository(Payment);
  private static voucherRepo = AppDataSource.getRepository(Voucher);
  private static planRepo = AppDataSource.getRepository(DataPlan);

  static async logPayment(req: Request, res: Response, next: NextFunction) {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { paymentReference, email, dataPlanId, amount, isManual } = req.body;

      // 1. Verify plan exists
      const plan = await queryRunner.manager.findOne(DataPlan, { where: { id: dataPlanId } });
      if (!plan) throw new AppError('Invalid data plan', 400);

      // 2. Log Payment
      const payment = queryRunner.manager.create(Payment, {
        reference: paymentReference,
        customerEmail: email,
        dataPlanId,
        amount,
        status: isManual ? 'pending' : 'completed', // Frontend handles payment, so we assume completion if not manual.
      });

      if (isManual) {
        await queryRunner.manager.save(payment);
        await queryRunner.commitTransaction();
        return res.status(200).json({
          message: 'Manual payment logged successfully. Pending admin approval.',
          paymentReference,
        });
      }

      // 3. Find an UNUSED voucher for this plan (only for auto payments)
      const voucher = await queryRunner.manager.findOne(Voucher, {
        where: { dataPlanId, isUsed: false },
        lock: { mode: 'pessimistic_write' }, // Prevent race condition
      });

      if (!voucher) {
        throw new AppError('No available vouchers for this plan. Please contact admin.', 400);
      }

      // 4. Mark voucher as used
      voucher.isUsed = true;
      voucher.usedAt = new Date();
      voucher.usedByEmail = email;
      await queryRunner.manager.save(voucher);

      // 5. Link voucher to payment
      payment.voucherId = voucher.id;
      await queryRunner.manager.save(payment);

      await queryRunner.commitTransaction();

      res.status(200).json({
        message: 'Payment logged and voucher delivered.',
        voucherCode: voucher.code,
        paymentReference,
        plan: plan.name,
      });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      next(error);
    } finally {
      await queryRunner.release();
    }
  }
}
