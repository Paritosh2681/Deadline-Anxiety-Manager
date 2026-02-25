'use client'

import { createContext, useContext, ReactNode, useCallback } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'

interface AuthUser {
    id: string
    name: string
    email: string
}

interface AuthContextValue {
    user: AuthUser | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    signup: (name: string, email: string, password: string) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const fetcher = async (url: string) => {
    const res = await fetch(url)
    if (!res.ok) return { user: null }
    return res.json()
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const { data, isLoading, mutate } = useSWR('/api/auth/me', fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 60000,
    })

    const user = data?.user ?? null

    const login = useCallback(async (email: string, password: string) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Login failed')
        await mutate({ user: json.user }, false)
        router.push('/dashboard')
    }, [mutate, router])

    const signup = useCallback(async (name: string, email: string, password: string) => {
        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Signup failed')
        await mutate({ user: json.user }, false)
        router.push('/dashboard')
    }, [mutate, router])

    const logout = useCallback(async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        await mutate({ user: null }, false)
        window.location.href = '/login'
    }, [mutate])

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
