# 🧾 Invotrek - Enterprise Multi-Tenant Invoice + Inventory System

> **Production-ready invoice and inventory management platform** with automatic stock deduction, complete multi-tenancy, super admin oversight, and enterprise-grade security.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

---

## 🌟 Overview

Invotrek is a **complete SaaS platform** for invoice and inventory management with:
- ✅ **Multi-Tenancy**: Unlimited businesses in one database
- ✅ **Auto Inventory**: Stock deducts automatically when invoices are created
- ✅ **Super Admin**: System-wide oversight and management
- ✅ **Professional Invoicing**: Auto-calculations, PDF generation
- ✅ **Privacy First**: Complete business data isolation
- ✅ **Enterprise Ready**: Scalable, secure, and well-documented

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup inventory system
npm run migrate:inventory

# 3. Create SuperAdmin account
npm run create:superadmin

# 4. Seed demo data (optional)
npm run db:setup

# 5. Start development server
npm run dev
```

**Access the system:**
- Application: `http://localhost:9002`
- Register Business: `http://localhost:9002/register`
- Super Admin: Login with `SuperAdmin` / `DefaultPass123`

---

## 🔐 Access Credentials

### Super Admin
```
Username: SuperAdmin
Password: DefaultPass123
```
⚠️ **Change immediately in production!**

### Demo Business Accounts
```
Business 1: admin@acme.com / password123
Business 2: admin@techinnovations.com / password123
```

---

## 🎯 Key Features

### For Businesses
- 📦 **Auto Inventory** - Stock deducts automatically when invoices are created
- 📝 **Professional Invoices** - Multi-line items with tax & discounts
- 👥 **Customer Management** - Unlimited customers per business
- 🛍️ **Product Catalog** - Maintain products/services with stock levels
- 💰 **Payment Tracking** - Automatic reconciliation
- 📄 **PDF Generation** - Beautiful, downloadable invoices
- 📊 **Dashboard Analytics** - Revenue and performance metrics
- 🔔 **Low Stock Alerts** - Never run out of inventory
- ⚙️ **Customization** - Invoice numbering, terms, branding

### For Platform Owners
- 🔐 **Super Admin** - System-wide visibility and control
- 🏢 **Multi-Tenant** - Infinite business scalability
- 📈 **Analytics** - Cross-platform statistics
- 🛡️ **Privacy Protected** - GDPR-compliant design
- 🔍 **Monitoring** - System health and activity tracking
- 🚀 **Zero Config** - Automated business setup

---

## 🚀 Available Commands

### Development
```bash
npm run dev                # Start dev server (port 9002)
npm run build              # Build for production
npm start                  # Start production server
```

### Database
```bash
npm run migrate:inventory  # Setup inventory system
npm run db:setup           # Populate demo data
npm run db:studio          # Open database GUI
npm run db:reset           # Reset & reseed database
npm run create:superadmin  # Create SuperAdmin account
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[FINAL_SYSTEM_OVERVIEW.md](./FINAL_SYSTEM_OVERVIEW.md)** | **Complete system overview** ⭐ |
| [INVENTORY_SYSTEM_GUIDE.md](./INVENTORY_SYSTEM_GUIDE.md) | **Inventory management guide** 📦 |
| [PRODUCTION_READY_GUIDE.md](./PRODUCTION_READY_GUIDE.md) | Production deployment guide |
| [GETTING_STARTED.md](./GETTING_STARTED.md) | Step-by-step tutorial |
| [MULTI_TENANT_INVOICE_SYSTEM.md](./MULTI_TENANT_INVOICE_SYSTEM.md) | Technical documentation |

---

## 🎉 Summary

Invotrek is a **complete, production-ready SaaS platform** featuring:

✅ **Automatic inventory management** - Stock deducts on invoice creation
✅ Multi-tenant architecture (2 roles: Business Admin + Super Admin)
✅ Comprehensive 4-step business registration
✅ Stock movement tracking (IN/OUT/ADJUSTMENT)
✅ Low stock alerts and out-of-stock prevention
✅ Professional PDF invoice generation
✅ Complete payment tracking
✅ Enterprise-grade security
✅ Beautiful, responsive UI
✅ Fully documented and tested

### Ready to Launch! 🚀

```bash
npm run dev
```

Visit `http://localhost:9002/register` to start!

---

**Built with ❤️ for modern businesses** - *Transform your invoicing process with Invotrek* 💼✨
