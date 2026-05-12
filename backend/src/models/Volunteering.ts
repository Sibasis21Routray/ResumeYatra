import mongoose, { Schema, Document } from "mongoose";

export interface IVolunteering extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  organization: string;
  role: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  achievements?: string;
  url?: string;
  createdAt: Date;
}

const VolunteeringSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  organization: { type: String, required: true },
  role: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  location: { type: String },
  description: { type: String },
  achievements: { type: String },
  url: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IVolunteering>(
  "Volunteering",
  VolunteeringSchema
);
