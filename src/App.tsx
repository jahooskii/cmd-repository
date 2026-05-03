import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './hooks/useAuth'
import { Toaster } from 'sonner'
import { Auth } from './pages/Auth'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="*" element={<Auth />} />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  )
}
