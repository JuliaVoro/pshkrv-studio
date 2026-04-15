'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { StudioInfo } from '@/types'

export default function Approach({ studio }: { studio: StudioInfo }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section
      ref={ref}
      data-theme="dark"
      className="py-24 lg:py-40 bg-dark-bg text-dark-fg overflow-hidden"
    >
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-20"
        >
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-dark-muted">
            Approach
          </span>
        </motion.div>

        {/* Principles */}
        <div className="space-y-0">
          {studio.approach.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
              className="border-t border-dark-border py-10 grid md:grid-cols-12 gap-6 items-baseline group"
            >
              <span className="font-mono text-xs text-dark-muted md:col-span-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3
                className="font-display font-semibold text-dark-fg group-hover:text-accent transition-colors duration-300 md:col-span-5"
                style={{ fontSize: 'clamp(1.5rem, 3vw, 2.75rem)' }}
              >
                {item.title}
              </h3>
              <p className="font-sans text-dark-muted leading-relaxed md:col-span-5 md:col-start-8 text-sm">
                {item.body}
              </p>
            </motion.div>
          ))}
          <div className="border-t border-dark-border" />
        </div>
      </div>
    </section>
  )
}
