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
        console.log("server inside the try catch ")
        await connectDB();
        const id = await getUserId();
        console.log("id of the user = ", id)
        const completUser = await User.findOne({ _id: id });
        console.log("complte user from the server action =- ", completUser)
        if (!completUser) {
            return null;
        }
        const plainComplteUser: IUserPlain = completUser.toObject({ getters: true }) as IUserPlain;
        console.log("plaincomplete user from the action = ", plainComplteUser);
        return plainComplteUser
    } catch (e: any) {
        return null;
    }
}