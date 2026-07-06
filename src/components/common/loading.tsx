import { CircleNotchIcon } from "@phosphor-icons/react"

export default function Loading() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-background select-none">
      <CircleNotchIcon size={40} className="animate-spin text-primary" />
    </div>
  )
}