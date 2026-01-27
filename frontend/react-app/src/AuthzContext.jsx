import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const AuthzContext = createContext();

export const AuthzProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isInsurer, setIsInsurer] = useState(null);
  const [loadingAuthz, setLoadingAuthz] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const checkAuthorization = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/insurer/check-authorization",
          { email: user.email }
        );
        setIsInsurer(res.data.authorized);
      } catch {
        setIsInsurer(false);
      } finally {
        setLoadingAuthz(false);
      }
    };

    checkAuthorization();
  }, [isAuthenticated, user]);

  if (isLoading) return null;

  return (
    <AuthzContext.Provider value={{ isInsurer, loadingAuthz }}>
      {children}
    </AuthzContext.Provider>
  );
};

export const useAuthz = () => useContext(AuthzContext);
