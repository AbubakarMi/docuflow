"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FileDown, Download } from "lucide-react"

interface ExportConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (format: 'pdf' | 'docx') => void
  title?: string
  description?: string
  isLoading?: boolean
}

export function ExportConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Export Document",
  description = "Choose the format you want to export:",
  isLoading = false
}: ExportConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[95vw] sm:max-w-md md:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-xl">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base">{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-4">
          <button
            onClick={() => {
              onConfirm('pdf')
              onOpenChange(false)
            }}
            disabled={isLoading}
            className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <FileDown className="h-10 w-10 sm:h-12 sm:w-12 text-slate-600 group-hover:text-blue-600 mb-2 sm:mb-3" />
            <span className="font-semibold text-sm sm:text-base text-slate-700 group-hover:text-blue-700">
              PDF Format
            </span>
            <span className="text-xs text-slate-500 mt-1 text-center">
              Best for viewing & printing
            </span>
          </button>

          <button
            onClick={() => {
              onConfirm('docx')
              onOpenChange(false)
            }}
            disabled={isLoading}
            className="flex flex-col items-center justify-center p-4 sm:p-6 border-2 border-slate-200 rounded-lg hover:border-emerald-500 hover:bg-emerald-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Download className="h-10 w-10 sm:h-12 sm:w-12 text-slate-600 group-hover:text-emerald-600 mb-2 sm:mb-3" />
            <span className="font-semibold text-sm sm:text-base text-slate-700 group-hover:text-emerald-700">
              DOCX Format
            </span>
            <span className="text-xs text-slate-500 mt-1 text-center">
              Editable Word document
            </span>
          </button>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
