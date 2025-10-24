import type { Role } from "./user";

export type Day =
  | "MONDAY" | "TUESDAY" | "WEDNESDAY"
  | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

export type HourRow = {
  dayOfWeek: Day;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
};

// =========================
// SHOP DTO
// =========================
export interface ShopDTO {
  id: number;
  name: string;
  address?: string | null;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

// =========================
// SHOP USER DTO
// =========================
export interface ShopUserDTO {
  id: number;
  shopId: number;
  userId: number;
  role: Role;        
  active: boolean;
  bookable: boolean;

  // optional nested data
  shop?: ShopDTO;
  user?: {
    id: number;
    name: string;
    email: string;
  };

  createdAt: string;
  updatedAt: string;
}

// =========================
// SHOP CONTEXT TYPE
// =========================
export interface ShopContextType {
  selectedShop: ShopDTO | null;
  shopUser: ShopUserDTO | null;   // role, active, bookable, etc.
  setSelectedShop: (shop: ShopDTO | null) => void;
  loading: boolean;
}
