"use client"

import { useEffect } from "react"

export function useWelcomeVoice() {
  useEffect(() => {
    // Only execute on browser client
    if (typeof window === "undefined") return

    const handleInteraction = () => {
      if ("speechSynthesis" in window && !sessionStorage.getItem("voicePlayed")) {
        // Add a slight delay so it doesn't overlap exactly with the UI loading/click
        setTimeout(() => {
          // Double check to prevent race conditions from spam-clicking
          if (!sessionStorage.getItem("voicePlayed")) {
            const msg = new SpeechSynthesisUtterance("Hii Welcome to SIID Infrastructure Mr Agent")
            msg.rate = 1
            msg.pitch = 1
            
            // Try playing the voice
            try {
              window.speechSynthesis.speak(msg)
              sessionStorage.setItem("voicePlayed", "true")
            } catch (err) {
              console.warn("Speech synthesis error", err)
            }
          }
        }, 800)
      }

      // Important: Remove listeners immediately after the *first* interaction
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("touchstart", handleInteraction)
      window.removeEventListener("keydown", handleInteraction)
    }

    // Attach to common first-interaction events
    window.addEventListener("click", handleInteraction, { once: true })
    window.addEventListener("touchstart", handleInteraction, { once: true })
    window.addEventListener("keydown", handleInteraction, { once: true })

    return () => {
      // Cleanup listeners on unmount
      window.removeEventListener("click", handleInteraction)
      window.removeEventListener("touchstart", handleInteraction)
      window.removeEventListener("keydown", handleInteraction)
    }
  }, [])
}
