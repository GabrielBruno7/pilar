import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px] rounded-xl bg-card p-8 shadow-card">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">Criar conta no Pilar</h1>
            <p className="mt-1 text-sm text-muted-foreground">Comece a gerenciar seus imóveis.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: "name", label: "Nome", type: "text", placeholder: "Seu nome completo", field: "name" },
            { id: "email", label: "E-mail", type: "email", placeholder: "seu@email.com", field: "email" },
            { id: "password", label: "Senha", type: "password", placeholder: "••••••••", field: "password" },
            { id: "confirm", label: "Confirmar Senha", type: "password", placeholder: "••••••••", field: "confirm" },
          ].map((input) => (
            <div key={input.id} className="space-y-2">
              <Label htmlFor={input.id} className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {input.label}
              </Label>
              <Input
                id={input.id}
                type={input.type}
                placeholder={input.placeholder}
                value={form[input.field as keyof typeof form]}
                onChange={(e) => update(input.field, e.target.value)}
                className="border-none bg-muted ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          ))}
          <Button type="submit" className="w-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90">
            Criar conta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link to="/" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
