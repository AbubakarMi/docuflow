"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Type,
  Image as ImageIcon,
  Table as TableIcon,
  DollarSign,
  Calendar,
  Hash,
  Eye,
  Save,
  Download,
  Plus,
  Trash2,
  ArrowLeft
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface TemplateElement {
  id: string
  type: 'text' | 'image' | 'table' | 'field'
  x: number
  y: number
  width: number
  height: number
  content?: string
  fontSize?: number
  fontWeight?: string
  color?: string
  fieldType?: string
}

export default function TemplateDesignerPage() {
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [elements, setElements] = useState<TemplateElement[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const addElement = (type: TemplateElement['type']) => {
    const newElement: TemplateElement = {
      id: `element-${Date.now()}`,
      type,
      x: 50,
      y: 50,
      width: type === 'table' ? 400 : type === 'image' ? 150 : 200,
      height: type === 'table' ? 200 : type === 'image' ? 150 : 40,
      content: type === 'text' ? 'Sample Text' : type === 'field' ? '{invoice_number}' : '',
      fontSize: 14,
      fontWeight: 'normal',
      color: '#000000',
      fieldType: type === 'field' ? 'invoice_number' : undefined
    }

    setElements([...elements, newElement])
    setSelectedElement(newElement.id)
  }

  const updateElement = (id: string, updates: Partial<TemplateElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el))
  }

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id))
    if (selectedElement === id) setSelectedElement(null)
  }

  const saveTemplate = async () => {
    if (!templateName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a template name",
        variant: "destructive"
      })
      return
    }

    setSaving(true)

    try {
      // Create HTML from elements
      const html = generateHTML()

      // Create a blob and convert to file
      const blob = new Blob([html], { type: 'text/html' })
      const file = new File([blob], `${templateName.replace(/\s+/g, '-')}.html`, { type: 'text/html' })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', templateName)
      formData.append('description', templateDescription || 'Created with Template Designer')

      const response = await fetch('/api/superadmin/templates', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save template')
      }

      toast({
        title: "Success",
        description: "Template saved successfully!",
      })

      router.push('/superadmin/templates')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save template",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const generateHTML = () => {
    const elementsHTML = elements.map(el => {
      const style = `position: absolute; left: ${el.x}px; top: ${el.y}px; width: ${el.width}px; height: ${el.height}px; font-size: ${el.fontSize}px; font-weight: ${el.fontWeight}; color: ${el.color};`

      if (el.type === 'text') {
        return `<div style="${style}">${el.content || ''}</div>`
      } else if (el.type === 'field') {
        return `<div style="${style}" class="field" data-field="${el.fieldType}">${el.content || ''}</div>`
      } else if (el.type === 'image') {
        return `<div style="${style} border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center;">Image</div>`
      } else if (el.type === 'table') {
        return `<table style="${style} border-collapse: collapse; width: 100%;"><tr><th style="border: 1px solid #000; padding: 8px;">Item</th><th style="border: 1px solid #000; padding: 8px;">Qty</th><th style="border: 1px solid #000; padding: 8px;">Price</th></tr></table>`
      }
      return ''
    }).join('\n')

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${templateName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; position: relative; }
    .canvas { position: relative; width: 800px; height: 1100px; border: 1px solid #ccc; background: white; }
  </style>
</head>
<body>
  <div class="canvas">
    ${elementsHTML}
  </div>
</body>
</html>`
  }

  const selectedEl = elements.find(el => el.id === selectedElement)

  const fieldOptions = [
    { value: 'invoice_number', label: 'Invoice Number' },
    { value: 'invoice_date', label: 'Invoice Date' },
    { value: 'due_date', label: 'Due Date' },
    { value: 'business_name', label: 'Business Name' },
    { value: 'business_address', label: 'Business Address' },
    { value: 'customer_name', label: 'Customer Name' },
    { value: 'customer_address', label: 'Customer Address' },
    { value: 'total_amount', label: 'Total Amount' },
    { value: 'subtotal', label: 'Subtotal' },
    { value: 'tax_amount', label: 'Tax Amount' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.push('/superadmin/templates')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Template Designer</h1>
          <p className="text-muted-foreground">Create custom invoice templates with drag-and-drop</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button onClick={saveTemplate} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Template'}
          </Button>
        </div>
      </div>

      {/* Template Info */}
      <Card>
        <CardHeader>
          <CardTitle>Template Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Modern Invoice"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        {/* Toolbox */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Elements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addElement('text')}
            >
              <Type className="h-4 w-4 mr-2" />
              Text
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addElement('field')}
            >
              <Hash className="h-4 w-4 mr-2" />
              Field
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addElement('table')}
            >
              <TableIcon className="h-4 w-4 mr-2" />
              Table
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => addElement('image')}
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Logo
            </Button>
          </CardContent>
        </Card>

        {/* Canvas */}
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle className="text-sm">Canvas (A4 Portrait - 800x1100px)</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[700px]">
              <div className="relative w-[800px] h-[1100px] bg-white border-2 border-gray-300">
                {elements.map(el => (
                  <div
                    key={el.id}
                    onClick={() => setSelectedElement(el.id)}
                    className={`absolute cursor-move ${
                      selectedElement === el.id ? 'ring-2 ring-indigo-600' : ''
                    }`}
                    style={{
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      height: el.height,
                    }}
                    draggable
                    onDragEnd={(e) => {
                      const canvas = e.currentTarget.parentElement
                      if (canvas) {
                        const rect = canvas.getBoundingClientRect()
                        updateElement(el.id, {
                          x: Math.max(0, Math.min(800 - el.width, e.clientX - rect.left)),
                          y: Math.max(0, Math.min(1100 - el.height, e.clientY - rect.top))
                        })
                      }
                    }}
                  >
                    {el.type === 'text' && (
                      <div style={{ fontSize: el.fontSize, fontWeight: el.fontWeight, color: el.color }}>
                        {el.content}
                      </div>
                    )}
                    {el.type === 'field' && (
                      <div style={{ fontSize: el.fontSize, fontWeight: el.fontWeight, color: el.color }} className="border border-dashed border-blue-500 px-2 py-1">
                        {el.content}
                      </div>
                    )}
                    {el.type === 'image' && (
                      <div className="w-full h-full border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500">
                        Logo
                      </div>
                    )}
                    {el.type === 'table' && (
                      <div className="w-full h-full border border-gray-400">
                        <div className="grid grid-cols-3 border-b">
                          <div className="border-r p-2 font-semibold text-xs">Item</div>
                          <div className="border-r p-2 font-semibold text-xs">Qty</div>
                          <div className="p-2 font-semibold text-xs">Price</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Properties */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-sm">Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEl ? (
              <ScrollArea className="h-[700px]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge>{selectedEl.type.toUpperCase()}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteElement(selectedEl.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  {(selectedEl.type === 'text' || selectedEl.type === 'field') && (
                    <>
                      {selectedEl.type === 'field' && (
                        <div className="space-y-2">
                          <Label>Field Type</Label>
                          <Select
                            value={selectedEl.fieldType}
                            onValueChange={(value) => {
                              const option = fieldOptions.find(o => o.value === value)
                              updateElement(selectedEl.id, {
                                fieldType: value,
                                content: `{${value}}`
                              })
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {selectedEl.type === 'text' && (
                        <div className="space-y-2">
                          <Label>Content</Label>
                          <Textarea
                            value={selectedEl.content}
                            onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })}
                            rows={3}
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Font Size: {selectedEl.fontSize}px</Label>
                        <Slider
                          value={[selectedEl.fontSize || 14]}
                          onValueChange={([value]) => updateElement(selectedEl.id, { fontSize: value })}
                          min={8}
                          max={72}
                          step={1}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Font Weight</Label>
                        <Select
                          value={selectedEl.fontWeight}
                          onValueChange={(value) => updateElement(selectedEl.id, { fontWeight: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="bold">Bold</SelectItem>
                            <SelectItem value="lighter">Light</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Color</Label>
                        <Input
                          type="color"
                          value={selectedEl.color}
                          onChange={(e) => updateElement(selectedEl.id, { color: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label>Position X: {selectedEl.x}px</Label>
                    <Slider
                      value={[selectedEl.x]}
                      onValueChange={([value]) => updateElement(selectedEl.id, { x: value })}
                      min={0}
                      max={800 - selectedEl.width}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Position Y: {selectedEl.y}px</Label>
                    <Slider
                      value={[selectedEl.y]}
                      onValueChange={([value]) => updateElement(selectedEl.id, { y: value })}
                      min={0}
                      max={1100 - selectedEl.height}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Width: {selectedEl.width}px</Label>
                    <Slider
                      value={[selectedEl.width]}
                      onValueChange={([value]) => updateElement(selectedEl.id, { width: value })}
                      min={50}
                      max={800}
                      step={1}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Height: {selectedEl.height}px</Label>
                    <Slider
                      value={[selectedEl.height]}
                      onValueChange={([value]) => updateElement(selectedEl.id, { height: value })}
                      min={20}
                      max={500}
                      step={1}
                    />
                  </div>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <p className="text-sm">Select an element to edit its properties</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
