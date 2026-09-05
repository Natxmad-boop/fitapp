import React, { useState, useEffect } from 'react';
import { useFitAppSupabase, UserProfile } from './hooks/useFitAppSupabase';
import { useWorkoutLogs, WorkoutLog } from './hooks/useWorkoutLogs';

export default function App() {
  const { profile, loading: profileLoading, error: profileError, updateProfile } = useFitAppSupabase();
  const { saveWorkoutLog, loading: logLoading, error: logError } = useWorkoutLogs();

  // Estado activo de navegación en la PWA (por ejemplo: 'dashboard', 'workout', 'profile')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'workout' | 'profile'>('dashboard');

  // Estado del formulario de entrenamiento
  const [exerciseName, setExerciseName] = useState('Sentadilla búlgara');
  const [weightUsed, setWeightUsed] = useState('40');
  const [repsCompleted, setRepsCompleted] = useState(12);
  const [setsCompleted, setSetsCompleted] = useState(4);
  const [perceivedExertion, setPerceivedExertion] = useState(8);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Estado local para edición de perfil
  const [nameInput, setNameInput] = useState('');
  const [weightInput, setWeightInput] = useState('70');

  useEffect(() => {
    if (profile) {
      setNameInput(profile.name || '');
      setWeightInput(String(profile.weight || 70));
    }
  }, [profile]);

  const handleWorkoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMsg(null);

    await saveWorkoutLog({
      exercise_name: exerciseName,
      weight_used: weightUsed,
      reps_completed: Number(repsCompleted),
      sets_completed: Number(setsCompleted),
      perceived_exertion: Number(perceivedExertion)
    });

    if (!logError) {
      setFeedbackMsg('¡Serie registrada con éxito en PostgreSQL! 🚀');
      setTimeout(() => setFeedbackMsg(null), 4000);
    }
  };

  const handleProfileUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: nameInput,
      weight: Number(weightInput)
    });
    setFeedbackMsg('¡Perfil actualizado correctamente en la nube! 💾');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  if (profileLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#09090b', color: '#f4f4f5', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #27272a', borderTop: '3px solid #38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginTop: '15px', fontSize: '0.95rem', letterSpacing: '0.5px' }}>Cargando FitApp Cloud...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div style={{ padding: '30px', color: '#ef4444', background: '#09090b', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ fontSize: '1.25rem' }}>Error crítico de sincronización</h2>
        <p style={{ fontSize: '0.9rem', color: '#a1a1aa' }}>{profileError}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', background: '#09090b', color: '#f4f4f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif', paddingBottom: '80px', boxSizing: 'border-box' }}>
      
      {/* Cabecera Superior Estilo App Móvil */}
      <header style={{ padding: '20px 20px 15px 20px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#09090b', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 700, background: 'linear-gradient(to right, #38bdf8, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FitApp Pro
          </h1>
          <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Cloud Database & PWA</span>
        </div>
        <div style={{ background: '#18181b', border: '1px solid #27272a', padding: '6px 12px', borderRadius: '20px', fontSize: '0.8rem', color: '#38bdf8' }}>
          🟢 {profile?.name || 'Atleta'}
        </div>
      </header>

      {/* Mensajes flotantes de feedback */}
      {feedbackMsg && (
        <div style={{ margin: '15px 20px 0 20px', padding: '12px', background: '#022c22', border: '1px solid #065f46', color: '#34d399', borderRadius: '8px', fontSize: '0.85rem', textAlign: 'center' }}>
          {feedbackMsg}
        </div>
      )}

      {/* Contenido Principal según la Pestaña Activa */}
      <main style={{ padding: '20px', flex: 1 }}>
        
        {/* VISTA 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)', border: '1px solid #3f3f46', borderRadius: '16px', padding: '20px' }}>
              <h2 style={{ fontSize: '1.1rem', margin: '0 0 8px 0', color: '#38bdf8' }}>Resumen del Sistema</h2>
              <p style={{ fontSize: '0.9rem', color: '#a1a1aa', margin: '0 0 15px 0' }}>Tu entorno está conectado de forma persistente a Supabase PostgreSQL.</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: '#09090b', padding: '12px', borderRadius: '10px', border: '1px solid #27272a' }}>
                  <span style={{ fontSize: '0.75rem', color: '#71717a', display: 'block' }}>Nivel Actual</span>
                  <strong style={{ fontSize: '0.95rem', color: '#f4f4f5' }}>{profile?.experience_level || 'Intermedio'}</strong>
                </div>
                <div style={{ background: '#09090b', padding: '12px', borderRadius: '10px', border: '1px solid #27272a' }}>
                  <span style={{ fontSize: '0.75rem', color: '#71717a', display: 'block' }}>Días / Semana</span>
                  <strong style={{ fontSize: '0.95rem', color: '#f4f4f5' }}>{profile?.training_days_per_week || 3} días</strong>
                </div>
              </div>
            </div>

            <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '20px' }}>
              <h3 style={{ fontSize: '1rem', margin: '0 0 10px 0', color: '#818cf8' }}>Acciones Rápidas</h3>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: '0 0 15px 0' }}>Selecciona una sección inferior para registrar series o modificar tus datos de rendimiento físico.</p>
              <button 
                onClick={() => setActiveTab('workout')}
                style={{ width: '100%', padding: '12px', background: '#38bdf8', color: '#09090b', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                Registrar Nuevo Entrenamiento ➔
              </button>
            </div>
          </div>
        )}

        {/* VISTA 2: REGISTRO DE ENTRENAMIENTO */}
        {activeTab === 'workout' && (
          <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 15px 0', color: '#818cf8' }}>Motor de Registro Físico</h2>
            
            <form onSubmit={handleWorkoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>Ejercicio</label>
                <input
                  type="text"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>Peso (kg)</label>
                  <input
                    type="text"
                    value={weightUsed}
                    onChange={(e) => setWeightUsed(e.target.value)}
                    style={{ width: '100%', padding: '12px', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', fontSize: '0.9rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>Repeticiones</label>
                  <input
                    type="number"
                    value={repsCompleted}
                    onChange={(e) => setRepsCompleted(Number(e.target.value))}
                    style={{ width: '100%', padding: '12px', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', fontSize: '0.9rem' }}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>Series</label>
                  <input
                    type="number"
                    value={setsCompleted}
                    onChange={(e) => setSetsCompleted(Number(e.target.value))}
                    style={{ width: '100%', padding: '12px', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', fontSize: '0.9rem' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>RPE (Esfuerzo 1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={perceivedExertion}
                    onChange={(e) => setPerceivedExertion(Number(e.target.value))}
                    style={{ width: '100%', padding: '12px', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', fontSize: '0.9rem' }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={logLoading}
                style={{
                  marginTop: '10px',
                  padding: '14px',
                  background: '#818cf8',
                  color: '#09090b',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem'
                }}
              >
                {logLoading ? 'Sincronizando con la nube...' : 'Guardar Serie en Supabase'}
              </button>
            </form>
          </div>
        )}

        {/* VISTA 3: CONFIGURACIÓN DE PERFIL */}
        {activeTab === 'profile' && (
          <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 15px 0', color: '#38bdf8' }}>Configurar Atleta</h2>
            
            <form onSubmit={handleProfileUpdateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>Nombre del Atleta</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>Peso Corporal (kg)</label>
                <input
                  type="number"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  style={{ width: '100%', padding: '12px', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', boxSizing: 'border-box', fontSize: '0.9rem' }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  marginTop: '10px',
                  padding: '14px',
                  background: '#38bdf8',
                  color: '#09090b',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.95rem'
                }}
              >
                Actualizar Datos de Perfil
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Barra de Navegación Inferior (Estilo PWA Nativa) */}
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: '#121214', borderTop: '1px solid #27272a', display: 'flex', justifyContent: 'space-around', padding: '12px 0', zIndex: 100, boxSizing: 'border-box' }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#38bdf8' : '#71717a', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab('workout')}
          style={{ background: 'none', border: 'none', color: activeTab === 'workout' ? '#818cf8' : '#71717a', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
        >
          🏋️ Entrenar
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          style={{ background: 'none', border: 'none', color: activeTab === 'profile' ? '#38bdf8' : '#71717a', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
        >
          ⚙️ Perfil
        </button>
      </nav>

    </div>
  );
}
