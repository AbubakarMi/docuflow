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
import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateInvoiceFromText } from "@/ai/flows/generate-invoice-from-text";
import { useSearchParams } from "next/navigation";
import { InvoicePreview } from "@/components/invoice-preview";
import { ExportConfirmationDialog } from "@/components/export-confirmation-dialog";
import { Eye, Download, Loader2 } from "lucide-react";

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

interface BusinessDetails {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country: string
  taxId?: string
  logo?: string
  website?: string
  currency: string
  timezone: string
  settings?: {
    invoicePrefix: string
    nextInvoiceNumber: number
    invoiceTerms?: string
    invoiceNotes?: string
    paymentTermsDays: number
    emailFromName?: string
    emailFromAddress?: string
  }
}

function GeneratePageContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null);
  const [loadingBusiness, setLoadingBusiness] = useState(true);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromName: "",
      fromAddress: "",
      toName: "",
      toAddress: "",
      invoiceNumber: "",
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      items: [{ description: "", quantity: 1, price: 0 }],
    },
  });

  // Fetch business details on mount
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        const response = await fetch('/api/business/details')
        const data = await response.json()

        if (data.success && data.business) {
          setBusinessDetails(data.business)

          // Update form with business details
          form.setValue('fromName', data.business.name)
          const businessAddress = [
            data.business.address,
            data.business.city,
            data.business.state,
            data.business.zipCode,
            data.business.country
          ].filter(Boolean).join(', ')
          form.setValue('fromAddress', businessAddress)

          // Set invoice number with prefix
          if (data.business.settings) {
            const invoiceNumber = `${data.business.settings.invoicePrefix}-${String(data.business.settings.nextInvoiceNumber).padStart(4, '0')}`
            form.setValue('invoiceNumber', invoiceNumber)

            // Set due date based on payment terms
            const dueDate = new Date()
            dueDate.setDate(dueDate.getDate() + data.business.settings.paymentTermsDays)
            form.setValue('dueDate', dueDate.toISOString().split('T')[0])
          }
        }
      } catch (error) {
        console.error('Failed to fetch business details:', error)
        toast({
          title: 'Warning',
          description: 'Could not load business details. Using default values.',
          variant: 'destructive'
        })
      } finally {
        setLoadingBusiness(false)
      }
    }

    fetchBusinessDetails()
  }, [form, toast]);

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    const itemsParam = searchParams.get('items');
    if (itemsParam) {
      try {
        const parsedItems = JSON.parse(itemsParam);
        if (Array.isArray(parsedItems)) {
          replace(parsedItems);
        }
      } catch (error) {
        console.error("Failed to parse items from URL", error);
      }
    }
  }, [searchParams, replace]);

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

  // Prepare invoice data for preview/download
  const prepareInvoiceData = () => {
    const values = form.getValues()

    // Format business address parts
    const businessAddressFull = values.fromAddress || businessDetails?.address || ''

    return {
      invoiceNumber: values.invoiceNumber || 'DRAFT',
      invoiceDate: values.issueDate || new Date().toISOString().split('T')[0],
      dueDate: values.dueDate || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      status: 'draft',

      // Business information from database
      businessName: businessDetails?.name || values.fromName || 'Your Company',
      businessEmail: businessDetails?.email || 'info@company.com',
      businessPhone: businessDetails?.phone || '',
      businessAddress: businessDetails?.address || businessAddressFull.split(',')[0] || '',
      businessCity: businessDetails?.city || '',
      businessState: businessDetails?.state || '',
      businessCountry: businessDetails?.country || 'Nigeria',
      businessLogo: businessDetails?.logo || undefined,

      // Customer information
      customerName: values.toName || 'Customer Name',
      customerEmail: 'customer@email.com',
      customerPhone: '',
      customerAddress: values.toAddress ? values.toAddress.split(',')[0] : '',
      customerCity: values.toAddress ? (values.toAddress.split(',')[1]?.trim() || '') : '',
      customerState: '',
      customerCountry: '',

      // Items
      items: values.items.map(item => ({
        productName: item.description || 'Item',
        description: '',
        quantity: item.quantity,
        price: item.price,
        amount: item.quantity * item.price
      })),

      // Totals
      subtotal,
      taxRate: 10,
      taxAmount: tax,
      discount: 0,
      total,
      currency: businessDetails?.currency || 'NGN',

      // Notes and terms from business settings or defaults
      notes: businessDetails?.settings?.invoiceNotes || 'Thank you for your business!',
      terms: businessDetails?.settings?.invoiceTerms || `Payment is due within ${businessDetails?.settings?.paymentTermsDays || 30} days.`
    }
  }

  const handlePreview = () => {
    setPreviewOpen(true)
  }

  const handleExportClick = () => {
    setExportDialogOpen(true)
  }

  const handleExportConfirm = async (format: 'pdf' | 'docx') => {
    if (format === 'pdf') {
      await handleDownloadPDF()
    } else {
      await handleDownloadDOCX()
    }
  }

  const handleDownloadPDF = async () => {
    setIsDownloading(true)
    try {
      const invoiceData = prepareInvoiceData()

      const response = await fetch('/api/invoices/generate/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invoiceData })
      })

      if (!response.ok) {
        throw new Error('Failed to generate PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Invoice-${invoiceData.invoiceNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Success',
        description: 'PDF invoice downloaded successfully'
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: 'Error',
        description: 'Failed to download PDF invoice',
        variant: 'destructive'
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadDOCX = async () => {
    setIsDownloading(true)
    try {
      const invoiceData = prepareInvoiceData()

      const response = await fetch('/api/invoices/generate/docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ invoiceData })
      })

      if (!response.ok) {
        throw new Error('Failed to generate DOCX')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Invoice-${invoiceData.invoiceNumber}.docx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: 'Success',
        description: 'DOCX invoice downloaded successfully'
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: 'Error',
        description: 'Failed to download DOCX invoice',
        variant: 'destructive'
      })
    } finally {
      setIsDownloading(false)
    }
  }

  // Show loading state while fetching business details
  if (loadingBusiness) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Loading business details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Generate Invoice</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Fill in the details below to create your invoice, or use AI to generate it from a prompt.
        </p>
        {businessDetails && (
          <p className="text-xs sm:text-sm text-emerald-600 mt-2">
            ✓ Business details loaded: {businessDetails.name}
          </p>
        )}
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
              <CardDescription>Your business information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-name">Company Name</Label>
                <Input id="from-name" {...form.register("fromName")} disabled className="bg-slate-50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="from-address">Address</Label>
                <Input id="from-address" {...form.register("fromAddress")} disabled className="bg-slate-50" />
              </div>
              {businessDetails && (
                <div className="text-xs sm:text-sm text-slate-600 space-y-1 p-3 bg-slate-50 rounded-md border">
                  {businessDetails.email && <p className="break-all">Email: {businessDetails.email}</p>}
                  {businessDetails.phone && <p>Phone: {businessDetails.phone}</p>}
                  {businessDetails.taxId && <p>Tax ID: {businessDetails.taxId}</p>}
                  {businessDetails.website && <p className="break-all">Website: {businessDetails.website}</p>}
                </div>
              )}
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
            <CardDescription>
              {businessDetails?.settings && (
                <span className="text-emerald-600">
                  Auto-generated from your business settings
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input
                  id="invoice-number"
                  {...form.register("invoiceNumber")}
                  className="font-mono font-semibold"
                  disabled
                />
                {businessDetails?.settings && (
                  <p className="text-xs text-slate-500">
                    Next: {businessDetails.settings.invoicePrefix}-{String(businessDetails.settings.nextInvoiceNumber + 1).padStart(4, '0')}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="issue-date">Date of Issue</Label>
                <Input id="issue-date" type="date" {...form.register("issueDate")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input id="due-date" type="date" {...form.register("dueDate")} />
                {businessDetails?.settings && (
                  <p className="text-xs text-slate-500">
                    Payment terms: {businessDetails.settings.paymentTermsDays} days
                  </p>
                )}
              </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
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

      <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6">
        <Button variant="outline" onClick={handlePreview} disabled={isDownloading} className="w-full sm:w-auto">
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button onClick={handleExportClick} disabled={isDownloading} className="w-full sm:w-auto">
          {isDownloading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Generate Invoice
        </Button>
      </div>

      {/* Preview Modal */}
      <InvoicePreview
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        data={prepareInvoiceData()}
      />

      {/* Export Confirmation Dialog */}
      <ExportConfirmationDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        onConfirm={handleExportConfirm}
        title="Generate Invoice"
        description="Choose the format for your invoice:"
        isLoading={isDownloading}
      />
    </div>
  );
}


export default function GeneratePage() {
  return (
    <GeneratePageContent />
  );
}
