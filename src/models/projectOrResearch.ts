import mongoose, { Schema, Document, Model } from "mongoose";

export interface IComment {
  userId: mongoose.Types.ObjectId;
  username?: string;
  text: string;
  createdAt: Date;
}

export interface IProjectOrResearch extends Document {
  userId: mongoose.Types.ObjectId;
  topic: string;
  coverImage: string;

  // ✅ ADDED (minimal fix)
  slug: string;

  teamMembers: string[];
  approvedMembers: string[];
  description?: string;
  category: "project" | "research";
  link?: string;
  likes: string[];
  interested: string[];
  comments: IComment[];
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

    // ✅ ADDED (minimal fix)
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    teamMembers: {
      type: [String],
      default: [],
    },
    approvedMembers: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: ["project", "research"],
      default: "project",
    },
    link: {
      type: String,
    },
    likes: {
      type: [String],
      default: [],
    },
    interested: {
      type: [String],
      default: [],
    },
    comments: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        username: { type: String },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

if (mongoose.models.ProjectOrResearch) {
  delete mongoose.models.ProjectOrResearch;
}

const ProjectOrResearch: Model<IProjectOrResearch> =
  mongoose.model<IProjectOrResearch>(
    "ProjectOrResearch",
    ProjectOrResearchSchema,
  );

export default ProjectOrResearch;
