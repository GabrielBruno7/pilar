import { apiFetch } from "./api";
import type { StatusType } from "@/components/StatusBadge";

export type PaymentApiItem = {
  id: string;
  status: string;
  leaseId: string;
  dueDate: string;
  paidAt: string | null;
  tenantName: string;
  propertyTitle: string;
  referenceMonth: string;
  expectedAmount: string;
};

export type Payment = {
  id: string;
  leaseId: string;
  property: string;
  tenant: string;
  ref: string;
  due: string;
  dueDateRaw: string;
  value: string;
  valueRaw: number;
  paidAt: string | null;
  status: StatusType;
};

function isOverdue(dateStr: string) {
  const today = new Date();
  const dueDate = new Date(`${dateStr}T00:00:00`);

  today.setHours(0, 0, 0, 0);
  return dueDate < today;
}

export function mapPaymentStatus(status: string, dueDate: string): StatusType {
  if (status === "paid") return "pago";
  if (status === "pending" && isOverdue(dueDate)) return "atrasado";
  return "pendente";
}

export function formatCurrency(value: string | number) {
  const numericValue = Number(value ?? 0);

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numericValue);
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

export async function listPayments(): Promise<Payment[]> {
  const res = await apiFetch<{ payments: PaymentApiItem[] }>("/lease-payments", {
    method: "GET",
  });

  return res.payments.map((payment) => ({
    id: String(payment.id),
    leaseId: String(payment.leaseId),
    property: payment.propertyTitle,
    tenant: payment.tenantName,
    ref: formatReferenceMonth(payment.referenceMonth),
    due: formatDate(payment.dueDate),
    dueDateRaw: payment.dueDate,
    value: formatCurrency(payment.expectedAmount),
    valueRaw: Number(payment.expectedAmount ?? 0),
    paidAt: payment.paidAt,
    status: mapPaymentStatus(payment.status, payment.dueDate),
  }));
}

export async function payPayment(id: string): Promise<void> {
  await apiFetch(`/lease-payments/${id}/pay`, {
    method: "PATCH",
  });
}
