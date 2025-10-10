"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Building2, Check, X, Clock, User, Mail, Phone, MapPin, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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

  const handleApproval = async (businessId: string, action: 'approve' | 'reject') => {
    setProcessingId(businessId)

    try {
      // Get SuperAdmin ID from session/storage (you'll need to implement this)
      const superAdminId = 'YOUR_SUPERADMIN_ID' // TODO: Get from auth context

      const response = await fetch('/api/superadmin/businesses/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          superAdminId,
          action
        })
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
          variant: "default"
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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Approvals</h1>
          <p className="text-muted-foreground">Review and approve pending business registrations</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {pendingBusinesses.length} Pending
        </Badge>
      </div>

      {/* Pending Businesses */}
      {pendingBusinesses.length === 0 ? (
        <Card>
          <CardContent className="py-16">
            <div className="text-center">
              <Check className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">No pending business approvals at this time.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingBusinesses.map((business) => (
            <Card key={business.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{business.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4" />
                        Registered on {new Date(business.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Pending Approval
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Business Information */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">Business Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{business.email}</p>
                        </div>
                      </div>
                      {business.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">{business.phone}</p>
                          </div>
                        </div>
                      )}
                      {business.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Address</p>
                            <p className="text-sm text-muted-foreground">
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
                        <div className="flex items-start gap-3">
                          <div className="h-4 w-4 mt-1" />
                          <div>
                            <p className="text-sm font-medium">Tax ID</p>
                            <p className="text-sm text-muted-foreground">{business.taxId}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Admin Users */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground">Admin Users</h4>
                    <div className="space-y-3">
                      {business.users.map((user) => (
                        <div key={user.id} className="flex items-start gap-3">
                          <User className="h-4 w-4 mt-1 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <Badge variant="outline" className="mt-1">{user.role}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t">
                  <Button
                    onClick={() => handleApproval(business.id, 'approve')}
                    disabled={processingId === business.id}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {processingId === business.id ? 'Processing...' : 'Approve Business'}
                  </Button>
                  <Button
                    onClick={() => handleApproval(business.id, 'reject')}
                    disabled={processingId === business.id}
                    variant="destructive"
                    className="flex-1"
                  >
                    <X className="h-4 w-4 mr-2" />
                    {processingId === business.id ? 'Processing...' : 'Reject Business'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
