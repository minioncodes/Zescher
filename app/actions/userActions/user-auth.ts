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
    console.log("session id from the id action = ", session.user.id)
    return session.user.id;
}
export async function getCompleteUser(): Promise<IUserPlain | null> {
    console.log("server action got called ")
    try {
        await connectDB();
        const id = await getUserId();
        const completUser = await User.findOne({ _id: id });
        if (!completUser) {
            return null;
        }
        const plainComplteUser: IUserPlain = 
        completUser.toObject({ getters: true }) as IUserPlain;
        return plainComplteUser
    } catch (e: any) {
        return null;
    }
}
