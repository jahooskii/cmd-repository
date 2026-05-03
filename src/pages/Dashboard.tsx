import { useEffect, useState } from 'react'
import { AppLayout } from '../components/AppLayout'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export function Dashboard() {
  const { isAdmin } = useAuth()
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 })
  const [recentActivity, setRecentActivity] = useState<any[]>([])

  useEffect(() => {
    fetchStats()
    if (isAdmin) fetchRecentActivity()
  }, [isAdmin])

  const fetchStats = async () => {
    const { data } = await supabase.from('cmd_files').select('status')
    if (data) {
      setStats({
        total: data.length,
        approved: data.filter(f => f.status === 'approved').length,
        pending: data.filter(f => f.status === 'pending').length,
      })
    }
  }

  const fetchRecentActivity = async () => {
    const { data } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)
    setRecentActivity(data ?? [])
  }

  return (
    <AppLayout>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded shadow">
            <div className="text-gray-600">Total Documents</div>
            <div className="text-3xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <div className="text-gray-600">Approved</div>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <div className="text-gray-600">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-2">
              {recentActivity.length === 0 ? (
                <p className="text-gray-500">No recent activity</p>
              ) : (
                recentActivity.map((activity: any) => (
                  <div key={activity.id} className="text-sm text-gray-600 border-b pb-2">
                    {activity.action} - {new Date(activity.created_at).toLocaleString()}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
