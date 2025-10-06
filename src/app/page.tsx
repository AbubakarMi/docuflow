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
  Globe,
  Lock,
  TrendingUp,
  Rocket,
  Star,
  Menu,
} from "lucide-react";
import { Logo } from "@/components/logo";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast Processing",
    description: "Generate thousands of documents in seconds with our AI-powered automation engine",
    color: "bg-yellow-500",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    icon: Shield,
    title: "Military-Grade Security",
    description: "Bank-level encryption and compliance with international security standards",
    color: "bg-emerald-500",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track performance with beautiful dashboards and actionable insights",
    color: "bg-purple-500",
    gradient: "from-purple-400 to-pink-500",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time updates and shared workspaces",
    color: "bg-blue-500",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    icon: FileText,
    title: "Smart Templates",
    description: "AI-powered templates that adapt to your needs and learn from your patterns",
    color: "bg-rose-500",
    gradient: "from-rose-400 to-red-500",
  },
  {
    icon: Clock,
    title: "Save 10+ Hours Weekly",
    description: "Automate repetitive tasks and focus on what really matters to your business",
    color: "bg-indigo-500",
    gradient: "from-indigo-400 to-violet-500",
  },
];

const stats = [
  { value: "10M+", label: "Documents Generated", color: "text-blue-600" },
  { value: "50K+", label: "Happy Users", color: "text-emerald-600" },
  { value: "99.9%", label: "Uptime SLA", color: "text-purple-600" },
  { value: "24/7", label: "Expert Support", color: "text-orange-600" },
];

