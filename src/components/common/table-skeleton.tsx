export default function TableSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse w-full">
      {/* Table Header Skeleton */}
      <div className="h-12 bg-slate-100 dark:bg-slate-800/40 rounded-xl w-full" />
      
      {/* Table Body Rows Skeleton */}
      <div className="space-y-3 w-full">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="h-14 bg-slate-100 dark:bg-slate-800/20 rounded-xl w-full" 
          />
        ))}
      </div>
    </div>
  )
}
