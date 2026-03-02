import mongoose, { Schema, models, Document, Model } from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message: Model<IMessage> =
  models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default Message;