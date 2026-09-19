import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, Clock, Activity, UtensilsCrossed, ShoppingBag, Wrench, Car, Sparkles, CheckCircle2 } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const videoTabs = [
  {
    id: 0,
    icon: UtensilsCrossed,
    label: 'Food Delivery',
    tag: 'Hot & Fresh',
    description: 'Real-time kitchen preparation tracking and heat-insulated courier delivery.',
    color: '#FF5722',
    timePercent: 0,
  },
  {
    id: 1,
    icon: ShoppingBag,
    label: 'Quick Commerce',
    tag: '10-Min Grocery',
    description: 'Instant micro-fulfillment dark store picking and sub-10-minute doorstep drop-off.',
    color: '#10B981',
    timePercent: 0.25,
  },
  {
    id: 2,
    icon: Wrench,
    label: 'Service Provider',
    tag: 'Certified Experts',
    description: '100% background-verified AC, electrical, plumbing & salon specialists.',
    color: '#0284C7',
    timePercent: 0.50,
  },
  {
    id: 3,
    icon: Car,
    label: 'Taxi & Mobility',
    tag: 'Safe Cabs',
    description: 'Instant city ride matching, zero surge guarantee, and 24/7 live SOS desk.',
    color: '#F59E0B',
    timePercent: 0.75,
  }
]

export default function VideoSection() {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const headerRef = useRef(null)
  const panelsRef = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [activeTab, setActiveTab] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef(null)

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime
      setCurrentTime(cur)
      if (duration > 0) {
        const ratio = cur / duration
        if (ratio < 0.25) setActiveTab(0)
        else if (ratio < 0.5) setActiveTab(1)
        else if (ratio < 0.75) setActiveTab(2)
        else setActiveTab(3)
      }
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleTabClick = (tabIdx) => {
    setActiveTab(tabIdx)
    if (videoRef.current && duration > 0) {
      const targetTime = videoTabs[tabIdx].timePercent * duration
      videoRef.current.currentTime = targetTime
      if (!isPlaying) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
      }
    }
  }

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    if (!videoRef.current) return
    const nextMuted = !isMuted
    videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const toggleFullscreen = (e) => {
    e.stopPropagation()
    if (!videoRef.current) return
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen()
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current)
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 2500)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true }
      })
      gsap.from(panelsRef.current?.children, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: { trigger: panelsRef.current, start: 'top 80%', once: true }
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  const currentTab = videoTabs[activeTab] || videoTabs[0]

  return (
    <section
      id="video-tour"
      ref={containerRef}
      className="relative py-24 bg-slate-950 overflow-hidden text-slate-100"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
    >
      {/* Background ambient lighting */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-all duration-700"
        style={{ background: currentTab.color }}
      />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[#00838F] blur-[150px] opacity-15 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-emerald-400 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Experience</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            See Appzeto in Action.{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(90deg, #FF5722, #F59E0B, #0284C7, #10B981)' }}
            >
              Pure Cinematic Precision.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Click across our four super-app modules to preview how seamless life becomes with Appzeto.
          </p>
        </div>

        {/* Master Video Layout */}
        <div ref={panelsRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          {/* Left Panel: 4 Feature Tabs */}
          <div className="lg:col-span-4 space-y-3 order-2 lg:order-1 text-left">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1">
              Select Feature Showcase
            </h3>

            <div className="space-y-3">
              {videoTabs.map((tab) => {
                const TabIcon = tab.icon
                const isSelected = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full p-4 rounded-2xl border transition-all text-left flex items-start gap-3.5 cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-slate-900 border-slate-700 shadow-xl'
                        : 'bg-slate-900/40 hover:bg-slate-900/80 border-slate-800/60'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                      style={{ background: tab.color }}
                    >
                      <TabIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white">{tab.label}</p>
                        <span
                          className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md"
                          style={{ background: `${tab.color}20`, color: tab.color }}
                        >
                          {tab.tag}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {tab.description}
                      </p>
                    </div>

                    {/* Active progress indicator line */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-1"
                        style={{ background: tab.color }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Panel: High-End Cinema Player */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <div
              className="p-[2px] rounded-[30px] transition-all duration-700 shadow-2xl"
              style={{
                background: `linear-gradient(135deg, ${currentTab.color}80, transparent 40%, #00838F80)`
              }}
            >
              <div
                className="relative aspect-video w-full rounded-[28px] overflow-hidden bg-slate-950 shadow-2xl group"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => isPlaying && setShowControls(false)}
              >
                {/* Video Tag */}
                <video
                  ref={videoRef}
                  src="/splash-video.mp4"
                  preload="metadata"
                  loop
                  muted={isMuted}
                  playsInline
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  className="w-full h-full object-cover select-none cursor-pointer"
                  onClick={togglePlay}
                />

                {/* Top Status Bar */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-bold text-slate-200">
                    <Activity className="w-3.5 h-3.5 animate-pulse" style={{ color: currentTab.color }} />
                    <span>Appzeto Live Demo</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-semibold text-slate-300">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                  </div>
                </div>

                {/* Central Play/Pause Watermark */}
                <AnimatePresence>
                  {(!isPlaying || showControls) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                    >
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 pointer-events-auto cursor-pointer"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? (
                          <Pause className="w-7 h-7 fill-white" />
                        ) : (
                          <Play className="w-7 h-7 fill-white translate-x-0.5" />
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom Control Bar */}
                <AnimatePresence>
                  {showControls && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent z-30 flex items-center justify-between gap-4"
                    >
                      {/* Scrub Bar */}
                      <div className="flex-1 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={togglePlay}
                          className="text-white hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                        </button>
                        <div
                          className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const clickPos = (e.clientX - rect.left) / rect.width
                            if (videoRef.current && duration > 0) {
                              videoRef.current.currentTime = clickPos * duration
                            }
                          }}
                        >
                          <div
                            className="h-full bg-gradient-to-r from-[#FF5722] via-[#0284C7] to-[#10B981]"
                            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Right Control Buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="text-white hover:text-emerald-400 transition-colors p-1 cursor-pointer"
                          aria-label="Toggle Sound"
                        >
                          {isMuted ? <VolumeX className="w-5 h-5 text-amber-400" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <button
                          type="button"
                          onClick={toggleFullscreen}
                          className="text-white hover:text-emerald-400 transition-colors p-1 cursor-pointer"
                          aria-label="Fullscreen"
                        >
                          <Maximize className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
