import { Outlet } from "react-router-dom";
import { ShopProvider } from "../../context/ShopContext";

export default function ShopLayout() {
  return (
    <ShopProvider>
      <Outlet />
    </ShopProvider>
  );
}
