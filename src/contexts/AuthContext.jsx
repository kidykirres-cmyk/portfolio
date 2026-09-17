import { createContext, useContext, useEffect, useState } from 'react'
import { login as apiLogin, logout as apiLogout, me as apiMe } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('portfolio_token')
    if (!token) { setLoading(false); return }
    apiMe().then(r => setUser(r.user)).catch(() => {
      localStorage.removeItem('portfolio_token')
      setUser(null)
    }).finally(() => setLoading(false))
  }, [])

  const login = async (email, password, remember = false) => {
    const res = await apiLogin({ email, password, remember })
    localStorage.setItem('portfolio_token', res.token)
    setUser(res.user)
    return res
  }

  const logout = async () => {
    try { await apiLogout() } catch {}
    localStorage.removeItem('portfolio_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
