import { Schema, model, models, Document, Types } from 'mongoose';

export interface IProfile extends Document {
  user: Types.ObjectId;
  headline?: string;
  bio?: string;
  location?: string;
  profilePicture?: string;
  followers: Types.ObjectId[];
  following: Types.ObjectId[];
  links: { title: string; url: string }[];
  skills: string[];
  certificates: {
    name: string;
    organization: string;
    issueDate?: Date;
    url?: string;
  }[];
  resume?: string;
  education: {
    school: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }[];
  experience: {
    title: string;
    company: string;
    location?: string;
    startDate: Date;
    endDate?: Date;
    current?: boolean;
    description?: string;
  }[];
}

const ProfileSchema = new Schema<IProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    headline: {
      type: String,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    links: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    skills: [String],
    certificates: [
      {
        name: { type: String, required: true },
        organization: { type: String, required: true },
        issueDate: { type: Date },
        url: { type: String },
      },
    ],
    resume: {
      type: String,
    },
    education: [
      {
        school: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        description: { type: String },
      },
    ],
    experience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

if (models.Profile) {
  delete models.Profile;
}

const Profile = model<IProfile>('Profile', ProfileSchema);

export default Profile;