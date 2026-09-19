import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { UtensilsCrossed, Car, Wrench, ShoppingBag, ArrowRight, CheckCircle2, Zap, Clock, Star, ShieldCheck, Sparkles, Navigation, Award, DollarSign } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ecosystemPillars = [
  {
    id: 'food',
    name: 'Food Delivery',
    tagline: 'Hot & Fresh Dining Delivered Fast',
    description: 'Craving your favorite comfort meals or seeking fine dining? Connect with over 2,500+ top restaurants, cloud kitchens, and artisan bakeries with live order tracking and insulated delivery carriers.',
    icon: UtensilsCrossed,
    color: '#FF5722',
    accentColor: '#FF7A00',
    gradient: 'from-[#FF5722] to-[#FF8A00]',
    path: '/food/user',
    badge: 'Trending Meals',
    stats: [
      { label: 'Avg Delivery Time', val: '24 mins' },
      { label: 'Restaurant Partners', val: '2,500+' },
      { label: 'Customer Rating', val: '4.8 ★' }
    ],
    features: [
      'Live kitchen preparation and rider GPS tracking',
      'Insulated thermal boxes keeping dishes at optimal 65°C',
      'Contactless doorstep drop-off & real-time delivery pin',
      'Curated collections: Diet Friendly, Biryanis, Pizzas & Desserts'
    ],
    previewMockup: {
      type: 'food',
      headline: 'Mario’s Handcrafted Pizzeria',
      rating: '4.9 (1,840+ reviews)',
      price: '₹349 for two',
      eta: '22 mins',
      tags: ['Italian', 'Wood-Fired', 'Free Delivery'],
      items: [
        { name: 'Truffle & Burrata Margherita', price: '₹420', img: '🍕' },
        { name: 'Smoked Garlic Knots (4 pcs)', price: '₹180', img: '🥖' },
        { name: 'Classic Tiramisu Bowl', price: '₹220', img: '🍰' }
      ]
    }
  },
  {
    id: 'quick',
    name: 'Quick Commerce',
    tagline: '10-Minute Instant Grocery & Essentials',
    description: 'No more waiting days or hours for groceries. Appzeto Quick Mart delivers fresh farm veggies, dairy, pantry staples, snacks, personal care, and medicines right to your door in under 10 minutes.',
    icon: ShoppingBag,
    color: '#10B981',
    accentColor: '#059669',
    gradient: 'from-[#10B981] to-[#059669]',
    path: '/food/user',
    badge: '⚡ 10-Min Delivery',
    stats: [
      { label: 'Average Dispatch', val: '8.4 mins' },
      { label: 'SKUs in Stock', val: '8,000+' },
      { label: 'Freshness Guarantee', val: '100%' }
    ],
    features: [
      'Strategically mapped local dark stores across city sectors',
      'Zero substitute policy: what you see is in stock',
      'Cold-chain storage for dairy, ice creams & frozen essentials',
      'Late-night emergencies: medicines, baby care & midnight snacks'
    ],
    previewMockup: {
      type: 'quick',
      headline: 'Appzeto Dark Store Express #08',
      rating: '4.95 ★ (Hyperlocal)',
      price: 'Free delivery above ₹199',
      eta: '8 mins',
      tags: ['Organic', 'Dairy', 'Produce', 'Flash Dispatch'],
      items: [
        { name: 'Amul Fresh Pasteurised Milk 1L', price: '₹66', img: '🥛' },
        { name: 'Fresh Farm Hass Avocados (2 pcs)', price: '₹140', img: '🥑' },
        { name: 'Dark Roasted Espresso Beans 250g', price: '₹299', img: '☕' }
      ]
    }
  },
  {
    id: 'services',
    name: 'Service Provider',
    tagline: 'Certified Technicians & Home Care Experts',
    description: 'Get verified professionals for air conditioner servicing, electrical fixes, plumbing leaks, home deep cleaning, appliance repair, and salon services at home with fixed upfront pricing.',
    icon: Wrench,
    color: '#0284C7',
    accentColor: '#00A3FF',
    gradient: 'from-[#0284C7] to-[#00A3FF]',
    path: '#services',
    badge: 'Verified Pro',
    stats: [
      { label: 'Certified Pros', val: '1,200+' },
      { label: 'Warranty Period', val: '30 Days' },
      { label: 'Background Checked', val: '100%' }
    ],
    features: [
      'Comprehensive KYC, criminal background checks & skills testing',
      'Transparent upfront standard rate card — no hidden costs',
      '30-day post-service warranty with complete rework guarantee',
      'Direct in-app booking, flexible scheduling & cashless payment'
    ],
    previewMockup: {
      type: 'services',
      headline: 'AC Power Jet Master Clean',
      rating: '4.92 ★ (By Urban Master Techs)',
      price: '₹499 fixed price',
      eta: 'Slot: Today, 2:30 PM',
      tags: ['Chemical Wash', '30-Day Guarantee', '2 Experts'],
      items: [
        { name: 'Split AC Deep Foam Cleaning', price: '₹499', img: '❄️' },
        { name: 'Electrical Safety Inspection & Fix', price: '₹249', img: '⚡' },
        { name: 'Full Bathroom Deep Sanitisation', price: '₹699', img: '✨' }
      ]
    }
  },
  {
    id: 'taxi',
    name: 'Taxi & Mobility',
    tagline: 'Safe, Fast & Transparent Rides',
    description: 'Book bike taxis for zooming through traffic, auto rickshaws for quick commutes, comfort sedans, prime SUVs, or airport transfers with zero surge pricing, verified captains, and SOS emergency buttons.',
    icon: Car,
    color: '#F59E0B',
    accentColor: '#D97706',
    gradient: 'from-[#F59E0B] to-[#EAB308]',
    path: '/taxi/user',
    badge: 'Zero Surge',
    stats: [
      { label: 'Pickup ETA', val: '3 mins' },
      { label: 'Active Drivers', val: '4,500+' },
      { label: 'Safety Rating', val: '4.9 ★' }
    ],
    features: [
      '45-second smart driver assignment algorithm',
      'Live GPS sharing with loved ones & 24/7 SOS safety desk',
      'Transparent distance-based fares with zero hidden surcharges',
      'Multiple fleet choices: Bike, Auto, Sedan, SUV, and Rentals'
    ],
    previewMockup: {
      type: 'taxi',
      headline: 'Choose Your Ride',
      rating: 'Live Radar: 8 Cabs near you',
      price: 'Sedan: ₹180 est.',
      eta: '3 mins away',
      tags: ['AC Comfort', 'Live SOS', 'Cashless/UPI'],
      items: [
        { name: 'Bike Taxi — Beats traffic fast', price: '₹49', img: '🏍️' },
        { name: 'Auto Express — City classic', price: '₹89', img: '🛺' },
        { name: 'Comfort Sedan — Dzire / Etios', price: '₹180', img: '🚗' }
      ]
    }
  }
]

