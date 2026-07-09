import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-[10px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 px-3 py-2 text-sm transition-all duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:border-zinc-400 focus-visible:ring-[3px] focus-visible:ring-zinc-400/20 dark:focus-visible:border-zinc-600 dark:focus-visible:ring-zinc-600/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-[3px] aria-invalid:ring-red-500/20 shadow-xs",
        className
      )}
      {...props}
    />
  )
}

export { Input }
