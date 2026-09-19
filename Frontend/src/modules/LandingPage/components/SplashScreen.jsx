import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, VolumeX, X, Play, ArrowRight, Sparkles } from 'lucide-react'

export default function SplashScreen({ onComplete, autoDismiss = true }) {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      if (video.duration) {
        const pct = (video.currentTime / video.duration) * 100
        setProgress(pct)
      }
    }

    const handleEnded = () => {
      if (autoDismiss) {
        handleDismiss()
      }
    }

    const handlePlay = () => {
      setIsPlaying(true)
      setHasStarted(true)
    }

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('play', handlePlay)

    // Attempt autoplay
    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
          setHasStarted(true)
        })
        .catch(() => {
          // Autoplay was prevented; wait for user interaction
          setIsPlaying(false)
        })
    }

    // Safety fallback timeout: if video fails or hangs, auto dismiss after 8 seconds
    const fallbackTimer = setTimeout(() => {
      if (autoDismiss) {
        handleDismiss()
      }
    }, 8500)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleDismiss()
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('play', handlePlay)
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(fallbackTimer)
    }
  }, [autoDismiss])

  const handleDismiss = () => {
    if (videoRef.current) {
      videoRef.current.pause()
    }
    try {
      sessionStorage.setItem('appzeto_splash_seen', 'true')
    } catch (e) {
      // Ignore quota errors
    }
    if (onComplete) {
      onComplete()
    }
  }

  const toggleSound = (e) => {
    e.stopPropagation()
    if (videoRef.current) {
      const nextState = !isMuted
      videoRef.current.muted = nextState
      setIsMuted(nextState)
    }
  }

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.03, filter: 'blur(10px)' }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-[99999] bg-[#020617] flex items-center justify-center overflow-hidden select-none"
      >
        {/* Background ambient glow matching Appzeto 4 pillars */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
          <div className="absolute -top-[10%] left-[10%] w-[500px] h-[500px] rounded-full bg-[#FF5722] opacity-20 blur-[130px] animate-pulse" />
          <div className="absolute top-[30%] -right-[5%] w-[450px] h-[450px] rounded-full bg-[#F59E0B] opacity-15 blur-[120px]" />
          <div className="absolute -bottom-[10%] left-[30%] w-[550px] h-[550px] rounded-full bg-[#0284C7] opacity-20 blur-[140px]" />
          <div className="absolute bottom-[20%] -left-[5%] w-[400px] h-[400px] rounded-full bg-[#10B981] opacity-20 blur-[120px]" />
        </div>

        {/* Video Canvas Container */}
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={videoRef}
            src="/splash-video.mp4"
            playsInline
            muted={isMuted}
            preload="auto"
            className="w-full h-full object-cover sm:object-contain max-h-screen"
            onClick={() => {
              if (!isPlaying) handleManualPlay()
            }}
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/60 pointer-events-none" />

          {/* Top Brand Bar */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-30 pointer-events-auto">
            <div className="flex items-center gap-3 bg-slate-950/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-xl">
              <img
                src="/brand-logo.jpeg"
                alt="Appzeto Super App"
                className="h-9 w-auto rounded-lg object-contain bg-white/5 p-1"
              />
              <div className="hidden sm:block text-left">
                <p className="text-xs font-black tracking-wider text-white uppercase">Appzeto Super App</p>
                <p className="text-[10px] text-emerald-400 font-medium tracking-tight">One App • Multiple Services</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Sound Toggle */}
              <button
                type="button"
                onClick={toggleSound}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white/90 border border-white/15 backdrop-blur-xl transition-all shadow-lg hover:scale-105 active:scale-95 text-xs font-semibold cursor-pointer"
                aria-label="Toggle Sound"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-amber-400" />
                    <span className="hidden sm:inline">Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="hidden sm:inline">Sound On</span>
                  </>
                )}
              </button>

              {/* Skip Button */}
              <button
                type="button"
                onClick={handleDismiss}
                className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#00838F] to-[#0284C7] hover:from-[#0097A7] hover:to-[#039BE5] text-white font-bold text-xs tracking-wide shadow-lg shadow-cyan-500/25 border border-cyan-400/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Skip to App</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* If video didn't autoplay, show large center play button */}
          {!isPlaying && !hasStarted && (
            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 backdrop-blur-sm">
              <button
                type="button"
                onClick={handleManualPlay}
                className="flex items-center gap-3 px-6 py-3.5 rounded-full bg-white text-slate-950 font-black text-sm shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                  <Play className="w-4 h-4 fill-white translate-x-0.5" />
                </div>
                <span>Watch Appzeto Intro</span>
              </button>
            </div>
          )}

          {/* Bottom Brand Pill & Progress Ring */}
          <div className="absolute bottom-8 left-6 right-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-30 pointer-events-auto max-w-5xl mx-auto">
            {/* 4 Pillars Mini-Pill Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-950/70 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-orange-400">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                Food
              </span>
              <span className="text-white/20 text-xs">•</span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Taxi
              </span>
              <span className="text-white/20 text-xs">•</span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-sky-400">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                Services
              </span>
              <span className="text-white/20 text-xs">•</span>
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Quick Mart
              </span>
            </div>

            {/* Progress Bar with Enter CTA */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex-1 sm:w-48 h-1.5 bg-white/15 rounded-full overflow-hidden backdrop-blur-md">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#FF5722] via-[#F59E0B] via-[#0284C7] to-[#10B981]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
              >
                Enter Super App
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
