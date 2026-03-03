import mongoose, { Schema, Document } from "mongoose";

export interface ITrainingProgram extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  name: string;
  organization: string;
  completionDate?: string;
  duration?: string;
  description?: string;
  certificateUrl?: string;
  createdAt: Date;
}

const TrainingProgramSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  name: { type: String, required: true },
  organization: { type: String, required: true },
  completionDate: { type: String },
  duration: { type: String },
  description: { type: String },
  certificateUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITrainingProgram>(
  "TrainingProgram",
  TrainingProgramSchema
);
