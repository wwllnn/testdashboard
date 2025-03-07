"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../img/logo.png'
import { useAuth } from '@/lib/auth'

const Navbar = () => {

  const { user, signOut } = useAuth();

  return (
    <div className='bg-primary dark:bg-slate-700 py-5 px-10
    flex justify-between items-center'>
        <Link href='/'>
            <Image src={logo} alt='logo' className='w-36 align-center'/>
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-lg text-white">Hello, {user.displayName || user.email}</span>
              <button
                onClick={signOut}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
              >
                Log Out
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="bg-blue-400 px-4 py-2 rounded hover:bg-blue-700 text-white"
            >
              Login
            </a>
          )}
        </div>
    </div>
  )
}

export default Navbar