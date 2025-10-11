"use client"

import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { UserNav } from "@/components/user-nav";
import { LayoutDashboard, FileText, Box, Settings, Users, ScanLine } from "lucide-react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { LogoutButton } from "@/components/logout-button";
import { useSession } from "@/hooks/use-session";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate", label: "Generate Invoice", icon: FileText },
  { href: "/inventory", label: "Inventory", icon: Box },
  { href: "/scan-and-sell", label: "Scan & Sell", icon: ScanLine },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { session } = useSession()

  // Skip this layout for SuperAdmin - they have their own layout
  if (session?.isSuperAdmin) {
    return <>{children}</>
  }

  return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <Link href={item.href} className="w-full">
                    <SidebarMenuButton
                      asChild
                      variant="default"
                      size="default"
                      tooltip={item.label}
                    >
                      <div>
                        <item.icon />
                        <span>{item.label}</span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <UserNav />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <SidebarTrigger className="md:hidden"/>
            <div className="w-full flex-1">
              <h2 className="text-lg font-semibold text-slate-900">{session?.businessName || 'My Business'}</h2>
            </div>
            <div className="flex items-center gap-2">
              {session && (
                <>
                  <NotificationBell />
                  <ChatSidebar
                    currentUserId={session.userId}
                    currentUserBusinessId={session.businessId}
                    currentUserBusinessName={session.businessName}
                    isSuperAdmin={false}
                  />
                  <LogoutButton />
                </>
              )}
            </div>
          </header>
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
  );
}
