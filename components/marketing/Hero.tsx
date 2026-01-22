'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui'
import Container from '@/components/ui/Container'

// Animated route visualization component
function RouteVisualization() {
  // Pool locations (simplified for visual effect)
  const pools = [
    { x: 80, y: 120, delay: 0 },
    { x: 220, y: 80, delay: 0.2 },
    { x: 320, y: 160, delay: 0.4 },
    { x: 180, y: 220, delay: 0.6 },
    { x: 280, y: 280, delay: 0.8 },
    { x: 120, y: 300, delay: 1.0 },
  ]

  // Optimized route path
  const routePath = "M80,120 Q150,100 220,80 Q280,120 320,160 Q250,190 280,280 Q200,290 120,300 Q100,260 180,220"

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden">
      {/* Grid background */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Map visualization */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 380">
        {/* Animated route line */}
        <motion.path
          d={routePath}
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
        />

        {/* Gradient definition */}
        <defs>
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#00D4FF" />
          </linearGradient>
        </defs>

        {/* Pool markers */}
        {pools.map((pool, index) => (
          <motion.g key={index}>
            {/* Pulse effect */}
            <motion.circle
              cx={pool.x}
              cy={pool.y}
              r="20"
              fill="#0066FF"
              opacity="0.2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.1, 0.2] }}
              transition={{
                delay: pool.delay + 1,
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
            {/* Pool marker */}
            <motion.circle
              cx={pool.x}
              cy={pool.y}
              r="12"
              fill="white"
              stroke="#0066FF"
              strokeWidth="3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: pool.delay + 0.5, type: "spring", stiffness: 200 }}
            />
            {/* Pool icon */}
            <motion.text
              x={pool.x}
              y={pool.y + 4}
              textAnchor="middle"
              fill="#0066FF"
              fontSize="10"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: pool.delay + 0.7 }}
            >
              {index + 1}
            </motion.text>
          </motion.g>
        ))}

        {/* Truck icon at start */}
        <motion.g
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <circle cx="80" cy="120" r="18" fill="#001B44" />
          <text x="80" y="125" textAnchor="middle" fill="white" fontSize="14">
            🚐
          </text>
        </motion.g>
      </svg>

      {/* Stats overlay */}
      <motion.div
        className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        <div className="flex items-center justify-between text-sm">
          <div className="text-center">
            <div className="font-mono text-lg font-bold text-navy-500">6</div>
            <div className="text-slate-500">Pools</div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <motion.div
              className="font-mono text-lg font-bold text-green-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
            >
              -38%
            </motion.div>
            <div className="text-slate-500">Less Driving</div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <motion.div
              className="font-mono text-lg font-bold text-primary-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.7 }}
            >
              47 min
            </motion.div>
            <div className="text-slate-500">Saved</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white to-white" />

      {/* Decorative elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />

      <Container className="relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-full text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
              Route Optimization for Pool Pros
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-navy-500 leading-tight mb-6"
            >
              Stop wasting{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-cyan-500">
                2 hours a day
              </span>{' '}
              driving between pools
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-slate-600 mb-8 max-w-xl"
            >
              Pool App optimizes your routes automatically, saving you $4,000+ per year in fuel
              and enabling 4-6 more service calls per technician per day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button variant="primary" size="lg">
                Start Free 14-Day Trial
              </Button>
              <Button variant="outline" size="lg">
                See How It Works
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-sm text-slate-500"
            >
              No credit card required. Set up in 5 minutes.
            </motion.p>
          </motion.div>

          {/* Right column - Route visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[400px] lg:h-[480px]"
          >
            <RouteVisualization />
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
