import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { FileText, BarChart3, Users, Settings, LogOut } from 'lucide-react'

export function AppSidebar() {
  const { isAdmin, signOut } = useAuth()

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">CMD Repository</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/dashboard" className="block px-4 py-2 rounded hover:bg-gray-800">
          <BarChart3 className="inline mr-2 w-4 h-4" />
          Dashboard
        </Link>
        <Link to="/repository" className="block px-4 py-2 rounded hover:bg-gray-800">
          <FileText className="inline mr-2 w-4 h-4" />
          Repository
        </Link>
        {isAdmin && (
          <>
            <Link to="/users" className="block px-4 py-2 rounded hover:bg-gray-800">
              <Users className="inline mr-2 w-4 h-4" />
              Users
            </Link>
            <Link to="/settings" className="block px-4 py-2 rounded hover:bg-gray-800">
              <Settings className="inline mr-2 w-4 h-4" />
              Settings
            </Link>
          </>
        )}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={signOut}
          className="w-full px-4 py-2 bg-red-600 rounded hover:bg-red-700 flex items-center justify-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
