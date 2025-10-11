"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Mail, Lock, KeyRound, Building2, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [emailType, setEmailType] = useState<'admin' | 'business'>('admin')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, emailType })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP')
      }

      toast({
        title: "OTP Sent!",
        description: "Please check your email for the OTP code.",
      })

      setStep('otp')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid OTP')
      }

      toast({
        title: "OTP Verified!",
        description: "Please enter your new password.",
      })

      setStep('reset')
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Invalid or expired OTP",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password')
      }

      toast({
        title: "Success!",
        description: "Password reset successfully. Redirecting to login...",
      })

      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Button>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold">
            {step === 'email' && 'Forgot Password'}
            {step === 'otp' && 'Enter OTP'}
            {step === 'reset' && 'Reset Password'}
          </CardTitle>
          <CardDescription>
            {step === 'email' && 'Enter your email to receive an OTP code'}
            {step === 'otp' && 'Enter the 6-digit code sent to your email'}
            {step === 'reset' && 'Enter your new password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'email' && (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-3">
                <Label>Email Type</Label>
                <RadioGroup value={emailType} onValueChange={(value: 'admin' | 'business') => setEmailType(value)}>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent" onClick={() => setEmailType('admin')}>
                    <RadioGroupItem value="admin" id="admin" />
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="admin" className="cursor-pointer flex-1">
                      <div className="font-medium">Business Admin Email</div>
                      <div className="text-xs text-muted-foreground">Use your personal admin email</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-accent" onClick={() => setEmailType('business')}>
                    <RadioGroupItem value="business" id="business" />
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="business" className="cursor-pointer flex-1">
                      <div className="font-medium">Business Email</div>
                      <div className="text-xs text-muted-foreground">Use your company email address</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={emailType === 'admin' ? 'admin@example.com' : 'company@example.com'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="pl-10 text-center text-2xl tracking-widest"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  OTP sent to {email}
                </p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => setStep('email')}
              >
                Change Email
              </Button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
