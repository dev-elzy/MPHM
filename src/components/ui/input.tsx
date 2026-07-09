import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10.5 w-full min-w-0 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 px-3.5 py-2 text-sm transition-all duration-200 outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-zinc-400 dark:placeholder:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15 dark:focus-visible:border-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-4 aria-invalid:ring-red-500/20 shadow-xs",
        className
      )}
      {...props}
    />
  )
}

export { Input }
