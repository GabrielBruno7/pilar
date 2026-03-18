import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { listTenants, Tenant } from "@/services/tenant";
import { toast } from "@/components/ui/sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

export default function TenantsPage() {
  const [search, setSearch] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    setLoading(true);
    listTenants()
      .then(setTenants)
      .catch((err) => {
        setError("Erro ao carregar inquilinos.");
        toast.error(err instanceof Error ? err.message : "Erro ao carregar inquilinos.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = tenants.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase())
  );
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  function maskPhone(phone: string) {
    return phone
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4,5})(\d{4})$/, "$1-$2");
  }

  function maskDocument(doc: string) {
    const clean = doc.replace(/\D/g, "");
    if (clean.length <= 11) {
      return clean.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      return clean.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
    }
  }

  return (
    <AppLayout>
      <PageHeader title="Inquilinos">
        <Link to="/inquilinos/novo">
          <Button className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Inquilino
          </Button>
        </Link>
      </PageHeader>

      <div className="mt-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar inquilinos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none bg-muted pl-10 ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg bg-card shadow-card border-l-4 border-orange-500 pb-8" style={{ borderLeftWidth: '6px', borderColor: '#fb923c' }}>
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/50">
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Documento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">Carregando...</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-destructive">{error}</TableCell>
              </TableRow>
            )}
            {!loading && !error && paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum inquilino encontrado.</TableCell>
              </TableRow>
            )}
            {!loading && !error && paginated.map((t) => (
              <TableRow key={t.id} className="transition-colors">
                <TableCell className="font-medium text-foreground">{t.name}</TableCell>
                <TableCell className="text-muted-foreground">{t.email}</TableCell>
                <TableCell className="text-muted-foreground">{maskPhone(t.phone)}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">{maskDocument(t.document)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) setPage(page - 1);
              }}
              aria-disabled={page === 1}
            />
          </PaginationItem>
          {Array.from({ length: lastPage }, (_, i) => (
            <PaginationItem key={i + 1}>
              <PaginationLink
                href="#"
                isActive={page === i + 1}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(i + 1);
                }}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (page < lastPage) setPage(page + 1);
              }}
              aria-disabled={page === lastPage}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
    </AppLayout>
  );
}
