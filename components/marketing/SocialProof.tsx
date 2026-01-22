'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'

const stats = [
  { value: '500+', label: 'Pool Companies' },
  { value: '15,000+', label: 'Routes Optimized' },
  { value: '$2.4M+', label: 'Fuel Saved' },
  { value: '4.9', label: 'App Store Rating', suffix: '/5' },
]

const logos = [
  'Blue Wave Pools',
  'AquaCare Pro',
  'Crystal Clear',
  'Pool Masters',
  'SunSplash Services',
]

export default function SocialProof() {
  return (
    <section className="py-12 bg-navy-500">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-cyan-300 text-sm font-medium uppercase tracking-wider mb-8">
            Trusted by 500+ Pool Service Companies
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white font-mono">
                  {stat.value}
                  {stat.suffix && <span className="text-cyan-400">{stat.suffix}</span>}
                </div>
                <div className="text-slate-300 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Logo strip */}
          <div className="border-t border-slate-600 pt-8">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60">
              {logos.map((logo, index) => (
                <motion.div
                  key={logo}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="text-white font-semibold text-sm md:text-base tracking-wide"
                >
                  {logo}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
