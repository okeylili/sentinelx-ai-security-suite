import { cn } from "@/lib/utils"

export function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary/10" />
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    </div>
  )
}
