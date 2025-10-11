export const Roles = ["BUSINESS", "MANAGER", "STAFF"] as const;
export type Role = typeof Roles[number];

export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  bookable: boolean;
}
