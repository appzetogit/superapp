import React, { useEffect, useState, lazy, Suspense } from 'react'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SplashScreen from './components/SplashScreen'
import api from '../Taxi/shared/api/axiosInstance'

const Ecosystem = lazy(() => import('./components/Ecosystem'))
const Services = lazy(() => import('./components/Services'))
const WhyUs = lazy(() => import('./components/WhyUs'))
const Showcase = lazy(() => import('./components/Showcase'))
const VideoSection = lazy(() => import('./components/VideoSection'))
const Partners = lazy(() => import('./components/Partners'))
const FAQ = lazy(() => import('./components/FAQ'))
const Footer = lazy(() => import('./components/Footer'))

export default function LandingPage() {
  const [landingSettings, setLandingSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    // Check if user has already seen splash screen this session
    try {
      const hasSeen = sessionStorage.getItem('appzeto_splash_seen')
      if (!hasSeen) {
        setShowSplash(true)
      }
    } catch (e) {
      setShowSplash(true)
    }

    // Dynamic SEO Title & Meta tags for Appzeto Super App
    document.title = "Appzeto Super App - Food Delivery, 10-Min Groceries, Home Services & Taxi"

    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.name = 'description'
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute(
      'content',
      'Appzeto is India’s everyday super-app combining gourmet food delivery, 10-minute grocery quick commerce, certified on-demand service technicians, and dependable ride hailing.'
    )

    // Fetch dynamic landing settings if backend available
    const fetchLandingSettings = async () => {
      try {
        const res = await api.get('/common/landing-page/settings')
        if (res?.success && res?.data) {
          setLandingSettings(res.data)
        }
      } catch (err) {
        // Silently fallback to defaults
      } finally {
        setLoading(false)
      }
    }
    fetchLandingSettings()

    // Smooth scrolling using Lenis (desktop only)
    let lenis = null
    let rafId = null

    if (window.innerWidth >= 768) {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
      })

      const raf = (time) => {
        lenis?.raf(time)
        rafId = requestAnimationFrame(raf)
      }

      rafId = requestAnimationFrame(raf)
    }

    return () => {
      if (lenis) lenis.destroy()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      className="min-h-screen bg-white text-slate-900 antialiased overflow-x-clip select-none"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif", WebkitFontSmoothing: 'antialiased' }}
    >
      {/* Fullscreen Cinematic Splash Video Screen */}
      {showSplash && (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
          autoDismiss={true}
        />
      )}

      {/* Navigation Header */}
      <Navbar
        settings={landingSettings}
        onPlaySplash={() => setShowSplash(true)}
      />

      {/* Hero Section */}
      <Hero
        settings={landingSettings}
        onPlaySplash={() => setShowSplash(true)}
      />

      {/* 4-Pillar Unified Ecosystem Selector */}
      <Suspense fallback={null}>
        <Ecosystem settings={landingSettings} />
      </Suspense>

      {/* 6-Card Services Showcase Grid */}
      <Suspense fallback={null}>
        <Services settings={landingSettings} />
      </Suspense>

      {/* Next-Gen Architecture & Smartphone Showcase */}
      <Suspense fallback={null}>
        <Showcase settings={landingSettings} />
      </Suspense>

      {/* Trust & Safety Standards */}
      <Suspense fallback={null}>
        <WhyUs settings={landingSettings} />
      </Suspense>

      {/* High-End Cinema Video Theater */}
      <Suspense fallback={null}>
        <VideoSection settings={landingSettings} />
      </Suspense>

      {/* 4-Way Partner Onboarding Gateway */}
      <Suspense fallback={null}>
        <Partners settings={landingSettings} />
      </Suspense>

      {/* Comprehensive FAQs */}
      <Suspense fallback={null}>
        <FAQ settings={landingSettings} />
      </Suspense>

      {/* Super App Directory Footer */}
      <Suspense fallback={null}>
        <Footer settings={landingSettings} />
      </Suspense>
    </div>
  )
}
