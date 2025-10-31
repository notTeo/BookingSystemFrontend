import type { GetShopOverviewResponse } from "../types/shop";
import type { ShopWithRoleDTO } from "../types/shop";

export async function createShop(name: string, openingHours: any[]) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${import.meta.env.VITE_API_URL}/shop/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, openingHours }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Unknown error");
  }

  return data;
}
  
export async function sendShopInvite(
  shopId: number,
  data: { email: string; role: string; message?: string }
) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/shop/${shopId}/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const json = await res.json();
  return json.data; 
}


export async function getShopOverview(shopId: number): Promise<GetShopOverviewResponse> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/shop/${shopId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to fetch overview");
  return json.data;
}



export async function getAllShops(): Promise<ShopWithRoleDTO[]> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/shop`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error || "Failed to fetch all shops");
  } 
  return json.data.data || [];
}


export async function getShopTeam(shopId: number){
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/shop/${shopId}/team`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to fetch shop team");
  return json.data;
}

export async function toggleShopUserStatus(shopId: number, userId:number){
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/shop/${shopId}/team/${userId}/status`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
   
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to fetch change member status");
  return json.data;
}

export async function toggleShopUserBookable(shopId: number, userId:number){
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/shop/${shopId}/team/${userId}/bookable`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
   
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to fetch change member status");
  return json.data;
}

export async function deleteShop(shopId: number){
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No auth token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/shop/${shopId}/delete`, {
    method:  "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Failed to fetch shop team");
  return json.data;
}