import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import type { NextAuthOptions, Session, User as Customer } from "next-auth";
import type { JWT } from "next-auth/jwt";
import connectDB from "./mongo";
import User from "@/models/User";
import jwt from 'jsonwebtoken'

function generateAppleClientSecret() {
    const now = Math.floor(Date.now() / 1000);
    const privateKey = process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!privateKey?.includes("BEGIN PRIVATE KEY")) {
        throw new Error("invalid Apple private key: check your .env formatting");
    }
    return jwt.sign(
        {
            iss: process.env.APPLE_TEAM_ID!,
            iat: now,
            exp: now + 60 * 60 * 24,
            aud: "https://appleid.apple.com",
            sub: process.env.APPLE_CLIENT_ID!,
        },
        privateKey,
        {
            keyid: process.env.APPLE_KEY_ID!,
        }
    );
}
export const NEXT_AUTH_CONFIG: NextAuthOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        Apple({
            clientId: process.env.APPLE_CLIENT_ID!,
            clientSecret: generateAppleClientSecret()
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }: { user: Customer }) {
            try {
                await connectDB();
                console.log("Customer = ", user);
                const existingUser = await User.findOne({ email: user.email! });
                if (!existingUser) {
                    await User.create({
                        name: user.name || "No Name",
                        username: `user_${Math.random().toString(36).substring(7)}`,
                        email: user.email,
                        password: "******",
                        phonenumber: "999999999",
                        profession: "enter your profession",
                    });
                }
                return true;
            } catch (error: any) {
                console.error("SignIn callback error:", error);
                return `/auth/error?error=${encodeURIComponent(error.message)}`;
            }
        },
        async jwt({ token, user }: { token: JWT; user?: Customer }) {
            if (user) {
                const dbuser = await User.findOne({ email: user.email! },
                );
                console.log("db user = ",dbuser);
                token.uid = dbuser?._id;
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