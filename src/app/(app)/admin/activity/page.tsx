"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Users,
  Settings,
  Upload,
  Download,
  Trash2,
  Edit,
  UserPlus,
  LogIn,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

const activityFeed = [
  {
    id: 1,
    user: "John Doe",
    avatar: "/avatars/01.png",
    action: "created a new template",
    target: "Invoice Template v2",
    category: "templates",
    timestamp: "2 minutes ago",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    id: 2,
    user: "Jane Smith",
    avatar: "/avatars/02.png",
    action: "updated user role for",
    target: "Mike Johnson",
    category: "users",
    timestamp: "5 minutes ago",
    icon: Users,
    color: "text-purple-500",
  },
  {
    id: 3,
    user: "Mike Johnson",
    avatar: "/avatars/03.png",
    action: "logged in",
    target: "from 192.168.1.100",
    category: "auth",
    timestamp: "10 minutes ago",
    icon: LogIn,
    color: "text-green-500",
  },
  {
    id: 4,
    user: "Sarah Williams",
    avatar: "/avatars/04.png",
    action: "generated document",
    target: "Invoice #INV-2025-0042",
    category: "documents",
    timestamp: "15 minutes ago",
    icon: FileText,
    color: "text-blue-500",
  },
  {
    id: 5,
    user: "Tom Brown",
    avatar: "/avatars/05.png",
    action: "deleted inventory item",
    target: "Product #1234",
    category: "inventory",
    timestamp: "22 minutes ago",
    icon: Trash2,
    color: "text-red-500",
  },
  {
    id: 6,
    user: "Admin",
    avatar: "/avatars/admin.png",
    action: "changed system settings",
    target: "Security Configuration",
    category: "settings",
    timestamp: "30 minutes ago",
    icon: Settings,
    color: "text-orange-500",
  },
  {
    id: 7,
    user: "Emily Davis",
    avatar: "/avatars/06.png",
    action: "uploaded file",
    target: "company-logo.png",
    category: "files",
    timestamp: "45 minutes ago",
    icon: Upload,
    color: "text-indigo-500",
  },
  {
    id: 8,
    user: "System",
    avatar: "/avatars/system.png",
    action: "completed backup",
    target: "Database",
    category: "system",
    timestamp: "1 hour ago",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  {
    id: 9,
    user: "Alex Johnson",
    avatar: "/avatars/07.png",
    action: "exported data",
    target: "User Report",
    category: "export",
    timestamp: "1 hour ago",
    icon: Download,
    color: "text-cyan-500",
  },
  {
    id: 10,
    user: "Chris Lee",
    avatar: "/avatars/08.png",
    action: "created new user",
    target: "lisa.wong@example.com",
    category: "users",
    timestamp: "2 hours ago",
    icon: UserPlus,
    color: "text-purple-500",
  },
];

const documentActivity = activityFeed.filter((a) => a.category === "documents");
const userActivity = activityFeed.filter((a) => a.category === "users");
const systemActivity = activityFeed.filter(
  (a) => a.category === "system" || a.category === "settings"
);
const authActivity = activityFeed.filter((a) => a.category === "auth");

export default function ActivityFeedPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Feed</h1>
          <p className="text-muted-foreground">
            Real-time system activity and user actions
          </p>
        </div>
      </div>

      {/* Activity Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Activities
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Document Actions</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">573</div>
            <p className="text-xs text-muted-foreground">+18% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Actions</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Actions</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">-3 from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Activity</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                All system activities in chronological order
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {activityFeed.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 rounded-lg border p-4"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={activity.avatar} alt={activity.user} />
                        <AvatarFallback>
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm">
                            <span className="font-semibold">
                              {activity.user}
                            </span>{" "}
                            {activity.action}{" "}
                            <span className="font-medium text-foreground">
                              {activity.target}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {activity.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {activity.timestamp}
                          </span>
                        </div>
                      </div>
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Activity</CardTitle>
              <CardDescription>
                Document creation, editing, and deletion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {documentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 rounded-lg border p-4"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={activity.avatar} alt={activity.user} />
                        <AvatarFallback>
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.user}</span>{" "}
                          {activity.action}{" "}
                          <span className="font-medium text-foreground">
                            {activity.target}
                          </span>
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </span>
                      </div>
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management Activity</CardTitle>
              <CardDescription>User creation, updates, and deletions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {userActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 rounded-lg border p-4"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={activity.avatar} alt={activity.user} />
                        <AvatarFallback>
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.user}</span>{" "}
                          {activity.action}{" "}
                          <span className="font-medium text-foreground">
                            {activity.target}
                          </span>
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </span>
                      </div>
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Activity</CardTitle>
              <CardDescription>
                System operations and configuration changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {systemActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 rounded-lg border p-4"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={activity.avatar} alt={activity.user} />
                        <AvatarFallback>
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.user}</span>{" "}
                          {activity.action}{" "}
                          <span className="font-medium text-foreground">
                            {activity.target}
                          </span>
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </span>
                      </div>
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Activity</CardTitle>
              <CardDescription>Login attempts and sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-4">
                  {authActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 rounded-lg border p-4"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={activity.avatar} alt={activity.user} />
                        <AvatarFallback>
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.user}</span>{" "}
                          {activity.action}{" "}
                          <span className="font-medium text-foreground">
                            {activity.target}
                          </span>
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {activity.timestamp}
                        </span>
                      </div>
                      <activity.icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
