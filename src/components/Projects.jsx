import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa'
import { useProjects } from '../hooks/useProjects'
import ProjectCard, { ProjectSkeleton } from './ProjectCard'

const categories = ['All', 'ERP', 'Billing', 'E-Commerce', 'Backend API']
const techOptions = ['All', 'PHP', 'Laravel', 'MySQL', 'REST API', 'Tailwind CSS', 'Java', 'Spring Boot']

export default function Projects() {
  const [category, setCategory] = useState('All')
  const [tech, setTech] = useState('All')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // Debounce search
  const handleSearch = (v) => {
    setSearch(v)
    clearTimeout(window.__projSearch)
    window.__projSearch = setTimeout(() => setDebouncedSearch(v), 350)
  }

  const params = useMemo(() => {
    const p = {}
    if (category !== 'All') p.category = category
    if (tech !== 'All') p.tech = tech
    if (debouncedSearch) p.search = debouncedSearch
    return p
  }, [category, tech, debouncedSearch])

  const { projects, loading, error } = useProjects(params)

  const clearFilters = () => {
    setCategory('All')
    setTech('All')
    setSearch('')
    setDebouncedSearch('')
  }

  const activeFilters = category !== 'All' || tech !== 'All' || debouncedSearch

  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow">Projects</p>
            <h2 className="font-display text-[30px] lg:text-[36px] font-bold tracking-tight">Selected work — from database</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">Dynamic via <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-xs">GET /api/projects</code> — filter by category & tech, search, and admin CRUD protected by Sanctum.</p>
          </div>
          <a href="/admin" className="btn-outline text-sm">Admin CRUD →</a>
        </div>

        {/* Filter bar */}
        <div className="card p-4 flex flex-col lg:flex-row gap-4 lg:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1"><FaFilter /> Category:</span>
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition ${category === c ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-slate-500">Tech:</span>
            {techOptions.map(t => (
              <button key={t} onClick={() => setTech(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${tech === t ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-50'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Search projects by title, description or tech…"
              className="w-full pl-10 pr-10 py-3 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111117] focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {search && <button onClick={() => { setSearch(''); setDebouncedSearch('') }} className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 grid place-items-center rounded-full hover:bg-slate-100 dark:hover:bg-white/10"><FaTimes /></button>}
          </div>
          {activeFilters && <button onClick={clearFilters} className="btn-outline justify-center whitespace-nowrap">Clear filters</button>}
        </div>

        <div className="mt-2 text-xs text-slate-500">
          {loading ? 'Loading…' : `${projects.length} project${projects.length !== 1 ? 's' : ''} found`}
          {activeFilters && !loading && projects.length > 0 && <span> — filtered</span>}
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 text-sm">
            <div className="font-semibold">Failed to load projects: {error}</div>
            <div className="mt-1 text-xs opacity-80 space-y-1">
              <div>Live API: <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-white/10">https://gokulk.freedev.app/api/projects</code> via Vite proxy <code>/api → https://gokulk.freedev.app</code> with InfinityFree <code>__test</code> cookie. Frontend: <code>http://localhost:5173</code>.</div>
              <div>• If <b>InfinityFree verification</b>: Restart Vite: <code>npm run dev</code> (refreshes __test cookie). Check vite terminal for "[vite] InfinityFree __test cookie".</div>
              <div>• If <b>DNS 72h</b> (new freedev.app): Run <code>nslookup gokulk.freedev.app 8.8.8.8</code> should → 185.27.134.95. If not, change Windows DNS to 8.8.8.8/1.1.1.1 or wait. Try <code>ipconfig /flushdns</code>.</div>
              <div>• Check Network tab: <code>GET http://localhost:5173/api/projects</code> should be 200 JSON (via proxy), not HTML.</div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <ProjectSkeleton key={i} />)
          ) : projects.length === 0 ? (
            <div className="col-span-full card p-10 text-center">
              <p className="font-semibold">No projects match your filters.</p>
              <p className="text-sm text-slate-500 mt-1">Try clearing filters or searching another term.</p>
              <button onClick={clearFilters} className="btn-primary mt-4">Clear all filters</button>
            </div>
          ) : (
            projects.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)
          )}
        </div>

        {/* SEO / extra info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">Tip: Admin can Create/Read/Update/Delete via <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10">POST/PUT/DELETE /api/projects</code> with Sanctum token. Image upload → <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10">storage/projects</code>.</p>
        </div>
      </div>
    </section>
  )
}
