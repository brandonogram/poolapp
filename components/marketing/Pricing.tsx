'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui'
import Container from '@/components/ui/Container'

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for solo operators getting started',
    price: { monthly: 49, annual: 39 },
    features: [
      '1 Technician',
      'Up to 75 pools',
      'Route optimization',
      'Basic chemistry logging',
      'Mobile app access',
      'Email support',
    ],
    notIncluded: [
      'Same-day invoicing',
      'Customer portal',
      'API access',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Growth',
    description: 'For growing teams who want the full experience',
    price: { monthly: 99, annual: 79 },
    features: [
      'Up to 3 Technicians',
      'Up to 200 pools',
      'Advanced route optimization',
      'Full chemistry tracking',
      'Same-day invoicing',
      'Customer portal',
      'Team scheduling',
      'Priority support',
    ],
    notIncluded: [
      'API access',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Pro',
    description: 'For established businesses ready to scale',
    price: { monthly: 199, annual: 159 },
    features: [
      'Unlimited Technicians',
      'Unlimited pools',
      'AI-powered optimization',
      'Advanced analytics',
      'Same-day invoicing',
      'Customer portal',
      'Team scheduling',
      'API access',
      'Dedicated account manager',
      'Custom integrations',
    ],
    notIncluded: [],
    cta: 'Start Free Trial',
    popular: false,
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" className="py-20 lg:py-32 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-4">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-500 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            No hidden fees. No contracts. Cancel anytime. All plans include a 14-day free trial.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center gap-4 bg-slate-100 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                !annual ? 'bg-white text-navy-500 shadow-sm' : 'text-slate-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                annual ? 'bg-white text-navy-500 shadow-sm' : 'text-slate-600'
              }`}
            >
              Annual
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative rounded-2xl ${
                plan.popular
                  ? 'bg-gradient-to-b from-primary-500 to-primary-600 p-[2px]'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary-500 to-cyan-500 text-white text-sm font-medium rounded-full shadow-lg">
                  Most Popular
                </div>
              )}
              <div className={`h-full bg-white rounded-2xl border ${
                plan.popular ? 'border-transparent' : 'border-slate-200'
              } p-8`}>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-navy-500 mb-2">{plan.name}</h3>
                  <p className="text-slate-500 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-navy-500 font-mono">
                      ${annual ? plan.price.annual : plan.price.monthly}
                    </span>
                    <span className="text-slate-500">/month</span>
                  </div>
                  {annual && (
                    <p className="text-sm text-slate-400 mt-1">
                      billed annually (${plan.price.annual * 12}/year)
                    </p>
                  )}
                </div>

                <Button
                  variant={plan.popular ? 'primary' : 'outline'}
                  size="lg"
                  fullWidth
                  className="mb-8"
                >
                  {plan.cta}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700 text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded.map((feature) => (
                    <div key={feature} className="flex items-start gap-3 opacity-50">
                      <svg className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-400 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise callout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 bg-slate-50 rounded-2xl px-8 py-4">
            <div className="w-12 h-12 rounded-xl bg-navy-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-navy-500">Need enterprise features?</h4>
              <p className="text-slate-500 text-sm">Contact us for custom pricing, SLAs, and dedicated support.</p>
            </div>
            <Button variant="ghost" size="sm">
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
