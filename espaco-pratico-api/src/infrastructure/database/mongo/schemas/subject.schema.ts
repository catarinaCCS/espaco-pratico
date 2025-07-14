import mongoose from "mongoose";

export interface ISubjectDocument extends mongoose.Document {
    fullName: string;
    createdAt: Date;
    updatedAt: Date;
}

export const subjectSchema = new mongoose.Schema<ISubjectDocument>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);