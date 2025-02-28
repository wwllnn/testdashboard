"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";

// Create the AuthContext
const AuthContext = createContext();

// Create a custom hook to access the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, setUser);

    // Cleanup on component unmount
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
