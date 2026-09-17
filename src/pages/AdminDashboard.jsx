import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../contexts/AuthContext'
import {
  adminFetchProjects, adminCreateProject, adminUpdateProject, adminDeleteProject,
  adminFetchSkills, adminCreateSkill, adminUpdateSkill, adminDeleteSkill, adminReorderSkills,
  adminFetchSettings, adminUpdateSettings, adminUploadImage,
  adminFetchVisitorStats, adminUpdateAccount
} from '../api'
import {
  FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaExternalLinkAlt, FaGithub, FaUpload,
  FaTachometerAlt, FaProjectDiagram, FaTools, FaLink, FaImage, FaChartBar, FaEye,
  FaCheck, FaTimes, FaArrowUp, FaArrowDown, FaSave, FaUserCog, FaKey, FaEnvelope
} from 'react-icons/fa'

const SIDEBAR = [
  { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
  { id: 'skills', label: 'Skills', icon: FaTools },
  { id: 'links', label: 'Profile Links', icon: FaLink },
  { id: 'image', label: 'Portfolio Image', icon: FaImage },
  { id: 'visitors', label: 'Visitors', icon: FaChartBar },
  { id: 'account', label: 'Account Settings', icon: FaUserCog },
]

// --- Project Form with preview ---
function ProjectForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(() => ({
    title: initial?.title || '',
    description: initial?.description || '',
    short_description: initial?.short_description || '',
    tech_stack: (initial?.tech_stack || []).join(', '),
    category: initial?.category || '',
    tags: (initial?.tags || []).join(', '),
    live_demo_link: initial?.live_demo_link || '',
    github_link: initial?.github_link || '',
    is_featured: initial?.is_featured || false,
    sort_order: initial?.sort_order || 0,
  }))
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(initial?.image_url || initial?.image || '')
  const [imageUrl, setImageUrl] = useState(initial?.image && initial?.image?.startsWith('http') ? initial.image : '')

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [file])

  const handle = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const submit = (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('title', form.title)
    fd.append('description', form.description)
    if (form.short_description) fd.append('short_description', form.short_description)
    if (form.category) fd.append('category', form.category)
    if (form.live_demo_link) fd.append('live_demo_link', form.live_demo_link)
    if (form.github_link) fd.append('github_link', form.github_link)
    fd.append('is_featured', form.is_featured ? '1' : '0')
    fd.append('sort_order', String(form.sort_order))
    form.tech_stack.split(',').map(s => s.trim()).filter(Boolean).forEach(v => fd.append('tech_stack[]', v))
    form.tags.split(',').map(s => s.trim()).filter(Boolean).forEach(v => fd.append('tags[]', v))
    if (file) fd.append('image', file)
    else if (imageUrl && imageUrl.startsWith('http')) fd.append('image_url', imageUrl)
    onSubmit(fd)
  }

  return (
    <form onSubmit={submit} className="card p-6 space-y-4">
      <h3 className="font-semibold text-lg">{initial ? 'Edit Project' : 'Add Project'}</h3>
      {preview && <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-xl border" />}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Title *</label>
          <input name="title" value={form.title} onChange={handle} required className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Short Description</label>
          <input name="short_description" value={form.short_description} onChange={handle} maxLength={500} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Description *</label>
          <textarea name="description" value={form.description} onChange={handle} required rows={4} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" />
        </div>
        <div>
          <label className="text-sm font-medium">Tech Stack (comma, multi-select)</label>
          <input name="tech_stack" value={form.tech_stack} onChange={handle} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" placeholder="PHP, Laravel, MySQL" />
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <input name="category" value={form.category} onChange={handle} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" placeholder="ERP / Billing / E-Commerce" />
        </div>
        <div>
          <label className="text-sm font-medium">Tags (comma)</label>
          <input name="tags" value={form.tags} onChange={handle} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" />
        </div>
        <div>
          <label className="text-sm font-medium">Sort Order</label>
          <input type="number" name="sort_order" value={form.sort_order} onChange={handle} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" />
        </div>
        <div>
          <label className="text-sm font-medium">Live Demo Link</label>
          <input name="live_demo_link" value={form.live_demo_link} onChange={handle} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" placeholder="https://" />
        </div>
        <div>
          <label className="text-sm font-medium">GitHub Link</label>
          <input name="github_link" value={form.github_link} onChange={handle} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" placeholder="https://" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium flex items-center gap-2"><FaUpload /> Image Upload — thumbnail/screenshot (jpg, png, webp, max 2MB)</label>
          <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={e => {
            const f = e.target.files[0] || null
            if (f) {
              const validTypes = ['image/jpeg','image/jpg','image/png','image/webp']
              if (!validTypes.includes(f.type)) { alert('Only jpg, png, webp allowed'); e.target.value=''; return }
              if (f.size > 2*1024*1024) { alert('Max 2MB'); e.target.value=''; return }
              setFile(f)
            } else setFile(null)
          }} className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" />
          <p className="text-xs text-slate-500 mt-1">Preview shown immediately after selecting — stored to <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10">storage/projects/</code> as <code>image</code> column.</p>
          <input value={imageUrl} onChange={e => { setImageUrl(e.target.value); if(e.target.value) setPreview(e.target.value) }} placeholder="Or paste image URL (https://...)" className="mt-2 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f] text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handle} id="feat" className="w-4 h-4" />
          <label htmlFor="feat" className="text-sm font-medium">Featured</label>
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">{loading ? 'Saving…' : (initial ? 'Update' : 'Create')}</button>
        <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </form>
  )
}

