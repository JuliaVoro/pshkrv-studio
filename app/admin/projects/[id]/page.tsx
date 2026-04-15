import AdminLayout from '@/components/admin/AdminLayout'
import ProjectForm from '@/components/admin/ProjectForm'
import { getProjectById } from '@/lib/data/projects'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const project = getProjectById(params.id)
  if (!project) notFound()

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">Edit Project</h1>
        <p className="text-muted text-sm mt-1">{project.title}</p>
      </div>
      <ProjectForm initial={project} isEdit />
    </AdminLayout>
  )
}
