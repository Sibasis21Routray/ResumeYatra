import mongoose, { Schema, Document } from "mongoose";

export interface ILeadershipPosition extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  title: string;
  organization: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  achievements?: string;
  createdAt: Date;
}

const LeadershipPositionSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  title: { type: String, required: true },
  organization: { type: String, required: true },
  startDate: { type: String },
  endDate: { type: String },
  location: { type: String },
  description: { type: String },
  achievements: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ILeadershipPosition>(
  "LeadershipPosition",
  LeadershipPositionSchema
);
