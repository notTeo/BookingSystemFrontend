import { Outlet } from "react-router-dom";
import { useShop } from "../../context/ShopContext";

export default function ShopLayout() {
  const { activeShop, currentRole } = useShop();

  if (!activeShop) {
    // Optional fallback (briefly shown during redirect)
    return <p>Redirecting to overview...</p>;
  }

  // You can pass shop context to child routes if needed
  return <Outlet context={{ activeShop, currentRole }} />;
}
