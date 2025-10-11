"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  History,
  Upload
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function StockManagementPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddStockOpen, setIsAddStockOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  // Form states
  const [quantity, setQuantity] = useState("")
  const [reason, setReason] = useState("")
  const [notes, setNotes] = useState("")

  // Mock data - replace with actual API calls
  const inventoryStats = {
    totalProducts: 150,
    totalValue: 245600,
    lowStockItems: 12,
    outOfStock: 3
  }

  const products = [
    {
      id: "1",
      sku: "DRINK-001",
      name: "Coca Cola 500ml",
      category: "Beverages",
      stockQuantity: 48,
      lowStockAlert: 20,
      price: 1.50,
      cost: 0.80,
      lastRestocked: "2025-10-08"
    },
    {
      id: "2",
      sku: "DRINK-002",
      name: "Pepsi 500ml",
      category: "Beverages",
      stockQuantity: 15,
      lowStockAlert: 20,
      price: 1.50,
      cost: 0.80,
      lastRestocked: "2025-10-05"
    },
    {
      id: "3",
      sku: "SNACK-001",
      name: "Lay's Chips",
      category: "Snacks",
      stockQuantity: 85,
      lowStockAlert: 30,
      price: 2.00,
      cost: 1.20,
      lastRestocked: "2025-10-09"
    },
  ]

  const getStockStatus = (current: number, alert: number) => {
    if (current === 0) {
      return { label: "Out of Stock", variant: "destructive" as const, icon: <AlertTriangle className="h-3 w-3" /> }
    } else if (current <= alert) {
      return { label: "Low Stock", variant: "destructive" as const, icon: <TrendingDown className="h-3 w-3" /> }
    } else {
      return { label: "In Stock", variant: "success" as const, icon: <TrendingUp className="h-3 w-3" /> }
    }
  }

  const handleAddStock = async () => {
    if (!quantity || parseInt(quantity) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid quantity",
        variant: "destructive"
      })
      return
    }

    // TODO: Call API to add stock
    console.log("Adding stock:", {
      productId: selectedProduct?.id,
      quantity: parseInt(quantity),
      reason,
      notes
    })

    toast({
      title: "Success",
      description: `Added ${quantity} units to ${selectedProduct?.name}`,
    })

    setIsAddStockOpen(false)
    setQuantity("")
    setReason("")
    setNotes("")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Management</h1>
          <p className="text-muted-foreground">Upload and manage your inventory</p>
        </div>
        <Button size="lg">
          <Upload className="mr-2 h-5 w-5" />
          Bulk Upload
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Tracking inventory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${inventoryStats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total stock value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{inventoryStats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">
              Items need restocking
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{inventoryStats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">
              Urgent restocking needed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Manage your stock levels</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Alert Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Last Restocked</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => {
                  const status = getStockStatus(product.stockQuantity, product.lowStockAlert)
                  const stockValue = product.stockQuantity * product.cost

                  return (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {product.stockQuantity}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {product.lowStockAlert}
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                          {status.icon}
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${stockValue.toFixed(2)}
                      </TableCell>
                      <TableCell>{product.lastRestocked}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog open={isAddStockOpen && selectedProduct?.id === product.id} onOpenChange={(open) => {
                            setIsAddStockOpen(open)
                            if (open) setSelectedProduct(product)
                          }}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Add Stock
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Stock</DialogTitle>
                                <DialogDescription>
                                  Add units to {product.name}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Current Stock</Label>
                                  <div className="text-2xl font-bold">{product.stockQuantity} units</div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="quantity">Quantity to Add *</Label>
                                  <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    placeholder="Enter quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="reason">Reason</Label>
                                  <Input
                                    id="reason"
                                    placeholder="e.g., New shipment, Restock"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="notes">Notes (Optional)</Label>
                                  <Textarea
                                    id="notes"
                                    placeholder="Additional notes..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={3}
                                  />
                                </div>

                                {quantity && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="text-sm font-medium text-blue-900">
                                      New Stock: {product.stockQuantity + parseInt(quantity || "0")} units
                                    </div>
                                  </div>
                                )}

                                <div className="flex justify-end gap-2 pt-4">
                                  <Button variant="outline" onClick={() => setIsAddStockOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleAddStock}>
                                    Add Stock
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button variant="ghost" size="sm">
                            <History className="h-4 w-4 mr-1" />
                            History
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
