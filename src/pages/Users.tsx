import { useEffect, useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { Navigate } from 'react-router-dom'

export function Users() {
  const { isDirector } = useAuth()
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    if (isDirector) fetchUsers()
  }, [isDirector])

  const fetchUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, user_roles(role)')
    setUsers(data ?? [])
  }

  if (!isDirector) return <Navigate to="/dashboard" />

  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3">{user.full_name}</td>
                  <td className="px-6 py-3">{user.email}</td>
                  <td className="px-6 py-3">
                    {user.user_roles?.[0]?.role || 'staff'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
