import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaArrowRight, FaEye, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGithub, FaLinkedin, FaExternalLinkAlt, FaDownload } from 'react-icons/fa'
import { useSiteSettings } from '../hooks/useSiteSettings'

const roles = ['Junior Laravel & REST API Developer', 'Aspiring REST API Developer', 'MySQL & MVC Builder', 'PHP Laravel Enthusiast']

function Typewriter({ texts, speed = 80, pause = 1400 }) {
  const [idx, setIdx] = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const full = texts[idx]
    let t
    if (!deleting) {
      if (display.length < full.length) {
        t = setTimeout(() => setDisplay(full.slice(0, display.length + 1)), speed)
      } else {
        t = setTimeout(() => setDeleting(true), pause)
      }
    } else {
      if (display.length > 0) {
        t = setTimeout(() => setDisplay(full.slice(0, display.length - 1)), 40)
      } else {
        setDeleting(false)
        setIdx((i) => (i + 1) % texts.length)
      }
    }
    return () => clearTimeout(t)
  }, [display, deleting, idx, texts, speed, pause])

  return (
    <span className="text-indigo-600 dark:text-indigo-400">
      {display}<span className="animate-pulse">|</span>
    </span>
  )
}

export default function Hero() {
  const { settings } = useSiteSettings()
  const githubUrl = settings?.github_url || 'https://github.com/GokulK-24MCA26'
  const linkedinUrl = settings?.linkedin_url || 'https://linkedin.com/in/gokulk887016'
  const email = settings?.email || 'gokulgokul4457@gmail.com'
  const phone = settings?.phone || '+91 6380531946'
  const location = settings?.location || 'Sathyamangalam, Erode'
  const resumeUrl = settings?.resume_pdf || '/resume.pdf'
  const profileImage = settings?.profile_image || null
  return (
    <section id="home" className="relative overflow-hidden pt-[86px]">
      {/* subtle gradient blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-24 w-[520px] h-[520px] bg-indigo-500/10 blur-[80px] rounded-full" />
        <div className="absolute top-40 -left-32 w-[480px] h-[480px] bg-violet-500/10 blur-[80px] rounded-full" />
      </div>

      <div className="container grid lg:grid-cols-12 gap-10 items-center py-16 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 mb-4">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Available for freelance & full-time • Coimbatore
          </div>

          <h1 className="font-display font-bold leading-[0.95] text-[38px] sm:text-[48px] lg:text-[56px] tracking-tight">
            Hi, I&apos;m <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Gokul K</span>
            <br />
            <span className="text-[28px] sm:text-[32px] lg:text-[36px] font-semibold text-slate-700 dark:text-slate-300">
              <Typewriter texts={roles} />
            </span>
          </h1>

          <p className="mt-5 text-[17px] leading-7 text-slate-600 dark:text-slate-300 max-w-2xl">
            Junior PHP Laravel Developer with <strong>6 months hands-on</strong> in PHP, Laravel, MySQL, REST APIs &amp; MVC.
            I build <strong>ERP, billing &amp; inventory, and e-commerce</strong> systems — production-ready, secure, and fast.
            Seeking a <strong>Laravel role in Coimbatore</strong>.
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            <a href="#projects" className="btn-primary">
              View Projects <FaArrowRight />
            </a>
            <a href="#contact" className="btn-outline">
              <FaEnvelope /> Let&apos;s Talk
            </a>
            <a href={resumeUrl} download target={resumeUrl.startsWith('http') ? '_blank' : undefined} className="btn-outline hidden sm:inline-flex">
              <FaDownload /> Download Resume (PDF)
            </a>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 text-xs">
            <a href={resumeUrl} download target={resumeUrl.startsWith('http') ? '_blank' : undefined} className="sm:hidden inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">
              <FaDownload /> Download Resume
            </a>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10"><FaMapMarkerAlt className="text-indigo-500" /> {location}</span>
            <a href={`tel:${phone.replace(/\s/g,'')}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"><FaPhone className="text-emerald-500" /> {phone}</a>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"><FaEnvelope className="text-sky-500" /> {email}</a>
          </div>

          <div className="flex gap-3 mt-5 text-sm">
            <a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900"><FaGithub /> {githubUrl.replace('https://','')}</a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0a66c2] text-white"><FaLinkedin /> LinkedIn</a>
            <a href="https://gokulk.netlify.app" target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10"><FaExternalLinkAlt /> Portfolio</a>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 max-w-md">
            {[
              { k: '6+ Months', v: 'Hands-on Laravel' },
              { k: '4 Live Projects', v: 'ERP • Billing • Shop' },
              { k: 'MCA 8.1 CGPA', v: 'KGiSL • 2024-26' },
            ].map(s => (
              <div key={s.k} className="card p-4 text-center">
                <div className="font-bold text-slate-900 dark:text-white">{s.k}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{s.v}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="lg:col-span-5"
        >
          <div className="relative isolate pb-12 lg:pb-0">
            {profileImage && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:-top-8 lg:-right-8 z-30 hidden sm:block">
                <img src={profileImage} alt="Gokul K profile" className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl object-cover border-4 border-white dark:border-[#111117] shadow-xl" />
              </div>
            )}
            {/* Code mock card */}
            <div className="card shadow-2xl shadow-indigo-500/10 overflow-hidden relative z-10">
              <div className="h-10 flex items-center gap-1.5 px-4 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03]">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-mono text-slate-500">GokulK.php — Laravel</span>
              </div>
              <div className="p-5 font-mono text-[13px] leading-6">
                <div className="text-slate-500">// Crafting production-ready Laravel apps</div>
                <div><span className="text-violet-600">class</span> <span className="text-sky-600">GokulK</span> <span className="text-slate-500">extends</span> <span className="text-amber-600">Developer</span> {'{'}</div>
                <div className="pl-4"><span className="text-violet-600">public</span> <span className="text-sky-600">function</span> <span className="text-emerald-600">stack</span>() {'{'}</div>
                <div className="pl-8 text-slate-700 dark:text-slate-300">return [ <span className="text-emerald-600">&apos;PHP&apos;</span>, <span className="text-emerald-600">&apos;Laravel&apos;</span>, <span className="text-emerald-600">&apos;MySQL&apos;</span>, <span className="text-emerald-600">&apos;REST API&apos;</span> ];</div>
                <div className="pl-4">{'}'}</div>
                <div className="pl-4"><span className="text-violet-600">public</span> <span className="text-sky-600">function</span> <span className="text-emerald-600">focus</span>() {'{'}</div>
                <div className="pl-8">return <span className="text-emerald-600">&apos;ERP • Billing • E-Commerce&apos;</span>;</div>
                <div className="pl-4">{'}'}</div>
                <div>{'}'}</div>
                <div className="mt-4 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-xs">Laravel 10+</span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs">MySQL</span>
                  <span className="px-2.5 py-1 rounded-full border border-slate-200 dark:border-white/10 text-xs">REST API</span>
                </div>
              </div>
            </div>

            {/* Floating badges — positioned at card corners, hidden on mobile/tablet to avoid overlap, visible only xl+ */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 hidden xl:flex items-center gap-3 card p-3 shadow-xl z-20 pointer-events-none"
            >
              <span className="w-9 h-9 grid place-items-center rounded-xl bg-emerald-500 text-white"><FaEye /></span>
              <div>
                <div className="text-sm font-semibold leading-none">Production Ready</div>
                <div className="text-xs text-slate-500">Debugged &amp; deployed</div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-4 -left-4 hidden xl:flex items-center gap-3 card p-3 shadow-xl z-20 pointer-events-none"
            >
              <span className="w-9 h-9 grid place-items-center rounded-xl bg-indigo-600 text-white">✓</span>
              <div>
                <div className="text-sm font-semibold leading-none">4 Live Demos</div>
                <div className="text-xs text-slate-500">InfinityFree / Free.je</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
