import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge, StatusType } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Eye, Pencil, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";

const mockProperties = [
  { id: 1, title: "Apt 301 - Ed. Solar", city: "São Paulo", state: "SP", status: "ativo" as StatusType },
  { id: 2, title: "Casa Rua das Flores, 120", city: "Curitiba", state: "PR", status: "ativo" as StatusType },
  { id: 3, title: "Sala 12 - Centro Empresarial", city: "Belo Horizonte", state: "MG", status: "encerrado" as StatusType },
  { id: 4, title: "Apt 105 - Res. Park View", city: "Rio de Janeiro", state: "RJ", status: "ativo" as StatusType },
  { id: 5, title: "Sobrado Vila Mariana", city: "São Paulo", state: "SP", status: "ativo" as StatusType },
];

export default function PropertiesPage() {
  const [search, setSearch] = useState("");

  const filtered = mockProperties.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.city.toLowerCase().includes(search.toLowerCase())
  );

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

      <div className="mt-6 overflow-hidden rounded-lg bg-card shadow-card">
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
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">Nenhum imóvel encontrado.</TableCell>
              </TableRow>
            )}
            {filtered.map((p) => (
              <TableRow key={p.id} className="transition-colors hover:bg-muted/30">
                <TableCell className="font-medium text-foreground">{p.title}</TableCell>
                <TableCell className="text-muted-foreground">{p.city}</TableCell>
                <TableCell className="text-muted-foreground">{p.state}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
