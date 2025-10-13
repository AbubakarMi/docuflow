'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Zap,
  Package,
  BarChart3,
  Users,
  Shield,
  Clock,
  ArrowRight,
  CheckCircle2,
  Star,
  TrendingUp,
  Building2
} from 'lucide-react'

interface Stats {
  activeUsers: number
  documentsGenerated: number
  activeBusinesses: number
  uptime: string
  support: string
}

export default function LandingPage() {
  const [stats, setStats] = useState<Stats>({
    activeUsers: 0,
    documentsGenerated: 0,
    activeBusinesses: 0,
    uptime: '99.9%',
    support: '24/7'
  })

  useEffect(() => {
    fetch('/api/public/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setStats(data.stats)
        }
      })
      .catch(() => {})
  }, [])

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast Invoicing',
      description: 'Create professional invoices in seconds with our intuitive interface'
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Track stock levels and get alerts when items are running low'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Get insights into your business performance with comprehensive reports'
    },
    {
      icon: Users,
      title: 'Multi-User Support',
      description: 'Collaborate with your team with role-based access control'
    },
    {
      icon: Shield,
      title: 'Multi-Tenant Security',
      description: 'Enterprise-grade security ensures your data is isolated and protected'
    },
    {
      icon: Clock,
      title: 'Automatic Stock Updates',
      description: 'Inventory automatically adjusts when invoices are created'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Logo />

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Features
              </Link>
              <Link href="#benefits" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                Benefits
              </Link>
              <Link href="#stats" className="text-sm font-medium text-slate-700 hover:text-slate-900">
                About
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 mb-8">
              <span className="text-sm font-medium text-indigo-600">
                Multi-Tenant Invoice & Inventory System
              </span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Invoice & Inventory Management Made Simple
            </h1>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Streamline your business operations with our all-in-one platform. Create invoices,
              manage inventory, and gain insights - all in one secure place.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Real-Time Stats */}
            <div id="stats" className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.documentsGenerated.toLocaleString()}
                  </p>
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
                <p className="mt-2 text-sm font-medium text-slate-600">Invoices Generated</p>
              </div>

              <div>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.activeUsers.toLocaleString()}
                  </p>
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <p className="mt-2 text-sm font-medium text-slate-600">Active Users</p>
              </div>

              <div>
                <div className="flex items-center justify-center gap-2">
                  <p className="text-3xl font-bold text-slate-900">
                    {stats.activeBusinesses.toLocaleString()}
                  </p>
                  <Building2 className="h-5 w-5 text-indigo-600" />
                </div>
                <p className="mt-2 text-sm font-medium text-slate-600">Businesses</p>
              </div>

              <div>
                <p className="text-3xl font-bold text-slate-900">{stats.uptime}</p>
                <p className="mt-2 text-sm font-medium text-slate-600">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything You Need to Run Your Business
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Powerful features designed to save you time and help you grow
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="border-slate-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600 mb-4">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Why Choose Invotrek?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Built specifically for businesses that need reliable invoice and inventory management
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="border-slate-200">
              <CardContent className="p-8">
                <CheckCircle2 className="h-12 w-12 mb-4 text-indigo-600" />
                <h3 className="text-xl font-bold mb-3 text-slate-900">Multi-Tenant Security</h3>
                <p className="text-slate-600">
                  Complete data isolation ensures each business's information is completely private and secure.
                  Your data is yours alone.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-8">
                <CheckCircle2 className="h-12 w-12 mb-4 text-indigo-600" />
                <h3 className="text-xl font-bold mb-3 text-slate-900">Automatic Inventory</h3>
                <p className="text-slate-600">
                  Stock levels automatically update when you generate invoices. No manual tracking needed -
                  the system does it for you.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-8">
                <CheckCircle2 className="h-12 w-12 mb-4 text-indigo-600" />
                <h3 className="text-xl font-bold mb-3 text-slate-900">Business Analytics</h3>
                <p className="text-slate-600">
                  Real-time dashboards show you exactly how your business is performing with detailed
                  sales and inventory reports.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 border-y bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-700">Trusted by Businesses</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-slate-700">Secure & Encrypted</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2">
              <Shield className="h-4 w-4 text-indigo-600" />
              <span className="text-sm font-medium text-slate-700">Multi-Tenant Architecture</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 sm:py-32 bg-indigo-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your Business?
            </h2>
            <p className="mt-6 text-lg leading-8 text-indigo-100">
              Join businesses already using Invotrek for their invoicing and inventory management needs.
              Start free today - no credit card required.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-slate-100 font-semibold h-12 px-8 text-base">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 font-semibold h-12 px-8 text-base transition-all">
                  Sign In to Your Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo />
              <p className="mt-5 text-base text-slate-700 leading-relaxed">
                Professional invoice and inventory management for modern businesses. Multi-tenant, secure, and easy to use.
              </p>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-5">Product</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="#features" className="text-base text-slate-700 hover:text-indigo-600 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="text-base text-slate-700 hover:text-indigo-600 transition-colors">
                    Get Started
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="text-base text-slate-700 hover:text-indigo-600 transition-colors">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-5">Features</h3>
              <ul className="space-y-4">
                <li className="text-base text-slate-700">Invoice Generation</li>
                <li className="text-base text-slate-700">Inventory Management</li>
                <li className="text-base text-slate-700">Business Analytics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-5">Support</h3>
              <ul className="space-y-4">
                <li className="text-base text-slate-700">24/7 Support</li>
                <li className="text-base text-slate-700">Documentation</li>
                <li className="text-base text-slate-700">Contact Us</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 border-t pt-10">
            <p className="text-center text-base text-slate-700 font-medium">
              &copy; {new Date().getFullYear()} Invotrek. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
