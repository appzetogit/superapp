import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, ArrowRight, UtensilsCrossed, Car, Wrench, ShoppingBag, Star, ShieldCheck, Zap, Clock, Play, Sparkles, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { APPZETO_THEME } from '../constants/theme'

const ThreeBackground = lazy(() => import('./ThreeBackground'))

const heroPillars = [
  {
    id: 'food',
    name: 'Food Delivery',
    tag: 'Hot & Fresh',
    accentColor: '#FF5722',
    bgLight: 'from-orange-500/10 via-amber-500/5 to-transparent',
    icon: UtensilsCrossed,
    headline: 'Craving Something Delicious?',
    subline: 'Order chef-crafted specialties from 2,500+ top restaurants with live kitchen tracking and thermal bag delivery.',
    ctaText: 'Order Food Now',
    route: '/food/user',
    sampleItems: ['Gourmet Biryani', 'Woodfired Pizza', 'Sushi Platters', 'Healthy Bowls'],
    liveCard: {
      title: 'Mario’s Trattoria',
      status: 'Out for delivery • 14 mins',
      item: 'Truffle Mushroom Pizza + Tiramisu',
      avatar: '🍕',
      badge: 'Thermal Protected'
    }
  },
  {
    id: 'quick',
    name: 'Quick Commerce',
    tag: '10-Min Grocery',
    accentColor: '#10B981',
    bgLight: 'from-emerald-500/10 via-teal-500/5 to-transparent',
    icon: ShoppingBag,
    headline: 'Grocery Shopping in 10 Minutes flat.',
    subline: 'Farm-fresh veggies, dairy, pantry staples, snacks and chilled beverages dispatched instantly from local micro-fulfillment dark stores.',
    ctaText: 'Shop Instant Groceries',
    route: '/food/user',
    sampleItems: ['Organic Milk', 'Fresh Avocados', 'Cold Pressed Juices', 'Daily Bread'],
    liveCard: {
      title: 'Appzeto Quick Mart #12',
      status: 'Bagged & Dispatched • 8 mins',
      item: 'Amul Butter, Farm Eggs & Fresh Berries',
      avatar: '⚡',
      badge: '10-Min Guarantee'
    }
  },
  {
    id: 'services',
    name: 'Service Provider',
    tag: 'Certified Experts',
    accentColor: '#0284C7',
    bgLight: 'from-sky-500/10 via-cyan-500/5 to-transparent',
    icon: Wrench,
    headline: 'Trusted Home & Personal Services.',
    subline: 'Book verified electricians, plumbers, AC technicians, home cleaners, and salon professionals with upfront fixed pricing and insurance protection.',
    ctaText: 'Book a Pro Expert',
    route: '#services',
    sampleItems: ['AC Deep Service', 'Plumbing Doctor', 'Salon at Home', 'Appliance Repair'],
    liveCard: {
      title: 'Verified AC Master Rajesh',
      status: 'Confirmed for 2:30 PM Today',
      item: 'Dual Split AC Chemical Master Clean',
      avatar: '🔧',
      badge: '100% Background Checked'
    }
  },
  {
    id: 'taxi',
    name: 'Taxi & Mobility',
    tag: 'Safe Cabs & Rides',
    accentColor: '#F59E0B',
    bgLight: 'from-amber-500/10 via-yellow-500/5 to-transparent',
    icon: Car,
    headline: 'Your Reliable Ride, Anytime, Anywhere.',
    subline: 'Instant city cabs, auto-rickshaws, bike taxis, airport transfers, and outstation trips with vetted professional captains and live SOS tracking.',
    ctaText: 'Book a Ride Instantly',
    route: '/taxi/user',
    sampleItems: ['Bike Taxi (Fast)', 'Auto Rickshaw', 'Comfort Sedan', 'Prime SUV'],
    liveCard: {
      title: 'Captain Vikram (Sedan)',
      status: 'Arriving in 3 mins • 4.96 ★',
      item: 'Live GPS Route • SOS Enabled',
      avatar: '🚕',
      badge: 'Zero Surge'
    }
  }
]

