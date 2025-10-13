export const Roles = ["BUSINESS", "MANAGER", "STAFF"] as const;
export type Role = typeof Roles[number];

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  bookable: boolean;
  shops?: { id: number; name: string }[];
}

export type Item = {
  id: string;
  label: string;
  link?: string;        
  roles: readonly Role[];
  isLabel?: boolean;   
};

export type Group = {
  id: string;
  label: string;
  roles: readonly Role[];
  children: Item[];
};
