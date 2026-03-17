import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/services/auth";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Preencha e-mail e senha.");
      return;
    }

    setLoading(true);

    try {
      const response = await login({
        email: email.trim(),
        password,
      });

      if (!response?.access_token) {
        throw new Error("Token não retornado pela API.");
      }

      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user_name", response.name);
      localStorage.setItem("user_email", response.email);

      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-[400px] rounded-xl bg-card p-8 shadow-card">
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>

          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">
              Bem-vindo ao Pilar
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Gestão e organização imobiliária.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              E-mail
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-none bg-muted ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
            >
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-none bg-muted ring-1 ring-border focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link
            to="/cadastro"
            className="font-medium text-primary hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
