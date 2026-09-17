import { useEffect, useState } from 'react'
import { fetchProjects } from '../api'

export function useProjects(params = {}) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const key = JSON.stringify(params)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchProjects(params)
      .then(res => {
        if (!cancelled) setProjects(res.data || [])
      })
      .catch(err => {
        if (!cancelled) {
          const isInfinity = err.isInfinityFree || (err.response?.data && typeof err.response.data === 'string' && err.response.data.includes('aes.js'))
          if (isInfinity) {
            setError('InfinityFree verification blocked — restart vite (npm run dev) to refresh __test cookie. If new domain, wait for DNS 72h or use Google DNS 8.8.8.8. See vite console.')
          } else {
            const isNetwork = !err.response && err.message.includes('Network Error')
            setError(isNetwork ? 'Network Error — API unreachable (DNS 72h propagation? Try Google DNS 8.8.8.8 or wait)' : (err.response?.data?.message || err.message))
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return { projects, loading, error, setProjects }
}
