import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, XCircle } from "lucide-react";

const mockContracts = [
  { id: 1, property: "Apt 301 - Ed. Solar", tenant: "Maria Silva", start: "01/01/2025", end: "31/12/2025", dueDay: 15, rent: "R$ 2.500,00", status: "ativo" as StatusType },
  { id: 2, property: "Casa Rua das Flores", tenant: "João Santos", start: "01/03/2025", end: "28/02/2026", dueDay: 10, rent: "R$ 1.800,00", status: "ativo" as StatusType },
  { id: 3, property: "Sala 12 - Centro Emp.", tenant: "Carlos Oliveira", start: "01/06/2024", end: "31/05/2025", dueDay: 5, rent: "R$ 3.500,00", status: "encerrado" as StatusType },
  { id: 4, property: "Apt 105 - Res. Park", tenant: "Ana Costa", start: "01/02/2025", end: "31/01/2026", dueDay: 20, rent: "R$ 3.200,00", status: "ativo" as StatusType },
];

export default function ContractsPage() {
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

      {/* Desktop table */}
      <div className="mt-6 hidden overflow-hidden rounded-lg bg-card shadow-card md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Imóvel</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Inquilino</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Venc.</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Início</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Fim</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Aluguel</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {mockContracts.map((c) => (
              <tr key={c.id} className="border-b last:border-0 transition-colors hover:bg-muted/30">
                <td className="px-4 py-3 font-medium text-foreground">{c.property}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.tenant}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">Dia {c.dueDay}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">{c.start}</td>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">{c.end}</td>
                <td className="px-4 py-3 tabular-nums font-medium text-foreground">{c.rent}</td>
                <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                <td className="px-4 py-3">
                  {c.status === "ativo" && (
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                      <XCircle className="mr-1 h-3.5 w-3.5" />
                      Encerrar
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-6 space-y-2 md:hidden">
        {mockContracts.map((c) => (
          <div key={c.id} className="rounded-lg bg-card p-4 shadow-card">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{c.property}</p>
                <p className="text-xs text-muted-foreground">{c.tenant}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                <span className="tabular-nums">{c.start}</span> → <span className="tabular-nums">{c.end}</span>
              </div>
              <p className="text-sm font-semibold tabular-nums text-foreground">{c.rent}</p>
            </div>
            {c.status === "ativo" && (
              <Button variant="ghost" size="sm" className="mt-2 w-full text-muted-foreground hover:text-destructive">
                <XCircle className="mr-1 h-3.5 w-3.5" />
                Encerrar Contrato
              </Button>
            )}
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
