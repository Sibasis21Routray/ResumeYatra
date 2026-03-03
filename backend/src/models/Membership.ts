import mongoose, { Schema, Document } from "mongoose";

export interface IMembership extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  organization: string;
  membershipType?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  url?: string;
  createdAt: Date;
}

const MembershipSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  organization: { type: String, required: true },
  membershipType: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
  url: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMembership>("Membership", MembershipSchema);
