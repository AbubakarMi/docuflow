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
import { Shield, Building2, Users, AlertCircle, FileText, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { LogoutButton } from "@/components/logout-button";
import { useSession } from "@/hooks/use-session";

const superAdminMenuItems = [
  { href: "/superadmin", label: "Dashboard", icon: BarChart },
  { href: "/superadmin/approvals", label: "Business Approvals", icon: AlertCircle },
  { href: "/superadmin/users", label: "User Management", icon: Users },
  { href: "/superadmin/businesses", label: "All Businesses", icon: Building2 },
  { href: "/superadmin/templates", label: "Templates", icon: FileText },
];

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { session } = useSession()

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-2">
            <Logo />
            <Badge variant="destructive" className="ml-auto">SUPER ADMIN</Badge>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {superAdminMenuItems.map((item) => (
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
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1 flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            <span className="font-semibold">SuperAdmin Portal</span>
          </div>
          <div className="flex items-center gap-2">
            {session && (
              <>
                <NotificationBell />
                <ChatSidebar
                  currentUserId={session.userId}
                  isSuperAdmin={session.isSuperAdmin}
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
