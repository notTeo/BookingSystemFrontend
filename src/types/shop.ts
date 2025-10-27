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


export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";

export interface GetShopOverviewResponse {
  success: boolean;
  message: string;
  data: {
    shop: {
      id: number;
      name: string;
      address: string | null;
      ownerId: number;
      createdAt: string;
      updatedAt: string;
    };
    totalBookings: number;
    activeServices: number;
    teamMembers: number;
    monthlyRevenue: number;
    recentBookings: {
      id: number;
      clientName: string;
      serviceName: string;
      staffName: string;
      date: string;
      status: BookingStatus;
    }[];
  };
}


///
export interface ShopTeamMember {
  id: number;        // user id
  name: string;
  email: string;
  role: Role;        // "OWNER" | "MANAGER" | "STAFF"
  active: boolean;
  joinedAt: string;  // ISO
}

export interface GetShopTeamResponse {
  shop: Pick<ShopDTO, "id" | "name" | "ownerId">;
  totalMembers: number;
  activeMembers: number;
  members: ShopTeamMember[];
}
