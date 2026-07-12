"use client"

import type { ReactNode } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

type ScrollAnimationProps = {
  children: ReactNode
  className?: string
  animation?: "fade-in-up" | "fade-in-down" | "fade-in-left" | "fade-in-right" | "scale-in"
  duration?: "duration-300" | "duration-500" | "duration-700" | "duration-1000"
  delay?: "delay-100" | "delay-200" | "delay-300" | "delay-400" | "delay-500" | "" | any
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function ScrollAnimation({
  children,
  className = "",
  animation = "fade-in-up",
  duration = "duration-700",
  delay = "",
  threshold = 0.1,
  rootMargin = "0px",
  once = true,
}: ScrollAnimationProps) {
  const { ref, isVisible } = useScrollAnimation({
    threshold,
    rootMargin,
    triggerOnce: once,
  })

  return (
    <div
      ref={ref}
      className={`scroll-animate ${animation} ${duration} ${delay} ${isVisible ? "visible" : ""} ${className}`}
    >
      {children}
    </div>
  )
}
