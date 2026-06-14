import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, registerUser } from '@/services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('tts_token'))
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Au démarrage : si un token existe dans localStorage, restaure la session
  useEffect(() => {
    const savedToken = localStorage.getItem('tts_token')
    const savedUser = localStorage.getItem('tts_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email, password) => {
    const data = await loginUser(email, password)
    setToken(data.access_token)
    setUser(data.user)
    localStorage.setItem('tts_token', data.access_token)
    localStorage.setItem('tts_user', JSON.stringify(data.user))
    navigate('/app/generate')
  }

  const register = async (name, email, password) => {
    await registerUser(name, email, password)
    await login(email, password)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('tts_token')
    localStorage.removeItem('tts_user')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}