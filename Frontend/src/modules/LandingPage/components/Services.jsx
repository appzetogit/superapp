import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Car, Utensils, ShoppingBag, Wrench, Package, Plane, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { APPZETO_THEME } from '../constants/theme'

gsap.registerPlugin(ScrollTrigger)

const superServices = [
  {
    id: 'food',
    icon: Utensils,
    title: 'Food Delivery',
    tagline: 'Hot & Fresh Gourmet Dining',
    description: 'Explore 2,500+ curated restaurants, cloud kitchens, and street food heroes with temperature-controlled thermal delivery.',
    accent: '#FF5722',
    gradient: 'from-[#FF5722] to-[#FF8A00]',
    badge: 'Trending Dishes',
    highlights: ['Live kitchen tracker', 'Zero contact drop-off', 'Insulated thermal bags'],
    link: '/food/user'
  },
  {
    id: 'quick',
    icon: ShoppingBag,
    title: 'Quick Commerce',
    tagline: '10-Minute Grocery & Essentials',
    description: 'Farm-fresh fruits, dairy, eggs, snacks, cold drinks, and emergency medicines delivered from micro-dark stores in under 10 minutes.',
    accent: '#10B981',
    gradient: 'from-[#10B981] to-[#059669]',
    badge: '⚡ 10-Min ETA',
    highlights: ['Micro-warehouse dispatch', '100% in-stock guarantee', 'Cold chain storage'],
    link: '/food/user'
  },
  {
    id: 'services',
    icon: Wrench,
    title: 'Service Provider',
    tagline: 'Verified Home & Personal Pros',
    description: 'Book licensed electricians, master plumbers, AC cleaning experts, deep home cleaners, and salon specialists at upfront fixed pricing.',
    accent: '#0284C7',
    gradient: 'from-[#0284C7] to-[#00A3FF]',
    badge: '100% Background Checked',
    highlights: ['Fixed upfront pricing', '30-day rework warranty', 'Certified technicians'],
    link: '#services'
  },
  {
    id: 'taxi',
    icon: Car,
    title: 'Taxi & Mobility',
    tagline: 'Safe, Fast & Transparent Rides',
    description: 'From nimble bike taxis and auto rickshaws to premium comfort sedans and spacious SUVs. Zero surge pricing and live SOS protection.',
    accent: '#F59E0B',
    gradient: 'from-[#F59E0B] to-[#EAB308]',
    badge: 'Zero Surge Fares',
    highlights: ['45-sec driver match', '24/7 Live SOS desk', 'Transparent tariffs'],
    link: '/taxi/user'
  },
  {
    id: 'courier',
    icon: Package,
    title: 'Courier & Parcels',
    tagline: 'Instant Intra-City Express Delivery',
    description: 'Send urgent business contracts, forgotten keys, birthday gifts, or packages safely across town with real-time OTP confirmation.',
    accent: '#EC4899',
    gradient: 'from-[#EC4899] to-[#D946EF]',
    badge: 'Live OTP Handover',
    highlights: ['Secure lock code OTP', 'Real-time GPS trail', 'Door-to-door pickup'],
    link: '/taxi/user'
  },
  {
    id: 'airport',
    icon: Plane,
    title: 'Airport & Outstation',
    tagline: 'Scheduled Luxury Chauffeurs',
    description: 'Pre-schedule comfortable airport transfers with flight tracking and dedicated luggage assistance, or book intercity outstation cabs.',
    accent: '#6366F1',
    gradient: 'from-[#6366F1] to-[#4F46E5]',
    badge: 'Flight Monitored',
    highlights: ['Guaranteed on-time pickup', 'Luggage space assurance', 'Fixed flat airport rates'],
    link: '/taxi/user'
  }
]

function ServiceCard({ service }) {
  const navigate = useNavigate()
  const cardRef = useRef(null)
  const glowRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const Icon = service.icon

  useEffect(() => {
    const card = cardRef.current
    const glow = glowRef.current
    if (!card) return

    const onMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const dx = (x - rect.width / 2) / rect.width
      const dy = (y - rect.height / 2) / rect.height
      gsap.to(card, {
        rotateX: -dy * 7,
        rotateY: dx * 7,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000
      })
      if (glow) {
        gsap.to(glow, { x: x - rect.width / 2, y: y - rect.height / 2, opacity: 1, duration: 0.25 })
      }
    }

    const onLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, duration: 0.5, ease: 'power2.out' })
      if (glow) gsap.to(glow, { opacity: 0, duration: 0.25 })
      setIsHovered(false)
    }

    const onEnter = () => {
      gsap.to(card, { scale: 1.02, duration: 0.25 })
      setIsHovered(true)
    }

    card.addEventListener('mousemove', onMove)
    card.addEventListener('mouseleave', onLeave)
    card.addEventListener('mouseenter', onEnter)

    return () => {
      card.removeEventListener('mousemove', onMove)
      card.removeEventListener('mouseleave', onLeave)
      card.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  const handleClick = () => {
    if (service.link.startsWith('/')) {
      navigate(service.link)
    } else {
      const el = document.querySelector(service.link)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className="group relative rounded-[28px] border overflow-hidden cursor-pointer will-change-transform bg-white flex flex-col justify-between p-7 sm:p-8 transition-all duration-300 select-none shadow-sm hover:shadow-2xl"
      style={{
        borderColor: isHovered ? `${service.accent}60` : 'rgba(226, 232, 240, 0.9)',
        boxShadow: isHovered ? `0 20px 40px ${service.accent}18` : '0 4px 20px rgba(0,0,0,0.03)',
        transformStyle: 'preserve-3d'
      }}
    >
      {/* Dynamic Cursor Glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute w-64 h-64 rounded-full blur-[70px] opacity-0 transition-opacity"
        style={{ background: `${service.accent}20`, top: '50%', left: '50%' }}
      />

      <div className="space-y-5 text-left relative z-10">
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div
            className="w-13 h-13 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110"
            style={{ background: service.accent }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <span
            className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full text-white"
            style={{ background: service.accent }}
          >
            {service.badge}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-black text-slate-900 group-hover:text-[#00838F] transition-colors">
            {service.title}
          </h3>
          <p className="text-xs font-bold text-slate-500 mt-0.5" style={{ color: service.accent }}>
            {service.tagline}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mt-2.5">
            {service.description}
          </p>
        </div>

        {/* Feature bullets */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          {service.highlights.map((h, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: service.accent }} />
              <span className="text-xs font-semibold text-slate-700">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA Bar */}
      <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between relative z-10">
        <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 flex items-center gap-1">
          Open Service
        </span>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md transition-transform group-hover:translate-x-1"
          style={{ background: service.accent }}
        >
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  const containerRef = useRef(null)
  const headerRef = useRef(null)

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
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="services"
      ref={containerRef}
      className="py-24 bg-white border-t border-slate-100 relative overflow-hidden"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00838F]/10 border border-[#00838F]/20 text-[#00838F] text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comprehensive Suite</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Every Essential Need,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00838F] via-[#0284C7] to-[#10B981]">
              In A Single Tap.
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Engineered with deep technology and human-centric design. Experience seamless booking, transparent pricing, and instant dispatch.
          </p>
        </div>

        {/* 6-Card Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {superServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}
