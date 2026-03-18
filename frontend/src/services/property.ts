import { apiFetch } from "./api";
import type { StatusType } from "@/components/StatusBadge";

export type Property = {
  id: string;
  title: string;
  description?: string;
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  area?: string;
  bedrooms?: number;
  parking?: number;
  status: StatusType;
};

export function mapPropertyStatus(status: string): StatusType {
  switch (status) {
    case 'active': return 'ativo';
    case 'deleted': return 'encerrado';
    default: return 'ativo';
  }
}

export type CreatePropertyPayload = {
  title: string;
  description?: string;
  cep?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  area?: string;
  bedrooms?: number;
  parking?: number;
};

export type UpdatePropertyPayload = Partial<CreatePropertyPayload>;

export async function listProperties(): Promise<Property[]> {
  const res = await apiFetch<{ properties: any[] }>("/properties", { method: "GET" });
  return res.properties.map((p) => ({
    ...p,
    id: String(p.id),
    status: mapPropertyStatus(p.status),
  }));
}

export async function getProperty(id: string): Promise<Property> {
  const res = await apiFetch<any>(`/property/${id}`, { method: "GET" });
  const p = res.property;
  return {
    id: String(p.id),
    title: p.title,
    description: p.description,
    cep: p.postal_code ?? p.cep,
    street: p.street,
    number: p.number,
    neighborhood: p.neighborhood,
    city: p.city,
    state: p.state,
    area: p.area,
    bedrooms: p.bedrooms,
    parking: p.parking,
    status: mapPropertyStatus(p.status ?? 'active'),
  };
}

export async function createProperty(payload: CreatePropertyPayload): Promise<Property> {
  const p = await apiFetch<any>("/property", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return {
    ...p,
    id: String(p.id),
    status: mapPropertyStatus(p.status),
  };
}

export async function updateProperty(id: string, payload: UpdatePropertyPayload): Promise<Property> {
  const p = await apiFetch<any>(`/property/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return {
    ...p,
    id: String(p.id),
    status: mapPropertyStatus(p.status),
  };
}

export async function deleteProperty(id: string): Promise<void> {
  await apiFetch(`/property/${id}`, { method: "DELETE" });
}

export type PaginatedProperties = {
  data: Property[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
};

export async function listPropertiesPaginated(page = 1, perPage = 10): Promise<PaginatedProperties> {
  const res = await apiFetch<any>(`/properties?page=${page}&per_page=${perPage}`);
  return {
    data: res.properties.map((p: any) => ({
      ...p,
      id: String(p.id),
      status: mapPropertyStatus(p.status),
    })),
    total: res.total ?? res.properties.length,
    per_page: res.per_page ?? perPage,
    current_page: res.current_page ?? page,
    last_page: res.last_page ?? 1,
  };
}
