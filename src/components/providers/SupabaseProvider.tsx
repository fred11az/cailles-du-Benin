'use client'

import { useSupabaseSync } from '@/hooks/useSupabaseSync'
import { createContext, useContext, ReactNode } from 'react'

interface SupabaseContextType {
  isLoading: boolean
  isConnected: boolean
  error: string | null
  isSupabaseConfigured: boolean
}

const SupabaseContext = createContext<SupabaseContextType>({
  isLoading: true,
  isConnected: false,
  error: null,
  isSupabaseConfigured: false,
})

export function useSupabaseContext() {
  return useContext(SupabaseContext)
}

export default function SupabaseProvider({ children }: { children: ReactNode }) {
  const { isLoading, isConnected, error, isSupabaseConfigured } = useSupabaseSync()

  return (
    <SupabaseContext.Provider value={{ isLoading, isConnected, error, isSupabaseConfigured }}>
      {children}
    </SupabaseContext.Provider>
  )
}
