"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatCurrency } from "@/lib/utils"

interface InvoicePreviewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: {
    invoiceNumber: string
    invoiceDate: string
    dueDate: string
    status: string
    businessName: string
    businessEmail: string
    businessPhone?: string
    businessAddress?: string
    businessCity?: string
    businessState?: string
    businessCountry?: string
    customerName: string
    customerEmail: string
    customerPhone?: string
    customerAddress?: string
    customerCity?: string
    customerState?: string
    customerCountry?: string
    items: Array<{
      productName: string
      description?: string
      quantity: number
      price: number
      amount: number
    }>
    subtotal: number
    taxRate?: number
    taxAmount?: number
    discount?: number
    total: number
    currency: string
    notes?: string
    terms?: string
  }
}

export function InvoicePreview({ open, onOpenChange, data }: InvoicePreviewProps) {
  const businessLocation = [data.businessCity, data.businessState, data.businessCountry]
    .filter(Boolean)
    .join(', ')
  const customerLocation = [data.customerCity, data.customerState, data.customerCountry]
    .filter(Boolean)
    .join(', ')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>

        <div className="bg-white p-8 rounded-lg border">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-indigo-600 mb-2">{data.businessName}</h1>
              <div className="text-sm text-slate-600 space-y-1">
                {data.businessEmail && <p>{data.businessEmail}</p>}
                {data.businessPhone && <p>{data.businessPhone}</p>}
                {data.businessAddress && <p>{data.businessAddress}</p>}
                {businessLocation && <p>{businessLocation}</p>}
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-semibold text-slate-600 mb-4">INVOICE</p>
              <div className="text-sm space-y-1">
                <div className="flex gap-2">
                  <span className="font-semibold">Invoice Number:</span>
                  <span>{data.invoiceNumber}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">Invoice Date:</span>
                  <span>{data.invoiceDate}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-semibold">Due Date:</span>
                  <span>{data.dueDate}</span>
                </div>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    data.status === 'paid' ? 'bg-green-100 text-green-800' :
                    data.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    data.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {data.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="bg-slate-50 p-6 rounded-lg mb-8">
            <p className="text-sm font-bold text-indigo-600 mb-3">BILL TO:</p>
            <p className="font-bold text-slate-700 mb-1">{data.customerName}</p>
            <div className="text-sm text-slate-600 space-y-1">
              {data.customerEmail && <p>{data.customerEmail}</p>}
              {data.customerPhone && <p>{data.customerPhone}</p>}
              {data.customerAddress && <p>{data.customerAddress}</p>}
              {customerLocation && <p>{customerLocation}</p>}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="bg-indigo-600 text-white">
                  <th className="text-left py-3 px-4 font-semibold">Item Description</th>
                  <th className="text-center py-3 px-4 font-semibold w-20">Qty</th>
                  <th className="text-right py-3 px-4 font-semibold w-32">Price</th>
                  <th className="text-right py-3 px-4 font-semibold w-32">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                    <td className="py-3 px-4">
                      <p className="font-medium">{item.productName}</p>
                      {item.description && (
                        <p className="text-sm text-slate-600">{item.description}</p>
                      )}
                    </td>
                    <td className="text-center py-3 px-4">{item.quantity}</td>
                    <td className="text-right py-3 px-4">{formatCurrency(item.price, data.currency)}</td>
                    <td className="text-right py-3 px-4 font-medium">{formatCurrency(item.amount, data.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80 space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium">{formatCurrency(data.subtotal, data.currency)}</span>
              </div>
              {data.taxRate && data.taxAmount && (
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Tax ({data.taxRate}%):</span>
                  <span className="font-medium">{formatCurrency(data.taxAmount, data.currency)}</span>
                </div>
              )}
              {data.discount && data.discount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-slate-600">Discount:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(data.discount, data.currency)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-indigo-600">
                <span className="text-lg font-bold text-indigo-600">TOTAL:</span>
                <span className="text-lg font-bold text-indigo-600">{formatCurrency(data.total, data.currency)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {data.notes && (
            <div className="mb-6">
              <p className="font-bold text-slate-700 mb-2">Notes:</p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.notes}</p>
            </div>
          )}

          {/* Terms */}
          {data.terms && (
            <div className="mb-6">
              <p className="font-bold text-slate-700 mb-2">Terms & Conditions:</p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{data.terms}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-slate-400 pt-6 border-t">
            Generated by DocuFlow on {new Date().toLocaleDateString()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
