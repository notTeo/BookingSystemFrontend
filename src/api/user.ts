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
      shops: apiUser.shops,
    };
  } catch (err) {
    console.error("getCurrentUser() failed:", err);
    return null;
  }
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
}


export async function updateUser(payload: UpdateUserPayload): Promise<UserDTO> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/me/update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Failed to update user");
  }

  const data = await res.json();
  return data.data as UserDTO;
}

export async function deleteUser(password: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to delete account");
  }

  return res.json();
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
