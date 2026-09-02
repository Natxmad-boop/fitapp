import { useState } from 'react'
import { PinLogin } from './components/PinLogin'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return <PinLogin onLoginSuccess={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">¡Bienvenido a FitApp!</h1>
      <p className="text-gray-400 mb-6">Has iniciado sesión correctamente.</p>
      <button
        onClick={() => setIsAuthenticated(false)}
        className="px-4 py-2 bg-red-600 rounded-xl font-medium"
      >
        Cerrar sesión
      </button>
    </div>
  )
}
