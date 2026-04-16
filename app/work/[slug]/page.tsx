import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProjectBySlug, getProjects } from '@/lib/data/projects'
import { getStudioInfo } from '@/lib/data/studio'
import ProjectPageClient from './ProjectPageClient'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug)
  if (!project) return {}
  return {
    title: `${project.title} — PSHKRV Studio`,
    description: project.description,
  }
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug)
  if (!project) notFound()

  const allProjects = (await getProjects()).filter((p) => p.featured).sort((a, b) => a.order - b.order)
  const currentIdx = allProjects.findIndex((p) => p.slug === params.slug)
  const prevProject = currentIdx > 0 ? allProjects[currentIdx - 1] : null
  const nextProject = currentIdx < allProjects.length - 1 ? allProjects[currentIdx + 1] : null

  const { headerStyle } = getStudioInfo()

  return (
    <ProjectPageClient
      project={project}
      prevProject={prevProject}
      nextProject={nextProject}
      headerStyle={headerStyle}
    />
  )
}
