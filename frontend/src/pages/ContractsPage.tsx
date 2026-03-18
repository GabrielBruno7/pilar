import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { listLeases, type Lease } from "@/services/lease";

function formatCurrency(value: string | number) {
  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    return "R$ 0,00";
  }

  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value: string | null) {
  if (!value) return "-";

  const parts = value.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  return value;
}

function formatStatus(status: string) {
  if (status === "active") return "Ativo";
  if (status === "ended") return "Encerrado";
  return status;
}

export default function ContractsPage() {
  const [leases, setLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 10;

  useEffect(() => {
    async function fetchLeases() {
      try {
        setLoading(true);
        setError("");

        const data = await listLeases();
        setLeases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erro ao carregar contratos:", err);
        setError("Erro ao carregar contratos.");
        setLeases([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLeases();
  }, []);

  const total = leases.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));

  const paginatedLeases = useMemo(() => {
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return leases.slice(start, end);
  }, [leases, page]);

  useEffect(() => {
    if (page > lastPage) {
      setPage(lastPage);
    }
  }, [page, lastPage]);

  return (
    <AppLayout>
      <PageHeader title="Contratos">
        <Link to="/contratos/novo">
          <Button className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Contrato
          </Button>
        </Link>
      </PageHeader>

      <div
        className="mt-6 overflow-hidden rounded-lg border bg-card shadow-sm"
        style={{ borderLeft: "6px solid #fb923c" }}
      >
        <div className="overflow-x-auto">
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
                  Início
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Fim
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Valor
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Vencimento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Carregando...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-destructive">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && paginatedLeases.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum contrato encontrado.
                  </td>
                </tr>
              )}

              {!loading &&
                !error &&
                paginatedLeases.map((lease) => (
                  <tr key={lease.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-4 font-medium text-foreground">
                      {lease.propertyTitle}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {lease.tenantName}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {formatDate(lease.startDate)}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {formatDate(lease.endDate)}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {formatCurrency(lease.rentAmount)}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      Dia {lease.dueDay}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                          lease.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {formatStatus(lease.status)}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!loading && !error && total > 0 && (
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
