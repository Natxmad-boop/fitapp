import React, { useState } from 'react';
import { useFitAppSupabase } from './hooks/useFitAppSupabase';
import { useWorkoutLogs } from './hooks/useWorkoutLogs';

export default function App() {
  const { profile, loading: profileLoading, error: profileError, updateProfile } = useFitAppSupabase();
  const { saveWorkoutLog, loading: logLoading, error: logError } = useWorkoutLogs();

  // Estados para el formulario de registro de entrenamiento
  const [exerciseName, setExerciseName] = useState('Sentadilla libre');
  const [weightUsed, setWeightUsed] = useState('60');
  const [repsCompleted, setRepsCompleted] = useState(10);
  const [setsCompleted, setSetsCompleted] = useState(3);
  const [perceivedExertion, setPerceivedExertion] = useState(8);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    await saveWorkoutLog({
      exercise_name: exerciseName,
      weight_used: weightUsed,
      reps_completed: Number(repsCompleted),
      sets_completed: Number(setsCompleted),
      perceived_exertion: Number(perceivedExertion)
    });

    if (!logError) {
      setSuccessMessage('¡Entrenamiento registrado y guardado en Supabase con éxito! 💪');
    }
  };

  if (profileLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'system-ui, sans-serif', background: '#09090b', color: '#f4f4f5' }}>
        <p>Cargando tu ecosistema FitApp...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div style={{ padding: '20px', color: '#ef4444', fontFamily: 'system-ui, sans-serif', background: '#09090b', height: '100vh' }}>
        <h2>Error de sincronización</h2>
        <p>{profileError}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', padding: '20px', fontFamily: 'system-ui, sans-serif', color: '#f4f4f5', background: '#09090b', minHeight: '100vh' }}>
      
      {/* Cabecera */}
      <header style={{ borderBottom: '1px solid #27272a', paddingBottom: '15px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', margin: '0 0 5px 0', background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          FitApp Cloud Pro
        </h1>
        <p style={{ color: '#a1a1aa', margin: 0, fontSize: '0.95rem' }}>PWA con motor PostgreSQL y Supabase</p>
      </header>

      {/* Tarjeta de Perfil */}
      {profile ? (
        <section style={{ background: '#18181b', border: '1px solid #27272a', padding: '20px', borderRadius: '12px', marginBottom: '25px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#38bdf8' }}>Perfil del Atleta</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', color: '#d4d4d8' }}>
            <p style={{ margin: 0 }}><strong>Nombre:</strong> {profile.name}</p>
            <p style={{ margin: 0 }}><strong>Edad:</strong> {profile.age} años</p>
            <p style={{ margin: 0 }}><strong>Nivel:</strong> {profile.experience_level}</p>
            <p style={{ margin: 0 }}><strong>Objetivo:</strong> {profile.goals?.join(', ')}</p>
          </div>

          <button
            onClick={() => updateProfile({ name: profile.name + ' 🔥' })}
            style={{
              marginTop: '15px',
              padding: '8px 14px',
              background: '#27272a',
              color: '#fff',
              border: '1px solid #3f3f46',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            Añadir Motivación al Nombre
          </button>
        </section>
      ) : (
        <p style={{ color: '#a1a1aa' }}>Inicia sesión para cargar tu perfil de atleta.</p>
      )}

      {/* Motor de Registro de Entrenamientos */}
      <section style={{ background: '#18181b', border: '1px solid #27272a', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#818cf8' }}>Registrar Serie de Fuerza</h3>
        
        <form onSubmit={handleWorkoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '4px' }}>Ejercicio</label>
            <input
              type="text"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '4px' }}>Peso (kg)</label>
              <input
                type="text"
                value={weightUsed}
                onChange={(e) => setWeightUsed(e.target.value)}
                style={{ width: '100%', padding: '10px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '4px' }}>Reps</label>
              <input
                type="number"
                value={repsCompleted}
                onChange={(e) => setRepsCompleted(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '4px' }}>Series</label>
              <input
                type="number"
                value={setsCompleted}
                onChange={(e) => setSetsCompleted(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '4px' }}>Esfuerzo (RPE 1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={perceivedExertion}
                onChange={(e) => setPerceivedExertion(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', background: '#27272a', border: '1px solid #3f3f46', borderRadius: '6px', color: '#fff', boxSizing: 'border-box' }}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={logLoading}
            style={{
              marginTop: '10px',
              padding: '12px',
              background: '#38bdf8',
              color: '#09090b',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem'
            }}
          >
            {logLoading ? 'Guardando en la nube...' : 'Registrar Entrenamiento'}
          </button>
        </form>

        {successMessage && (
          <p style={{ marginTop: '12px', color: '#4ade80', fontSize: '0.9rem', textAlign: 'center' }}>{successMessage}</p>
        )}
        {logError && (
          <p style={{ marginTop: '12px', color: '#ef4444', fontSize: '0.9rem', textAlign: 'center' }}>{logError}</p>
        )}
      </section>

    </div>
  );
}
