"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Building2, Check, X, Clock, User, Mail, Phone, MapPin, AlertCircle, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PendingBusiness {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country: string
  taxId?: string
  website?: string
  createdAt: string
  users: Array<{
    id: string
    firstName: string
    lastName: string
    email: string
    role: string
  }>
}

export default function BusinessApprovalsPage() {
  const [pendingBusinesses, setPendingBusinesses] = useState<PendingBusiness[]>([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; businessId: string; action: 'approve' | 'reject'; businessName: string }>({ open: false, businessId: '', action: 'approve', businessName: '' })
  const [viewDialog, setViewDialog] = useState<{ open: boolean; business: PendingBusiness | null }>({ open: false, business: null })
  const { toast } = useToast()

  useEffect(() => {
    fetchPendingBusinesses()
  }, [])

  const fetchPendingBusinesses = async () => {
    try {
      const response = await fetch('/api/superadmin/businesses/pending')
      const data = await response.json()

      if (data.success) {
        setPendingBusinesses(data.businesses)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch pending businesses",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const openConfirmDialog = (businessId: string, action: 'approve' | 'reject', businessName: string) => {
    setConfirmDialog({ open: true, businessId, action, businessName })
  }

  const handleApproval = async () => {
    const { businessId, action } = confirmDialog
    setConfirmDialog({ ...confirmDialog, open: false })
    setProcessingId(businessId)

    try {
      const response = await fetch('/api/superadmin/businesses/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          action
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        })

        // Remove from pending list
        setPendingBusinesses(prev => prev.filter(b => b.id !== businessId))
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || `Failed to ${action} business`,
        variant: "destructive"
      })
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Clock className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading pending approvals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Business Approvals</h1>
          <p className="text-lg text-muted-foreground mt-1">Review and approve pending business registrations</p>
        </div>
        <Badge variant="outline" className="text-base px-5 py-2.5">
          {pendingBusinesses.length} Pending
        </Badge>
      </div>

      {/* Pending Businesses */}
      {pendingBusinesses.length === 0 ? (
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="py-20">
            <div className="text-center">
              <Check className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold mb-3">All Caught Up!</h3>
              <p className="text-base text-muted-foreground">No pending business approvals at this time.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {pendingBusinesses.map((business) => (
            <Card key={business.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-indigo-50 p-4 rounded-xl">
                      <Building2 className="h-7 w-7 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{business.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2 text-base">
                        <Clock className="h-4 w-4" />
                        Registered on {new Date(business.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-sm px-4 py-1.5">
                    <AlertCircle className="h-4 w-4 mr-1.5" />
                    Pending Approval
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Business Information */}
                  <div className="space-y-5">
                    <h4 className="font-bold text-base text-slate-900">Business Information</h4>
                    <div className="space-y-4 bg-slate-50 rounded-lg p-5">
                      <div className="flex items-start gap-4">
                        <Mail className="h-5 w-5 mt-0.5 text-indigo-600" />
                        <div>
                          <p className="text-sm font-semibold">Email</p>
                          <p className="text-base text-muted-foreground">{business.email}</p>
                        </div>
                      </div>
                      {business.phone && (
                        <div className="flex items-start gap-4">
                          <Phone className="h-5 w-5 mt-0.5 text-indigo-600" />
                          <div>
                            <p className="text-sm font-semibold">Phone</p>
                            <p className="text-base text-muted-foreground">{business.phone}</p>
                          </div>
                        </div>
                      )}
                      {business.address && (
                        <div className="flex items-start gap-4">
                          <MapPin className="h-5 w-5 mt-0.5 text-indigo-600" />
                          <div>
                            <p className="text-sm font-semibold">Address</p>
                            <p className="text-base text-muted-foreground">
                              {business.address}
                              {business.city && `, ${business.city}`}
                              {business.state && `, ${business.state}`}
                              <br />
                              {business.country}
                            </p>
                          </div>
                        </div>
                      )}
                      {business.taxId && (
                        <div className="flex items-start gap-4">
                          <div className="h-5 w-5 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold">Tax ID</p>
                            <p className="text-base text-muted-foreground">{business.taxId}</p>
                          </div>
                        </div>
                      )}
                      {business.website && (
                        <div className="flex items-start gap-4">
                          <div className="h-5 w-5 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold">Website</p>
                            <p className="text-base text-muted-foreground">{business.website}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Users */}
                  <div className="space-y-5">
                    <h4 className="font-bold text-base text-slate-900">Admin Users</h4>
                    <div className="space-y-4 bg-slate-50 rounded-lg p-5">
                      {business.users.map((user) => (
                        <div key={user.id} className="flex items-start gap-4">
                          <User className="h-5 w-5 mt-0.5 text-indigo-600" />
                          <div>
                            <p className="text-base font-semibold">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <Badge variant="outline" className="mt-2">{user.role}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 mt-8 pt-6 border-t">
                  <Button
                    onClick={() => openConfirmDialog(business.id, 'approve', business.name)}
                    disabled={processingId === business.id}
                    className="flex-1 h-12 text-base font-semibold"
                  >
                    <Check className="h-5 w-5 mr-2" />
                    {processingId === business.id ? 'Processing...' : 'Approve Business'}
                  </Button>
                  <Button
                    onClick={() => openConfirmDialog(business.id, 'reject', business.name)}
                    disabled={processingId === business.id}
                    variant="destructive"
                    className="flex-1 h-12 text-base font-semibold"
                  >
                    <X className="h-5 w-5 mr-2" />
                    {processingId === business.id ? 'Processing...' : 'Reject Business'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.action === 'approve' ? 'Approve Business?' : 'Reject Business?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.action === 'approve'
                ? `Are you sure you want to approve "${confirmDialog.businessName}"? This will activate their account and send them a confirmation email.`
                : `Are you sure you want to reject "${confirmDialog.businessName}"? This action will suspend their account and they will not be able to access the system.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApproval}
              className={confirmDialog.action === 'reject' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            >
              {confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
