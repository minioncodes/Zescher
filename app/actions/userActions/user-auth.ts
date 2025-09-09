import { cookies } from "next/headers";

export default async function getId(){
    const cookieStore=await cookies();
    const token=await cookieStore.get("")
}