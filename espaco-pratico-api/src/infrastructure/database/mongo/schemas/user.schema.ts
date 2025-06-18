import mongoose from "mongoose";

export interface IUserDocument extends mongoose.Document {
    fullName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export const userSchema = new mongoose.Schema<IUserDocument>(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.index({ fullName: 1 });