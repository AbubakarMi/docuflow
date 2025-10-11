"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Globe,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  // Business Information
  businessName: z.string().min(2, { message: "Business name must be at least 2 characters" }),
  businessEmail: z.string().email({ message: "Invalid email address" }),
  businessPhone: z.string().min(10, { message: "Valid phone number required" }),
  businessAddress: z.string().min(5, { message: "Business address is required" }),
  businessCity: z.string().min(2, { message: "City is required" }),
  businessState: z.string().min(2, { message: "State/Province is required" }),
  businessCountry: z.string().min(2, { message: "Country is required" }),
  currency: z.string().min(3, { message: "Please select a currency" }),
  businessWebsite: z.string().url({ message: "Valid website URL required" }).optional().or(z.literal("")),
  taxId: z.string().optional(),

  // Admin User Information
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }).regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Valid phone number required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Must contain at least one number" }),
  confirmPassword: z.string(),

  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessEmail: "",
      businessPhone: "",
      businessAddress: "",
      businessCity: "",
      businessState: "",
      businessCountry: "",
      currency: "NGN",
      businessWebsite: "",
      taxId: "",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Registration failed. Please try again.");
        return;
      }

      toast({
        title: "Registration Successful!",
        description: data.pendingApproval
          ? "Your business is pending SuperAdmin approval. You'll be notified once approved."
          : "Your account has been created successfully!",
      });

      // Show success message and redirect
      setStep(4);
      setTimeout(() => {
        router.push("/login");
      }, 3000);

    } catch (error) {
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];

    if (step === 1) {
      fieldsToValidate = [
        "businessName",
        "businessEmail",
        "businessPhone",
        "businessAddress",
        "businessCity",
        "businessState",
        "businessCountry"
      ];
    } else if (step === 2) {
      fieldsToValidate = [
        "firstName",
        "lastName",
        "username",
        "email",
        "phone",
        "password",
        "confirmPassword"
      ];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="w-full max-w-2xl space-y-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 shadow-lg mb-4">
          <Building2 className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900">
          Register Your Business
        </h1>
        <p className="text-lg text-slate-600">
          Join DocuFlow and start managing your invoices and inventory
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
              step >= s
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-slate-300 text-slate-400'
            }`}>
              {step > s ? <CheckCircle className="h-5 w-5" /> : s}
            </div>
            {s < 3 && (
              <div className={`h-1 w-16 ${step > s ? 'bg-indigo-600' : 'bg-slate-300'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="border-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Registration Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Business Information */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>Tell us about your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <Input placeholder="Acme Corporation" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Email *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input placeholder="info@acme.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Phone *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input placeholder="+1234567890" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="businessAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Address *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                          <Input placeholder="123 Business St" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="businessCity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessState"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province *</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="businessCountry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country *</FormLabel>
                        <FormControl>
                          <Input placeholder="USA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NGN">🇳🇬 Nigerian Naira (NGN)</SelectItem>
                            <SelectItem value="USD">🇺🇸 US Dollar (USD)</SelectItem>
                            <SelectItem value="EUR">🇪🇺 Euro (EUR)</SelectItem>
                            <SelectItem value="GBP">🇬🇧 British Pound (GBP)</SelectItem>
                            <SelectItem value="ZAR">🇿🇦 South African Rand (ZAR)</SelectItem>
                            <SelectItem value="KES">🇰🇪 Kenyan Shilling (KES)</SelectItem>
                            <SelectItem value="GHS">🇬🇭 Ghanaian Cedi (GHS)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessWebsite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input placeholder="https://acme.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID (Optional)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input placeholder="XX-XXXXXXX" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Admin User Information */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Admin Account</CardTitle>
                <CardDescription>Create your admin user account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input placeholder="John" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username *</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormDescription>
                        You can use this to login instead of email
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Email *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input placeholder="john@acme.com" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Phone *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <Input placeholder="+1234567890" className="pl-10" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <Input type="password" placeholder="Create a strong password" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Must be 8+ characters with uppercase and number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                          <Input type="password" placeholder="Confirm your password" className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 3: Review and Submit */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Review & Submit</CardTitle>
                <CardDescription>Please review your information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Business Information</h3>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {form.getValues("businessName")}</p>
                      <p><span className="font-medium">Email:</span> {form.getValues("businessEmail")}</p>
                      <p><span className="font-medium">Phone:</span> {form.getValues("businessPhone")}</p>
                      <p><span className="font-medium">Address:</span> {form.getValues("businessAddress")}, {form.getValues("businessCity")}, {form.getValues("businessState")}, {form.getValues("businessCountry")}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Admin Account</h3>
                    <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
                      <p><span className="font-medium">Name:</span> {form.getValues("firstName")} {form.getValues("lastName")}</p>
                      <p><span className="font-medium">Username:</span> {form.getValues("username")}</p>
                      <p><span className="font-medium">Email:</span> {form.getValues("email")}</p>
                      <p><span className="font-medium">Phone:</span> {form.getValues("phone")}</p>
                    </div>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to the{" "}
                          <Link href="/terms" className="text-indigo-600 hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-indigo-600 hover:underline">
                            Privacy Policy
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Step 4: Success Message */}
          {step === 4 && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-900">Registration Successful!</h3>
                <p className="text-green-700">
                  Your business has been registered. Please wait for SuperAdmin approval before logging in.
                  You'll be redirected to the login page shortly.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex gap-4">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1"
                  disabled={isLoading}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Create Business Account
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </form>
      </Form>

      {/* Login Link */}
      {step < 4 && (
        <div className="text-center">
          <p className="text-base text-slate-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
