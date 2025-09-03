import ProductSchema from "@/models/admin/ProductSchema"
import connectDB from "@/lib/mongo"

export async function getProducts() {
    try {
        await connectDB()
        const res = await ProductSchema.find({})
        return res
    } catch (error) {
        
    }
}