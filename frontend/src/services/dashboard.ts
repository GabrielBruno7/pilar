import { apiFetch } from "./api";

export type DashboardSummary = {
  active_leases: number;
  paid_payments: number;
  total_properties: number;
  pending_payments: number;
  vacant_properties: number;
  occupied_properties: number;
};

export type DashboardRecentProperty = {
  id: string;
  title: string;
  city: string;
  state: string;
  status: string;
};

export type DashboardPendingPayment = {
  id: string;
  status: string;
  reference_month: string;
  due_date: string;
  expected_amount: number;
  property_id: string;
  property_title: string;
  property_city: string;
  property_state: string;
  tenant_id: string;
  tenant_name: string;
};

export type DashboardResponse = {
  summary: DashboardSummary;
  recent_properties: DashboardRecentProperty[];
  pending_payments_preview: DashboardPendingPayment[];
};

export async function getDashboard(): Promise<DashboardResponse> {
  return apiFetch<DashboardResponse>("/dashboard", {
    method: "GET",
  });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value ?? 0));
}

export function formatDate(date: string) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("pt-BR").format(
    new Date(`${date}T00:00:00`)
  );
}

export function formatReferenceMonth(referenceMonth: string) {
  if (!referenceMonth) return "-";

  const [year, month] = referenceMonth.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);

  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric",
  })
    .format(date)
    .replace(".", "")
    .replace(/^./, (char) => char.toUpperCase());
}

export function getPaymentStatus(
  dueDate: string
): "atrasado" | "pendente" {
  const today = new Date();
  const due = new Date(`${dueDate}T00:00:00`);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return due < today ? "atrasado" : "pendente";
}

export function getDaysLate(dueDate: string) {
  const today = new Date();
  const due = new Date(`${dueDate}T00:00:00`);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diff = today.getTime() - due.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return days > 0 ? days : 0;
}

export function getDaysUntilDue(dueDate: string) {
  const today = new Date();
  const due = new Date(`${dueDate}T00:00:00`);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diff = due.getTime() - today.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return days >= 0 ? days : 0;
}

export function getOccupancyRate(occupied: number, total: number) {
  if (!total) return 0;
  return Math.round((occupied / total) * 100);
}

export function getDueLabel(dueDate: string) {
  const daysLate = getDaysLate(dueDate);

  if (daysLate > 0) {
    return `${daysLate} dia${daysLate > 1 ? "s" : ""} em atraso`;
  }

  const daysUntilDue = getDaysUntilDue(dueDate);

  if (daysUntilDue === 0) return "Vence hoje";
  if (daysUntilDue === 1) return "Vence amanhã";
  return `Vence em ${daysUntilDue} dias`;
}