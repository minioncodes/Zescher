import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import NextAuth from "next-auth";

export const authOptions=NEXT_AUTH_CONFIG;
const handler=NextAuth(authOptions);

export {handler as GET ,handler as POST}