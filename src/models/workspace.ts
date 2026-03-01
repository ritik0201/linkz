import mongoose, { Schema, Document, Model, models, Types } from 'mongoose';

export interface ITask extends Types.Subdocument {
    title: string;
    description?: string;
    assignedTo: mongoose.Types.ObjectId;
    status: 'pending' | 'in-progress' | 'completed';
    dueDate?: Date;
    createdAt: Date;
}

export interface IMeeting extends Types.Subdocument {
  title: string;
  date: Date;
  link: string;
  createdBy: mongoose.Types.ObjectId;
}


export interface IWorkspace extends Document {
    name: string;
    description?: string;
    createdBy: mongoose.Types.ObjectId;
    projectId: mongoose.Types.ObjectId;
    members: mongoose.Types.ObjectId[];
    tasks: Types.DocumentArray<ITask>;
    meetings: Types.DocumentArray<IMeeting>;
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

const MeetingSchema = new Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  link: { type: String, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const WorkspaceSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        projectId: { type: Schema.Types.ObjectId, ref: 'ProjectOrResearch', required: true },
        members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        tasks: [TaskSchema],
        meetings: [MeetingSchema],
    },
    { timestamps: true }
);

const Workspace: Model<IWorkspace> = models.Workspace || mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);

export default Workspace;