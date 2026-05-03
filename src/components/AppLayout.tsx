import { ReactNode } from 'react'
import { AppSidebar } from './AppSidebar'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
