import { apiFetch } from "./api";

export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  propertyTitle: string;
  tenantName: string;
  startDate: string;
  endDate: string | null;
  rentAmount: string;
  dueDay: number;
  status: string;
}

interface ListLeasesResponse {
  leases: Lease[];
}

export interface CreateLeasePayload {
  property_id: string;
  tenant_id: string;
  start_date: string;
  end_date: string;
  rent_amount: number;
  due_day: number;
}

export async function listLeases(): Promise<Lease[]> {
  const data = await apiFetch<ListLeasesResponse>("/leases");
  return Array.isArray(data?.leases) ? data.leases : [];
}

export async function createLease(payload: CreateLeasePayload) {
  return apiFetch("/lease", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}