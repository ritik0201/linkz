import mongoose, { Schema, models } from "mongoose";

const WorkLogSchema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "ProjectOrResearch",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
  },
  { timestamps: true },
);

export default models.WorkLog || mongoose.model("WorkLog", WorkLogSchema);
