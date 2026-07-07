import { useGetQuery } from "../../hooks/useGetQuery"
import AnalyticsCard from "../../components/root/analytics-card"
import AnalyticsSkeleton from "../../components/common/analytics-skeleton"
import { PackageIcon, CurrencyDollarIcon, WarningCircleIcon, ShieldCheckIcon } from "@phosphor-icons/react"
import ImageLoader from "../../components/common/image-loader"
import hero from "../../assets/hero.png"

interface AnalyticsData {
  totalProducts: number;
  totalSales: number;
  lowStockProducts: number;
}

export default function Home() {
  const { data: analytics, isLoading } = useGetQuery<AnalyticsData>({
    url: "/analytics",
    isPrivate: true,
    keys: ["analytics"],
  })

  // Format total money
  const formattedSales = typeof analytics?.totalSales === "number"
    ? `$${analytics.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "$0.00"

  return (
    <div className="@container space-y-8 select-none">
      {/* Welcome Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs md:text-sm text-secondary mt-1">
            Real-time terminal statistics and inventory metrics.
          </p>
        </div>
      </div>

      {/* Analytics Grid */}
      {isLoading ? (
        <AnalyticsSkeleton />
      ) : (
        <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-6">
          <AnalyticsCard
            title="Total Products"
            value={analytics?.totalProducts ?? 0}
            icon={<PackageIcon size={26} className="text-primary" />}
            description="Total items registered in database"
            colorClass="bg-primary/15 border-primary/30 text-primary"
          />

          <AnalyticsCard
            title="Total Revenue"
            value={formattedSales}
            icon={<CurrencyDollarIcon size={26} className="text-emerald-600 dark:text-emerald-400" />}
            description="Gross revenue from sales transactions"
            colorClass="bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
          />

          <AnalyticsCard
            title="Low Stock Alerts"
            value={analytics?.lowStockProducts ?? 0}
            icon={<WarningCircleIcon size={26} className="text-rose-600 dark:text-rose-400" />}
            description="Products with stock level below 5"
            colorClass="bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-400"
          />
        </div>
      )}

      {/* Hero presentation Section */}
      <div className="bg-background-card border border-border rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-xs">
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
            <ShieldCheckIcon size={14} />
            System Secure
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
            iCLASSIC IT ERP Portal
          </h2>
          <p className="text-xs md:text-sm text-secondary leading-relaxed max-w-lg">
            Welcome to the centralized manager interface. Use the sidebar menu to navigate through inventory management, sales logs, client transactions, and settings.
          </p>
        </div>

        <div className="w-full max-w-60 shrink-0">
          <ImageLoader src={hero} alt="hero banner presentation" className="w-full h-auto object-contain select-none" />
        </div>
      </div>
    </div>
  )
}