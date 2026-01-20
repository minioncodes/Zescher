import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("User not found");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(), // 🔒 Mongo ObjectId
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

callbacks: {
  async jwt({ token, user }) {
    await connectDB();

    const email = user?.email ?? token.email;
    if (!email) return token;

    const dbUser = await User.findOne({ email }).select("_id");
    if (!dbUser) {
      throw new Error("User not found in jwt callback");
    }

    token.id = dbUser._id.toString(); // 🔒 Mongo ObjectId ONLY
    return token;
  },

  async session({ session, token }) {
    if (!token.id) {
      throw new Error("Missing token.id in session callback");
    }

    session.user.id = token.id as string;
    return session;
  },
},


  pages: {
    signIn: "/auth/user/signin",
  },
};