export default function Hero({ settings, onPlaySplash }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [isDesktop, setIsDesktop] = useState(false)

  const currentPillar = heroPillars[activeTab]

  const searchPlaceholders = [
    'Search butter chicken, biryani, burgers...',
    'Search 10-min groceries, milk, eggs & snacks...',
    'Book AC repair, electrician, or home cleaner...',
    'Book instant cab to Airport or city center...'
  ]

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Cycle search placeholder dynamically
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length)
    }, 3200)
    return () => clearInterval(timer)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (activeTab === 0 || activeTab === 1) {
      navigate('/food/user')
    } else if (activeTab === 3) {
      navigate('/taxi/user')
    } else {
      const el = document.querySelector('#services')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCtaClick = (pillar) => {
    if (pillar.route.startsWith('/')) {
      navigate(pillar.route)
    } else {
      const el = document.querySelector(pillar.route)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-white select-none"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
    >
      {/* 3D Canvas Background for Desktop */}
      {isDesktop && (
        <Suspense fallback={null}>
          <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
            <ThreeBackground />
          </div>
        </Suspense>
      )}

      {/* Dynamic Ambient Glow matching active pillar */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 transition-opacity duration-700">
        <motion.div
          key={currentPillar.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.12, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute -top-[15%] left-[20%] w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: currentPillar.accentColor }}
        />
        <div className="absolute top-[35%] -right-[5%] w-[450px] h-[450px] rounded-full bg-[#00838F] opacity-5 blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Top Tagline Pill */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 border border-slate-200/80 shadow-sm mb-4"
          >
            <Sparkles className="w-4 h-4 text-[#00838F] animate-spin" style={{ animationDuration: '8s' }} />
            <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
              One App • Multiple Services • Endless Convenience
            </span>
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="hidden sm:inline-block text-[11px] font-semibold text-emerald-600">Appzeto v2.0</span>
          </motion.div>

          {/* Main Hero Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] mb-4"
          >
            The Ultimate{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00838F] via-[#0284C7] via-[#FF5722] to-[#10B981]">
              Super-App
            </span>
            <br />
            For Everyday Life.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-xl text-slate-600 max-w-2xl leading-relaxed font-medium"
          >
            Whether you want gourmet meals delivered, groceries in 10 minutes, a certified home repair expert, or a reliable cab across town — Appzeto handles it all.
          </motion.p>
        </div>

        {/* 4-Pillar Interactive Selector Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto mb-8"
        >
          {heroPillars.map((pillar, idx) => {
            const Icon = pillar.icon
            const isActive = activeTab === idx
            return (
              <button
                key={pillar.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`group relative flex items-center gap-2.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xl border-2 scale-105'
                    : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-600 border border-transparent'
                }`}
                style={{
                  borderColor: isActive ? pillar.accentColor : 'transparent',
                  boxShadow: isActive ? `0 12px 30px ${pillar.accentColor}25` : undefined
                }}
              >
                <div
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shadow-sm"
                  style={{ background: pillar.accentColor }}
                >
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </div>
                <div className="text-left">
                  <p className="leading-tight">{pillar.name}</p>
                  <p className="text-[10px] font-semibold opacity-70 hidden sm:block" style={{ color: isActive ? pillar.accentColor : undefined }}>
                    {pillar.tag}
                  </p>
                </div>
              </button>
            )
          })}
        </motion.div>

        {/* Dynamic Pillar Preview Showcase + Omni-Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
            {/* Subtle top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-500"
              style={{ background: currentPillar.accentColor }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left Column: Dynamic Headline, Description & Direct CTA */}
              <div className="lg:col-span-7 space-y-4 text-left">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-lg text-[11px] font-black uppercase tracking-wider text-white"
                    style={{ background: currentPillar.accentColor }}
                  >
                    {currentPillar.name}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Instant Response
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPillar.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                      {currentPillar.headline}
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {currentPillar.subline}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Omni Search Bar */}
                <form onSubmit={handleSearchSubmit} className="pt-2">
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={searchPlaceholders[placeholderIndex]}
                      className="w-full pl-11 pr-32 py-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm font-medium text-slate-800 placeholder-slate-400 border border-slate-200 focus:border-[#00838F] focus:outline-none focus:ring-4 focus:ring-teal-500/10 transition-all shadow-inner"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 px-4 py-2 rounded-xl text-white font-bold text-xs shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                      style={{ background: currentPillar.accentColor }}
                    >
                      Explore
                    </button>
                  </div>
                </form>

                {/* Popular Tags */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Trending:</span>
                  {currentPillar.sampleItems.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleCtaClick(currentPillar)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Live Simulated Order Card + Action Hub */}
              <div className="lg:col-span-5 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPillar.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="p-5 rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white shadow-lg space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Simulation</span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        {currentPillar.liveCard.badge}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 text-left">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-2xl shrink-0">
                        {currentPillar.liveCard.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {currentPillar.liveCard.title}
                        </h4>
                        <p className="text-xs font-semibold" style={{ color: currentPillar.accentColor }}>
                          {currentPillar.liveCard.status}
                        </p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {currentPillar.liveCard.item}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCtaClick(currentPillar)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white font-bold text-xs sm:text-sm shadow-lg transition-all hover:brightness-110 active:scale-98 cursor-pointer"
                      style={{
                        background: currentPillar.accentColor,
                        boxShadow: `0 8px 20px ${currentPillar.accentColor}35`
                      }}
                    >
                      <span>{currentPillar.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                </AnimatePresence>

                {/* App Download Stores Strip */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <a
                    href="https://play.google.com/store/apps/details?id=com.k9bharat.user"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-105 transition-transform"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Google Play"
                      className="h-9 w-auto"
                    />
                  </a>
                  <a
                    href="https://www.apple.com/app-store/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:scale-105 transition-transform"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="App Store"
                      className="h-9 w-auto"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 Pillars Stat Band */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
            <p className="text-2xl font-black text-[#FF5722]">2,500+</p>
            <p className="text-xs font-semibold text-slate-500">Partner Restaurants</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
            <p className="text-2xl font-black text-[#10B981]">&lt; 10 Mins</p>
            <p className="text-xs font-semibold text-slate-500">Avg. Quick Delivery</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
            <p className="text-2xl font-black text-[#0284C7]">1,200+</p>
            <p className="text-xs font-semibold text-slate-500">Certified Technicians</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm text-center">
            <p className="text-2xl font-black text-[#F59E0B]">45 Secs</p>
            <p className="text-xs font-semibold text-slate-500">Cab Match Time</p>
          </div>
        </div>
      </div>
    </section>
  )
}
