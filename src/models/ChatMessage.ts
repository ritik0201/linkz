import mongoose, { Schema, models } from "mongoose";

const ChatMessageSchema = new Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    senderName: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const ChatMessage =
  models.ChatMessage || mongoose.model("ChatMessage", ChatMessageSchema);

export default ChatMessage;
