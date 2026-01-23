import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProjectOrResearch extends Document {
  userId: string;
  topic: string;
  coverImage: string;
  teamMembers: string[];
  description?: string;
  category: "project" | "research";
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectOrResearchSchema: Schema<IProjectOrResearch> = new Schema(
  {
    userId: {
      type: String,
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
  },
  { timestamps: true }
);

const ProjectOrResearch: Model<IProjectOrResearch> =
  mongoose.models.ProjectOrResearch || mongoose.model<IProjectOrResearch>("ProjectOrResearch", ProjectOrResearchSchema);

export default ProjectOrResearch;