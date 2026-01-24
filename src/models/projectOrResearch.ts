import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProjectOrResearch extends Document {
  userId: mongoose.Types.ObjectId;
  topic: string;
  coverImage: string;
  teamMembers: string[];
  description?: string;
  category: "project" | "research";
  link?: string;
  likes: string[];
  interested: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectOrResearchSchema: Schema<IProjectOrResearch> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
    },
    coverImage: {
      type: String,
      required: [true, "Cover image is required"],
    },
    teamMembers: {
      type: [String],
      default: [],
    },
    description: { type: String },
    category: { type: String, enum: ["project", "research"], default: "project" },
    link: { type: String },
    likes: {
      type: [String],
      default: [],
    },
    interested: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

if (mongoose.models.ProjectOrResearch) {
  delete mongoose.models.ProjectOrResearch;
}

const ProjectOrResearch: Model<IProjectOrResearch> = mongoose.model<IProjectOrResearch>("ProjectOrResearch", ProjectOrResearchSchema);

export default ProjectOrResearch;