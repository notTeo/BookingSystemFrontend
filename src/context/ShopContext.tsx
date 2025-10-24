import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import type { ShopDTO, Role } from "../types/user";

type ShopContextType = {
  activeShop: ShopDTO | null;
  currentRole: Role;
  loading: boolean;
  setActiveShop: (shop: ShopDTO | null) => void;
  clearActiveShop: () => void;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  const { slug } = useParams<{ slug?: string }>();

  const [activeShop, setActiveShop] = useState<ShopDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------------------
  // Core logic: derive active shop from URL or storage
  // --------------------------------------------
  useEffect(() => {
    if (!user?.shops?.length) return;

    const slugFromUrl = slug ?? location.pathname.match(/\/shops\/([^/]+)/)?.[1];
    const stored = localStorage.getItem("activeShop");

    const target = slugFromUrl ?? stored;
    if (!target) {
      setActiveShop(null);
      setLoading(false);
      return;
    }

    const found = user.shops.find((s) => s.slug === target || s.name === target);
    if (found) {
      setActiveShop(found);
      localStorage.setItem("activeShop", found.slug ?? found.name);
    } else {
      setActiveShop(null);
      localStorage.removeItem("activeShop");
    }

    setLoading(false);
  }, [slug, location.pathname, user]);

  // --------------------------------------------
  // Helper to clear selection
  // --------------------------------------------
  const clearActiveShop = () => {
    setActiveShop(null);
    localStorage.removeItem("activeShop");
  };

  // --------------------------------------------
  // Derived data
  // --------------------------------------------
  const currentRole: Role = useMemo(
    () => activeShop?.role ?? "NONE",
    [activeShop]
  );

  return (
    <ShopContext.Provider
      value={{
        activeShop,
        currentRole,
        loading,
        setActiveShop,
        clearActiveShop,
      }}
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
