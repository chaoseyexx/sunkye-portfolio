import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

export function getImageUrl(
  baseUrl: string,
  query?: string,
  defaultImage = "/blocky-characters-adventure.png",
): string {
  if (!baseUrl || baseUrl === "") return defaultImage
  if (!query || query === "") return baseUrl
  return `${baseUrl}?height=250&width=400&query=${encodeURIComponent(query)}`
}
