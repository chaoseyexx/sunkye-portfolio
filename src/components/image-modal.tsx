"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { X } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  imageAlt: string
}

export function ImageModal({ isOpen, onClose, imageSrc, imageAlt }: ImageModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  // Handle escape key press to close modal
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
      window.addEventListener("keydown", handleEscapeKey)
    }

    return () => {
      document.body.style.overflow = "" // Restore scrolling when modal is closed
      window.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isOpen, onClose])

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setIsLoaded(false)
      }, 300) // Match this with the CSS transition duration
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Handle click outside to close
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose()
    }
  }

  if (!isAnimating && !isOpen) return null

  return (
    <div
      ref={modalRef}
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300",
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none",
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "relative max-w-[90vw] max-h-[90vh] transition-all duration-500 transform",
          isOpen
            ? isLoaded
              ? "scale-100 translate-y-0 opacity-100"
              : "scale-95 translate-y-4 opacity-90"
            : "scale-90 translate-y-8 opacity-0",
        )}
      >
        <button
          className="absolute -top-4 -right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-white shadow-lg hover:bg-neutral-800 transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className={cn(
            "relative rounded-lg overflow-hidden border border-neutral-700 shadow-2xl transition-all duration-500",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            ref={imageRef as any}
            src={imageSrc || "/placeholder.svg"}
            alt={imageAlt}
            width={1200}
            height={800}
            className="max-h-[80vh] w-auto object-contain bg-neutral-900"
            onLoad={() => setIsLoaded(true)}
          />

          {/* Loading indicator */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
              <div className="w-12 h-12 rounded-full border-4 border-neutral-700 border-t-primary animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
