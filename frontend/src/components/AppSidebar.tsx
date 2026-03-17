import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
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

  const navContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Building2 className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-foreground">Pilar</span>
      </div>

      {/* Nav links */}
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

      {/* Footer */}
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
        <RouterNavLink
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </RouterNavLink>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-card lg:hidden"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
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

      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 border-r border-border/50 bg-surface lg:block">
        {navContent}
      </aside>
    </>
  );
}
