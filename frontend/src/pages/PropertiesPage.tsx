import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
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
import { listProperties, deleteProperty, Property } from "@/services/property";

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    setLoading(true);
    listProperties()
      .then((data) => {
        setProperties(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Erro ao carregar imóveis.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este imóvel?")) return;
    setDeletingId(id);
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      alert(err.message || "Erro ao excluir imóvel.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = properties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.city?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <AppLayout>
      <PageHeader title="Imóveis">
        <Link to="/imoveis/novo">
          <Button className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Imóvel
          </Button>
        </Link>
      </PageHeader>

      <div className="mt-6">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar imóveis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none bg-muted pl-10 ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg bg-card shadow-card border-l-4 border-orange-500 pb-8" style={{ borderLeftWidth: '6px', borderColor: '#fb923c' }}>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Carregando imóveis...</div>
        ) : error ? (
          <div className="p-8 text-center text-destructive">{error}</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-b bg-muted/50">
                  <TableHead>Título</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">Nenhum imóvel encontrado.</TableCell>
                  </TableRow>
                )}
                {paginated.map((p) => (
                  <TableRow key={p.id} className="transition-colors hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">{p.title}</TableCell>
                    <TableCell className="text-muted-foreground">{p.city}</TableCell>
                    <TableCell className="text-muted-foreground">{p.state}</TableCell>
                    <TableCell><StatusBadge status={p.status as StatusType} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link to={`/imoveis/${p.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link to={`/imoveis/${p.id}/editar`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          aria-label="Excluir imóvel"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Espaço extra removido, padding agora no card */}
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
          </>
        )}
      </div>
    </AppLayout>
  );
}
