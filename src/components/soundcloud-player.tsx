"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SoundCloudPlayerProps {
  className?: string
  playlistUrl?: string
}

declare global {
  interface Window {
    SC: any
  }
}

export function SoundCloudPlayer({
  className,
  playlistUrl = "https://soundcloud.com/lofi_girl/sets/peaceful-piano-music-to-focus",
}: SoundCloudPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true) // Start muted
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentTrack, setCurrentTrack] = useState("")
  const [userInteracted, setUserInteracted] = useState(false)
  const playerRef = useRef<any>(null)
  const widgetRef = useRef<any>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Load SoundCloud Widget API
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://w.soundcloud.com/player/api.js"
    script.async = true
    script.onload = () => {
      setIsLoaded(true)
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Track user interaction for autoplay
  useEffect(() => {
    const handleInteraction = () => {
      setUserInteracted(true)
    }

    // Add event listeners for common user interactions
    window.addEventListener("click", handleInteraction)
    window.addEventListener("touchstart", handleInteraction)
    window.addEventListener("keydown", handleInteraction)

    return () => {
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("touchstart", handleInteraction)
      window.removeEventListener("keydown", handleInteraction)
    }
  }, [])

  // Initialize SoundCloud Widget
  useEffect(() => {
    if (!isLoaded || !window.SC) return

    if (iframeRef.current) {
      widgetRef.current = window.SC.Widget(iframeRef.current)

      widgetRef.current.bind(window.SC.Widget.Events.READY, () => {
        playerRef.current = widgetRef.current

        // Set initial volume to 0 (muted)
        playerRef.current.setVolume(0)

        // Get current track info
        playerRef.current.getCurrentSound((sound: any) => {
          if (sound) {
            setCurrentTrack(sound.title)
          }
        })
      })

      // Track events
      widgetRef.current.bind(window.SC.Widget.Events.PLAY, () => {
        setIsPlaying(true)
        playerRef.current.getCurrentSound((sound: any) => {
          if (sound) {
            setCurrentTrack(sound.title)
          }
        })
      })

      widgetRef.current.bind(window.SC.Widget.Events.PAUSE, () => {
        setIsPlaying(false)
      })

      widgetRef.current.bind(window.SC.Widget.Events.FINISH, () => {
        // Track finished, will auto-advance in playlist
      })
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.unbind(window.SC.Widget.Events.READY)
        playerRef.current.unbind(window.SC.Widget.Events.PLAY)
        playerRef.current.unbind(window.SC.Widget.Events.PAUSE)
        playerRef.current.unbind(window.SC.Widget.Events.FINISH)
      }
    }
  }, [isLoaded, isMuted])

  // Handle autoplay after user interaction (to comply with browser policies)
  useEffect(() => {
    // No autoplay attempts - only play when unmuted by user
  }, [userInteracted, isMuted, isPlaying])

  // Handle mute/unmute
  useEffect(() => {
    if (!playerRef.current) return

    if (isMuted) {
      playerRef.current.setVolume(0)
      if (isPlaying) {
        playerRef.current.pause()
      }
    } else {
      playerRef.current.setVolume(40)
      // Try to play if we have user interaction
      if (userInteracted || document.hasFocus()) {
        playerRef.current.play()
      }
    }
  }, [isMuted, isPlaying, userInteracted])

  const toggleMute = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)

    if (!newMutedState && playerRef.current) {
      // If we're unmuting, start playing
      playerRef.current.play()
    }
  }

  return (
    <div className={cn("fixed z-50", className)}>
      {/* Hidden iframe for SoundCloud Widget */}
      <iframe
        ref={iframeRef}
        width="100%"
        height="166"
        scrolling="no"
        frameBorder="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(playlistUrl)}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`}
        style={{ display: "none" }}
        title="SoundCloud Player"
      />

      <div className="flex items-center gap-3">
        <Button
          variant={isMuted ? "default" : "outline"}
          size={isMuted ? "default" : "icon"}
          className={
            isMuted
              ? "rounded-full bg-primary/80 backdrop-blur-md hover:bg-primary"
              : "rounded-full bg-background/50 backdrop-blur-md border-neutral-700/50 hover:bg-background/80"
          }
          onClick={toggleMute}
          aria-label={isMuted ? "Play music" : "Mute music"}
        >
          {isMuted ? (
            <>
              <Volume2 className="h-4 w-4 mr-2" /> Play Music
            </>
          ) : (
            <Volume2 className="h-4 w-4 text-primary" />
          )}
        </Button>

        {!isMuted && (
          <div className="bg-background/50 backdrop-blur-md px-4 py-2 rounded-full text-xs text-neutral-300 border border-neutral-700/50">
            <div className="flex items-center gap-2">
              <Music className="h-3 w-3 animate-pulse" />
              <span className="truncate max-w-[150px]">{currentTrack || "Lofi Piano Music"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
