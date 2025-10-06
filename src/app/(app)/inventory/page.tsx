import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Package } from "lucide-react";
import Image from "next/image";

const inventoryItems = [
    { id: '1', name: 'Premium Website Template', cost: 50, price: 299, quantity: 100 },
    { id: '2', name: 'Consulting Hour', cost: 20, price: 150, quantity: 500 },
    { id: '3', name: 'Logo Design Package', cost: 100, price: 500, quantity: 50 },
    { id: '4', name: 'Monthly SEO Service', cost: 200, price: 750, quantity: 20 },
];

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function InventoryPage() {
  const isEmpty = inventoryItems.length === 0;

  const totals = inventoryItems.reduce((acc, item) => {
    acc.revenue += item.price * item.quantity;
    acc.cost += item.cost * item.quantity;
    return acc;
  }, { revenue: 0, cost: 0 });

  const profit = totals.revenue - totals.cost;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Track your products and services.
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle>Total Potential Revenue</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totals.revenue)}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totals.cost)}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Total Potential Profit</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatCurrency(profit)}</div>
            </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
          <CardDescription>
            List of your current inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {isEmpty ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm py-24">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Image 
                      src="https://picsum.photos/seed/docuflow-empty-inventory/400/300"
                      width={400}
                      height={300}
                      alt="Empty inventory"
                      className="mb-4 rounded-lg"
                      data-ai-hint="empty box"
                    />
                    <h3 className="text-2xl font-bold tracking-tight">
                      Your inventory is empty
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add items to start tracking your profit.
                    </p>
                    <Button className="mt-4">
                      <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                    </Button>
                  </div>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Profit / Unit</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {inventoryItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.cost)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className={`text-right font-medium ${item.price - item.cost >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {formatCurrency(item.price - item.cost)}
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
