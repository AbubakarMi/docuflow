"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { User, Building2, Mail, Search, Shield, Clock, TrendingUp, Activity, Users, Ban, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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

interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  username?: string
  role: string
  status: string
  createdAt: string
  lastLoginAt?: string
  business?: {
    id: string
    name: string
    email: string
    status: string
    approved: boolean
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

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [suspendDialog, setSuspendDialog] = useState<{ open: boolean; businessId: string | null; businessName: string; action: 'suspend' | 'activate' }>({
    open: false,
    businessId: null,
    businessName: '',
    action: 'suspend'
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
    fetchUserStats()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      setFilteredUsers(
        users.filter(
          (user) =>
            user.firstName.toLowerCase().includes(query) ||
            user.lastName.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query) ||
            user.username?.toLowerCase().includes(query) ||
            user.business?.name.toLowerCase().includes(query)
        )
      )
    } else {
      setFilteredUsers(users)
    }
  }, [searchQuery, users])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/superadmin/users')
      const data = await response.json()

      if (data.success) {
        setUsers(data.users)
        setFilteredUsers(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/superadmin/users/stats')
      const data = await response.json()

      if (data.success) {
        setUserStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
    }
  }

  const getRoleBadge = (role: string) => {
    if (role === 'admin') {
      return <Badge variant="default">Admin</Badge>
    }
    return <Badge variant="secondary">{role}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      active: { variant: "success", label: "Active" },
      inactive: { variant: "secondary", label: "Inactive" },
      suspended: { variant: "destructive", label: "Suspended" }
    }
    const { variant, label } = config[status] || config.active
    return <Badge variant={variant}>{label}</Badge>
  }

  const handleSuspendBusiness = async () => {
    if (!suspendDialog.businessId) return

    try {
      const response = await fetch(`/api/superadmin/businesses/${suspendDialog.businessId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: suspendDialog.action === 'suspend' ? 'suspended' : 'active'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${suspendDialog.action} business`)
      }

      toast({
        title: "Success",
        description: `Business ${suspendDialog.action === 'suspend' ? 'suspended' : 'activated'} successfully`,
      })

      // Refresh users list
      fetchUsers()
      fetchUserStats()
      setSuspendDialog({ open: false, businessId: null, businessName: '', action: 'suspend' })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${suspendDialog.action} business`,
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">User Management</h1>
          <p className="text-lg text-muted-foreground mt-1">View and manage all users across all businesses</p>
        </div>
        <Badge variant="outline" className="text-base px-5 py-2.5">
          {users.length} Total Users
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-5 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Total Users</CardTitle>
            <User className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{users.length}</div>
            <p className="text-sm text-muted-foreground mt-1">Across all businesses</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Active Users</CardTitle>
            <Shield className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {((users.filter(u => u.status === 'active').length / users.length) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Admin Users</CardTitle>
            <Shield className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Business administrators</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Businesses</CardTitle>
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {new Set(users.map(u => u.business?.id).filter(Boolean)).size}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Registered businesses</p>
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
              <CardDescription className="text-base">User registrations over the last 12 months</CardDescription>
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
              <CardDescription className="text-base">User distribution across businesses</CardDescription>
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
              <CardDescription className="text-base">Role distribution</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
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
            </CardContent>
          </Card>

          {/* Users by Status */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Activity className="h-6 w-6 text-green-600" />
                Users by Status
              </CardTitle>
              <CardDescription className="text-base">Status distribution</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
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
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-5">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">All Users</CardTitle>
              <CardDescription className="text-base mt-1">Complete list of users across all businesses</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search users..."
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
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {user.firstName} {user.lastName}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.username || <span className="text-muted-foreground">-</span>}
                      </TableCell>
                      <TableCell>
                        {user.business ? (
                          <div>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-3 w-3 text-muted-foreground" />
                              {user.business.name}
                            </div>
                            {!user.business.approved && (
                              <Badge variant="secondary" className="mt-1 text-xs">
                                Pending Approval
                              </Badge>
                            )}
                            {user.business.status === 'suspended' && (
                              <Badge variant="destructive" className="mt-1 text-xs">
                                Suspended
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No Business</span>
                        )}
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString()
                          : <span className="text-muted-foreground">Never</span>}
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        {user.business && user.business.id && (
                          <div className="flex justify-end gap-2">
                            {user.business.status === 'suspended' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSuspendDialog({
                                  open: true,
                                  businessId: user.business!.id,
                                  businessName: user.business!.name,
                                  action: 'activate'
                                })}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Activate
                              </Button>
                            ) : (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setSuspendDialog({
                                  open: true,
                                  businessId: user.business!.id,
                                  businessName: user.business!.name,
                                  action: 'suspend'
                                })}
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Suspend
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Suspend/Activate Business Dialog */}
      <AlertDialog open={suspendDialog.open} onOpenChange={(open) => setSuspendDialog({ ...suspendDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {suspendDialog.action === 'suspend' ? 'Suspend Business?' : 'Activate Business?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {suspendDialog.action === 'suspend' ? (
                <>
                  Are you sure you want to suspend "{suspendDialog.businessName}"?
                  This will prevent all users of this business from accessing the system.
                </>
              ) : (
                <>
                  Are you sure you want to activate "{suspendDialog.businessName}"?
                  This will restore access for all users of this business.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspendBusiness}
              className={suspendDialog.action === 'suspend' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {suspendDialog.action === 'suspend' ? 'Suspend Business' : 'Activate Business'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
