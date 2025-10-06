
"use client";

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
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { formatCurrency } from "@/lib/utils";
import { AddItemDialog } from "@/components/inventory/add-item-dialog";
import { useState } from "react";

const initialInventoryItems = [
    { id: '1', name: 'Premium Website Template', cost: 5000, price: 29900, quantity: 100, imageUrl: 'https://picsum.photos/seed/webtemplate/200/200' },
    { id: '2', name: 'Consulting Hour', cost: 2000, price: 15000, quantity: 500, imageUrl: 'https://picsum.photos/seed/consulting/200/200' },
    { id: '3', name: 'Logo Design Package', cost: 10000, price: 50000, quantity: 50, imageUrl: 'https://picsum.photos/seed/logodesign/200/200' },
    { id: '4', name: 'Monthly SEO Service', cost: 20000, price: 75000, quantity: 20, imageUrl: 'https://picsum.photos/seed/seo/200/200' },
];

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const isEmpty = inventoryItems.length === 0;
  const emptyInventoryImage = PlaceHolderImages.find(p => p.id === 'inventory-empty');

  const totals = inventoryItems.reduce((acc, item) => {
    acc.revenue += item.price * item.quantity;
    acc.cost += item.cost * item.quantity;
    return acc;
  }, { revenue: 0, cost: 0 });

  const profit = totals.revenue - totals.cost;

  const handleAddItem = (item: Omit<typeof initialInventoryItems[0], 'id'>) => {
    setInventoryItems(prev => [...prev, { ...item, id: String(prev.length + 1) }]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Track your products and services.
          </p>
        </div>
        <AddItemDialog onAddItem={handleAddItem}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </AddItemDialog>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle>Total Potential Revenue</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totals.revenue, 'NGN')}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Total Cost</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totals.cost, 'NGN')}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Total Potential Profit</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>{formatCurrency(profit, 'NGN')}</div>
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
                      src={emptyInventoryImage?.imageUrl || "https://picsum.photos/seed/docuflow-empty-inventory/400/300"}
                      width={400}
                      height={300}
                      alt={emptyInventoryImage?.description || "Empty inventory"}
                      className="mb-4 rounded-lg"
                      data-ai-hint={emptyInventoryImage?.imageHint}
                    />
                    <h3 className="text-2xl font-bold tracking-tight">
                      Your inventory is empty
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Add items to start tracking your profit.
                    </p>
                    <AddItemDialog onAddItem={handleAddItem}>
                      <Button className="mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                      </Button>
                    </AddItemDialog>
                  </div>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Profit / Unit</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {inventoryItems.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={item.imageUrl || "https://picsum.photos/seed/placeholder/40/40"}
                                        alt={item.name}
                                        width={40}
                                        height={40}
                                        className="rounded-md object-cover"
                                    />
                                    <span>{item.name}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">{formatCurrency(item.cost, 'NGN')}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.price, 'NGN')}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className={`text-right font-medium ${item.price - item.cost >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {formatCurrency(item.price - item.cost, 'NGN')}
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
