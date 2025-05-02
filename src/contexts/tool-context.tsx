'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ToolContextType {
  isToolLoading: boolean
  setToolLoading: (loading: boolean) => void
}

const ToolContext = createContext<ToolContextType | undefined>(undefined)

interface ToolProviderProps {
  children: ReactNode
}

export function ToolProvider({ children }: ToolProviderProps) {
  const [isToolLoading, setIsToolLoading] = useState(false)

  const setToolLoading = (loading: boolean) => {
    setIsToolLoading(loading)
  }

  return (
    <ToolContext.Provider
      value={{
        isToolLoading,
        setToolLoading,
      }}
    >
      {children}
    </ToolContext.Provider>
  )
}

export function useToolContext() {
  const context = useContext(ToolContext)
  if (context === undefined) {
    throw new Error('useToolContext must be used within a ToolProvider')
  }
  return context
}
