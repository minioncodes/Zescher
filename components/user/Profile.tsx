"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FiUser, FiMail, FiLogOut } from "react-icons/fi";
import { getCompleteUser } from "@/app/actions/userActions/user-auth";
import { IUserPlain } from "@/types/user_types";

export default function Profile({completeUser}:{completeUser:IUserPlain|null}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/user/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-600">
        Loading...
      </div>
    );
  }
  if(!completeUser){
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <FiUser size={22} className="text-gray-600" />
          <span className="text-lg font-medium text-gray-800">
            {completeUser.name || "No name set"}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <FiMail size={22} className="text-gray-600" />
          <span className="text-lg font-medium text-gray-800">
            {completeUser.email}
          </span>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-6 flex items-center space-x-2 px-5 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          <FiLogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
