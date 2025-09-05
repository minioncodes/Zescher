import ProductSchema from "@/models/admin/ProductSchema";
import connectDB from "@/lib/mongo";
import { IProduct } from "@/models/admin/ProductSchema";
import { revalidatePath } from "next/cache";

export interface EditProductInterface {
    id?: string;
    slug?: string;
    updates: Record<string, any>;
}
export async function editProduct({ id, slug, updates }: EditProductInterface) {
    try {
        await connectDB();
        const query = id ? { _id: id } : { slug };
        const updated = await ProductSchema.findByIdAndUpdate(
            query,
            { $set: updates },
            { new: true, runValidators: true }
        )
        if (!updated) {
            throw new Error("there is an error in updating the product");
        }
        revalidatePath("/products");
        revalidatePath(`/products/${id || slug}`);
    } catch (e: any) {
        console.log(e.message);
        throw new Error("there is internal error on updating the product")
    }
}