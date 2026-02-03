'use client'

import { motion } from 'framer-motion'
import Container from '@/components/ui/Container'

const testimonials = [
  {
    quote: "PoolOps cut our driving time by 40%. My techs are now servicing 5 more pools per day, which adds up to $2,000+ in extra revenue per week. The ROI was obvious within the first month.",
    author: "Mike Rodriguez",
    role: "Owner, AquaCare Pro",
    location: "Phoenix, AZ",
    image: null, // Placeholder - would be real image in production
    stats: { pools: 180, techs: 4, saved: "$4,200/mo" },
  },
  {
    quote: "Before PoolOps, we were using paper routes and Google Maps. Now route planning takes 5 minutes instead of 2 hours. My wife actually sees me for dinner now.",
    author: "David Chen",
    role: "Founder, Crystal Clear Pools",
    location: "San Diego, CA",
    image: null,
    stats: { pools: 120, techs: 3, saved: "$3,100/mo" },
  },
  {
    quote: "The chemistry tracking alone is worth the price. We caught a chlorine issue before it became a problem - saved us from a $5,000 lawsuit. Customer service is incredible too.",
    author: "Sarah Williams",
    role: "Operations Manager, Blue Wave Services",
    location: "Austin, TX",
    image: null,
    stats: { pools: 250, techs: 5, saved: "$5,800/mo" },
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-slate-50">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-cyan-50 text-cyan-600 rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-500 mb-4">
            Pool pros love PoolOps
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Join 500+ pool service companies who have transformed their operations
          </p>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="relative bg-gradient-to-br from-primary-500 to-cyan-500 rounded-3xl p-8 md:p-12 overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </div>

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <svg className="w-12 h-12 text-white/30 mb-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <blockquote className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-8">
                  "{testimonials[0].quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-white text-xl font-bold">
                    {testimonials[0].author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{testimonials[0].author}</div>
                    <div className="text-cyan-200 text-sm">{testimonials[0].role}</div>
                    <div className="text-cyan-300 text-sm">{testimonials[0].location}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-white font-mono">{testimonials[0].stats.pools}</div>
                  <div className="text-cyan-200 text-sm">Pools</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-white font-mono">{testimonials[0].stats.techs}</div>
                  <div className="text-cyan-200 text-sm">Techs</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white font-mono">{testimonials[0].stats.saved}</div>
                  <div className="text-cyan-200 text-sm">Saved</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.slice(1).map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
              className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-shadow"
            >
              <svg className="w-8 h-8 text-primary-200 mb-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="text-slate-700 leading-relaxed mb-6">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-navy-500 font-semibold">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="text-navy-500 font-semibold">{testimonial.author}</div>
                    <div className="text-slate-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-bold font-mono">{testimonial.stats.saved}</div>
                  <div className="text-slate-400 text-xs">monthly savings</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
