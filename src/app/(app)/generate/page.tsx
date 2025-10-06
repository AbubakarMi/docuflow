
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { PlusCircle, Trash2 } from "lucide-react";

export default function GeneratePage() {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Invoice</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create your invoice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>From</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="from-name">Company Name</Label>
              <Input id="from-name" placeholder="Your Company LLC" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from-address">Address</Label>
              <Input id="from-address" placeholder="123 Main St, Anytown, USA" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to-name">Client Name</Label>
              <Input id="to-name" placeholder="Client Inc." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-address">Client Address</Label>
              <Input id="to-address" placeholder="456 Oak Ave, Someplace, USA" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-number">Invoice Number</Label>
              <Input id="invoice-number" placeholder="INV-001" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-date">Date of Issue</Label>
              <Input id="issue-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Input id="due-date" type="date" />
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px] text-right">Qty</TableHead>
                <TableHead className="w-[120px] text-right">Price</TableHead>
                <TableHead className="w-[120px] text-right">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <Input placeholder="e.g. Website Design" />
                </TableCell>
                <TableCell>
                  <Input type="number" placeholder="1" className="text-right" />
                </TableCell>
                <TableCell>
                  <Input type="number" placeholder="100.00" className="text-right" />
                </TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(10000, 'NGN')}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button variant="outline" className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </CardContent>
      </Card>

        <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-4">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(10000, 'NGN')}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="font-medium">{formatCurrency(1000, 'NGN')}</span>
                </div>
                <div className="flex justify-between border-t pt-4">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">{formatCurrency(11000, 'NGN')}</span>
                </div>
            </div>
        </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Preview</Button>
        <Button>Generate DOCX</Button>
        <Button>Generate PDF</Button>
      </div>
    </div>
  );
}
