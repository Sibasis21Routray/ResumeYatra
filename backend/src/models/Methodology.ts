import mongoose, { Schema, Document } from "mongoose";

export interface IMethodology extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  proficiencyLevel?: string;
  createdAt: Date;
}

const MethodologySchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  name: { type: String, required: true },
  description: { type: String },
  proficiencyLevel: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMethodology>("Methodology", MethodologySchema);
