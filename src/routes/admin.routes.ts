import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { protect, roleMiddleware } from '../middleware/auth.middleware';
import { UserRole } from '../entities/user.entity';
import { upload } from '../config/cloudinary';

const router = Router();

// Public / Login / Registration (First Boot)
router.get('/registration-status', AdminController.getRegistrationStatus);
router.post('/register', AdminController.register);
router.post('/login', AdminController.login);

// Protected Admin Routes
router.use(protect);
router.use(roleMiddleware([UserRole.ADMIN, UserRole.SUPER_ADMIN]));

// Data Plans
router.get('/plans', AdminController.getPlans);
router.post('/plans', AdminController.createPlan);
router.put('/plans/:id', AdminController.updatePlan);
router.delete('/plans/:id', AdminController.deletePlan);

// Vouchers
router.get('/vouchers', AdminController.getVouchers);
router.post('/vouchers/bulk', AdminController.addVouchers);

// Payments 
router.get('/payments', AdminController.getPayments);
router.post('/payments/:id/approve', AdminController.approvePayment);
router.post('/payments/:id/reject', AdminController.rejectPayment);

// Settings
router.get('/settings', AdminController.getSettings);
router.put('/settings', upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'background', maxCount: 1 }
]), AdminController.updateSettings);

export default router;
