"use client"
import Profile from '@/components/user/Profile'
import React from 'react'
import { useUser } from '@/hooks/userhooks/user'


export default function page() {
  const { user, loading, err } = useUser();
               
  if (loading) {
    return <p>Loading user...</p>;
  }

  if (err) {
    return <p className="text-red-500">err: {err}</p>;
  }

  if (!user) {
    return <p>No user found</p>;
  }

  return (
    <div>
      <Profile completeUser={user} />
    </div>
  )
}

