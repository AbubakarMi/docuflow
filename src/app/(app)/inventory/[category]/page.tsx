
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
import { MoreVertical, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditItemDialog } from "@/components/inventory/edit-item-dialog";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const initialInventoryItems = [
    { id: '1', name: 'Jollof Rice', category: 'Food', cost: 500, price: 1500, quantity: 50, imageUrl: 'https://picsum.photos/seed/jollof/200/200' },
    { id: '2', name: 'Coca-Cola', category: 'Drinks', cost: 100, price: 250, quantity: 100, imageUrl: 'https://picsum.photos/seed/coke/200/200' },
    { id: '3', name: 'Beef Samosa', category: 'Snacks', cost: 150, price: 400, quantity: 200, imageUrl: 'https://picsum.photos/seed/samosa/200/200' },
    { id: '4', name: 'Bottle of Water', category: 'Drinks', cost: 50, price: 150, quantity: 150, imageUrl: 'https://picsum.photos/seed/water/200/200' },
    { id: '5', name: 'Fried Rice', category: 'Food', cost: 500, price: 1500, quantity: 40, imageUrl: 'https://picsum.photos/seed/friedrice/200/200' },
];

export type InventoryItem = typeof initialInventoryItems[0];

export default function InventoryCategoryPage() {
  const [inventoryItems, setInventoryItems] = useState(initialInventoryItems);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const params = useParams();
  const router = useRouter();
  
  const category = Array.isArray(params.category) ? params.category[0] : params.category;
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  const itemsInCategory = inventoryItems.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );

  const handleUpdateItem = (updatedItem: InventoryItem) => {
    setInventoryItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditingItem(null);
  }

  return (
    <div className="flex flex-col gap-6">
       <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-8 w-8" asChild>
          <Link href="/inventory">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
            <h1 className="text-3xl font-bold tracking-tight">{categoryName}</h1>
            <p className="text-muted-foreground">
                Manage items in the {categoryName} category.
            </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Items in {categoryName}</CardTitle>
          <CardDescription>
            A list of all items in this category.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                {itemsInCategory.map((item) => (
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
