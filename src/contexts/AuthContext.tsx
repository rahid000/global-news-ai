
"use client";

import type { User as FirebaseUser } from 'firebase/auth';
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// Simulate Firebase User type
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  signInWithEmailPassword: (email?: string, password?: string) => Promise<void>;
  signUpWithEmailPassword: (email?: string, password?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'easywish000@gmail.com';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simulate onAuthStateChanged
    const unsubscribe = setTimeout(() => {
      // To test authenticated state, uncomment this:
      // const testUser = { uid: 'test-user', email: ADMIN_EMAIL, displayName: 'Admin User', photoURL: null };
      // setUser(testUser);
      // setIsAdmin(testUser.email === ADMIN_EMAIL);
      setLoading(false);
    }, 10); // Reduced delay from 100ms to 10ms

    return () => clearTimeout(unsubscribe);
  }, []);

  const updateUserSession = (currentUser: User | null) => {
    setUser(currentUser);
    if (currentUser && currentUser.email === ADMIN_EMAIL) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const googleUser = { uid: 'google-user', email: 'googleuser@example.com', displayName: 'Google User', photoURL: 'https://placehold.co/40x40.png' };
    updateUserSession(googleUser);
  };

  const logout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    updateUserSession(null);
  };
  
  const signInWithEmailPassword = async (email?: string, password?: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const emailUser = { uid: 'email-user', email: email || 'user@example.com', displayName: 'Email User', photoURL: null };
    updateUserSession(emailUser);
  };

  const signUpWithEmailPassword = async (email?: string, password?: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    const newEmailUser = { uid: 'new-email-user', email: email || 'newuser@example.com', displayName: 'New Email User', photoURL: null };
    updateUserSession(newEmailUser);
  };


  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, logout, signInWithEmailPassword, signUpWithEmailPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

