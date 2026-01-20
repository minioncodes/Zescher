import Google from "next-auth/providers/google";
import type { NextAuthOptions, Session, User as Customer } from "next-auth";
import type { JWT } from "next-auth/jwt";
import connectDB from "./db";
import User from "@/models/User";
import Credentials from "next-auth/providers/credentials";
import bcrypt from 'bcrypt'


export const NEXT_AUTH_CONFIG: NextAuthOptions = {
    providers: [
        Google({ 
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("mismatch in the data")
                }
                await connectDB();
                const existingUser = await User.findOne({ email: credentials.email });
                if (!existingUser) {
                    throw new Error("user not found!");
                }
                const isvalidpassword = await bcrypt.compare(credentials.password, existingUser.password);
                if (!isvalidpassword) {
                    throw new Error("password is invalid!")
                }
                return {
                    id: existingUser._id.toString(),
                    name: existingUser.name,
                    email: existingUser.email
                }
            }
        })
    ],
    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user }: { user: Customer }) {
            try {
                await connectDB();
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
                return `/auth/error?error=${encodeURIComponent(error.message)}`;
            }
        },
        
        async jwt({ token, user }: { token: JWT; user?: Customer }) {
            if (user) {
                const dbuser = await User.findOne({ email: user.email! },
                );
                token.id = dbuser?._id;
            }
            return token;
        },
        session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                (session.user.id as any) = token.id;
            }
            return session;
        },

    },
    pages: {
        signIn: "auth/user/signin",
    },
};