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

export async function listLeases(): Promise<Lease[]> {
  const data = await apiFetch<ListLeasesResponse>("/leases");
  return Array.isArray(data?.leases) ? data.leases : [];
}
