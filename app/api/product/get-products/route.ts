import { NextResponse } from "next/server";
import connectDB from "@/lib/mongo";
import ProductSchema from "@/models/admin/ProductSchema";


console.log("get api route got called")
export async function GET() {
    try {
        await connectDB();
        const products = await ProductSchema.find({});
        console.log("prodcuts from the api ", products)
        return NextResponse.json(products);
    }catch(e:any){
        console.log("e msg = ",e.message);
        return NextResponse.json({msg:e.message},{status:500})
    }

}
