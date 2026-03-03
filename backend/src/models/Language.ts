import mongoose, { Schema, Document } from "mongoose";

export interface ILanguage extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  name: string;
  proficiency?: string;
  capability?: string;
  createdAt: Date;
}

const LanguageSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  name: { type: String, required: true },
  proficiency: { type: String },
  capability: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ILanguage>("Language", LanguageSchema);
