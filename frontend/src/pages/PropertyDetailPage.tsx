import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2, MapPin, Ruler, BedDouble, Car } from "lucide-react";

const mockProperty = {
  id: 1,
  title: "Apt 301 - Ed. Solar",
  description: "Apartamento amplo com 3 quartos, 2 banheiros, sala de estar e cozinha americana. Localizado no 3º andar com vista para o jardim interno.",
  status: "ativo" as const,
  street: "Rua Augusta, 1200",
  neighborhood: "Consolação",
  city: "São Paulo",
  state: "SP",
  cep: "01304-001",
  area: "85m²",
  bedrooms: 3,
  parking: 1,
};

export default function PropertyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <AppLayout>
      <Button variant="ghost" onClick={() => navigate("/imoveis")} className="mb-4 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">{mockProperty.title}</h1>
            <StatusBadge status={mockProperty.status} />
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {mockProperty.street}, {mockProperty.neighborhood} - {mockProperty.city}/{mockProperty.state}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border text-foreground hover:bg-muted" onClick={() => navigate(`/imoveis/${id}/editar`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button variant="ghost" className="text-destructive hover:bg-destructive/10">
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { icon: <Ruler className="h-5 w-5" />, label: "Área", value: mockProperty.area },
          { icon: <BedDouble className="h-5 w-5" />, label: "Quartos", value: mockProperty.bedrooms },
          { icon: <Car className="h-5 w-5" />, label: "Vagas", value: mockProperty.parking },
        ].map((info) => (
          <div key={info.label} className="rounded-lg bg-card p-4 shadow-card">
            <div className="flex items-center gap-2 text-muted-foreground">{info.icon}<span className="text-xs font-medium uppercase tracking-wider">{info.label}</span></div>
            <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{info.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-card p-6 shadow-card">
        <h2 className="text-sm font-semibold text-foreground">Descrição</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{mockProperty.description}</p>
      </div>

      <div className="mt-4 rounded-lg bg-card p-6 shadow-card">
        <h2 className="text-sm font-semibold text-foreground">Endereço</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
          {[
            ["Rua", mockProperty.street],
            ["Bairro", mockProperty.neighborhood],
            ["Cidade", mockProperty.city],
            ["Estado", mockProperty.state],
            ["CEP", mockProperty.cep],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="mt-0.5 text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
