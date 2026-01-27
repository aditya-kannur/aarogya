import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const AuthzContext = createContext();

export const AuthzProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  
  const [isInsurer, setIsInsurer] = useState(null);
  const [loadingAuthz, setLoadingAuthz] = useState(true);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      setIsInsurer(false);
      setLoadingAuthz(false); 
      return;
    }

    // check authorization only if user is logged in
    const checkAuthorization = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/insurer/check-authorization",
          { email: user.email }
        );
        setIsInsurer(res.data.authorized);
      } catch (error) {
        console.error("Authorization check failed", error);
        setIsInsurer(false);
      } finally {
        // 4. API check is done, allow app to render
        setLoadingAuthz(false);
      }
    };

    checkAuthorization();
  }, [isLoading, isAuthenticated, user]);

  // blocking the render until Auth0 and your API are finished to debug the reload issue.
  if (isLoading || loadingAuthz) {
    return <div>Loading Authorization...</div>; 
  }

  return (
    <AuthzContext.Provider value={{ isInsurer, loadingAuthz }}>
      {children}
    </AuthzContext.Provider>
  );
};

export const useAuthz = () => useContext(AuthzContext);