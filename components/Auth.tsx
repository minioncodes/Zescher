"use client"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
export default function Auth() {
    const { data: session } = useSession();
    if (session) {
        return (
            <>
                Signed in as {session.user?.email}
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <>
            Not signed in <br />
            <button onClick={() => signIn("google")}>Sign in with Google</button>
            <button onClick={() => signIn("apple")}>Sign in with Apple</button>
        </>
    );
}