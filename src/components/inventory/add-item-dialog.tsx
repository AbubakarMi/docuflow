
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  cost: z.coerce.number().min(0, "Cost must be a positive number"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  quantity: z.coerce.number().int().min(0, "Quantity must be a positive integer"),
});

type ItemFormValues = z.infer<typeof itemSchema>;

type AddItemDialogProps = {
  children: React.ReactNode;
  onAddItem: (item: ItemFormValues) => void;
};

export function AddItemDialog({ children, onAddItem }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      cost: 0,
      price: 0,
      quantity: 1,
    },
  });

  const onSubmit = (data: ItemFormValues) => {
    onAddItem(data);
    toast({
      title: "Item Added",
      description: `${data.name} has been added to your inventory.`,
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>
            Add a new product or service to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...form.register("name")} />
            {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost">Cost (₦)</Label>
              <Input id="cost" type="number" {...form.register("cost")} />
               {form.formState.errors.cost && <p className="text-red-500 text-xs">{form.formState.errors.cost.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₦)</Label>
              <Input id="price" type="number" {...form.register("price")} />
              {form.formState.errors.price && <p className="text-red-500 text-xs">{form.formState.errors.price.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input id="quantity" type="number" {...form.register("quantity")} />
            {form.formState.errors.quantity && <p className="text-red-500 text-xs">{form.formState.errors.quantity.message}</p>}
          </div>
          <DialogFooter>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
