import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2,
  Home,
  DoorOpen,
  FileText,
  CheckCircle2,
  Wallet,
  ArrowRight,
  MapPin,
  Clock3,
  TrendingUp,
  Building,
} from "lucide-react";

import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/MetricCard";
import { StatusBadge } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  getDashboard,
  formatCurrency,
  formatDate,
  formatReferenceMonth,
  getPaymentStatus,
  getDaysLate,
  getDueLabel,
  getOccupancyRate,
  type DashboardResponse,
} from "@/services/dashboard";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

const orangeLeftBorderClass =
  "overflow-hidden rounded-lg bg-card shadow-card border-l-4 border-orange-500";

const orangeLeftBorderStyle = {
  borderLeftWidth: "6px",
  borderColor: "#fb923c",
} as const;

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    getDashboard()
      .then((data) => {
        setDashboard(data);
        setError(null);
      })
      .catch((err: any) => {
        if (
          err.message === "Sessão expirada. Faça login novamente." ||
          err.message === "Acesso negado. Faça login novamente."
        ) {
          return;
        }

        setError(err.message || "Erro ao carregar dashboard.");
      })
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(() => {
    if (!dashboard) return [];

    const { summary } = dashboard;

    return [
      {
        icon: <Building2 className="h-5 w-5" />,
        label: "Total de Imóveis",
        value: summary.total_properties,
      },
      {
        icon: <Home className="h-5 w-5" />,
        label: "Imóveis Ocupados",
        value: summary.occupied_properties,
      },
      {
        icon: <DoorOpen className="h-5 w-5" />,
        label: "Imóveis Vagos",
        value: summary.vacant_properties,
      },
      {
        icon: <FileText className="h-5 w-5" />,
        label: "Contratos Ativos",
        value: summary.active_leases,
      },
      {
        icon: <CheckCircle2 className="h-5 w-5" />,
        label: "Pagamentos Pagos",
        value: summary.paid_payments,
      },
      {
        icon: <Wallet className="h-5 w-5" />,
        label: "Pagamentos em Aberto",
        value: summary.pending_payments,
      },
    ];
  }, [dashboard]);

  const prioritizedPayments = useMemo(() => {
    if (!dashboard) return [];

    return [...dashboard.pending_payments_preview].sort((a, b) => {
      const aDaysLate = getDaysLate(a.due_date);
      const bDaysLate = getDaysLate(b.due_date);

      if (aDaysLate > 0 && bDaysLate === 0) return -1;
      if (aDaysLate === 0 && bDaysLate > 0) return 1;

      if (aDaysLate > 0 && bDaysLate > 0) return bDaysLate - aDaysLate;

      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    });
  }, [dashboard]);

  const occupancyRate = dashboard
    ? getOccupancyRate(
        dashboard.summary.occupied_properties,
        dashboard.summary.total_properties
      )
    : 0;

  return (
    <AppLayout>
      <PageHeader title="Dashboard" />

      {loading ? (
        <div
          className="mt-6 p-8 text-center text-muted-foreground rounded-lg bg-card shadow-card border-l-4 border-orange-500"
          style={{ borderLeftWidth: "6px", borderColor: "#fb923c" }}
        >
          Carregando dashboard...
        </div>
      ) : error ? (
        <div
          className="mt-6 p-8 text-center text-destructive rounded-lg bg-card shadow-card border-l-4 border-orange-500"
          style={{ borderLeftWidth: "6px", borderColor: "#fb923c" }}
        >
          {error}
        </div>
      ) : dashboard ? (
        <>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6"
          >
            {metrics.map((metric) => (
              <motion.div
                key={metric.label}
                variants={item}
                className={orangeLeftBorderClass}
                style={orangeLeftBorderStyle}
              >
                <MetricCard
                  icon={metric.icon}
                  label={metric.label}
                  value={metric.value}
                />
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-8 grid gap-6 xl:grid-cols-12">
            <div className="space-y-6 xl:col-span-4">
              <div className={orangeLeftBorderClass} style={orangeLeftBorderStyle}>
                <div className="p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">
                        Resumo operacional
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Taxa atual de ocupação dos imóveis
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Taxa de ocupação
                      </span>
                      <span className="text-2xl font-semibold text-foreground">
                        {occupancyRate}%
                      </span>
                    </div>

                    <div className="h-3 rounded-full bg-muted">
                      <div
                        className="h-3 rounded-full bg-primary transition-all"
                        style={{ width: `${occupancyRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={orangeLeftBorderClass} style={orangeLeftBorderStyle}>
                <div className="p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">
                        Imóveis recentes
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Últimos imóveis retornados pela API
                      </p>
                    </div>

                    <Link to="/imoveis">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Ver todos <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {dashboard.recent_properties.length === 0 ? (
                      <div className="rounded-lg bg-background p-4 text-sm text-muted-foreground">
                        Nenhum imóvel encontrado.
                      </div>
                    ) : (
                      dashboard.recent_properties.map((property) => (
                        <div
                          key={property.id}
                          className="flex items-start gap-3 rounded-lg bg-background p-4 transition-colors hover:bg-muted/20"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                            <Building className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {property.title}
                            </p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              {property.city} - {property.state}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="xl:col-span-8">
              <div className={orangeLeftBorderClass} style={orangeLeftBorderStyle}>
                <div className="p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-semibold text-foreground">
                        Cobranças prioritárias
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Atrasadas primeiro, depois as mais próximas do vencimento
                      </p>
                    </div>

                    <Link to="/pagamentos">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1 text-xs text-muted-foreground hover:text-foreground"
                      >
                        Ver todos <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-3">
                    {prioritizedPayments.length === 0 ? (
                      <div className="rounded-lg bg-background p-6 text-center text-sm text-muted-foreground">
                        Nenhuma cobrança pendente no momento.
                      </div>
                    ) : (
                      prioritizedPayments.map((payment) => {
                        const status = getPaymentStatus(payment.due_date);
                        const daysLate = getDaysLate(payment.due_date);

                        return (
                          <div
                            key={payment.id}
                            className="rounded-lg bg-background p-4 transition-colors hover:bg-muted/20"
                          >
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-sm font-semibold text-foreground">
                                    {payment.tenant_name}
                                  </p>
                                  <StatusBadge status={status} />
                                </div>

                                <p className="mt-1 text-sm text-foreground/80">
                                  {payment.property_title}
                                </p>

                                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                  <span>
                                    Referência{" "}
                                    {formatReferenceMonth(payment.reference_month)}
                                  </span>

                                  <span>Vence {formatDate(payment.due_date)}</span>

                                  <span
                                    className={
                                      status === "atrasado"
                                        ? "font-medium text-[hsl(var(--status-overdue-text))]"
                                        : "font-medium text-[hsl(var(--status-pending-text))]"
                                    }
                                  >
                                    {getDueLabel(payment.due_date)}
                                  </span>
                                </div>
                              </div>

                              <div className="shrink-0 md:min-w-[150px] md:text-right">
                                <p className="text-xl font-semibold tabular-nums text-foreground">
                                  {formatCurrency(payment.expected_amount)}
                                </p>

                                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground md:justify-end">
                                  <Clock3 className="h-3.5 w-3.5" />
                                  {daysLate > 0
                                    ? "Cobrança vencida"
                                    : "Aguardando vencimento"}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </AppLayout>
  );
}