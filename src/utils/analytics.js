// Google Analytics integration (optional)
// Set VITE_GA_ID in .env to enable, e.g. G-XXXXXXXXXX
export function initGA() {
  const id = import.meta.env.VITE_GA_ID
  if (!id || id === 'G-XXXXXXX') return
  // inject gtag script
  if (document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${id}"]`)) return
  const s = document.createElement('script')
  s.async = true
  s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(s)
  window.dataLayer = window.dataLayer || []
  function gtag(){ window.dataLayer.push(arguments) }
  window.gtag = gtag
  gtag('js', new Date())
  gtag('config', id, { send_page_view: true })
}

export function trackPageView(path) {
  if (window.gtag && import.meta.env.VITE_GA_ID) {
    window.gtag('config', import.meta.env.VITE_GA_ID, { page_path: path })
  }
}
