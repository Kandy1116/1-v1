
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/src/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const logout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const value = {
    user,
    logout,
    showModal,
    openModal,
    closeModal,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
