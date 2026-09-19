import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShieldCheck, Clock, Users, TrendingUp, Sparkles, CheckCircle2, Zap, Award } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const valueProps = [
  {
    title: 'Strict Verification & Safety First',
    description: 'Every captain and service technician undergoes comprehensive background checks, license validation, and safety onboarding.',
    tagColor: '#00838F',
    icon: ShieldCheck,
    stat: '100% Verified'
  },
  {
    title: 'Lightning Hyperlocal Speed',
    description: '10-minute micro-dark store grocery dispatch and sub-45-second driver allocation across every major city district.',
    tagColor: '#10B981',
    icon: Zap,
    stat: '< 10 Mins'
  },
  {
    title: 'Fair Tariffs & Zero Surge Policy',
    description: 'Transparent base pricing across rides, fixed rate cards for home repairs, and honest restaurant menu prices.',
    tagColor: '#F59E0B',
    icon: Award,
    stat: 'Zero Surcharge'
  },
  {
    title: '24/7 Live Concierge & Instant Resolution',
    description: 'Connect with a human customer support specialist in under 2 minutes for immediate order, delivery, or ride assistance.',
    tagColor: '#FF5722',
    icon: Clock,
    stat: '24/7 Live Desk'
  }
]

export default function WhyUs() {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current?.children, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%', once: true }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="why-us"
      ref={sectionRef}
      className="py-24 overflow-hidden relative border-t border-slate-200/80 bg-slate-50"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div ref={headingRef} className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00838F]/10 border border-[#00838F]/20 text-[#00838F] text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Appzeto Standard</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Engineered for Trust, Built for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#0284C7] to-[#10B981]">
              Everyday Life.
            </span>
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base max-w-xl mx-auto font-medium">
            Over 500,000 customers rely on Appzeto every day for dependable rides, hot meals, emergency groceries, and certified home services.
          </p>
        </div>

        {/* 4 Value Proposition Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, idx) => {
            const Icon = prop.icon
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between text-left group"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-5 shadow-md group-hover:scale-110 transition-transform"
                    style={{ background: prop.tagColor }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                    style={{ background: `${prop.tagColor}15`, color: prop.tagColor }}
                  >
                    {prop.stat}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-2 mb-2 leading-snug">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prop.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
