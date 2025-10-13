"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { PlusCircle, ChevronRight, Package } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { formatCurrency } from "@/lib/utils";
import { AddItemDialog } from "@/components/inventory/add-item-dialog";
import { useState } from "react";
import Link from "next/link";
import { InventoryItem } from "./[category]/page";

// No initial inventory items - start with empty inventory
const initialInventoryItems: InventoryItem[] = [];

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  
  const isEmpty = inventoryItems.length === 0;
  const emptyInventoryImage = PlaceHolderImages.find(p => p.id === 'inventory-empty');

  const totals = inventoryItems.reduce((acc, item) => {
    acc.revenue += item.price * item.quantity;
    acc.cost += item.cost * item.quantity;
    return acc;
  }, { revenue: 0, cost: 0 });

  const profit = totals.revenue - totals.cost;

  const handleAddItem = (item: Omit<InventoryItem, 'id'>) => {
    setInventoryItems(prev => [...prev, { ...item, id: String(prev.length + 1) }]);
  };

  const categories = [...new Set(inventoryItems.map(item => item.category))];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Track your products and services, grouped by category.
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
          <CardTitle>Item Categories</CardTitle>
          <CardDescription>
            Select a category to view its items.
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
                      Add an item to get started.
                    </p>
                    <AddItemDialog onAddItem={handleAddItem}>
                      <Button className="mt-4">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                      </Button>
                    </AddItemDialog>
                  </div>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => {
                    const itemCount = inventoryItems.filter(item => item.category === category).length;
                    return (
                      <Link href={`/inventory/${category.toLowerCase()}`} key={category}>
                        <Card className="hover:bg-muted/50 transition-colors">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-medium">{category}</CardTitle>
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                          </CardContent>
                          <CardFooter>
                              <Button variant="link" className="p-0 h-auto text-sm">
                                View Items
                                <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
