import mongoose, { Schema, Document } from "mongoose";

export interface ICareerObjective extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  objective: string;
  targetRole?: string;
  createdAt: Date;
}

const CareerObjectiveSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  objective: { type: String, required: true },
  targetRole: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICareerObjective>(
  "CareerObjective",
  CareerObjectiveSchema
);
