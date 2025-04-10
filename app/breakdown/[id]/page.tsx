"use client"
import React from 'react'
import { useState, useEffect } from 'react';
import Score from '@/components/Score'
import UserProfileForm from '@/components/UserProfileForm';


import { useAuth } from '@/lib/auth'

const Breakdown = () => {

  return (
    <div className='bg-gray-50'>
    <Score></Score>
    </div>
  )
}

export default Breakdown