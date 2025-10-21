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
