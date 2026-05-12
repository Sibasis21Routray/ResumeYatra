import mongoose, { Schema, Document } from "mongoose";

export interface IPublication extends Document {
  _id: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  title: string;
  authors?: string;
  journal?: string;
  conference?: string;
  publicationDate?: string;
  doi?: string;
  url?: string;
  abstract?: string;
  createdAt: Date;
}

const PublicationSchema: Schema = new Schema({
  resumeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "ResumeVersion",
  },
  title: { type: String, required: true },
  authors: { type: String },
  journal: { type: String },
  conference: { type: String },
  publicationDate: { type: String },
  doi: { type: String },
  url: { type: String },
  abstract: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPublication>("Publication", PublicationSchema);
