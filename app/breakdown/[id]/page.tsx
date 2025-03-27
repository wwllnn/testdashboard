"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import Score from '@/components/Score'
import UserProfileForm from '@/components/UserProfileForm';


import { useAuth } from '@/lib/auth'

const Breakdown = () => {

  const { user, userData } = useAuth();

  const [profileCompleted, setProfileCompleted] = useState(false);


  useEffect(() => {
    if (userData) {
      console.log("userData:", userData); // debug
      setProfileCompleted(true);
    }
  }, [userData]);

  

  if (!profileCompleted) {
    return (
      <div className='mt-48'>
        <UserProfileForm onComplete={() => setProfileCompleted(true)} />
      </div>
    );
  } else return (
    <div className='bg-gray-50'>
    <Score></Score>
    </div>
  )
}

export default Breakdown