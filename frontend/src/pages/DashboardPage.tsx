import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import {
  Building2,
  Home,
  DoorOpen,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Send,
  CalendarClock,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const metrics = [
  { icon: <Building2 className="h-5 w-5" />, label: "Total de Imóveis", value: 24 },
  { icon: <Home className="h-5 w-5" />, label: "Imóveis Ocupados", value: 18 },
  { icon: <DoorOpen className="h-5 w-5" />, label: "Imóveis Vagos", value: 6 },
  { icon: <FileText className="h-5 w-5" />, label: "Contratos Ativos", value: 18 },
  { icon: <CheckCircle2 className="h-5 w-5" />, label: "Pagamentos em Dia", value: 42 },
  { icon: <AlertTriangle className="h-5 w-5" />, label: "Pagamentos Atrasados", value: 7 },
];

const attentionItems = [
  { id: 1, title: "Apt 204 - Ed. Bela Vista", type: "vacancy" as const, detail: "Vago há 32 dias", city: "São Paulo" },
  { id: 2, title: "Sala 08 - Centro Emp.", type: "contract" as const, detail: "Contrato vence em 15 dias", city: "Belo Horizonte" },
  { id: 3, title: "Casa Rua das Palmeiras", type: "vacancy" as const, detail: "Vago há 18 dias", city: "Curitiba" },
  { id: 4, title: "Apt 502 - Res. Park", type: "contract" as const, detail: "Contrato vence em 28 dias", city: "Rio de Janeiro" },
];

const priorityPayments = [
  { id: 1, tenant: "João Santos", property: "Casa Flores", value: "R$ 1.800,00", due: "05/03/2026", daysLate: 10, status: "atrasado" as const },
  { id: 2, tenant: "Carlos Lima", property: "Apt 204", value: "R$ 2.100,00", due: "08/03/2026", daysLate: 7, status: "atrasado" as const },
  { id: 3, tenant: "Maria Silva", property: "Apt 301", value: "R$ 2.500,00", due: "15/03/2026", daysLate: 0, status: "pendente" as const },
  { id: 4, tenant: "Ana Costa", property: "Apt 105", value: "R$ 3.200,00", due: "18/03/2026", daysLate: 0, status: "pendente" as const },
  { id: 5, tenant: "Pedro Alves", property: "Sala 12", value: "R$ 1.950,00", due: "20/03/2026", daysLate: 0, status: "pendente" as const },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } } };

function getDueLabel(daysLate: number): string {
  if (daysLate > 0) return `${daysLate} dias em atraso`;
  return "Vence em breve";
}

export default function DashboardPage() {
  return (
    <AppLayout>
      <PageHeader title="Dashboard" />

      {/* Metric cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6"
      >
        {metrics.map((m) => (
          <motion.div key={m.label} variants={item}>
            <MetricCard icon={m.icon} label={m.label} value={m.value} />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-8 grid gap-6 lg:grid-cols-7">
        {/* Left: Imóveis que precisam de atenção */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Imóveis que precisam de atenção</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs gap-1">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-2">
            {attentionItems.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  p.type === "vacancy" ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  {p.type === "vacancy" ? (
                    <DoorOpen className="h-5 w-5" />
                  ) : (
                    <CalendarClock className="h-5 w-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.city}</p>
                </div>
                <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
                  p.type === "vacancy"
                    ? "bg-[hsl(var(--status-pending-bg))] text-[hsl(var(--status-pending-text))]"
                    : "bg-[hsl(var(--status-closed-bg))] text-[hsl(var(--status-closed-text))]"
                }`}>
                  {p.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pagamentos prioritários */}
        <div className="lg:col-span-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-foreground">Cobranças prioritárias</h2>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs gap-1">
              Ver todos <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="space-y-2">
            {priorityPayments.map((p) => (
              <div
                key={p.id}
                className="rounded-lg bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover"
              >
                <div className="flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{p.tenant}</p>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {p.property} · Vence {p.due}
                      {p.daysLate > 0 && (
                        <span className="ml-1.5 font-medium text-[hsl(var(--status-overdue-text))]">
                          · {getDueLabel(p.daysLate)}
                        </span>
                      )}
                      {p.daysLate === 0 && (
                        <span className="ml-1.5 font-medium text-[hsl(var(--status-pending-text))]">
                          · {getDueLabel(p.daysLate)}
                        </span>
                      )}
                    </p>
                  </div>
                  <p className="text-lg font-semibold tabular-nums text-foreground shrink-0">{p.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
