"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Building2,
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Search,
  Shield,
  Activity,
  Eye
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SuperAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - Replace with actual API calls
  const systemStats = {
    totalBusinesses: 12,
    activeBusinesses: 10,
    totalUsers: 45,
    totalInvoices: 234,
    totalRevenue: 1245600,
    monthlyGrowth: 12.5
  }

  const businesses = [
    {
      id: "1",
      name: "Acme Corporation",
      email: "info@acme.com",
      plan: "business",
      status: "active",
      users: 5,
      invoices: 45,
      revenue: 125000,
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Tech Innovations",
      email: "hello@techinnovations.com",
      plan: "starter",
      status: "active",
      users: 2,
      invoices: 12,
      revenue: 45000,
      createdAt: "2024-02-10"
    },
    {
      id: "3",
      name: "Global Services LLC",
      email: "contact@globalservices.com",
      plan: "enterprise",
      status: "active",
      users: 15,
      invoices: 156,
      revenue: 875000,
      createdAt: "2023-11-20"
    },
  ]

  const recentActivity = [
    { business: "Acme Corporation", action: "Created invoice INV-1045", time: "2 minutes ago" },
    { business: "Tech Innovations", action: "Registered new customer", time: "15 minutes ago" },
    { business: "Global Services LLC", action: "Received payment $5,600", time: "1 hour ago" },
    { business: "Acme Corporation", action: "New user registered", time: "2 hours ago" },
  ]

  const getPlanBadge = (plan: string) => {
    const config: Record<string, { variant: any, label: string }> = {
      free: { variant: "secondary", label: "Free" },
      starter: { variant: "default", label: "Starter" },
      business: { variant: "default", label: "Business" },
      enterprise: { variant: "default", label: "Enterprise" }
    }
    const { variant, label } = config[plan] || config.free
    return <Badge variant={variant}>{label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any, label: string }> = {
      active: { variant: "success", label: "Active" },
      suspended: { variant: "destructive", label: "Suspended" },
      cancelled: { variant: "outline", label: "Cancelled" }
    }
    const { variant, label } = config[status] || config.active
    return <Badge variant={variant}>{label}</Badge>
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-8 w-8 text-red-600" />
            <h1 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">System-wide overview and management</p>
        </div>
        <Badge variant="destructive" className="text-lg px-4 py-2">
          SUPER ADMIN
        </Badge>
      </div>

      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalBusinesses}</div>
            <p className="text-xs text-muted-foreground">
              {systemStats.activeBusinesses} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Across all businesses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              System-wide
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(systemStats.totalRevenue / 1000).toFixed(0)}k</div>
            <p className="text-xs text-muted-foreground">
              All businesses combined
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{systemStats.monthlyGrowth}%</div>
            <p className="text-xs text-muted-foreground">
              vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              Users online
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Businesses Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Businesses</CardTitle>
              <CardDescription>Manage and monitor all registered businesses</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Users</TableHead>
                  <TableHead className="text-right">Invoices</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map((business) => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {business.name}
                      </div>
                    </TableCell>
                    <TableCell>{business.email}</TableCell>
                    <TableCell>{getPlanBadge(business.plan)}</TableCell>
                    <TableCell>{getStatusBadge(business.status)}</TableCell>
                    <TableCell className="text-right">{business.users}</TableCell>
                    <TableCell className="text-right">{business.invoices}</TableCell>
                    <TableCell className="text-right font-semibold">
                      ${business.revenue.toLocaleString()}
                    </TableCell>
                    <TableCell>{new Date(business.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions across all businesses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-blue-600 mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.business}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Infrastructure status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge variant="success">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Server</span>
                <Badge variant="success">Running</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Service</span>
                <Badge variant="success">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <Badge variant="default">75% Used</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">CPU Load</span>
                <Badge variant="default">32%</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Memory</span>
                <Badge variant="default">58%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
