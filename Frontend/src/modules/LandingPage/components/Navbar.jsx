import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Play, MapPin, Sparkles, ChevronDown, UtensilsCrossed, Car, Wrench, ShoppingBag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { APPZETO_THEME } from '../constants/theme'

export default function Navbar({ settings, onPlaySplash }) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 25)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const services = [
    {
      name: 'Food Delivery',
      desc: 'Hot restaurant meals & gourmet dining',
      icon: UtensilsCrossed,
      color: '#FF5722',
      href: '#food',
      link: '/food/user'
    },
    {
      name: 'Quick Commerce',
      desc: '10-minute grocery & essentials',
      icon: ShoppingBag,
      color: '#10B981',
      href: '#quick-commerce',
      badge: '10 MIN'
    },
    {
      name: 'Service Provider',
      desc: 'AC, electrical, plumbing & salon',
      icon: Wrench,
      color: '#0284C7',
      href: '#services'
    },
    {
      name: 'Taxi & Mobility',
      desc: 'Cabs, bike taxis & airport transfers',
      icon: Car,
      color: '#F59E0B',
      href: '#taxi',
      link: '/taxi/user'
    }
  ]

  const navLinks = [
    { name: 'Ecosystem', href: '#ecosystem' },
    { name: 'Why Appzeto', href: '#why-us' },
    { name: 'Video Tour', href: '#video-tour' },
    { name: 'Partner With Us', href: '#partners' },
    { name: 'FAQs', href: '#faq' },
  ]

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault()
    setIsMobileMenuOpen(false)
    setIsServicesDropdownOpen(false)
    const el = document.querySelector(targetId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-[90] transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-2xl shadow-[0_10px_35px_rgba(0,131,143,0.08)] border-b border-teal-900/10 py-2.5'
            : 'bg-transparent py-4'
        }`}
        style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-3 group focus:outline-none">
              <div className="relative">
                <img
                  src="/brand-logo.jpeg"
                  alt="Appzeto Super App"
                  className="h-10 sm:h-12 w-auto object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
            </a>

            {/* Desktop Center Nav */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {/* Interactive Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
                onMouseLeave={() => setIsServicesDropdownOpen(false)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-bold text-slate-800 hover:text-[#00838F] rounded-xl hover:bg-teal-500/10 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00838F]" />
                  <span>4 Super Apps</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180 text-[#00838F]' : 'text-slate-400'}`} />
                </button>

                <AnimatePresence>
                  {isServicesDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 w-80 p-3 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-teal-900/10 grid gap-2 z-50"
                    >
                      {services.map((srv) => {
                        const Icon = srv.icon
                        return (
                          <a
                            key={srv.name}
                            href={srv.href}
                            onClick={(e) => handleSmoothScroll(e, srv.href)}
                            className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group text-left"
                          >
                            <div
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform shadow-md"
                              style={{ background: srv.color }}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-900 group-hover:text-[#00838F] transition-colors">{srv.name}</p>
                                {srv.badge && (
                                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200">
                                    {srv.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 line-clamp-1">{srv.desc}</p>
                            </div>
                          </a>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleSmoothScroll(e, link.href)}
                  className="px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100/70 transition-all duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right Action Cluster */}
            <div className="flex items-center gap-2.5">
              {/* Replay Splash Video Button */}
              {onPlaySplash && (
                <button
                  type="button"
                  onClick={onPlaySplash}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/5 hover:bg-slate-900/10 text-slate-700 text-xs font-bold transition-all border border-slate-200 hover:border-slate-300 active:scale-95 cursor-pointer"
                  title="Watch Brand Splash Screen"
                >
                  <Play className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
                  <span>Splash Intro</span>
                </button>
              )}

              {/* City Pill */}
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>Live in 15+ Cities</span>
              </div>

              {/* Launch / Download Primary CTA */}
              <a
                href="#ecosystem"
                onClick={(e) => handleSmoothScroll(e, '#ecosystem')}
                className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-[#00838F] via-[#0284C7] to-[#10B981] hover:brightness-110 text-white text-xs sm:text-sm font-bold shadow-lg shadow-teal-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <span>Launch App</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {/* Mobile Hamburger Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[98] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed right-0 top-0 bottom-0 w-84 z-[100] p-6 flex flex-col bg-white shadow-2xl border-l border-slate-100 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <img
                  src="/brand-logo.jpeg"
                  alt="Appzeto Super App"
                  className="h-10 w-auto object-contain"
                />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 4 Pillars in Mobile */}
              <div className="mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Our 4 Core Verticals</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {services.map((s) => {
                    const Icon = s.icon
                    return (
                      <a
                        key={s.name}
                        href={s.href}
                        onClick={(e) => handleSmoothScroll(e, s.href)}
                        className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-100 text-left transition-colors"
                      >
                        <div
                          className="w-7 h-7 rounded-lg text-white flex items-center justify-center mb-1.5 shadow-sm"
                          style={{ background: s.color }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-xs font-bold text-slate-800">{s.name}</p>
                      </a>
                    )
                  })}
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-3 flex-1 text-left">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleSmoothScroll(e, link.href)}
                    className="py-2.5 px-3 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              {/* Mobile CTA */}
              <div className="pt-6 border-t border-slate-100 space-y-3">
                {onPlaySplash && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      onPlaySplash()
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 transition-all cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
                    <span>Watch Splash Screen Intro</span>
                  </button>
                )}

                <a
                  href="#ecosystem"
                  onClick={(e) => handleSmoothScroll(e, '#ecosystem')}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-[#00838F] via-[#0284C7] to-[#10B981] text-white text-sm font-bold shadow-lg shadow-teal-500/20"
                >
                  <span>Explore 4 Super Apps</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
