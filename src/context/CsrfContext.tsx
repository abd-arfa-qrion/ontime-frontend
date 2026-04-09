// src/context/CsrfContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import csrfServices from "@/pages/api/services/csrf";

type CsrfContextType = {
  csrfToken: string | null;
  refreshCsrfToken: () => Promise<void>;
};

const CsrfContext = createContext<CsrfContextType | undefined>(undefined);

export const useCsrf = () => {
  const context = useContext(CsrfContext);
  if (!context) {
    throw new Error("useCsrf must be used within a CsrfProvider");
  }
  return context;
};

export const CsrfProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();

  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  const fetchCsrfToken = async () => {
    try {
      if (session?.accessToken) {
        const response = await csrfServices.getCSRF(session.accessToken);
        setCsrfToken(response.data);
      }
    } catch (error) {
      console.error("Error fetching CSRF token:", error);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.accessToken) {
      fetchCsrfToken();
    }
  }, [status, session?.accessToken]);

  return (
    <CsrfContext.Provider
      value={{ csrfToken, refreshCsrfToken: fetchCsrfToken }}
    >
      {children}
    </CsrfContext.Provider>
  );
};
