import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { listTenants, Tenant } from "@/services/tenant";
import { toast } from "@/components/ui/sonner";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";


export default function TenantsPage() {
  const [search, setSearch] = useState("");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

      <div className="mt-6 overflow-hidden rounded-lg bg-card shadow-card">
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
            {!loading && !error && filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum inquilino encontrado.</TableCell>
              </TableRow>
            )}
            {!loading && !error && filtered.map((t) => (
              <TableRow key={t.id} className="transition-colors hover:bg-muted/30">
                <TableCell className="font-medium text-foreground">{t.name}</TableCell>
                <TableCell className="text-muted-foreground">{t.email}</TableCell>
                <TableCell className="text-muted-foreground">{t.phone}</TableCell>
                <TableCell className="tabular-nums text-muted-foreground">{t.document}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
