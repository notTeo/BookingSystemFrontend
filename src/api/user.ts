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
      subscription: apiUser.subscription,
      active: apiUser.active,
      bookable: apiUser.bookable,
      shops: apiUser.shops,
    };
  } catch (err) {
    console.error("getCurrentUser() failed:", err);
    return null;
  }
}

export async function getInbox() {
  const token = localStorage.getItem("token");
  if (!token) return { received: [], sent: [] };

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/me/inbox`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("getInbox() failed:", res.status);
      return { received: [], sent: [] };
    }

    const json = await res.json();

    // Expecting backend response: { success: true, data: { received: [...], sent: [...] } }
    const { received = [], sent = [] } = json.data || {};

    return { received, sent };
  } catch (err) {
    console.error("getInbox() failed:", err);
    return { received: [], sent: [] };
  }
}

/** Accept an invite by ID */
export async function acceptInvite(inviteId: number) {
  const token = localStorage.getItem("token");

  await fetch(`${import.meta.env.VITE_API_URL}/me/inbox/${inviteId}/accept`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}

/** Decline an invite by ID */
export async function declineInvite(inviteId: number) {
  const token = localStorage.getItem("token");

  await fetch(`${import.meta.env.VITE_API_URL}/me/inbox/${inviteId}/decline`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}
