import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { Link } from 'react-router-dom'

export default function ProjectCard({ project, index = 0 }) {
  const tech = Array.isArray(project.tech_stack) ? project.tech_stack : []

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      whileHover={{ y: -4 }}
      className="card group flex flex-col overflow-hidden"
    >
      <Link to={`/projects/${project.slug || project.id}`} className="relative block overflow-hidden">
        <img
          src={project.image_url || project.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop'}
          alt={project.title}
          className="w-full h-[200px] object-cover group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-black/60 backdrop-blur border border-white/20">
          {project.category || 'Project'}
        </span>
        {project.is_featured && <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white">Featured</span>}
        <span className="absolute bottom-3 right-3 hidden group-hover:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#111117] text-xs font-semibold shadow">
          View detail <FaExternalLinkAlt className="text-[11px]" />
        </span>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <Link to={`/projects/${project.slug || project.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
          <h3 className="font-semibold leading-snug line-clamp-2">{project.title}</h3>
        </Link>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 flex-1">
          {project.short_description || project.description?.slice(0, 140) + '...'}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {tech.slice(0, 5).map(t => (
            <span key={t} className="px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20 text-[11px] font-medium">{t}</span>
          ))}
          {tech.length > 5 && <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-xs">+{tech.length - 5}</span>}
        </div>

        <div className="flex gap-2 mt-4">
          {project.live_demo_link && (
            <a href={project.live_demo_link} target="_blank" rel="noreferrer" className="flex-1 inline-flex justify-center items-center gap-2 px-3 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition">
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
          {project.github_link && (
            <a href={project.github_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-sm font-medium">
              <FaGithub /> Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export function ProjectSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="h-[200px] skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-5 skeleton rounded" />
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="flex gap-2">
          <span className="h-6 w-16 skeleton rounded-full" />
          <span className="h-6 w-20 skeleton rounded-full" />
          <span className="h-6 w-14 skeleton rounded-full" />
        </div>
        <div className="h-9 skeleton rounded-full" />
      </div>
    </div>
  )
}
