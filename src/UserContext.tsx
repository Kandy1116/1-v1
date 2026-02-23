
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '@/src/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
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
