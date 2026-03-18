import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { LogOut, Mail, User, Phone } from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <AppLayout>
      <PageHeader title="Perfil" />

      <div className="mt-6 max-w-lg space-y-6">
        <div className="rounded-lg bg-card p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-accent-foreground">
              JD
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">João da Silva</p>
              <p className="text-sm text-muted-foreground">Administrador</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {[
              { icon: <User className="h-4 w-4" />, label: "Nome", value: "João da Silva" },
              { icon: <Mail className="h-4 w-4" />, label: "E-mail", value: "joao@propmanager.com" },
              { icon: <Phone className="h-4 w-4" />, label: "Telefone", value: "(11) 99999-0000" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <div className="text-muted-foreground">{item.icon}</div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.label}</p>
                  <p className="text-sm text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleLogout}
          className="border-border text-destructive hover:bg-destructive/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair da conta
        </Button>
      </div>
    </AppLayout>
  );
}
