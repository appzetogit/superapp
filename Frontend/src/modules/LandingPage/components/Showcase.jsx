import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Smartphone, Wallet, ShieldCheck, Zap, Bell, CheckCircle2, Star, Sparkles, UtensilsCrossed, ShoppingBag, Wrench, Car } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const superFeatures = [
  {
    icon: Wallet,
    title: 'One Unified Wallet',
    description: 'Use a single Appzeto Wallet balance across food delivery, 10-min groceries, home services, and cab rides with instant cashback.',
    color: '#10B981'
  },
  {
    icon: Bell,
    title: 'Simultaneous Multi-Order Tracking',
    description: 'Track your dinner delivery while booking a ride home and scheduling an AC technician for tomorrow — all on one screen.',
    color: '#0284C7'
  },
  {
    icon: ShieldCheck,
    title: 'Bank-Grade Security & Safety Desk',
    description: '256-bit encrypted transactions, strict driver background checks, verified technician IDs, and 24/7 dedicated SOS assistance.',
    color: '#FF5722'
  },
  {
    icon: Zap,
    title: 'Sub-Second Smart Dispatch',
    description: 'Our proprietary hyper-local AI engine calculates the optimal route, driver, kitchen, and dark-store picker within 600 milliseconds.',
    color: '#F59E0B'
  }
]

export default function Showcase() {
  const sectionRef = useRef(null)
  const leftRef = useRef(null)
  const phoneRef = useRef(null)
  const [activeScreen, setActiveScreen] = useState('home')

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current?.children, {
        x: -40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: leftRef.current, start: 'top 80%', once: true }
      })
      gsap.from(phoneRef.current, {
        x: 40,
        opacity: 0,
        scale: 0.95,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: { trigger: phoneRef.current, start: 'top 82%', once: true }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 overflow-hidden relative border-t border-slate-800 bg-[#060B0A] text-white"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#00838F]/10 blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-[#FF5722]/10 blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Prop */}
          <div ref={leftRef} className="lg:col-span-7 space-y-8 text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Architecture</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Designed as a True{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00838F] via-[#0284C7] via-[#FF5722] to-[#10B981]">
                  Million-Dollar
                </span>{' '}
                Platform.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl">
                Forget cluttering your phone with dozens of single-purpose apps. Appzeto merges food delivery, 10-minute grocery commerce, on-demand home service technicians, and mobility into one lightweight, ultra-responsive ecosystem.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {superFeatures.map((feat, idx) => {
                const Icon = feat.icon
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all hover:bg-slate-900 group text-left"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform"
                      style={{ background: feat.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{feat.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Premium Interactive Smartphone Mockup */}
          <div ref={phoneRef} className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[340px] rounded-[48px] bg-slate-950 p-4 border-[6px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,131,143,0.3)]">
              {/* Dynamic Island Notch */}
              <div className="w-28 h-5 bg-slate-900 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-800 mr-2" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* In-Phone Screen */}
              <div className="rounded-[36px] bg-slate-900 p-4 space-y-4 text-left border border-slate-800/60 overflow-hidden">
                {/* Phone Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Current Location</p>
                    <p className="text-xs font-bold text-white flex items-center gap-1">
                      Siliguri Central 📍
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                    👤
                  </div>
                </div>

                {/* 4 Super App Mini Icons Row */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-orange-500/15 border border-orange-500/30">
                    <UtensilsCrossed className="w-5 h-5 text-[#FF5722] mx-auto mb-1" />
                    <p className="text-[9px] font-bold text-orange-400">Food</p>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                    <ShoppingBag className="w-5 h-5 text-[#10B981] mx-auto mb-1" />
                    <p className="text-[9px] font-bold text-emerald-400">Quick</p>
                  </div>
                  <div className="p-2 rounded-xl bg-sky-500/15 border border-sky-500/30">
                    <Wrench className="w-5 h-5 text-[#0284C7] mx-auto mb-1" />
                    <p className="text-[9px] font-bold text-sky-400">Services</p>
                  </div>
                  <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30">
                    <Car className="w-5 h-5 text-[#F59E0B] mx-auto mb-1" />
                    <p className="text-[9px] font-bold text-amber-400">Cabs</p>
                  </div>
                </div>

                {/* Live Activity Widget in Phone */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-950/80 to-slate-900 border border-teal-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-teal-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-ping" />
                      Active Super-Order
                    </span>
                    <span className="text-slate-400">ETA 7 mins</span>
                  </div>
                  <p className="text-xs font-bold text-white">
                    Quick Mart Groceries on the way 🛵
                  </p>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 w-3/4 animate-pulse" />
                  </div>
                </div>

                {/* Second Activity Widget */}
                <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-amber-400">Scheduled Ride</span>
                    <span className="text-slate-400">Today 5:30 PM</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-300">
                    Airport Express Sedan Confirmed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
