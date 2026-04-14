const BASE_URL =
  import.meta.env.VITE_API_URL || "https://hirewise-47jj.onrender.com/api";

export const apiRequest = async (endpoint, method = "GET", body) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }), // ✅ only if exists
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    let data;

    try {
      data = await res.json();
    } catch (err) {
      data = { message: "Invalid JSON response from server" };
    }

    // 🔥 Debug logs (REMOVE later if needed)
    console.log("API RESPONSE:", res.status, data);

    return { res, data };

  } catch (error) {
    console.error("API ERROR:", error);

    return {
      res: { ok: false },
      data: { message: "Network error or server not reachable" },
    };
  }
};