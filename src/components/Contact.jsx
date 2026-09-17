import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { sendContact } from '../api'
import { useSiteSettings } from '../hooks/useSiteSettings'

export default function Contact() {
  const { settings } = useSiteSettings()
  const contactEmail = settings?.email || 'gokulgokul4457@gmail.com'
  const contactPhone = settings?.phone || '+91 6380531946'
  const contactLocation = settings?.location || 'Sathyamangalam, Erode — Coimbatore ready'
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState({ loading: false, success: null, error: null })

  const onChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus({ loading: true, success: null, error: null })
    try {
      const res = await sendContact(form)
      setStatus({ loading: false, success: res.message || 'Message sent!', error: null })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors && Object.values(err.response.data.errors).flat().join(', ') || err.message
      setStatus({ loading: false, success: null, error: msg })
    }
  }

  return (
    <section id="contact" className="section bg-slate-50 dark:bg-white/[0.02] border-y border-slate-200 dark:border-white/5">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-10">
          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-5">
            <p className="eyebrow">Contact</p>
            <h2 className="font-display text-[30px] lg:text-[36px] font-bold tracking-tight">Let&apos;s build something great</h2>
            <p className="text-slate-600 dark:text-slate-300 mt-3 leading-7">
              I&apos;m open to <strong>Junior PHP Laravel Developer</strong> roles in Coimbatore. Reach me via the form — it sends email via <code className="px-1.5 py-0.5 rounded bg-white dark:bg-white/10 text-xs">POST /api/contact</code> using Laravel Mail.
            </p>

            <div className="mt-6 space-y-3">
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 card p-4 hover:shadow-md transition">
                <span className="w-10 h-10 grid place-items-center rounded-xl bg-indigo-600 text-white"><FaEnvelope /></span>
                <div>
                  <div className="text-sm font-semibold">Email</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{contactEmail}</div>
                </div>
              </a>
              <a href={`tel:${contactPhone.replace(/\s/g,'')}`} className="flex items-center gap-3 card p-4 hover:shadow-md transition">
                <span className="w-10 h-10 grid place-items-center rounded-xl bg-emerald-600 text-white"><FaPhone /></span>
                <div>
                  <div className="text-sm font-semibold">Phone</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{contactPhone}</div>
                </div>
              </a>
              <div className="flex items-center gap-3 card p-4">
                <span className="w-10 h-10 grid place-items-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900"><FaMapMarkerAlt /></span>
                <div>
                  <div className="text-sm font-semibold">Location</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">{contactLocation}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-2 text-xs">
              <a href="https://github.com/GokulK-24MCA26" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">GitHub</a>
              <a href="https://linkedin.com/in/gokulk887016" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">LinkedIn</a>
              <a href="https://gokulk.netlify.app" target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5">Netlify</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="lg:col-span-7">
            <form onSubmit={onSubmit} className="card p-6 lg:p-8">
              {status.success && (
                <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-sm">
                  <FaCheckCircle /> {status.success}
                </div>
              )}
              {status.error && (
                <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 text-sm">
                  <FaExclamationCircle /> {status.error}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Name *</label>
                  <input name="name" value={form.name} onChange={onChange} required className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f] focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <input type="email" name="email" value={form.email} onChange={onChange} required className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f] focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="you@example.com" />
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium">Subject</label>
                <input name="subject" value={form.subject} onChange={onChange} className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f] focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Project inquiry / Job opportunity" />
              </div>

              <div className="mt-4">
                <label className="text-sm font-medium">Message *</label>
                <textarea name="message" value={form.message} onChange={onChange} required rows={5} className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0a0a0f] focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Tell me about your project or role…" />
              </div>

              <button type="submit" disabled={status.loading} className="btn-primary w-full justify-center mt-6 disabled:opacity-60 disabled:cursor-not-allowed">
                {status.loading ? 'Sending…' : <><FaPaperPlane /> Send Message</>}
              </button>

              <p className="text-xs text-center text-slate-500 mt-3">Powered by Laravel Mail — messages stored in <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-white/10">contact_messages</code> table.</p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
