import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'inicio' | 'entrenar' | 'nutricion' | 'progreso' | 'perfil'>('inicio');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [waterCount, setWaterCount] = useState(0);
  const [workoutLogs, setWorkoutLogs] = useState<any[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados del Entrenador Activo
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [restTimer, setRestTimer] = useState<number | null>(null);

  const mockWorkoutExercises = [
    { id: '1', name: 'Sentadilla con Mancuernas', sets: 3, reps: '10-12', rest: 60 },
    { id: '2', name: 'Press de Banca en Suelo', sets: 3, reps: '10', rest: 60 },
    { id: '3', name: 'Remo con Banda Elástica', sets: 3, reps: '12', rest: 45 },
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchUserData(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Temporizador de descanso
  useEffect(() => {
    if (restTimer === null || restTimer <= 0) return;
    const interval = setInterval(() => {
      setRestTimer(prev => (prev !== null && prev > 0 ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [restTimer]);

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      setProfile(profileData);

      const { data: logsData } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      setWorkoutLogs(logsData || []);
    } catch (err: any) {
      setErrorMsg('No se pudieron sincronizar los datos con Supabase.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSet = async (exerciseName: string) => {
    if (!weightInput || !repsInput) {
      alert('Introduce el peso y las repeticiones para registrar la serie.');
      return;
    }

    const { error } = await supabase.from('workout_logs').insert([
      {
        user_id: session.user.id,
        exercise_name: exerciseName,
        weight_used: `${weightInput} kg`,
        reps_completed: parseInt(repsInput),
        sets_completed: 1,
        perceived_difficulty: 7
      }
    ]);

    if (error) {
      setErrorMsg('Error al guardar la serie en la base de datos.');
    } else {
      setWeightInput('');
      setRepsInput('');
      setRestTimer(60); // Activar temporizador de descanso de 60 segundos
      fetchUserData(session.user.id);
      alert('¡Serie registrada con éxito! Descanso iniciado.');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#090d16', color: '#fff', fontFamily: 'sans-serif' }}>
        <p>Cargando FitApp Pro... ⚡</p>
      </div>
    );
  }

  if (!session) {
    return <AuthScreen onLogin={() => supabase.auth.getSession().then(({data}) => setSession(data.session))} />;
  }

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '20px', paddingBottom: '100px', backgroundColor: '#090d16', color: '#f9fafb', minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {errorMsg && (
        <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', marginBottom: '14px', fontWeight: 'bold' }}>
          {errorMsg}
        </div>
      )}

      {/* Temporizador flotante de descanso activo */}
      {restTimer !== null && (
        <div style={{ backgroundColor: '#1d4ed8', color: '#fff', padding: '12px', borderRadius: '12px', textAlign: 'center', marginBottom: '14px', fontWeight: 'bold', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⏱️ Descanso entre series</span>
          <span style={{ fontSize: '16px', background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '8px' }}>{restTimer}s</span>
          <button onClick={() => setRestTimer(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '12px', textDecoration: 'underline' }}>Saltar</button>
        </div>
      )}

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #1f2937' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px' }}>⚡</div>
          <div>
            <h1 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>FitApp Pro</h1>
            <p style={{ fontSize: '11px', color: '#9ca3af', margin: '2px 0 0 0' }}>Atleta: <strong style={{ color: '#3b82f6' }}>{profile?.name || session.user.email}</strong></p>
          </div>
        </div>
        <button onClick={() => supabase.auth.signOut()} style={{ background: '#111827', border: '1px solid #1f2937', color: '#9ca3af', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer' }}>Salir</button>
      </header>

      {/* Vistas de la Aplicación */}
      {activeTab === 'inicio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '16px', border: '1px solid #1f2937' }}>
            <span style={{ fontSize: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>OBJETIVO ACTIVO</span>
            <h2 style={{ fontSize: '15px', fontWeight: '800', margin: '8px 0 4px 0' }}>{profile?.goal?.[0] || 'Mejora de condición física general'}</h2>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Ubicación: <strong>{profile?.workout_location || 'Casa / Gimnasio'}</strong></p>
            <button onClick={() => { setActiveTab('entrenar'); setIsTrainingActive(true); }} style={{ width: '100%', marginTop: '14px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
              🚀 Empezar Entrenamiento de Hoy
            </button>
          </div>

          <div style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '16px', border: '1px solid #1f2937' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af' }}>💧 Hidratación Diaria</span>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#38bdf8' }}>{waterCount} / 8 Vasos</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setWaterCount(Math.max(0, waterCount - 1))} style={{ backgroundColor: '#1f2937', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>-</button>
              <div style={{ flex: 1, backgroundColor: '#1f2937', borderRadius: '8px', height: '12px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (waterCount / 8) * 100)}%`, background: '#38bdf8', height: '100%' }}></div>
              </div>
              <button onClick={() => setWaterCount(waterCount + 1)} style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>+</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'entrenar' && (
        <div style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '16px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 10px 0' }}>🏋️ Sesión de Entrenamiento</h2>
          
          {!isTrainingActive ? (
            <div>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '14px' }}>Rutina generada automáticamente según tu material y nivel.</p>
              <button onClick={() => setIsTrainingActive(true)} style={{ width: '100%', background: '#3b82f6', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
                ▶️ Iniciar Sesión Guiada
              </button>
            </div>
          ) : (
            <div>
              {/* Bloque de ejercicio actual */}
              {(() => {
                const ex = mockWorkoutExercises[currentExerciseIndex];
                return (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 'bold' }}>Ejercicio {currentExerciseIndex + 1} de {mockWorkoutExercises.length}</span>
                      <button onClick={() => { if(currentExerciseIndex < mockWorkoutExercises.length - 1) setCurrentExerciseIndex(currentExerciseIndex + 1); else { alert('¡Entrenamiento completado con éxito!'); setIsTrainingActive(false); setCurrentExerciseIndex(0); } }} style={{ background: '#1f2937', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', cursor: 'pointer' }}>Siguiente ➡️</button>
                    </div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 6px 0' }}>{ex.name}</h3>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 14px 0' }}>Objetivo: {ex.sets} series de {ex.reps} reps</p>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <input type="number" placeholder="Peso (kg)" value={weightInput} onChange={e => setWeightInput(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #1f2937', backgroundColor: '#090d16', color: '#fff', fontSize: '12px', outline: 'none' }} />
                      <input type="number" placeholder="Reps" value={repsInput} onChange={e => setRepsInput(e.target.value)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #1f2937', backgroundColor: '#090d16', color: '#fff', fontSize: '12px', outline: 'none' }} />
                    </div>

                    <button onClick={() => handleSaveSet(ex.name)} style={{ width: '100%', backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                      ✓ Registrar Serie y Descansar
                    </button>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {activeTab === 'nutricion' && (
        <div style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '16px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 10px 0' }}>🥗 Nutrición y Menús</h2>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>Planes nutricionales personalizados respetando alergias y restricciones.</p>
        </div>
      )}

      {activeTab === 'progreso' && (
        <div style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '16px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 10px 0' }}>📈 Progreso y Cargas</h2>
          {workoutLogs.length === 0 ? (
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>No hay registros de entrenamiento todavía en la base de datos.</p>
          ) : (
            workoutLogs.map(l => (
              <div key={l.id} style={{ fontSize: '12px', padding: '6px 0', borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between' }}>
                <span><strong>{l.exercise_name}</strong></span>
                <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{l.weight_used} ({l.reps_completed} reps)</span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'perfil' && (
        <div style={{ backgroundColor: '#111827', borderRadius: '16px', padding: '16px', border: '1px solid #1f2937' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '800', margin: '0 0 10px 0' }}>👤 Perfil de Usuario</h2>
          <p style={{ fontSize: '12px', color: '#9ca3af' }}>Email vinculado: <strong>{session.user.email}</strong></p>
        </div>
      )}

      {/* Navegación Inferior Mobile First */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(17, 24, 39, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid #1f2937', display: 'flex', justifyContent: 'space-around', padding: '10px 0 16px 0', maxWidth: '480px', margin: '0 auto', zIndex: 100 }}>
        {[
          { id: 'inicio', label: 'Inicio', icon: '🏠' },
          { id: 'entrenar', label: 'Entrenar', icon: '🏋️' },
          { id: 'nutricion', label: 'Nutrición', icon: '🥗' },
          { id: 'progreso', label: 'Progreso', icon: '📈' },
          { id: 'perfil', label: 'Perfil', icon: '👤' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', opacity: isActive ? 1 : 0.6 }}>
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: isActive ? '800' : '500', color: isActive ? '#3b82f6' : '#9ca3af' }}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function AuthScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthError(error.message);
      else alert('¡Registro correcto! Ya puedes iniciar sesión.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(error.message);
      else onLogin();
    }
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '40px 20px', backgroundColor: '#090d16', color: '#f9fafb', minHeight: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0 }}>FitApp Pro</h1>
        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>Tu entrenador y nutricionista personal</p>
      </div>

      {authError && <div style={{ backgroundColor: '#ef4444', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>{authError}</div>}

      <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input type="email" placeholder="Correo electrónico..." value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #1f2937', backgroundColor: '#111827', color: '#fff', fontSize: '13px', outline: 'none' }} />
        <input type="password" placeholder="Contraseña..." value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '12px', borderRadius: '10px', border: '1px solid #1f2937', backgroundColor: '#111827', color: '#fff', fontSize: '13px', outline: 'none' }} />
        <button type="submit" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#fff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', marginTop: '6px' }}>
          {isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </button>
      </form>

      <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#3b82f6', marginTop: '16px', fontSize: '12px', cursor: 'pointer', textAlign: 'center' }}>
        {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
      </button>
    </div>
  );
}
