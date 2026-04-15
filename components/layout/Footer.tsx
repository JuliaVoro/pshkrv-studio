import type { StudioInfo } from '@/types'

export default function Footer({ studio }: { studio: StudioInfo }) {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="max-w-8xl mx-auto px-6 lg:px-12 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <span className="font-mono text-xs tracking-[0.2em] uppercase text-muted">
          © {new Date().getFullYear()} PSHKRV Studio — Milan
        </span>
        <div className="flex items-center gap-6">
          <a
            href={`mailto:${studio.email}`}
            className="font-mono text-xs tracking-[0.15em] uppercase text-muted hover:text-fg transition-colors duration-200"
          >
            {studio.email}
          </a>
          <a
            href={studio.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs tracking-[0.15em] uppercase text-muted hover:text-fg transition-colors duration-200"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  )
}
