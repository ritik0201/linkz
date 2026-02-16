import mongoose, { Schema, Document, Model, models, Types } from 'mongoose';

export interface ITask extends Types.Subdocument {
    title: string;
    description?: string;
    assignedTo: mongoose.Types.ObjectId;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate?: Date;
    createdAt: Date;
}

export interface IWorkspace extends Document {
    name: string;
    description?: string;
    createdBy: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    tasks: Types.DocumentArray<ITask>;
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending'
    },
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const WorkspaceSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        projectId: { type: Schema.Types.ObjectId, ref: 'ProjectOrResearch', required: true },
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        tasks: [TaskSchema]
    },
    { timestamps: true }
);

const Workspace: Model<IWorkspace> = models.Workspace || mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);

export default Workspace;