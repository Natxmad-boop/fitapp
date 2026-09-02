import { useState } from 'react'
import { supabase } from '../supabaseClient'

export function PinLogin({ onLoginSuccess }: { onLoginSuccess: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleNumberClick = async (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num
      setPin(newPin)
      
      if (newPin.length === 4) {
        await verifyPin(newPin)
      }
    }
  }

  const verifyPin = async (enteredPin: string) => {
    setLoading(true)
    setError('')
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single()

      if (error || !data) {
        throw new Error('Usuario no encontrado')
      }

      // Validación temporal para comprobar el flujo de entrada
      onLoginSuccess()
    } catch (err: any) {
      setError('PIN incorrecto')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl mb-6 font-semibold">Introduce tu PIN</h2>
      <div className="flex space-x-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full border border-white ${i < pin.length ? 'bg-white' : 'bg-transparent'}`}
          />
        ))}
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            disabled={loading}
            className="p-4 bg-gray-800 rounded-xl text-xl font-bold active:bg-gray-700 transition"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => setPin('')}
          className="p-4 bg-red-900/50 rounded-xl text-sm font-medium col-span-3"
        >
          Borrar
        </button>
      </div>
    </div>
  )
}
