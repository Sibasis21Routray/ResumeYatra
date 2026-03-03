import mongoose, { Schema, Document } from "mongoose";

export interface IToolTechnology extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  name: string;
  category: string;
  proficiencyLevel?: string;
  yearsOfExperience?: number;
  lastUsed?: string;
  createdAt: Date;
}

const ToolTechnologySchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  name: { type: String, required: true },
  category: { type: String, required: true },
  proficiencyLevel: { type: String },
  yearsOfExperience: { type: Number },
  lastUsed: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IToolTechnology>(
  "ToolTechnology",
  ToolTechnologySchema
);
