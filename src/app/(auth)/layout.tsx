import { Logo } from "@/components/logo";
import { Shield, CheckCircle2, TrendingUp, Users } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <Logo />
          </div>
          {children}
        </div>
      </div>

      {/* Right Side - Professional Design */}
      <div className="relative hidden w-0 flex-1 lg:block bg-slate-50">
        <div className="absolute inset-0 h-full w-full">
          <div className="flex h-full flex-col justify-center px-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-slate-900">
                  Manage Your Business Better
                </h2>
                <p className="mt-4 text-xl text-slate-600">
                  Invoice and inventory management system trusted by businesses worldwide.
                </p>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">Multi-Tenant Security</h3>
                    <p className="text-slate-600 mt-1">
                      Your business data is completely isolated and secure
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">Real-Time Analytics</h3>
                    <p className="text-slate-600 mt-1">
                      Track your business performance with live dashboards
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">Automatic Inventory</h3>
                    <p className="text-slate-600 mt-1">
                      Stock levels update automatically when invoices are created
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-600">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-lg">Team Collaboration</h3>
                    <p className="text-slate-600 mt-1">
                      Work together with role-based access control
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Join businesses already using Invotrek for their operations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
