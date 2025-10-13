"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Server,
  Cpu,
  HardDrive,
  Network,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  Globe,
  Zap,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const cpuData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}m`,
  usage: Math.random() * 30 + 40,
}));

const memoryData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}m`,
  usage: Math.random() * 20 + 50,
}));

const networkData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}m`,
  incoming: Math.random() * 50 + 20,
  outgoing: Math.random() * 30 + 10,
}));

const responseTimeData = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}m`,
  api: Math.random() * 100 + 50,
  database: Math.random() * 50 + 30,
  web: Math.random() * 30 + 20,
}));

const services = [
  {
    name: "API Server",
    status: "healthy",
    uptime: "99.98%",
    responseTime: "45ms",
    requests: "1.2M/day",
    icon: Server,
  },
  {
    name: "Database",
    status: "healthy",
    uptime: "99.99%",
    responseTime: "12ms",
    requests: "3.5M/day",
    icon: Database,
  },
  {
    name: "Web Server",
    status: "healthy",
    uptime: "99.95%",
    responseTime: "23ms",
    requests: "2.8M/day",
    icon: Globe,
  },
  {
    name: "Cache Layer",
    status: "warning",
    uptime: "99.87%",
    responseTime: "8ms",
    requests: "5.2M/day",
    icon: Zap,
  },
  {
    name: "Background Jobs",
    status: "healthy",
    uptime: "99.92%",
    responseTime: "N/A",
    requests: "450K/day",
    icon: Activity,
  },
  {
    name: "File Storage",
    status: "warning",
    uptime: "99.85%",
    responseTime: "156ms",
    requests: "890K/day",
    icon: HardDrive,
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "healthy":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "critical":
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Activity className="h-5 w-5 text-gray-500" />;
  }
};

export default function MonitoringPage() {
  const [timeRange, setTimeRange] = useState("1h");

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            System Monitoring
          </h1>
          <p className="text-muted-foreground">
            Real-time system health and performance metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5m">Last 5 minutes</SelectItem>
            <SelectItem value="1h">Last hour</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* System Health Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <Progress value={45} className="mt-2 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              Average load: 2.3
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory</CardTitle>
            <Server className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62%</div>
            <Progress value={62} className="mt-2 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              12.4 GB / 20 GB
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Space</CardTitle>
            <HardDrive className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <Progress value={78} className="mt-2 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              390 GB / 500 GB
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network</CardTitle>
            <Network className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34%</div>
            <Progress value={34} className="mt-2 h-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              ↓ 45 MB/s ↑ 12 MB/s
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle>Services Status</CardTitle>
          <CardDescription>Current status of all system services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.name}
                className="flex items-start space-x-3 rounded-lg border p-4"
              >
                <div className="flex-shrink-0">
                  <service.icon className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{service.name}</h4>
                    {getStatusIcon(service.status)}
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Uptime: {service.uptime}</p>
                    <p>Response: {service.responseTime}</p>
                    <p>Requests: {service.requests}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Charts */}
      <Tabs defaultValue="cpu" className="space-y-4">
        <TabsList>
          <TabsTrigger value="cpu">CPU</TabsTrigger>
          <TabsTrigger value="memory">Memory</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="response">Response Time</TabsTrigger>
        </TabsList>

        <TabsContent value="cpu" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>CPU Usage Over Time</CardTitle>
              <CardDescription>
                Real-time CPU utilization metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cpuData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="usage"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="memory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Memory Usage Over Time</CardTitle>
              <CardDescription>
                Real-time memory utilization metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={memoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="usage"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Traffic</CardTitle>
              <CardDescription>
                Incoming and outgoing network traffic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={networkData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="incoming"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="outgoing"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="response" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Response Times</CardTitle>
              <CardDescription>
                Average response times for different services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="api"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="database"
                    stroke="#f59e0b"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="web"
                    stroke="#10b981"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            System alerts and warnings in the last 24 hours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">High Disk Usage</p>
                <p className="text-xs text-muted-foreground">
                  Disk space at 78% capacity - 2 hours ago
                </p>
              </div>
              <Badge variant="outline">Warning</Badge>
            </div>
            <div className="flex items-start space-x-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-950">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">Cache Layer Slow Response</p>
                <p className="text-xs text-muted-foreground">
                  Average response time increased to 8ms - 5 hours ago
                </p>
              </div>
              <Badge variant="outline">Warning</Badge>
            </div>
            <div className="flex items-start space-x-3 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">System Update Completed</p>
                <p className="text-xs text-muted-foreground">
                  All services updated successfully - 8 hours ago
                </p>
              </div>
              <Badge variant="outline">Resolved</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
