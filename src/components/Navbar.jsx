import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaLinkedin, FaBars, FaTimes, FaSun, FaMoon, FaEnvelope, FaDownload } from 'react-icons/fa'
import { useTheme } from '../contexts/ThemeContext'
import { useSiteSettings } from '../hooks/useSiteSettings'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Resume', href: '#resume' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isDark, toggle } = useTheme()
  const location = useLocation()
  const { settings } = useSiteSettings()
  const githubUrl = settings?.github_url || 'https://github.com/GokulK-24MCA26'
  const linkedinUrl = settings?.linkedin_url || 'https://linkedin.com/in/gokulk887016'
  const resumeUrl = settings?.resume_pdf || '/resume.pdf'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = location.pathname === '/'

  const scrollTo = (hash) => {
    setOpen(false)
    if (!isHome) {
      window.location.href = `/${hash}`
      return
    }
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all ${scrolled ? 'glass shadow-sm' : 'bg-transparent border-transparent'}`}>
      <nav className="container flex items-center justify-between h-[68px]">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white grid place-items-center font-bold text-sm">GK</span>
          <span className="font-display font-bold text-[18px] tracking-tight">Gokul K<span className="text-indigo-600">.</span></span>
          <span className="hidden sm:inline text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">Available for hire</span>
        </Link>

        <ul className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {navLinks.map(l => (
            <li key={l.href}>
              <button onClick={() => scrollTo(l.href)} className="px-3.5 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition">
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a href={githubUrl} target="_blank" rel="noreferrer" className="hidden sm:grid w-9 h-9 place-items-center rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition">
            <FaGithub />
          </a>
          <a href={linkedinUrl} target="_blank" rel="noreferrer" className="hidden sm:grid w-9 h-9 place-items-center rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition">
            <FaLinkedin />
          </a>
          <button onClick={toggle} className="w-9 h-9 grid place-items-center rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 transition" aria-label="Toggle theme">
            {isDark ? <FaSun className="text-amber-400" /> : <FaMoon />}
          </button>
          <Link to="/#contact" onClick={() => scrollTo('#contact')} className="hidden lg:inline-flex btn-primary !py-2 !px-5 text-sm">Hire Me</Link>
          <a href={resumeUrl} download target={resumeUrl.startsWith('http') ? '_blank' : undefined} className="hidden lg:inline-flex btn-outline !py-2 !px-4 text-sm gap-2"><FaDownload /> Resume</a>
          <button onClick={() => setOpen(o => !o)} className="lg:hidden w-9 h-9 grid place-items-center rounded-full border border-slate-200 dark:border-white/10">
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]">
            <div className="container py-6 flex flex-col gap-2">
              {navLinks.map(l => (
                <button key={l.href} onClick={() => scrollTo(l.href)} className="text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 font-medium">
                  {l.label}
                </button>
              ))}
              <div className="flex gap-2 pt-2">
                <a href={resumeUrl} download target={resumeUrl.startsWith('http') ? '_blank' : undefined} className="flex-1 btn-outline justify-center"><FaDownload /> Download Resume</a>
                <a href="mailto:gokulgokul4457@gmail.com" className="flex-1 btn-primary justify-center"><FaEnvelope /> Contact</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
