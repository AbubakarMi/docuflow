# SuperAdmin System Guide

## 🚀 Overview

The system now includes a complete SuperAdmin approval workflow and management system. SuperAdmin has full control over business registrations, user management, and system-wide operations.

## 👤 SuperAdmin Credentials

```
Username: SuperAdmin
Email:    abubakarmi131@gmail.com
Password: DefaultPass123
```

**Login Options:**
- Users can log in with **username OR email**
- SuperAdmin can use either: `SuperAdmin` or `abubakarmi131@gmail.com`

## 🔧 Setup

To set up or reset the SuperAdmin account:

```bash
npm run setup:approval
```

This script will:
- Add username column to users table
- Add business approval columns (approved, approvedAt, approvedBy)
- Clean up any existing SuperAdmin accounts
- Create fresh SuperAdmin with correct credentials
- Auto-approve any existing businesses

## 🎯 SuperAdmin Capabilities

### 1. **Business Approval Workflow**
- New businesses register and are set to `approved: false`
- SuperAdmin reviews pending businesses at `/superadmin/approvals`
- Can **approve** or **reject** business registrations
- Rejected businesses are suspended and cannot login
- Approved businesses can proceed to use the system

### 2. **User Management**
- View all users across all businesses at `/superadmin/users`
- See user details, business associations, and status
- Search and filter users system-wide
- Monitor user activity and last login times

### 3. **Business Management**
- View all businesses at `/superadmin` dashboard
- See business stats (users, invoices, revenue)
- Monitor pending approvals
- Track system-wide metrics

### 4. **System Analytics**
- Total businesses (active and pending)
- Total users across all businesses
- Total invoices system-wide
- Total revenue across all businesses
- Monthly growth percentage

## 📍 SuperAdmin Routes

All SuperAdmin routes are under `/superadmin`:

- `/superadmin` - Main dashboard with system stats
- `/superadmin/approvals` - Business approval interface
- `/superadmin/users` - User management
- `/superadmin/businesses` - (Coming soon) Detailed business view
- `/superadmin/templates` - (Coming soon) Template management

## 🔐 Access Control

### SuperAdmin Restrictions:
- **NO access to Scan & Sell** - SuperAdmin is for management only
- **NO business-specific operations** - Cannot create invoices or manage inventory
- **System-level only** - Focus on oversight and approval

### Business Admin Access:
- Can only login if business is **approved**
- Login blocked with message: "Your business is pending SuperAdmin approval"
- Once approved, full access to their business operations

## 🔄 Business Registration Flow

1. **Business Registers** → Creates account with admin user
2. **Status: Pending** → Business set to `approved: false`
3. **Admin Tries to Login** → Blocked with approval message
4. **SuperAdmin Reviews** → Views at `/superadmin/approvals`
5. **SuperAdmin Approves** → Sets `approved: true`, records approval date and SuperAdmin ID
6. **Admin Can Login** → Full access to business features

## 📊 API Endpoints

### SuperAdmin APIs:

```typescript
GET  /api/superadmin/stats              // System-wide statistics
GET  /api/superadmin/businesses         // All businesses with stats
GET  /api/superadmin/businesses/pending // Pending approval businesses
POST /api/superadmin/businesses/approve // Approve/reject business
GET  /api/superadmin/users              // All users across businesses
```

### Authentication:

```typescript
POST /api/auth/login    // Supports username OR email
POST /api/auth/register // Creates pending business
```

## 🗃️ Database Schema Changes

### Users Table:
```sql
username      TEXT UNIQUE  -- New: Support username login
isSuperAdmin  BOOLEAN      -- Identifies SuperAdmin users
```

### Businesses Table:
```sql
approved   BOOLEAN      -- Requires SuperAdmin approval (default: false)
approvedAt TIMESTAMP    -- When business was approved
approvedBy TEXT         -- SuperAdmin user ID who approved
```

## 🎨 UI Components

### SuperAdmin Dashboard Features:
- Real-time system statistics
- Pending approval notifications
- Quick action cards for common tasks
- Businesses table with search
- Links to approval and user management

### Business Approvals Page:
- List of pending businesses
- Detailed business information display
- Admin user details
- One-click approve/reject buttons
- Real-time updates

### User Management Page:
- All users table with search
- Business associations displayed
- Role and status badges
- Last login tracking
- Sortable and filterable

## 🚨 Important Notes

1. **First-Time Setup**: Run `npm run setup:approval` to initialize the system
2. **Existing Businesses**: Will be auto-approved during setup
3. **New Registrations**: Require SuperAdmin approval by default
4. **Login Flexibility**: All users can use username OR email to login
5. **Security**: SuperAdmin cannot be deleted through normal user operations

## 🔮 Coming Soon

- Template upload and management (SuperAdmin only)
- Detailed business view with drill-down
- User activity monitoring
- System health dashboard
- Email notifications for approvals
- Bulk operations (approve multiple businesses)

## 🛠️ Development Commands

```bash
npm run setup:approval     # Create/reset SuperAdmin account
npm run db:migrate         # Run database migrations
npm run dev                # Start development server
npm run db:studio          # Open Prisma Studio
```

## ✅ Testing the Flow

1. **Create SuperAdmin**: `npm run setup:approval`
2. **Login as SuperAdmin**: Use `SuperAdmin` / `DefaultPass123`
3. **Register new business**: Use signup page
4. **Try business login**: Should be blocked (pending approval)
5. **Login as SuperAdmin**: Go to `/superadmin/approvals`
6. **Approve business**: Click approve button
7. **Login as business**: Should now work!

---

**System Status**: ✅ Fully Implemented and Ready for Use
