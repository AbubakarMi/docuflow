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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface BusinessData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  taxId: string;
  website: string;
  currency: string;
  timezone: string;
}

interface SettingsData {
  invoicePrefix: string;
  nextInvoiceNumber: number;
  invoiceTerms: string;
  invoiceNotes: string;
  paymentTermsDays: number;
}

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [businessData, setBusinessData] = useState<BusinessData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "USA",
    taxId: "",
    website: "",
    currency: "USD",
    timezone: "UTC",
  });

  const [settingsData, setSettingsData] = useState<SettingsData>({
    invoicePrefix: "INV",
    nextInvoiceNumber: 1001,
    invoiceTerms: "",
    invoiceNotes: "",
    paymentTermsDays: 30,
  });

  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchBusinessData = async () => {
    try {
      const response = await fetch("/api/business/details");
      const data = await response.json();

      if (data.success) {
        setBusinessData({
          name: data.business.name || "",
          email: data.business.email || "",
          phone: data.business.phone || "",
          address: data.business.address || "",
          city: data.business.city || "",
          state: data.business.state || "",
          zipCode: data.business.zipCode || "",
          country: data.business.country || "USA",
          taxId: data.business.taxId || "",
          website: data.business.website || "",
          currency: data.business.currency || "USD",
          timezone: data.business.timezone || "UTC",
        });

        if (data.business.logo) {
          setLogoPreview(data.business.logo);
        }

        if (data.business.settings) {
          setSettingsData({
            invoicePrefix: data.business.settings.invoicePrefix || "INV",
            nextInvoiceNumber: data.business.settings.nextInvoiceNumber || 1001,
            invoiceTerms: data.business.settings.invoiceTerms || "",
            invoiceNotes: data.business.settings.invoiceNotes || "",
            paymentTermsDays: data.business.settings.paymentTermsDays || 30,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load business data.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBusinessInfo = async () => {
    setSaving(true);
    try {
      let logoUrl = logoPreview;

      // Upload logo if a new file is selected
      if (logoFile) {
        const formData = new FormData();
        formData.append("logo", logoFile);

        const uploadResponse = await fetch("/api/business/upload-logo", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadData.success) {
          logoUrl = uploadData.logoUrl;
        } else {
          throw new Error("Failed to upload logo");
        }
      }

      const response = await fetch("/api/business/details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business: { ...businessData, logo: logoUrl },
          settings: null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLogoFile(null);
        toast({
          title: "Saved Business Information",
          description: "Your business information has been updated.",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error saving business info:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save business information.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/business/details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business: {
            currency: businessData.currency,
            timezone: businessData.timezone,
            name: businessData.name,
            email: businessData.email,
            phone: businessData.phone,
            address: businessData.address,
            city: businessData.city,
            state: businessData.state,
            zipCode: businessData.zipCode,
            country: businessData.country,
            taxId: businessData.taxId,
            website: businessData.website,
          },
          settings: settingsData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Saved Business Settings",
          description: "Your business settings have been updated.",
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save business settings.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = () => {
    toast({
      title: "Saved Profile",
      description: "Your profile settings have been updated.",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and workspace settings.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              value={profileData.fullName}
              onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              disabled
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>Update your business details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Business Logo</Label>
            <div className="flex items-center gap-4">
              {logoPreview && (
                <div className="w-24 h-24 border rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                  <img
                    src={logoPreview}
                    alt="Business Logo"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload your business logo (PNG, JPG, SVG recommended)
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={businessData.name}
                onChange={(e) => setBusinessData({ ...businessData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-email">Business Email</Label>
              <Input
                id="business-email"
                type="email"
                value={businessData.email}
                onChange={(e) => setBusinessData({ ...businessData, email: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={businessData.phone}
                onChange={(e) => setBusinessData({ ...businessData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://example.com"
                value={businessData.website}
                onChange={(e) => setBusinessData({ ...businessData, website: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Street Address"
              value={businessData.address}
              onChange={(e) => setBusinessData({ ...businessData, address: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="City"
                value={businessData.city}
                onChange={(e) => setBusinessData({ ...businessData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="State"
                value={businessData.state}
                onChange={(e) => setBusinessData({ ...businessData, state: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                placeholder="12345"
                value={businessData.zipCode}
                onChange={(e) => setBusinessData({ ...businessData, zipCode: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={businessData.country}
                onChange={(e) => setBusinessData({ ...businessData, country: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input
                id="taxId"
                placeholder="Tax ID / EIN"
                value={businessData.taxId}
                onChange={(e) => setBusinessData({ ...businessData, taxId: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleSaveBusinessInfo} disabled={saving}>
            {saving ? "Saving..." : "Save Business Info"}
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Business Settings</CardTitle>
          <CardDescription>Configure business preferences.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input
                id="currency"
                value={businessData.currency}
                onChange={(e) => setBusinessData({ ...businessData, currency: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                id="timezone"
                value={businessData.timezone}
                onChange={(e) => setBusinessData({ ...businessData, timezone: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-prefix">Invoice Prefix</Label>
              <Input
                id="invoice-prefix"
                value={settingsData.invoicePrefix}
                onChange={(e) => setSettingsData({ ...settingsData, invoicePrefix: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="next-invoice-number">Next Invoice Number</Label>
              <Input
                id="next-invoice-number"
                type="number"
                value={settingsData.nextInvoiceNumber}
                onChange={(e) => setSettingsData({ ...settingsData, nextInvoiceNumber: parseInt(e.target.value) || 1001 })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-terms">Payment Terms (Days)</Label>
            <Input
              id="payment-terms"
              type="number"
              value={settingsData.paymentTermsDays}
              onChange={(e) => setSettingsData({ ...settingsData, paymentTermsDays: parseInt(e.target.value) || 30 })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoice-terms">Invoice Terms</Label>
            <Input
              id="invoice-terms"
              placeholder="Payment is due within 30 days"
              value={settingsData.invoiceTerms}
              onChange={(e) => setSettingsData({ ...settingsData, invoiceTerms: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invoice-notes">Default Invoice Notes</Label>
            <Input
              id="invoice-notes"
              placeholder="Thank you for your business"
              value={settingsData.invoiceNotes}
              onChange={(e) => setSettingsData({ ...settingsData, invoiceNotes: e.target.value })}
            />
          </div>
          <Button onClick={handleSaveSettings} disabled={saving}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
