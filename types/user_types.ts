import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string; 
    } & DefaultSession["user"];
  }

  interface User {
    id: string; 
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid: string; 
  }
}

export type IUserPlain = {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  location?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  gender?: string;
};

