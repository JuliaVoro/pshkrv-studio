'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import ProjectCard from '@/components/ui/ProjectCard'
import type { Project } from '@/types'

export default function Work({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const featured = projects.filter((p) => p.featured).slice(0, 6)

  return (
    <section ref={ref} id="work" className="py-24 lg:py-32 border-t border-border">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-baseline justify-between mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="font-mono text-xs tracking-[0.2em] uppercase text-muted"
          >
            Selected Work
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="font-mono text-xs tracking-[0.15em] uppercase text-muted"
          >
            {featured.length} Projects
          </motion.span>
        </div>

        {/* Row 1 — large left (7 cols) + tall right (5 cols) */}
        {featured.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            {featured[0] && (
              <motion.div
                className="md:col-span-7"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                <ProjectCard project={featured[0]} className="aspect-[4/3]" />
              </motion.div>
            )}
            {featured[1] && (
              <motion.div
                className="md:col-span-5"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
              >
                <ProjectCard project={featured[1]} className="aspect-[4/3] md:aspect-auto md:h-full" />
              </motion.div>
            )}
          </div>
        )}

        {/* Row 2 — narrow (4 cols) + wide (8 cols) */}
        {featured.length > 2 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
            {featured[2] && (
              <motion.div
                className="md:col-span-4"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.26 }}
              >
                <ProjectCard project={featured[2]} className="aspect-[3/4]" />
              </motion.div>
            )}
            {featured[3] && (
              <motion.div
                className="md:col-span-8"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
              >
                <ProjectCard project={featured[3]} className="aspect-[16/9] md:aspect-auto md:h-full" />
              </motion.div>
            )}
          </div>
        )}

        {/* Row 3 — equal halves */}
        {featured.length > 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featured[4] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.38 }}
              >
                <ProjectCard project={featured[4]} className="aspect-[4/3]" />
              </motion.div>
            )}
            {featured[5] && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.44 }}
              >
                <ProjectCard project={featured[5]} className="aspect-[4/3]" />
              </motion.div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