const benefits = [
  { text: "Unlimited document generation", icon: CheckCircle2, color: "text-blue-500" },
  { text: "AI-powered smart templates", icon: CheckCircle2, color: "text-purple-500" },
  { text: "Real-time team collaboration", icon: CheckCircle2, color: "text-emerald-500" },
  { text: "Advanced analytics dashboard", icon: CheckCircle2, color: "text-orange-500" },
  { text: "Priority 24/7 customer support", icon: CheckCircle2, color: "text-rose-500" },
  { text: "Custom branding & white-label", icon: CheckCircle2, color: "text-cyan-500" },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-purple-200 bg-white/80 shadow-lg backdrop-blur-lg dark:border-purple-800 dark:bg-gray-900/80">
        <div className="container flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <Sparkles className="mr-1 h-3 w-3" />
              Pro
            </Badge>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-base font-semibold text-gray-700 transition-colors hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
            >
              Features
            </Link>
            <Link
              href="#benefits"
              className="text-base font-semibold text-gray-700 transition-colors hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
            >
              Benefits
            </Link>
            <Link
              href="#pricing"
              className="text-base font-semibold text-gray-700 transition-colors hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-2 border-purple-500 text-purple-600 hover:bg-purple-50">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:from-blue-700 hover:to-purple-700">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-12 py-24 md:py-32">
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 text-lg text-white shadow-lg">
            <Rocket className="mr-2 h-5 w-5" />
            AI-Powered Document Automation
          </Badge>
        </div>
        <div className="flex max-w-5xl flex-col items-center gap-6 text-center">
          <h1 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Transform Your{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Document Workflow
            </span>{" "}
            with AI Magic
          </h1>
          <p className="max-w-3xl text-xl font-medium text-gray-700 dark:text-gray-300 sm:text-2xl">
            Generate, manage, and automate thousands of documents in seconds.
            Join 50,000+ teams who trust DocuFlow to revolutionize their workflow.
          </p>
        </div>
        <div className="flex flex-col gap-6 sm:flex-row">
          <Link href="/signup">
            <Button size="lg" className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 px-12 text-lg font-bold text-white shadow-2xl hover:from-blue-700 hover:to-purple-700">
              Start Free Trial - No Credit Card
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="h-16 border-4 border-purple-600 px-12 text-lg font-bold text-purple-600 hover:bg-purple-50">
              Watch Demo
              <Sparkles className="ml-3 h-6 w-6" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 grid w-full grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
              <div className={`text-4xl font-black md:text-5xl ${stat.color}`}>{stat.value}</div>
              <div className="mt-2 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Badge className="bg-yellow-500 px-4 py-2 text-base text-white">
            <Star className="mr-1 h-4 w-4 fill-white" />
            4.9/5 Rating
          </Badge>
          <Badge className="bg-emerald-500 px-4 py-2 text-base text-white">
            <CheckCircle2 className="mr-1 h-4 w-4" />
            SOC 2 Certified
          </Badge>
          <Badge className="bg-blue-500 px-4 py-2 text-base text-white">
            <Globe className="mr-1 h-4 w-4" />
            150+ Countries
          </Badge>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t-4 border-purple-300 bg-white py-24 dark:bg-gray-900">
        <div className="container">
          <div className="mb-16 flex flex-col items-center gap-6 text-center">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 text-lg text-white">
              Powerful Features
            </Badge>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Dominate
              </span>
            </h2>
            <p className="max-w-3xl text-xl font-medium text-gray-600 dark:text-gray-400">
              Packed with cutting-edge features designed to supercharge your productivity
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-4 border-transparent bg-gradient-to-br from-white to-gray-50 shadow-2xl transition-all hover:scale-105 hover:border-purple-400 hover:shadow-purple-300 dark:from-gray-800 dark:to-gray-900"
              >
                <CardContent className="flex flex-col gap-6 p-8">
                  <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-xl`}>
                    <feature.icon className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-base font-medium text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 py-24 dark:from-purple-900 dark:via-pink-900 dark:to-orange-900">
        <div className="container">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="flex flex-col justify-center gap-8">
              <Badge className="w-fit bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2 text-lg text-white">
                Why Choose Us
              </Badge>
              <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
                Built for{" "}
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Winners
                </span>
              </h2>
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
                Join the elite teams who refuse to settle for mediocrity.
                DocuFlow gives you the competitive edge you need.
              </p>
              <ul className="grid gap-5">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-4 rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800">
                    <benefit.icon className={`h-7 w-7 flex-shrink-0 ${benefit.color}`} />
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">{benefit.text}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4">
                <Link href="/signup">
                  <Button size="lg" className="h-14 bg-gradient-to-r from-emerald-600 to-teal-600 px-10 text-lg font-bold">
                    Start Now
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="grid gap-6 sm:grid-cols-2">
                <Card className="border-4 border-blue-400 bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-2xl">
                  <CardContent className="flex flex-col gap-3 p-8">
                    <Globe className="h-12 w-12" />
                    <h3 className="text-2xl font-bold">Global Reach</h3>
                    <p className="font-medium">
                      Access from anywhere, anytime, on any device
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-4 border-emerald-400 bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-2xl sm:mt-12">
                  <CardContent className="flex flex-col gap-3 p-8">
                    <Lock className="h-12 w-12" />
                    <h3 className="text-2xl font-bold">Fort Knox Security</h3>
                    <p className="font-medium">
                      Military-grade encryption protects your data
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-4 border-purple-400 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl">
                  <CardContent className="flex flex-col gap-3 p-8">
                    <TrendingUp className="h-12 w-12" />
                    <h3 className="text-2xl font-bold">Infinite Scale</h3>
                    <p className="font-medium">
                      Grows effortlessly with your business
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-4 border-orange-400 bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-2xl sm:mt-12">
                  <CardContent className="flex flex-col gap-3 p-8">
                    <Sparkles className="h-12 w-12" />
                    <h3 className="text-2xl font-bold">AI Magic</h3>
                    <p className="font-medium">
                      Smart automation learns your workflow
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y-4 border-purple-400 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-24">
        <div className="container">
          <div className="flex flex-col items-center gap-8 text-center text-white">
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Ready to Transform Your Business?
            </h2>
            <p className="max-w-3xl text-2xl font-bold">
              Join 50,000+ teams who are crushing it with DocuFlow.
              Start your free trial today - no credit card required!
            </p>
            <div className="flex flex-col gap-6 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" className="h-16 border-4 border-white bg-white px-12 text-lg font-black text-purple-600 shadow-2xl hover:bg-gray-100">
                  Get Started Free Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 border-4 border-white px-12 text-lg font-black text-white hover:bg-white/20"
                >
                  Talk to Sales Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-4 border-purple-300 bg-gray-900 py-16 text-white">
        <div className="container">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <Logo />
              <p className="mt-6 text-base font-semibold text-gray-400">
                The world's most powerful document automation platform.
              </p>
            </div>
            <div>
              <h4 className="mb-6 text-xl font-bold">Product</h4>
              <ul className="space-y-3 text-base font-medium text-gray-400">
                <li>
                  <Link href="#features" className="transition-colors hover:text-purple-400">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="transition-colors hover:text-purple-400">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-400">
                    Templates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-xl font-bold">Company</h4>
              <ul className="space-y-3 text-base font-medium text-gray-400">
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-400">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-400">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-400">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-6 text-xl font-bold">Legal</h4>
              <ul className="space-y-3 text-base font-medium text-gray-400">
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-400">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-400">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="transition-colors hover:text-purple-400">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center">
            <p className="text-base font-semibold text-gray-400">
              &copy; 2025 DocuFlow. All rights reserved. Built with 💜 for ambitious teams.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
