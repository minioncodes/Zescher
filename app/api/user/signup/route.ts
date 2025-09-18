import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import connectDB from "@/lib/mongo";
import User from "@/models/User";

export async function POST(req:NextRequest){
    try{
        const {name,email,password}=await req.json();
        if(!name || !email || !password){
            return NextResponse.json({err:"Missing fields"},{status:400})
        }
        await connectDB()
        const existingUser=await User.findOne({email});
        if(existingUser){
            return NextResponse.json({msg:"user already exist"},{status:400})
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newuser=await User.create({
            name,
            email,
            password:hashedPassword
        })
        return NextResponse.json({msg:"user created succesfully"})
    }catch(e:any){

    }
}