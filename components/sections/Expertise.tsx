'use client'

import type { StudioInfo } from '@/types'

export default function Expertise({ studio }: { studio: StudioInfo }) {
  // Double the list for seamless loop
  const items = [...studio.expertise, ...studio.expertise]

  return (
    <section className="py-16 border-t border-border overflow-hidden select-none">
      <div className="flex items-center">
        <div className="flex animate-marquee whitespace-nowrap">
          {items.map((tag, i) => (
            <span key={i} className="flex items-center">
              <span className="font-display font-semibold text-fg/90 px-8"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)' }}
              >
                {tag}
              </span>
              <span className="text-accent font-mono text-xl shrink-0">·</span>
            </span>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div className="flex animate-marquee whitespace-nowrap" aria-hidden="true">
          {items.map((tag, i) => (
            <span key={i} className="flex items-center">
              <span
                className="font-display font-semibold text-fg/90 px-8"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 3.5rem)' }}
              >
                {tag}
              </span>
              <span className="text-accent font-mono text-xl shrink-0">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
