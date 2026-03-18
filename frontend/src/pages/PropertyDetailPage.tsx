import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2, MapPin, Ruler, BedDouble, Car } from "lucide-react";
import { getProperty, deleteProperty, Property } from "@/services/property";


export default function PropertyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProperty(id)
      .then((data) => {
        setProperty(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Erro ao carregar imóvel.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!property) return;
    if (!window.confirm("Tem certeza que deseja excluir este imóvel?")) return;
    setDeleting(true);
    try {
      await deleteProperty(property.id);
      navigate("/imoveis");
    } catch (err: any) {
      alert(err.message || "Erro ao excluir imóvel.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-muted-foreground">Carregando imóvel...</div>
      </AppLayout>
    );
  }

  if (error || !property) {
    return (
      <AppLayout>
        <div className="p-8 text-center text-destructive">{error || "Imóvel não encontrado."}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Button variant="ghost" onClick={() => navigate("/imoveis")} className="mb-4 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground">{property.title}</h1>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {property.street}, {property.neighborhood} - {property.city}/{property.state}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border text-foreground hover:bg-muted" onClick={() => navigate(`/imoveis/${property.id}/editar`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="ghost"
            className="text-destructive hover:bg-destructive/10"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "Excluindo..." : "Excluir"}
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          { icon: <Ruler className="h-5 w-5" />, label: "Área", value: property.area != null ? `${property.area} m²` : "-" },
          { icon: <BedDouble className="h-5 w-5" />, label: "Quartos", value: property.bedrooms },
          { icon: <Car className="h-5 w-5" />, label: "Vagas", value: property.parking },
        ].map((info, idx) => (
          <div
            key={info.label}
            className="rounded-lg bg-card p-4 shadow-card border-l-4 border-r-2 border-orange-500 transition-transform transition-shadow duration-200 hover:scale-[1.03] hover:shadow-lg"
            style={{ borderLeftWidth: '6px', borderRightWidth: '2px', borderColor: '#fb923c' }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">{info.icon}<span className="text-xs font-medium uppercase tracking-wider">{info.label}</span></div>
            <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{info.value ?? "-"}</p>
          </div>
        ))}
      </div>

      <div
        className="mt-6 rounded-lg bg-card p-6 shadow-card border-l-4 border-r-2 border-orange-500 transition-transform transition-shadow duration-200 hover:scale-[1.03] hover:shadow-lg"
        style={{ borderLeftWidth: '6px', borderRightWidth: '2px', borderColor: '#fb923c' }}
      >
        <h2 className="text-sm font-semibold text-foreground">Descrição</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{property.description}</p>
      </div>

      <div
        className="mt-4 rounded-lg bg-card p-6 shadow-card border-l-4 border-r-2 border-orange-500 transition-transform transition-shadow duration-200 hover:scale-[1.03] hover:shadow-lg"
        style={{ borderLeftWidth: '6px', borderRightWidth: '2px', borderColor: '#fb923c' }}
      >
        <h2 className="text-sm font-semibold text-foreground">Endereço</h2>
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
          {[
            ["Rua", property.street],
            ["Bairro", property.neighborhood],
            ["Cidade", property.city],
            ["Estado", property.state],
            ["CEP", property.cep],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
              <p className="mt-0.5 text-foreground">{value ?? "-"}</p>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
