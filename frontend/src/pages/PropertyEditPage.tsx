import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { getProperty, updateProperty } from "@/services/property";
import { PageHeader } from "@/components/PageHeader";

type FormData = {
  title: string;
  description: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  area: string;
  bedrooms: string;
  parking: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function PropertyEditPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    area: "",
    bedrooms: "",
    parking: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProperty(id)
      .then((data) => {
        setForm({
          title: data.title || "",
          description: data.description || "",
          cep: data.cep || "",
          street: data.street || "",
          number: data.number || "",
          neighborhood: data.neighborhood || "",
          city: data.city || "",
          state: data.state || "",
          area: data.area ? String(data.area) : "",
          bedrooms: data.bedrooms ? String(data.bedrooms) : "",
          parking: data.parking ? String(data.parking) : "",
        });
        setError(null);
      })
      .catch((err) => {
        setError(err.message || "Erro ao carregar imóvel.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep1 = () => {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = "Título é obrigatório";
    if (!form.description.trim()) newErrors.description = "Descrição é obrigatória";
    if (!form.area.trim()) newErrors.area = "Área é obrigatória";
    if (!form.bedrooms.trim()) newErrors.bedrooms = "Quartos é obrigatório";
    if (!form.parking.trim()) newErrors.parking = "Vagas é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: FormErrors = {};
    if (!form.cep.trim()) newErrors.cep = "CEP é obrigatório";
    if (!form.street.trim()) newErrors.street = "Rua é obrigatória";
    if (!form.number.trim()) newErrors.number = "Número é obrigatório";
    if (!form.neighborhood.trim()) newErrors.neighborhood = "Bairro é obrigatório";
    if (!form.city.trim()) newErrors.city = "Cidade é obrigatório";
    if (!form.state.trim()) newErrors.state = "Estado é obrigatório";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goToStep2 = () => {
    setError(null);
    if (!validateStep1()) return;
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateStep2()) return;
    if (!id) return;
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        postal_code: form.cep,
        street: form.street,
        number: form.number,
        neighborhood: form.neighborhood,
        city: form.city,
        state: form.state,
        area: form.area ? Number(form.area) : undefined,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
        parking: form.parking ? Number(form.parking) : undefined,
      };
      await updateProperty(id, payload);
      navigate(`/imoveis/${id}`);
    } catch (err: any) {
      setError(err?.message || "Erro ao atualizar imóvel.");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "text-xs font-medium uppercase tracking-wider text-muted-foreground";
  const getInputClass = (field: keyof FormData) =>
    `border-none bg-muted ring-1 ${
      errors[field]
        ? "ring-red-500 focus-visible:ring-red-500"
        : "ring-border focus-visible:ring-2 focus-visible:ring-primary"
    }`;
  const getTextareaClass = (field: keyof FormData) =>
    `min-h-[80px] border-none bg-muted ring-1 ${
      errors[field]
        ? "ring-red-500 focus-visible:ring-red-500"
        : "ring-border focus-visible:ring-2 focus-visible:ring-primary"
    }`;

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <PageHeader title="Editar Imóvel" />

        <div className="mb-6 mt-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                  step === 1
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-muted text-muted-foreground"
                }`}
              >
                1
              </div>
              <span
                className={`text-sm ${
                  step === 1
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Informações
              </span>
            </div>
            <div className="h-px w-12 bg-border" />
            <div className="flex items-center gap-3">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                  step === 2
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span
                className={`text-sm ${
                  step === 2
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                Endereço
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded bg-destructive/10 p-3 text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          {step === 1 && (
            <div className="space-y-4 rounded-lg bg-card p-6 shadow-card">
              <h2 className="text-sm font-semibold text-foreground">
                Informações
              </h2>
              <div className="space-y-2">
                <Label className={labelClass}>Título</Label>
                <Input
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                  className={getInputClass("title")}
                  placeholder="Ex: Apt 301 - Ed. Solar"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className={labelClass}>Descrição</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  className={getTextareaClass("description")}
                  placeholder="Descreva o imóvel..."
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className={labelClass}>Área (m²)</Label>
                  <Input
                    value={form.area}
                    onChange={(e) => update("area", e.target.value)}
                    className={getInputClass("area")}
                    placeholder="Ex: 80"
                    type="number"
                    min="0"
                  />
                  {errors.area && (
                    <p className="text-sm text-red-500">{errors.area}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className={labelClass}>Quartos</Label>
                  <Input
                    value={form.bedrooms}
                    onChange={(e) => update("bedrooms", e.target.value)}
                    className={getInputClass("bedrooms")}
                    placeholder="Ex: 2"
                    type="number"
                    min="0"
                  />
                  {errors.bedrooms && (
                    <p className="text-sm text-red-500">{errors.bedrooms}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className={labelClass}>Vagas</Label>
                  <Input
                    value={form.parking}
                    onChange={(e) => update("parking", e.target.value)}
                    className={getInputClass("parking")}
                    placeholder="Ex: 1"
                    type="number"
                    min="0"
                  />
                  {errors.parking && (
                    <p className="text-sm text-red-500">{errors.parking}</p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button
                  type="button"
                  className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  onClick={goToStep2}
                >
                  Próximo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4 rounded-lg bg-card p-6 shadow-card">
              <h2 className="text-sm font-semibold text-foreground">
                Endereço
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className={labelClass}>CEP</Label>
                  <Input
                    value={form.cep}
                    onChange={(e) => update("cep", e.target.value)}
                    className={getInputClass("cep")}
                    placeholder="00000-000"
                  />
                  {errors.cep && (
                    <p className="text-sm text-red-500">{errors.cep}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className={labelClass}>Número</Label>
                  <Input
                    value={form.number}
                    onChange={(e) => update("number", e.target.value)}
                    className={getInputClass("number")}
                    placeholder="123"
                  />
                  {errors.number && (
                    <p className="text-sm text-red-500">{errors.number}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className={labelClass}>Rua</Label>
                <Input
                  value={form.street}
                  onChange={(e) => update("street", e.target.value)}
                  className={getInputClass("street")}
                  placeholder="Nome da rua"
                />
                {errors.street && (
                  <p className="text-sm text-red-500">{errors.street}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className={labelClass}>Bairro</Label>
                <Input
                  value={form.neighborhood}
                  onChange={(e) => update("neighborhood", e.target.value)}
                  className={getInputClass("neighborhood")}
                  placeholder="Nome do bairro"
                />
                {errors.neighborhood && (
                  <p className="text-sm text-red-500">{errors.neighborhood}</p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className={labelClass}>Cidade</Label>
                  <Input
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    className={getInputClass("city")}
                    placeholder="Cidade"
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className={labelClass}>Estado</Label>
                  <Input
                    value={form.state}
                    onChange={(e) => update("state", e.target.value)}
                    className={getInputClass("state")}
                    placeholder="UF"
                  />
                  {errors.state && (
                    <p className="text-sm text-red-500">{errors.state}</p>
                  )}
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-border text-foreground hover:bg-muted"
                >
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </AppLayout>
  );
}
