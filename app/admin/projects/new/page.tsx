import AdminLayout from '@/components/admin/AdminLayout'
import ProjectForm from '@/components/admin/ProjectForm'

export default function NewProjectPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold">New Project</h1>
      </div>
      <ProjectForm />
    </AdminLayout>
  )
}
