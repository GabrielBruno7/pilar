import { cn } from "@/lib/utils";

type StatusType = "ativo" | "pago" | "pendente" | "atrasado" | "encerrado";

const statusConfig: Record<StatusType, { label: string; classes: string }> = {
  ativo: {
    label: "Ativo",
    classes: "bg-status-active-bg text-status-active-text border-status-active-border",
  },
  pago: {
    label: "Pago",
    classes: "bg-status-paid-bg text-status-paid-text border-status-paid-border",
  },
  pendente: {
    label: "Pendente",
    classes: "bg-status-pending-bg text-status-pending-text border-status-pending-border",
  },
  atrasado: {
    label: "Atrasado",
    classes: "bg-status-overdue-bg text-status-overdue-text border-status-overdue-border",
  },
  encerrado: {
    label: "Encerrado",
    classes: "bg-status-closed-bg text-status-closed-text border-status-closed-border",
  },
};

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export type { StatusType };
