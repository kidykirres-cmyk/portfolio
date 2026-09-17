import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ProjectDetail from './pages/ProjectDetail'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import { initGA, trackPageView } from './utils/analytics'
import { trackVisit } from './api'

function AnimatedRoutes() {
  const location = useLocation()
  useEffect(() => { initGA(); trackPageView(location.pathname) }, [location.pathname])
  useEffect(() => {
    // Visitor counter — avoid counting admin's own visits
    const token = localStorage.getItem('portfolio_token')
    const isAdmin = location.pathname.startsWith('/admin')
    if (isAdmin && token) return // don't count admin
    // Throttle: once per session per page
    const key = `tracked_${location.pathname}`
    if (sessionStorage.getItem(key)) return
    trackVisit(location.pathname)
    sessionStorage.setItem(key, '1')
  }, [location.pathname])
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="*" element={<div className="container py-28 text-center"><h1 className="text-2xl font-bold">404 — Not Found</h1><a href="/" className="btn-primary mt-4 inline-flex">Go Home</a></div>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')
  // Admin layout — no public navbar/footer
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0f]">
        <AnimatedRoutes />
      </div>
    )
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  )
}
