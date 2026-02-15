import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { AppHeader } from "./AppHeader"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden cyber-grid bg-background">
        <div className="noise-overlay" />
        <div className="scanner-line" />
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen overflow-hidden border-l border-border/50">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-6 relative">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
