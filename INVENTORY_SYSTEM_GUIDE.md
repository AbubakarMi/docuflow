# 📦 Inventory Management System - Complete Guide

## 🎯 Overview

DocuFlow now includes a **complete inventory management system** that automatically tracks stock levels and deducts inventory when invoices are created.

---

## ✅ System Features

### 1. **Automatic Stock Deduction**
When you create an invoice with products, the system automatically:
- ✅ Validates stock availability
- ✅ Deducts sold quantity from inventory
- ✅ Records the transaction
- ✅ Updates stock levels in real-time

### 2. **Stock Movement Tracking**
Every inventory change is tracked:
- **IN**: When you add/upload stock
- **OUT**: When products are sold (invoice created)
- **ADJUSTMENT**: Manual stock corrections

### 3. **Low Stock Alerts**
- Set alert thresholds per product
- Visual indicators for low stock items
- Out-of-stock warnings

---

## 🚀 How It Works

### Example Scenario:

**Before Invoice:**
- Product: Coca Cola 500ml
- Stock: 50 units

**Create Invoice:**
- Customer buys 2 units
- System checks: Is 2 ≤ 50? ✅ Yes
- Invoice created successfully

**After Invoice:**
- Stock automatically becomes: 48 units
- Stock movement recorded
- History updated

---

## 📊 Database Structure

### Tables

#### 1. **products**
```sql
- stockQuantity: Current available stock
- trackInventory: Enable/disable tracking
- lowStockAlert: Threshold for alerts
```

#### 2. **stock_movements** (NEW)
```sql
- type: 'in', 'out', 'adjustment'
- quantity: Units moved
- previousQty: Stock before
- newQty: Stock after
- invoiceId: Reference to invoice (if sold)
- reason: Why the movement occurred
- createdBy: Who made the change
```

---

## 🎨 User Interfaces

### 1. Stock Management Page (`/stock`)

**Features:**
- View all inventory with current stock levels
- Add stock with "Add Stock" button
- See stock status (In Stock, Low Stock, Out of Stock)
- View stock value
- Search products
- View history

**Stats Displayed:**
- Total Products
- Inventory Value
- Low Stock Items (needs restocking)
- Out of Stock Items (urgent)

### 2. Invoice Creation (Updated)

**New Behavior:**
- System validates stock before creating invoice
- Shows error if insufficient stock
- Automatically deducts when invoice is created
- Works seamlessly in the background

---

## 📡 API Endpoints

### Get Inventory
```http
GET /api/inventory?businessId={id}
GET /api/inventory?businessId={id}&lowStock=true
```

**Response:**
```json
{
  "products": [
    {
      "id": "...",
      "name": "Coca Cola 500ml",
      "sku": "DRINK-001",
      "stockQuantity": 48,
      "lowStockAlert": 20,
      "price": 1.50,
      "cost": 0.80
    }
  ]
}
```

### Add Stock
```http
POST /api/inventory
Content-Type: application/json

{
  "businessId": "...",
  "productId": "...",
  "quantity": 50,
  "reason": "New shipment",
  "notes": "Supplier: ABC Corp",
  "createdBy": "user-id"
}
```

**What Happens:**
1. Current stock retrieved (e.g., 10)
2. New quantity calculated (10 + 50 = 60)
3. Product updated with new stock
4. Stock movement recorded

### Adjust Stock
```http
PUT /api/inventory
Content-Type: application/json

{
  "businessId": "...",
  "productId": "...",
  "newQuantity": 45,
  "reason": "Inventory correction",
  "createdBy": "user-id"
}
```

### Get Stock History
```http
GET /api/inventory/{productId}/movements?businessId={id}
```

**Response:**
```json
{
  "movements": [
    {
      "type": "out",
      "quantity": 2,
      "previousQty": 50,
      "newQty": 48,
      "invoiceId": "inv-123",
      "reason": "Stock sold via invoice INV-1001",
      "createdAt": "2025-10-10T10:30:00Z"
    },
    {
      "type": "in",
      "quantity": 50,
      "previousQty": 0,
      "newQty": 50,
      "reason": "Initial stock",
      "createdAt": "2025-10-01T09:00:00Z"
    }
  ]
}
```

---

## 💡 Usage Examples

### Example 1: Adding Initial Stock

**Scenario:** You just registered and want to add your first products.

**Steps:**
1. Go to `/stock` (Stock Management)
2. You'll see your products with 0 stock
3. Click "Add Stock" on a product
4. Enter quantity (e.g., 100)
5. Add reason: "Initial inventory"
6. Click "Add Stock"

**Result:**
- Product now has 100 units
- Stock movement recorded
- Ready to sell!

### Example 2: Creating Invoice with Stock

**Scenario:** Customer wants to buy 2 Coca Colas.

**Steps:**
1. Go to `/invoices/create`
2. Select customer
3. Add line item:
   - Product: Coca Cola (Stock: 50)
   - Quantity: 2
4. Review and create invoice

**System Actions:**
1. ✅ Validates: Is 2 ≤ 50? Yes
2. ✅ Creates invoice
3. ✅ Deducts 2 from stock (50 → 48)
4. ✅ Records movement linking to invoice

**Result:**
- Invoice created
- Stock automatically adjusted
- History shows the sale

### Example 3: Insufficient Stock Error

