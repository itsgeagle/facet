"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number[]) => void
  className?: string
}

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  disabled,
  ...props
}: SliderProps) {
  const currentValue = value?.[0] ?? defaultValue?.[0] ?? min
  const percentage = max > min ? ((currentValue - min) / (max - min)) * 100 : 0

  return (
    <div
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Track */}
      <div
        data-slot="slider-track"
        className="relative h-1 w-full grow overflow-hidden rounded-full bg-muted"
      >
        {/* Fill indicator */}
        <div
          data-slot="slider-range"
          className="absolute h-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Thumb */}
      <div
        data-slot="slider-thumb"
        className="absolute size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] -translate-x-1/2"
        style={{ left: `${percentage}%` }}
      />

      {/* Native range input — invisible but handles all interaction and a11y */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        disabled={disabled}
        onChange={(e) => onValueChange?.([Number(e.target.value)])}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        {...props}
      />
    </div>
  )
}

export { Slider }
