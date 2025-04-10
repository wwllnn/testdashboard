"use client";
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '../img/logo.png'
import { useAuth } from '@/lib/auth'
import { Bree_Serif } from 'next/font/google';

const breeSerif = Bree_Serif({
  subsets: ['latin'],
  weight: '400', // Available weight for Bree Serif
});

const Navbar = () => {
  const { user, signOut } = useAuth();

  // ✅ Define list of admin emails
  const ADMIN_EMAILS = ["william@educate-one.com", 
    "vvllxn@gmail.com", 
    "sugarland@educate-one.com",
    "nayolyi@educate-one.com",
    "s.james@educate-one.com",
    "matt.shafer@educate-one.com",
    "ross.c@educate-one.com",
    "tutor6@educate-one.com"
  ];  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  return (
    <div className={`bg-blue-800 dark:bg-slate-700 py-5 px-10
      flex justify-between items-center border-b-4 border-gray-100 shadow-[0_4px_8px_rgba(0,0,0,0.3)] z-10 ${breeSerif.className}`}>

      {/* Logo link */}
      <Link href='/'>
        <Image src={logo} alt='logo' className='w-36 align-center'/>
      </Link>

      {/* Right side user area */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-lg text-white font">Welcome, {user.displayName || user.email}</span>

            {/* ✅ Admin panel button shown only for admins */}
            {isAdmin && (
              <Link href="/admin">
                <button className="bg-gray-900 px-4 py-2 rounded hover:bg-gray-700 text-white">
                  Admin Panel
                </button>
              </Link>
            )}

            {/* Log out button */}
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

export default Navbar;
