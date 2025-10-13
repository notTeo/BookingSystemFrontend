export async function createShop(name: string, openingHours: any[]) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/shop/new`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, openingHours }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }