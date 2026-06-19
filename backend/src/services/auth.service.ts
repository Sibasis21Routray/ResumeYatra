import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config/api'
import User from '../models/User'
import Resume from '../models/Resume'

export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any
    return { userId: decoded.userId }
  } catch {
    return null
  }
}

import crypto from 'crypto'

export async function register(
  email: string,
  name: string,
  password: string,
  userData: {
    mobile: string,
    state: string,
    city: string,
    pin: string
  },
  paymentData: {
    razorpay_order_id?: string,
    razorpay_subscription_id?: string,
    razorpay_payment_id?: string,
    razorpay_signature?: string,
    type?: string,
    autoPay?: boolean,
    includeItem?: string,
    resumeId?: string
  }
) {
  // 1. Check if user already exists FIRST (before payment verification)
  // This prevents charging a user who already has an account.
  const existingUser = await User.findOne({ email })
  if (existingUser) throw new Error('User already exists')

  // 2. Verify Payment
  const {
    razorpay_order_id,
    razorpay_subscription_id,
    razorpay_payment_id,
    razorpay_signature,
    type,
    autoPay,
    includeItem,
    resumeId
  } = paymentData;

  const { mobile, state, city, pin } = userData;

  // For subscriptions, razorpay_order_id is missing, but razorpay_subscription_id is present
  const orderOrSubId = razorpay_order_id || razorpay_subscription_id;

  if (!orderOrSubId || !razorpay_payment_id || !razorpay_signature) {
    throw new Error('Payment verification details missing');
  }

  // Signature body is different for orders vs subscriptions
  const body = razorpay_order_id
    ? `${razorpay_order_id}|${razorpay_payment_id}`
    : `${razorpay_payment_id}|${razorpay_subscription_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET!)
    .update(body)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new Error('Invalid payment signature');
  }

  const hashedPassword = await hashPassword(password)

  // 3. Create user with correct subscription limits based on type
  let subscriptionPlan = 'candidate';
  let durationMonths = 3;

  if (type === 'subscription_freelancer') {
    subscriptionPlan = 'freelancer';
    const { getPricingConfig } = require('../controllers/pricing.controller');
    const pricing = await getPricingConfig();
    durationMonths = pricing.freelancerDurationMonths;
  } else if (type === 'subscription_candidate') {
    subscriptionPlan = 'candidate';
    const { getPricingConfig } = require('../controllers/pricing.controller');
    const pricing = await getPricingConfig();
    durationMonths = pricing.candidateDurationMonths;
  }

  const subscriptionExpiry = new Date();
  subscriptionExpiry.setDate(subscriptionExpiry.getDate() + (durationMonths * 30));

  console.log(`[AuthService] Registering user ${email} with subId: ${razorpay_subscription_id}`);

  const user = new User({
    email,
    name,
    password: hashedPassword,

    mobile,
    state,
    city,
    pin,

    subscriptionExpiry,
    subscriptionPlan,
    autoPay: autoPay || false,
    razorpaySubscriptionId: razorpay_subscription_id
  })

  console.log(`[AuthService] Saving user object:`, {
    id: user._id,
    autoPay: user.autoPay,
    subId: user.razorpaySubscriptionId
  });

  await user.save()

  // 4. Handle combined item if present
  if (includeItem && resumeId) {
    const resume = await Resume.findById(resumeId);
    if (resume) {
      if (includeItem === "download") {
        resume.isDownloadPaid = true;
      } else if (includeItem === "ai") {
        resume.isAiPaid = true;
        resume.isDownloadPaid = true;
      }
      resume.ownerId = user._id; // Link to the newly created user
      await resume.save();
      console.log(`[AuthService] Marked resume ${resumeId} as paid for ${includeItem} and linked to user ${user._id}`);

      // Handle invoice generation if possible
      try {
        const { getPricingConfig } = require('../controllers/pricing.controller');
        const { createAndSaveInvoice } = require('./invoice.service');
        const pricing = await getPricingConfig();

        let totalAmount = (pricing[subscriptionPlan === 'freelancer' ? 'freelancerPrice' : 'candidatePrice'] || 0);
        let itemPrice = includeItem === "download" ? pricing.guestDownload : pricing.guestAi;
        const discount = subscriptionPlan === 'freelancer' ? pricing.freelancerAiDiscount : pricing.candidateAiDiscount;
        itemPrice = itemPrice * (1 - (discount || 0) / 100);
        totalAmount += itemPrice;

        await createAndSaveInvoice({
          userId: user._id,
          resumeId: resumeId,
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
        console.error("[AuthService] Invoice generation failed:", invErr);
      }
    }
  } else if (orderOrSubId) {
    // Normal registration invoice (no combined item)
    try {
      const { createAndSaveInvoice } = require('./invoice.service');
      const { getPricingConfig } = require('../controllers/pricing.controller');
      const pricing = await getPricingConfig();
      const amount = (pricing[subscriptionPlan === 'freelancer' ? 'freelancerPrice' : 'candidatePrice'] || 0) / 100;

      await createAndSaveInvoice({
        userId: user._id,
        type: type,
        amount: amount,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id || razorpay_subscription_id,
        userDetails: {
          name: user.name || "User",
          email: user.email,
          phone: user.mobile
        }
      });
    } catch (invErr) {
      console.error("[AuthService] Signup invoice generation failed:", invErr);
    }
  }

  const token = generateToken(user._id.toString())
  return { user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role, subscriptionExpiry: user.subscriptionExpiry, subscriptionPlan: user.subscriptionPlan, autoPay: user.autoPay, razorpaySubscriptionId: user.razorpaySubscriptionId }, token }
}

export async function login(email: string, password: string) {
  const user = await User.findOne({ email })
  if (!user) throw new Error('Invalid credentials')

  const passwordMatch = await comparePassword(password, user.password)
  if (!passwordMatch) throw new Error('Invalid credentials')

  const token = generateToken(user._id.toString())
  return { user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role, subscriptionPlan: user.subscriptionPlan, autoPay: user.autoPay, razorpaySubscriptionId: user.razorpaySubscriptionId }, token }
}

export async function getUserById(userId: string) {
  return User.findById(userId)
}