**Scenario:** Customer wants 60 units, but you only have 48.

**Steps:**
1. Try to create invoice with 60 units

**System Response:**
```json
{
  "error": "Insufficient stock",
  "details": [
    {
      "product": "Coca Cola 500ml",
      "available": 48,
      "requested": 60
    }
  ]
}
```

**Result:**
- Invoice NOT created
- Stock unchanged
- User sees clear error message

---

## 🔧 Configuration

### Enable Inventory Tracking

**For Individual Product:**
```typescript
await prisma.product.update({
  where: { id: productId },
  data: {
    trackInventory: true,
    stockQuantity: 100,
    lowStockAlert: 20
  }
})
```

**For All Products:**
```bash
npm run migrate:inventory
```

### Set Low Stock Alerts

```typescript
await prisma.product.update({
  where: { id: productId },
  data: {
    lowStockAlert: 20 // Alert when stock ≤ 20
  }
})
```

---

## 🎯 Two Roles System

### 1. **Business Admin**
- Full access to their business
- Can add/manage stock
- Create invoices (triggers stock deduction)
- View stock history
- Manage products

### 2. **Super Admin**
- View all businesses (system-wide)
- Monitor platform statistics
- Cannot modify individual business stock
- Privacy-protected

---

## 📈 Stock Movement Types

### Type: "in" (Stock Added)
**Triggers:**
- Manual stock upload via `/stock` page
- Bulk import
- Returns/corrections (positive)

**Example:**
```
Previous: 10
Added: 50
New: 60
```

### Type: "out" (Stock Sold)
**Triggers:**
- Invoice creation with products
- Automatic when invoice status changes to "sent" or "paid"

**Example:**
```
Previous: 60
Sold: 2
New: 58
Invoice: INV-1001
```

### Type: "adjustment" (Manual Correction)
**Triggers:**
- Stock correction
- Physical inventory count
- Damage/loss adjustment

**Example:**
```
Previous: 58
Adjusted to: 55
Reason: "3 units damaged"
```

---

## 🚨 Error Handling

### Error 1: Insufficient Stock
**When:** Creating invoice with more units than available

**Response:**
```json
{
  "error": "Insufficient stock",
  "details": [
    {
      "product": "Product Name",
      "available": 10,
      "requested": 15
    }
  ]
}
```

**Solution:** Restock or reduce invoice quantity

### Error 2: Product Not Found
**When:** Trying to add stock to non-existent product

**Solution:** Check product ID or create product first

### Error 3: Negative Quantity
**When:** Trying to set stock to negative value

**Solution:** Use positive numbers only

---

## 📊 Reports & Analytics

### View Stock Levels
```bash
# Visit /stock page
- See all products
- Current stock
- Stock value
- Low stock alerts
```

### View Movement History
```bash
# Click "History" on any product
- See all IN/OUT/ADJUSTMENT movements
- Filter by date
- Export to CSV (coming soon)
```

### Low Stock Report
```bash
GET /api/inventory?businessId={id}&lowStock=true
```

---

## 🔄 Workflow Examples

### Workflow 1: New Business Setup
```
1. Register business
2. Create products with zero stock
3. Upload initial inventory via /stock
4. Set low stock alerts
5. Start creating invoices
6. Stock auto-deducts
```

### Workflow 2: Daily Operations
```
Morning:
1. Check /stock for low stock items
2. Reorder if needed

During Day:
1. Create invoices for customers
2. System auto-deducts stock
3. No manual tracking needed!

Evening:
1. Review stock movements
2. Plan next day's restocking
```

### Workflow 3: End of Week
```
1. Review stock levels
2. Check movement history
3. Identify best sellers (high OUT movements)
4. Identify slow movers (low OUT movements)
5. Adjust purchasing accordingly
```

---

## 💾 Database Migration

**Already Done:**
```bash
npm run migrate:inventory
```

**What It Does:**
- ✅ Creates `stock_movements` table
- ✅ Adds indexes for fast queries
- ✅ Enables tracking for all products

**Safe to Run Multiple Times:**
The script checks if tables exist and won't break anything.

---

## 🎉 Benefits

### For Business Owners
✅ **No Manual Tracking** - System handles everything
✅ **Real-Time Accuracy** - Always know your stock levels
✅ **Prevent Overselling** - Can't sell what you don't have
✅ **Complete History** - Track every movement
✅ **Low Stock Alerts** - Never run out unexpectedly

### For Platform (Super Admin)
✅ **Multi-Tenant** - Each business has separate inventory
✅ **Scalable** - Handles unlimited products/movements
✅ **Audit Trail** - Complete transparency
✅ **Privacy Protected** - Businesses can't see each other's stock

---

## 📝 Summary

Your inventory system is **fully integrated** with:

✅ Automatic stock deduction on invoice creation
✅ Real-time stock level tracking
✅ Complete movement history
✅ Low stock alerts
✅ Stock value calculation
✅ Multi-business isolation
✅ Beautiful UI for management

**Everything works seamlessly in the background!**

---

## 🚀 Quick Start

```bash
# 1. Ensure inventory system is migrated
npm run migrate:inventory

# 2. Start the app
npm run dev

# 3. Go to Stock Management
http://localhost:9002/stock

# 4. Add stock to products
# 5. Create invoices - stock auto-deducts!
```

---

**Your inventory is now fully automated!** 📦✨
