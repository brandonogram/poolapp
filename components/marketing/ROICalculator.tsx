'use client'

import { useState, useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Button } from '@/components/ui'
import Container from '@/components/ui/Container'

function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 })
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString())

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return <motion.span>{display}</motion.span>
}

export default function ROICalculator() {
  const [technicians, setTechnicians] = useState(3)
  const [poolsPerDay, setPoolsPerDay] = useState(12)

  // Calculate savings
  const avgDrivingHoursPerTech = 2 // hours wasted driving per day
  const hourlyRate = 35 // average tech hourly rate
  const fuelCostPerHour = 15 // average fuel cost per hour of driving
  const workingDaysPerYear = 260 // roughly 5 days/week, 52 weeks

  // Current waste
  const wastedHoursPerYear = technicians * avgDrivingHoursPerTech * workingDaysPerYear * 0.35 // 35% of wasted time can be saved
  const laborWaste = wastedHoursPerYear * hourlyRate
  const fuelWaste = technicians * avgDrivingHoursPerTech * 0.38 * fuelCostPerHour * workingDaysPerYear // 38% fuel reduction

  // Additional revenue from extra pools
  const extraPoolsPerDay = technicians * 1.5 // avg 1.5 extra pools per tech per day
  const avgRevenuePerPool = 45
  const additionalRevenue = extraPoolsPerDay * avgRevenuePerPool * workingDaysPerYear

  const totalSavings = Math.round(laborWaste + fuelWaste)
  const totalOpportunity = Math.round(totalSavings + additionalRevenue)

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-navy-500 mb-4">
            Calculate Your Savings
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See how much money you're leaving on the table with inefficient routing
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Sliders */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="space-y-8">
                {/* Technicians slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-navy-500 font-semibold">Number of Technicians</label>
                    <span className="text-2xl font-bold text-primary-500 font-mono">{technicians}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={technicians}
                    onChange={(e) => setTechnicians(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-500 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-500/30"
                  />
                  <div className="flex justify-between text-sm text-slate-400 mt-2">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>

                {/* Pools per day slider */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-navy-500 font-semibold">Pools Per Tech Per Day</label>
                    <span className="text-2xl font-bold text-primary-500 font-mono">{poolsPerDay}</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="20"
                    value={poolsPerDay}
                    onChange={(e) => setPoolsPerDay(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-primary-500 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary-500/30"
                  />
                  <div className="flex justify-between text-sm text-slate-400 mt-2">
                    <span>6</span>
                    <span>12</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Info card */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-amber-800 text-sm">You're losing money every day</h4>
                      <p className="text-amber-700 text-sm mt-1">
                        The average pool tech wastes 2+ hours daily on inefficient routing. That's time and fuel you can't get back.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            {/* Loss card */}
            <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <div>
                  <p className="text-red-600 text-sm font-medium">You're currently losing</p>
                  <p className="text-3xl md:text-4xl font-bold text-red-600 font-mono">
                    $<AnimatedCounter value={totalSavings} /><span className="text-lg">/year</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Savings card */}
            <div className="bg-gradient-to-br from-primary-500 to-cyan-500 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-cyan-200 text-sm font-medium">With Pool App, you could save</p>
                  <p className="text-3xl md:text-4xl font-bold text-white font-mono">
                    $<AnimatedCounter value={totalOpportunity} /><span className="text-lg">/year</span>
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-cyan-200">Fuel savings</p>
                    <p className="text-white font-semibold font-mono">${Math.round(fuelWaste).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-cyan-200">Extra revenue</p>
                    <p className="text-white font-semibold font-mono">${Math.round(additionalRevenue).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-4">
              <Button variant="primary" size="lg" fullWidth>
                Start Saving Today - Free Trial
              </Button>
              <p className="text-slate-500 text-sm mt-3">
                Most customers see ROI within the first month
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
