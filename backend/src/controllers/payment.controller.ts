import Razorpay from "razorpay";
import crypto from "crypto";
import Resume from "../models/Resume";
import User from "../models/User";
import Invoice from "../models/Invoice";
import ResumeVersion from "../models/ResumeVersion";
import mongoose from "mongoose";
import { getPricingConfig } from "./pricing.controller";
import { createAndSaveInvoice } from "../services/invoice.service";

// Init Razorpay
export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY!,
  key_secret: process.env.RAZORPAY_SECRET!,
});

//  Helper: get guestId safely
function getGuestId(headers: any): string | null {
  const guestId = headers["x-guest-id"];
  if (Array.isArray(guestId)) return guestId[0] || null;
  return guestId || null;
}

// ==================== CREATE ORDER ====================

export async function createOrder(req, res) {
  try {
    const { type } = req.body;
    const userId = (req as any).userId || null;

    if (!type || !["download", "ai", "subscription_freelancer", "subscription_candidate"].includes(type)) {
      return res.status(400).json({ error: "Invalid payment type" });
    }

    const pricing = await getPricingConfig();
    let amount = 0;

    if (type === "subscription_freelancer") {
      amount = pricing.freelancerPrice;
    } else if (type === "subscription_candidate") {
      amount = pricing.candidatePrice;
    } else {
      if (userId) {
        const user = await User.findById(userId);
        if (type === "download") {
          amount = pricing.guestDownload;
        } else if (type === "ai") {
          let discount = 0;
          if (user?.subscriptionPlan === "freelancer") discount = pricing.freelancerAiDiscount;
          else if (user?.subscriptionPlan === "candidate") discount = pricing.candidateAiDiscount;

          const rawAmount = pricing.guestAi * (1 - discount / 100);
          amount = Math.round(rawAmount / 100) * 100;
        }
      } else {
        // Guests pay base rates
        amount = type === "download" ? pricing.guestDownload : pricing.guestAi;
      }
    }

    // Handle combined purchase (Subscription + Individual Item)
    if (type.startsWith("subscription_") && req.body.includeItem) {
      const itemType = req.body.includeItem;
      let itemAmount = 0;
      if (itemType === "download") {
        itemAmount = pricing.guestDownload;
      } else if (itemType === "ai") {
        const discount = type === "subscription_freelancer" ? pricing.freelancerAiDiscount : pricing.candidateAiDiscount;
        const rawItemAmount = pricing.guestAi * (1 - (discount || 0) / 100);
        itemAmount = Math.round(rawItemAmount / 100) * 100;
      }
      amount += itemAmount;
      console.log(`[createOrder] Combined purchase: ${type} + ${itemType}. New total amount: ${amount}`);
    }

    // Check if we should create a SUBSCRIPTION instead of an ORDER
    const isSubscriptionType = type === "subscription_freelancer" || type === "subscription_candidate";
    const useSubscription = isSubscriptionType && req.body.autoPay === true;

    if (useSubscription) {
      const planId = type === "subscription_freelancer" ? (pricing as any).freelancerPlanId : (pricing as any).candidatePlanId;

      if (!planId) {
        console.warn(`[createOrder] Subscription requested but no Plan ID found in pricing config. Falling back to one-time order.`);
      } else {
        // Calculate Addon if present
        let addons: any[] = [];
        if (req.body.includeItem) {
          const itemType = req.body.includeItem;
          let itemAmount = 0;
          if (itemType === "download") {
            itemAmount = pricing.guestDownload;
          } else if (itemType === "ai") {
            const discount = type === "subscription_freelancer" ? pricing.freelancerAiDiscount : pricing.candidateAiDiscount;
            const rawItemAmount = pricing.guestAi * (1 - (discount || 0) / 100);
            itemAmount = Math.round(rawItemAmount / 100) * 100;
          }

          if (itemAmount > 0) {
            addons.push({
              item: {
                name: `${itemType === 'ai' ? 'AI Enhancement' : 'Download Credit'} (One-time)`,
                amount: Math.round(itemAmount),
                currency: "INR"
              }
            });
          }
        }

        const subscription = await razorpay.subscriptions.create({
          plan_id: planId,
          total_count: pricing.autoPayCycleLimit || 12,
          quantity: 1,
          customer_notify: 1,
          addons: addons.length > 0 ? addons : undefined,
        });

        console.log(`[createOrder] Created SUBSCRIPTION: ${subscription.id} for type: ${type}${addons.length > 0 ? ' with addon' : ''}`);
        return res.json({ ...subscription, isSubscription: true });
      }
    }

    // Razorpay requires integer (Paise)
    amount = Math.round(amount);

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    console.log(`[createOrder] Type: ${type}, Amount: ${amount}, User: ${userId || 'Guest'}`);
    return res.json({ ...order, isSubscription: false });
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
}


// ==================== VERIFY PAYMENT ====================

export async function verifyPayment(req, res) {
  try {
    const {
      razorpay_order_id,
      razorpay_subscription_id,
      razorpay_payment_id,
      razorpay_signature,
      resumeId,
      type: rawType,
      includeItem: rawIncludeItem,
    } = req.body;

    const type = typeof rawType === 'string' ? rawType.trim() : rawType;
    const includeItem = typeof rawIncludeItem === 'string' ? rawIncludeItem.trim() : rawIncludeItem;

    const userId = (req as any).userId || null;
    const guestId = getGuestId(req.headers);

    console.log(`[verifyPayment] START - resumeId: ${resumeId}, userId: ${userId}, guestId: ${guestId}, type: ${type}, includeItem: ${includeItem}`);

    //  Basic validation
    if (!type || (!resumeId && !type.startsWith("subscription"))) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!userId && !guestId && !type.startsWith("subscription")) {
      console.warn(`[verifyPayment] DENIED: No userId or guestId provided`);
      return res.status(401).json({ error: "Not authenticated" });
    }

    //  Verify Razorpay signature
    const isSubscription = req.body.razorpay_subscription_id !== undefined;
    const paymentId = razorpay_payment_id;
    const signature = razorpay_signature;

    let expectedSignature = "";
    if (isSubscription) {
      const subscriptionId = req.body.razorpay_subscription_id;
      const body = `${paymentId}|${subscriptionId}`;
      expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET!)
        .update(body)
        .digest("hex");
    } else {
      const orderId = razorpay_order_id;
      const body = `${orderId}|${paymentId}`;
      expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET!)
        .update(body)
        .digest("hex");
    }

    console.log(`[verifyPayment] Signature Match: ${expectedSignature === signature} (${isSubscription ? 'Subscription' : 'Order'})`);

    if (expectedSignature !== signature) {
      return res.status(400).json({ error: "Invalid payment signature" });
    }

    // --- HANDLE SUBSCRIPTION ---
    if (type.startsWith("subscription")) {
      if (!userId) return res.status(400).json({ error: "User ID required for subscription" });

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: "User not found" });

      const pricing = await getPricingConfig();

      let months = 3;
      if (type === "subscription_freelancer") {
        user.subscriptionPlan = "freelancer";
        months = pricing.freelancerDurationMonths;
      } else if (type === "subscription_candidate") {
        user.subscriptionPlan = "candidate";
        months = pricing.candidateDurationMonths;
      }

      // Extend subscription by X months from TODAY or from current expiry if valid
      const now = new Date();
      const baseDate = (user.subscriptionExpiry && user.subscriptionExpiry > now)
        ? user.subscriptionExpiry
        : now;

      const newExpiry = new Date(baseDate);
      newExpiry.setDate(newExpiry.getDate() + (months * 30));

      user.subscriptionExpiry = newExpiry;

      // Optionally enable auto-pay if requested during payment
      if (req.body.autoPay !== undefined) {
        user.autoPay = req.body.autoPay;
      }

      if (type.startsWith("subscription_") && razorpay_subscription_id) {
        user.razorpaySubscriptionId = razorpay_subscription_id;
      }

      await user.save();

      console.log(`[verifyPayment] UPDATED Subscription for user ${user._id} to ${newExpiry} with plan ${user.subscriptionPlan}, autoPay: ${user.autoPay}`);

      // Calculate total amount for combined purchase (Sub + Item)
      let totalAmount = (pricing[user.subscriptionPlan === 'freelancer' ? 'freelancerPrice' : 'candidatePrice'] || 0);

      // Handle combined item if present
      if (req.body.includeItem && resumeId) {
        const itemType = req.body.includeItem;
        const resume = await Resume.findById(resumeId);
        if (resume) {
          if (itemType === "download") {
            resume.isDownloadPaid = true;
          } else if (itemType === "ai") {
            resume.isAiPaid = true;
            resume.isDownloadPaid = true;
          }
          // Important: also link the resume to the new user
          resume.ownerId = user._id as any;
          await resume.save();
          console.log(`[verifyPayment] Also marked resume ${resumeId} as paid for ${itemType} and linked to user ${user._id} (combined purchase)`);

          // Add item price to total amount for invoice
          let itemPrice = itemType === "download" ? pricing.guestDownload : pricing.guestAi;
          const discount = user.subscriptionPlan === 'freelancer' ? pricing.freelancerAiDiscount : pricing.candidateAiDiscount;
          const rawItemPrice = itemPrice * (1 - (discount || 0) / 100);
          itemPrice = Math.round(rawItemPrice / 100) * 100;
          totalAmount += itemPrice;
        }
      }

      // Generate Invoice for subscription
      try {
        await createAndSaveInvoice({
          userId: user._id,
          resumeId: resumeId || undefined,
          type: includeItem ? `${type}:${includeItem}` : type,
          amount: Math.round(totalAmount) / 100,
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id || razorpay_subscription_id,
          userDetails: {
            name: user.name || "User",
            email: user.email,
            phone: user.mobile
          }
        });
      } catch (invErr) {
        console.error("Invoice generation failed for subscription:", invErr);
      }

      return res.json({ success: true, message: "Subscription activated", expiry: newExpiry, plan: user.subscriptionPlan, autoPay: user.autoPay });
    }

    // --- HANDLE RESUME PAYMENTS ---
    // 1. Fetch resume by ID ONLY (first)
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      console.warn(`[verifyPayment] Resume not found: ${resumeId}`);
      return res.status(404).json({ error: "Resume not found" });
    }

    // 2. Ownership & Branding Check
    const isOwner = (userId && resume.ownerId && resume.ownerId.toString() === userId.toString());
    const isGuestOwner = (guestId && resume.guestId === guestId);

    if (!isOwner && !isGuestOwner) {
      // If resume is unowned (guest) and user is logged in, link them now!
      if (!resume.ownerId && userId) {
        console.log(`[verifyPayment] Linking guest resume ${resumeId} to user ${userId}`);
        resume.ownerId = new mongoose.Types.ObjectId(userId) as any;
      } else {
        console.warn(`[verifyPayment] ACCESS DENIED: Identity mismatch for resume ${resumeId}`);
        return res.status(401).json({ error: "Not authenticated/Access denied" });
      }
    }

    // 3. Mark payment
    console.log(`[verifyPayment] Marking resume ${resume._id} as paid for type: ${type}`);
    if (type === "download") {
      resume.isDownloadPaid = true;
    }

    if (type === "ai") {
      resume.isAiPaid = true;
      resume.isDownloadPaid = true; // AI optimization includes 1 download credit
    }

    await resume.save();

    // Generate Invoice for resume payment
    try {
      let userName = "Guest";
      let userEmail = "guest@resumeyatra.com";
      let userPhone = "";

      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          userName = user.name || userName;
          userEmail = user.email || userEmail;
          userPhone = user.mobile || "";
        }
      } else {
        // For guest, try to get from resume data
        const latestVersion = await ResumeVersion.findOne({ resumeId: resume._id }).sort({ createdAt: -1 });
        if (latestVersion && latestVersion.data) {
          userName = latestVersion.data.name || latestVersion.data.personal?.name || resume.candidateName || userName;
          userEmail = latestVersion.data.email || latestVersion.data.personal?.email || userEmail;
          userPhone = latestVersion.data.phone || latestVersion.data.personal?.phone || "";
        } else {
          userName = resume.candidateName || userName;
        }
      }

      const pricing = await getPricingConfig();
      let actualAmount = type === 'ai' ? pricing.guestAi : pricing.guestDownload;

      if (type === 'ai' && userId) {
        const user = await User.findById(userId);
        let discount = 0;
        if (user?.subscriptionPlan === "freelancer") discount = pricing.freelancerAiDiscount;
        else if (user?.subscriptionPlan === "candidate") discount = pricing.candidateAiDiscount;
        const rawAmount = actualAmount * (1 - discount / 100);
        actualAmount = Math.round(rawAmount / 100) * 100;
      }

      await createAndSaveInvoice({
        userId: userId || null,
        resumeId: resume._id,
        type: type,
        amount: Math.round(actualAmount) / 100,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        userDetails: {
          name: userName,
          email: userEmail,
          phone: userPhone
        }
      });
    } catch (invErr) {
      console.error("Invoice generation failed for resume:", invErr);
    }

    return res.json({
      success: true,
      message: "Payment verified and access granted",
    });
  } catch (err) {
    console.error("Verify payment error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
}

// ==================== AUTO-PAY TOGGLE ====================

export async function toggleAutoPay(req, res) {
  try {
    const userId = (req as any).userId;
    const { autoPay } = req.body;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.autoPay = autoPay;

    // If turning OFF autoPay, try to cancel active Razorpay subscription
    if (autoPay === false && user.razorpaySubscriptionId) {
      try {
        console.log(`[toggleAutoPay] Cancelling Razorpay subscription: ${user.razorpaySubscriptionId}`);
        await razorpay.subscriptions.cancel(user.razorpaySubscriptionId);
        // Clear it so we don't try again or misinterpret state
        user.razorpaySubscriptionId = undefined;
      } catch (err: any) {
        console.error(`[toggleAutoPay] Failed to cancel Razorpay subscription: ${err.message}`);
      }
    }

    await user.save();
    console.log(`[toggleAutoPay] Updated user ${userId} to autoPay: ${autoPay}`);
    res.json({ message: "Auto-pay updated successfully", autoPay: user.autoPay });
  } catch (err) {
    console.error("Toggle auto-pay error:", err);
    res.status(500).json({ error: "Failed to toggle auto-pay" });
  }
}

// ==================== WEBHOOK HANDLER ====================

export async function handleWebhook(req, res) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "razorpay_webhook_secret";

  const signature = req.headers["x-razorpay-signature"];
  const body = JSON.stringify(req.body);

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    console.error("[Webhook] Invalid signature");
    return res.status(400).send("Invalid signature");
  }

  const event = req.body.event;
  console.log(`[Webhook] Received event: ${event}`);

  if (event === "subscription.charged") {
    const subscription = req.body.payload.subscription.entity;
    const payment = req.body.payload.payment.entity;

    const subscriptionId = subscription.id;
    const user = await User.findOne({ razorpaySubscriptionId: subscriptionId });

    if (user) {
      const pricing = await getPricingConfig();
      const durationMonths = user.subscriptionPlan === "freelancer"
        ? pricing.freelancerDurationMonths
        : pricing.candidateDurationMonths;

      const currentExpiry = user.subscriptionExpiry || new Date();
      const newExpiry = new Date(currentExpiry);
      newExpiry.setDate(newExpiry.getDate() + (durationMonths * 30));

      user.subscriptionExpiry = newExpiry;
      await user.save();

      console.log(`[Webhook] Renewed user ${user._id} via subscription ${subscriptionId}. New expiry: ${newExpiry}`);

      // Generate Invoice for recurring payment
      try {
        await createAndSaveInvoice({
          userId: user._id,
          type: user.subscriptionPlan === 'freelancer' ? 'subscription_freelancer' : 'subscription_candidate',
          amount: (payment.amount / 100), // Razorpay webhook amount is in paise
          paymentId: payment.id,
          orderId: subscriptionId,
          userDetails: {
            name: user.name || "User",
            email: user.email,
            phone: user.mobile
          }
        });
      } catch (invErr) {
        console.error("[Webhook] Invoice generation failed:", invErr);
      }
    } else {
      console.warn(`[Webhook] No user found for subscription: ${subscriptionId}`);
    }
  }

  res.json({ status: "ok" });
}

