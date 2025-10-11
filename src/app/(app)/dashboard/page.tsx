
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileText, Package, TrendingUp } from "lucide-react"
import { Overview } from "@/components/dashboard/overview"
import { formatCurrency } from "@/lib/utils";

const NairaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
    <path d="M6 18h12M6 12h12M6 6h12M18 6l-12 12M6 18l12-12"/>
  </svg>
);


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-[1800px] mx-auto">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Total Revenue</CardTitle>
            <NairaIcon />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(4523189, 'NGN')}</div>
            <p className="text-sm text-muted-foreground mt-1">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Total Cost</CardTitle>
            <NairaIcon />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(2111245, 'NGN')}</div>
            <p className="text-sm text-muted-foreground mt-1">
              +18.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Profit</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">{formatCurrency(2411944, 'NGN')}</div>
            <p className="text-sm text-muted-foreground mt-1">
              +22.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Documents Generated</CardTitle>
            <FileText className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">+573</div>
            <p className="text-sm text-muted-foreground mt-1">
              +201 since last hour
            </p>
          </CardContent>
        </Card>
      </div>
      <div>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Profit Overview</CardTitle>
            <CardDescription className="text-base mt-1">
              Your profit analytics for the last 12 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Overview />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
