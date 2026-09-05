import React, { useState, useEffect } from 'react';
import { useFitAppSupabase } from './hooks/useFitAppSupabase';
import { useWorkoutLogs } from './hooks/useWorkoutLogs';

// Definición de ejercicios agrupados por grupo muscular
const EXERCISES_BY_MUSCLE: Record<string, { name: string; defaultSets: number; defaultReps: number; defaultWeight: string }[]> = {
  pecho: [
    { name: 'Press de Banca Plano', defaultSets: 4, defaultReps: 8, defaultWeight: '65' },
    { name: 'Press Inclinado con Mancuernas', defaultSets: 3, defaultReps: 10, defaultWeight: '24' },
    { name: 'Aperturas en Polea', defaultSets: 3, defaultReps: 12, defaultWeight: '15' }
  ],
  espalda: [
    { name: 'Dominadas Lastradas o Asistidas', defaultSets: 4, defaultReps: 8, defaultWeight: '0' },
    { name: 'Remo con Barra Libre', defaultSets: 4, defaultReps: 10, defaultWeight: '60' },
    { name: 'Jalón al Pecho en Polea', defaultSets: 3, defaultReps: 12, defaultWeight: '50' }
  ],
  hombros: [
    { name: 'Press Militar de Pie', defaultSets: 4, defaultReps: 8, defaultWeight: '40' },
    { name: 'Elevaciones Laterales con Mancuernas', defaultSets: 4, defaultReps: 15, defaultWeight: '10' },
    { name: 'Pájaros para Deltoides Posterior', defaultSets: 3, defaultReps: 12, defaultWeight: '12' }
  ],
  piernas: [
    { name: 'Sentadilla Libre (Squat)', defaultSets: 4, defaultReps: 8, defaultWeight: '80' },
    { name: 'Prensa Inclinada 45º', defaultSets: 4, defaultReps: 10, defaultWeight: '140' },
    { name: 'Curl de Isquiotibiales Sentado', defaultSets: 3, defaultReps: 12, defaultWeight: '45' }
  ],
  abdomen: [
    { name: 'Crunch Abdominal en Polea', defaultSets: 3, defaultReps: 15, defaultWeight: '30' },
    { name: 'Elevación de Piernas colgado', defaultSets: 3, defaultReps: 12, defaultWeight: '0' },
    { name: 'Plancha Abdominal Isométrica', defaultSets: 3, defaultReps: 60, defaultWeight: '0' }
  ],
  cardio: [
    { name: 'HIIT en Cinta de Correr', defaultSets: 1, defaultReps: 20, defaultWeight: '0' },
    { name: 'Entrenamiento en AirBike', defaultSets: 5, defaultReps: 1, defaultWeight: '0' },
    { name: 'Saltos a la Comba (Jump Rope)', defaultSets: 4, defaultReps: 3, defaultWeight: '0' }
  ]
};

