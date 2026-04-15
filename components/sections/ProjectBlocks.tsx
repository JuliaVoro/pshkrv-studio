'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import ProjectImage from '@/components/ui/ProjectImage'
import type { ProjectBlock } from '@/types'

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
      transition={{ duration: 0.7, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Full-bleed blocks (no internal padding — images and color washes go edge-to-edge)
// Padded blocks (px-6 lg:px-12 to stay within the reading column)

function ImageFull({ block }: { block: ProjectBlock }) {
  return (
    <Reveal className="w-full">
      <figure>
        <div className="w-full aspect-[16/9] overflow-hidden">
          {block.image && <ProjectImage image={block.image} className="w-full h-full" />}
        </div>
        {block.image?.caption && (
          <figcaption className="mt-3 px-6 lg:px-12 font-mono text-xs text-muted tracking-[0.1em]">
            {block.image.caption}
          </figcaption>
        )}
      </figure>
    </Reveal>
  )
}

function Image2Col({ block }: { block: ProjectBlock }) {
  const images = block.images ?? []
  return (
    <div className="px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
      {images.map((img, i) => (
        <Reveal key={i} delay={i * 0.1}>
          <figure>
            <div className="w-full aspect-[4/3] overflow-hidden">
              <ProjectImage image={img} className="w-full h-full" />
            </div>
            {img.caption && (
              <figcaption className="mt-2 font-mono text-xs text-muted">{img.caption}</figcaption>
            )}
          </figure>
        </Reveal>
      ))}
    </div>
  )
}

function Image3Col({ block }: { block: ProjectBlock }) {
  const images = block.images ?? []
  return (
    <div className="px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
      {images.map((img, i) => (
        <Reveal key={i} delay={i * 0.08}>
          <figure>
            <div className="w-full aspect-[4/3] overflow-hidden">
              <ProjectImage image={img} className="w-full h-full" />
            </div>
            {img.caption && (
              <figcaption className="mt-2 font-mono text-xs text-muted">{img.caption}</figcaption>
            )}
          </figure>
        </Reveal>
      ))}
    </div>
  )
}

function TextBlock({ block }: { block: ProjectBlock }) {
  return (
    <div className="px-6 lg:px-12">
      <Reveal>
        <div className="grid md:grid-cols-12 gap-6 max-w-5xl">
          {block.heading && (
            <h2
              className="font-display font-semibold text-fg md:col-span-4 leading-tight"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
            >
              {block.heading}
            </h2>
          )}
          {block.body && (
            <div className="md:col-span-8 space-y-4">
              {block.body.split('\n\n').map((para, i) => (
                <p key={i} className="text-muted leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </div>
  )
}

function PaletteBlock({ block }: { block: ProjectBlock }) {
  const colors = block.colors ?? []
  return (
    <div className="px-6 lg:px-12">
      <Reveal className="w-full">
        <div className="space-y-4">
          <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted">Colour Palette</span>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-2 md:gap-3">
            {colors.map((color) => (
              <div key={color.hex} className="group">
                <div
                  className="w-full aspect-square rounded-sm mb-2"
                  style={{ backgroundColor: color.hex }}
                />
                {color.name && (
                  <p className={`font-mono text-2xs tracking-wider truncate ${color.dark ? 'text-fg' : 'text-muted'}`}>
                    {color.name}
                  </p>
                )}
                <p className="font-mono text-2xs text-muted/60">{color.hex}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}

function QuoteBlock({ block }: { block: ProjectBlock }) {
  return (
    <div className="px-6 lg:px-12">
      <Reveal className="border-l-2 border-fg pl-8 md:pl-12 py-2 max-w-2xl">
        <blockquote>
          <p
            className="font-display font-semibold text-fg leading-tight mb-4"
            style={{ fontSize: 'clamp(1.25rem, 2.5vw, 2rem)' }}
          >
            &ldquo;{block.quote}&rdquo;
          </p>
          {block.attribution && (
            <cite className="font-mono text-xs tracking-[0.15em] uppercase text-muted not-italic">
              — {block.attribution}
            </cite>
          )}
        </blockquote>
      </Reveal>
    </div>
  )
}

function VideoBlock({ block }: { block: ProjectBlock }) {
  if (!block.videoSrc) return null

  const src = block.videoSrc
  const isEmbed = src.includes('youtube.com') || src.includes('youtu.be') || src.includes('vimeo.com')

  // Normalise YouTube watch URLs → embed URLs
  const embedSrc = src.includes('watch?v=')
    ? src.replace('watch?v=', 'embed/').replace('&', '?')
    : src.includes('youtu.be/')
    ? src.replace('youtu.be/', 'youtube.com/embed/')
    : src

  return (
    <Reveal className="w-full">
      <figure>
        {isEmbed ? (
          <div className="w-full aspect-video">
            <iframe
              src={embedSrc}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={block.videoCaption ?? 'Project video'}
            />
          </div>
        ) : block.videoAutoplay ? (
          // Ambient / reel mode — autoplay, loop, muted, no controls
          <div className="w-full aspect-video overflow-hidden">
            <video
              src={src}
              poster={block.videoPoster}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          // Standard player with controls
          <div className="w-full aspect-video overflow-hidden bg-fg">
            <video
              src={src}
              poster={block.videoPoster}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            />
          </div>
        )}
        {block.videoCaption && (
          <figcaption className="mt-3 px-6 lg:px-12 font-mono text-xs text-muted tracking-[0.1em]">
            {block.videoCaption}
          </figcaption>
        )}
      </figure>
    </Reveal>
  )
}

function ColorFull({ block }: { block: ProjectBlock }) {
  return (
    <Reveal className="w-full">
      <div
        className="w-full flex items-center justify-center"
        style={{ backgroundColor: block.bgColor ?? '#09090B', minHeight: '50vh' }}
      >
        {block.label && (
          <span
            className="font-display font-bold tracking-[-0.04em] select-none"
            style={{
              color: block.textColor ?? '#FAFAFA',
              fontSize: 'clamp(5rem, 18vw, 16rem)',
              lineHeight: 0.85,
            }}
          >
            {block.label}
          </span>
        )}
      </div>
    </Reveal>
  )
}

export default function ProjectBlocks({ blocks }: { blocks: ProjectBlock[] }) {
  return (
    <div className="space-y-16 md:space-y-20">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'image-full':   return <ImageFull key={i} block={block} />
          case 'image-2col':   return <Image2Col key={i} block={block} />
          case 'image-3col':   return <Image3Col key={i} block={block} />
          case 'text':         return <TextBlock key={i} block={block} />
          case 'palette':      return <PaletteBlock key={i} block={block} />
          case 'quote':        return <QuoteBlock key={i} block={block} />
          case 'color-full':   return <ColorFull key={i} block={block} />
          case 'video':        return <VideoBlock key={i} block={block} />
          default:             return null
        }
      })}
    </div>
  )
}
