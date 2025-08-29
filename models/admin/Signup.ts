import mongoose from "mongoose";
import { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IAdmin extends Document{
    _id: string,
    name: string;
    email: string;
    password: string;
    createdAt: Date;
}

const AdminSchema = new Schema<IAdmin>({
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, required: true }
})
export default mongoose.models.Admin || mongoose.model<IAdmin>("Admin",AdminSchema) 