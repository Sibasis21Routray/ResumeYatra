import mongoose, { Schema, Document } from "mongoose";

export interface ISocialProfile extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  platform: string;
  url: string;
  username?: string;
  isPublic: boolean;
  createdAt: Date;
}

const SocialProfileSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  platform: { type: String, required: true },
  url: { type: String, required: true },
  username: { type: String },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ISocialProfile>(
  "SocialProfile",
  SocialProfileSchema
);
