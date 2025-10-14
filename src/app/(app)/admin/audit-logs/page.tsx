"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Download,
  Filter,
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  Shield,
  Eye,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const auditLogs = [
  {
    id: 1,
    user: "John Doe",
    email: "john.doe@example.com",
    action: "Created new template",
    resource: "Template: Invoice Template",
    type: "create",
    severity: "info",
    timestamp: "2025-10-06 14:32:15",
    ip: "192.168.1.100",
    userAgent: "Chrome 118.0.0.0",
    status: "success",
  },
  {
    id: 2,
    user: "Jane Smith",
    email: "jane.smith@example.com",
    action: "Updated user role",
    resource: "User: Mike Johnson",
    type: "update",
    severity: "warning",
    timestamp: "2025-10-06 14:28:45",
    ip: "192.168.1.101",
    userAgent: "Firefox 119.0",
    status: "success",
  },
  {
    id: 3,
    user: "Mike Johnson",
    email: "mike.j@example.com",
    action: "Failed login attempt",
    resource: "Authentication",
    type: "auth",
    severity: "error",
    timestamp: "2025-10-06 14:25:30",
    ip: "203.0.113.45",
    userAgent: "Chrome 118.0.0.0",
    status: "failed",
  },
  {
    id: 4,
    user: "System",
    email: "system@invotrek.com",
    action: "Database backup completed",
    resource: "Database: production",
    type: "system",
    severity: "info",
    timestamp: "2025-10-06 14:00:00",
    ip: "127.0.0.1",
    userAgent: "System",
    status: "success",
  },
  {
    id: 5,
    user: "Sarah Williams",
    email: "sarah.w@example.com",
    action: "Deleted inventory item",
    resource: "Inventory: Item #1234",
    type: "delete",
    severity: "warning",
    timestamp: "2025-10-06 13:45:22",
    ip: "192.168.1.102",
    userAgent: "Safari 17.0",
    status: "success",
  },
  {
    id: 6,
    user: "Tom Brown",
    email: "tom.brown@example.com",
    action: "Exported user data",
    resource: "Users: 2,847 records",
    type: "export",
    severity: "warning",
    timestamp: "2025-10-06 13:30:10",
    ip: "192.168.1.103",
    userAgent: "Chrome 118.0.0.0",
    status: "success",
  },
  {
    id: 7,
    user: "Admin",
    email: "admin@invotrek.com",
    action: "Changed system settings",
    resource: "Settings: Security",
    type: "update",
    severity: "critical",
    timestamp: "2025-10-06 13:15:05",
    ip: "192.168.1.1",
    userAgent: "Chrome 118.0.0.0",
    status: "success",
  },
  {
    id: 8,
    user: "Unknown",
    email: "N/A",
    action: "Unauthorized access attempt",
    resource: "Admin Panel",
    type: "security",
    severity: "critical",
    timestamp: "2025-10-06 12:58:33",
    ip: "198.51.100.42",
    userAgent: "curl/7.68.0",
    status: "blocked",
  },
];

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "warning":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "info":
      return <Info className="h-4 w-4 text-blue-500" />;
    default:
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  }
};

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<typeof auditLogs[0] | null>(
    null
  );

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    const matchesSeverity =
      severityFilter === "all" || log.severity === severityFilter;
    return matchesSearch && matchesType && matchesSeverity;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">
            Complete system activity and security logs
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">127</div>
            <p className="text-xs text-muted-foreground">+5 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">23</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,834</div>
            <p className="text-xs text-muted-foreground">Active today</p>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Audit Logs</CardTitle>
              <CardDescription>
                Showing {filteredLogs.length} of {auditLogs.length} logs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="mb-4 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="auth">Authentication</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{getSeverityIcon(log.severity)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {log.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{log.user}</div>
                        <div className="text-xs text-muted-foreground">
                          {log.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.resource}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.status === "success"
                          ? "default"
                          : log.status === "failed"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {log.timestamp}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedLog(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Log Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Complete information about this audit event
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    User
                  </p>
                  <p className="text-sm font-semibold">{selectedLog.user}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedLog.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Timestamp
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedLog.timestamp}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Action
                  </p>
                  <p className="text-sm font-semibold">{selectedLog.action}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Resource
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedLog.resource}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Type
                  </p>
                  <Badge variant="outline">{selectedLog.type}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Severity
                  </p>
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(selectedLog.severity)}
                    <span className="text-sm font-semibold capitalize">
                      {selectedLog.severity}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    IP Address
                  </p>
                  <p className="text-sm font-mono">{selectedLog.ip}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    User Agent
                  </p>
                  <p className="text-sm">{selectedLog.userAgent}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <Badge
                  variant={
                    selectedLog.status === "success"
                      ? "default"
                      : selectedLog.status === "failed"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {selectedLog.status}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
