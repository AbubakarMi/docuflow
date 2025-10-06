"use client";

import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Zap,
  Shield,
  Users,
  CheckCircle2,
  Star,
  Trophy,
  Target,
  Rocket,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Speed",
    description: "Generate docs in seconds",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    icon: Shield,
    title: "Fort Knox Security",
    description: "Military-grade protection",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    icon: Users,
    title: "Team Power",
    description: "Collaborate in real-time",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    icon: TrendingUp,
    title: "AI Intelligence",
    description: "Smart automation",
    gradient: "from-purple-400 to-pink-500",
  },
];

const stats = [
  { value: "10M+", label: "Docs Created", icon: FileText, color: "text-blue-600" },
  { value: "50K+", label: "Active Users", icon: Users, color: "text-emerald-600" },
  { value: "99.9%", label: "Uptime", icon: Rocket, color: "text-purple-600" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center justify-between">
            <Logo />
            <Badge className="hidden bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 font-bold text-white shadow-lg sm:flex">
              <CheckCircle2 className="mr-1 h-4 w-4" />
              50K+ Users
            </Badge>
          </div>
          {children}
        </div>
      </div>

      {/* Right Side - Colorful Info Section */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:bg-gradient-to-br lg:from-blue-600 lg:via-purple-600 lg:to-pink-600 lg:p-12 lg:text-white">
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border-2 border-white/30 bg-white/20 px-6 py-3 backdrop-blur-sm">
              <Trophy className="h-6 w-6 text-yellow-300" />
              <span className="text-lg font-black">#1 Document Automation Platform</span>
            </div>
            <h2 className="text-5xl font-black leading-tight">
              Join the Document Revolution!
            </h2>
            <p className="text-xl font-bold text-blue-100">
              50,000+ teams are crushing their goals with DocuFlow's powerful automation.
              Start your free trial and see results in minutes!
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="transform border-4 border-white/30 bg-white/20 p-6 shadow-2xl backdrop-blur-lg transition-all hover:scale-105 hover:bg-white/30"
              >
                <CardContent className="p-0">
                  <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-xl`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-black text-white">
                    {feature.title}
                  </h3>
                  <p className="text-base font-semibold text-blue-100">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Section - Testimonial & Stats */}
        <div className="space-y-8">
          {/* Testimonial */}
          <div className="rounded-2xl border-4 border-white/30 bg-white/20 p-6 backdrop-blur-lg shadow-2xl">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-6 w-6 fill-yellow-300 text-yellow-300"
                  />
                ))}
              </div>
              <span className="text-lg font-black">5.0 Rating</span>
            </div>
            <blockquote className="mb-4 text-xl font-bold italic">
              "DocuFlow transformed our business! We now generate 1000+ documents
              daily with zero errors. Absolutely game-changing!"
            </blockquote>
            <div>
              <div className="text-lg font-black">Sarah Johnson</div>
              <div className="font-bold text-blue-100">CEO, TechStart Inc.</div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="border-4 border-white/30 bg-white/20 p-4 text-center backdrop-blur-lg shadow-xl"
              >
                <CardContent className="p-0">
                  <stat.icon className="mx-auto mb-2 h-8 w-8 text-yellow-300" />
                  <div className="text-3xl font-black text-white">{stat.value}</div>
                  <div className="text-sm font-bold text-blue-100">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge className="bg-yellow-500 px-4 py-2 text-base font-black text-white shadow-lg">
              ⚡ Lightning Fast
            </Badge>
            <Badge className="bg-emerald-500 px-4 py-2 text-base font-black text-white shadow-lg">
              🔒 SOC 2 Certified
            </Badge>
            <Badge className="bg-rose-500 px-4 py-2 text-base font-black text-white shadow-lg">
              🌍 150+ Countries
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
