import { FaGithub, FaLinkedin, FaEnvelope, FaHeart, FaArrowUp } from 'react-icons/fa'
import { useSiteSettings } from '../hooks/useSiteSettings'

export default function Footer() {
  const { settings } = useSiteSettings()
  const githubUrl = settings?.github_url || 'https://github.com/GokulK-24MCA26'
  const linkedinUrl = settings?.linkedin_url || 'https://linkedin.com/in/gokulk887016'
  const email = settings?.email || 'gokulgokul4457@gmail.com'
  const phone = settings?.phone || '+91 6380531946'
  const resumeUrl = settings?.resume_pdf || '/resume.pdf'
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f]">
      <div className="container py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 grid place-items-center rounded-xl bg-indigo-600 text-white font-bold">GK</span>
              <span className="font-display font-bold">Gokul K</span>
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10">PHP Laravel Developer</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 max-w-md">
              Building secure, fast Laravel applications — ERP, billing & e-commerce. MCA 8.1 • KG Genius Labs trainee • Coimbatore.
            </p>
            <p className="text-xs text-slate-500 mt-3">
              <a href={resumeUrl} download target={resumeUrl.startsWith('http') ? '_blank' : undefined} className="underline hover:text-indigo-600">Download Resume PDF</a> • <a href={`mailto:${email}`} className="underline hover:text-indigo-600">{email}</a> • {phone}
            </p>
          </div>

          <div className="flex gap-10 text-sm">
            <div>
              <div className="font-semibold mb-3">Explore</div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><a href="#about" className="hover:text-indigo-600">About</a></li>
                <li><a href="#resume" className="hover:text-indigo-600">Resume</a></li>
                <li><a href="#projects" className="hover:text-indigo-600">Projects</a></li>
                <li><a href="#contact" className="hover:text-indigo-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3">Social</div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><a href={githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-indigo-600"><FaGithub /> GitHub</a></li>
                <li><a href={linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-indigo-600"><FaLinkedin /> LinkedIn</a></li>
                <li><a href="https://gokulk.netlify.app" target="_blank" rel="noreferrer" className="hover:text-indigo-600">Netlify Portfolio</a></li>
                <li><a href={`mailto:${email}`} className="inline-flex items-center gap-2 hover:text-indigo-600"><FaEnvelope /> Email</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-8 pt-6 border-t border-slate-200 dark:border-white/10 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Gokul K. Built with Laravel + React + Tailwind + Framer Motion.</span>
          <span className="inline-flex items-center gap-1">Crafted with <FaHeart className="text-red-500" /> in Coimbatore</span>
          <a href="#home" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">
            Back to top <FaArrowUp />
          </a>
        </div>
      </div>
    </footer>
  )
}
