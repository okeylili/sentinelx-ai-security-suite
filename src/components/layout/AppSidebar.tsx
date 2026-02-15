import * as React from "react"
import { 
  Shield, 
  Mail, 
  Globe, 
  MessageSquare, 
  FileText, 
  Mic, 
  Terminal, 
  History, 
  Settings,
  LayoutDashboard,
  Zap,
  Lock
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"

const analysisItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  { title: "Email Scanner", icon: Mail, url: "/email" },
  { title: "Web Scanner", icon: Globe, url: "/web" },
  { title: "Audio Scanner", icon: Mic, url: "/audio" },
  { title: "AI Security", icon: Terminal, url: "/ai-security" },
]

const systemItems = [
  { title: "History", icon: History, url: "/history" },
  { title: "Settings", icon: Settings, url: "/settings" },
]

export function AppSidebar() {
  const { user, logout } = useAuth()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="border-b border-border/50 py-4 px-6 flex flex-row items-center gap-3">
        <div className="bg-primary/10 p-2 rounded-lg border border-primary/20">
          <Shield className="w-6 h-6 text-primary animate-pulse-slow" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-foreground">SentinelX</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">AI Intelligence</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-2">Intelligence Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {analysisItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-3 py-6">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="px-6 py-2">System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center gap-3 py-6">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-xs font-bold text-primary">
            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-medium text-foreground truncate">{user?.displayName || 'Sentinel User'}</span>
            <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
          </div>
          <button 
            onClick={() => logout()}
            className="p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
