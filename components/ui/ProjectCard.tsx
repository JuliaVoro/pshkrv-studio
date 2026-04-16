'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import type { Project } from '@/types'

interface ProjectCardProps {
  project: Project
  className?: string
}

export default function ProjectCard({ project, className }: ProjectCardProps) {
  const cardImage = project.previewImage || project.coverImage
  const hasImage = Boolean(cardImage)
  const coverBg = project.coverColor ?? '#E4E4E7'

  return (
    <Link href={`/work/${project.slug}`} className="block w-full h-full">
      <motion.article
        className={`group relative overflow-hidden cursor-pointer w-full h-full ${className ?? ''}`}
        style={{ backgroundColor: hasImage ? undefined : coverBg }}
        whileHover="hover"
        initial="rest"
      >
        {/* Image or color fill */}
        <div className="relative w-full h-full overflow-hidden">
          {hasImage ? (
            <motion.div
              variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full"
            >
              <Image
                src={cardImage}
                alt={project.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          ) : (
            <motion.div
              variants={{ rest: { scale: 1 }, hover: { scale: 1.04 } }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="w-full h-full flex items-center justify-center"
            >
              <span
                className="font-display font-bold select-none"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 6rem)',
                  color: isDark(coverBg) ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                }}
              >
                {String(project.order).padStart(2, '0')}
              </span>
            </motion.div>
          )}
        </div>

        {/* Hover overlay — gradient anchored at the bottom so text is always
            readable regardless of whether the cover is light or dark */}
        <motion.div
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 flex flex-col justify-end p-5 md:p-6"
          style={{
            background:
              'linear-gradient(to top, rgba(9,9,11,0.97) 0%, rgba(9,9,11,0.88) 30%, rgba(9,9,11,0.5) 55%, rgba(9,9,11,0.15) 75%, transparent 100%)',
          }}
        >
          <span className="font-mono text-2xs tracking-[0.2em] uppercase text-dark-muted mb-1.5">
            {project.category} · {project.year}
          </span>
          <h3
            className="font-display font-semibold text-dark-fg leading-tight"
            style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)' }}
          >
            {project.title}
          </h3>
          {project.tagline && (
            <p className="font-sans text-xs text-dark-muted mt-1.5 line-clamp-2 leading-relaxed">
              {project.tagline}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-2 font-mono text-2xs tracking-[0.15em] uppercase text-accent">
            View Project <span>→</span>
          </span>
        </motion.div>

        {/* Rest-state label */}
        <motion.div
          variants={{ rest: { opacity: 1 }, hover: { opacity: 0 } }}
          transition={{ duration: 0.18 }}
          className="absolute bottom-3 left-3"
        >
          <span
            className="font-mono text-2xs tracking-[0.15em] uppercase px-2 py-1"
            style={{
              backgroundColor: isDark(coverBg) ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.75)',
              color: isDark(coverBg) ? '#F4F4F5' : '#09090B',
              backdropFilter: 'blur(4px)',
            }}
          >
            {project.category}
          </span>
        </motion.div>
      </motion.article>
    </Link>
  )
}

/** Rough luminance check to decide if a hex bg is dark */
function isDark(hex: string): boolean {
  const h = hex.replace('#', '')
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}