export default function App() {
  const { profile, loading: profileLoading, error: profileError, updateProfile } = useFitAppSupabase();
  const { saveWorkoutLog, loading: logLoading } = useWorkoutLogs();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'selector' | 'activeWorkout' | 'profile'>('dashboard');

  // Estado de selección muscular y rutina activa
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [activeRoutine, setActiveRoutine] = useState<{ name: string; defaultSets: number; defaultReps: number; defaultWeight: string }[]>([]);
  
  // Estado del Reproductor en vivo (Play)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [weightInput, setWeightInput] = useState('0');
  const [repsInput, setRepsInput] = useState('10');
  const [rpeInput, setRpeInput] = useState('8');

  // Temporizador de descanso
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Iniciar sesión eligiendo el grupo muscular
  const handleSelectMuscle = (muscleKey: string) => {
    setSelectedMuscle(muscleKey);
    const routine = EXERCISES_BY_MUSCLE[muscleKey];
    setActiveRoutine(routine);
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setWeightInput(routine[0].defaultWeight);
    setRepsInput(String(routine[0].defaultReps));
    setActiveTab('activeWorkout');
  };

  const currentExercise = activeRoutine[currentExerciseIndex];

  // Control del temporizador de descanso
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

  // Completar serie y pasar al siguiente paso o ejercicio
  const handleCompleteSet = async () => {
    if (!currentExercise) return;

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

    if (currentSet < currentExercise.defaultSets) {
      setCurrentSet((prev) => prev + 1);
    } else {
      if (currentExerciseIndex < activeRoutine.length - 1) {
        const nextIndex = currentExerciseIndex + 1;
        setCurrentExerciseIndex(nextIndex);
        setCurrentSet(1);
        setWeightInput(activeRoutine[nextIndex].defaultWeight);
        setRepsInput(String(activeRoutine[nextIndex].defaultReps));
      } else {
        alert('¡Entrenamiento completado y guardado en Supabase! 🏆 Has finalizado tu sesión.');
        setActiveTab('dashboard');
      }
    }
  };

  if (profileLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#09090b', color: '#f4f4f5', fontFamily: 'system-ui, sans-serif' }}>
        <p>Cargando entorno FitApp...</p>
      </div>
    );
  }

  if (profileError) {
    return (
      <div style={{ padding: '30px', color: '#ef4444', background: '#09090b', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <h2>Error de conexión con Supabase</h2>
        <p>{profileError}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', background: '#09090b', color: '#f4f4f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif', paddingBottom: '90px', boxSizing: 'border-box' }}>
      
      {/* Cabecera */}
      <header style={{ padding: '20px', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#09090b', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <h1 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, color: '#38bdf8' }}>FitApp Pro PWA</h1>
          <span style={{ fontSize: '0.75rem', color: '#71717a' }}>Atleta: {profile?.name || 'Usuario'}</span>
        </div>
        <div style={{ background: '#18181b', border: '1px solid #27272a', padding: '4px 10px', borderRadius: '15px', fontSize: '0.75rem', color: '#4ade80' }}>
          ● PostgreSQL Online
        </div>
      </header>

      <main style={{ padding: '20px', flex: 1 }}>
        
        {/* VISTA 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#18181b', border: '1px solid #27272a', borderRadius: '16px', padding: '20px' }}>
              <h2 style={{ fontSize: '1.1rem', margin: '0 0 10px 0', color: '#38bdf8' }}>¿Qué entrenamos hoy?</h2>
              <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: '0 0 20px 0' }}>Elige tu enfoque muscular diario para cargar la rutina específica y activar el reproductor de series.</p>
              
              <button
                onClick={() => setActiveTab('selector')}
                style={{
                  width: '100%',
                  padding: '16px',
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
                🎯 Seleccionar Grupo Muscular (Play)
              </button>
            </div>
          </div>
        )}

        {/* VISTA 2: SELECTOR DE GRUPO MUSCULAR */}
        {activeTab === 'selector' && (
          <div>
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 8px 0', color: '#818cf8' }}>Elige Grupo Muscular</h2>
            <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '20px' }}>Selecciona qué zona del cuerpo quieres machacar en la sesión de hoy:</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {[
                { key: 'pecho', label: '🦾 Pecho', desc: 'Press y aperturas' },
                { key: 'espalda', label: '🦇 Espalda', desc: 'Dominadas y remos' },
                { key: 'hombros', label: '🛡️ Hombros', desc: 'Press militar y laterales' },
                { key: 'piernas', label: '🦵 Piernas', desc: 'Sentadillas y prensa' },
                { key: 'abdomen', label: '⚡ Abdomen', desc: 'Core y planchas' },
                { key: 'cardio', label: '🏃‍♂️ Cardio', desc: 'HIIT y resistencia' }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleSelectMuscle(item.key)}
                  style={{
                    background: '#18181b',
                    border: '1px solid #3f3f46',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 'bold', color: '#38bdf8' }}>{item.label}</span>
                  <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{item.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VISTA 3: REPRODUCTOR ACTIVO DE SESIÓN (PLAY) */}
        {activeTab === 'activeWorkout' && (
          <div>
            {!selectedMuscle || activeRoutine.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: '#18181b', borderRadius: '16px', border: '1px solid #27272a' }}>
                <p style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '15px' }}>No hay ningún grupo muscular seleccionado.</p>
                <button
                  onClick={() => setActiveTab('selector')}
                  style={{ padding: '12px 20px', background: '#38bdf8', color: '#09090b', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Elegir Músculo ➔
                </button>
              </div>
            ) : (
              <div style={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '16px', padding: '20px' }}>
                
                {/* Panel de Descanso Activo */}
                {isResting ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', background: '#09090b', borderRadius: '12px', border: '1px solid #ef4444', marginBottom: '15px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 'bold', textTransform: 'uppercase' }}>Descanso entre Series</span>
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
                    Enfoque: {selectedMuscle.toUpperCase()} ({currentExerciseIndex + 1}/{activeRoutine.length})
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#38bdf8', background: '#09090b', padding: '4px 8px', borderRadius: '6px', border: '1px solid #27272a' }}>
                    Serie {currentSet} / {currentExercise.defaultSets}
                  </span>
                </div>

                <h2 style={{ fontSize: '1.25rem', margin: '0 0 20px 0', color: '#f4f4f5' }}>{currentExercise.name}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>Peso (kg)</label>
                    <input
                      type="text"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      style={{ width: '100%', padding: '12px', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>Reps</label>
                      <input
                        type="number"
                        value={repsInput}
                        onChange={(e) => setRepsInput(e.target.value)}
                        style={{ width: '100%', padding: '12px', background: '#09090b', border: '1px solid #3f3f46', borderRadius: '8px', color: '#fff', fontSize: '1rem', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>RPE (1-10)</label>
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

        {/* VISTA 4: PERFIL */}
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
                Actualizar Sello de Atleta
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
          📊 Inicio
        </button>
        <button
          onClick={() => setActiveTab('selector')}
          style={{ background: 'none', border: 'none', color: activeTab === 'selector' || activeTab === 'activeWorkout' ? '#818cf8' : '#71717a', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
        >
          🎯 Músculos
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
