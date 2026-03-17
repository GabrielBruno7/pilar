import { useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

const mockTenants = [
  { id: 1, name: "Maria Silva", email: "maria@email.com", phone: "(11) 99999-1234", document: "123.456.789-00" },
  { id: 2, name: "João Santos", email: "joao@email.com", phone: "(41) 98888-5678", document: "987.654.321-00" },
  { id: 3, name: "Ana Costa", email: "ana@email.com", phone: "(21) 97777-9012", document: "456.789.123-00" },
  { id: 4, name: "Carlos Oliveira", email: "carlos@email.com", phone: "(31) 96666-3456", document: "321.654.987-00" },
];

export default function TenantsPage() {
  const [search, setSearch] = useState("");

  const filtered = mockTenants.filter((t) =>
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

      <div className="mt-6 space-y-2">
        {filtered.map((t) => (
          <div key={t.id} className="flex flex-col gap-2 rounded-lg bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.email} · {t.phone}</p>
            </div>
            <p className="text-xs tabular-nums text-muted-foreground">{t.document}</p>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
