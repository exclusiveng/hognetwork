import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { PurchaseController } from '../controllers/purchase.controller';

const router = Router();

// Site Brand & Plans for Frontend
router.get('/settings', AdminController.getSettings);
router.get('/plans', AdminController.getPlans);

// Payment Logging & Voucher Exchange
router.post('/log-payment', PurchaseController.logPayment);

export default router;
