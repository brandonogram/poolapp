'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/ui/Container'

const faqs = [
  {
    question: 'How does the free trial work?',
    answer: 'You get full access to all features for 14 days, no credit card required. At the end of your trial, you can choose a plan that fits your business. We\'ll never charge you without your explicit consent.',
  },
  {
    question: 'Can I switch plans later?',
    answer: 'Absolutely! You can upgrade or downgrade your plan at any time. If you upgrade, you\'ll be prorated for the remainder of your billing cycle. If you downgrade, the change takes effect at your next billing date.',
  },
  {
    question: 'How accurate is the route optimization?',
    answer: 'Our route optimization typically reduces driving time by 30-40%. We use real-time traffic data, historical patterns, and machine learning to continuously improve route efficiency. Most customers see immediate results from day one.',
  },
  {
    question: 'Do my technicians need smartphones?',
    answer: 'Yes, PoolOps works best with smartphones (iOS or Android). Technicians use the mobile app to view routes, log services, and capture photos. The app works offline too, syncing when connection is restored.',
  },
  {
    question: 'Can I import my existing customer data?',
    answer: 'Yes! We support CSV imports and can help migrate data from most popular pool service software. Our team will assist with the migration process to ensure a smooth transition.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use bank-level encryption (256-bit SSL) for all data transmission and storage. Your data is backed up daily and stored in SOC 2 compliant data centers. We never share or sell your customer information.',
  },
  {
    question: 'What if I have more than 3 technicians?',
    answer: 'Our Pro plan supports unlimited technicians. If you have a large team with special needs, contact us about our Enterprise options which include dedicated support, custom integrations, and volume discounts.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel anytime from your account settings - no phone calls required. If you cancel, you\'ll retain access until the end of your current billing period. We also offer a 30-day money-back guarantee.',
  },
]

function FAQItem({ question, answer, isOpen, onClick }: {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
}) {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left hover:text-primary-500 transition-colors"
      >
        <span className="text-lg font-semibold text-navy-500 pr-8">{question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center"
        >
          <svg className="w-5 h-5 text-slate-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-600 leading-relaxed pr-16">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 lg:py-32 bg-slate-50">
      <Container size="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-500 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto">
            Can't find what you're looking for? Contact our support team and we'll get back to you within 24 hours.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="divide-y divide-slate-200 px-8">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </motion.div>

        {/* Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-slate-600 mb-4">Still have questions?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="mailto:support@poolops.io"
              className="inline-flex items-center gap-2 text-primary-500 font-medium hover:text-primary-600 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              support@poolops.io
            </a>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <a
              href="tel:1-800-POOL-APP"
              className="inline-flex items-center gap-2 text-primary-500 font-medium hover:text-primary-600 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              1-800-POOL-APP
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
