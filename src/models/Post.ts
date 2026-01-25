import mongoose, { Schema, Document, Model, models } from 'mongoose';

export interface IPost extends Document {
    userId: mongoose.Types.ObjectId;
    content: string;
    image?: string;
    likes: mongoose.Types.ObjectId[];
    comments: {
        userId: mongoose.Types.ObjectId;
        text: string;
        createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const PostSchema: Schema<IPost> = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
        },
        likes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        comments: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                text: {
                    type: String,
                    required: true,
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    { timestamps: true }
);

if (mongoose.models.Post) {
    delete mongoose.models.Post;
}

const Post: Model<IPost> = mongoose.model<IPost>('Post', PostSchema);

export default Post;
