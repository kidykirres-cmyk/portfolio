import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { fetchProject } from '../api'
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaCalendar, FaTag } from 'react-icons/fa'
import { motion } from 'framer-motion'

export default function ProjectDetail() {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchProject(id)
      .then(p => setProject(p))
      .catch(e => setError(e.response?.data?.message || e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="container py-28">
        <div className="card p-8 animate-pulse">
          <div className="h-64 skeleton rounded-xl mb-6" />
          <div className="h-8 skeleton rounded w-1/2 mb-3" />
          <div className="h-4 skeleton rounded mb-2" />
          <div className="h-4 skeleton rounded w-3/4" />
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="container py-28 text-center">
        <p className="text-red-600">Failed to load project: {error || 'Not found'}</p>
        <Link to="/" className="btn-primary mt-4 inline-flex">Back to Home</Link>
      </div>
    )
  }

  const tech = Array.isArray(project.tech_stack) ? project.tech_stack : []

  return (
    <>
      <Helmet>
        <title>{project.title} — Gokul K Portfolio</title>
        <meta name="description" content={project.short_description || project.description?.slice(0, 160)} />
        <meta property="og:title" content={project.title} />
        <meta property="og:description" content={project.short_description || project.description?.slice(0, 160)} />
        <meta property="og:image" content={project.image_url || project.image} />
      </Helmet>

      <div className="container py-10 pt-[84px]">
        <Link to="/#projects" className="inline-flex items-center gap-2 text-sm font-medium hover:text-indigo-600">
          <FaArrowLeft /> Back to Projects
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <img
              src={project.image_url || project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=700&fit=crop'}
              alt={project.title}
              className="w-full h-[380px] object-cover rounded-2xl border border-slate-200 dark:border-white/10"
            />
            <div className="flex flex-wrap gap-2 mt-4">
              {tech.map(t => (
                <span key={t} className="px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 text-xs font-medium">{t}</span>
              ))}
            </div>
            {Array.isArray(project.tags) && project.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {project.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-xs"><FaTag className="text-slate-400" />{tag}</span>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-5">
            <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20">
              {project.category || 'Project'}
            </span>
            <h1 className="font-display text-[30px] lg:text-[36px] font-bold leading-tight mt-3">{project.title}</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-4 leading-7">{project.description}</p>

            {project.short_description && (
              <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Summary</div>
                <p className="text-sm leading-6">{project.short_description}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-6">
              {project.live_demo_link && (
                <a href={project.live_demo_link} target="_blank" rel="noreferrer" className="btn-primary">
                  <FaExternalLinkAlt /> Live Demo
                </a>
              )}
              {project.github_link && (
                <a href={project.github_link} target="_blank" rel="noreferrer" className="btn-outline">
                  <FaGithub /> GitHub
                </a>
              )}
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
              <FaCalendar /> Created: {new Date(project.created_at).toLocaleDateString()} • Updated: {new Date(project.updated_at).toLocaleDateString()}
            </div>

            <div className="mt-8 card p-4">
              <div className="text-sm font-semibold">Project Info</div>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-slate-500">Slug</dt><dd className="font-mono text-xs">{project.slug}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Featured</dt><dd>{project.is_featured ? 'Yes' : 'No'}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">Category</dt><dd>{project.category}</dd></div>
              </dl>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
