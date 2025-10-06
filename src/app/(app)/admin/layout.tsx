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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { UserNav } from "@/components/user-nav";
import {
  LayoutDashboard,
  Users,
  Settings,
  Shield,
  Activity,
  BarChart3,
  Database,
  FileText,
  Package,
  ScrollText,
  Bell,
  CreditCard,
  Lock,
  Server,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const adminMenuSections = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/activity", label: "Activity Feed", icon: Activity },
    ],
  },
  {
    label: "User Management",
    items: [
      { href: "/admin/users", label: "All Users", icon: Users },
      { href: "/admin/roles", label: "Roles & Permissions", icon: Shield },
      { href: "/admin/teams", label: "Teams", icon: Users },
    ],
  },
  {
    label: "Content & Data",
    items: [
      { href: "/admin/documents", label: "Documents", icon: FileText },
      { href: "/admin/templates", label: "Templates", icon: ScrollText },
      { href: "/admin/inventory", label: "Inventory", icon: Package },
      { href: "/admin/database", label: "Database", icon: Database },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/settings", label: "System Settings", icon: Settings },
      { href: "/admin/security", label: "Security", icon: Lock },
      { href: "/admin/monitoring", label: "Monitoring", icon: Server },
      { href: "/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
    ],
  },
  {
    label: "Billing & Plans",
    items: [
      { href: "/admin/billing", label: "Billing", icon: CreditCard },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar className="border-r">
        <SidebarHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <Logo />
            <Badge variant="destructive" className="text-xs">
              ADMIN
            </Badge>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {adminMenuSections.map((section) => (
            <SidebarGroup key={section.label}>
              <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <Link href={item.href} className="w-full">
                        <SidebarMenuButton
                          asChild
                          variant="default"
                          size="default"
                          tooltip={item.label}
                        >
                          <div>
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </div>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="border-t">
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <SidebarTrigger className="md:hidden" />
          <div className="w-full flex-1">
            <h1 className="text-lg font-semibold">Admin Control Panel</h1>
          </div>
          <UserNav />
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
