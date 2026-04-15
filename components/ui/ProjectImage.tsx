import Image from 'next/image'
import type { ProjectImage as ProjectImageType } from '@/types'

interface Props {
  image: ProjectImageType
  className?: string
  sizes?: string
  priority?: boolean
}

export default function ProjectImage({ image, className = '', sizes, priority }: Props) {
  const isPlaceholder = !image.src

  if (isPlaceholder) {
    return (
      <div
        className={`w-full h-full ${className}`}
        style={{ backgroundColor: image.placeholder ?? '#E4E4E7' }}
        role="img"
        aria-label={image.alt}
      />
    )
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        className="object-cover"
        sizes={sizes ?? '(max-width: 768px) 100vw, 80vw'}
        priority={priority}
      />
    </div>
  )
}
