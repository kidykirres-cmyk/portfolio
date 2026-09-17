import { motion } from 'framer-motion'
import { FaCheckCircle, FaCode, FaDatabase, FaServer, FaTools, FaGraduationCap, FaBriefcase } from 'react-icons/fa'
import { useSiteSettings } from '../hooks/useSiteSettings'
import { useEffect, useState } from 'react'
import { api } from '../api'

const fallbackSkills = [
  { label: 'PHP / Laravel', value: 90 },
  { label: 'MySQL / Database Design', value: 85 },
  { label: 'REST API / Eloquent ORM', value: 88 },
  { label: 'JavaScript / jQuery / AJAX', value: 80 },
  { label: 'Java / Spring Boot', value: 70 },
  { label: 'Git / GitHub / Debugging', value: 85 },
]

export default function About() {
  const { settings } = useSiteSettings()
  const profileImage = settings?.profile_image || null
  const [skills, setSkills] = useState(fallbackSkills)
  useEffect(() => {
    api.get('/skills').then(r => {
      const data = r.data.data || r.data
      if (Array.isArray(data) && data.length > 0) {
        setSkills(data.map(s => ({ label: s.name, value: s.proficiency })))
      }
    }).catch(() => {})
  }, [])
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="flex items-start gap-4">
              {profileImage && <img src={profileImage} alt="Gokul K" className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-200 dark:border-white/10 shadow-md hidden sm:block" />}
              <div>
                <p className="eyebrow">About Me</p>
                <h2 className="font-display text-[30px] lg:text-[36px] font-bold tracking-tight mt-1 leading-tight">
                  Junior Laravel Developer <br /> who ships <span className="text-indigo-600">real products.</span>
                </h2>
              </div>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-300 leading-7">
              I&apos;m <strong>Gokul K</strong> from Sathyamangalam (Erode) — MCA at KGiSL Institute of Information Management (CGPA 8.1, 2024–2026) and B.Sc CS from Gobi Arts & Science College (CGPA 7.8).
              At <strong>KG Genius Labs, Coimbatore</strong> (Software Developer Trainee), I worked on a live garment-sector billing & inventory system — billing, inventory, product & customer management, auth & RBAC — using PHP, Laravel, MySQL, HTML/CSS/JS/Bootstrap, REST APIs, Magento catalog sync & Frappe reporting.
            </p>
            <ul className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
              {[
                'MVC, PHP OOP, CRUD, Auth & RBAC',
                'Third-party API integration',
                'Query optimization & report generation',
                'Git/GitHub, code reviews, production support',
              ].map(t => (
                <li key={t} className="flex gap-2 items-start"><FaCheckCircle className="text-emerald-500 mt-0.5" /> <span>{t}</span></li>
              ))}
            </ul>
            <div className="flex gap-3 mt-6">
              <a href="#resume" className="btn-primary">View Resume Timeline</a>
              <a href="#contact" className="btn-outline">Contact Me</a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7"
          >
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-9 h-9 grid place-items-center rounded-xl bg-indigo-600 text-white"><FaCode /></span>
                <h3 className="font-semibold">Skills — animated proficiency</h3>
              </div>
              <div className="space-y-4">
                {skills.map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between text-sm font-medium mb-1.5">
                      <span>{s.label}</span><span className="text-slate-500">{s.value}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                {[
                  { icon: FaServer, label: 'Backend', desc: 'Laravel, Eloquent, REST' },
                  { icon: FaCode, label: 'Frontend', desc: 'Blade, Bootstrap, Tailwind' },
                  { icon: FaDatabase, label: 'Database', desc: 'MySQL, Query Opt.' },
                  { icon: FaTools, label: 'Tools', desc: 'Git, Postman, Laragon' },
                ].map(c => (
                  <div key={c.label} className="rounded-2xl border border-slate-200 dark:border-white/10 p-4 bg-slate-50 dark:bg-white/[0.03]">
                    <c.icon className="text-indigo-600 mb-2" />
                    <div className="text-sm font-semibold">{c.label}</div>
                    <div className="text-xs text-slate-500">{c.desc}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
                <div className="card p-4 flex gap-3">
                  <FaBriefcase className="text-indigo-600 mt-1" />
                  <div>
                    <div className="font-semibold">KG Genius Labs — Coimbatore</div>
                    <div className="text-slate-500 text-xs">Software Developer Trainee • Garment Billing & Inventory</div>
                  </div>
                </div>
                <div className="card p-4 flex gap-3">
                  <FaGraduationCap className="text-indigo-600 mt-1" />
                  <div>
                    <div className="font-semibold">MCA — KGiSL (8.1)</div>
                    <div className="text-slate-500 text-xs">2024–2026 • B.Sc CS 7.8 (2021–24)</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
