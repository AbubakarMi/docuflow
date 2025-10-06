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
import { PlusCircle, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateInvoiceFromText } from "@/ai/flows/generate-invoice-from-text";

const formSchema = z.object({
  fromName: z.string().optional(),
  fromAddress: z.string().optional(),
  toName: z.string().optional(),
  toAddress: z.string().optional(),
  invoiceNumber: z.string().optional(),
  issueDate: z.string().optional(),
  dueDate: z.string().optional(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number(),
    price: z.number(),
  })),
});

type InvoiceFormValues = z.infer<typeof formSchema>;

export default function GeneratePage() {
  const { toast } = useToast();
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromName: "Your Company LLC",
      fromAddress: "123 Main St, Anytown, USA",
      toName: "",
      toAddress: "",
      invoiceNumber: `INV-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      items: [{ description: "Website Design", quantity: 1, price: 10000 }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const handleGenerateWithAI = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const result = await generateInvoiceFromText({ prompt: aiPrompt });
      
      form.setValue("toName", result.clientName || "");
      form.setValue("toAddress", result.clientAddress || "");
      if(result.invoiceNumber) form.setValue("invoiceNumber", result.invoiceNumber);
      if(result.issueDate) form.setValue("issueDate", result.issueDate);
      if(result.dueDate) form.setValue("dueDate", result.dueDate);

      if (result.items && result.items.length > 0) {
        replace(result.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            price: item.price
        })));
      } else {
        replace([]);
      }

      toast({
        title: "AI Generation Successful",
        description: "The invoice details have been populated.",
      });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not generate invoice details. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };


  const subtotal = form.watch('items').reduce((acc, item) => acc + (item.quantity * item.price), 0);
  const tax = subtotal * 0.10;
  const total = subtotal + tax;

  const handleAction = (action: 'Preview' | 'DOCX' | 'PDF') => {
    toast({
      title: `${action} Generation`,
      description: `Generating ${action.toLowerCase()}... (simulation)`,
    });
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Generate Invoice</h1>
        <p className="text-muted-foreground">
          Fill in the details below to create your invoice, or use AI to generate it from a prompt.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Assist</CardTitle>
          <CardDescription>Describe the invoice you want to create.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., 'Invoice Acme Inc. at 123 Industrial Way for a new website design (₦150,000) and 3 months of SEO service at ₦25,000/month.'"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="min-h-[100px]"
          />
          <Button onClick={handleGenerateWithAI} disabled={isGenerating}>
            <Sparkles className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate with AI"}
          </Button>
        </CardContent>
      </Card>


      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>From</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-name">Company Name</Label>
                <Input id="from-name" {...form.register("fromName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-address">Address</Label>
                <Input id="from-address" {...form.register("fromAddress")} />
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
                <Input id="to-name" {...form.register("toName")} placeholder="Client Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-address">Client Address</Label>
                <Input id="to-address" {...form.register("toAddress")} placeholder="456 Oak Ave, Someplace, USA" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input id="invoice-number" {...form.register("invoiceNumber")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue-date">Date of Issue</Label>
                <Input id="issue-date" type="date" {...form.register("issueDate")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input id="due-date" type="date" {...form.register("dueDate")} />
              </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
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
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <Input {...form.register(`items.${index}.description`)} placeholder="e.g. Website Design" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" {...form.register(`items.${index}.quantity`, { valueAsNumber: true })} className="text-right" />
                    </TableCell>
                    <TableCell>
                      <Input type="number" {...form.register(`items.${index}.price`, { valueAsNumber: true })} className="text-right" />
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(form.watch(`items.${index}.quantity`) * form.watch(`items.${index}.price`), 'NGN')}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button type="button" variant="outline" className="mt-4" onClick={() => append({ description: "", quantity: 1, price: 0 })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </CardContent>
        </Card>

          <div className="flex justify-end mt-6">
              <div className="w-full max-w-sm space-y-4">
                  <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal, 'NGN')}</span>
                  </div>
                  <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span className="font-medium">{formatCurrency(tax, 'NGN')}</span>
                  </div>
                  <div className="flex justify-between border-t pt-4">
                      <span className="text-lg font-bold">Total</span>
                      <span className="text-lg font-bold">{formatCurrency(total, 'NGN')}</span>
                  </div>
              </div>
          </div>
      </form>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={() => handleAction('Preview')}>Preview</Button>
        <Button onClick={() => handleAction('DOCX')}>Generate DOCX</Button>
        <Button onClick={() => handleAction('PDF')}>Generate PDF</Button>
      </div>
    </div>
  );
}
