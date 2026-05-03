import { useState, useEffect } from 'react'
import { AppLayout } from '../components/AppLayout'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { formatBytes, statusTone } from '../lib/format'
import { Upload, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

export function RepositoryMaster() {
  const { user, canApprove } = useAuth()
  const [files, setFiles] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [showUpload, setShowUpload] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    fetchFiles()
  }, [])

  const fetchFiles = async () => {
    const { data } = await supabase
      .from('cmd_files')
      .select('*')
      .order('created_at', { ascending: false })
    setFiles(data ?? [])
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !file) return
    setUploading(true)
    try {
      const timestamp = Date.now()
      const storagePath = `${user.id}/master/${timestamp}-${file.name}`
      
      const { error: uploadError } = await supabase.storage
        .from('cmd-files')
        .upload(storagePath, file)
      
      if (uploadError) throw uploadError

      await supabase.from('cmd_files').insert({
        title: title || file.name,
        description,
        storage_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        status: 'pending',
        repository: 'master',
        uploaded_by: user.id,
      })

      toast.success('File uploaded successfully!')
      setShowUpload(false)
      setTitle('')
      setDescription('')
      setFile(null)
      fetchFiles()
    } catch (error) {
      toast.error((error as Error).message)
    } finally {
      setUploading(false)
    }
  }

  const handleApprove = async (fileId: string) => {
    try {
      await supabase
        .from('cmd_files')
        .update({ status: 'approved' })
        .eq('id', fileId)
      toast.success('File approved')
      fetchFiles()
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  const handleReject = async (fileId: string) => {
    try {
      await supabase
        .from('cmd_files')
        .update({ status: 'rejected' })
        .eq('id', fileId)
      toast.success('File rejected')
      fetchFiles()
    } catch (error) {
      toast.error((error as Error).message)
    }
  }

  return (
    <AppLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Repository</h1>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </button>
        </div>

        {showUpload && (
          <div className="bg-white p-6 rounded shadow mb-8">
            <form onSubmit={handleUpload} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                rows={3}
              />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="w-full px-4 py-2 border rounded"
                required
              />
              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">File Name</th>
                <th className="px-6 py-3 text-left">Size</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file: any) => (
                <tr key={file.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3">{file.file_name}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{formatBytes(file.file_size)}</td>
                  <td className="px-6 py-3">
                    <span className={`px-3 py-1 rounded text-sm ${statusTone[file.status] || 'bg-gray-100'}`}>
                      {file.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 space-x-2">
                    {canApprove && file.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(file.id)}
                          className="text-green-600 hover:underline text-sm"
                        >
                          <CheckCircle className="inline w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(file.id)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          <XCircle className="inline w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
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
