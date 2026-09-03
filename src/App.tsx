import React, { useState } from 'react';

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
  contraindications?: string[];
}

interface Meal {
  id: string;
  title: string;
  type: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  calories: number;
  protein: number;
  ingredients: string[];
  isAllowed: boolean;
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
  equipment: string[]; // Materiales disponibles para entrenar
  injuries: string[];
  dislikedIngredients: string[];
  streakDays: number;
  points: number;
  createdAt: string;
}

const EXERCISE_LIBRARY: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Sentadillas con Mancuernas',
    category: 'Fuerza',
    targetMuscle: 'Piernas y Glúteos',
    equipmentNeeded: 'Mancuernas',
    difficulty: 'Principiante',
    instructions: 'Mantén los pies al ancho de los hombros. Baja la cadera controlando el descenso y empuja con fuerza desde los talones para subir.',
    commonMistakes: 'Dejar que las rodillas colapsen hacia adentro.',
    alternative: 'Sentadillas libres sin peso',
    contraindications: ['Rodilla', 'Espalda baja']
  },
  {
    id: 'ex-2',
    name: 'Sentadillas Libres (Sin Peso)',
    category: 'Fuerza',
    targetMuscle: 'Piernas y Glúteos',
    equipmentNeeded: 'Ninguno',
    difficulty: 'Principiante',
    instructions: 'Realiza el movimiento de sentadilla controlando la bajada utilizando únicamente el peso corporal.',
    commonMistakes: 'Inclinarse demasiado hacia adelante.',
    alternative: 'Sentadillas sumo',
    contraindications: ['Rodilla']
  },
  {
    id: 'ex-3',
    name: 'Press de Banca con Mancuernas',
    category: 'Fuerza',
    targetMuscle: 'Pecho y Tríceps',
    equipmentNeeded: 'Mancuernas',
    difficulty: 'Intermedio',
    instructions: 'Acuéstate boca arriba y empuja las mancuernas hacia arriba contrayendo el pecho.',
    commonMistakes: 'Arquear excesivamente la espalda baja.',
    alternative: 'Flexiones de pecho',
    contraindications: ['Hombro']
  },
  {
    id: 'ex-4',
    name: 'Plancha Abdominal',
    category: 'Core',
    targetMuscle: 'Abdomen y Core',
    equipmentNeeded: 'Esterilla',
    difficulty: 'Principiante',
    instructions: 'Mantén el cuerpo en línea recta apoyado sobre antebrazos y puntas de los pies.',
    commonMistakes: 'Dejar caer la cadera hacia el suelo.',
    alternative: 'Plancha sobre rodillas',
    contraindications: ['Espalda baja']
  },
  {
    id: 'ex-5',
    name: 'Remo con Mancuerna',
    category: 'Fuerza',
    targetMuscle: 'Espalda',
    equipmentNeeded: 'Mancuernas',
    difficulty: 'Principiante',
    instructions: 'Inclina el tronco apoyando una mano y lleva la mancuerna hacia la cadera.',
    commonMistakes: 'Girar el torso al elevar el peso.',
    alternative: 'Remo con banda elástica',
    contraindications: ['Espalda baja']
  }
];

