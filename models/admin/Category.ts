import mongoose from "mongoose";
export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;
    image?: string; 
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string
}

const CategorySchema=new mongoose.Schema<ICategory>(
    {
        name:{type:String,required:true},
        slug:{type:String,required:true},
        description:{type:String},
        image:{type:String},
        isActive:{type:Boolean,required:true},
        createdBy : { type: String, ref: "Admin", required: true }
    },
    {timestamps:true}
)
export default mongoose.models.Category || mongoose.model<ICategory>("Category",CategorySchema)