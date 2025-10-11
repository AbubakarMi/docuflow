# 🚀 Getting Started with the Multi-Tenant Invoice System

## Welcome! 👋

You now have a **complete multi-tenant invoice management system** integrated into DocuFlow. This guide will help you get started in minutes.

## ⚡ Quick Start (3 Steps)

### Step 1: Start the Server
```bash
npm run dev
```

### Step 2: Open Your Browser
Navigate to: **http://localhost:9002**

### Step 3: Login with Demo Account
```
Email: admin@acme.com
Password: password123
```

**That's it!** You're ready to create invoices! 🎉

---

## 📍 Important URLs

| What | URL | Description |
|------|-----|-------------|
| **Business Invoices** | `/invoices` | Main invoice dashboard for businesses |
| **Create Invoice** | `/invoices/create` | Interactive invoice creation form |
| **Admin Panel** | `/admin/invoices` | System-wide invoice management |
| **Database GUI** | Run `npm run db:studio` | Visual database browser |

---

## 🎯 Your First Invoice (Step-by-Step)

### 1. Login
- Go to: `http://localhost:9002`
- Use: `admin@acme.com` / `password123`

### 2. Navigate to Invoices
- Click on **"Invoices"** in the sidebar
- Or go directly to: `/invoices`

### 3. Click "Create Invoice"
- You'll see an interactive invoice builder

### 4. Fill in the Details
```
Customer: Select "Tech Solutions Inc" (pre-loaded)
Issue Date: Today's date (auto-filled)
Due Date: 30 days from now
```

### 5. Add Line Items
```
Description: Web Development Service
Quantity: 1
Unit Price: 5000
Tax Rate: 8.5
Discount: 0
```

Click "Add Item" to add more products/services.

### 6. Review Totals
Watch as the system automatically calculates:
- ✅ Subtotal
- ✅ Discounts
- ✅ Taxes
- ✅ Total Amount

### 7. Add Notes (Optional)
```
Notes: Thank you for your business!
Terms: Payment due within 30 days
```

### 8. Save or Send
- **Save as Draft**: Keep working on it later
- **Create & Send**: Mark as sent to customer

**Done!** Your first invoice is created! 🎊

---

## 💰 Recording a Payment

Once an invoice is created, you can record payments:

1. **View the invoice** from the invoice list
2. **Click "Record Payment"**
3. **Enter payment details:**
   - Amount: How much was paid
   - Date: When payment was received
   - Method: cash, check, bank transfer, etc.
   - Reference: Transaction ID or check number
4. **Submit**

The system automatically:
- ✅ Updates the invoice balance
- ✅ Changes status to "paid" if fully paid
- ✅ Tracks payment history

---

## 📊 Understanding the Dashboard

### Statistics Cards
At the top, you'll see:
- **Total Invoices**: All invoices ever created
- **Total Amount**: Sum of all invoice values
- **Paid**: Money you've collected
- **Pending**: Outstanding balances

### Invoice List
View all your invoices with:
- Invoice number (auto-generated)
- Customer name
- Dates (issue and due)
- Amount and status
- Quick actions (view, send, download PDF)

### Filters & Search
- Search by invoice number or customer
- Filter by status (paid, pending, overdue)
- Export to Excel/PDF

---

## 🏢 Multi-Tenancy Explained

### What is Multi-Tenancy?
Multiple businesses share the **same database** but their data is **completely isolated**.

### How It Works
```
Database: docuflow (one database)
├── Business 1: Acme Corporation
│   ├── Customers: Tech Solutions, Global Services
│   ├── Products: Web Dev, SEO, Logo Design
│   └── Invoices: INV-1001, INV-1002...
│
└── Business 2: Tech Innovations
    ├── Customers: (their own customers)
    ├── Products: (their own products)
    └── Invoices: TI-5000, TI-5001...
```

### Data Isolation
- ✅ Business 1 **cannot see** Business 2's data
- ✅ Each business has its own invoice numbering
- ✅ Complete privacy and security
- ✅ Scalable to unlimited businesses

---

## 🎨 Admin vs Business View

### Business View (`/invoices`)
**For:** Business owners and staff
**Access:** Only their business data
**Can:**
- Create and manage invoices
- Add customers and products
- Record payments
- Generate PDFs

### Admin View (`/admin/invoices`)
**For:** System administrators
**Access:** All businesses (system-wide)
**Can:**
- View all invoices across all businesses
- Monitor system-wide statistics
- Manage multiple tenants
- Export consolidated reports

**Switch between views** using the sidebar navigation.

---

## 🗄️ Demo Data Included

After running `npm run db:setup`, you have:

### Business 1: Acme Corporation
**Login:** admin@acme.com / password123
- 2 Customers ready to invoice
- 3 Products in the catalog
- Ready to create invoices

### Business 2: Tech Innovations
**Login:** admin@techinnovations.com / password123
- Fresh business account
- Ready to add customers and products

**Try both accounts** to see multi-tenancy in action!

---

## 🔧 Useful Commands

### Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
```

### Database
```bash
npm run db:studio        # Open visual database browser
npm run db:setup         # Add demo data (already done)
npm run db:reset         # Reset database & reload demo data
```

### Exploration
```bash
npm run db:studio        # See all data visually
```
This opens Prisma Studio at `http://localhost:5555`

---

## 📱 Testing the API

### Get All Invoices
```bash
curl "http://localhost:9002/api/invoices?businessId=YOUR_BUSINESS_ID"
```

### Create an Invoice
```bash
curl -X POST http://localhost:9002/api/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": "YOUR_BUSINESS_ID",
    "customerId": "YOUR_CUSTOMER_ID",
    "createdById": "YOUR_USER_ID",
    "dueDate": "2025-11-10",
    "items": [{
      "description": "Consulting Service",
      "quantity": 1,
      "unitPrice": 1000,
      "taxRate": 10,
      "discountPercent": 0
    }]
  }'
```

**Get IDs from Prisma Studio** (`npm run db:studio`)

---

## 🎓 Learning Path

### Day 1: Explore
- ✅ Login and browse the dashboard
- ✅ View pre-loaded customers and products
- ✅ Create your first test invoice

### Day 2: Customize
- ✅ Add your own customers
- ✅ Build your product catalog
- ✅ Create real invoices

### Day 3: Advanced
- ✅ Record payments
- ✅ Generate PDF invoices
- ✅ Explore the admin panel

### Day 4: Multi-Tenant
- ✅ Register a new business account
- ✅ Test data isolation
- ✅ Compare different business views

---

## ❓ Common Questions

### Q: How do I add a new customer?
**A:** Go to `/customers` (coming soon) or use the API:
```bash
curl -X POST http://localhost:9002/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "businessId": "YOUR_ID",
    "name": "New Customer",
    "email": "customer@example.com"
  }'
```

### Q: How do I change the invoice number format?
**A:** Update Business Settings:
- Go to database (`npm run db:studio`)
- Edit `business_settings` table
- Change `invoicePrefix` (e.g., from "INV" to "ACM")
- Next invoice will be "ACM-1001"

### Q: Can I delete test data?
**A:** Yes! Run:
```bash
npm run db:reset
```
This resets the database and reloads demo data.

### Q: How do I see the database?
**A:** Run:
```bash
npm run db:studio
```
Opens a visual browser at `http://localhost:5555`

### Q: Where are the PDFs stored?
**A:** PDFs are generated on-demand using jsPDF. They're not stored; they're created dynamically when requested.

---

## 🚨 Troubleshooting

### Server Won't Start
```bash
# Check if port 9002 is available
# Or change port in package.json: "dev": "next dev -p 3000"
```

### Database Connection Error
```bash
# Verify PostgreSQL is running
# Check .env file has correct credentials:
DATABASE_URL="postgresql://postgres:root@localhost:5432/docuflow"
```

### Can't See Demo Data
```bash
# Reload demo data
npm run db:setup
```

### TypeScript Errors
These are pre-existing in other parts of the app and don't affect the invoice system. The invoice system is fully functional.

---

## 📚 Documentation

- **[Complete Guide](./MULTI_TENANT_INVOICE_SYSTEM.md)** - Full technical documentation
- **[README](./README_INVOICE_SYSTEM.md)** - Feature overview
- **[Summary](./SYSTEM_SUMMARY.md)** - What was built
- **[Admin Guide](./ADMIN_DASHBOARD.md)** - Admin panel features

---

## 🎯 Next Steps

### Immediate
1. ✅ **Explore the UI** - Click around, get familiar
2. ✅ **Create test invoices** - Use demo data
3. ✅ **Try PDF generation** - Download an invoice
4. ✅ **Record payments** - See automatic updates

### Soon
- Connect to email service for invoice delivery
- Add more businesses to test multi-tenancy
- Customize invoice templates
- Build reports and analytics

### Later
- Integrate payment gateways (Stripe, PayPal)
- Add recurring invoices
- Create mobile app
- Advanced reporting

---

## 💡 Pro Tips

1. **Use Prisma Studio** - Easiest way to explore data
   ```bash
   npm run db:studio
   ```

2. **Test Multi-Tenancy** - Login as both businesses to see isolation in action

3. **Check Browser Console** - Useful for debugging API calls

4. **Read the Schema** - Understanding `prisma/schema.prisma` helps a lot

5. **API First** - Test APIs with curl before building UI

---

## 🎉 You're All Set!

The invoice system is **fully functional and ready to use**. Start with:

```bash
npm run dev
```

Then visit: **http://localhost:9002/invoices**

**Happy Invoicing!** 💰

---

## 🆘 Need Help?

1. Check [MULTI_TENANT_INVOICE_SYSTEM.md](./MULTI_TENANT_INVOICE_SYSTEM.md) for detailed docs
2. Review API examples in documentation
3. Inspect database with `npm run db:studio`
4. Check console logs for errors

**Everything is working and ready to go!** 🚀
