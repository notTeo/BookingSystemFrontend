import type { ShopDTO } from "./shop";

export const Roles = ["OWNER", "MANAGER", "STAFF", "NONE"] as const;

export const Subscriptions = ["MEMBER", "STARTER", "PRO"] as const;

export type Role = typeof Roles[number];
export type Subscription = typeof Subscriptions[number];

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  subscription?: "MEMBER" | "STARTER" | "PRO";
  active: boolean;
  shops: (ShopDTO & { role: Role })[]; // user’s memberships + role inside each
  createdAt?: string;
  updatedAt?: string;
}

export const SUBS = {
  MEMBER: ["MEMBER"] as const,
  STARTER: ["STARTER", "PRO"] as const,
  PRO: ["PRO"] as const,
  ALL: ["MEMBER", "STARTER", "PRO"] as const,
};

export type Item = {
  id: string;
  label: string;
  link?: string;
  roles?: readonly Role[];      // optional, used for shop-specific sections
  subs: readonly Subscription[]; // literal-safe (using as const)
  onClick?: any;
};

export type Group = {
  id: string;
  label: string;
  roles?: readonly Role[];
  subs: readonly Subscription[];
  children: Item[];
};
