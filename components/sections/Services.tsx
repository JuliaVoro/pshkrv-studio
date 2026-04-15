'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import type { Service } from '@/types'

export default function Services({ services }: { services: Service[] }) {
  const [openId, setOpenId] = useState<string | null>(null)
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section ref={ref} id="services" className="py-24 lg:py-32">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="flex items-baseline justify-between mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-xs tracking-[0.2em] uppercase text-muted"
          >
            Services
          </motion.span>
        </div>

        {/* Accordion list */}
        <div>
          {services.map((service, i) => (
            <div key={service.id} className="rule-x">
              <button
                className="w-full text-left py-8 flex items-start justify-between gap-6 group"
                onClick={() => setOpenId(openId === service.id ? null : service.id)}
                aria-expanded={openId === service.id}
              >
                <div className="flex items-baseline gap-6">
                  <span className="font-mono text-xs text-muted shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="font-display font-semibold text-fg group-hover:text-accent transition-colors duration-200"
                    style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
                  >
                    {service.title}
                  </span>
                </div>
                <motion.span
                  animate={{ rotate: openId === service.id ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="font-mono text-2xl text-muted shrink-0 mt-1"
                  aria-hidden="true"
                >
                  +
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {openId === service.id && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 pl-14 grid md:grid-cols-2 gap-6">
                      <p className="text-muted leading-relaxed">{service.description}</p>
                      <ul className="space-y-2">
                        {service.deliverables.map((d) => (
                          <li key={d} className="flex items-center gap-3 font-mono text-xs text-muted">
                            <span className="w-4 h-px bg-border shrink-0" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
