import { SidebarTrigger } from "@/components/ui/sidebar"
import { ShieldCheck, Bell, Search, Activity } from "lucide-react"

export function AppHeader() {
  return (
    <header className="h-16 border-b border-border/50 bg-background/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="h-4 w-[1px] bg-border/50 mx-2" />
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full border border-border/50">
          <Activity className="w-4 h-4 text-primary" />
          <span>System Status: <span className="text-primary font-medium">Optimal</span></span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search intelligence database..." 
            className="pl-10 pr-4 py-2 bg-secondary/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 w-64 transition-all"
          />
        </div>
        
        <button className="relative p-2 hover:bg-secondary rounded-full transition-colors group">
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg border border-primary/20">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-xs font-mono font-bold text-primary">ENCRYPTED</span>
        </div>
      </div>
    </header>
  )
}
