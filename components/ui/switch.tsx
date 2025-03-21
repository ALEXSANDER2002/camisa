"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// Definir as propriedades que o Switch original aceitava
interface SwitchProps extends React.HTMLAttributes<HTMLSpanElement> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
}

const Switch = React.forwardRef<HTMLSpanElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("inline-flex items-center text-sm text-muted-foreground italic", className)}
      {...props}
    >
      (opcional)
    </span>
  ),
)
Switch.displayName = "Switch"

export { Switch }

