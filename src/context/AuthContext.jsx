// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import * as auth from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const hasToken = await auth.initTokenFromStorage();
        if (hasToken) {
          const me = await auth.getMe();
          setUser(me);
        }
      } catch {
        setUser(null);
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  async function login(username, password, persistMode = 'session') {
    await auth.login(username, password, persistMode);
    const me = await auth.getMe();
    setUser(me);
    return me;
  }

  async function logout() {
    try {
      await auth.logout();
    } finally {
      setUser(null);
    }
  }

  const hasRole = (role) => Array.isArray(user?.roles) && user.roles.includes(role);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: !!user && !!auth.getAccessToken(),
      login,
      logout,
      hasRole
    }),
    [user, initializing]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}