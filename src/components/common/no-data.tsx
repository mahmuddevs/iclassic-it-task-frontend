import { FolderOpen } from "@phosphor-icons/react"

interface NoDataProps {
  title: string;
  subtitle: string;
}

export default function NoData({
  title,
  subtitle,
}: NoDataProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 bg-background-card rounded-xl border border-border shadow-xs text-center w-full">
      <div className="p-3 bg-slate-100 dark:bg-slate-800 text-secondary rounded-full mb-3 animate-pulse">
        <FolderOpen size={32} />
      </div>
      <h6 className="text-foreground font-bold text-sm">{title}</h6>
      <p className="text-xs text-secondary mt-1 max-w-70 mx-auto">
        {subtitle}
      </p>
    </div>
  )
}