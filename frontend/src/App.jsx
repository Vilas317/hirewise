import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { useEffect } from "react";
import { warmupBackend } from "./utils/api";

function App() {
  const { userToken } = useAuth();

  useEffect(() => {
    // Start waking the backend while the user is viewing the login page.
    // Do not await this: frontend navigation remains immediate.
    warmupBackend();
  }, []);

  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 ROOT ROUTE FIX */}
        <Route
          path="/"
          element={
            userToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoutes>
              <Dashboard />
            </ProtectedRoutes>
          }
        />

        {/* 🔥 OPTIONAL: Catch all */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;