export async function getAutoPayStatus(req, res) {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json({ autoPay: user.autoPay });
  } catch (err) {
    console.error("Get auto-pay status error:", err);
    res.status(500).json({ error: "Failed to get auto-pay status" });
  }
}
export async function getInvoiceByResume(req, res) {
  try {
    const { resumeId } = req.params;
    const userId = (req as any).userId;
    const guestId = getGuestId(req.headers);

    if (!resumeId) return res.status(400).json({ error: "Resume ID required" });

    // Find the matching invoice for this resume, filtered by type if provided
    const typeFilter = req.query.type as string | undefined;
    const query: any = { resumeId };
    if (typeFilter) {
      // 'ai' invoices may have type 'ai' or start with 'subscription_...:ai'
      // 'download' invoices have type 'download'
      query.type = typeFilter;
    }
    const invoice = await Invoice.findOne(query).sort({ createdAt: -1 });
    if (!invoice) return res.status(404).json({ error: "Invoice not found" });

    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const isOwner = (userId && resume.ownerId && resume.ownerId.toString() === userId.toString());
    const isGuestOwner = (guestId && resume.guestId === guestId);

    if (!isOwner && !isGuestOwner) {
      return res.status(401).json({ error: "Unauthorized access to invoice" });
    }

    return res.json({ success: true, pdfUrl: invoice.pdfUrl, invoiceNumber: invoice.invoiceNumber });
  } catch (err) {
    console.error("Get invoice error:", err);
    res.status(500).json({ error: "Failed to retrieve invoice" });
  }
}
