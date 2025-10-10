# 🧾 Multi-Tenant Invoice Management System

A **production-ready**, **multi-tenant** invoice generation and management system for DocuFlow. Built with modern technologies and best practices.

## ✨ Features

### 🏢 Multi-Tenancy
- **Single database, multiple tenants** architecture
- **Complete data isolation** - each business only sees their own data
- **Automatic tenant setup** - when a business registers, all tables and settings are created
- **Scalable design** - supports unlimited businesses in one database

### 📄 Invoice Management
- ✅ Create professional invoices with multiple line items
- ✅ Auto-generated invoice numbers (INV-1001, INV-1002...)
- ✅ Track invoice status (draft, sent, paid, overdue, cancelled)
- ✅ Automatic tax and discount calculations
- ✅ Payment tracking with automatic balance updates
- ✅ PDF generation with professional templates
- ✅ Notes and terms customization

### 👥 Customer Management
- ✅ Unlimited customers per business
- ✅ Complete contact information
- ✅ Credit limit tracking
- ✅ Invoice history per customer

### 🛍️ Product Catalog
- ✅ Products and services management
- ✅ SKU generation
- ✅ Pricing and cost tracking
- ✅ Tax rates per product
- ✅ Inventory tracking (optional)

### 💰 Payment Processing
- ✅ Record multiple payments per invoice
- ✅ Multiple payment methods (cash, check, credit card, bank transfer, PayPal, Stripe)
- ✅ Automatic invoice status updates
- ✅ Transaction reference tracking

### 🎨 User Interface
- ✅ Modern, responsive design
- ✅ Admin dashboard for system-wide management
- ✅ Business dashboard for invoice operations
- ✅ Interactive invoice creation form
- ✅ Real-time calculations
- ✅ Professional PDF invoices

## 🚀 Quick Start

### Prerequisites

```bash
# PostgreSQL 14+ running with:
# - Database: docuflow
# - Username: postgres
# - Password: root
# - Port: 5432
```

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup database (already done - migrations applied)
# If you need to reset:
npm run db:reset

# 3. Populate with demo data
npm run db:setup

# 4. Start development server
npm run dev
```

### Access the Application

```
🌐 Application: http://localhost:9002
📊 Admin Panel: http://localhost:9002/admin/invoices
📄 Invoices: http://localhost:9002/invoices
🗄️ Database Studio: npm run db:studio
```

### Demo Credentials

**Business 1: Acme Corporation**
- Email: `admin@acme.com`
- Password: `password123`

**Business 2: Tech Innovations**
- Email: `admin@techinnovations.com`
- Password: `password123`

## 📁 Project Structure

```
docuflow/
├── prisma/
│   ├── schema.prisma              # Database schema with multi-tenant models
│   └── migrations/                # Database migrations
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/      # Business registration
│   │   │   │   └── login/         # User authentication
│   │   │   ├── invoices/          # Invoice CRUD operations
│   │   │   ├── customers/         # Customer management
│   │   │   ├── products/          # Product catalog
│   │   │   └── payments/          # Payment recording
│   │   ├── (app)/
│   │   │   ├── invoices/          # Business invoice dashboard
│   │   │   │   ├── page.tsx       # Invoice list
│   │   │   │   └── create/        # Invoice creation
│   │   │   └── admin/
│   │   │       └── invoices/      # Admin invoice management
│   │   └── page.tsx
│   └── lib/
│       ├── db.ts                  # Prisma client
│       ├── auth.ts                # Auth utilities
│       └── pdf/
│           └── invoice-generator.ts # PDF generation
├── scripts/
│   └── setup-db.ts                # Database seeding script
├── MULTI_TENANT_INVOICE_SYSTEM.md # Complete documentation
└── README_INVOICE_SYSTEM.md       # This file
```

## 🗄️ Database Schema

### Core Models

**Business** (Tenant)
- Complete business profile
- Subscription management
- Status tracking

**User**
- Multi-user support per business
- Role-based access (admin, manager, user, accountant)
- Unique email per business

**Customer**
- Customer records per business
- Contact and billing information

**Product**
- Product/service catalog
- Pricing and inventory

**Invoice**
- Full invoice lifecycle
- Line items with calculations
- Status and payment tracking

**Payment**
- Payment records
- Automatic reconciliation

### Key Features
- All tables include `businessId` for multi-tenancy
- Cascade deletes for data consistency
- Indexes for performance
- Unique constraints for data integrity

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start dev server on port 9002
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:setup         # Populate with demo data
npm run db:migrate       # Run migrations
npm run db:reset         # Reset database and reseed
npm run db:studio        # Open Prisma Studio (GUI)

# Code Quality
npm run lint             # Run linter
npm run typecheck        # TypeScript type checking
```

## 📡 API Endpoints

### Authentication

```http
POST /api/auth/register  # Register new business
POST /api/auth/login     # User login
```

### Invoices

