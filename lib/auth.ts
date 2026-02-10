import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcrypt";
import connectDB from "@/lib/db";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
  providers: [
    // ================= GOOGLE =================
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ================= CREDENTIALS =================
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
        if (!user || !user.password) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) {
          throw new Error("Invalid password");
        }

        // IMPORTANT: return MongoDB _id
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // ================= JWT =================
    async jwt({ token, user }) {
      // First login (user is available)
      if (user) {
        token.id = user.id; // already Mongo _id string
        token.email = user.email;
        return token;
      }

      // Subsequent requests
      if (!token.id && token.email) {
        await connectDB();

        const dbUser = await User.findOne({ email: token.email }).select("_id");
        if (dbUser) {
          token.id = dbUser._id.toString();
        }
      }

      return token;
    },

    // ================= SESSION =================
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string; // Mongo ObjectId string
      }
      return session;
    },

    // ================= GOOGLE SIGN-IN HANDLER =================
async signIn({ user, account }) {
  if (account?.provider !== "google") return true;

  await connectDB();

  const existingUser = await User.findOne({ email: user.email });

  if (!existingUser) {
    await User.create({
      name: user.name,
      email: user.email,
      image: user.image,
      provider: "google",
    });
  }

  return true;
}
  },

  pages: {
    signIn: "/auth/user/signin",
  },
};
