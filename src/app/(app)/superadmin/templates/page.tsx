"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, Trash2, Eye, EyeOff, Download, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { Switch } from "@/components/ui/switch"

interface Template {
  id: string
  name: string
  description: string | null
  fileUrl: string
  fileType: string
  fileName: string
  fileSize: number
  isVisible: boolean
  createdAt: string
}

export default function TemplatesManagementPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; templateId: string | null; templateName: string }>({
    open: false,
    templateId: null,
    templateName: ''
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/superadmin/templates')
      const data = await response.json()

      if (data.success) {
        setTemplates(data.templates)
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile || !templateName) {
      toast({
        title: "Error",
        description: "Please provide template name and file",
        variant: "destructive"
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('name', templateName)
      formData.append('description', templateDescription)

      const response = await fetch('/api/superadmin/templates', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      toast({
        title: "Success",
        description: "Template uploaded successfully",
      })

      // Reset form
      setTemplateName("")
      setTemplateDescription("")
      setSelectedFile(null)
      setIsDialogOpen(false)

      // Refresh template list
      fetchTemplates()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload template",
        variant: "destructive"
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleToggleVisibility = async (templateId: string, currentVisibility: boolean) => {
    try {
      const response = await fetch(`/api/superadmin/templates/${templateId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !currentVisibility })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update visibility")
      }

      toast({
        title: "Success",
        description: data.message,
      })

      // Update local state
      setTemplates(templates.map(t =>
        t.id === templateId ? { ...t, isVisible: !currentVisibility } : t
      ))
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update visibility",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteDialog.templateId) return

    try {
      const response = await fetch(`/api/superadmin/templates/${deleteDialog.templateId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete template")
      }

      toast({
        title: "Success",
        description: "Template deleted successfully",
      })

      // Remove from local state
      setTemplates(templates.filter(t => t.id !== deleteDialog.templateId))
      setDeleteDialog({ open: false, templateId: null, templateName: '' })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete template",
        variant: "destructive"
      })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading templates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Management</h1>
          <p className="text-muted-foreground">Upload and manage invoice templates for all businesses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Upload className="h-4 w-4 mr-2" />
              Upload Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Template</DialogTitle>
              <DialogDescription>
                Upload a template file that will be available to all businesses
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Professional Invoice"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of this template"
                    value={templateDescription}
                    onChange={(e) => setTemplateDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">Template File *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      onChange={handleFileSelect}
                      accept=".html,.pdf,.docx,.doc"
                      required
                    />
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isUploading} className="bg-indigo-600 hover:bg-indigo-700">
                  {isUploading ? "Uploading..." : "Upload Template"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Info Card */}
      <Card className="bg-indigo-50 border-indigo-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-indigo-900">SuperAdmin Template Management</h3>
              <p className="text-sm text-indigo-700 mt-1">
                Upload and manage templates. Toggle visibility to control which templates businesses can see and use.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Templates ({templates.length})</CardTitle>
          <CardDescription>Manage templates available to businesses</CardDescription>
        </CardHeader>
        <CardContent>
          {templates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No templates uploaded yet</p>
              <p className="text-sm mt-2">Click "Upload Template" to add your first template</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                        {template.description || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.fileType.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell className="text-sm">{formatFileSize(template.fileSize)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(template.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={template.isVisible}
                            onCheckedChange={() => handleToggleVisibility(template.id, template.isVisible)}
                          />
                          {template.isVisible ? (
                            <Badge variant="success" className="text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Visible
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              <EyeOff className="h-3 w-3 mr-1" />
                              Hidden
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => window.open(template.fileUrl, '_blank')}
                            title="Download"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteDialog({ open: true, templateId: template.id, templateName: template.name })}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteDialog.templateName}"? This action cannot be undone and the template will no longer be available to any business.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
