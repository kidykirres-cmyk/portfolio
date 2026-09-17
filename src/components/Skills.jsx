import { motion } from 'framer-motion'
import { FaPhp, FaLaravel, FaJs, FaJava, FaHtml5, FaCss3Alt, FaGitAlt, FaDatabase, FaReact, FaNodeJs } from 'react-icons/fa'
import { SiMysql, SiSpringboot, SiJquery, SiTailwindcss, SiBootstrap, SiComposer, SiPostman } from 'react-icons/si'

const groups = [
  {
    title: 'Languages',
    items: [
      { icon: FaPhp, label: 'PHP', color: 'text-indigo-500' },
      { icon: FaJs, label: 'JavaScript', color: 'text-amber-500' },
      { icon: FaJava, label: 'Java', color: 'text-red-500' },
      { icon: SiMysql, label: 'SQL', color: 'text-sky-600' },
      { icon: FaHtml5, label: 'HTML5', color: 'text-orange-500' },
      { icon: FaCss3Alt, label: 'CSS3', color: 'text-sky-500' },
    ]
  },
  {
    title: 'Backend',
    items: [
      { icon: FaLaravel, label: 'Laravel', color: 'text-red-600' },
      { icon: SiSpringboot, label: 'Spring Boot', color: 'text-emerald-600' },
      { icon: FaDatabase, label: 'Eloquent ORM', color: 'text-violet-600' },
      { icon: FaNodeJs, label: 'REST API', color: 'text-emerald-500' },
      { icon: SiMysql, label: 'MySQL', color: 'text-sky-600' },
    ]
  },
  {
    title: 'Frontend',
    items: [
      { icon: SiTailwindcss, label: 'Tailwind', color: 'text-cyan-500' },
      { icon: SiBootstrap, label: 'Bootstrap', color: 'text-violet-600' },
      { icon: SiJquery, label: 'jQuery / AJAX', color: 'text-sky-600' },
      { icon: FaReact, label: 'Blade / React', color: 'text-sky-400' },
    ]
  },
  {
    title: 'Tools & Concepts',
    items: [
      { icon: FaGitAlt, label: 'Git/GitHub', color: 'text-orange-600' },
      { icon: SiComposer, label: 'Composer', color: 'text-amber-700' },
      { icon: SiPostman, label: 'Postman', color: 'text-orange-500' },
      { icon: FaDatabase, label: 'MVC / RBAC', color: 'text-slate-600 dark:text-slate-300' },
    ]
  },
]

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto">
          <p className="eyebrow">Tech Stack</p>
          <h2 className="font-display text-[30px] lg:text-[36px] font-bold tracking-tight">Tools I use to ship</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Hover for subtle zoom & shadow — polished for a professional portfolio. AI tools: Amazon Q, Claude, OpenCode.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          {groups.map((g, idx) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.07 }}
              className="card p-5"
            >
              <h3 className="font-semibold mb-4">{g.title}</h3>
              <div className="grid grid-cols-2 gap-3">
                {g.items.map(it => (
                  <div key={it.label} className="group flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/5 hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <it.icon className={`text-lg ${it.color} group-hover:scale-110 transition`} />
                    <span className="text-sm font-medium">{it.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="card mt-6 p-5 flex flex-wrap gap-2 items-center justify-center">
          {['PHP OOP','MVC','CRUD','Authentication','RBAC','Security','Debugging','Exception Handling','Code Reviews','Testing','Query Optimization','Vite','Responsive Design','AdminLTE','Hibernate','Spring Data JPA'].map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
