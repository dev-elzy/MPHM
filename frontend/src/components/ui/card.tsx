import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card relative rounded-[18px] text-sm shadow-premium-3d shadow-premium-3d-hover [--card-spacing:--spacing(4)] data-[size=sm]:[--card-spacing:--spacing(3)]",
        className
      )}
    >
      {/* Outer Glow / Soft Gradient Accent (Branded Blue and Gold) */}
      <div className="absolute inset-0 rounded-[18px] bg-linear-to-br from-primary/10 via-transparent to-brand-gold/15 dark:from-primary/20 dark:via-transparent dark:to-brand-gold/20 opacity-50 blur-[2px] transition-opacity duration-300 group-hover/card:opacity-100 pointer-events-none" />
      {/* Main Surface Background with ultra thin border */}
      <div className="absolute inset-px rounded-[17px] bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl ring-1 ring-primary/10 dark:ring-primary/20 group-hover/card:ring-brand-gold/30 pointer-events-none transition-all duration-300" />
      {/* Content wrapper */}
      <div 
        className="relative z-10 flex flex-col gap-(--card-spacing) py-(--card-spacing) h-full rounded-[17px] overflow-hidden group-has-data-[slot=card-footer]/card:pb-0 group-has-[>img:first-child]/card:pt-0" 
        {...props} 
      />
    </div>
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-(--card-spacing)",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
