import ProductSchema, { IProduct } from "@/models/admin/ProductSchema"
import connectDB from "@/lib/mongo"
    console.log("get products from the action go called");

export async function getProducts() {
    console.log("inside the get products from the action go called");
    try {
        await connectDB()
        const res = await ProductSchema.find({})
        console.log("res from the action = ",res);
        return res as IProduct[]
    } catch (error) {
        
    }
}