import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

type AppRole = 'director' | 'assistant_director' | 'staff' | 'guest'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  roles: AppRole[]
  isDirector: boolean
  isAssistantDirector: boolean
  isStaff: boolean
  isAdmin: boolean
  canApprove: boolean
  canManageUsers: boolean
  highestRole: AppRole | null
  profile: any
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [roles, setRoles] = useState<AppRole[]>([])
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRoles(session.user.id)
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserRoles(session.user.id)
        fetchProfile(session.user.id)
      } else {
        setRoles([])
        setProfile(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserRoles = async (userId: string) => {
    const { data } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
    setRoles(data?.map(r => r.role) ?? [])
  }

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    setProfile(data)
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const isDirector = roles.includes('director')
  const isAssistantDirector = roles.includes('assistant_director')
  const isStaff = roles.includes('staff')
  const isAdmin = isDirector || isAssistantDirector
  const canApprove = isAdmin
  const canManageUsers = isDirector
  const highestRole = isDirector ? 'director' : isAssistantDirector ? 'assistant_director' : isStaff ? 'staff' : null

  return (
    <AuthContext.Provider value={{
      user, session, loading, roles, isDirector, isAssistantDirector, isStaff, isAdmin,
      canApprove, canManageUsers, highestRole, profile, signIn, signUp, signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
