'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import NavbarAnimated from '@/components/layout/NavbarAnimated'
import Footer from '@/components/layout/Footer'
import ProjectBlocks from '@/components/sections/ProjectBlocks'
import CursorFollower from '@/components/ui/CursorFollower'
import type { Project, StudioInfo } from '@/types'
import { useEffect, useState } from 'react'

interface Props {
  project: Project
  prevProject: Project | null
  nextProject: Project | null
  headerStyle?: 'classic' | 'animated'
}

// Minimal studio info for footer — fetched client-side or passed as prop
const FOOTER_STUB: StudioInfo = {
  tagline: 'Art Direction & Digital Design',
  about: [],
  approach: [],
  expertise: [],
  clients: [],
  collaborators: [],
  email: 'sergii@pshkrv.com',
  linkedin: 'https://www.linkedin.com/in/pshkrv/',
}

function hexIsDark(hex: string): boolean {
  const h = hex.replace('#', '')
  if (h.length !== 6) return false
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  // Perceived luminance (ITU-R BT.601)
  return (r * 299 + g * 587 + b * 114) / 1000 < 128
}

export default function ProjectPageClient({ project, prevProject, nextProject, headerStyle }: Props) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  const [studio, setStudio] = useState<StudioInfo>(FOOTER_STUB)
  useEffect(() => {
    fetch('/api/studio').then((r) => r.json()).then(setStudio).catch(() => {})
  }, [])

  const hasCover = Boolean(project.coverImage)
  const coverBg = project.coverColor ?? '#E4E4E7'
  // Text should be light whenever the hero background is dark —
  // either because there's a real image (overlaid with a dark scrim)
  // or because coverColor itself is a dark hue.
  const isDarkHero = hasCover || hexIsDark(coverBg)

  return (
    <>
      <CursorFollower />

      {/* Scroll progress bar — only for classic header; animated header has its own */}
      {headerStyle !== 'animated' && (
        <motion.div
          className="fixed top-0 left-0 h-[2px] bg-accent z-[60] origin-left"
          style={{ width: progressWidth }}
          aria-hidden="true"
        />
      )}

      {headerStyle === 'animated' ? <NavbarAnimated darkHero={isDarkHero} /> : <Navbar darkHero={isDarkHero} />}

      <main className="bg-bg">
        {/* ── Hero ────────────────────────────────── */}
        <section
          ref={heroRef}
          className="relative min-h-[80vh] flex flex-col justify-end overflow-hidden"
          style={{ backgroundColor: hasCover ? undefined : coverBg }}
        >
          {hasCover && (
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-fg/60" />
            </div>
          )}

          {/* Hero content */}
          <div className={`relative z-10 max-w-8xl mx-auto px-6 lg:px-12 pb-16 pt-32 w-full ${!hasCover ? '' : ''}`}>
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-12"
            >
              <Link
                href="/#work"
                className={`inline-flex items-center gap-2 font-mono text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${
                  isDarkHero ? 'text-dark-muted hover:text-dark-fg' : 'text-muted hover:text-fg'
                }`}
              >
                <span>←</span> All Work
              </Link>
            </motion.div>

            {/* Category + year */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className={`flex items-center gap-3 mb-6 ${isDarkHero ? 'text-dark-muted' : 'text-muted'}`}
            >
              <span className="font-mono text-xs tracking-[0.2em] uppercase">
                {project.category}
              </span>
              <span className="w-4 h-px bg-current opacity-40" />
              <span className="font-mono text-xs tracking-[0.2em] uppercase">
                {project.year}
              </span>
            </motion.div>

            {/* Title */}
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className={`font-display font-bold leading-[0.9] tracking-[-0.03em] ${
                  isDarkHero ? 'text-dark-fg' : 'text-fg'
                }`}
                style={{ fontSize: 'clamp(3.5rem, 10vw, 9rem)' }}
              >
                {project.title}
              </motion.h1>
            </div>

            {/* Tagline */}
            {project.tagline && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.55 }}
                className={`text-lg max-w-xl ${isDarkHero ? 'text-dark-muted' : 'text-muted'}`}
              >
                {project.tagline}
              </motion.p>
            )}
          </div>
        </section>

        {/* ── Project Meta Strip ───────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.7 }}
          className="border-b border-border"
        >
          <div className="max-w-8xl mx-auto px-6 lg:px-12">
            <dl className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              {[
                { label: 'Client', value: project.client },
                { label: 'Category', value: project.category },
                { label: 'Role', value: project.role ?? '—' },
                { label: 'Year', value: project.duration ?? String(project.year) },
              ].map(({ label, value }) => (
                <div key={label} className="px-6 py-5 first:pl-0 last:pr-0">
                  <dt className="font-mono text-2xs tracking-[0.2em] uppercase text-muted mb-1">
                    {label}
                  </dt>
                  <dd className="text-sm text-fg font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.section>

        {/* ── Overview ─────────────────────────────── */}
        <section className="max-w-8xl mx-auto px-6 lg:px-12 py-20 md:py-28">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-2">
              <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted">
                Overview
              </span>
            </div>
            <p
              className="md:col-span-8 text-fg leading-relaxed"
              style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)' }}
            >
              {project.description}
            </p>
          </div>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-2xs tracking-[0.15em] uppercase border border-border text-muted px-3 py-1.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </section>

        {/* ── Content Blocks ───────────────────────── */}
        {project.blocks && project.blocks.length > 0 && (
          <section className="max-w-8xl mx-auto pb-24 md:pb-32 overflow-hidden">
            <ProjectBlocks blocks={project.blocks} />
          </section>
        )}

        {/* ── Next / Prev Navigation ───────────────── */}
        <nav
          className="border-t border-border"
          aria-label="Project navigation"
        >
          <div className="max-w-8xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-2 divide-x divide-border">
              {/* Prev */}
              <div className="py-8 pr-8">
                {prevProject ? (
                  <Link
                    href={`/work/${prevProject.slug}`}
                    className="group block"
                  >
                    <span className="font-mono text-2xs tracking-[0.2em] uppercase text-muted mb-2 block">
                      ← Previous
                    </span>
                    <span
                      className="font-display font-semibold text-fg group-hover:text-accent transition-colors duration-200 leading-tight block"
                      style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2rem)' }}
                    >
                      {prevProject.title}
                    </span>
                  </Link>
                ) : (
                  <Link href="/#work" className="group block">
                    <span className="font-mono text-2xs tracking-[0.2em] uppercase text-muted mb-2 block">
                      ←
                    </span>
                    <span className="font-display font-semibold text-fg group-hover:text-accent transition-colors duration-200"
                      style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2rem)' }}>
                      All Work
                    </span>
                  </Link>
                )}
              </div>

              {/* Next */}
              <div className="py-8 pl-8 text-right">
                {nextProject ? (
                  <Link
                    href={`/work/${nextProject.slug}`}
                    className="group block"
                  >
                    <span className="font-mono text-2xs tracking-[0.2em] uppercase text-muted mb-2 block">
                      Next →
                    </span>
                    <span
                      className="font-display font-semibold text-fg group-hover:text-accent transition-colors duration-200 leading-tight block"
                      style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2rem)' }}
                    >
                      {nextProject.title}
                    </span>
                  </Link>
                ) : (
                  <Link href="/#work" className="group block">
                    <span className="font-mono text-2xs tracking-[0.2em] uppercase text-muted mb-2 block">
                      →
                    </span>
                    <span className="font-display font-semibold text-fg group-hover:text-accent transition-colors duration-200"
                      style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2rem)' }}>
                      All Work
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
      </main>

      <Footer studio={studio} />
    </>
  )
}
