import { apiFetch } from "./api";

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginResponse = {
  name: string;
  email: string;
  access_token: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
};

export async function login(payload: LoginPayload) {
  return apiFetch<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function register(payload: RegisterPayload) {
  return apiFetch("/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMe() {
  return apiFetch<User>("/me", {
    method: "GET",
  });
}

export async function logout() {
  return apiFetch<void>("/logout", {
    method: "POST",
  });
}