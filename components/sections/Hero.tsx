'use client'

import { motion } from 'framer-motion'
import { heroReveal, staggerContainer, fadeIn } from '@/lib/motion'

export default function Hero() {
  return (
    <section className="relative min-h-dvh flex flex-col justify-end pb-16 pt-32 overflow-hidden">
      {/* Background grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, #E4E4E7 1px, transparent 1px)',
          backgroundSize: '25% 100%',
          opacity: 0.35,
        }}
        aria-hidden="true"
      />

      <div className="max-w-8xl mx-auto px-6 lg:px-12 w-full">
        {/* Location tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="flex items-center gap-3 mb-10"
        >
          <span className="block w-6 h-px bg-muted" />
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted">
            Milan — IT · Est. 2019
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="overflow-hidden"
        >
          {['ART', 'DIRECTION', '& DESIGN'].map((line, i) => (
            <div key={i} className="line-mask">
              <motion.h1
                variants={heroReveal}
                custom={i}
                className="font-display font-bold leading-[0.88] tracking-[-0.03em] text-fg"
                style={{ fontSize: 'clamp(4rem, 13vw, 13rem)' }}
              >
                {line}
              </motion.h1>
            </div>
          ))}
        </motion.div>

        {/* Bottom row */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ delay: 1.1, duration: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6"
        >
          <p className="font-sans text-base text-muted max-w-xs leading-relaxed">
            A design practice working at the intersection of art direction,
            brand identity, and digital experience.
          </p>
          <a
            href="#work"
            className="group flex items-center gap-3 font-mono text-xs tracking-[0.15em] uppercase text-fg border border-fg px-6 py-3 hover:bg-fg hover:text-bg transition-colors duration-200"
          >
            View Work
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </a>
        </motion.div>
      </div>

    </section>
  )
}
