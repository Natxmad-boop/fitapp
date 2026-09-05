import React, { useState, useEffect } from 'react';
import { useFitAppSupabase } from './hooks/useFitAppSupabase';
import { useWorkoutLogs } from './hooks/useWorkoutLogs';

export default function App() {
  const { profile, loading: profileLoading, error: profileError, updateProfile } = useFitAppSupabase();
  const { saveWorkoutLog, loading: logLoading } = useWorkoutLogs();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'activeWorkout' | 'profile'>('dashboard');

  // Estado del Reproductor Activo de Rutina (El "Play" que faltaba)
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [weightInput, setWeightInput] = useState('60');
  const [repsInput, setRepsInput] = useState('10');
  const [rpeInput, setRpeInput] = useState('8');
  
  // Temporizador de descanso entre series
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Lista de ejercicios de la rutina activa de hoy
  const activeRoutineExercises = [
    { name: 'Sentadilla Libre (Squat)', targetSets: 4, targetReps: 10, defaultWeight: '70' },
    { name: 'Press de Banca Plano', targetSets: 4, targetReps: 8, defaultWeight: '60' },
    { name: 'Remo con Barra', targetSets: 3, targetReps: 12, defaultWeight: '50' },
    { name: 'Plancha Abdominal Isométrica', targetSets: 3, targetReps: 45, defaultWeight: '0' }
  ];

  const currentExercise = activeRoutineExercises[currentExerciseIndex];

  // Efecto para el temporizador de descanso
  useEffect(() => {
    let timer: any;
    if (isResting && restTimeLeft > 0) {
      timer = setInterval(() => {
        setRestTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (restTimeLeft === 0) {
      setIsResting(false);
    }
    return () => clearInterval(timer);
  }, [isResting, restTimeLeft]);

  // Manejar el guardado de una serie y pasar al descanso
  const handleCompleteSet = async () => {
    await saveWorkoutLog({
      exercise_name: currentExercise.name,
      weight_used: weightInput,
      reps_completed: Number(repsInput),
      sets_completed: currentSet,
      perceived_exertion: Number(rpeInput)
    });

    // Activar descanso de 60 segundos
    setRestTimeLeft(60);
    setIsResting(true);

    if (currentSet < currentExercise.targetSets) {
      setCurrentSet((prev) => prev + 1);
    } else {
      // Siguiente ejercicio si terminamos las series de este
      if (currentExerciseIndex < activeRoutineExercises.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSet(1);
        setWeightInput(activeRoutineExercises[currentExerciseIndex + 1].defaultWeight);
      } else {
        setWorkoutStarted(false);
        alert('¡Entrenamiento completado y sincronizado con éxito en Supabase! 🏆');
      }
    }
  };

  if (profileLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#09090b', color: '#f4f4f5', fontFamily: 'system-ui, sans-serif' }}>
        <p>Cargando núcleo FitApp...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div style={{ padding: '30px', color: '#ef4444', background: '#09090b', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <h2>Error de Supabase</h2>
        <p>{profileError}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', background: '#09090b', color: '#f4f4f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif', paddingBottom: '90px', boxSizing: 'border-box' }}>
      
      {/* Cabecera */}
      <header style={{ padding: '20px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#09090b', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h1 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: '#38bdf8' }}>FitApp Cloud PWA</h1>
          <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Atleta: {profile?.name || 'Usuario'}</span>
        </div>
        <div style={{ background: '#18181b', border: '1px solid #27272a', padding: '4px 10px', borderRadius: '15px', fontSize: '0.75rem', color: '#4ade80' }}>
          ● Online
        </div>
      </header>

      <main style={{ padding: '20px', flex: 1 }}>
        
        {/* VISTA 1: DASHBOARD GENERAL */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '20px' }}>
              <h2 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', color: '#38bdf8' }}>Rutina Activa Programada</h2>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: '0 0 15px 0' }}>Sesión de fuerza enfocada en hipertrofia y desarrollo funcional.</p>
              
              <div style={{ background: '#09090b', padding: '12px', borderRadius: '10px', border: '1px solid #27272a', marginBottom: '15px' }}>
                <span style={{ fontSize: '0.75rem', color: '#71717a', display: 'block' }}>Ejercicios incluidos:</span>
                <ul style={{ margin: '5px 0 0 15px', padding: 0, fontSize: '0.85rem', color: '#d4d4d8' }}>
                  {activeRoutineExercises.map((ex, i) => (
                    <li key={i}>{ex.name} ({ex.targetSets} series)</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setWorkoutStarted(true);
                  setActiveTab('activeWorkout');
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(56, 189, 248, 0.3)'
                }}
              >
                ▶ Empezar Rutina Ahora (Play)
              </button>
            </div>
          </div>
        )}

        {/* VISTA 2: REPRODUCTOR ACTIVO DE ENTRENAMIENTO (PLAY) */}
        {activeTab === 'activeWorkout' && (
          <div>
            {!workoutStarted ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: '#18181b', borderRadius: '16px', border: '1px solid #27272a' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>¿Listo para entrenar?</h2>
                <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '20px' }}>Inicia el motor de reproducción para cronometrar tus series y guardar en Supabase.</p>
                <button
                  onClick={() => setWorkoutStarted(true)}
                  style={{ padding: '14px 28px', background: '#38bdf8', color: '#09090b', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  ▶ Iniciar Sesión
                </button>
              </div>
            ) : (
              <div style={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '16px', padding: '20px' }}>
                
                {/* Panel de Descanso Activo */}
                {isResting ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', background: '#09090b', borderRadius: '12px', border: '1px solid #ef4444', marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase' }}>Tiempo de Descanso</span>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: '#f4f4f5', margin: '10px 0' }}>0:{restTimeLeft < 10 ? `0${restTimeLeft}` : restTimeLeft}</div>
                    <button 
                      onClick={() => { setIsResting(false); setRestTimeLeft(0); }}
                      style={{ padding: '6px 14px', background: '#27272a', color: '#fff', border: '1px solid #3f3f46', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Saltar Descanso ⏭
                    </button>
                  </div>
                ) : null}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    Ejercicio {currentExerciseIndex + 1} de {activeRoutineExercises.length}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', background: '#09090b', padding: '4px 8px', borderRadius: '6px', border: '1px solid #27272a' }}>
                    Serie {currentSet} / {currentExercise.targetSets}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.25rem', margin: '0 0 20px 0', color: '#f4f4f5' }}>{currentExercise.name}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>Peso Utilizado (kg)</label>
                    <input
                      type="text"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      style={{ width: '100%', padding: '12px', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>Repeticiones</label>
                      <input
                        type="number"
                        value={repsInput}
                        onChange={(e) => setRepsInput(e.target.value)}
                        style={{ width: '100%', padding: '12px', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>Esfuerzo (RPE 1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={rpeInput}
                        onChange={(e) => setRpeInput(e.target.value)}
                        style={{ width: '100%', padding: '12px', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCompleteSet}
                  disabled={logLoading || isResting}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#4ade80',
                    color: '#09090b',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  {logLoading ? 'Guardando en Supabase...' : '✓ Registrar Serie y Descansar'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* VISTA 3: PERFIL */}
        {activeTab === 'profile' && (
          <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '20px' }}>
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 15px 0', color: '#38bdf8' }}>Perfil del Atleta</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Nombre:</strong> {profile?.name}</p>
              <p style={{ margin: 0, fontSize: '0.9rem' }}><strong>Nivel:</strong> {profile?.experience_level}</p>
              <button
                onClick={() => updateProfile({ name: profile?.name + ' ⚡' })}
                style={{ marginTop: '10px', padding: '10px', background: '#27272a', color: '#fff', border: '1px solid #3f3f46', borderRadius: '8px', cursor: 'pointer' }}
              >
                Añadir Sello Pro al Nombre
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Navegación Inferior */}
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '480px', background: '#121214', borderTop: '1px solid #27272a', display: 'flex', justifyContent: 'space-around', padding: '12px 0', zIndex: 100 }}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{ background: 'none', border: 'none', color: activeTab === 'dashboard' ? '#38bdf8' : '#71717a', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
        >
          📊 Dashboard
        </button>
        <button
          onClick={() => setActiveTab('activeWorkout')}
          style={{ background: 'none', border: 'none', color: activeTab === 'activeWorkout' ? '#818cf8' : '#71717a', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
        >
          ▶ Reproducir
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          style={{ background: 'none', border: 'none', color: activeTab === 'profile' ? '#38bdf8' : '#71717a', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
        >
          ⚙️ Ajustes
        </button>
      </nav>

    </div>
  );
}
