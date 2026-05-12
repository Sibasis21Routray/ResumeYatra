import mongoose, { Schema, Document } from "mongoose";

export interface IReference extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  name: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  relationship?: string;
  createdAt: Date;
}

const ReferenceSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  name: { type: String, required: true },
  title: { type: String },
  company: { type: String },
  email: { type: String },
  phone: { type: String },
  relationship: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IReference>("Reference", ReferenceSchema);
