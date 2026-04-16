'use client'

import { useEffect, useRef } from 'react'

export default function CursorFollower() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only activate on devices with a precise pointer (mouse), not touch/tablet
    if (!window.matchMedia('(pointer: fine)').matches) return

    const el = cursorRef.current
    if (!el) return

    el.style.display = 'block'

    let x = 0, y = 0
    let raf: number

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    let cx = 0, cy = 0

    const tick = () => {
      cx = lerp(cx, x, 0.12)
      cy = lerp(cy, y, 0.12)
      if (el) {
        el.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(tick)
    }

    const onEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor="expand"]')) {
        el.classList.add('expanded')
      }
    }

    const onLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, [data-cursor="expand"]')) {
        el.classList.remove('expanded')
      }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      id="cursor-follower"
      className="hidden"
      style={{ display: 'none' }}
      aria-hidden="true"
    />
  )
}