// --- Skill Form ---
function SkillForm({ initial, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(() => ({
    name: initial?.name || '',
    category: initial?.category || 'Backend',
    proficiency: initial?.proficiency || 80,
    icon: initial?.icon || '',
  }))
  const [iconFile, setIconFile] = useState(null)
  const [preview, setPreview] = useState(initial?.icon_url || '')

  useEffect(() => {
    if (iconFile) {
      const url = URL.createObjectURL(iconFile)
      setPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [iconFile])

  const submit = (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('category', form.category)
    fd.append('proficiency', String(form.proficiency))
    if (iconFile) fd.append('icon_file', iconFile)
    else if (form.icon) fd.append('icon', form.icon)
    onSubmit(fd)
  }

  return (
    <form onSubmit={submit} className="card p-6 space-y-4">
      <h3 className="font-semibold">{initial ? 'Edit Skill' : 'Add Skill'}</h3>
      {preview && !preview.startsWith('fa-') && !preview.startsWith('si-') && <img src={preview} alt="icon preview" className="w-16 h-16 object-contain border rounded-xl p-2" />}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Skill Name *</label>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" placeholder="e.g. Laravel" />
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]">
            <option>Backend</option><option>Frontend</option><option>Tools</option><option>Language</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Proficiency: {form.proficiency}%</label>
          <input type="range" min="0" max="100" value={form.proficiency} onChange={e => setForm(f => ({ ...f, proficiency: Number(e.target.value) }))} className="w-full mt-2 accent-indigo-600" />
          <div className="h-2.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden mt-1">
            <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600" style={{ width: `${form.proficiency}%` }} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Icon (fa-xxx or si-xxx or URL)</label>
          <input value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" placeholder="fa-laravel or https://..." />
        </div>
        <div>
          <label className="text-sm font-medium">Or upload icon image</label>
          <input type="file" accept="image/*" onChange={e => setIconFile(e.target.files[0] || null)} className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">{loading ? 'Saving…' : (initial ? 'Update' : 'Create')}</button>
        <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
      </div>
    </form>
  )
}

export default function AdminDashboard() {
  const { isAuthenticated, loading: authLoading, logout, user } = useAuth()
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [settings, setSettings] = useState({})
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  const [editingProject, setEditingProject] = useState(null)
  const [showProjectCreate, setShowProjectCreate] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [showSkillCreate, setShowSkillCreate] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null) // {type, id}

  const [profileForm, setProfileForm] = useState({ github_url: '', linkedin_url: '', email: '', phone: '', location: '' })
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [accountForm, setAccountForm] = useState({ current_password: '', new_email: '', new_password: '', new_password_confirmation: '' })

  const loadAll = async () => {
    setLoading(true)
    try {
      const [projRes, skillRes, settRes, statRes] = await Promise.all([
        adminFetchProjects().catch(() => ({ data: [] })),
        adminFetchSkills().catch(() => ({ data: [] })),
        adminFetchSettings().catch(() => ({ data: {} })),
        adminFetchVisitorStats().catch(() => ({ data: {} })),
      ])
      setProjects(projRes.data || [])
      setSkills(skillRes.data || [])
      const settData = settRes.data || {}
      setSettings(settData)
      setProfileForm({
        github_url: settData.github_url?.value || '',
        linkedin_url: settData.linkedin_url?.value || '',
        email: settData.email?.value || '',
        phone: settData.phone?.value || '',
        location: settData.location?.value || '',
      })
      setProfileImagePreview(settData.profile_image?.url || '')
      setStats(statRes.data || null)
    } catch (e) {
      setMsg({ type: 'error', text: e.message })
    } finally { setLoading(false) }
  }

  useEffect(() => { if (isAuthenticated) loadAll() }, [isAuthenticated])

  useEffect(() => {
    if (profileImageFile) {
      const url = URL.createObjectURL(profileImageFile)
      setProfileImagePreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [profileImageFile])

  if (authLoading) return <div className="container py-28">Loading…</div>
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  const handleLogout = async () => { await logout(); navigate('/admin/login') }

  const handleProjectCreate = async (fd) => {
    setBusy(true); setMsg(null)
    try { await adminCreateProject(fd); setMsg({ type: 'success', text: 'Project created!' }); setShowProjectCreate(false); loadAll() }
    catch (e) { setMsg({ type: 'error', text: e.response?.data?.message || Object.values(e.response?.data?.errors || {}).flat().join(', ') || e.message }) }
    finally { setBusy(false) }
  }
  const handleProjectUpdate = async (fd) => {
    setBusy(true); setMsg(null)
    try { await adminUpdateProject(editingProject.id, fd); setMsg({ type: 'success', text: 'Project updated!' }); setEditingProject(null); loadAll() }
    catch (e) { setMsg({ type: 'error', text: e.response?.data?.message || e.message }) }
    finally { setBusy(false) }
  }
  const handleProjectDelete = async () => {
    if (!confirmDelete) return
    setBusy(true)
    try { await adminDeleteProject(confirmDelete.id); setMsg({ type: 'success', text: 'Project deleted' }); setConfirmDelete(null); loadAll() }
    catch (e) { setMsg({ type: 'error', text: e.message }) }
    finally { setBusy(false) }
  }

  const handleSkillCreate = async (fd) => {
    setBusy(true); setMsg(null)
    try { await adminCreateSkill(fd); setMsg({ type: 'success', text: 'Skill created' }); setShowSkillCreate(false); loadAll() }
    catch (e) { setMsg({ type: 'error', text: e.response?.data?.message || e.message }) }
    finally { setBusy(false) }
  }
  const handleSkillUpdate = async (fd) => {
    setBusy(true); setMsg(null)
    try { await adminUpdateSkill(editingSkill.id, fd); setMsg({ type: 'success', text: 'Skill updated' }); setEditingSkill(null); loadAll() }
    catch (e) { setMsg({ type: 'error', text: e.message }) }
    finally { setBusy(false) }
  }
  const handleSkillDelete = async () => {
    setBusy(true)
    try { await adminDeleteSkill(confirmDelete.id); setMsg({ type: 'success', text: 'Skill deleted' }); setConfirmDelete(null); loadAll() }
    catch (e) { setMsg({ type: 'error', text: e.message }) }
    finally { setBusy(false) }
  }
  const moveSkill = async (index, dir) => {
    const newSkills = [...skills]
    const target = dir === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= newSkills.length) return
    const tmp = newSkills[index]; newSkills[index] = newSkills[target]; newSkills[target] = tmp
    setSkills(newSkills)
    const ids = newSkills.map(s => s.id)
    try { await adminReorderSkills(ids) } catch {}
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    setBusy(true); setMsg(null)
    try { await adminUpdateSettings(profileForm); setMsg({ type: 'success', text: 'Profile links updated — public site will reflect immediately' }); loadAll() }
    catch (err) { setMsg({ type: 'error', text: err.response?.data?.message || err.message }) }
    finally { setBusy(false) }
  }

  const handleImageUpload = async (key, file) => {
    if (!file) return
    // Client-side validation for image: jpg/png/webp 2MB
    if (key === 'profile_image' || key === 'projects') {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setMsg({ type: 'error', text: 'Only jpg, png, webp images allowed.' }); return
      }
      if (file.size > 2 * 1024 * 1024) {
        setMsg({ type: 'error', text: 'Max size 2MB exceeded.' }); return
      }
    }
    setBusy(true); setMsg(null)
    try { const res = await adminUploadImage(key, file); setMsg({ type: 'success', text: `${key} uploaded!` }); setProfileImagePreview(res.url); if (key === 'profile_image') setProfileImageFile(null); if (key === 'resume_pdf') setResumeFile(null); loadAll() }
    catch (e) { setMsg({ type: 'error', text: e.response?.data?.message || e.response?.data?.errors && Object.values(e.response.data.errors).flat().join(', ') || e.message }) }
    finally { setBusy(false) }
  }

  const handleAccountUpdate = async (e) => {
    e.preventDefault()
    setBusy(true); setMsg(null)
    try {
      const payload = {}
      if (!accountForm.current_password) { setMsg({ type: 'error', text: 'Current password is required.' }); setBusy(false); return }
      payload.current_password = accountForm.current_password
      if (accountForm.new_email) payload.new_email = accountForm.new_email
      if (accountForm.new_password) {
        payload.new_password = accountForm.new_password
        payload.new_password_confirmation = accountForm.new_password_confirmation
      }
      const res = await adminUpdateAccount(payload)
      setMsg({ type: 'success', text: res.message || 'Account updated successfully. Use new credentials next login.' })
      setAccountForm({ current_password: '', new_email: '', new_password: '', new_password_confirmation: '' })
      // If email changed, update displayed user email
      if (payload.new_email) loadAll()
    } catch (err) {
      const m = err.response?.data?.message || err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(', ') || err.message
      setMsg({ type: 'error', text: m })
    } finally { setBusy(false) }
  }

  const maxVisitors = Math.max(...(stats?.last7?.map(d => d.count) || [1]), 1)

  return (
    <>
      <Helmet><title>Admin Dashboard — Gokul K</title><meta name="robots" content="noindex" /></Helmet>
      <div className="min-h-screen flex bg-slate-50 dark:bg-[#0a0a0f]">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 dark:border-white/10 bg-white dark:bg-[#111117] sticky top-0 h-screen">
          <div className="p-6 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 grid place-items-center rounded-xl bg-indigo-600 text-white font-bold">GK</span>
              <span className="font-display font-bold">Admin Panel</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{user?.email}</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {SIDEBAR.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${active === s.id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                <s.icon /> {s.label}
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-200 dark:border-white/10">
            <button onClick={handleLogout} className="w-full btn-outline justify-center"><FaSignOutAlt /> Logout</button>
          </div>
        </aside>

        {/* Mobile top nav */}
        <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white dark:bg-[#111117] border-b border-slate-200 dark:border-white/10">
          <div className="flex overflow-x-auto gap-1 p-2">
            {SIDEBAR.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)} className={`whitespace-nowrap flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium border ${active === s.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10'}`}>
                <s.icon /> {s.label}
              </button>
            ))}
            <button onClick={handleLogout} className="whitespace-nowrap px-3 py-2 rounded-full bg-red-600 text-white text-xs">Logout</button>
          </div>
        </div>

        {/* Main */}
        <main className="flex-1 min-w-0 pt-[64px] lg:pt-0">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl font-bold capitalize">{active === 'dashboard' ? 'Dashboard Overview' : SIDEBAR.find(s => s.id === active)?.label}</h1>
                <p className="text-sm text-slate-500">Welcome, {user?.name} • Sanctum-protected CRUD</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20">Secure Admin</span>
            </div>

            {msg && <div className={`mb-4 p-3 rounded-xl text-sm border flex items-center gap-2 ${msg.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300'}`}>{msg.type === 'success' ? <FaCheck /> : <FaTimes />} {msg.text}</div>}

            {/* Dashboard stats */}
            {active === 'dashboard' && (
              <div className="space-y-6">
                {loading ? <div className="p-10 text-center">Loading stats…</div> : (
                  <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="card p-5">
                        <div className="w-9 h-9 grid place-items-center rounded-xl bg-indigo-600 text-white mb-3"><FaProjectDiagram /></div>
                        <div className="text-2xl font-bold">{stats?.total_projects ?? projects.length}</div>
                        <div className="text-sm text-slate-500">Total Projects</div>
                      </div>
                      <div className="card p-5">
                        <div className="w-9 h-9 grid place-items-center rounded-xl bg-emerald-600 text-white mb-3"><FaTools /></div>
                        <div className="text-2xl font-bold">{stats?.total_skills ?? skills.length}</div>
                        <div className="text-sm text-slate-500">Total Skills</div>
                      </div>
                      <div className="card p-5">
                        <div className="w-9 h-9 grid place-items-center rounded-xl bg-sky-600 text-white mb-3"><FaEye /></div>
                        <div className="text-2xl font-bold">{stats?.total ?? 0}</div>
                        <div className="text-sm text-slate-500">Total Visitors (all-time)</div>
                      </div>
                      <div className="card p-5">
                        <div className="w-9 h-9 grid place-items-center rounded-xl bg-amber-600 text-white mb-3"><FaChartBar /></div>
                        <div className="text-2xl font-bold">{stats?.today ?? 0}</div>
                        <div className="text-sm text-slate-500">Today's Visitors</div>
                      </div>
                    </div>

                    {/* Chart last 7 days */}
                    <div className="card p-6">
                      <h3 className="font-semibold mb-4">Visits last 7 days</h3>
                      <div className="flex items-end gap-2 h-40">
                        {(stats?.last7 || []).map(d => (
                          <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                            <div className="w-full bg-indigo-600 rounded-t-lg transition" style={{ height: `${(d.count / maxVisitors) * 120 + 8}px` }} title={`${d.label}: ${d.count}`} />
                            <span className="text-[10px] font-medium">{d.label}</span>
                            <span className="text-xs font-bold">{d.count}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-3">Bar chart (last 7 days) — avoiding admin visits (/admin/* not counted). Real-time via POST /api/track-visit on public load.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4">
                      <div className="card p-5">
                        <h4 className="font-semibold text-sm mb-2">Top pages</h4>
                        <ul className="text-sm space-y-1">
                          {(stats?.byPage || []).map(p => (
                            <li key={p.page} className="flex justify-between"><span className="text-slate-600 dark:text-slate-400">{p.page}</span><span className="font-bold">{p.count}</span></li>
                          ))}
                          {(!stats?.byPage || stats.byPage.length === 0) && <li className="text-slate-500">No data yet</li>}
                        </ul>
                      </div>
                      <div className="card p-5">
                        <h4 className="font-semibold text-sm mb-2">Quick actions</h4>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => setActive('projects')} className="btn-primary !py-2 text-sm">Manage Projects</button>
                          <button onClick={() => setActive('skills')} className="btn-outline !py-2 text-sm">Manage Skills</button>
                          <button onClick={() => setActive('links')} className="btn-outline !py-2 text-sm">Profile Links</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Projects */}
            {active === 'projects' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold">Projects ({projects.length})</h2>
                  <button onClick={() => setShowProjectCreate(v => !v)} className="btn-primary !py-2 text-sm"><FaPlus /> {showProjectCreate ? 'Close' : 'Add Project'}</button>
                </div>
                {showProjectCreate && <ProjectForm onSubmit={handleProjectCreate} onCancel={() => setShowProjectCreate(false)} loading={busy} />}
                {editingProject && <ProjectForm initial={editingProject} onSubmit={handleProjectUpdate} onCancel={() => setEditingProject(null)} loading={busy} />}
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 dark:bg-white/[0.03] text-left text-xs uppercase tracking-widest text-slate-500">
                        <tr><th className="px-4 py-3">Project</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Tech</th><th className="px-4 py-3">Featured</th><th className="px-4 py-3">Actions</th></tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                        {projects.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02]">
                            <td className="px-4 py-3 flex items-center gap-3">
                              <img src={p.image_url || p.image || 'https://placehold.co/80'} alt="" className="w-14 h-14 rounded-xl object-cover border" />
                              <div><div className="font-medium line-clamp-1">{p.title}</div><div className="text-xs text-slate-500">{p.slug}</div></div>
                            </td>
                            <td className="px-4 py-3"><span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs">{p.category || '—'}</span></td>
                            <td className="px-4 py-3"><div className="flex flex-wrap gap-1 max-w-[200px]">{(p.tech_stack || []).slice(0, 3).map(t => <span key={t} className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-[11px] border border-indigo-200 dark:border-indigo-500/20">{t}</span>)} {(p.tech_stack || []).length > 3 && <span className="text-xs text-slate-500">+{p.tech_stack.length - 3}</span>}</div></td>
                            <td className="px-4 py-3">{p.is_featured ? <span className="px-2 py-1 rounded-full bg-amber-500 text-white text-xs">Featured</span> : <span className="text-xs text-slate-400">No</span>}</td>
                            <td className="px-4 py-3 flex gap-1">
                              <button onClick={() => setEditingProject(p)} className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs inline-flex items-center gap-1"><FaEdit /> Edit</button>
                              <button onClick={() => setConfirmDelete({ type: 'project', id: p.id })} className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs inline-flex items-center gap-1"><FaTrash /> Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Skills */}
            {active === 'skills' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold">Skills ({skills.length}) — drag via ↑↓</h2>
                  <button onClick={() => setShowSkillCreate(v => !v)} className="btn-primary !py-2 text-sm"><FaPlus /> {showSkillCreate ? 'Close' : 'Add Skill'}</button>
                </div>
                {showSkillCreate && <SkillForm onSubmit={handleSkillCreate} onCancel={() => setShowSkillCreate(false)} loading={busy} />}
                {editingSkill && <SkillForm initial={editingSkill} onSubmit={handleSkillUpdate} onCancel={() => setEditingSkill(null)} loading={busy} />}
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-white/[0.03] text-left text-xs uppercase tracking-widest text-slate-500">
                      <tr><th className="px-4 py-3">Skill</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Proficiency</th><th className="px-4 py-3">Reorder</th><th className="px-4 py-3">Actions</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                      {skills.map((s, idx) => (
                        <tr key={s.id}>
                          <td className="px-4 py-3 flex items-center gap-2">
                            {s.icon_url && !s.icon_url.startsWith('fa-') && !s.icon_url.startsWith('si-') ? <img src={s.icon_url} alt="" className="w-8 h-8 rounded object-contain border p-1" /> : <span className="w-8 h-8 grid place-items-center rounded bg-slate-100 dark:bg-white/10 text-xs">{s.icon || '★'}</span>}
                            <span className="font-medium">{s.name}</span>
                          </td>
                          <td className="px-4 py-3"><span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-xs">{s.category}</span></td>
                          <td className="px-4 py-3 w-40">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden"><div className="h-full bg-indigo-600" style={{ width: `${s.proficiency}%` }} /></div>
                              <span className="text-xs font-bold">{s.proficiency}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              <button onClick={() => moveSkill(idx, 'up')} disabled={idx === 0} className="w-7 h-7 grid place-items-center rounded-full border disabled:opacity-30"><FaArrowUp className="text-xs" /></button>
                              <button onClick={() => moveSkill(idx, 'down')} disabled={idx === skills.length - 1} className="w-7 h-7 grid place-items-center rounded-full border disabled:opacity-30"><FaArrowDown className="text-xs" /></button>
                            </div>
                          </td>
                          <td className="px-4 py-3 flex gap-1">
                            <button onClick={() => setEditingSkill(s)} className="px-3 py-1.5 rounded-full bg-indigo-600 text-white text-xs inline-flex items-center gap-1"><FaEdit /> Edit</button>
                            <button onClick={() => setConfirmDelete({ type: 'skill', id: s.id })} className="px-3 py-1.5 rounded-full bg-red-600 text-white text-xs"><FaTrash /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Profile Links */}
            {active === 'links' && (
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold">Profile Links & Contact — site_settings (key-value)</h2>
                <p className="text-xs text-slate-500">Updates reflect site-wide in Navbar/Footer/Hero without code changes. Saved to <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10">site_settings</code>.</p>
                <form onSubmit={handleProfileSave} className="grid sm:grid-cols-2 gap-4">
                  <div><label className="text-sm font-medium">GitHub URL</label><input value={profileForm.github_url} onChange={e => setProfileForm(f => ({ ...f, github_url: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" placeholder="https://github.com/..." /></div>
                  <div><label className="text-sm font-medium">LinkedIn URL</label><input value={profileForm.linkedin_url} onChange={e => setProfileForm(f => ({ ...f, linkedin_url: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" placeholder="https://linkedin.com/in/..." /></div>
                  <div><label className="text-sm font-medium">Email</label><input value={profileForm.email} onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" /></div>
                  <div><label className="text-sm font-medium">Phone</label><input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" /></div>
                  <div className="sm:col-span-2"><label className="text-sm font-medium">Location</label><input value={profileForm.location} onChange={e => setProfileForm(f => ({ ...f, location: e.target.value }))} className="mt-1 w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" /></div>
                  <div className="sm:col-span-2 flex gap-2">
                    <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60"><FaSave /> {busy ? 'Saving…' : 'Save Links'}</button>
                    <span className="text-xs text-slate-500 self-center">Fetched dynamically via GET /api/settings</span>
                  </div>
                </form>
                <div className="border-t border-slate-200 dark:border-white/10 pt-4">
                  <h3 className="font-medium text-sm mb-2">Resume PDF — upload/replace</h3>
                  <div className="flex items-center gap-3">
                    <input type="file" accept="application/pdf" onChange={e => setResumeFile(e.target.files[0] || null)} className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" />
                    <button onClick={() => handleImageUpload('resume_pdf', resumeFile)} disabled={!resumeFile || busy} className="btn-outline !py-2 disabled:opacity-50"><FaUpload /> Upload PDF</button>
                  </div>
                  {settings.resume_pdf?.url && <a href={settings.resume_pdf.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 mt-1 inline-flex items-center gap-1"><FaExternalLinkAlt /> Current: {settings.resume_pdf.url.slice(0, 60)}…</a>}
                </div>
              </div>
            )}

            {/* Portfolio Image */}
            {active === 'image' && (
              <div className="card p-6 space-y-4">
                <h2 className="font-semibold">Portfolio / Hero Image — profile_image</h2>
                <p className="text-xs text-slate-500">Shown in Hero/About. Upload to <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10">storage/profile</code>, URL in site_settings.</p>
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-48 h-48 rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 grid place-items-center overflow-hidden bg-slate-50 dark:bg-white/5">
                    {profileImagePreview ? <img src={profileImagePreview} alt="profile preview" className="w-full h-full object-cover" /> : <span className="text-slate-400 text-sm">No image</span>}
                  </div>
                  <div className="flex-1 space-y-3">
                    <input type="file" accept="image/*" onChange={e => setProfileImageFile(e.target.files[0] || null)} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]" />
                    {profileImageFile && <p className="text-xs text-emerald-600">Selected: {profileImageFile.name} — preview above before save</p>}
                    <button onClick={() => handleImageUpload('profile_image', profileImageFile)} disabled={!profileImageFile || busy} className="btn-primary disabled:opacity-50"><FaUpload /> Change Image — Save</button>
                    {settings.profile_image?.url && <p className="text-xs text-slate-500">Current URL: {settings.profile_image.url}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Visitors */}
            {active === 'visitors' && (
              <div className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="card p-5 text-center"><div className="text-2xl font-bold">{stats?.total ?? 0}</div><div className="text-sm text-slate-500">All-time</div></div>
                  <div className="card p-5 text-center"><div className="text-2xl font-bold">{stats?.today ?? 0}</div><div className="text-sm text-slate-500">Today</div></div>
                  <div className="card p-5 text-center"><div className="text-2xl font-bold">{stats?.total_projects ?? 0} / {stats?.total_skills ?? 0}</div><div className="text-sm text-slate-500">Projects / Skills</div></div>
                </div>
                <div className="card p-6">
                  <h3 className="font-semibold mb-4">Last 7 days — bar chart</h3>
                  {loading ? (
                    <div className="h-48 grid place-items-center text-slate-500 text-sm">Loading chart…</div>
                  ) : (
                    <div className="flex items-end gap-2 h-48">
                      {(stats?.last7 || []).map(d => (
                        <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-indigo-600 rounded-t-lg transition" style={{ height: `${(d.count / maxVisitors) * 140 + 8}px` }} title={`${d.label}: ${d.count}`} />
                          <span className="text-[10px]">{d.label}</span>
                          <span className="text-xs font-bold">{d.count}</span>
                        </div>
                      ))}
                      {(stats?.last7 || []).length === 0 && <div className="text-sm text-slate-500">No visitor data yet — visit public pages to generate data.</div>}
                    </div>
                  )}
                  <p className="text-xs text-slate-500 mt-2">Counts via visitors table (ip_address, visited_at, page) — middleware logs on public load, admin /admin/* not counted.</p>
                </div>
              </div>
            )}

            {/* Account Settings — Change Login Credentials */}
            {active === 'account' && (
              <div className="card p-6 space-y-5">
                <div>
                  <h2 className="font-semibold text-lg flex items-center gap-2"><FaUserCog /> Account Settings</h2>
                  <p className="text-sm text-slate-500">Update admin email / password. Current password required. Updates <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10">users</code> table (bcrypt).</p>
                  <p className="text-xs text-slate-400 mt-1">Logged in as <span className="font-medium text-slate-700 dark:text-slate-300">{user?.email}</span></p>
                </div>
                <form onSubmit={handleAccountUpdate} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2"><FaKey className="text-slate-400" /> Current Password *</label>
                    <input type="password" value={accountForm.current_password} onChange={e => setAccountForm(f => ({ ...f, current_password: e.target.value }))} required className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f] focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter current password to verify" />
                  </div>
                  <div>
                    <label className="text-sm font-medium flex items-center gap-2"><FaEnvelope className="text-slate-400" /> New Email (optional)</label>
                    <input type="email" value={accountForm.new_email} onChange={e => setAccountForm(f => ({ ...f, new_email: e.target.value }))} className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f] focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Leave blank to keep current" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium flex items-center gap-2"><FaKey className="text-slate-400" /> New Password</label>
                      <input type="password" value={accountForm.new_password} onChange={e => setAccountForm(f => ({ ...f, new_password: e.target.value }))} className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f] focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Min 8 chars, leave blank to keep" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Confirm New Password</label>
                      <input type="password" value={accountForm.new_password_confirmation} onChange={e => setAccountForm(f => ({ ...f, new_password_confirmation: e.target.value }))} className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f] focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Repeat new password" />
                    </div>
                  </div>
                  <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
                    {busy ? 'Updating…' : <><FaSave /> Update Credentials</>}
                  </button>
                  <p className="text-xs text-slate-500">API: <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10">PUT /api/admin/account</code> — Sanctum protected, validates current password, hashes new password with bcrypt. Rate-limited login still at 5/min.</p>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-6">
          <div className="card p-6 max-w-sm w-full">
            <h3 className="font-semibold">Confirm delete?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">This will permanently delete the {confirmDelete.type}. This cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 btn-outline justify-center">Cancel</button>
              <button
                onClick={() => {
                  if (confirmDelete.type === 'project') handleProjectDelete()
                  else handleSkillDelete()
                }}
                disabled={busy}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold disabled:opacity-60"
              >
                {busy ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
