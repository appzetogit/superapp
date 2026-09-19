import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Minus, HelpCircle, Sparkles } from 'lucide-react'

const appzetoFaqs = [
  {
    question: 'What services are unified under the Appzeto Super App?',
    answer: 'Appzeto is an all-in-one everyday super-app combining four core verticals: (1) Food Delivery from top city restaurants, (2) Quick Commerce groceries delivered in under 10 minutes, (3) On-Demand certified Service Providers (AC repair, electricians, plumbers, house cleaners & salon), and (4) Taxi & Mobility (bike taxis, autos, comfort sedans, SUVs, and airport transfers).'
  },
  {
    question: 'How does Appzeto achieve sub-10-minute grocery delivery?',
    answer: 'Our Quick Commerce network operates strategically placed hyperlocal micro-fulfillment dark stores across every major urban sector. When you order, our pickers bag items in under 2 minutes, and our dedicated dispatch fleet delivers to your address within 8 to 10 minutes.'
  },
  {
    question: 'How are Service Provider technicians vetted and certified?',
    answer: 'Every technician on the Appzeto platform undergoes a strict 4-stage screening process: government ID verification, criminal background check, practical trade skills testing, and customer etiquette training. All home services also come backed by our standard 30-day rework warranty.'
  },
  {
    question: 'Can I pay for all services using a single Appzeto Wallet?',
    answer: 'Yes! Appzeto features a unified digital wallet balance that can be used seamlessly across food delivery, quick groceries, home service bookings, and cab rides. We also support all major UPI apps (GPay, PhonePe, Paytm), credit/debit cards, net banking, and Cash on Delivery.'
  },
  {
    question: 'Does Appzeto charge peak surge pricing on taxi rides?',
    answer: 'Appzeto is committed to fair and transparent transportation. We do not enforce exorbitant hidden surge multipliers during peak hours, and all fares are clearly displayed upfront before you confirm your ride.'
  },
  {
    question: 'How do I register my restaurant, grocery shop, or driving vehicle?',
    answer: 'Joining the Appzeto Partner Network takes just minutes! Click on "Partner With Us" at the top of the page. You can register as a Driver Captain at /taxi/signup or as a Restaurant, Grocery Merchant, or Service Technician at /partner with fast 24-hour verification.'
  }
]

export default function FAQ({ settings }) {
  const [openIdx, setOpenIdx] = useState(0)
  const faqs = settings?.faqs && settings.faqs.length > 0 ? settings.faqs : appzetoFaqs

  const toggleFaq = (idx) => setOpenIdx(openIdx === idx ? null : idx)

  return (
    <section
      id="faq"
      className="py-24 overflow-hidden relative bg-white border-t border-slate-100"
      style={{ fontFamily: "'Poppins', system-ui, sans-serif" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#00838F]/10 border border-[#00838F]/20 text-[#00838F] text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Frequently Asked{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00838F] via-[#0284C7] to-[#10B981]">
              Questions.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
            Everything you need to know about the Appzeto Super App ecosystem, payments, and safety.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 text-left">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-slate-50/80 border-[#00838F]/40 shadow-md'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none cursor-pointer gap-4"
                >
                  <span className="font-bold text-base sm:text-lg text-slate-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? 'bg-[#00838F] text-white rotate-180'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-200/40">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
