// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import axios from "axios";
// import { useAuth0 } from "@auth0/auth0-react";

// const AuthzContext = createContext();

// export const AuthzProvider = ({ children }) => {
//   const { user, isAuthenticated, isLoading } = useAuth0();
//   const [isInsurer, setIsInsurer] = useState(null);
//   const [loadingAuthz, setLoadingAuthz] = useState(true);

//   const checkAuthorization = useCallback(async () => {
//     if (isLoading || !isAuthenticated || !user) {
//        if (!isLoading) setLoadingAuthz(false);
//        return;
//     }

//     setLoadingAuthz(true); 
//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/insurer/check-authorization",
//         { email: user.email }
//       );
//       setIsInsurer(res.data.authorized);
//     } catch (error) {
//       console.error("Auth check failed", error);
//       setIsInsurer(false);
//     } finally {
//       setLoadingAuthz(false);
//     }
//   }, [user, isAuthenticated, isLoading]);

//   useEffect(() => {
//     checkAuthorization();
//   }, [checkAuthorization]);

//   return (
//     <AuthzContext.Provider value={{ isInsurer, loadingAuthz, refreshAuth: checkAuthorization }}>
//       {children}
//     </AuthzContext.Provider>
//   );
// };

// export const useAuthz = () => useContext(AuthzContext);

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

const AuthzContext = createContext();

export const AuthzProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [isInsurer, setIsInsurer] = useState(null);
  
  // New state for the saved role
  const [savedRole, setSavedRole] = useState(""); 
  
  const [loadingAuthz, setLoadingAuthz] = useState(true);

  const checkAuthorization = useCallback(async () => {
    if (isLoading || !isAuthenticated || !user) {
       if (!isLoading) setLoadingAuthz(false);
       return;
    }

    setLoadingAuthz(true); 
    try {
      // 1. Check Insurer Authorization (Existing)
      const authRes = await axios.post(
        "http://localhost:5000/api/insurer/check-authorization",
        { email: user.email }
      );
      setIsInsurer(authRes.data.authorized);

      // 2. NEW: Fetch Saved Role from DB
      const roleRes = await axios.get(`http://localhost:5000/api/user/role/${user.email}`);
      setSavedRole(roleRes.data.lastRole);

    } catch (error) {
      console.error("Auth check failed", error);
      setIsInsurer(false);
    } finally {
      setLoadingAuthz(false);
    }
  }, [user, isAuthenticated, isLoading]);

  useEffect(() => {
    checkAuthorization();
  }, [checkAuthorization]);

  return (
    // Expose savedRole so Roles.js can use it
    <AuthzContext.Provider value={{ isInsurer, savedRole, loadingAuthz, refreshAuth: checkAuthorization }}>
      {children}
    </AuthzContext.Provider>
  );
};

export const useAuthz = () => useContext(AuthzContext);