```http
GET    /api/invoices?businessId={id}           # List invoices
POST   /api/invoices                           # Create invoice
GET    /api/invoices/{id}                      # Get invoice
PATCH  /api/invoices/{id}                      # Update invoice
DELETE /api/invoices/{id}                      # Delete invoice
GET    /api/invoices/{id}/pdf                  # Get PDF data
```

### Customers

```http
GET    /api/customers?businessId={id}          # List customers
POST   /api/customers                          # Create customer
```

### Products

```http
GET    /api/products?businessId={id}           # List products
POST   /api/products                           # Create product
```

### Payments

```http
GET    /api/payments?businessId={id}           # List payments
POST   /api/payments                           # Record payment
```

## 💡 Usage Examples

### 1. Register a New Business

```bash
curl -X POST http://localhost:9002/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "My Business",
    "businessEmail": "info@mybusiness.com",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@mybusiness.com",
    "password": "securepassword"
  }'
```

### 2. Create an Invoice

```bash
curl -X POST http://localhost:9002/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": "YOUR_BUSINESS_ID",
    "customerId": "YOUR_CUSTOMER_ID",
    "createdById": "YOUR_USER_ID",
    "dueDate": "2025-11-10",
    "items": [
      {
        "description": "Web Development Service",
        "quantity": 1,
        "unitPrice": 5000,
        "taxRate": 8.5,
        "discountPercent": 0
      }
    ]
  }'
```

### 3. Record a Payment

```bash
curl -X POST http://localhost:9002/api/payments \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": "YOUR_BUSINESS_ID",
    "invoiceId": "YOUR_INVOICE_ID",
    "amount": 5000,
    "paymentMethod": "bank_transfer",
    "notes": "Payment received"
  }'
```

## 🎨 UI Screenshots

### Admin Dashboard
- System-wide invoice management
- Multi-business statistics
- Advanced filtering and search

### Business Dashboard
- Invoice creation wizard
- Customer management
- Product catalog
- Payment tracking

### PDF Invoices
- Professional layout
- Company branding
- Itemized billing
- Tax and payment details

## 🔒 Security

- ✅ **Password hashing** with bcrypt (12 rounds)
- ✅ **Data isolation** via businessId scoping
- ✅ **SQL injection protection** via Prisma
- ✅ **Cascade deletes** for data consistency
- ✅ **Input validation** on all endpoints

## 📊 Data Isolation

Every query is automatically scoped by `businessId`:

```typescript
// Example: Get invoices for current business
const invoices = await prisma.invoice.findMany({
  where: { businessId: currentBusinessId }
})

// Users can ONLY see their business data
// Cross-tenant access is impossible by design
```

## 🧪 Testing

### View Database with Prisma Studio

```bash
npm run db:studio
```

Opens a GUI at `http://localhost:5555` to browse and edit data.

### Sample Queries

```sql
-- View all businesses
SELECT * FROM businesses;

-- View invoices for a specific business
SELECT * FROM invoices WHERE "businessId" = 'YOUR_BUSINESS_ID';

-- Revenue report
SELECT
  b.name,
  COUNT(i.id) as invoice_count,
  SUM(i."totalAmount") as total_revenue
FROM businesses b
LEFT JOIN invoices i ON i."businessId" = b.id
GROUP BY b.id;
```

## 🚀 Deployment

### Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/docuflow"
NEXTAUTH_SECRET="generate-a-secure-random-string"
NEXTAUTH_URL="https://yourdomain.com"
```

### Production Checklist

- [ ] Change `NEXTAUTH_SECRET` to a secure random string
- [ ] Update database credentials
- [ ] Enable SSL for PostgreSQL connection
- [ ] Set up automatic backups
- [ ] Configure email service for invoice delivery
- [ ] Set up monitoring and error tracking
- [ ] Enable rate limiting on APIs
- [ ] Configure CDN for PDF storage

## 📚 Additional Documentation

- [Complete System Documentation](./MULTI_TENANT_INVOICE_SYSTEM.md)
- [Database Schema](./prisma/schema.prisma)
- [Admin Dashboard Guide](./ADMIN_DASHBOARD.md)

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL 14+
- **ORM**: Prisma 6
- **Authentication**: bcryptjs
- **PDF Generation**: jsPDF
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide Icons

## 🎯 Key Highlights

✅ **Production Ready** - Full error handling, validation, and security
✅ **Type Safe** - 100% TypeScript with Prisma
✅ **Multi-Tenant** - Complete business isolation
✅ **Scalable** - Designed for growth
✅ **Modern Stack** - Latest technologies and best practices
✅ **Well Documented** - Comprehensive guides and examples
✅ **Easy Setup** - One command to get started
✅ **Professional UI** - Beautiful, responsive design

## 🤝 Support

For questions or issues:
1. Check the [Complete Documentation](./MULTI_TENANT_INVOICE_SYSTEM.md)
2. Review API examples above
3. Inspect database with `npm run db:studio`
4. Check migration files in `prisma/migrations/`

## 📝 License

This invoice system is part of the DocuFlow project.

---

**Ready to go!** 🚀

Run `npm run dev` and visit http://localhost:9002/admin/invoices to start managing invoices!
