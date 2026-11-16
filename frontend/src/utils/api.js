const BASE_URL =
  import.meta.env.VITE_API_URL || "https://hirewise-47jj.onrender.com/api";

export const apiRequest = async (endpoint, method = "GET", body) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = { message: "Invalid JSON response from server" };
    }

    // Do not leave the UI in a broken dashboard state when a saved JWT has
    // expired, been revoked, or no longer matches the server's signing secret.
    if (res.status === 401 && endpoint !== "auth/login") {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return { res, data };
  } catch (error) {
    console.error("API ERROR:", error);
    return {
      res: { ok: false, status: 0 },
      data: { message: "Network error or server not reachable" },
    };
  }
};


// Wake the Render free instance as soon as the frontend loads. This runs in
// the background and never blocks the login page or dashboard rendering.
let backendWarmupPromise;
export const warmupBackend = () => {
  if (backendWarmupPromise) return backendWarmupPromise;

  backendWarmupPromise = (async () => {
    const healthUrl = `${BASE_URL}/health`;
    const maxAttempts = 12;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const response = await fetch(healthUrl, { cache: "no-store" });
        if (response.ok) return true;
      } catch (error) {
        // A sleeping service or temporary network failure is expected here.
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    console.warn("HireWise backend did not become ready during warm-up.");
    backendWarmupPromise = null;
    return false;
  })();

  return backendWarmupPromise;
};
