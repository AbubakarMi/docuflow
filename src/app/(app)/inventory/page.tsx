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
import { MoreVertical, PlusCircle } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { formatCurrency } from "@/lib/utils";
import { AddItemDialog } from "@/components/inventory/add-item-dialog";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditItemDialog } from "@/components/inventory/edit-item-dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const initialInventoryItems = [
    { id: '1', name: 'Jollof Rice', category: 'Food', cost: 500, price: 1500, quantity: 50, imageUrl: 'https://picsum.photos/seed/jollof/200/200' },
    { id: '2', name: 'Coca-Cola', category: 'Drinks', cost: 100, price: 250, quantity: 100, imageUrl: 'https://picsum.photos/seed/coke/200/200' },
    { id: '3', name: 'Beef Samosa', category: 'Snacks', cost: 150, price: 400, quantity: 200, imageUrl: 'https://picsum.photos/seed/samosa/200/200' },
    { id: '4', name: 'Bottle of Water', category: 'Drinks', cost: 50, price: 150, quantity: 150, imageUrl: 'https://picsum.photos/seed/water/200/200' },
    { id: '5', name: 'Fried Rice', category: 'Food', cost: 500, price: 1500, quantity: 40, imageUrl: 'https://picsum.photos/seed/friedrice/200/200' },
];

export type InventoryItem = typeof initialInventoryItems[0];

export default function InventoryPage() {
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

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

  const handleUpdateItem = (updatedItem: InventoryItem) => {
    setInventoryItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditingItem(null);
  }

  const groupedItems = inventoryItems.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {} as Record<string, InventoryItem[]>);

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
          <CardTitle>Items by Category</CardTitle>
          <CardDescription>
            List of your current inventory, organized by category.
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
                <Accordion type="multiple" defaultValue={Object.keys(groupedItems)} className="w-full">
                  {Object.entries(groupedItems).map(([category, items]) => (
                    <AccordionItem value={category} key={category}>
                      <AccordionTrigger className="text-lg font-medium">{category} ({items.length})</AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableHeader>
                          <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead className="text-right">Cost</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead className="text-right">Quantity</TableHead>
                              <TableHead className="text-right">Profit / Unit</TableHead>
                              <TableHead className="text-right w-[50px]">Actions</TableHead>
                          </TableRow>
                          </TableHeader>
                          <TableBody>
                          {items.map((item) => (
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
                                  <TableCell className="text-right">
                                      <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                                  <MoreVertical className="h-4 w-4" />
                                              </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                              <DropdownMenuItem onClick={() => setEditingItem(item)}>
                                                  Edit
                                              </DropdownMenuItem>
                                              <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                                          </DropdownMenuContent>
                                      </DropdownMenu>
                                  </TableCell>
                              </TableRow>
                          ))}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
            )}
        </CardContent>
      </Card>
      
      {editingItem && (
        <EditItemDialog
          item={editingItem}
          onUpdateItem={handleUpdateItem}
          onOpenChange={(isOpen) => !isOpen && setEditingItem(null)}
        />
      )}
    </div>
  );
}