const MEAL_LIBRARY: Meal[] = [
  {
    id: 'meal-1',
    title: 'Tostada integral con aguacate y huevo revuelto',
    type: 'Desayuno',
    calories: 380,
    protein: 18,
    ingredients: ['Pan integral', 'Aguacate', 'Huevo', 'Aceite de oliva'],
    isAllowed: true
  },
  {
    id: 'meal-2',
    title: 'Pechuga de pollo a la plancha con arroz y brócoli',
    type: 'Almuerzo',
    calories: 520,
    protein: 42,
    ingredients: ['Pechuga de pollo', 'Arroz blanco', 'Brócoli', 'Aceite de oliva'],
    isAllowed: true
  },
  {
    id: 'meal-3',
    title: 'Batido de proteína con leche de vaca y plátano',
    type: 'Snack',
    calories: 310,
    protein: 25,
    ingredients: ['Proteína Whey', 'Leche de vaca', 'Plátano'],
    isAllowed: false
  },
  {
    id: 'meal-4',
    title: 'Salmón al horno con espárragos trigueros',
    type: 'Cena',
    calories: 450,
    protein: 35,
    ingredients: ['Salmón', 'Espárragos', 'Limón', 'Especias'],
    isAllowed: true
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'entrenar' | 'nutricion' | 'progreso' | 'perfil'>('inicio');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

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
      equipment: ['Mancuernas', 'Esterilla', 'Ninguno'],
      injuries: ['Espalda baja'],
      dislikedIngredients: ['Brócoli'],
      streakDays: 5,
      points: 320,
      createdAt: new Date().toISOString()
    }
  ]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>('prof-1');
  const [isCreatingProfile, setIsCreatingProfile] = useState<boolean>(false);

  const [profilePinTarget, setProfilePinTarget] = useState<UserProfile | null>(null);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  const [selectedWorkoutFilter, setSelectedWorkoutFilter] = useState<string>('Todos');
  const [selectedMealFilter, setSelectedMealFilter] = useState<string>('Todos');
  const [newWeightInput, setNewWeightInput] = useState<string>('');
  const [newDislikedInput, setNewDislikedInput] = useState<string>('');
  const [activeDemoExerciseId, setActiveDemoExerciseId] = useState<string | null>(null);

  // Estado para añadir nuevo material en el perfil
  const [newEquipmentInput, setNewEquipmentInput] = useState<string>('');

  const [newProfileData, setNewProfileData] = useState({
    name: '',
    age: 25,
    gender: 'Masculino',
    height: 175,
    weight: 70,
    goal: 'Perder grasa',
    pin: '0000',
    healthRestrictions: 'Sin lactosa',
    equipment: 'Mancuernas',
    injuries: 'Ninguna',
    disliked: ''
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
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444'
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
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626'
  };

  if (!activeProfileId) {
    return (
      <div style={{ fontFamily: '-apple-system, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '20px', color: t.text, backgroundColor: t.bg, minHeight: '100vh', boxSizing: 'border-box' }}>
        <h1 style={{ fontSize: '22px', textAlign: 'center', marginBottom: '8px' }}>FitApp Pro 🏆</h1>
        <p style={{ textAlign: 'center', fontSize: '13px', color: t.textSecondary, marginBottom: '24px' }}>Selecciona tu perfil seguro</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {profiles.map(p => (
            <div key={p.id} style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{p.name}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: t.textSecondary }}>Objetivo: {p.goal} | 🔒 PIN Configurado</p>
              </div>
              <button 
                onClick={() => {
                  setProfilePinTarget(p);
                  setEnteredPin('');
                  setPinError(false);
                }}
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

        {profilePinTarget && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
            <div style={{ backgroundColor: t.cardBg, borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '320px', border: `1px solid ${t.border}`, textAlign: 'center' }}>
              <h2 style={{ fontSize: '18px', marginTop: 0 }}>Introduce PIN para {profilePinTarget.name}</h2>
              <p style={{ fontSize: '12px', color: t.textSecondary, marginBottom: '16px' }}>Prueba con: <strong style={{ color: t.text }}>1234</strong></p>
              <input 
                type="password" 
                maxLength={4}
                value={enteredPin} 
                onChange={e => setEnteredPin(e.target.value)}
                placeholder="****"
                style={{ width: '120px', textAlign: 'center', fontSize: '20px', letterSpacing: '8px', padding: '8px', borderRadius: '8px', border: `1px solid ${pinError ? t.danger : t.border}`, backgroundColor: t.bg, color: t.text, marginBottom: '12px' }} 
              />
              {pinError && <p style={{ color: t.danger, fontSize: '11px', margin: '0 0 10px 0' }}>PIN incorrecto.</p>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setProfilePinTarget(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}`, background: 'transparent', color: t.text, cursor: 'pointer' }}>Cancelar</button>
                <button onClick={() => {
                  if (enteredPin === profilePinTarget.pin) {
                    setActiveProfileId(profilePinTarget.id);
                    setProfilePinTarget(null);
                  } else {
                    setPinError(true);
                  }
                }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: t.primary, color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Acceder</button>
              </div>
            </div>
          </div>
        )}

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
                      healthRestrictions: [],
                      equipment: ['Mancuernas', 'Ninguno'],
                      injuries: [],
                      dislikedIngredients: [],
                      streakDays: 1,
                      points: 50,
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

  // Filtrado estricto de ejercicios basado en los materiales que el usuario ha indicado que posee
  const filteredExercises = EXERCISE_LIBRARY.filter(ex => {
    if (selectedWorkoutFilter !== 'Todos' && ex.category !== selectedWorkoutFilter) return false;
    
    // Comprueba si el usuario tiene el equipo necesario registrado en su perfil
    const hasEquipment = activeProfile?.equipment.some(eq => 
      ex.equipmentNeeded.toLowerCase() === 'ninguno' || eq.toLowerCase().includes(ex.equipmentNeeded.toLowerCase())
    );
    if (!hasEquipment) return false;

    // Comprueba si hay conflicto de lesiones
    const hasInjuryConflict = activeProfile?.injuries.some(injury => ex.contraindications?.includes(injury));
    if (hasInjuryConflict) return false;

    return true;
  });

  const smartFilteredMeals = MEAL_LIBRARY.filter(meal => {
    const hasAllergyConflict = !meal.isAllowed && activeProfile?.healthRestrictions.some(r => r.toLowerCase().includes('lactosa'));
    if (hasAllergyConflict) return false;
    const hasDislikedIngredient = meal.ingredients.some(ing => 
      activeProfile?.dislikedIngredients.some(disliked => ing.toLowerCase().includes(disliked.toLowerCase()))
    );
    if (hasDislikedIngredient) return false;
    return true;
  });

  const shoppingList = Array.from(new Set(smartFilteredMeals.flatMap(m => m.ingredients)));
  const currentDemoExercise = EXERCISE_LIBRARY.find(ex => ex.id === activeDemoExerciseId);

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
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>FitApp Pro 🏆</h1>
            <span style={{ fontSize: '11px', backgroundColor: t.primary, color: '#fff', padding: '2px 6px', borderRadius: '10px' }}>{activeProfile?.name}</span>
          </div>
          <p style={{ fontSize: '11px', color: t.textSecondary, margin: '2px 0 0 0' }}>🔥 Racha: <strong style={{ color: t.warning }}>{activeProfile?.streakDays} días</strong> | 🌟 {activeProfile?.points} pts</p>
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
              <span>🎯 Panel Personalizado</span>
              <span style={{ fontSize: '11px', color: t.primary }}>Materiales Configurados</span>
            </h2>
            <p style={{ fontSize: '13px', color: t.textSecondary, lineHeight: '1.4', marginBottom: '12px' }}>
              Objetivo: <strong>{activeProfile?.goal}</strong>. Tus materiales disponibles (<em>{activeProfile?.equipment.join(', ') || 'Ninguno'}</em>) filtran los entrenamientos de forma automática.
            </p>
            <button 
              onClick={() => setActiveTab('entrenar')}
              style={{ width: '100%', backgroundColor: t.primary, color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              Comenzar Entrenamiento 🚀
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, backgroundColor: t.cardBg, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, textAlign: 'center' }}>
              <span style={{ fontSize: '20px' }}>🔥</span>
              <h3 style={{ fontSize: '14px', margin: '6px 0 2px 0' }}>{activeProfile?.streakDays} Días</h3>
              <p style={{ fontSize: '11px', color: t.textSecondary, margin: 0 }}>Racha Activa</p>
            </div>
            <div style={{ flex: 1, backgroundColor: t.cardBg, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, textAlign: 'center' }}>
              <span style={{ fontSize: '20px' }}>⭐</span>
              <h3 style={{ fontSize: '14px', margin: '6px 0 2px 0' }}>{activeProfile?.points} Pts</h3>
              <p style={{ fontSize: '11px', color: t.textSecondary, margin: 0 }}>Disciplina</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'entrenar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>🏋️ Ejercicios Adaptados a tu Material</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredExercises.length === 0 ? (
                <p style={{ fontSize: '13px', color: t.danger, textAlign: 'center', margin: '20px 0' }}>
                  No hay ejercicios para el material seleccionado. Ve a <strong>Perfil</strong> y añade tu equipamiento disponible.
                </p>
              ) : (
                filteredExercises.map(ex => (
                  <div key={ex.id} style={{ padding: '12px', backgroundColor: t.bg, borderRadius: '8px', border: `1px solid ${t.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '14px' }}>{ex.name}</strong>
                      <span style={{ fontSize: '11px', backgroundColor: t.border, padding: '2px 6px', borderRadius: '4px' }}>Req: {ex.equipmentNeeded}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: t.textSecondary, margin: '0 0 8px 0' }}>💡 {ex.instructions.substring(0, 80)}...</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <button 
                        onClick={() => setActiveDemoExerciseId(ex.id)}
                        style={{ background: 'transparent', border: `1px solid ${t.primary}`, color: t.primary, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        📺 Ver Demostración y Técnica
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                      <input type="text" placeholder="Peso (kg)" style={{ width: '70px', padding: '6px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text }} />
                      <input type="text" placeholder="Reps" style={{ width: '50px', padding: '6px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text }} />
                      <select style={{ flex: 1, padding: '6px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text }}>
                        <option>Normal (RPE 7-8)</option>
                        <option>Fácil 🟢</option>
                        <option>Difícil 🔴</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Demostración Técnica */}
      {currentDemoExercise && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '400px', border: `1px solid ${t.border}`, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '16px', margin: 0 }}>🎬 {currentDemoExercise.name}</h2>
              <button onClick={() => setActiveDemoExerciseId(null)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: t.text }}>✕</button>
            </div>
            
            <div style={{ backgroundColor: t.bg, borderRadius: '8px', padding: '12px', textAlign: 'center', marginBottom: '14px', border: `1px solid ${t.border}` }}>
              <span style={{ fontSize: '32px' }}>🎯</span>
              <p style={{ fontSize: '12px', color: t.textSecondary, margin: '4px 0 0 0' }}>Demostración Visual / Material: <strong>{currentDemoExercise.equipmentNeeded}</strong></p>
            </div>

            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', color: t.text }}>
              <div>
                <strong style={{ color: t.primary }}>📝 Instrucciones de Ejecución:</strong>
                <p style={{ margin: '4px 0 0 0', color: t.textSecondary, lineHeight: '1.4' }}>{currentDemoExercise.instructions}</p>
              </div>
              <div>
                <strong style={{ color: t.danger }}>⚠️ Error Común a Evitar:</strong>
                <p style={{ margin: '4px 0 0 0', color: t.textSecondary, lineHeight: '1.4' }}>{currentDemoExercise.commonMistakes}</p>
              </div>
              <div>
                <strong style={{ color: t.success }}>🔄 Alternativa Sugerida:</strong>
                <p style={{ margin: '4px 0 0 0', color: t.textSecondary, lineHeight: '1.4' }}>{currentDemoExercise.alternative}</p>
              </div>
            </div>

            <button 
              onClick={() => setActiveDemoExerciseId(null)}
              style={{ width: '100%', marginTop: '16px', backgroundColor: t.primary, color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {activeTab === 'nutricion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>🍽️ Menús Inteligentes y Gustos</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {['Todos', 'Desayuno', 'Almuerzo', 'Snack', 'Cena'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedMealFilter(cat)}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, background: selectedMealFilter === cat ? t.primary : t.cardBg, color: selectedMealFilter === cat ? '#fff' : t.text, fontSize: '11px', cursor: 'pointer' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {smartFilteredMeals
                .filter(meal => selectedMealFilter === 'Todos' || meal.type === selectedMealFilter)
                .map(meal => (
                  <div key={meal.id} style={{ padding: '12px', backgroundColor: t.bg, borderRadius: '8px', border: `1px solid ${t.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '13px' }}>{meal.title}</strong>
                      <span style={{ fontSize: '10px', backgroundColor: t.border, padding: '2px 6px', borderRadius: '4px' }}>{meal.type}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: t.textSecondary, margin: '0 0 6px 0' }}>Ingredientes: {meal.ingredients.join(', ')}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginTop: '6px' }}>
                      <span>🔥 {meal.calories} kcal | 🥩 {meal.protein}g proteína</span>
                      <span style={{ color: t.success, fontWeight: '600' }}>✅ Apto</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginTop: 0 }}>🛒 Lista de la Compra Automática</h3>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', color: t.text }}>
              {shoppingList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'progreso' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>📈 Progreso y Métricas</h2>
            <p style={{ fontSize: '13px', color: t.textSecondary, marginBottom: '16px' }}>
              Peso actual registrado: <strong style={{ color: t.text }}>{activeProfile?.weight} kg</strong>
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="number" 
                placeholder="Nuevo peso (kg)" 
                value={newWeightInput} 
                onChange={e => setNewWeightInput(e.target.value)}
                style={{ flex: 1, padding: '8px', fontSize: '13px', borderRadius: '8px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} 
              />
              <button 
                onClick={() => {
                  if(!newWeightInput) return;
                  const val = Number(newWeightInput);
                  setProfiles(profiles.map(p => p.id === activeProfileId ? { ...p, weight: val, points: p.points + 10 } : p));
                  setNewWeightInput('');
                }}
                style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'perfil' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>👤 Configuración, Materiales y Gustos</h2>
            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', color: t.textSecondary, marginBottom: '16px' }}>
              <p style={{ margin: 0 }}><strong>Nombre:</strong> {activeProfile?.name}</p>
              <p style={{ margin: 0 }}><strong>Objetivo:</strong> {activeProfile?.goal}</p>
              <p style={{ margin: 0 }}><strong>Materiales Disponibles:</strong> <span style={{ color: t.primary, fontWeight: '600' }}>{activeProfile?.equipment.join(', ') || 'Ninguno'}</span></p>
              <p style={{ margin: 0 }}><strong>Alimentos que NO te gustan:</strong> <span style={{ color: t.danger }}>{activeProfile?.dislikedIngredients.join(', ') || 'Ninguno'}</span></p>
            </div>

            {/* Sección para añadir o quitar Materiales */}
            <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '12px', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '13px', margin: '0 0 6px 0', color: t.text }}>Añadir material disponible (Ej. Bandas, Mancuernas):</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Ej. Bandas elásticas..." 
                  value={newEquipmentInput}
                  onChange={e => setNewEquipmentInput(e.target.value)}
                  style={{ flex: 1, padding: '6px 8px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}
                />
                <button 
                  onClick={() => {
                    if (!newEquipmentInput) return;
                    setProfiles(profiles.map(p => {
                      if (p.id === activeProfileId) {
                        return { ...p, equipment: [...p.equipment, newEquipmentInput.trim()] };
                      }
                      return p;
                    }));
                    setNewEquipmentInput('');
                  }}
                  style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Añadir
                </button>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '12px' }}>
              <h4 style={{ fontSize: '13px', margin: '0 0 6px 0', color: t.text }}>Añadir alimento que no te gusta:</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Ej. Tomate..." 
                  value={newDislikedInput}
                  onChange={e => setNewDislikedInput(e.target.value)}
                  style={{ flex: 1, padding: '6px 8px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}
                />
                <button 
                  onClick={() => {
                    if (!newDislikedInput) return;
                    setProfiles(profiles.map(p => {
                      if (p.id === activeProfileId) {
                        return { ...p, dislikedIngredients: [...p.dislikedIngredients, newDislikedInput.trim()] };
                      }
                      return p;
                    }));
                    setNewDislikedInput('');
                  }}
                  style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Bloquear
                </button>
              </div>
            </div>
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
