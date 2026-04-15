import AdminLayout from '@/components/admin/AdminLayout'
import { getProjects } from '@/lib/data/projects'
import Link from 'next/link'
import DeleteProjectButton from './DeleteProjectButton'

export const dynamic = 'force-dynamic'

export default function AdminProjectsPage() {
  const projects = getProjects().sort((a, b) => a.order - b.order)

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-semibold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="font-mono text-xs tracking-[0.15em] uppercase bg-fg text-bg px-5 py-2.5 hover:bg-muted transition-colors"
        >
          + New Project
        </Link>
      </div>

      <div className="space-y-2">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between gap-4 border border-border rounded px-4 py-3 hover:border-muted transition-colors"
          >
            <div className="flex items-center gap-4 min-w-0">
              <span className="font-mono text-xs text-muted shrink-0">
                {String(project.order).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{project.title}</p>
                <p className="text-xs text-muted">{project.category} · {project.year}</p>
              </div>
              {project.featured && (
                <span className="font-mono text-2xs tracking-wider uppercase bg-fg text-bg px-2 py-0.5 shrink-0">
                  Featured
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href={`/admin/projects/${project.id}`}
                className="font-mono text-xs text-muted hover:text-fg transition-colors"
              >
                Edit
              </Link>
              <DeleteProjectButton id={project.id} title={project.title} />
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <p className="text-muted text-sm py-8 text-center">No projects yet.</p>
        )}
      </div>
    </AdminLayout>
  )
}
