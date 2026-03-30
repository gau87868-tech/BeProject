// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(15);
  const [loading, setLoading] = useState(true); 

  // Helper to safely extract userId (handles object or array)
  const getUserId = (userData) => {
    if (!userData) return null;

    // In our app we usually store { user: userDetails }
    const inner = userData.user ?? userData;

    if (inner?._id) return inner._id;          // case: { user: { _id, ... } }
    if (Array.isArray(inner) && inner[0]?._id) return inner[0]._id; // case: { user: [ { _id } ] }

    return null;
  };

  // On app load: restore user + that user's credits
  useEffect(() => {
    try {
      const storedUserStr = localStorage.getItem("user");

      if (storedUserStr) {
        const parsedUser = JSON.parse(storedUserStr);
        setUser(parsedUser);

        const userId = getUserId(parsedUser);

        if (userId) {
          const storedCredits = localStorage.getItem(`credits_${userId}`);
          if (storedCredits !== null) {
            setCredits(Number(storedCredits));
          } else {
            setCredits(15); // first time → default 15
          }
        } else {
          setCredits(15);
        }
      } else {
        // no user stored → just default credits
        setCredits(15);
      }
    } catch (e) {
      console.error("Error restoring auth state:", e);
      setUser(null);
      setCredits(15);
    } finally {
      setLoading(false);
    }
  }, []);

  // Whenever user OR credits change → save user and that user's credits
  useEffect(() => {
    if (!user) return;

    localStorage.setItem("user", JSON.stringify(user));

    const userId = getUserId(user);
    if (!userId) return;

    localStorage.setItem(`credits_${userId}`, String(credits));
  }, [user, credits]);

  // Login: set user and load their own credits (or 15 if new)
  const login = (userData) => {
    setUser(userData);

    const userId = getUserId(userData);

    if (userId) {
      const storedCredits = localStorage.getItem(`credits_${userId}`);
      if (storedCredits !== null) {
        setCredits(Number(storedCredits));
      } else {
        setCredits(15); // new user → 15
      }
    } else {
      setCredits(15);
    }
  };

  // Logout: clear current user, but we do NOT delete their credits from storage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setCredits(15); // UI reset; per-user credits still stored in localStorage
  };

  const addCredits = (amount) =>
    setCredits((prev) => prev + amount);

  const deductCredits = (amount) =>
    setCredits((prev) => Math.max(prev - amount, 0));

  if (loading) return null;

  return (
    <AuthContext.Provider
      value={{
        user,
        credits,
        loading,
        login,
        logout,
        addCredits,
        deductCredits,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}