import mongoose, { Schema, Document } from 'mongoose';
import { PRICING as DEFAULT_PRICING } from '../config/pricing.config';

export interface IPricing extends Document {
  freelancerPrice: number;
  freelancerDurationMonths: number;
  freelancerResumeLimit: number;
  freelancerAiDiscount: number;

  candidatePrice: number;
  candidateDurationMonths: number;
  candidateResumeLimit: number;
  candidateAiDiscount: number;

  guestDownload: number;
  guestAi: number;

  candidatePlanId?: string;
  freelancerPlanId?: string;
  autoPayCycleLimit: number;
  adminSignature?: string;
}

const PricingSchema: Schema = new Schema({
  freelancerPrice: { type: Number, required: true, default: DEFAULT_PRICING.FREELANCER.PRICE },
  freelancerDurationMonths: { type: Number, required: true, default: DEFAULT_PRICING.FREELANCER.DURATION_MONTHS },
  freelancerResumeLimit: { type: Number, required: true, default: DEFAULT_PRICING.FREELANCER.RESUME_LIMIT },
  freelancerAiDiscount: { type: Number, required: true, default: DEFAULT_PRICING.FREELANCER.AI_DISCOUNT_PERCENT },

  candidatePrice: { type: Number, required: true, default: DEFAULT_PRICING.CANDIDATE.PRICE },
  candidateDurationMonths: { type: Number, required: true, default: DEFAULT_PRICING.CANDIDATE.DURATION_MONTHS },
  candidateResumeLimit: { type: Number, required: true, default: DEFAULT_PRICING.CANDIDATE.RESUME_LIMIT },
  candidateAiDiscount: { type: Number, required: true, default: DEFAULT_PRICING.CANDIDATE.AI_DISCOUNT_PERCENT },

  guestDownload: { type: Number, required: true, default: DEFAULT_PRICING.GUEST.DOWNLOAD },
  guestAi: { type: Number, required: true, default: DEFAULT_PRICING.GUEST.AI },

  candidatePlanId: { type: String },
  freelancerPlanId: { type: String },
  autoPayCycleLimit: { type: Number, required: true, default: 5 },
  adminSignature: { type: String },
});

export default mongoose.model<IPricing>('Pricing', PricingSchema);
