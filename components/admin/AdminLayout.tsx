'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
  { label: 'Projects', href: '/admin/projects' },
  { label: 'Services', href: '/admin/services' },
  { label: 'Studio Info', href: '/admin/studio' },
  { label: 'Settings', href: '/admin/settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-bg text-fg font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-56 border-r border-border flex flex-col z-10">
        <div className="p-6 border-b border-border">
          <Link href="/" className="font-mono text-sm tracking-[0.2em] uppercase font-semibold">
            PSHKRV
          </Link>
          <p className="font-mono text-2xs text-muted mt-1 tracking-wider uppercase">Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded text-sm transition-colors duration-150 ${
                pathname.startsWith(item.href)
                  ? 'bg-fg text-bg font-medium'
                  : 'text-muted hover:text-fg hover:bg-border/50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Link
            href="/"
            className="block px-3 py-2 text-xs text-muted hover:text-fg transition-colors duration-150 mb-1"
          >
            ← View Site
          </Link>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2 text-xs text-muted hover:text-fg transition-colors duration-150"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-56 min-h-screen">
        <div className="max-w-4xl mx-auto px-8 py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
