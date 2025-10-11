"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Users,
  FileText,
  TrendingUp,
  Server,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const systemStats = [
  {
    title: "Total Users",
    value: "2,847",
    change: "+12.3%",
    icon: Users,
    trend: "up",
    color: "text-blue-500",
  },
  {
    title: "Active Sessions",
    value: "1,234",
    change: "+8.1%",
    icon: Activity,
    trend: "up",
    color: "text-green-500",
  },
  {
    title: "Documents Today",
    value: "8,342",
    change: "+23.5%",
    icon: FileText,
    trend: "up",
    color: "text-purple-500",
  },
  {
    title: "System Health",
    value: "99.9%",
    change: "Optimal",
    icon: Server,
    trend: "up",
    color: "text-emerald-500",
  },
];

const recentActivity = [
  {
    user: "John Doe",
    action: "Created new template",
    time: "2 minutes ago",
    status: "success",
    avatar: "/avatars/01.png",
  },
  {
    user: "Jane Smith",
    action: "Updated inventory item",
    time: "5 minutes ago",
    status: "success",
    avatar: "/avatars/02.png",
  },
  {
    user: "Mike Johnson",
    action: "Failed login attempt",
    time: "10 minutes ago",
    status: "error",
    avatar: "/avatars/03.png",
  },
  {
    user: "Sarah Williams",
    action: "Generated 50 documents",
    time: "15 minutes ago",
    status: "success",
    avatar: "/avatars/04.png",
  },
  {
    user: "System",
    action: "Backup completed",
    time: "30 minutes ago",
    status: "success",
    avatar: "/avatars/system.png",
  },
];

const systemAlerts = [
  {
    type: "warning",
    message: "Database storage at 78% capacity",
    time: "1 hour ago",
  },
  {
    type: "info",
    message: "System update available",
    time: "2 hours ago",
  },
  {
    type: "success",
    message: "Daily backup completed successfully",
    time: "3 hours ago",
  },
];

const topUsers = [
  { name: "Acme Corp", documents: 1234, revenue: "$12,450", growth: "+24%" },
  { name: "TechStart Inc", documents: 987, revenue: "$9,870", growth: "+18%" },
  { name: "Global Solutions", documents: 756, revenue: "$7,560", growth: "+15%" },
  { name: "Digital Agency", documents: 654, revenue: "$6,540", growth: "+12%" },
  { name: "Innovation Labs", documents: 543, revenue: "$5,430", growth: "+9%" },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* System Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        {/* Recent Activity */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Real-time system activity and user actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between space-x-4"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={activity.avatar} alt={activity.user} />
                      <AvatarFallback>
                        {activity.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {activity.user}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        activity.status === "success" ? "default" : "destructive"
                      }
                    >
                      {activity.status === "success" ? (
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                      ) : (
                        <AlertCircle className="mr-1 h-3 w-3" />
                      )}
                      {activity.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>Important system notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemAlerts.map((alert, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-3 rounded-lg border p-3"
                >
                  {alert.type === "warning" && (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                  {alert.type === "info" && (
                    <Activity className="h-5 w-5 text-blue-500" />
                  )}
                  {alert.type === "success" && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {alert.message}
                    </p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Resources */}
      <Card>
        <CardHeader>
          <CardTitle>System Resources</CardTitle>
          <CardDescription>Current system resource utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-muted-foreground">62%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage</span>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Network</span>
                <span className="text-sm text-muted-foreground">34%</span>
              </div>
              <Progress value={34} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Users */}
      <Card>
        <CardHeader>
          <CardTitle>Top Users by Activity</CardTitle>
          <CardDescription>
            Highest performing users this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Organization</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topUsers.map((user) => (
                <TableRow key={user.name}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.documents}</TableCell>
                  <TableCell>{user.revenue}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-green-600">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      {user.growth}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
