# Admin Dashboard - DocuFlow

A comprehensive admin control panel for managing and monitoring the entire DocuFlow system.

## 🎯 Overview

The admin dashboard provides a centralized interface for system administrators to:
- Monitor system health and performance
- Manage users and permissions
- View analytics and reports
- Track audit logs and activities
- Configure system settings
- Monitor real-time metrics

## 📁 Structure

```
src/app/(app)/admin/
├── layout.tsx              # Admin layout with sidebar navigation
├── page.tsx                # Main admin dashboard
├── analytics/
│   └── page.tsx           # System analytics with charts
├── users/
│   └── page.tsx           # User management
├── audit-logs/
│   └── page.tsx           # Audit logs and security tracking
├── settings/
│   └── page.tsx           # System settings configuration
├── monitoring/
│   └── page.tsx           # Real-time system monitoring
└── activity/
    └── page.tsx           # Activity feed
```

## 🚀 Features

### 1. Main Dashboard (`/admin`)
- **System Stats Cards**: Total users, active sessions, documents, system health
- **Recent Activity Feed**: Real-time user actions and system events
- **System Alerts**: Important notifications and warnings
- **System Resources**: CPU, memory, storage, and network usage
- **Top Users Table**: Highest performing users by activity

### 2. Analytics (`/admin/analytics`)
- **Revenue Analytics**: Revenue, cost, and profit tracking
- **User Growth Charts**: Total users vs active users
- **Document Distribution**: Breakdown by document types (Pie & Bar charts)
- **Peak Hours Analysis**: System usage throughout the day
- **Time Range Filters**: 7 days, 30 days, 90 days, 1 year

### 3. User Management (`/admin/users`)
- **User List Table**: All users with search and filters
- **User Stats**: Total, active, new, and suspended users
- **User Actions**:
  - Add new users
  - Edit user details
  - Change roles
  - Suspend/activate users
  - Send emails
- **Export Functionality**: Export user data

### 4. Audit Logs (`/admin/audit-logs`)
- **Complete Activity Logs**: All system events tracked
- **Advanced Filters**: By type, severity, user, date
- **Log Details Modal**: Full information about each event
- **Severity Levels**: Critical, error, warning, info
- **Event Types**: Create, update, delete, auth, system, security
- **Export Logs**: Download audit logs for compliance

### 5. System Settings (`/admin/settings`)
Organized in tabs:
- **General**: Site name, description, timezone, language, maintenance mode
- **Security**: 2FA, password policies, session timeout, IP whitelist
- **Email**: SMTP configuration, email templates
- **Database**: Backup settings, retention policies, restore options
- **Notifications**: Email alerts, security notifications, system health alerts
- **Appearance**: Theme, colors, branding

### 6. System Monitoring (`/admin/monitoring`)
- **Real-time Metrics**:
  - CPU usage with live graphs
  - Memory utilization
  - Disk space monitoring
  - Network traffic (incoming/outgoing)
- **Service Status**: Health check for all services
- **Performance Charts**: CPU, memory, network, response times
- **System Alerts**: Recent warnings and critical events
- **Time Range Selection**: 5m, 1h, 24h, 7d

### 7. Activity Feed (`/admin/activity`)
- **Live Activity Stream**: Real-time system activities
- **Activity Categories**:
  - All Activity
  - Documents
  - Users
  - System
  - Authentication
- **Activity Stats**: Total activities, document actions, user actions, failed attempts
- **Scrollable Feed**: Chronological activity list with avatars and badges

## 🎨 Design Features

### Sidebar Navigation
- Organized into logical sections:
  - Overview (Dashboard, Analytics, Activity)
  - User Management (Users, Roles, Teams)
  - Content & Data (Documents, Templates, Inventory, Database)
  - System (Settings, Security, Monitoring, Audit Logs)
  - Billing & Plans
- Visual indicators with icons
- Admin badge in header
- Responsive design with mobile toggle

### UI Components Used
- **Cards**: Stats display, content containers
- **Tables**: User lists, top performers, audit logs
- **Charts**: Line, Bar, Area, Pie charts (Recharts)
- **Badges**: Status indicators, severity levels
- **Progress Bars**: Resource usage
- **Dialogs**: User creation, log details
- **Tabs**: Organizing settings and charts
- **Avatars**: User identification
- **Scroll Areas**: Long activity feeds

## 🔐 Security Features

1. **Admin Badge**: Visual indicator of admin area
2. **Audit Logging**: All actions tracked with:
   - User identification
   - IP address
   - User agent
   - Timestamp
   - Action type
   - Status (success/failed)

3. **Security Monitoring**:
   - Failed login attempts
   - Unauthorized access attempts
   - Critical system changes
   - User permission changes

## 📊 Analytics & Reporting

### Metrics Tracked
- **Revenue**: Total revenue, costs, profit margins
- **Users**: Growth, active users, retention
- **Documents**: Generation rates, types, trends
- **System**: Performance, uptime, resource usage
- **Activity**: User actions, peak hours, trends

### Visualizations
- Area charts for revenue trends
- Line charts for user growth
- Pie charts for distribution
- Bar charts for comparisons
- Real-time metric cards

## 🛠️ Technical Implementation

### Technologies
- **Next.js 15**: App router, Server Components
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Styling
- **shadcn/ui**: UI components
- **Recharts**: Data visualization
- **Lucide Icons**: Icon library

### Best Practices
- **Responsive Design**: Mobile-first approach
- **Component Reusability**: Modular components
- **Type Safety**: Full TypeScript coverage
- **Performance**: Optimized rendering
- **Accessibility**: ARIA labels, keyboard navigation

## 🚦 Getting Started

### Access the Admin Dashboard
```
Navigate to: /admin
```

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 📝 Usage Examples

### Adding a New Admin Page
1. Create file in `src/app/(app)/admin/your-page/page.tsx`
2. Add route to sidebar in `admin/layout.tsx`
3. Use existing components and styles for consistency

### Customizing Charts
```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const data = [...]; // Your data

<LineChart data={data}>
  <Line dataKey="value" stroke="#3b82f6" />
  <XAxis dataKey="name" />
  <YAxis />
  <Tooltip />
</LineChart>
```

### Adding Filters
```tsx
const [filter, setFilter] = useState("all");

<Select value={filter} onValueChange={setFilter}>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">All</SelectItem>
    <SelectItem value="active">Active</SelectItem>
  </SelectContent>
</Select>
```

## 🔄 Future Enhancements

- [ ] Real-time notifications via WebSockets
- [ ] Advanced role-based access control (RBAC)
- [ ] Custom dashboard widgets
- [ ] Scheduled reports via email
- [ ] Multi-tenancy support
- [ ] Advanced data export (CSV, JSON, PDF)
- [ ] Integration with external monitoring tools
- [ ] Custom alert rules and thresholds
- [ ] API usage analytics
- [ ] Cost analysis and optimization suggestions

## 📞 Support

For questions or issues with the admin dashboard:
1. Check this documentation
2. Review component documentation in code
3. Contact the development team

## 🎉 Summary

The admin dashboard provides a complete solution for:
✅ System monitoring and health checks
✅ User and permission management
✅ Comprehensive analytics and reporting
✅ Security and audit logging
✅ System configuration
✅ Real-time activity tracking

Built with modern technologies and best practices for a scalable, maintainable admin interface.
