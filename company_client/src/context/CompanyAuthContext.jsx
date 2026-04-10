// src/context/CompanyAuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from "react";

export const CompanyAuthContext = createContext();

export function CompanyAuthProvider({ children }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const storedCompany = localStorage.getItem("companyUser");
      if (storedCompany) {
        setCompany(JSON.parse(storedCompany));
      }
    } catch (e) {
      console.error("Error restoring company auth:", e);
      setCompany(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((orgData, accessToken, refreshToken) => {
    setCompany(orgData);
    localStorage.setItem("companyUser", JSON.stringify(orgData));
    if (accessToken) localStorage.setItem("companyAccessToken", accessToken);
    if (refreshToken) localStorage.setItem("companyRefreshToken", refreshToken);
  }, []);

  const logout = useCallback(() => {
    setCompany(null);
    localStorage.removeItem("companyUser");
    localStorage.removeItem("companyAccessToken");
    localStorage.removeItem("companyRefreshToken");
  }, []);

  const isAuthenticated = !!company;

  if (loading) return null;

  return (
    <CompanyAuthContext.Provider
      value={{ company, loading, login, logout, isAuthenticated, setLoading }}
    >
      {children}
    </CompanyAuthContext.Provider>
  );
}
