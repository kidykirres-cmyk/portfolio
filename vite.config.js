import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// InfinityFree AES bypass helper
async function fetchAesCode() {
  try {
    const r = await fetch('https://gokulk.freedev.app/aes.js', { headers: { 'User-Agent': 'Mozilla/5.0' } })
    if (!r.ok) return null
    return await r.text()
  } catch { return null }
}

function computeCookie(cHex, aesCode) {
  try {
    const vm = require('vm')
    const context = { vmResult: null }
    vm.createContext(context)
    const snippet = `
function toNumbers(d){var e=[];d.replace(/(..)/g,function(d){e.push(parseInt(d,16))});return e}
function toHex(){for(var d=[],d=1==arguments.length&&arguments[0].constructor==Array?arguments[0]:arguments,e="",f=0;f<d.length;f++)e+=(16>d[f]?"0":"")+d[f].toString(16);return e.toLowerCase()}
${aesCode}
var a=toNumbers("f655ba9d09a112d4968c63579db590b4"),b=toNumbers("98344c2eee86c3994890592585b49f80"),c=toNumbers("${cHex}");
vmResult=toHex(slowAES.decrypt(c,2,a,b));
`
    vm.runInContext(snippet, context)
    return context.vmResult
  } catch { return null }
}

async function getInfinityFreeCookie() {
  try {
    const aesCode = await fetchAesCode()
    if (!aesCode) return null
    // Fetch a challenge page to get c value
    const r = await fetch('https://gokulk.freedev.app/api/projects', { headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' } })
    const html = await r.text()
    if (!html.includes('aes.js')) {
      // No challenge, API returned JSON directly (maybe bypass already not needed)
      return null
    }
    const matches = [...html.matchAll(/toNumbers\("([a-f0-9]+)"\)/g)].map(m => m[1])
    const cHex = matches[2]
    if (!cHex) return null
    const cookie = computeCookie(cHex, aesCode)
    return cookie
  } catch { return null }
}

// Cache for the cookie with timestamp
let cookieCache = { value: null, fetchedAt: 0, promise: null }
const COOKIE_TTL = 5 * 60 * 1000 // 5 minutes

async function getFreshCookie() {
  const now = Date.now()
  if (cookieCache.value && (now - cookieCache.fetchedAt) < COOKIE_TTL) {
    return cookieCache.value
  }
  // Avoid concurrent fetches
  if (cookieCache.promise) {
    return cookieCache.promise
  }
  cookieCache.promise = getInfinityFreeCookie().then(cookie => {
    cookieCache.promise = null
    if (cookie) {
      cookieCache = { value: cookie, fetchedAt: Date.now(), promise: null }
      console.log('[vite] InfinityFree __test cookie refreshed:', cookie.slice(0, 8) + '...')
    }
    return cookie
  })
  return cookieCache.promise
}

// Pre-fetch cookie on startup and then periodically
function startCookieRefresher() {
  getFreshCookie() // initial fetch
  setInterval(() => {
    cookieCache = { value: null, fetchedAt: 0, promise: null } // force refresh
    getFreshCookie()
  }, COOKIE_TTL)
}

export default defineConfig(() => {
  startCookieRefresher()
  return {
    plugins: [react()],
    server: {
      port: 5173,
      host: '0.0.0.0',
      proxy: {
        // When VITE_API_URL is absolute (https://gokulk.freedev.app/api) axios bypasses proxy.
        // To benefit from InfinityFree bypass, dev mode now uses relative '/api' (see src/services/api.js)
        // These proxies add the __test cookie so InfinityFree returns JSON instead of aes.js HTML
        '/api': {
          target: 'https://gokulk.freedev.app',
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              // Use cached cookie synchronously - no await in proxyReq
              if (cookieCache.value) proxyReq.setHeader('Cookie', `__test=${cookieCache.value}`)
              proxyReq.setHeader('Accept', 'application/json')
              proxyReq.setHeader('User-Agent', 'Mozilla/5.0')
            })
            proxy.on('proxyRes', (proxyRes, req) => {
              // If InfinityFree still returns HTML challenge, invalidate cache to force refresh on next request
              const ct = proxyRes.headers['content-type'] || ''
              if (ct.includes('text/html')) {
                console.log(`[vite proxy] Got HTML for ${req.url} - InfinityFree challenge renewed, invalidating cookie cache`)
                cookieCache = { value: null, fetchedAt: 0, promise: null }
              }
            })
          }
        },
        '/storage': {
          target: 'https://gokulk.freedev.app',
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (cookieCache.value) proxyReq.setHeader('Cookie', `__test=${cookieCache.value}`)
            })
          }
        },
        '/sanctum': {
          target: 'https://gokulk.freedev.app',
          changeOrigin: true,
          secure: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (cookieCache.value) proxyReq.setHeader('Cookie', `__test=${cookieCache.value}`)
            })
          }
        },
      }
    },
    preview: { port: 5173 }
  }
})
