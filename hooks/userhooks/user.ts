"use client"

import { useEffect } from "react"
import { useAppDispatch } from "../redux-hooks"
import { useAppSelector } from "../redux-hooks"
import { fetchUser } from "@/redux/slices/user-slice/user-slice"

export function useUser() {
    const dispatch = useAppDispatch();
    const { userId, user, loading, err } = useAppSelector((state) => state.user);
    useEffect(() => {
        if (!userId || !user) {
            dispatch(fetchUser());
        }
    }, [dispatch, userId, user]);
    return { userId, user, loading, err };
}
