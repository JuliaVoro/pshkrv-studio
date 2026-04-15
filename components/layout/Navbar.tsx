'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'Studio', href: '#studio' },
  { label: 'Contact', href: '#contact' },
]

interface NavbarProps {
  /** When the hero section below the navbar has a dark background, set true
   *  so text starts light before the user scrolls past it. */
  darkHero?: boolean
}

export default function Navbar({ darkHero = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Before scrolling: respect hero darkness. After scrolling: always light bg so use dark text.
  const useLightText = darkHero && !scrolled
  const logoClass    = useLightText ? 'text-dark-fg hover:text-accent' : 'text-fg hover:text-accent'
  const linkClass    = useLightText ? 'text-dark-muted hover:text-dark-fg' : 'text-muted hover:text-fg'
  const lineColor    = useLightText ? 'bg-dark-fg' : 'bg-fg'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-bg/95 backdrop-blur-sm border-b border-border' : ''
        }`}
      >
        <div className="max-w-8xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className={`font-mono text-sm tracking-[0.2em] uppercase font-semibold transition-colors duration-300 ${logoClass}`}
          >
            PSHKRV
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`font-mono text-xs tracking-[0.15em] uppercase transition-colors duration-300 ${linkClass}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 8 : 0 }}
              className={`block w-6 h-px origin-center transition-colors duration-300 ${lineColor}`}
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1 }}
              className={`block w-6 h-px transition-colors duration-300 ${lineColor}`}
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -8 : 0 }}
              className={`block w-6 h-px origin-center transition-colors duration-300 ${lineColor}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-bg flex flex-col items-center justify-center gap-10"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-display text-4xl text-fg"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
