import mongoose, { mongo } from "mongoose";
import { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IUser extends Document {
    _id: string,
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    location: string;
}

const UserSchema = new Schema<IUser>({
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true },
    location: { type: String, required: true }
})
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
