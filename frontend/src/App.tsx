import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyFormPage from "./pages/PropertyFormPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import TenantsPage from "./pages/TenantsPage";
import TenantFormPage from "./pages/TenantFormPage";
import ContractsPage from "./pages/ContractsPage";
import ContractFormPage from "./pages/ContractFormPage";
import PaymentsPage from "./pages/PaymentsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/imoveis" element={<PropertiesPage />} />
            <Route path="/imoveis/novo" element={<PropertyFormPage />} />
            <Route path="/imoveis/:id" element={<PropertyDetailPage />} />
            <Route path="/imoveis/:id/editar" element={<PropertyFormPage />} />
            <Route path="/inquilinos" element={<TenantsPage />} />
            <Route path="/inquilinos/novo" element={<TenantFormPage />} />
            <Route path="/contratos" element={<ContractsPage />} />
            <Route path="/contratos/novo" element={<ContractFormPage />} />
            <Route path="/pagamentos" element={<PaymentsPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
