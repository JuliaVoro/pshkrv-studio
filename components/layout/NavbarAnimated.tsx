'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import Link from 'next/link'

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Studio', href: '#studio' },
  { label: 'Contact', href: '#contact' },
]

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function useScramble(text: string) {
  const [display, setDisplay] = useState(text)
  const rafRef = useRef<number | null>(null)
  const frameRef = useRef(0)

  const start = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    frameRef.current = 0
    const run = () => {
      frameRef.current++
      setDisplay(
        text
          .split('')
          .map((char, i) =>
            i < Math.floor(frameRef.current / 1.5)
              ? char
              : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join('')
      )
      if (frameRef.current < text.length * 1.5 + 8) {
        rafRef.current = requestAnimationFrame(run)
      } else {
        setDisplay(text)
      }
    }
    rafRef.current = requestAnimationFrame(run)
  }

  const stop = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setDisplay(text)
  }

  useEffect(
    () => () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    },
    [text]
  )

  return { display, start, stop }
}

interface NavbarAnimatedProps {
  /** Pass true when the hero section directly below the navbar has a dark background,
   *  so that text starts light before the user scrolls. */
  darkHero?: boolean
}

export default function NavbarAnimated({ darkHero = false }: NavbarAnimatedProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  const logo = useScramble('PSHKRV')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  }

  const ease = [0.16, 1, 0.3, 1] as [number, number, number, number]

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease },
    },
  }

  // When hero is dark, navbar text must be light even before scrolling
  const isLight = darkHero || scrolled
  const invertedText  = isLight ? 'text-bg'    : 'text-fg'
  const invertedMuted = isLight ? 'text-bg/50' : 'text-muted'
  const lineColor     = isLight ? 'bg-bg'      : 'bg-fg'

  const headerBg = scrolled
    ? 'bg-fg/[0.97] backdrop-blur-md border-b border-fg/5 shadow-[0_1px_0_0_rgba(0,0,0,0.06)]'
    : ''

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-accent origin-left pointer-events-none"
        style={{ scaleX }}
      />

      <motion.header
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-[2px] left-0 right-0 z-50 transition-all duration-500 ${headerBg}`}
      >
        <div className="max-w-8xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo with scramble effect */}
          <motion.div variants={itemVariants}>
            <Link
              href="/"
              className={`font-mono text-sm tracking-[0.2em] uppercase font-semibold transition-colors duration-200 hover:text-accent ${invertedText}`}
              onMouseEnter={logo.start}
              onMouseLeave={logo.stop}
            >
              {logo.display}
            </Link>
          </motion.div>

          {/* Desktop nav with text-flip hover */}
          <motion.nav variants={containerVariants} className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.div key={link.label} variants={itemVariants}>
                <a
                  href={link.href}
                  className="relative overflow-hidden group block"
                  style={{ height: '0.75rem' }}
                >
                  {/* Default layer — slides up on hover */}
                  <span
                    className={`block font-mono text-xs tracking-[0.15em] uppercase leading-none
                      transition-transform duration-[220ms] ease-expo-out
                      group-hover:-translate-y-full ${invertedMuted}`}
                  >
                    {link.label}
                  </span>
                  {/* Reveal layer — slides in from below */}
                  <span
                    className={`absolute inset-0 font-mono text-xs tracking-[0.15em] uppercase leading-none
                      translate-y-full transition-transform duration-[220ms] ease-expo-out
                      group-hover:translate-y-0 ${invertedText}`}
                  >
                    {link.label}
                  </span>
                </a>
              </motion.div>
            ))}
          </motion.nav>

          {/* Mobile toggle */}
          <motion.button
            variants={itemVariants}
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
              className={`block w-6 h-px origin-center transition-colors duration-500 ${lineColor}`}
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1 }}
              className={`block w-6 h-px transition-colors duration-500 ${lineColor}`}
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
              className={`block w-6 h-px origin-center transition-colors duration-500 ${lineColor}`}
            />
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile menu — full-screen wipe overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-fg flex flex-col"
          >
            {/* Mobile header bar */}
            <div className="flex items-center justify-between px-6 h-[calc(2px+4rem)] shrink-0">
              <span className="font-mono text-sm tracking-[0.2em] uppercase font-semibold text-bg">
                PSHKRV
              </span>
              <button
                onClick={() => setMenuOpen(false)}
                className="flex flex-col gap-1.5 p-2"
                aria-label="Close menu"
              >
                <motion.span
                  initial={{ rotate: 0, y: 0 }}
                  animate={{ rotate: 45, y: 8 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="block w-6 h-px bg-bg origin-center"
                />
                <motion.span
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block w-6 h-px bg-bg"
                />
                <motion.span
                  initial={{ rotate: 0, y: 0 }}
                  animate={{ rotate: -45, y: -8 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="block w-6 h-px bg-bg origin-center"
                />
              </button>
            </div>

            {/* Nav links — staggered entrance */}
            <div className="flex-1 flex flex-col justify-center px-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -32 }}
                  transition={{
                    delay: i * 0.08 + 0.15,
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="border-b border-bg/10 py-5"
                >
                  <a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-5 group"
                  >
                    <span className="font-mono text-xs text-bg/30 tracking-[0.2em] w-6 shrink-0">
                      0{i + 1}
                    </span>
                    <span className="font-display text-5xl text-bg group-hover:text-accent transition-colors duration-200">
                      {link.label}
                    </span>
                  </a>
                </motion.div>
              ))}
            </div>

            {/* Footer line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="px-8 pb-10 shrink-0"
            >
              <p className="font-mono text-xs text-bg/30 tracking-[0.2em] uppercase">
                Art Direction & Digital Design — Milan
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
