import { apiFetch } from "./api";

export type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
};

export type CreateTenantPayload = {
  name: string;
  email: string;
  phone: string;
  document: string;
};

export async function listTenants(): Promise<Tenant[]> {
  return apiFetch<Tenant[]>("/tenants", { method: "GET" });
}

export async function createTenant(payload: CreateTenantPayload): Promise<Tenant> {
  return apiFetch<Tenant>("/tenant", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
