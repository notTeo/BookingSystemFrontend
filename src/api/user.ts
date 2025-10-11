import type { UserDTO } from "../types/user";  

const API_BASE = "http://localhost:4000";

export async function getCurrentUser(): Promise<UserDTO | null> {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      window.location.href = "/login";  
      throw new Error(`Request failed: ${res.status}`);
    }

    const json = await res.json();
    const apiUser = json.data.data ?? json.data; // handle both formats

    return {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      role: apiUser.role,
      active: apiUser.active,
      bookable: apiUser.bookable,
    };
  } catch (err) {
    console.error("getCurrentUser() failed:", err);
    return null;
  }
}
