import { motion } from 'framer-motion'
import { FaGraduationCap, FaBriefcase, FaAward, FaDownload, FaExternalLinkAlt } from 'react-icons/fa'

const timeline = [
  {
    type: 'experience',
    title: 'Software Developer Trainee — KG Genius Labs, Coimbatore',
    date: '2025 • 6 months',
    points: [
      'Built real-time garment billing & inventory management (PHP, Laravel, MySQL, Bootstrap, jQuery).',
      'Developed billing, inventory, product/customer management, auth & RBAC (OOP & MVC).',
      'Built & consumed REST APIs; synced Magento product catalog (categories, attributes, names).',
      'Worked with Frappe (Python) for business reports & optimized SQL for filtering/performance.',
      'Collaborated on requirement analysis, troubleshooting, testing, code reviews; Git/GitHub.',
    ],
  },
  {
    type: 'education',
    title: 'Master of Computer Applications (MCA) — KGiSL Institute of Information Management, Coimbatore',
    date: '2024 – 2026 • CGPA 8.1',
    points: ['Focused on full-stack & backend engineering; Laravel, MySQL, REST APIs, system design.'],
  },
  {
    type: 'education',
    title: 'B.Sc Computer Science — Gobi Arts & Science College, Gobichettipalayam',
    date: '2021 – 2024 • CGPA 7.8',
    points: ['Foundation in CS, programming & databases.'],
  },
  {
    type: 'cert',
    title: 'IBM Full Stack Software Developer Professional Certificate — Coursera',
    date: '2025',
    points: ['Front-end (HTML/CSS/JS/React), back-end (Node/Express/Python), DB, DevOps, cloud-native; REST, Git, Docker, K8s, CI/CD.'],
  },
  {
    type: 'cert',
    title: 'Project Completion Certificate — Garment Billing & Inventory Management — KG Genius Labs',
    date: '2025',
    points: ['End-to-end delivery: analysis, DB design, Laravel/MySQL backend, frontend, testing & deployment on Free.je.'],
  },
]

const iconFor = (type) => {
  if (type === 'experience') return FaBriefcase
  if (type === 'education') return FaGraduationCap
  return FaAward
}

export default function Resume() {
  return (
    <section id="resume" className="section bg-slate-50 dark:bg-white/[0.02] border-y border-slate-200 dark:border-white/5">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <p className="eyebrow">Resume</p>
            <h2 className="font-display text-[30px] lg:text-[36px] font-bold tracking-tight">Education & Experience</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">Timeline with scroll animations — seeking Junior PHP Laravel Developer opportunities in Coimbatore.</p>
          </div>
          <a href="/resume.pdf" download className="btn-primary"><FaDownload /> Download Resume PDF</a>
        </div>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />
          <div className="space-y-6">
            {timeline.map((item, i) => {
              const Icon = iconFor(item.type)
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="relative flex gap-4 sm:gap-6"
                >
                  <span className="hidden sm:grid w-12 h-12 place-items-center rounded-full bg-white dark:bg-[#111117] border border-slate-200 dark:border-white/10 shadow-sm shrink-0">
                    <Icon className={item.type === 'experience' ? 'text-indigo-600' : item.type === 'education' ? 'text-emerald-600' : 'text-amber-500'} />
                  </span>
                  <div className="card p-6 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-semibold leading-snug flex-1 min-w-[220px]">{item.title}</h3>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">{item.date}</span>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300 list-disc pl-5">
                      {item.points.map((p, idx) => <li key={idx}>{p}</li>)}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <a href="https://github.com/GokulK-24MCA26" target="_blank" rel="noreferrer" className="btn-outline"><FaExternalLinkAlt /> GitHub</a>
          <a href="https://linkedin.com/in/gokulk887016" target="_blank" rel="noreferrer" className="btn-outline"><FaExternalLinkAlt /> LinkedIn</a>
        </div>
      </div>
    </section>
  )
}
