"use server";
import { IUserPlain } from "@/types/user_types";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import connectDB from "@/lib/mongo"
import User, { IUser } from "@/models/User"
export async function getUserId() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("Not authenticated");
    }
    return session.user.id;
}
export async function getCompleteUser():Promise<IUserPlain|null> {
    try {
        await connectDB();
        const id = await getUserId();
        const completUser = await User.findById({ id });
        if (!completUser) {
            return null;
        }
        const plainComplteUser:IUserPlain= completUser.toObject({getters:true}) as IUserPlain;
        return plainComplteUser
    } catch (e: any) {
        return null;
    }
}