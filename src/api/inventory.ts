import type { InventoryItem } from "../types/inventory";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * ==============================
 *  INVENTORY API (shop-scoped)
 * ==============================
 */

export async function getInventoryItems(shopId: number) {
  const res = await fetch(`${API_URL}/shop/${shopId}/inventory`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch inventory items");

  const result = await res.json();
  // ✅ Return only the actual array of items, not the wrapper object
  return result.data.data as InventoryItem[];
}



// === Create new inventory item ===
export async function createInventoryItem(
  shopId: number,
  payload: {
    name: string;
    category?: string;
    quantity?: number;
    unit?: string;
    photoUrl?: string;
  }
) {
  const res = await fetch(`${API_URL}/shop/${shopId}/inventory`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create inventory item");
  return (await res.json()).data as InventoryItem;
}

// === Update existing item ===
export async function updateInventoryItem(
  shopId: number,
  id: number,
  payload: Partial<{
    name: string;
    category: string;
    quantity: number;
    unit: string;
    photoUrl: string;
    active: boolean;
  }>
) {
  const res = await fetch(`${API_URL}/shop/${shopId}/inventory/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update inventory item");
  return (await res.json()).data as InventoryItem;
}

// === Delete item ===
export async function deleteInventoryItem(shopId: number, id: number) {
  const res = await fetch(`${API_URL}/shop/${shopId}/inventory/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete inventory item");
  return (await res.json()).data;
}
