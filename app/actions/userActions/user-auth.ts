"use server";
import { IUserPlain } from "@/types/user_types";
import { getServerSession } from "next-auth"
import connectDB from "@/lib/db"
import User, { IUser } from "@/models/User"
import { authOptions } from "@/lib/auth";
export async function getUserId() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        throw new Error("Not authenticated");
    }
    console.log("session user id from the server action ",session.user.id);
    return session.user.id;
}
export async function getCompleteUser(): Promise<IUserPlain | null> {
    console.log("server action got called ")
    try {
        
        await connectDB();
        console.log("before the get user id server action")
        const id = await getUserId();
        console.log("after the get user id server action")
        console.log("session from the server action", id)
        const completUser = await User.findOne({ _id: id });
        if (!completUser) {
            return null;
        }
        const plainComplteUser: IUserPlain =
            completUser.toObject({ getters: true }) as IUserPlain;
        return plainComplteUser
    } catch (e: any) {
        console.log("hello from the cath of th server action")
        return null;
    }
}
