import mongoose, { Schema, Document } from "mongoose";

export interface IClientProject extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  name: string;
  client: string;
  role: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  technologies?: string;
  url?: string;
  createdAt: Date;
}

const ClientProjectSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  name: { type: String, required: true },
  client: { type: String },
  role: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
  technologies: { type: String },
  url: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IClientProject>(
  "ClientProject",
  ClientProjectSchema
);