export default function Ecosystem() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('food')
  const sectionRef = useRef(null)
  const cardRef = useRef(null)

  const currentPillar = ecosystemPillars.find((p) => p.id === activeTab) || ecosystemPillars[0]
  const Icon = currentPillar.icon

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 85%', once: true }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const handleLaunch = () => {
    if (currentPillar.path.startsWith('/')) {
      navigate(currentPillar.path)
    } else {
      const el = document.querySelector(currentPillar.path)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="ecosystem"
      ref={sectionRef}
      className="py-24 bg-[#FAFBFC] border-t border-slate-200/80 relative overflow-hidden"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
    >
      {/* Background ambient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-[#00838F] blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-[#10B981] blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00838F]/10 border border-[#00838F]/20 text-[#00838F] text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Unified Super-App Ecosystem</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            One App. Four Super-Powers.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] via-[#F59E0B] via-[#0284C7] to-[#10B981]">
              Zero Friction.
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Switch effortlessly between ordering dining specials, restocking groceries in 10 minutes, booking certified service technicians, or hailing a cab.
          </p>
        </div>

        {/* 4-Pillar Tab Pill Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10">
          {ecosystemPillars.map((pillar) => {
            const PIcon = pillar.icon
            const isSelected = activeTab === pillar.id
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActiveTab(pillar.id)}
                className={`group flex items-center gap-2.5 px-4 sm:px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xl scale-105'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110"
                  style={{ background: pillar.color }}
                >
                  <PIcon className="w-3.5 h-3.5" />
                </div>
                <span>{pillar.name}</span>
                {isSelected && (
                  <span
                    className="w-2 h-2 rounded-full animate-ping"
                    style={{ background: pillar.color }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Master Ecosystem Card Container */}
        <div
          ref={cardRef}
          className="rounded-[32px] overflow-hidden bg-white border border-slate-200/80 shadow-2xl grid grid-cols-1 lg:grid-cols-12 min-h-[580px]"
        >
          {/* Left Panel: Deep Info, Features & Metrics */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between text-left space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ background: currentPillar.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <span
                    className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md text-white"
                    style={{ background: currentPillar.color }}
                  >
                    {currentPillar.badge}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                    {currentPillar.name}
                  </h3>
                </div>
              </div>

              <p className="text-lg font-bold text-slate-800">
                {currentPillar.tagline}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {currentPillar.description}
              </p>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentPillar.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: currentPillar.color }}
                    />
                    <span className="text-xs font-semibold text-slate-700 leading-snug">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Row & Action */}
            <div className="pt-6 border-t border-slate-100 space-y-6">
              <div className="grid grid-cols-3 gap-3">
                {currentPillar.stats.map((s, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <p className="text-lg sm:text-xl font-black" style={{ color: currentPillar.color }}>
                      {s.val}
                    </p>
                    <p className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleLaunch}
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl hover:brightness-110 active:scale-98 transition-all cursor-pointer"
                  style={{
                    background: currentPillar.color,
                    boxShadow: `0 10px 25px ${currentPillar.color}35`
                  }}
                >
                  <span>Launch {currentPillar.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-400 font-medium">
                  Instant Web & Mobile App Experience
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: Interactive Phone/Card Mockup View */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 sm:p-12 text-white flex flex-col justify-center items-center relative overflow-hidden">
            {/* Ambient behind mockup */}
            <div
              className="absolute w-72 h-72 rounded-full blur-[100px] opacity-25 pointer-events-none"
              style={{ background: currentPillar.color }}
            />

            <div className="w-full max-w-sm rounded-3xl bg-slate-900/90 border border-white/10 p-5 shadow-2xl backdrop-blur-2xl relative z-10 space-y-4">
              {/* Mockup Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                    style={{ background: currentPillar.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Appzeto Mobile</p>
                    <p className="text-[10px] text-emerald-400 font-medium">{currentPillar.previewMockup.eta}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-white/10 text-white">
                  Live View
                </span>
              </div>

              {/* Mockup Title Card */}
              <div className="text-left space-y-1">
                <h4 className="text-base font-bold text-white">
                  {currentPillar.previewMockup.headline}
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{currentPillar.previewMockup.rating}</span>
                  <span className="font-semibold text-amber-400">{currentPillar.previewMockup.price}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {currentPillar.previewMockup.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                    {t}
                  </span>
                ))}
              </div>

              {/* Items List */}
              <div className="space-y-2 pt-2">
                {currentPillar.previewMockup.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                  >
                    <div className="flex items-center gap-2.5 text-left">
                      <span className="text-xl">{item.img}</span>
                      <div>
                        <p className="text-xs font-semibold text-white">{item.name}</p>
                        <p className="text-[10px] text-slate-400">Available now</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Bottom Interactive Order Trigger */}
              <button
                type="button"
                onClick={handleLaunch}
                className="w-full py-2.5 rounded-xl text-white font-bold text-xs shadow-lg transition-transform hover:scale-102 active:scale-98 cursor-pointer"
                style={{ background: currentPillar.color }}
              >
                Proceed to {currentPillar.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
