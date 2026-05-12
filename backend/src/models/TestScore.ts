import mongoose, { Schema, Document } from "mongoose";

export interface ITestScore extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  testName: string;
  score: string;
  maxScore?: string;
  date?: string;
  validityDate?: string;
  createdAt: Date;
}

const TestScoreSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  testName: { type: String, required: true },
  score: { type: String, required: true },
  maxScore: { type: String },
  date: { type: String },
  validityDate: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITestScore>("TestScore", TestScoreSchema);
