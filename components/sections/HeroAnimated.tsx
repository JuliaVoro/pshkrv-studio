'use client'

import { useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Pt3 { x: number; y: number; z: number }

// ─── Fibonacci sphere — even dot distribution ────────────────────────────────

function generateSphere(count: number): Pt3[] {
  const pts: Pt3[] = []
  const golden = Math.PI * (Math.sqrt(5) - 1)
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const t = golden * i
    pts.push({ x: Math.cos(t) * r, y, z: Math.sin(t) * r })
  }
  return pts
}

// ─── Constants ───────────────────────────────────────────────────────────────

const LINES = ['ART', 'DIRECTION', '& DESIGN'] as const
const DOT_COUNT = 520
const FOV = 2.8
const REPEL_RADIUS = 120   // css px
const REPEL_STRENGTH = 38
const ROT_SPEED = 0.003

// ─── Component ───────────────────────────────────────────────────────────────

export default function HeroAnimated() {
  const prefersReduced = useReducedMotion() ?? false

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number }>({ x: -9999, y: -9999 })
  const rotRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const spherePts = useMemo(() => generateSphere(DOT_COUNT), [])

  // Scroll parallax + fade-out
  const { scrollY } = useScroll()
  const scrollOffset  = useTransform(scrollY, [0, 600], prefersReduced ? [0, 0] : [0, -90])
  const scrollOpacity = useTransform(scrollY, [0, 340], [1, 0])

  // ── Canvas render loop ──────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // DPR-aware sizing — setTransform is safe to call multiple times
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const render = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      const isMobile = w < 768

      // ── Sphere geometry ──────────────────────────────────────────────────
      // Desktop: large sphere on the right-center, partially off-frame
      // Mobile:  sphere sits behind text like a soft halo — centered, full-width
      const cx = isMobile ? w * 0.52 : w * 0.70
      const cy = isMobile ? h * 0.40 : h * 0.47
      const r  = isMobile ? w * 0.52 : Math.min(w, h) * 0.45

      // On mobile the sphere is purely atmospheric — lower opacity
      const alphaMult = isMobile ? 0.38 : 1.0

      if (!prefersReduced) rotRef.current += ROT_SPEED

      ctx.clearRect(0, 0, w, h)

      // Soft gold glow behind the sphere
      const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.4)
      glow.addColorStop(0, `rgba(212,168,83,${0.06 * alphaMult})`)
      glow.addColorStop(1, 'rgba(212,168,83,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2)
      ctx.fill()

      // Rotation + slight X-axis tilt so sphere feels 3-D
      const cosR = Math.cos(rotRef.current)
      const sinR = Math.sin(rotRef.current)
      const TILT = 0.22
      const cosTilt = Math.cos(TILT)
      const sinTilt = Math.sin(TILT)

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      // Project all dots to screen space
      const projected: { sx: number; sy: number; depth: number; size: number; lit: boolean }[] = []

      for (const pt of spherePts) {
        // Rotate around Y
        const rx =  pt.x * cosR - pt.z * sinR
        const rz =  pt.x * sinR + pt.z * cosR

        // X-axis tilt
        const ty =  pt.y * cosTilt - rz * sinTilt
        const tz =  pt.y * sinTilt + rz * cosTilt

        // Perspective divide
        const scale = FOV / (FOV + tz)
        let sx = cx + rx * r * scale
        let sy = cy + ty * r * scale

        // Cursor repel
        const dx = sx - mx
        const dy = sy - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        let lit = false
        if (dist < REPEL_RADIUS && dist > 0.5) {
          const force = Math.pow(1 - dist / REPEL_RADIUS, 2) * REPEL_STRENGTH
          sx += (dx / dist) * force
          sy += (dy / dist) * force
          lit = true
        }

        const depth = (tz + 1) / 2  // 0 = back, 1 = front
        const size  = Math.max(0.5, 2.2 * scale)

        projected.push({ sx, sy, depth, size, lit })
      }

      // Painter's algorithm — back to front
      projected.sort((a, b) => a.depth - b.depth)

      // Draw
      for (const { sx, sy, depth, size, lit } of projected) {
        if (depth < 0.08) continue

        const rawAlpha = (depth * 0.65 + (lit ? 0.44 : 0)) * alphaMult
        const alpha    = Math.min(1, rawAlpha)
        const dotSize  = size * (lit ? 2.0 : 1)

        if (depth > 0.55 || lit) {
          // Front-facing / cursor-lit → gold
          ctx.globalAlpha = alpha
          ctx.fillStyle   = '#D4A853'
        } else {
          // Mid / back → faint light
          ctx.globalAlpha = alpha * 0.28
          ctx.fillStyle   = '#F4F4F5'
        }

        ctx.beginPath()
        ctx.arc(sx, sy, dotSize, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      rafRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [spherePts, prefersReduced])

  // ── Mouse tracking relative to section ─────────────────────────────────

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 }
  }, [])

  // ── Char stagger counter — reset each synchronous render ───────────────

  let gIdx = 0

  return (
    <section
      className="relative min-h-dvh bg-fg flex flex-col overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      aria-label="Hero — Art Direction & Design"
    >
      {/* Noise grain for depth */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none select-none opacity-[0.045]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="hn2">
          <feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hn2)" />
      </svg>

      {/* Canvas sphere — sits below everything */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Gold top sweep */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: prefersReduced ? 0 : 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
        className="absolute top-0 left-0 right-0 h-[1px] bg-accent origin-left pointer-events-none"
        aria-hidden="true"
      />

      <motion.div
        style={{ y: scrollOffset, opacity: scrollOpacity }}
        className="relative z-10 flex flex-col flex-1
                   max-w-8xl mx-auto px-6 lg:px-12 w-full pt-24 pb-16
                   justify-center md:justify-between"
      >
        {/* ── Top: location + heading + tagline grouped ───────────────── */}
        <div>
          {/* Location tag */}
          <motion.div
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: prefersReduced ? 0 : 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 mb-8"
          >
            <span className="block w-6 h-px bg-dark-muted" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase text-dark-muted">
              Milan — IT · Est. 2019
            </span>
          </motion.div>

          {/* Heading — bigger, no max-w so nothing clips horizontally */}
          <div>
            {LINES.map((line, lineIdx) => {
              const chars = Array.from(line)
              return (
                <div key={lineIdx} className="overflow-hidden leading-none">
                  <div
                    className="font-display font-bold tracking-[-0.03em] flex"
                    style={{ fontSize: 'clamp(3rem, 12vw, 15rem)', lineHeight: 0.88 }}
                  >
                    {chars.map((char, charIdx) => {
                      const delay = prefersReduced ? 0 : 0.16 + gIdx++ * 0.027
                      return (
                        <motion.span
                          key={`${lineIdx}-${charIdx}`}
                          initial={{ y: '110%' }}
                          animate={{ y: '0%' }}
                          transition={{
                            duration: prefersReduced ? 0 : 0.72,
                            ease: [0.16, 1, 0.3, 1],
                            delay,
                          }}
                          className={`inline-block text-dark-fg ${char === ' ' ? 'w-[0.28em]' : ''}`}
                        >
                          {char === ' ' ? '\u00A0' : char}
                        </motion.span>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tagline — sits directly under the heading */}
          <motion.p
            initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: prefersReduced ? 0 : 1.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-base text-dark-muted max-w-sm leading-relaxed mt-6"
          >
            A design practice working at the intersection of art direction,
            brand identity, and digital experience.
          </motion.p>
        </div>

        {/* ── CTA — follows content on mobile, anchors to bottom on desktop ── */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReduced ? 0 : 1.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12"
        >
          <a
            href="#work"
            className="group relative inline-flex items-center gap-3 font-mono text-xs tracking-[0.15em]
                       uppercase text-dark-fg border border-dark-border px-6 py-3 overflow-hidden
                       transition-colors duration-300 hover:border-accent"
          >
            <span
              className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0
                         transition-transform duration-300 ease-expo-out"
              aria-hidden="true"
            />
            <span className="relative z-10 transition-colors duration-300">View Work</span>
            <span className="relative z-10 inline-block transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: prefersReduced ? 0 : 1.5, ease: [0.16, 1, 0.3, 1], delay: prefersReduced ? 0 : 1.28 }}
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-dark-border origin-left pointer-events-none"
        aria-hidden="true"
      />
    </section>
  )
}
