'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import type { StudioInfo } from '@/types'

export default function Studio({ studio }: { studio: StudioInfo }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} id="studio" className="py-24 lg:py-32 border-t border-border">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted">
            Studio
          </span>
          <span className="h-px flex-1 bg-border" />
        </motion.div>

        <div className="grid md:grid-cols-12 gap-12 lg:gap-20">
          {/* Left — About copy */}
          <motion.div
            className="md:col-span-6"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <h2
              className="font-display font-semibold text-fg leading-tight mb-8"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)' }}
            >
              {studio.tagline}
            </h2>
            {studio.about.map((para, i) => (
              <p key={i} className="text-muted leading-relaxed mb-4 last:mb-0">
                {para}
              </p>
            ))}
          </motion.div>

          {/* Right — Info grid */}
          <motion.div
            className="md:col-span-5 md:col-start-8 space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="border-t border-border pt-6">
              <span className="font-mono text-2xs tracking-[0.2em] uppercase text-muted block mb-3">
                Based in
              </span>
              <span className="font-sans text-fg">Milan, Italy</span>
            </div>

            <div className="border-t border-border pt-6">
              <span className="font-mono text-2xs tracking-[0.2em] uppercase text-muted block mb-3">
                Availability
              </span>
              <span className="font-sans text-fg">Available for projects — 2025</span>
            </div>

            <div className="border-t border-border pt-6">
              <span className="font-mono text-2xs tracking-[0.2em] uppercase text-muted block mb-4">
                Selected Clients
              </span>
              <ul className="space-y-1">
                {studio.clients.map((client) => (
                  <li key={client} className="font-sans text-sm text-muted">
                    {client}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-6">
              <span className="font-mono text-2xs tracking-[0.2em] uppercase text-muted block mb-3">
                Contact
              </span>
              <a
                href={`mailto:${studio.email}`}
                className="font-sans text-fg hover:text-accent transition-colors duration-200 underline underline-offset-4 decoration-border hover:decoration-accent"
              >
                {studio.email}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
