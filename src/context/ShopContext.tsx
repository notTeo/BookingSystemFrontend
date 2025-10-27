import { createContext, useContext, useEffect, useState } from "react";
import type { ShopDTO } from "../types/shop";
import type { Role } from "../types/user";
import { useAuth } from "./AuthContext";
import { getShopOverview } from "../api/shop";

interface ShopContextType {
  activeShop: ShopDTO | null;
  currentRole: Role;
  selectShop: (shop: { id: number; name: string; role: Role }) => Promise<void>;
  clearShop: () => void;
  refreshShop: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [activeShop, setActiveShop] = useState<ShopDTO | null>(null);
  const [currentRole, setCurrentRole] = useState<Role>("NONE");

  // === Helpers for persistence ===
  const loadFromStorage = () => {
    try {
      const data = localStorage.getItem("activeShop");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  };

  const saveToStorage = (shop: { id: number; name: string; role: Role }) => {
    localStorage.setItem("activeShop", JSON.stringify(shop));
  };

  const clearFromStorage = () => {
    localStorage.removeItem("activeShop");
  };

  // === Select new shop ===
  const selectShop = async (shop: { id: number; name: string; role: Role }) => {
    saveToStorage(shop);
    setCurrentRole(shop.role);
    try {
      const data = await getShopOverview(shop.id);
      setActiveShop(data.data.shop);
    } catch (err) {
      console.error("Failed to load shop:", err);
      setActiveShop(null);
    }
  };

  // === Clear current shop ===
  const clearShop = () => {
    setActiveShop(null);
    setCurrentRole("NONE");
    clearFromStorage();
  };

  // === Refresh (for reload or auth change) ===
  const refreshShop = async () => {
    const stored = loadFromStorage();
    if (!stored || !user) {
      return;
    }

    // make sure user still has access
    const membership = user.shops.find((s) => s.id === stored.id);
    if (!membership) {
      clearShop();
      return;
    }

    try {
      const data = await getShopOverview(stored.id);
      setActiveShop(data.data.shop);
      setCurrentRole(membership.role);
    } catch (err) {
      console.error("Failed to refresh shop:", err);
      clearShop();
    }
  };

  // === Restore on login/change ===
  useEffect(() => {
    refreshShop();
  }, [user]);

  return (
    <ShopContext.Provider
      value={{ activeShop, currentRole, selectShop, clearShop, refreshShop }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used within a ShopProvider");
  return ctx;
};
