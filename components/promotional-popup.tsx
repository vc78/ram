"use client"

import React, { useState, useEffect, useRef } from "react"
import { X, Play, Pause, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// SIID Logo Component
function SIIDLogo({ className = "w-12 h-12" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 200 200"
            className={cn(className, "drop-shadow-md")}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <circle cx="100" cy="100" r="95" stroke="#4a9b7e" strokeWidth="2" />
            <g transform="translate(70, 50)">
                <rect x="0" y="10" width="60" height="50" fill="none" stroke="#2d5a6d" strokeWidth="1.5" />
                <rect x="8" y="15" width="10" height="8" fill="#2d5a6d" />
                <rect x="22" y="15" width="10" height="8" fill="#2d5a6d" />
                <rect x="36" y="15" width="10" height="8" fill="#2d5a6d" />
                <rect x="8" y="30" width="10" height="8" fill="#2d5a6d" />
                <rect x="22" y="30" width="10" height="8" fill="#2d5a6d" />
                <rect x="36" y="30" width="10" height="8" fill="#2d5a6d" />
                <path d="M 0 10 L 30 0 L 60 10" fill="none" stroke="#2d5a6d" strokeWidth="1.5" />
            </g>
            <ellipse cx="100" cy="100" rx="55" ry="25" fill="none" stroke="#4a9b7e" strokeWidth="2" />
            <rect x="50" y="130" width="100" height="20" fill="#4a9b7e" rx="3" />
            <text x="100" y="143" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
                SINCE 2025
            </text>
        </svg>
    )
}

// Video Card Component
function VideoCard({ videoPath, index }: { videoPath: string; index: number }) {
    const [isPlaying, setIsPlaying] = useState(true)
    const [isMuted, setIsMuted] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                const playPromise = videoRef.current.play()
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // Autoplay prevented by browser
                        setIsPlaying(false)
                    })
                }
            } else {
                videoRef.current.pause()
            }
        }
    }, [isPlaying])

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted
        }
    }, [isMuted])

    const handlePlayPause = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsPlaying(!isPlaying)
    }

    const handleVolumeToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsMuted(!isMuted)
    }

    return (
        <div className="relative bg-black rounded-lg overflow-hidden group">
            {/* Video */}
            <video
                ref={videoRef}
                src={videoPath}
                className="w-full h-full object-cover"
                autoPlay={false}
                muted={true}
                loop
                playsInline
                onEnded={() => {
                    if (videoRef.current && isPlaying) {
                        videoRef.current.currentTime = 0
                        const playPromise = videoRef.current.play()
                        if (playPromise !== undefined) {
                            playPromise.catch(() => {
                                // Autoplay prevented, keep video paused
                                setIsPlaying(false)
                            })
                        }
                    }
                }}
                style={{ aspectRatio: "16/9", minHeight: "150px" }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/60" />

            {/* Center Play Button */}
            {!isPlaying && (
                <button
                    onClick={handlePlayPause}
                    className="absolute inset-0 flex items-center justify-center z-10 hover:bg-black/20 transition-colors"
                >
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-lg">
                        <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                </button>
            )}

            {/* Video Label */}
            <div className="absolute top-2 left-2 z-10">
                <span className="text-white text-xs font-bold bg-emerald-600 px-2 py-1 rounded">
                    Video {index + 1}
                </span>
            </div>

            {/* Mini Controls */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                    onClick={handlePlayPause}
                    className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm"
                    aria-label="Play/Pause"
                >
                    {isPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                    ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                </button>
                <button
                    onClick={handleVolumeToggle}
                    className="p-1.5 rounded-md bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-sm"
                    aria-label="Mute"
                >
                    {isMuted ? (
                        <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                    )}
                </button>
            </div>
        </div>
    )
}

export default function PromotionalPopup() {
    const [isVisible, setIsVisible] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    // Three promotional videos
    const PROMO_VIDEOS = [
        "/uploads/p1.mp4",
        "/uploads/p2.mp4",
        "/uploads/p3.mp4"
    ]

    useEffect(() => {
        // Show popup on every page visit after 5 seconds
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, 5000)

        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        // Attempt to play videos when popup becomes visible
        if (isVisible && !isClosing) {
            // Give browser time to render the videos
            const playTimer = setTimeout(() => {
                const videoElements = document.querySelectorAll('video')
                videoElements.forEach((video) => {
                    const playPromise = video.play()
                    if (playPromise !== undefined) {
                        playPromise.catch(() => {
                            // Autoplay prevented - video will remain paused
                            console.log('Video autoplay prevented by browser policy')
                        })
                    }
                })
            }, 100)
            return () => clearTimeout(playTimer)
        }
    }, [isVisible, isClosing])

    const handleClose = () => {
        setIsClosing(true)
        // Pause all videos
        const videoElements = document.querySelectorAll('video')
        videoElements.forEach((video) => {
            video.pause()
        })
        setTimeout(() => {
            setIsVisible(false)
            setIsClosing(false)
        }, 300)
    }

    if (!isVisible) return null

    return (
        <>
            {/* Backdrop Blur */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/50 backdrop-blur-md z-40 transition-opacity duration-300",
                    isClosing ? "opacity-0" : "opacity-100"
                )}
                onClick={handleClose}
            />

            {/* Promotional Popup Modal - Three Videos Side by Side */}
            <div
                className={cn(
                    "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50",
                    "w-full max-w-4xl mx-auto px-4",
                    "transition-all duration-300 ease-out",
                    isClosing
                        ? "opacity-0 scale-95"
                        : "opacity-100 scale-100 animate-in fade-in slide-in-from-bottom-4 duration-500"
                )}
            >
                <div className="bg-black rounded-3xl shadow-2xl overflow-hidden border border-emerald-500/30">
                    {/* Close Button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200 backdrop-blur-sm"
                        aria-label="Close popup"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Three Videos Grid */}
                    <div className="p-4">
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            {PROMO_VIDEOS.map((videoPath, index) => (
                                <VideoCard key={index} videoPath={videoPath} index={index} />
                            ))}
                        </div>

                        {/* Content Below Videos */}
                        <div className="space-y-3">
                            {/* Title & Description */}
                            <div className="space-y-1.5">
                                <h3 className="text-lg font-bold text-white">
                                    AI Construction Platform
                                </h3>
                                <p className="text-emerald-200 text-xs leading-relaxed">
                                    Watch how SIID FLASH transforms construction design, cost analysis, and project management. Three powerful demonstrations of our AI capabilities.
                                </p>
                            </div>

                            {/* Quick Features */}
                            <div className="grid grid-cols-3 gap-1.5 py-2.5 border-y border-white/10">
                                <div className="text-center">
                                    <p className="text-emerald-400 font-bold text-base">3x</p>
                                    <p className="text-white/70 text-xs">Faster</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-emerald-400 font-bold text-base">40%</p>
                                    <p className="text-white/70 text-xs">Savings</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-emerald-400 font-bold text-base">99%</p>
                                    <p className="text-white/70 text-xs">Compliance</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 pt-2">
                                <Button
                                    asChild
                                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-semibold text-sm shadow-lg py-1.5"
                                >
                                    <a href="/3d-generator">
                                        Start Free Design
                                    </a>
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    variant="outline"
                                    className="w-full border border-emerald-500/50 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-medium text-sm py-1.5"
                                >
                                    Close
                                </Button>
                            </div>

                            {/* Footer Note */}
                            <p className="text-white/50 text-xs text-center leading-relaxed">
                                Architects • Contractors • Engineers
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
