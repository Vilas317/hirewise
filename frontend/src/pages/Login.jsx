import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../utils/api";

const Login = () => {
  const { login, userToken } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 Auto redirect if already logged in
  useEffect(() => {
    if (userToken) {
      navigate("/dashboard");
    }
  }, [userToken]);

  const handleLogin = async () => {
    const { res, data } = await apiRequest("/auth/login", "POST", {
      email,
      password,
    });

    if (res.ok) {
      login(data.token);
      navigate("/dashboard");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Login</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className="border p-2 w-full mb-2"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="bg-black text-white px-4 py-2 w-full"
        onClick={handleLogin}
      >
        Login
      </button>
    </div>
  );
};

export default Login;