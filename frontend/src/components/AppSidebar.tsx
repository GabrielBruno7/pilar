import { NavLink as RouterNavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  CreditCard,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { logout } from "@/services/auth";
import { toast } from "@/components/ui/sonner";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/imoveis", label: "Imóveis", icon: Building2 },
  { to: "/inquilinos", label: "Inquilinos", icon: Users },
  { to: "/contratos", label: "Contratos", icon: FileText },
  { to: "/pagamentos", label: "Pagamentos", icon: CreditCard },
];

export function AppSidebar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado com sucesso!");
      setMobileOpen(false);
      navigate("/");
    } catch (err) {
      toast.error("Erro ao sair da conta.");
    }
  };

  const navContent = (
    <div className="flex h-full flex-col">

    <div className="flex h-16 items-center px-6">
      <RouterNavLink
        to="/dashboard"
        onClick={() => setMobileOpen(false)}
        className="group flex items-center gap-2.5 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:opacity-90"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary transition-transform duration-200 group-hover:rotate-[-6deg] group-hover:scale-105">
          <Building2 className="h-4 w-4 text-primary-foreground" />
        </div>

        <span className="pt-0.5 text-lg font-semibold tracking-[0.34em] text-foreground transition-all duration-200 group-hover:tracking-[0.38em]">
          PILAR
        </span>
      </RouterNavLink>
    </div>

      <nav className="flex-1 space-y-1 px-3 pt-4">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </RouterNavLink>
          );
        })}
      </nav>

      <div className="border-t p-3">
        <RouterNavLink
          to="/perfil"
          onClick={() => setMobileOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
            location.pathname === "/perfil"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <User className="h-5 w-5" />
          Perfil
        </RouterNavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-card lg:hidden"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] bg-surface shadow-card-hover transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
        {navContent}
      </aside>

      <aside className="hidden w-[260px] shrink-0 border-r border-border/50 bg-surface lg:block">
        {navContent}
      </aside>
    </>
  );
}
