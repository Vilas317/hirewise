const BASE_URL = "https://hirewise-47jj.onrender.com/api";

export const apiRequest = async (endpoint, method = "GET", body) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `https://hirewise-47jj.onrender.com/api/${endpoint}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 🔥 CRITICAL
      },
      body: body ? JSON.stringify(body) : undefined,
    }
  );

  let data;

  try {
    data = await res.json();
  } catch (err) {
    data = { message: "Invalid JSON response" };
  }

  return { res, data };
};