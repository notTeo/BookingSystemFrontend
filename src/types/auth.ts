import type { UserDTO } from "./user"

export type AuthContextType = {
    user: UserDTO | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logout: () => void;
};

export interface AuthResponse {
  success: boolean;
  data: {
    message: string;
    result: {
      accessToken: string;
      refreshToken: string;
      user: UserDTO;
    };
  };
}