import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const allStatuses: StatusType[] = ["pendente", "pago", "atrasado"];

const mockPayments = [
  {
    id: 1,
    property: "Apt 301 - Ed. Solar",
    tenant: "Maria Silva",
    ref: "Mar/2026",
    due: "15/03/2026",
    value: "R$ 2.500,00",
    status: "pendente" as StatusType,
  },
  {
    id: 2,
    property: "Casa Rua das Flores",
    tenant: "João Santos",
    ref: "Mar/2026",
    due: "10/03/2026",
    value: "R$ 1.800,00",
    status: "atrasado" as StatusType,
  },
  {
    id: 3,
    property: "Apt 105 - Res. Park",
    tenant: "Ana Costa",
    ref: "Mar/2026",
    due: "20/03/2026",
    value: "R$ 3.200,00",
    status: "pendente" as StatusType,
  },
  {
    id: 4,
    property: "Apt 301 - Ed. Solar",
    tenant: "Maria Silva",
    ref: "Fev/2026",
    due: "15/02/2026",
    value: "R$ 2.500,00",
    status: "pago" as StatusType,
  },
  {
    id: 5,
    property: "Casa Rua das Flores",
    tenant: "João Santos",
    ref: "Fev/2026",
    due: "10/02/2026",
    value: "R$ 1.800,00",
    status: "pago" as StatusType,
  },
];

export default function PaymentsPage() {
  const [filter, setFilter] = useState<StatusType | "todos">("todos");
  const [page, setPage] = useState(1);

  const perPage = 10;

  const filtered = useMemo(() => {
    return filter === "todos"
      ? mockPayments
      : mockPayments.filter((p) => p.status === filter);
  }, [filter]);

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));

  const paginatedPayments = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filtered.slice(start, end);
  }, [filtered, page]);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [page, lastPage]);

  return (
    <AppLayout>
      <PageHeader title="Pagamentos" />

      <div className="mt-6 flex flex-wrap gap-2">
        <Button
          variant={filter === "todos" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("todos")}
          className={
            filter === "todos"
              ? "bg-primary text-primary-foreground"
              : "border-border text-foreground hover:bg-muted"
          }
        >
          Todos
        </Button>

        {allStatuses.map((s) => (
          <Button
            key={s}
            variant="outline"
            size="sm"
            onClick={() => setFilter(s)}
            className={
              filter === s
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border text-foreground hover:bg-muted"
            }
          >
            <StatusBadge status={s} />
          </Button>
        ))}
      </div>

      <div
        className="mt-6 overflow-hidden rounded-lg bg-card shadow-card border-l-4 border-orange-500"
        style={{ borderLeftWidth: "6px", borderColor: "#fb923c" }}
      >
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Imóvel
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Inquilino
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Ref.
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Vencimento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Valor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>

            <tbody>
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    Nenhum pagamento encontrado.
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b last:border-0 transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {p.property}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {p.tenant}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {p.ref}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {p.due}
                    </td>
                    <td className="px-4 py-3 tabular-nums font-medium text-foreground">
                      {p.value}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      {p.status !== "pago" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground hover:text-status-paid-text"
                        >
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                          Pagar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="space-y-2 p-4 md:hidden">
          {paginatedPayments.length === 0 ? (
            <div className="rounded-lg bg-background p-6 text-center text-sm text-muted-foreground">
              Nenhum pagamento encontrado.
            </div>
          ) : (
            paginatedPayments.map((p) => (
              <div key={p.id} className="rounded-lg bg-background p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {p.property}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.tenant} · {p.ref}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs tabular-nums text-muted-foreground">
                    Vence {p.due}
                  </p>
                  <p className="text-sm font-semibold tabular-nums text-foreground">
                    {p.value}
                  </p>
                </div>

                {p.status !== "pago" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full text-muted-foreground hover:text-status-paid-text"
                  >
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                    Marcar como Pago
                  </Button>
                )}
              </div>
            ))
          )}
        </div>

        {total > 0 && (
          <div className="flex items-center justify-between border-t px-4 py-4">
            <p className="text-sm text-muted-foreground">
              Página {page} de {lastPage}
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>

              <Button
                variant="outline"
                onClick={() => setPage((prev) => Math.min(lastPage, prev + 1))}
                disabled={page === lastPage}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}