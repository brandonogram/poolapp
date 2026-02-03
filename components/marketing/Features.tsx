'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'

const features = [
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: 'Smart Route Optimization',
    description: 'Our AI analyzes traffic patterns, pool locations, and service times to create the most efficient routes. Save up to 2 hours of driving per technician per day.',
    stats: '38% less driving',
    gradient: 'from-primary-500 to-primary-600',
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Same-Day Invoicing',
    description: 'Generate and send invoices the moment a job is completed. Integration with Stripe means you get paid faster with automatic payment reminders.',
    stats: '50% faster payments',
    gradient: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: 'Chemistry Tracking',
    description: 'Log chlorine, pH, alkalinity, and more with one tap. Get alerts when chemicals are trending out of range before problems occur.',
    stats: '99% compliance rate',
    gradient: 'from-emerald-500 to-emerald-600',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
}

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-500 mb-4">
            Everything you need to run{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-cyan-500">
              a modern pool business
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            PoolOps combines route optimization, invoicing, and chemistry tracking in one simple platform built specifically for pool professionals.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              className="group relative"
            >
              <div className="relative bg-white rounded-2xl border border-slate-200 p-8 h-full transition-all duration-300 hover:shadow-xl hover:border-slate-300 hover:-translate-y-1">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-6`}>
                  {feature.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-navy-500 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Stats badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-slate-700">{feature.stats}</span>
                </div>

                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional features list */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-16 border-t border-slate-100"
        >
          <div className="text-center mb-8">
            <p className="text-slate-500 text-sm uppercase tracking-wider font-medium">
              Also included
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Customer Portal',
              'Photo Documentation',
              'Equipment Tracking',
              'Team Scheduling',
              'GPS Tracking',
              'Custom Reports',
              'Mobile App',
              'API Access',
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full"
              >
                <svg className="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-slate-700 font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
