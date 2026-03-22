import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { User, UserRole } from '../entities/user.entity';
import { DataPlan } from '../entities/dataplan.entity';
import { Voucher } from '../entities/voucher.entity';
import { Setting } from '../entities/setting.entity';
import bcrypt from 'bcryptjs';
import { signToken } from '../services/auth.service';
import { AppError } from '../utils/errors';

export class AdminController {
  private static userRepo = AppDataSource.getRepository(User);
  private static planRepo = AppDataSource.getRepository(DataPlan);
  private static voucherRepo = AppDataSource.getRepository(Voucher);
  private static settingRepo = AppDataSource.getRepository(Setting);

  // --- Auth & Onboarding ---
  static async getRegistrationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const adminExists = await AdminController.userRepo.count() > 0;
      res.json({ registrationOpen: !adminExists });
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const adminExists = await AdminController.userRepo.count() > 0;
      if (adminExists) {
        throw new AppError('Registration is closed. Admin already exists.', 403);
      }

      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = AdminController.userRepo.create({
        name,
        email,
        passwordHash: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      });

      await AdminController.userRepo.save(user);

      const token = signToken(user);

      res.status(201).json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Auth ---
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await AdminController.userRepo.findOne({
        where: { email },
        select: ['id', 'name', 'email', 'passwordHash', 'role'],
      });

      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        throw new AppError('Invalid email or password', 401);
      }

      const token = signToken(user);

      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      next(error);
    }
  }

  // --- Data Plans ---
  static async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await AdminController.planRepo.find({ order: { price: 'ASC' } });
      res.json(plans);
    } catch (error) {
      next(error);
    }
  }

  static async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = AdminController.planRepo.create(req.body);
      await AdminController.planRepo.save(plan);
      res.status(201).json(plan);
    } catch (error) {
      next(error);
    }
  }

  static async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AdminController.planRepo.update(id, req.body);
      const updated = await AdminController.planRepo.findOneBy({ id });
      res.json(updated);
    } catch (error) {
      next(error);
    }
  }

  static async deletePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await AdminController.planRepo.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // --- Vouchers ---
  static async addVouchers(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataPlanId, codes } = req.body; // codes is an array of strings
      const vouchers = codes.map((code: string) =>
        AdminController.voucherRepo.create({
          code,
          dataPlanId,
        })
      );
      await AdminController.voucherRepo.save(vouchers);
      res.status(201).json({ message: `${vouchers.length} vouchers added.` });
    } catch (error) {
      next(error);
    }
  }

  static async getVouchers(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataPlanId } = req.query;
      const query: any = { order: { createdAt: 'DESC' }, relations: ['dataPlan'] };
      if (dataPlanId) query.where = { dataPlanId };

      const vouchers = await AdminController.voucherRepo.find(query);
      res.json(vouchers);
    } catch (error) {
      next(error);
    }
  }

  // --- Settings ---
  static async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      let settings = await AdminController.settingRepo.findOne({ where: {} });
      if (!settings) {
        settings = AdminController.settingRepo.create({
          logoUrl: '',
          backgroundUrl: '',
        });
        await AdminController.settingRepo.save(settings);
      }
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }

  static async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      let settings = await AdminController.settingRepo.findOne({ where: {} });
      if (!settings) {
        settings = AdminController.settingRepo.create();
      }

      const updateData = { ...req.body };
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        if (files.logo && files.logo[0]) {
          updateData.logoUrl = files.logo[0].path;
        }
        if (files.background && files.background[0]) {
          updateData.backgroundUrl = files.background[0].path;
        }
      }

      Object.assign(settings, updateData);
      await AdminController.settingRepo.save(settings);
      res.json(settings);
    } catch (error) {
      next(error);
    }
  }
}
