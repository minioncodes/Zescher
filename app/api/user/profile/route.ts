import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongo";
import User from "@/models/User";


export async function PATCH(req: NextRequest) {
  try {

    await connectDB();

    // Get logged-in user from session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      phoneNumber,
      dateOfBirth,
      gender,
      location,
      address,
    } = body;

    // Find user by email (from session) and update
    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          ...(name && { name }),
          ...(phoneNumber && { phoneNumber }),
          ...(dateOfBirth && { dateOfBirth }),
          ...(gender && { gender }),
          ...(location && { location }),
          ...(address && { address }),
        },
      },
      { new: true }
    ).select("-password"); // never return password

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
