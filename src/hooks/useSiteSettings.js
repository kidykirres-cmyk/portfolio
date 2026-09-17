import { useEffect, useState } from 'react'
import { publicFetchSettings } from '../api'

export function useSiteSettings() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    publicFetchSettings()
      .then(r => setSettings(r.data || {}))
      .catch(() => setSettings({}))
      .finally(() => setLoading(false))
  }, [])

  return { settings, loading }
}
