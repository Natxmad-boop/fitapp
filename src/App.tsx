import React, { useState } from 'react';

// Interfaces actualizadas para soportar Ejercicios y Entrenamientos
interface Exercise {
  id: string;
  name: string;
  category: 'Fuerza' | 'Core' | 'Cardio' | 'Movilidad';
  targetMuscle: string;
  equipmentNeeded: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  instructions: string;
  commonMistakes: string;
  alternative: string;
}

interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  pin: string;
  healthRestrictions: string[];
  equipment: string[];
  createdAt: string;
}

// Biblioteca base de ejercicios reales (Fase 4)
const EXERCISE_LIBRARY: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Sentadillas con Mancuernas',
    category: 'Fuerza',
    targetMuscle: 'Piernas y Glúteos',
    equipmentNeeded: 'Mancuernas',
    difficulty: 'Principiante',
    instructions: 'Mantén los pies al ancho de los hombros, baja la cadera controlando el descenso y empuja desde los talones.',
    commonMistakes: 'Dejar que las rodillas colapsen hacia adentro.',
    alternative: 'Sentadillas libres sin peso'
  },
  {
    id: 'ex-2',
    name: 'Press de Banca o Floor Press',
    category: 'Fuerza',
    targetMuscle: 'Pecho y Tríceps',
    equipmentNeeded: 'Mancuernas',
    difficulty: 'Intermedio',
    instructions: 'Acuéstate boca arriba, empuja las mancuernas hacia arriba de forma controlada contrayendo el pecho.',
    commonMistakes: 'Arquear excesivamente la espalda baja.',
    alternative: 'Flexiones de pecho'
  },
  {
    id: 'ex-3',
    name: 'Plancha Abdominal',
    category: 'Core',
    targetMuscle: 'Abdomen y Core',
    equipmentNeeded: 'Esterilla',
    difficulty: 'Principiante',
    instructions: 'Mantén el cuerpo en línea recta apoyado sobre antebrazos y puntas de los pies, contrayendo el abdomen.',
    commonMistakes: 'Dejar caer la cadera hacia el suelo.',
    alternative: 'Plancha sobre rodillas'
  },
  {
    id: 'ex-4',
    name: 'Remo con Mancuerna',
    category: 'Fuerza',
    targetMuscle: 'Espalda',
    equipmentNeeded: 'Mancuernas',
    difficulty: 'Principiante',
    instructions: 'Inclina el tronco apoyando una mano y lleva la mancuerna hacia la cadera apretando la espalda.',
    commonMistakes: 'Girar el torso al elevar el peso.',
    alternative: 'Remo con banda elástica'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'entrenar' | 'nutricion' | 'progreso' | 'perfil'>('inicio');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Estado para perfiles independientes (Fase 2)
  const [profiles, setProfiles] = useState<UserProfile[]>([
    {
      id: 'prof-1',
      name: 'Carlos Trainer',
      age: 28,
      gender: 'Masculino',
      height: 178,
      weight: 75,
      goal: 'Ganar músculo',
      pin: '1234',
      healthRestrictions: ['Sin lactosa'],
      equipment: ['Mancuernas', 'Esterilla'],
      createdAt: new Date().toISOString()
    }
  ]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>('prof-1');
  const [isCreatingProfile, setIsCreatingProfile] = useState<boolean>(false);

  // Estado para registro de entrenamiento actual (Fase 3)
  const [selectedWorkoutFilter, setSelectedWorkoutFilter] = useState<string>('Todos');
  const [activeWorkoutSession, setActiveWorkoutSession] = useState<Exercise[] | null>(null);
  const [workoutFeedback, setWorkoutFeedback] = useState<{ [key: string]: { weight: string; reps: string; effort: string } }>({});

  // Formulario temporal para nuevo perfil
  const [newProfileData, setNewProfileData] = useState({
    name: '',
    age: 25,
    gender: 'Masculino',
    height: 175,
    weight: 70,
    goal: 'Perder grasa',
    pin: '0000',
    healthRestrictions: '',
    equipment: 'Mancuernas'
  });

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  const t = isDarkMode ? {
    bg: '#0f172a',
    cardBg: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#334155',
    primary: '#38bdf8',
    navBg: '#1e293b',
    navText: '#94a3b8',
    navActive: '#38bdf8',
    success: '#22c55e'
  } : {
    bg: '#f8fafc',
    cardBg: '#ffffff',
    text: '#111111',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    primary: '#0284c7',
    navBg: '#ffffff',
    navText: '#64748b',
    navActive: '#0284c7',
    success: '#16a34a'
  };

  // Selector de perfiles si no hay sesión activa
  if (!activeProfileId) {
    return (
      <div style={{ fontFamily: '-apple-system, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '20px', color: t.text, backgroundColor: t.bg, minHeight: '100vh', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '22px', textAlign: 'center', marginBottom: '8px' }}>FitApp Pro 🏆</h1>
        <p style={{ textAlign: 'center', fontSize: '13px', color: t.textSecondary, marginBottom: '24px' }}>Selecciona o crea un perfil independiente (Fases 1 y 2)</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {profiles.map(p => (
            <div key={p.id} style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{p.name}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: t.textSecondary }}>Objetivo: {p.goal}</p>
              </div>
              <button 
                onClick={() => setActiveProfileId(p.id)}
                style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}
              >
                Entrar ➔
              </button>
            </div>
          ))}

          <button 
            onClick={() => setIsCreatingProfile(true)}
            style={{ backgroundColor: 'transparent', border: `2px dashed ${t.primary}`, color: t.primary, padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' }}
          >
            + Crear Nuevo Perfil Independiente
          </button>
        </div>

        {isCreatingProfile && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
            <div style={{ backgroundColor: t.cardBg, borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '400px', border: `1px solid ${t.border}` }}>
              <h2 style={{ fontSize: '18px', marginTop: 0 }}>Nuevo Perfil</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <label>Nombre:
                  <input type="text" value={newProfileData.name} onChange={e => setNewProfileData({...newProfileData, name: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label style={{ flex: 1 }}>Edad:
                    <input type="number" value={newProfileData.age} onChange={e => setNewProfileData({...newProfileData, age: Number(e.target.value)})} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
                  </label>
                  <label style={{ flex: 1 }}>Peso (kg):
                    <input type="number" value={newProfileData.weight} onChange={e => setNewProfileData({...newProfileData, weight: Number(e.target.value)})} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
                  </label>
                </div>
                <label>Objetivo Principal:
                  <select value={newProfileData.goal} onChange={e => setNewProfileData({...newProfileData, goal: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}>
                    <option>Perder grasa</option>
                    <option>Ganar músculo</option>
                    <option>Recomposición corporal</option>
                    <option>Mejorar fuerza</option>
                  </select>
                </label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => setIsCreatingProfile(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}`, background: 'transparent', color: t.text, cursor: 'pointer' }}>Cancelar</button>
                  <button onClick={() => {
                    if(!newProfileData.name) return;
                    const newProf: UserProfile = {
                      id: 'prof-' + Date.now(),
                      name: newProfileData.name,
                      age: newProfileData.age,
                      gender: newProfileData.gender,
                      height: newProfileData.height,
                      weight: newProfileData.weight,
                      goal: newProfileData.goal,
                      pin: '0000',
                      healthRestrictions: newProfileData.healthRestrictions ? [newProfileData.healthRestrictions] : [],
                      equipment: [newProfileData.equipment],
                      createdAt: new Date().toISOString()
                    };
                    setProfiles([...profiles, newProf]);
                    setActiveProfileId(newProf.id);
                    setIsCreatingProfile(false);
                  }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: t.primary, color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Guardar Perfil</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '480px',
      margin: '0 auto',
      padding: '16px',
      paddingBottom: '90px',
      color: t.text,
      backgroundColor: t.bg,
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      {/* Cabecera superior con datos del perfil activo */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>FitApp Pro 🏆</h1>
            <span style={{ fontSize: '11px', backgroundColor: t.primary, color: '#fff', padding: '2px 6px', borderRadius: '10px' }}>{activeProfile?.name}</span>
          </div>
          <p style={{ fontSize: '11px', color: t.textSecondary, margin: '2px 0 0 0' }}>Objetivo: <strong style={{ color: t.text }}>{activeProfile?.goal}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveProfileId(null)} 
            style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', fontSize: '12px', color: t.textSecondary }}
            title="Cambiar Perfil"
          >
            👥
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', fontSize: '14px' }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Contenido según la pestaña activa */}
      {activeTab === 'inicio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', marginTop: 0, display: 'flex', justifyContent: 'space-between' }}>
              <span>🎯 ¿Qué hago hoy?</span>
              <span style={{ fontSize: '11px', color: t.primary }}>Sistema Inteligente</span>
            </h2>
            <p style={{ fontSize: '13px', color: t.textSecondary, lineHeight: '1.4', marginBottom: '12px' }}>
              Basado en tu objetivo de <strong>{activeProfile?.goal}</strong> y tu equipamiento disponible (<em>{activeProfile?.equipment.join(', ')}</em>).
            </p>
            <button 
              onClick={() => {
                setActiveWorkoutSession(EXERCISE_LIBRARY);
                setActiveTab('entrenar');
              }}
              style={{ width: '100%', backgroundColor: t.primary, color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              Comenzar Entrenamiento de Hoy 🚀
            </button>
          </div>
        </div>
      )}

      {activeTab === 'entrenar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>🏋️ Generador de Entrenamientos (Fase 3)</h2>
            <p style={{ fontSize: '13px', color: t.textSecondary, marginBottom: '12px' }}>
              Rutina generada aplicando reglas estrictas de equipamiento y nivel.
            </p>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {['Todos', 'Fuerza', 'Core'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedWorkoutFilter(cat)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${t.border}`, background: selectedWorkoutFilter === cat ? t.primary : t.cardBg, color: selectedWorkoutFilter === cat ? '#fff' : t.text, fontSize: '12px', cursor: 'pointer' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Biblioteca de Ejercicios Filtrada (Fase 4) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {EXERCISE_LIBRARY
                .filter(ex => selectedWorkoutFilter === 'Todos' || ex.category === selectedWorkoutFilter)
                .map(ex => (
                  <div key={ex.id} style={{ padding: '12px', backgroundColor: t.bg, borderRadius: '8px', border: `1px solid ${t.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '14px' }}>{ex.name}</strong>
                      <span style={{ fontSize: '11px', backgroundColor: t.border, padding: '2px 6px', borderRadius: '4px' }}>{ex.targetMuscle}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: t.textSecondary, margin: '0 0 8px 0' }}>💡 {ex.instructions}</p>
                    
                    {/* Control de Series, Pesos y Percepción de Dificultad (Fase 5) */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        placeholder="Peso (kg)" 
                        style={{ width: '70px', padding: '6px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text }} 
                      />
                      <input 
                        type="text" 
                        placeholder="Reps" 
                        style={{ width: '50px', padding: '6px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text }} 
                      />
                      <select style={{ flex: 1, padding: '6px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text }}>
                        <option>Normal (RPE 7-8)</option>
                        <option>Fácil 🟢</option>
                        <option>Difícil 🔴</option>
                      </select>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'nutricion' && (
        <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>🍽️ Sección de Nutrición (Fase 5)</h2>
          <p style={{ fontSize: '13px', color: t.textSecondary }}>Próximo módulo: Menús dinámicos con restricción estricta de alergias (<em>{activeProfile?.healthRestrictions.join(', ') || 'Ninguna'}</em>).</p>
        </div>
      )}

      {activeTab === 'progreso' && (
        <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>📈 Progreso y Métricas (Fase 7)</h2>
          <p style={{ fontSize: '13px', color: t.textSecondary }}>Peso actual registrado: <strong>{activeProfile?.weight} kg</strong></p>
        </div>
      )}

      {activeTab === 'perfil' && (
        <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>👤 Configuración de Perfil</h2>
          <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', color: t.textSecondary }}>
            <p style={{ margin: 0 }}><strong>Nombre:</strong> {activeProfile?.name}</p>
            <p style={{ margin: 0 }}><strong>Objetivo:</strong> {activeProfile?.goal}</p>
            <p style={{ margin: 0 }}><strong>Equipamiento:</strong> {activeProfile?.equipment.join(', ')}</p>
          </div>
        </div>
      )}

      {/* Navegación Inferior estricta de 5 apartados */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: t.navBg,
        borderTop: `1px solid ${t.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px 0',
        maxWidth: '480px',
        margin: '0 auto',
        zIndex: 100
      }}>
        {[
          { id: 'inicio', label: 'Inicio', icon: '🏠' },
          { id: 'entrenar', label: 'Entrenar', icon: '🏋️' },
          { id: 'nutricion', label: 'Nutrición', icon: '🍽️' },
          { id: 'progreso', label: 'Progreso', icon: '📈' },
          { id: 'perfil', label: 'Perfil', icon: '👤' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '10px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? t.navActive : t.navText,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
