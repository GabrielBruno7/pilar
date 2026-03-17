import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

export default function ContractFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ property: "", tenant: "", dueDay: "", start: "", end: "", rent: "" });
  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/contratos");
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
        <PageHeader title="Novo Contrato" />
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-lg bg-card p-6 shadow-card">
          <div className="space-y-2">
            <Label className={labelClass}>Imóvel</Label>
            <Select onValueChange={(v) => update("property", v)}>
              <SelectTrigger className={inputClass}><SelectValue placeholder="Selecione um imóvel" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Apt 301 - Ed. Solar</SelectItem>
                <SelectItem value="2">Casa Rua das Flores</SelectItem>
                <SelectItem value="4">Apt 105 - Res. Park</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Inquilino</Label>
            <Select onValueChange={(v) => update("tenant", v)}>
              <SelectTrigger className={inputClass}><SelectValue placeholder="Selecione um inquilino" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Maria Silva</SelectItem>
                <SelectItem value="2">João Santos</SelectItem>
                <SelectItem value="3">Ana Costa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className={labelClass}>Dia Vencimento</Label>
              <Input value={form.dueDay} onChange={(e) => update("dueDay", e.target.value)} className={inputClass} placeholder="15" type="number" />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Data Início</Label>
              <Input value={form.start} onChange={(e) => update("start", e.target.value)} className={inputClass} type="date" />
            </div>
            <div className="space-y-2">
              <Label className={labelClass}>Data Fim</Label>
              <Input value={form.end} onChange={(e) => update("end", e.target.value)} className={inputClass} type="date" />
            </div>
          </div>
          <div className="space-y-2">
            <Label className={labelClass}>Valor do Aluguel</Label>
            <Input value={form.rent} onChange={(e) => update("rent", e.target.value)} className={inputClass} placeholder="R$ 0,00" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">Salvar</Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)} className="border-border text-foreground hover:bg-muted">Cancelar</Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
