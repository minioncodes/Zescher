import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import type { NextAuthOptions, Session, User as Customer } from "next-auth";
import type { JWT } from "next-auth/jwt";
import connectDB from "./mongo";
import User from "@/models/User";
export const NEXT_AUTH_CONFIG: NextAuthOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        Apple({
            clientId: process.env.APPLE_CLIENT_ID ?? "",
            clientSecret: process.env.APPLE_CLIENT_SECRET ?? "",
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }: { user: Customer }) {
            const existingUser = await User.findOne({
                where: { email: user.email! },
            });
            if (!existingUser) {
                await User.create({
                    data: {
                        name: user.name || "No Name",
                        username: `user_${Math.random().toString(36).substring(7)}`,
                        email: user.email!,
                        password: "******",
                        phonenumber: "999999999",
                        profession: "enter your profession",
                    },
                });
            }
            return true;
        },
        async jwt({ token, user }: { token: JWT; user?: Customer }) {
            if (user) {
                const dbuser = await User.findOne({
                    where: { email: user.email! },
                });
                token.uid = dbuser?.id;
            }
            return token;
        },
        session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                (session.user as any).id = token.uid;
            }
            return session;
        },
    },
    pages: {
        signIn: "auth/user/signin",
    },
};