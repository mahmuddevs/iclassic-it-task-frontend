import React from "react"

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  colorClass: string; // e.g., "text-primary bg-primary/10 border-primary/20"
}

export default function AnalyticsCard({
  title,
  value,
  icon,
  description,
  colorClass,
}: AnalyticsCardProps) {
  return (
    <div className="@container h-full flex flex-col">
      <div className="group bg-background-card border border-border rounded-2xl p-5 md:p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex @max-3xs:flex-col-reverse gap-2 @max-3xs:items-start items-center justify-between select-none h-full flex-1">
        <div className="space-y-2 flex-1">
          <span className="text-xs font-bold text-secondary uppercase tracking-wider block">
            {title}
          </span>
          <h3 className="text-xl md:text-3xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
            {value}
          </h3>
          <p className="text-[11px] text-secondary leading-normal">
            {description}
          </p>
        </div>

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 shrink-0 ${colorClass}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
