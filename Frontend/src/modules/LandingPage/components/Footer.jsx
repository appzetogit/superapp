import React, { useEffect, useRef } from 'react'
import { Mail, Phone, MapPin, ArrowRight, ShieldCheck, Heart } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer({ settings }) {
  const currentYear = new Date().getFullYear()
  const footerRef = useRef(null)

  const footerDirectory = {
    food: [
      { name: 'Order Food Online', href: '/food/user' },
      { name: 'Top Rated Restaurants', href: '/food/user' },
      { name: 'Cloud Kitchen Network', href: '/partner' },
      { name: 'Restaurant Partner Portal', href: '/partner' }
    ],
    quickCommerce: [
      { name: '10-Minute Groceries', href: '/food/user' },
      { name: 'Farm Fresh Produce', href: '/food/user' },
      { name: 'Late-Night Essentials', href: '/food/user' },
      { name: 'Merchant Dark Store Signup', href: '/partner' }
    ],
    services: [
      { name: 'AC Cleaning & Repair', href: '#services' },
      { name: 'Electrician on Demand', href: '#services' },
      { name: 'Plumber & Water Doctor', href: '#services' },
      { name: 'Join as Certified Pro', href: '/partner' }
    ],
    taxi: [
      { name: 'Book Instant Cab', href: '/taxi/user' },
      { name: 'Bike Taxi Express', href: '/taxi/user' },
      { name: 'Airport Drop & Pickup', href: '/taxi/user' },
      { name: 'Driver Captain Signup', href: '/taxi/signup' }
    ],
    legal: [
      { name: 'Terms of Service', href: '/terms?tab=terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Safety & Insurance', href: '/support' },
      { name: '24/7 Help Desk', href: '/support' }
    ]
  }

  return (
    <footer
      ref={footerRef}
      className="relative bg-slate-950 text-slate-400 overflow-hidden border-t border-slate-900"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
    >
      {/* Top App Download CTA Banner */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              Everyday Convenience in Your Pocket
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Download the Appzeto Super App.
            </h3>
            <p className="text-slate-400 text-sm mt-1">
              Available across Android and iOS devices. Join over 500,000 satisfied users.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="https://play.google.com/store/apps/details?id=com.k9bharat.user"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:scale-105 transition-transform"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                className="h-10 w-auto"
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
                alt="Download on App Store"
                className="h-10 w-auto"
              />
            </a>
          </div>
        </div>
      </div>

      {/* Main Directory Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16 text-left">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <a href="#" className="inline-block">
              <img
                src="/brand-logo.jpeg"
                alt="Appzeto Super App"
                className="h-12 w-auto object-contain rounded-xl"
              />
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Appzeto is India's leading unified everyday super-app — combining gourmet food delivery, 10-minute grocery shopping, certified on-demand service technicians, and dependable mobility into one effortless experience.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
              <span>Operating in 15+ Cities across India</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>24/7 Priority Support Desk</span>
            </div>
          </div>

          {/* Column 1: Food */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-wider text-orange-400">
              🍕 Food Delivery
            </p>
            <ul className="space-y-2 text-xs">
              {footerDirectory.food.map((l) => (
                <li key={l.name}>
                  <a href={l.href} className="hover:text-white transition-colors">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Quick Commerce */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-wider text-emerald-400">
              ⚡ Quick Mart
            </p>
            <ul className="space-y-2 text-xs">
              {footerDirectory.quickCommerce.map((l) => (
                <li key={l.name}>
                  <a href={l.href} className="hover:text-white transition-colors">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-wider text-sky-400">
              🔧 Service Pro
            </p>
            <ul className="space-y-2 text-xs">
              {footerDirectory.services.map((l) => (
                <li key={l.name}>
                  <a href={l.href} className="hover:text-white transition-colors">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Taxi & Legal */}
          <div className="space-y-3">
            <p className="text-xs font-black uppercase tracking-wider text-amber-400">
              🚕 Taxi & Rides
            </p>
            <ul className="space-y-2 text-xs">
              {footerDirectory.taxi.map((l) => (
                <li key={l.name}>
                  <a href={l.href} className="hover:text-white transition-colors">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Appzeto Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="/terms?tab=terms" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="/support" className="hover:text-slate-300 transition-colors">Security</a>
            <span className="flex items-center gap-1 text-slate-400">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for urban living
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
