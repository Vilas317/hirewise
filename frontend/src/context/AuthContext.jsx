import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const isTokenUsable = (token) => {
  if (!token) return false;

  try {
    const encodedPayload = token.split(".")[1];
    if (!encodedPayload) return false;
    const base64 = encodedPayload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded));
    // JWT exp is expressed in seconds. Treat malformed/expired tokens as signed out.
    return typeof payload.exp === "number" && payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  // Read storage before the first render so protected routes never briefly use
  // an uninitialized/stale authentication state.
  const [userToken, setUserToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    if (isTokenUsable(storedToken)) return storedToken;
    localStorage.removeItem("token");
    return null;
  });

  const login = (token) => {
    if (!isTokenUsable(token)) {
      localStorage.removeItem("token");
      setUserToken(null);
      return;
    }
    localStorage.setItem("token", token);
    setUserToken(token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserToken(null);
  };

  useEffect(() => {
    // Any protected API request that receives 401 invalidates the saved login.
    const handleUnauthorized = () => logout();
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  return (
    <AuthContext.Provider value={{ userToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
