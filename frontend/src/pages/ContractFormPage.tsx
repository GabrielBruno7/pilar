import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createLease } from "@/services/lease";
import { listProperties, type Property } from "@/services/property";
import { listTenants, type Tenant } from "@/services/tenant";

type FormData = {
  property_id: string;
  tenant_id: string;
  due_day: string;
  start_date: string;
  end_date: string;
  rent_amount: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function ContractFormPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    property_id: "",
    tenant_id: "",
    due_day: "",
    start_date: "",
    end_date: "",
    rent_amount: "",
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        setError(null);

        const [propertiesData, tenantsData] = await Promise.all([
          listProperties(),
          listTenants(),
        ]);

        setProperties(propertiesData);
        setTenants(tenantsData);
      } catch (err: any) {
        const message =
          err?.message || "Erro ao carregar imóveis e inquilinos.";

        setError(message);
        toast.error(message);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const availableProperties = useMemo(() => {
    return properties.filter((property) => {
      const isActive =
        property.status === "ativo" || property.status === "active";
      return isActive && !property.hasActiveLease;
    });
  }, [properties]);

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!form.property_id) newErrors.property_id = "Imóvel é obrigatório";
    if (!form.tenant_id) newErrors.tenant_id = "Inquilino é obrigatório";
    if (!form.due_day.trim()) {
      newErrors.due_day = "Dia de vencimento é obrigatório";
    }
    if (!form.start_date) newErrors.start_date = "Data de início é obrigatória";
    if (!form.end_date) newErrors.end_date = "Data de fim é obrigatória";
    if (!form.rent_amount.trim()) {
      newErrors.rent_amount = "Valor do aluguel é obrigatório";
    }

    const dueDay = Number(form.due_day);
    if (form.due_day && (Number.isNaN(dueDay) || dueDay < 1 || dueDay > 31)) {
      newErrors.due_day = "Informe um dia entre 1 e 31";
    }

    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      newErrors.end_date = "A data final não pode ser menor que a data inicial";
    }

    const normalizedRent = form.rent_amount.replace(",", ".");
    const rentAmount = Number(normalizedRent);

    if (form.rent_amount && Number.isNaN(rentAmount)) {
      newErrors.rent_amount = "Informe um valor válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) {
      toast.error("Preencha os campos obrigatórios corretamente.");
      return;
    }

    setLoading(true);

    try {
      await createLease({
        property_id: form.property_id,
        tenant_id: form.tenant_id,
        start_date: form.start_date,
        end_date: form.end_date,
        rent_amount: Number(form.rent_amount.replace(",", ".")),
        due_day: Number(form.due_day),
      });

      toast.success("Contrato criado com sucesso!");
      navigate("/contratos");
    } catch (err: any) {
      const message = err?.message || "Erro ao criar contrato.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const labelClass =
    "text-xs font-medium uppercase tracking-wider text-muted-foreground";

  const getInputClass = (field: keyof FormData) =>
    `border-none bg-muted ring-1 ${
      errors[field]
        ? "ring-red-500 focus-visible:ring-red-500"
        : "ring-border focus-visible:ring-2 focus-visible:ring-primary"
    }`;

  const getSelectClass = (field: keyof FormData) =>
    `border-none bg-muted ring-1 ${
      errors[field]
        ? "ring-red-500 focus:ring-red-500"
        : "ring-border focus:ring-2 focus:ring-primary"
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

        <PageHeader title="Novo Contrato" />

        {error && (
          <div className="mb-4 mt-6 rounded bg-destructive/10 p-3 text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <div
            className="space-y-4 rounded-lg bg-card p-6 shadow-card border-l-4 border-orange-500"
            style={{ borderLeftWidth: "6px", borderColor: "#fb923c" }}
          >
            <div className="space-y-2">
              <Label className={labelClass}>Imóvel</Label>
              <Select
                value={form.property_id}
                onValueChange={(value) => update("property_id", value)}
                disabled={loading || loadingData || availableProperties.length === 0}
              >
                <SelectTrigger className={getSelectClass("property_id")}>
                  <SelectValue
                    placeholder={
                      loadingData
                        ? "Carregando imóveis..."
                        : availableProperties.length === 0
                        ? "Nenhum imóvel disponível"
                        : "Selecione um imóvel"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableProperties.map((property) => (
                    <SelectItem key={property.id} value={property.id}>
                      {property.title}
                      {property.city && property.state
                        ? ` - ${property.city}/${property.state}`
                        : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.property_id && (
                <p className="text-sm text-red-500">{errors.property_id}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className={labelClass}>Inquilino</Label>
              <Select
                value={form.tenant_id}
                onValueChange={(value) => update("tenant_id", value)}
                disabled={loading || loadingData}
              >
                <SelectTrigger className={getSelectClass("tenant_id")}>
                  <SelectValue
                    placeholder={
                      loadingData
                        ? "Carregando inquilinos..."
                        : "Selecione um inquilino"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tenant_id && (
                <p className="text-sm text-red-500">{errors.tenant_id}</p>
              )}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className={labelClass}>Dia Vencimento</Label>
                <Input
                  value={form.due_day}
                  onChange={(e) => update("due_day", e.target.value)}
                  className={getInputClass("due_day")}
                  placeholder="15"
                  type="number"
                  min="1"
                  max="31"
                  disabled={loading}
                />
                {errors.due_day && (
                  <p className="text-sm text-red-500">{errors.due_day}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={labelClass}>Data Início</Label>
                <Input
                  value={form.start_date}
                  onChange={(e) => update("start_date", e.target.value)}
                  className={getInputClass("start_date")}
                  type="date"
                  disabled={loading}
                />
                {errors.start_date && (
                  <p className="text-sm text-red-500">{errors.start_date}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={labelClass}>Data Fim</Label>
                <Input
                  value={form.end_date}
                  onChange={(e) => update("end_date", e.target.value)}
                  className={getInputClass("end_date")}
                  type="date"
                  disabled={loading}
                />
                {errors.end_date && (
                  <p className="text-sm text-red-500">{errors.end_date}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className={labelClass}>Valor do Aluguel</Label>
              <Input
                value={form.rent_amount}
                onChange={(e) => update("rent_amount", e.target.value)}
                className={getInputClass("rent_amount")}
                placeholder="1800,00"
                disabled={loading}
              />
              {errors.rent_amount && (
                <p className="text-sm text-red-500">{errors.rent_amount}</p>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                type="submit"
                className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                disabled={loading || loadingData || availableProperties.length === 0}
              >
                {loading ? "Salvando..." : "Salvar"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="border-border text-foreground hover:bg-muted"
                disabled={loading}
              >
                Cancelar
              </Button>
            </div>

            {!loadingData && availableProperties.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Não há imóveis disponíveis para criar um novo contrato.
              </p>
            )}
          </div>
        </form>
      </div>
    </AppLayout>
  );
}