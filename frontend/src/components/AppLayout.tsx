import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
