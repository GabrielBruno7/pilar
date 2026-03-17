import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";

export default function PropertyFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", description: "", cep: "", street: "", number: "", neighborhood: "", city: "", state: "",
  });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/imoveis");
  };

  const inputClass = "border-none bg-muted ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary";
  const labelClass = "text-xs font-medium uppercase tracking-wider text-muted-foreground";

  return (
    <AppLayout>
      <div className="max-w-2xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <PageHeader title="Novo Imóvel" />

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-4 rounded-lg bg-card p-6 shadow-card">
            <h2 className="text-sm font-semibold text-foreground">Informações</h2>
            <div className="space-y-2">
              <Label className={labelClass}>Título</Label>
              <Input value={form.title} onChange={(e) => update("title", e.target.value)} className={inputClass} placeholder="Ex: Apt 301 - Ed. Solar" />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Descrição</Label>
              <Textarea value={form.description} onChange={(e) => update("description", e.target.value)} className={inputClass + " min-h-[80px]"} placeholder="Descreva o imóvel..." />
            </div>
          </div>

          <div className="space-y-4 rounded-lg bg-card p-6 shadow-card">
            <h2 className="text-sm font-semibold text-foreground">Localização</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={labelClass}>CEP</Label>
                <Input value={form.cep} onChange={(e) => update("cep", e.target.value)} className={inputClass} placeholder="00000-000" />
              </div>
              <div className="space-y-2">
                <Label className={labelClass}>Número</Label>
                <Input value={form.number} onChange={(e) => update("number", e.target.value)} className={inputClass} placeholder="123" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Rua</Label>
              <Input value={form.street} onChange={(e) => update("street", e.target.value)} className={inputClass} placeholder="Nome da rua" />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Bairro</Label>
              <Input value={form.neighborhood} onChange={(e) => update("neighborhood", e.target.value)} className={inputClass} placeholder="Nome do bairro" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={labelClass}>Cidade</Label>
                <Input value={form.city} onChange={(e) => update("city", e.target.value)} className={inputClass} placeholder="Cidade" />
              </div>
              <div className="space-y-2">
                <Label className={labelClass}>Estado</Label>
                <Input value={form.state} onChange={(e) => update("state", e.target.value)} className={inputClass} placeholder="UF" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
              Salvar Imóvel
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="border-border text-foreground hover:bg-muted">
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
