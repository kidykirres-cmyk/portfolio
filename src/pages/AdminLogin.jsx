import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from '../contexts/AuthContext'
import { FaLock, FaEnvelope, FaKey } from 'react-icons/fa'

export default function AdminLogin() {
  const { isAuthenticated, login } = useAuth()
  const [form, setForm] = useState({ email: 'admin@gmail.com', password: '' })
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await login(form.email, form.password, remember)
      navigate('/admin/dashboard')
    } catch (err) {
      const isInfinity = err.isInfinityFree || err.message?.includes('InfinityFree')
      const isNetwork = !err.response && err.message.includes('Network Error')
      const msg = isInfinity
        ? 'InfinityFree verification blocked — restart vite dev server (npm run dev) to refresh __test cookie.'
        : isNetwork
        ? 'Network Error — API unreachable. DNS 72h? Run nslookup gokulk.freedev.app 8.8.8.8 → should be 185.27.134.95. Try Google DNS 8.8.8.8.'
        : (err.response?.data?.message || err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(', ') || `Login failed (${err.response?.status || err.message}) — check credentials`)
      setError(msg)
    } finally { setLoading(false) }
  }

  return (
    <>
      <Helmet>
        <title>Admin Login — Gokul K Portfolio</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-[70vh] grid place-items-center py-20 pt-[88px]">
        <div className="w-full max-w-md card p-8">
          <div className="w-12 h-12 grid place-items-center rounded-2xl bg-indigo-600 text-white mx-auto mb-4"><FaLock /></div>
          <h1 className="text-center font-display text-2xl font-bold">Admin Login</h1>
          <p className="text-center text-sm text-slate-500 mt-1">Secure Sanctum auth — /admin/dashboard</p>
          <p className="text-center text-xs text-slate-400 mt-2">Seed admin: <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10">admin@gmail.com / 12345678</code></p>

          {error && <div className="mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-sm text-red-700 dark:text-red-300">{error}</div>}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium flex items-center gap-2"><FaEnvelope className="text-slate-400" /> Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f] focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium flex items-center gap-2"><FaKey className="text-slate-400" /> Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f] focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter password" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} className="w-4 h-4 rounded border-slate-300" />
              Remember me
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign In — Go to Dashboard'}
            </button>
          </form>

          <p className="text-xs text-center text-slate-500 mt-4">
            Protected routes: <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10">POST /api/projects</code> requires Bearer token.
          </p>
        </div>
      </div>
    </>
  )
}
