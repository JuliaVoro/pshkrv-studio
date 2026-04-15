'use client'

import { motion } from 'framer-motion'
import { heroReveal, staggerContainer } from '@/lib/motion'

interface AnimatedTextProps {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
}

export default function AnimatedText({
  text,
  className,
  wordClassName,
  delay = 0,
}: AnimatedTextProps) {
  const words = text.split(' ')

  const container = {
    ...staggerContainer,
    visible: {
      ...staggerContainer.visible,
      transition: {
        staggerChildren: 0.07,
        delayChildren: delay,
      },
    },
  }

  return (
    <motion.div
      className={`flex flex-wrap ${className ?? ''}`}
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {words.map((word, i) => (
        <span key={i} className="line-mask mr-[0.25em] last:mr-0">
          <motion.span
            className={`block ${wordClassName ?? ''}`}
            variants={heroReveal}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.div>
  )
}
