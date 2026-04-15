'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { scrollReveal } from '@/lib/motion'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  variants?: typeof scrollReveal
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  variants = scrollReveal,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        ...variants,
        visible: {
          ...variants.visible,
          transition: {
            ...(typeof variants.visible === 'object' && 'transition' in variants.visible
              ? (variants.visible as { transition?: object }).transition
              : {}),
            delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
