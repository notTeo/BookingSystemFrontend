import type { UserDTO } from "../types/user";  

export async function getCurrentUser(): Promise<UserDTO | null> {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      window.location.href = "/login";  
      throw new Error(`Request failed: ${res.status}`);
    }

    const json = await res.json();
    const apiUser = json.data.data ?? json.data;

    return {
      id: apiUser.id,
      name: apiUser.name,
      email: apiUser.email,
      role: apiUser.role,
      active: apiUser.active,
      bookable: apiUser.bookable,
      shops: apiUser.shops
    };
  } catch (err) {
    console.error("getCurrentUser() failed:", err);
    return null;
  }
}
