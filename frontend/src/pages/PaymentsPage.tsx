import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { listPayments, payPayment, Payment } from "@/services/payment";

const allStatuses: StatusType[] = ["pendente", "pago", "atrasado"];

type FeedbackModal = {
  open: boolean;
  title: string;
  description: string;
};

export default function PaymentsPage() {
  const [filter, setFilter] = useState<StatusType | "todos">("todos");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [feedbackModal, setFeedbackModal] = useState<FeedbackModal>({
    open: false,
    title: "",
    description: "",
  });

  const perPage = 10;

  useEffect(() => {
    setLoading(true);

    listPayments()
      .then((data) => {
        setPayments(data);
        setError(null);
      })
      .catch((err: any) => {
        setError(err.message || "Erro ao carregar pagamentos.");
      })
      .finally(() => setLoading(false));
  }, []);

  const openModal = (title: string, description: string) => {
    setFeedbackModal({
      open: true,
      title,
      description,
    });
  };

  const handleMarkAsPaid = async (id: string) => {
    setPayingId(id);

    try {
      await payPayment(id);

      setPayments((prev) =>
        prev.map((payment) =>
          payment.id === id
            ? {
                ...payment,
                status: "pago",
                paidAt: new Date().toISOString(),
              }
            : payment
        )
      );

      openModal(
        "Pagamento atualizado",
        "O pagamento foi marcado como pago com sucesso."
      );
    } catch (err: any) {
      openModal(
        "Erro ao atualizar pagamento",
        err.message || "Não foi possível marcar o pagamento como pago."
      );
    } finally {
      setPayingId(null);
    }
  };

  const filtered = useMemo(() => {
    return filter === "todos"
      ? payments
      : payments.filter((payment) => payment.status === filter);
  }, [filter, payments]);

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

        {allStatuses.map((status) => (
          <Button
            key={status}
            variant="outline"
            size="sm"
            onClick={() => setFilter(status)}
            className={
              filter === status
                ? "border-primary bg-accent text-accent-foreground"
                : "border-border text-foreground hover:bg-muted"
            }
          >
            <StatusBadge status={status} />
          </Button>
        ))}
      </div>

      <div
        className="mt-6 overflow-hidden rounded-lg bg-card shadow-card border-l-4 border-orange-500"
        style={{ borderLeftWidth: "6px", borderColor: "#fb923c" }}
      >
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Carregando pagamentos...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-destructive">{error}</div>
        ) : (
          <>
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-b bg-muted/50">
                    <TableHead>Imóvel</TableHead>
                    <TableHead>Inquilino</TableHead>
                    <TableHead>Ref.</TableHead>
                    <TableHead>Vencimento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginatedPayments.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center text-muted-foreground"
                      >
                        Nenhum pagamento encontrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedPayments.map((payment) => (
                      <TableRow
                        key={payment.id}
                        className="transition-colors hover:bg-muted/30"
                      >
                        <TableCell className="font-medium text-foreground">
                          {payment.property}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {payment.tenant}
                        </TableCell>
                        <TableCell className="text-muted-foreground tabular-nums">
                          {payment.ref}
                        </TableCell>
                        <TableCell className="text-muted-foreground tabular-nums">
                          {payment.due}
                        </TableCell>
                        <TableCell className="font-medium text-foreground tabular-nums">
                          {payment.value}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={payment.status} />
                        </TableCell>
                        <TableCell>
                          {payment.status !== "pago" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-muted-foreground hover:text-status-paid-text"
                              onClick={() => handleMarkAsPaid(payment.id)}
                              disabled={payingId === payment.id}
                            >
                              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                              {payingId === payment.id
                                ? "Salvando..."
                                : "Marcar como pago"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-2 p-4 md:hidden">
              {paginatedPayments.length === 0 ? (
                <div className="rounded-lg bg-background p-6 text-center text-sm text-muted-foreground">
                  Nenhum pagamento encontrado.
                </div>
              ) : (
                paginatedPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-lg bg-background p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {payment.property}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.tenant} · {payment.ref}
                        </p>
                      </div>
                      <StatusBadge status={payment.status} />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs tabular-nums text-muted-foreground">
                        Vence {payment.due}
                      </p>
                      <p className="text-sm font-semibold tabular-nums text-foreground">
                        {payment.value}
                      </p>
                    </div>

                    {payment.status !== "pago" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full text-muted-foreground hover:text-status-paid-text"
                        onClick={() => handleMarkAsPaid(payment.id)}
                        disabled={payingId === payment.id}
                      >
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                        {payingId === payment.id
                          ? "Salvando..."
                          : "Marcar como pago"}
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
          </>
        )}
      </div>

      <Dialog
        open={feedbackModal.open}
        onOpenChange={(open) =>
          setFeedbackModal((prev) => ({ ...prev, open }))
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{feedbackModal.title}</DialogTitle>
            <DialogDescription>
              {feedbackModal.description}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              onClick={() =>
                setFeedbackModal((prev) => ({ ...prev, open: false }))
              }
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}