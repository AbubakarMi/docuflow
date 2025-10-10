"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Zap,
  Shield,
  BarChart3,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Star,
} from "lucide-react";
import { Logo } from "@/components/logo";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Generate documents in seconds with AI-powered automation",
    color: "bg-indigo-600",
  },
  {
    icon: Shield,
    title: "Secure & Safe",
    description: "Enterprise-grade security with end-to-end encryption",
    color: "bg-emerald-600",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track and analyze your document workflow in real-time",
    color: "bg-violet-600",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with your entire team",
    color: "bg-sky-600",
  },
  {
    icon: FileText,
    title: "Smart Templates",
    description: "AI-powered templates that adapt to your needs",
    color: "bg-rose-600",
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Automate repetitive tasks and boost productivity",
    color: "bg-amber-600",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo />
            </div>

            <div className="hidden items-center gap-8 md:flex">
              <Link href="#features" className="text-base font-semibold text-slate-700 hover:text-indigo-600">
                Features
              </Link>
              <Link href="#benefits" className="text-base font-semibold text-slate-700 hover:text-indigo-600">
                Benefits
              </Link>
              <Link href="#pricing" className="text-base font-semibold text-slate-700 hover:text-indigo-600">
                Pricing
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-base font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-indigo-600 text-base font-semibold hover:bg-indigo-700">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-8 bg-indigo-100 px-4 py-2 text-indigo-700 hover:bg-indigo-100">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Document Automation
            </Badge>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Transform Your Document Workflow
            </h1>

            <p className="mb-10 text-xl leading-8 text-slate-600">
              Generate, manage, and automate thousands of documents with AI.
              Join 50,000+ teams who trust DocuFlow for their document needs.
            </p>

            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/signup">
                <Button size="lg" className="h-14 bg-indigo-600 px-8 text-lg font-semibold hover:bg-indigo-700">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold">
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div>
                <p className="text-4xl font-bold text-indigo-600">10M+</p>
                <p className="mt-2 text-sm font-medium text-slate-600">Documents Generated</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-emerald-600">50K+</p>
                <p className="mt-2 text-sm font-medium text-slate-600">Active Users</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-violet-600">99.9%</p>
                <p className="mt-2 text-sm font-medium text-slate-600">Uptime</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-amber-600">24/7</p>
                <p className="mt-2 text-sm font-medium text-slate-600">Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Everything you need to succeed
            </h2>
            <p className="text-lg leading-8 text-slate-600">
              Powerful features designed to streamline your document workflow
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-slate-200 transition-shadow hover:shadow-lg">
                <CardContent className="p-8">
                  <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl ${feature.color}`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="text-base leading-7 text-slate-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-base font-semibold text-slate-700">4.9/5 Rating</span>
            </div>
            <Badge className="bg-emerald-100 px-4 py-2 text-emerald-700 hover:bg-emerald-100">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              SOC 2 Certified
            </Badge>
            <Badge className="bg-indigo-100 px-4 py-2 text-indigo-700 hover:bg-indigo-100">
              150+ Countries Worldwide
            </Badge>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Ready to get started?
            </h2>
            <p className="mb-10 text-xl leading-8 text-indigo-100">
              Join thousands of teams already using DocuFlow. Start your free trial today.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/signup">
                <Button size="lg" className="h-14 bg-white px-8 text-lg font-semibold text-indigo-600 hover:bg-slate-50">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 border-white px-8 text-lg font-semibold text-white hover:bg-indigo-700">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo />
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Document automation for modern teams.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#features" className="text-slate-600 hover:text-indigo-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="text-slate-600 hover:text-indigo-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-600 hover:text-indigo-600">
                    Templates
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Company</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-slate-600 hover:text-indigo-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-600 hover:text-indigo-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-600 hover:text-indigo-600">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-semibold text-slate-900">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="#" className="text-slate-600 hover:text-indigo-600">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-600 hover:text-indigo-600">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-600 hover:text-indigo-600">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center">
            <p className="text-sm text-slate-600">
              &copy; 2025 DocuFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
