export default function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-1 @3xl:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-background-card border border-border rounded-2xl p-5 md:p-6 flex items-center justify-between select-none animate-pulse h-32"
        >
          <div className="space-y-3 flex-1 min-w-0">
            {/* Title skeleton */}
            <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded-md w-2/5" />
            {/* Value skeleton */}
            <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-md w-3/5" />
            {/* Description skeleton */}
            <div className="h-2.5 bg-slate-100 dark:bg-slate-900/60 rounded-md w-4/5" />
          </div>
          {/* Icon placeholder skeleton */}
          <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 shrink-0 ml-4" />
        </div>
      ))}
    </div>
  )
}
