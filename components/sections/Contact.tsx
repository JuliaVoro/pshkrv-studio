'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import type { StudioInfo } from '@/types'

export default function Contact({ studio }: { studio: StudioInfo }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    // Simulate — wire up real email service if needed
    await new Promise((r) => setTimeout(r, 1000))
    setStatus('sent')
  }

  return (
    <section
      ref={ref}
      id="contact"
      data-theme="dark"
      className="py-24 lg:py-40 bg-dark-bg text-dark-fg border-t border-dark-border"
    >
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        {/* Big CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20"
        >
          <h2
            className="font-display font-bold text-dark-fg leading-[0.9] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(3.5rem, 10vw, 10rem)' }}
          >
            Let&rsquo;s Talk.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-12 gap-12">
          {/* Form */}
          <motion.div
            className="md:col-span-6"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {status === 'sent' ? (
              <div className="py-12">
                <p className="font-display text-2xl text-dark-fg mb-2">Message received.</p>
                <p className="text-dark-muted">We&apos;ll be in touch within 48 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block font-mono text-2xs tracking-[0.15em] uppercase text-dark-muted mb-2">
                      Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="w-full bg-transparent border-b border-dark-border text-dark-fg placeholder:text-dark-muted py-3 focus:outline-none focus:border-accent transition-colors duration-200 text-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-mono text-2xs tracking-[0.15em] uppercase text-dark-muted mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full bg-transparent border-b border-dark-border text-dark-fg placeholder:text-dark-muted py-3 focus:outline-none focus:border-accent transition-colors duration-200 text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="company" className="block font-mono text-2xs tracking-[0.15em] uppercase text-dark-muted mb-2">
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="w-full bg-transparent border-b border-dark-border text-dark-fg placeholder:text-dark-muted py-3 focus:outline-none focus:border-accent transition-colors duration-200 text-sm"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block font-mono text-2xs tracking-[0.15em] uppercase text-dark-muted mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-transparent border-b border-dark-border text-dark-fg placeholder:text-dark-muted py-3 focus:outline-none focus:border-accent transition-colors duration-200 text-sm resize-none"
                    placeholder="Tell us about your project…"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group flex items-center gap-3 font-mono text-xs tracking-[0.15em] uppercase border border-dark-fg text-dark-fg px-8 py-4 hover:bg-dark-fg hover:text-dark-bg transition-colors duration-200 disabled:opacity-50"
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </button>
              </form>
            )}
          </motion.div>

          {/* Info sidebar */}
          <motion.div
            className="md:col-span-4 md:col-start-9 space-y-8"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <div>
              <span className="font-mono text-2xs tracking-[0.2em] uppercase text-dark-muted block mb-3">
                Email
              </span>
              <a
                href={`mailto:${studio.email}`}
                className="text-dark-fg hover:text-accent transition-colors duration-200 underline underline-offset-4 decoration-dark-border"
              >
                {studio.email}
              </a>
            </div>
            <div>
              <span className="font-mono text-2xs tracking-[0.2em] uppercase text-dark-muted block mb-3">
                LinkedIn
              </span>
              <a
                href={studio.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-fg hover:text-accent transition-colors duration-200"
              >
                PSHKRV Studio
              </a>
            </div>
            <div className="border-t border-dark-border pt-6">
              <span className="font-mono text-2xs tracking-[0.2em] uppercase text-dark-muted block mb-2">
                Based in
              </span>
              <span className="text-dark-fg text-sm">Milan, Italy</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
