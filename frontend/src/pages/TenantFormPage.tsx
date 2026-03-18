import { useState } from "react";
import { maskPhone, maskCPF, unmask } from "@/lib/mask";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { createTenant } from "@/services/tenant";
import { toast } from "@/components/ui/sonner";

export default function TenantFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", document: "" });
  const [loading, setLoading] = useState(false);
  const update = (field: string, value: string) => {
    if (field === "phone") {
      setForm((f) => ({ ...f, [field]: maskPhone(value) }));
    } else if (field === "document") {
      setForm((f) => ({ ...f, [field]: maskCPF(value) }));
    } else {
      setForm((f) => ({ ...f, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      ...form,
      phone: unmask(form.phone),
      document: unmask(form.document),
    };
    try {
      await createTenant(data);
      toast.success("Inquilino cadastrado com sucesso!");
      navigate("/inquilinos");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao cadastrar inquilino.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "border-none bg-muted ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary";
  const labelClass = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

  return (
    <AppLayout>
      <div className="max-w-5xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <PageHeader title="Novo Inquilino" />
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg bg-card p-6 shadow-card border-l-4 border-orange-500" style={{ borderLeftWidth: '6px', borderColor: '#fb923c' }}>
          {[
            { id: "name", label: "Nome", placeholder: "Nome completo", field: "name" },
            { id: "email", label: "E-mail", placeholder: "email@exemplo.com", field: "email" },
            { id: "phone", label: "Telefone", placeholder: "(00) 00000-0000", field: "phone" },
            { id: "document", label: "Documento (CPF)", placeholder: "000.000.000-00", field: "document" },
          ].map((input) => (
            <div key={input.id} className="space-y-2">
              <Label className={labelClass}>{input.label}</Label>
              <Input
                value={form[input.field as keyof typeof form]}
                onChange={(e) => update(input.field, e.target.value)}
                className={inputClass}
                placeholder={input.placeholder}
                required
              />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90" disabled={loading}>
              {loading ? "Cadastrando..." : "Salvar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="border-border text-foreground hover:bg-muted">Cancelar</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
