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
  Eye,
  AlertCircle,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

interface SystemStats {
  totalBusinesses: number
  activeBusinesses: number
  pendingBusinesses: number
  totalUsers: number
  totalInvoices: number
  totalRevenue: number
  monthlyGrowth: number
}

interface Business {
  id: string
  name: string
  email: string
  plan: string
  status: string
  approved: boolean
  createdAt: string
  stats: {
    users: number
    invoices: number
    revenue: number
  }
}

interface UserStats {
  totalUsers: number
  recentUsers: number
  activeUsers: number
  userGrowth: Array<{ month: string; count: number }>
  usersByBusiness: Array<{ name: string; users: number }>
  usersByRole: Array<{ role: string; count: number }>
  usersByStatus: Array<{ status: string; count: number }>
}

export default function SuperAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsResponse, businessesResponse, userStatsResponse] = await Promise.all([
        fetch('/api/superadmin/stats'),
        fetch('/api/superadmin/businesses'),
        fetch('/api/superadmin/users/stats')
      ])

      const statsData = await statsResponse.json()
      const businessesData = await businessesResponse.json()
      const userStatsData = await userStatsResponse.json()

      if (statsData.success) {
        setSystemStats(statsData.stats)
      }

      if (businessesData.success) {
        setBusinesses(businessesData.businesses)
      }

      if (userStatsData.success) {
        setUserStats(userStatsData.stats)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredBusinesses = businesses.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-10 w-10 text-red-600" />
            <h1 className="text-4xl font-bold tracking-tight">Super Admin Dashboard</h1>
          </div>
          <p className="text-lg text-muted-foreground">System-wide overview and management</p>
        </div>
        <div className="flex gap-3">
          {systemStats && systemStats.pendingBusinesses > 0 && (
            <Link href="/superadmin/approvals">
              <Button variant="outline" className="h-11">
                <AlertCircle className="h-4 w-4 mr-2" />
                {systemStats.pendingBusinesses} Pending Approvals
              </Button>
            </Link>
          )}
          <Badge variant="destructive" className="text-base px-5 py-2.5">
            SUPER ADMIN
          </Badge>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Total Businesses</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{systemStats?.totalBusinesses || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">
              {systemStats?.activeBusinesses || 0} active
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Total Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{systemStats?.totalUsers || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">
              Across all businesses
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Total Invoices</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{systemStats?.totalInvoices || 0}</div>
            <p className="text-sm text-muted-foreground mt-1">
              System-wide
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Total Revenue</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ${((systemStats?.totalRevenue || 0) / 1000).toFixed(0)}k
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              All businesses combined
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Monthly Growth</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {systemStats?.monthlyGrowth ? `+${systemStats.monthlyGrowth}%` : '0%'}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              vs last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Pending Approvals</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {systemStats?.pendingBusinesses || 0}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Awaiting review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* User Analytics Charts */}
      {userStats && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* User Growth Over Time */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
                User Growth Over Time
              </CardTitle>
              <CardDescription className="text-base">Total users registered over the last 12 months</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={userStats.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    name="Users Registered"
                    dot={{ fill: '#4f46e5', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Users by Business */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building2 className="h-6 w-6 text-blue-600" />
                Users by Business (Top 10)
              </CardTitle>
              <CardDescription className="text-base">Number of users in each business</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={userStats.usersByBusiness}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="users"
                    fill="#3b82f6"
                    name="Users"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Users by Role */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-6 w-6 text-purple-600" />
                Users by Role
              </CardTitle>
              <CardDescription className="text-base">Distribution of user roles across all businesses</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={userStats.usersByRole}
                      dataKey="count"
                      nameKey="role"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.role}: ${entry.count}`}
                    >
                      {userStats.usersByRole.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={['#4f46e5', '#3b82f6', '#8b5cf6', '#06b6d4'][index % 4]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Users by Status */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-6 w-6 text-green-600" />
                Users by Status
              </CardTitle>
              <CardDescription className="text-base">Current status of all users in the system</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie
                      data={userStats.usersByStatus}
                      dataKey="count"
                      nameKey="status"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => `${entry.status}: ${entry.count}`}
                    >
                      {userStats.usersByStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.status === 'active' ? '#10b981' : entry.status === 'suspended' ? '#ef4444' : '#6b7280'}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Stats Summary Cards */}
      {userStats && (
        <div className="grid gap-5 md:grid-cols-3">
          <Card className="border-l-4 border-l-indigo-600 hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-indigo-600">{userStats.totalUsers}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Across all businesses
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600 hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-muted-foreground">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">{userStats.activeUsers}</div>
              <p className="text-sm text-muted-foreground mt-2">
                {((userStats.activeUsers / userStats.totalUsers) * 100).toFixed(1)}% of total users
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-600 hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-semibold text-muted-foreground">New Users (30 days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-600">{userStats.recentUsers}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Registered in the last month
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Businesses Table */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">All Businesses</CardTitle>
              <CardDescription className="text-base mt-1">Manage and monitor all registered businesses</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
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
                {filteredBusinesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No businesses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBusinesses.map((business) => (
                    <TableRow key={business.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {business.name}
                          {!business.approved && (
                            <Badge variant="secondary" className="ml-2">Pending</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{business.email}</TableCell>
                      <TableCell>{getPlanBadge(business.plan)}</TableCell>
                      <TableCell>{getStatusBadge(business.status)}</TableCell>
                      <TableCell className="text-right">{business.stats.users}</TableCell>
                      <TableCell className="text-right">{business.stats.invoices}</TableCell>
                      <TableCell className="text-right font-semibold">
                        ${business.stats.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell>{new Date(business.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-5 md:grid-cols-3">
        <Link href="/superadmin/approvals">
          <Card className="hover:shadow-lg cursor-pointer transition-all hover:scale-[1.02]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <AlertCircle className="h-6 w-6 text-orange-600" />
                Business Approvals
              </CardTitle>
              <CardDescription className="text-base">
                Review and approve pending business registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {systemStats?.pendingBusinesses || 0} Pending
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/superadmin/users">
          <Card className="hover:shadow-lg cursor-pointer transition-all hover:scale-[1.02]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Users className="h-6 w-6 text-blue-600" />
                User Management
              </CardTitle>
              <CardDescription className="text-base">
                View and manage all users across businesses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">
                {systemStats?.totalUsers || 0} Users
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/superadmin/templates">
          <Card className="hover:shadow-lg cursor-pointer transition-all hover:scale-[1.02]">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileText className="h-6 w-6 text-purple-600" />
                Template Management
              </CardTitle>
              <CardDescription className="text-base">
                Upload and manage invoice templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant="secondary" className="text-sm px-3 py-1">Manage Templates</Badge>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
