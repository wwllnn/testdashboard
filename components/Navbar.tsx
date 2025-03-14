"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../img/logo.png'
import { useAuth } from '@/lib/auth'

const Navbar = () => {

  const { user, signOut } = useAuth();
  console.log(user)

  return (
    <div className='bg-blue-800 dark:bg-slate-700 py-5 px-10
    flex justify-between items-center border-b-4 border-gray-100 shadow-[0_4px_8px_rgba(0,0,0,0.3)] z-10'>
        <Link href='/'>
            <Image src={logo} alt='logo' className='w-36 align-center'/>
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-lg text-white">Hello, {user.displayName || user.email}</span>
              <button
                onClick={signOut}
                className="bg-red-700 px-4 py-2 rounded hover:bg-red-600 text-white"
              >
                Log Out
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="bg-white px-4 py-2 rounded hover:bg-gray-100 text-blue-600"
            >
              Login
            </a>
          )}
        </div>
    </div>
  )
}

export default Navbar