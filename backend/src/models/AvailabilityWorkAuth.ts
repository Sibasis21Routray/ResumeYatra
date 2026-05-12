import mongoose, { Schema, Document } from "mongoose";

export interface IAvailabilityWorkAuth extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  availability: string;
  workAuthorization: string;
  visaStatus?: string;
  noticePeriod?: string;
  preferredLocation?: string;
  willingToRelocate: boolean;
  willingToTravel: boolean;
  createdAt: Date;
}

const AvailabilityWorkAuthSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  availability: { type: String, required: true },
  workAuthorization: { type: String, required: true },
  visaStatus: { type: String },
  noticePeriod: { type: String },
  preferredLocation: { type: String },
  willingToRelocate: { type: Boolean, default: true },
  willingToTravel: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAvailabilityWorkAuth>(
  "AvailabilityWorkAuth",
  AvailabilityWorkAuthSchema
);
