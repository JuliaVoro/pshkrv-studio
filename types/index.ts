export type ProjectBlockType =
  | 'image-full'
  | 'image-2col'
  | 'image-3col'
  | 'text'
  | 'palette'
  | 'quote'
  | 'color-full'
  | 'video'

export interface ColorSwatch {
  hex: string
  name: string
  dark?: boolean
}

export interface ProjectImage {
  src: string
  alt: string
  caption?: string
  /** CSS bg color to show when no real image */
  placeholder?: string
}

export interface ProjectBlock {
  type: ProjectBlockType
  // image-full
  image?: ProjectImage
  // image-2col / image-3col
  images?: ProjectImage[]
  // text block
  heading?: string
  body?: string
  // palette
  colors?: ColorSwatch[]
  // quote
  quote?: string
  attribution?: string
  // color-full: a full-bleed color wash with optional large type
  bgColor?: string
  textColor?: string
  label?: string
  // video block
  videoSrc?: string       // uploaded file path or YouTube/Vimeo embed URL
  videoPoster?: string    // thumbnail shown before play
  videoCaption?: string
  /** true = autoplay + loop + muted, no controls (ambient/reel mode) */
  videoAutoplay?: boolean
}

export interface Project {
  id: string
  title: string
  slug: string
  category: 'Brand Identity' | 'Art Direction' | 'Digital' | 'Print'
  year: number
  client: string
  description: string
  /** Short one-liner for cards */
  tagline?: string
  tags: string[]
  coverImage: string
  /** Separate thumbnail for home page grid (falls back to coverImage if not set) */
  previewImage?: string
  /** Hex bg color for cover placeholder */
  coverColor?: string
  images: string[]
  featured: boolean
  order: number
  // Project page fields
  role?: string
  duration?: string
  blocks?: ProjectBlock[]
}

export interface Service {
  id: string
  title: string
  description: string
  deliverables: string[]
  order: number
}

export interface StudioInfo {
  tagline: string
  about: string[]
  approach: { title: string; body: string }[]
  expertise: string[]
  clients: string[]
  collaborators: string[]
  email: string
  instagram?: string
  linkedin: string
  headerStyle?: 'classic' | 'animated'
  heroStyle?: 'classic' | 'animated'
}

export interface ContactFormPayload {
  name: string
  email: string
  company?: string
  message: string
}

export interface SessionPayload {
  sub: string
  role: 'admin'
  iat?: number
  exp?: number
}
