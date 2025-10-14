import type { AuthResponse } from "../types/auth";

const API_BASE = import.meta.env.VITE_API_URL as string;

export function loginRequest(email: string, password: string): Promise<AuthResponse> {
  return fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(`Login failed: ${res.status} - ${text}`);
        });
      }
      return res.json() as Promise<AuthResponse>;
    })
    .catch((err) => {
      console.error("Login API error:", err);
      throw err;
    });
}

export function registerRequest(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    subscription: string
  ): Promise<AuthResponse> {
    return fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword, subscription }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(`Register failed: ${res.status} - ${text}`);
          });
        }
        return res.json() as Promise<AuthResponse>;
      })
      .catch((err) => {
        console.error("Register API error:", err);
        throw err;
      });
  }