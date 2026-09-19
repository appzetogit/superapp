import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Store, ShoppingBag, Wrench, ArrowRight, CheckCircle2, Zap, Sparkles } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const partnerPrograms = [
  {
    type: 'driver',
    icon: Car,
    title: 'Drive & Earn with Appzeto',
    subtitle: 'Cab Captains, Auto & Bike Taxi Partners',
    description: 'Join thousands of driver captains earning on their own schedule. Enjoy industry-low commission rates, live route optimization, and instant daily bank settlements.',
    benefits: [
      'Daily instant wallet cash withdrawals',
      'Flexible work hours — choose your own shifts',
      'Comprehensive in-app SOS & passenger verification',
      'Bonus incentives for peak hours & weekly targets'
    ],
    ctaText: 'Register as Driver Captain',
    ctaHref: '/taxi/signup',
    color: '#F59E0B',
    gradient: 'from-[#F59E0B] to-[#EAB308]',
  },
  {
    type: 'restaurant',
    icon: Store,
    title: 'Grow Your Restaurant Business',
    subtitle: 'Dine-In, Takeaway & Cloud Kitchens',
    description: 'Connect your kitchen with hungry food lovers across the city. Leverage our thermal delivery fleet, powerful analytics dashboard, and targeted local marketing campaigns.',
    benefits: [
      'Access to thousands of active daily diners',
      'Advanced kitchen order dispatch management system',
      'Customizable promotional deals & festival campaigns',
      'Dedicated partner relationship manager'
    ],
    ctaText: 'Onboard Your Restaurant',
    ctaHref: '/partner',
    color: '#FF5722',
    gradient: 'from-[#FF5722] to-[#FF8A00]',
  },
  {
    type: 'merchant',
    icon: ShoppingBag,
    title: 'Join the 10-Min Quick Mart Network',
    subtitle: 'Grocers, Supermarkets & Pharmacies',
    description: 'Transform your retail store into a hyper-efficient 10-minute fulfillment hub. Tap into our instant dispatch couriers to multiply your daily order volume.',
    benefits: [
      'Real-time automated inventory sync & barcoding',
      'Instant order delivery to nearby 3-5 km radiuses',
      'Automated digital invoicing & GST reporting',
      'Zero upfront technology setup expenditure'
    ],
    ctaText: 'Register Retail Store',
    ctaHref: '/partner',
    color: '#10B981',
    gradient: 'from-[#10B981] to-[#059669]',
  },
  {
    type: 'service',
    icon: Wrench,
    title: 'Partner as Certified Service Pro',
    subtitle: 'Electricians, Plumbers, AC Techs & Beauticians',
    description: 'Are you a licensed or skilled professional? Get guaranteed steady customer bookings directly on your smartphone without spending a rupee on lead generation.',
    benefits: [
      'Guaranteed high-paying customer bookings',
      'Free technician toolkit insurance & safety gear',
      'Weekly automated direct bank deposits',
      'Professional upskilling & certification programs'
    ],
    ctaText: 'Join as Certified Pro',
    ctaHref: '/partner',
    color: '#0284C7',
    gradient: 'from-[#0284C7] to-[#00A3FF]',
  }
]

export default function Partners() {
  const [activeTab, setActiveTab] = useState('driver')
  const sectionRef = useRef(null)
  const headerRef = useRef(null)
  const cardRef = useRef(null)

  const activePartner = partnerPrograms.find((p) => p.type === activeTab) || partnerPrograms[0]
  const IconComponent = activePartner.icon

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current?.children, {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true }
      })
      gsap.from(cardRef.current, {
        y: 40,
        opacity: 0,
        scale: 0.98,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 80%', once: true }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="partners"
      ref={sectionRef}
      className="py-24 relative overflow-hidden bg-slate-950 text-white"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/15 text-emerald-400 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Appzeto Ecosystem Partner Network</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Grow Your Income With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#F59E0B] via-[#0284C7] to-[#10B981]">
              Appzeto.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
            Whether you drive, cook, sell groceries, or fix homes — our unified platform is built to maximize your profits and simplify your work.
          </p>
        </div>

        {/* 4 Partner Category Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10 max-w-4xl mx-auto">
          {partnerPrograms.map((p) => {
            const PIcon = p.icon
            const isSelected = activeTab === p.type
            return (
              <button
                key={p.type}
                type="button"
                onClick={() => setActiveTab(p.type)}
                className={`flex items-center gap-2.5 px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white text-slate-950 shadow-xl scale-105'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white"
                  style={{ background: p.color }}
                >
                  <PIcon className="w-3.5 h-3.5" />
                </div>
                <span>{p.title.split(' ')[0]} {p.title.split(' ')[1] || ''}</span>
              </button>
            )
          })}
        </div>

        {/* Dynamic Partner Showcase Card */}
        <div
          ref={cardRef}
          className="rounded-[32px] overflow-hidden bg-slate-900 border border-slate-800 p-8 sm:p-12 max-w-5xl mx-auto text-left relative"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ background: activePartner.color }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{activePartner.title}</h3>
                  <p className="text-xs font-semibold" style={{ color: activePartner.color }}>
                    {activePartner.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activePartner.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {activePartner.benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: activePartner.color }}
                    />
                    <span className="text-xs font-semibold text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <a
                  href={activePartner.ctaHref}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl hover:brightness-110 active:scale-98 transition-all cursor-pointer"
                  style={{ background: activePartner.color }}
                >
                  <span>{activePartner.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Interactive Highlights */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Partner Perks</span>
                  <span className="text-xs font-bold text-emerald-400">Fast 24-Hr Approval</span>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                    <p className="text-xs font-bold text-white">Zero Setup Fee</p>
                    <p className="text-[11px] text-slate-400">Register completely free with zero hidden onboarding costs.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                    <p className="text-xs font-bold text-white">Direct Bank Settlements</p>
                    <p className="text-[11px] text-slate-400">Automated UPI and NEFT transfers straight to your bank account.</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                    <p className="text-xs font-bold text-white">24/7 Dedicated Partner Hotline</p>
                    <p className="text-[11px] text-slate-400">Priority helpline whenever you encounter any order or transit query.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
