import { Router } from "express";
import {
  createOrder,
  verifyPayment,
  toggleAutoPay,
  getAutoPayStatus,
  handleWebhook,
  getInvoiceByResume,
} from "../controllers/payment.controller";
import { getPricing } from "../controllers/pricing.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);
router.get("/pricing", getPricing);
router.post("/toggle-autopay", authMiddleware, toggleAutoPay);
router.get("/autopay-status", authMiddleware, getAutoPayStatus);
router.post("/webhook", handleWebhook);
router.get("/invoice/:resumeId", getInvoiceByResume);

export default router;