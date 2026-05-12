import express from 'express';
import Pricing from '../models/Pricing';
import { razorpay } from './payment.controller';
import { uploadBuffer } from '../services/cloudinary.service';

// Helper to reliably get or create the singleton pricing object
export async function getPricingConfig() {
  // Always get the most recently updated one to ensure consistency
  let pricing = await Pricing.findOne().sort({ updatedAt: -1 });
  if (!pricing) {
    pricing = await Pricing.create({}); // Relies on schema defaults
  }
  return pricing;
}

export async function getPricing(req: express.Request, res: express.Response) {
  try {
    const pricing = await getPricingConfig();
    res.json(pricing);
  } catch (err: any) {
    console.error('Error fetching pricing:', err);
    res.status(500).json({ error: 'Failed to fetch pricing config' });
  }
}

export async function updatePricing(req: express.Request, res: express.Response) {
  try {
    const {
      freelancerPrice, freelancerDurationMonths, freelancerResumeLimit, freelancerAiDiscount,
      candidatePrice, candidateDurationMonths, candidateResumeLimit, candidateAiDiscount,
      guestDownload, guestAi,
      candidatePlanId, freelancerPlanId,
      autoPayCycleLimit
    } = req.body;

    let pricing = await getPricingConfig();

    // ── AUTO-SYNC TO RAZORPAY ──
    const freelancerAmount = typeof freelancerPrice === 'number' ? freelancerPrice : pricing.freelancerPrice;
    const freelancerMonths = typeof freelancerDurationMonths === 'number' ? freelancerDurationMonths : pricing.freelancerDurationMonths;

    // We update the plan if price/duration changed, OR if the plan ID is missing
    const shouldUpdateFreelancerPlan = 
      (typeof freelancerPrice === 'number' && freelancerPrice !== pricing.freelancerPrice) ||
      (typeof freelancerDurationMonths === 'number' && freelancerDurationMonths !== pricing.freelancerDurationMonths) ||
      (!pricing.freelancerPlanId);
    
    if (shouldUpdateFreelancerPlan) {
      try {
        console.log('[Pricing] Creating/Updating Razorpay Plan for Freelancer...');
        const newPlan = await razorpay.plans.create({
          period: 'daily',
          interval: freelancerMonths * 30,
          item: {
            name: `Freelancer Plan (v${Date.now()})`,
            amount: freelancerAmount,
            currency: 'INR',
            description: `Auto-generated Freelancer subscription`
          }
        });
        pricing.freelancerPlanId = newPlan.id;
        // Only update these if plan creation worked (to keep them in sync)
        pricing.freelancerPrice = freelancerAmount;
        pricing.freelancerDurationMonths = freelancerMonths;
        console.log(`[Pricing] NEW Freelancer Plan ID: ${newPlan.id}`);
      } catch (err: any) {
        console.error('[Pricing] Failed to create Razorpay Plan (Freelancer):', err.message);
        // If it fails, we DON'T update the price/duration in DB yet, 
        // ensuring the admin can try again and it will still be "changed"
      }
    }

    // 2. Check Candidate Plan
    const candidateAmount = typeof candidatePrice === 'number' ? candidatePrice : pricing.candidatePrice;
    const candidateMonths = typeof candidateDurationMonths === 'number' ? candidateDurationMonths : pricing.candidateDurationMonths;

    const shouldUpdateCandidatePlan = 
      (typeof candidatePrice === 'number' && candidatePrice !== pricing.candidatePrice) ||
      (typeof candidateDurationMonths === 'number' && candidateDurationMonths !== pricing.candidateDurationMonths) ||
      (!pricing.candidatePlanId);
    
    if (shouldUpdateCandidatePlan) {
      try {
        console.log('[Pricing] Creating/Updating Razorpay Plan for Candidate...');
        const newPlan = await razorpay.plans.create({
          period: 'daily',
          interval: candidateMonths * 30,
          item: {
            name: `Candidate Plan (v${Date.now()})`,
            amount: candidateAmount,
            currency: 'INR',
            description: `Auto-generated Candidate subscription`
          }
        });
        pricing.candidatePlanId = newPlan.id;
        // Only update these if plan creation worked
        pricing.candidatePrice = candidateAmount;
        pricing.candidateDurationMonths = candidateMonths;
        console.log(`[Pricing] NEW Candidate Plan ID: ${newPlan.id}`);
      } catch (err: any) {
        console.error('[Pricing] Failed to create Razorpay Plan (Candidate):', err.message);
      }
    }

    // Update other simple fields
    if (typeof freelancerPrice === 'number') pricing.freelancerPrice = freelancerPrice;
    if (typeof freelancerDurationMonths === 'number') pricing.freelancerDurationMonths = freelancerDurationMonths;
    if (typeof freelancerResumeLimit === 'number') pricing.freelancerResumeLimit = freelancerResumeLimit;
    if (typeof freelancerAiDiscount === 'number') pricing.freelancerAiDiscount = freelancerAiDiscount;

    if (typeof candidatePrice === 'number') pricing.candidatePrice = candidatePrice;
    if (typeof candidateDurationMonths === 'number') pricing.candidateDurationMonths = candidateDurationMonths;
    if (typeof candidateResumeLimit === 'number') pricing.candidateResumeLimit = candidateResumeLimit;
    if (typeof candidateAiDiscount === 'number') pricing.candidateAiDiscount = candidateAiDiscount;

    if (typeof guestDownload === 'number') pricing.guestDownload = guestDownload;
    if (typeof guestAi === 'number') pricing.guestAi = guestAi;

    if (typeof autoPayCycleLimit === 'number') pricing.autoPayCycleLimit = autoPayCycleLimit;

    await pricing.save();

    console.log(`[PricingController] Config updated successfully`);
    res.json({ message: 'Pricing updated successfully', pricing });
  } catch (err: any) {
    console.error('Error updating pricing:', err);
    res.status(500).json({ error: 'Failed to update pricing config' });
  }
}

export async function updateAdminSignature(req: express.Request, res: express.Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No signature file provided' });
    }

    const pricing = await getPricingConfig();
    const result = await uploadBuffer(
      req.file.buffer,
      `admin-signature-${Date.now()}`,
      'admin-assets',
      'image'
    );

    pricing.adminSignature = result.secure_url;
    await pricing.save();

    res.json({ message: 'Signature updated successfully', signatureUrl: result.secure_url });
  } catch (err: any) {
    console.error('Error uploading signature:', err);
    res.status(500).json({ error: 'Failed to upload signature' });
  }
}
