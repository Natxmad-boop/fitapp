import React, { createContext, useContext, useState, useEffect } from 'react';

// ==========================================
// 1. TIPOS E INTERFACES
// ==========================================
export type Goal = 'perder_grasa' | 'ganar_musculo' | 'ganar_fuerza' | 'mejorar_resistencia' | 'mantener';
export type ExperienceLevel = 'principiante' | 'intermedio' | 'avanzado';
export type ContextType = 'casa' | 'gimnasio' | 'mixto';

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  experience: ExperienceLevel;
  goal: Goal;
  daysAvailable: number;
  context: ContextType;
  equipment: string[];
  allergies: string[];
  dislikedFoods: string[];
}

export interface Exercise {
  id: string;
  name: string;
  muscle: 'pecho' | 'espalda' | 'hombros' | 'piernas' | 'abdomen' | 'cardio';
  defaultSets: number;
  defaultReps: number;
  defaultWeight: string;
  context: ('casa' | 'gimnasio')[];
  equipmentNeeded: string;
}

export interface WorkoutSetLog {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutLogRecord {
  id: string;
  date: string;
  exerciseName: string;
  sets: WorkoutSetLog[];
}

export interface MealItem {
  id: string;
  name: string;
  category: 'desayuno' | 'comida' | 'merienda' | 'cena' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface BodyMeasurement {
  date: string;
  weight: number;
  bodyFat?: number;
}

// ==========================================
// 2. CONSTANTES (BASE DE DATOS LOCAL)
// ==========================================
const MASTER_EXERCISES: Exercise[] = [
  { id: '1', name: 'Press de Banca Plano', muscle: 'pecho', defaultSets: 4, defaultReps: 10, defaultWeight: '60', context: ['gimnasio'], equipmentNeeded: 'barra' },
  { id: '2', name: 'Flexiones de Pecho', muscle: 'pecho', defaultSets: 3, defaultReps: 15, defaultWeight: '0', context: ['casa', 'gimnasio'], equipmentNeeded: 'corporal' },
  { id: '3', name: 'Press Inclinado con Mancuernas', muscle: 'pecho', defaultSets: 3, defaultReps: 12, defaultWeight: '20', context: ['casa', 'gimnasio'], equipmentNeeded: 'mancuernas' },
  { id: '4', name: 'Dominadas Libres', muscle: 'espalda', defaultSets: 4, defaultReps: 8, defaultWeight: '0', context: ['casa', 'gimnasio'], equipmentNeeded: 'barra de dominadas' },
  { id: '5', name: 'Remo con Barra', muscle: 'espalda', defaultSets: 4, defaultReps: 10, defaultWeight: '50', context: ['gimnasio'], equipmentNeeded: 'barra' },
  { id: '6', name: 'Remo con Mancuerna a 1 Mano', muscle: 'espalda', defaultSets: 3, defaultReps: 12, defaultWeight: '18', context: ['casa', 'gimnasio'], equipmentNeeded: 'mancuernas' },
  { id: '7', name: 'Press Militar de Pie', muscle: 'hombros', defaultSets: 4, defaultReps: 10, defaultWeight: '35', context: ['gimnasio'], equipmentNeeded: 'barra' },
  { id: '8', name: 'Elevaciones Laterales', muscle: 'hombros', defaultSets: 4, defaultReps: 15, defaultWeight: '10', context: ['casa', 'gimnasio'], equipmentNeeded: 'mancuernas' },
  { id: '9', name: 'Sentadilla Libre', muscle: 'piernas', defaultSets: 4, defaultReps: 8, defaultWeight: '70', context: ['gimnasio'], equipmentNeeded: 'barra' },
  { id: '10', name: 'Sentadillas Búlgaras', muscle: 'piernas', defaultSets: 3, defaultReps: 12, defaultWeight: '14', context: ['casa', 'gimnasio'], equipmentNeeded: 'mancuernas' },
  { id: '11', name: 'Zancadas (Lunges)', muscle: 'piernas', defaultSets: 3, defaultReps: 12, defaultWeight: '12', context: ['casa', 'gimnasio'], equipmentNeeded: 'corporal' },
  { id: '12', name: 'Crunch Abdominal', muscle: 'abdomen', defaultSets: 3, defaultReps: 20, defaultWeight: '0', context: ['casa', 'gimnasio'], equipmentNeeded: 'corporal' },
  { id: '13', name: 'Plancha Isométrica', muscle: 'abdomen', defaultSets: 3, defaultReps: 60, defaultWeight: '0', context: ['casa', 'gimnasio'], equipmentNeeded: 'corporal' },
  { id: '14', name: 'HIIT / Carrera continua', muscle: 'cardio', defaultSets: 1, defaultReps: 20, defaultWeight: '0', context: ['casa', 'gimnasio'], equipmentNeeded: 'cinta' }
];

const MASTER_MEALS: MealItem[] = [
  { id: 'm1', name: 'Avena con plátano y proteína', category: 'desayuno', calories: 380, protein: 25, carbs: 55, fats: 6 },
  { id: 'm2', name: 'Tostadas de aguacate con huevos revueltos', category: 'desayuno', calories: 420, protein: 22, carbs: 30, fats: 24 },
  { id: 'm3', name: 'Pechuga de pollo a la plancha con arroz y brócoli', category: 'comida', calories: 550, protein: 48, carbs: 60, fats: 8 },
  { id: 'm4', name: 'Salmón al horno con patata asada y espárragos', category: 'comida', calories: 620, protein: 42, carbs: 45, fats: 26 },
  { id: 'm5', name: 'Yogur griego con frutos rojos y nueces', category: 'merienda', calories: 250, protein: 18, carbs: 20, fats: 12 },
  { id: 'm6', name: 'Tortilla francesa de claras con espinacas y pavo', category: 'cena', calories: 310, protein: 35, carbs: 5, fats: 10 },
  { id: 'm7', name: 'Merluza a la plancha con puré de patata casero', category: 'cena', calories: 380, protein: 38, carbs: 35, fats: 7 }
];

// ==========================================
// 3. CONTEXTO GLOBAL Y PERSISTENCIA
// ==========================================
interface FitAppContextData {
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  workoutLogs: WorkoutLogRecord[];
  saveWorkoutLog: (log: WorkoutLogRecord) => void;
  measurements: BodyMeasurement[];
  addMeasurement: (weight: number) => void;
  streak: number;
  excludedExercises: string[];
  excludeExercise: (name: string) => void;
}

const defaultProfile: UserProfile = {
  name: 'Alex Hunter',
  age: 26,
  gender: 'Hombre',
  height: 180,
  weight: 78,
  experience: 'intermedio',
  goal: 'ganar_musculo',
  daysAvailable: 4,
  context: 'gimnasio',
  equipment: ['mancuernas', 'barra', 'banco', 'maquinas'],
  allergies: [],
  dislikedFoods: []
};

const FitAppContext = createContext<FitAppContextData | undefined>(undefined);

export const FitAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fitapp_profile_v3');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogRecord[]>(() => {
    const saved = localStorage.getItem('fitapp_logs_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(() => {
    const saved = localStorage.getItem('fitapp_measurements_v3');
    return saved ? JSON.parse(saved) : [{ date: new Date().toISOString().split('T')[0], weight: defaultProfile.weight }];
  });

  const [excludedExercises, setExcludedExercises] = useState<string[]>(() => {
    const saved = localStorage.getItem('fitapp_excluded_v3');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('fitapp_profile_v3', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('fitapp_logs_v3', JSON.stringify(workoutLogs)); }, [workoutLogs]);
  useEffect(() => { localStorage.setItem('fitapp_measurements_v3', JSON.stringify(measurements)); }, [measurements]);
  useEffect(() => { localStorage.setItem('fitapp_excluded_v3', JSON.stringify(excludedExercises)); }, [excludedExercises]);

  const updateProfile = (newProfile: Partial<UserProfile>) => setProfile(prev => ({ ...prev, ...newProfile }));
  const saveWorkoutLog = (log: WorkoutLogRecord) => setWorkoutLogs(prev => [log, ...prev]);
  const addMeasurement = (weight: number) => {
    const today = new Date().toISOString().split('T')[0];
    setMeasurements(prev => [...prev.filter(m => m.date !== today), { date: today, weight }]);
    updateProfile({ weight });
  };
  const excludeExercise = (name: string) => {
    if (!excludedExercises.includes(name)) setExcludedExercises(prev => [...prev, name]);
  };

  const uniqueDays = new Set(workoutLogs.map(l => l.date)).size;
  const streak = uniqueDays > 0 ? uniqueDays : 5;

  return (
    <FitAppContext.Provider value={{
      profile, updateProfile, workoutLogs, saveWorkoutLog, measurements,
      addMeasurement, streak, excludedExercises, excludeExercise
    }}>
      {children}
    </FitAppContext.Provider>
  );
};

export const useFitApp = () => {
  const context = useContext(FitAppContext);
  if (!context) throw new Error('useFitApp debe usarse dentro de un FitAppProvider');
  return context;
};

// ==========================================
// 4. ESTILOS CSS INLINE (GARANTÍA MÓVIL)
// ==========================================
const s = {
  container: {
    backgroundColor: '#09090b',
    color: '#f4f4f5',
    minHeight: '100vh',
    maxWidth: '480px',
    margin: '0 auto',
    padding: '16px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    paddingBottom: '100px',
    boxSizing: 'border-box' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '16px',
    borderBottom: '1px solid #27272a',
    marginBottom: '20px',
  },
  logo: {
    fontSize: '18px',
    fontWeight: 900,
    background: 'linear-gradient(90deg, #ffffff 0%, #22d3ee 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  badge: {
    fontSize: '10px',
    backgroundColor: '#18181b',
    color: '#22d3ee',
    border: '1px solid rgba(34, 211, 238, 0.3)',
    padding: '4px 10px',
    borderRadius: '20px',
    fontWeight: 800,
  },
  card: {
    backgroundColor: '#121215',
    border: '1px solid #27272a',
    borderRadius: '24px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
  },
  heroCard: {
    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #1e1b4b 100%)',
    borderRadius: '24px',
    padding: '24px',
    color: '#ffffff',
    marginBottom: '16px',
    boxShadow: '0 15px 30px -10px rgba(2, 132, 199, 0.4)',
  },
  buttonPrimary: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#ffffff',
    color: '#09090b',
    fontWeight: 900,
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    marginTop: '12px',
  },
  buttonCyan: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
    color: '#ffffff',
    fontWeight: 900,
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    backgroundColor: '#09090b',
    border: '1px solid #27272a',
    borderRadius: '16px',
    padding: '14px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    marginTop: '6px',
    marginBottom: '12px',
  },
  nav: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18, 18, 21, 0.95)',
    backdropFilter: 'blur(10px)',
    borderTop: '1px solid #27272a',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '12px 0',
    maxWidth: '480px',
    margin: '0 auto',
    zIndex: 100,
  },
  navItem: (active: boolean) => ({
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    color: active ? '#22d3ee' : '#71717a',
    fontSize: '11px',
    fontWeight: active ? 800 : 500,
    cursor: 'pointer',
  }),
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  }
};

// ==========================================
// 5. VISTAS DE LA APLICACIÓN
// ==========================================

const Dashboard: React.FC<{ onStartWorkout: () => void; onGoToNutrition: () => void }> = ({ onStartWorkout, onGoToNutrition }) => {
  const { profile, streak, workoutLogs } = useFitApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkouts = workoutLogs.filter(l => l.date === todayStr);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Saludo y Racha */}
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#22d3ee', fontWeight: 800 }}>PRO MEMBER</span>
            <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '4px 0 0 0', color: '#ffffff' }}>Hola, {profile.name} ✨</h1>
          </div>
          <div style={{ background: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '8px 12px', borderRadius: '14px', color: '#fb923c', fontWeight: 900, fontSize: '12px' }}>
            🔥 {streak} DÍAS
          </div>
        </div>
      </div>

      {/* Banner Principal */}
      <div style={s.heroCard}>
        <span style={{ fontSize: '10px', background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
          Objetivo: {profile.goal.replace('_', ' ')}
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '12px 0 8px 0' }}>Sesión del Día</h2>
        <p style={{ fontSize: '12px', color: '#e0f2fe', margin: 0, lineHeight: 1.5 }}>
          {todayWorkouts.length > 0 
            ? `⚡ ¡Gran trabajo! Has completado ${todayWorkouts.length} bloque(s) hoy.` 
            : 'Tu motor adaptativo ha preparado una sesión óptima para tu evolución.'}
        </p>
        <button onClick={onStartWorkout} style={s.buttonPrimary}>
          🚀 EMPEZAR ENTRENAMIENTO
        </button>
      </div>

      {/* Tarjeta Nutrición */}
      <div onClick={onGoToNutrition} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🥗</span> Nutrición Inteligente
          </div>
          <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '4px 0 0 0' }}>
            Alergias: {profile.allergies.length > 0 ? profile.allergies.join(', ') : 'Ninguna'}
          </p>
        </div>
        <span style={{ color: '#22d3ee', fontSize: '18px', fontWeight: 'bold' }}>➔</span>
      </div>
    </div>
  );
};

const WorkoutView: React.FC<{ onSelectExerciseToPlay: (exercises: Exercise[]) => void }> = ({ onSelectExerciseToPlay }) => {
  const { excludedExercises } = useFitApp();

  const muscles = [
    { key: 'pecho', label: '🦾 Pecho', desc: 'Fuerza y volumen', bg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.15))' },
    { key: 'espalda', label: '🦇 Espalda', desc: 'Anchura y densidad', bg: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(79, 70, 229, 0.15))' },
    { key: 'hombros', label: '🛡️ Hombros', desc: 'Definición 3D', bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(225, 29, 72, 0.15))' },
    { key: 'piernas', label: '🦵 Piernas', desc: 'Potencia inferior', bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 88, 12, 0.15))' },
    { key: 'abdomen', label: '⚡ Abdomen', desc: 'Core blindado', bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(20, 184, 166, 0.15))' },
    { key: 'cardio', label: '🏃‍♂️ Cardio', desc: 'HIIT & Resistencia', bg: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(37, 99, 235, 0.15))' }
  ];

  const handleStartMuscle = (muscleKey: string) => {
    const filtered = MASTER_EXERCISES.filter(ex => ex.muscle === muscleKey && !excludedExercises.includes(ex.name));
    if (filtered.length === 0) {
      alert('No hay ejercicios para este grupo.');
      return;
    }
    onSelectExerciseToPlay(filtered);
  };

  const handleExpr = () => {
    const filtered = MASTER_EXERCISES.filter(ex => !excludedExercises.includes(ex.name));
    onSelectExerciseToPlay(filtered.slice(0, 4));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Motor de Fuerza</span>
          <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Entrenamiento</h1>
        </div>
        <button onClick={handleExpr} style={{ background: '#22d3ee', color: '#09090b', border: 'none', padding: '8px 14px', borderRadius: '14px', fontSize: '11px', fontWeight: 900 }}>
          ⚡ Exprés
        </button>
      </div>

      <div style={s.grid}>
        {muscles.map(m => (
          <button
            key={m.key}
            onClick={() => handleStartMuscle(m.key)}
            style={{
              background: m.bg,
              backgroundColor: '#121215',
              border: '1px solid #27272a',
              borderRadius: '20px',
              padding: '16px',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '110px'
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>{m.label}</span>
            <div>
              <span style={{ fontSize: '11px', color: '#a1a1aa', display: 'block' }}>{m.desc}</span>
              <span style={{ fontSize: '10px', color: '#22d3ee', fontWeight: 800, marginTop: '4px', display: 'inline-block' }}>Iniciar ➔</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const ActiveWorkoutPlayer: React.FC<{ exercises: Exercise[]; onFinish: () => void }> = ({ exercises, onFinish }) => {
  const { saveWorkoutLog } = useFitApp();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState(exercises[0]?.defaultWeight || '0');
  const [reps, setReps] = useState(String(exercises[0]?.defaultReps || 10));
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);

  const currentEx = exercises[currentIndex];

  useEffect(() => {
    let timer: any;
    if (isResting && restTime > 0) {
      timer = setInterval(() => setRestTime(prev => prev - 1), 1000);
    } else if (restTime === 0) {
      setIsResting(false);
    }
    return () => clearInterval(timer);
  }, [isResting, restTime]);

  const handleCompleteSet = () => {
    saveWorkoutLog({
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      exerciseName: currentEx.name,
      sets: [{ setNumber: currentSet, weight: Number(weight), reps: Number(reps), completed: true }]
    });

    setIsResting(true);
    setRestTime(60);

    if (currentSet < currentEx.defaultSets) {
      setCurrentSet(prev => prev + 1);
    } else {
      if (currentIndex < exercises.length - 1) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setCurrentSet(1);
        setWeight(exercises[nextIdx].defaultWeight);
        setReps(String(exercises[nextIdx].defaultReps));
      } else {
        alert('🏆 ¡Entrenamiento completado!');
        onFinish();
      }
    }
  };

  return (
    <div style={{ ...s.card, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {isResting && (
        <div style={{ background: '#082f49', border: '1px solid #0284c7', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 900, textTransform: 'uppercase' }}>⏸ Descanso Activo</span>
          <div style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>0:{restTime < 10 ? `0${restTime}` : restTime}</div>
          <button onClick={() => { setIsResting(false); setRestTime(0); }} style={{ background: '#0369a1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>Saltar</button>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a1a1aa', fontWeight: 800 }}>
        <span>Ejercicio {currentIndex + 1} / {exercises.length}</span>
        <span style={{ color: '#22d3ee' }}>Serie {currentSet} de {currentEx.defaultSets}</span>
      </div>

      <div>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: 0 }}>{currentEx.name}</h2>
        <span style={{ fontSize: '11px', color: '#22d3ee', textTransform: 'uppercase', fontWeight: 700 }}>Músculo: {currentEx.muscle}</span>
      </div>

      <div>
        <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 800 }}>Peso aplicado (kg)</label>
        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={s.input} />
      </div>

      <div>
        <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 800 }}>Repeticiones</label>
        <input type="number" value={reps} onChange={e => setReps(e.target.value)} style={s.input} />
      </div>

      <button onClick={handleCompleteSet} disabled={isResting} style={{ ...s.buttonCyan, opacity: isResting ? 0.5 : 1 }}>
        ✓ REGISTRAR SERIE Y DESCANSAR
      </button>

      <button onClick={onFinish} style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: '8px' }}>
        Finalizar sesión
      </button>
    </div>
  );
};

const NutritionView: React.FC = () => {
  const { profile, updateProfile } = useFitApp();
  const [newAllergy, setNewAllergy] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAllergy.trim()) return;
    updateProfile({ allergies: [...profile.allergies, newAllergy.trim()] });
    setNewAllergy('');
  };

  const safeMeals = MASTER_MEALS.filter(meal => {
    const nameLower = meal.name.toLowerCase();
    return !profile.allergies.some(allergy => nameLower.includes(allergy.toLowerCase()));
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Planificación</span>
        <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Nutrición</h1>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px 0' }}>⚠️ Alergias y Restricciones</h3>
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px' }}>
          <input type="text" placeholder="Ej: lactosa..." value={newAllergy} onChange={e => setNewAllergy(e.target.value)} style={{ ...s.input, margin: 0, flex: 1 }} />
          <button type="submit" style={{ background: '#22d3ee', color: '#09090b', border: 'none', padding: '0 16px', borderRadius: '14px', fontWeight: 900, fontSize: '12px' }}>Añadir</button>
        </form>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
          {profile.allergies.map(a => (
            <span key={a} style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', color: '#fbbf24', fontSize: '11px', padding: '4px 10px', borderRadius: '10px', fontWeight: 700 }}>
              {a} <button onClick={() => updateProfile({ allergies: profile.allergies.filter(i => i !== a) })} style={{ background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontWeight: 'bold', marginLeft: '4px' }}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#a1a1aa', margin: 0 }}>Menús Optimizados</h3>
        {safeMeals.map(meal => (
          <div key={meal.id} style={s.card}>
            <span style={{ fontSize: '9px', fontWeight: 900, color: '#22d3ee', textTransform: 'uppercase', background: 'rgba(34, 211, 238, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>{meal.category}</span>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', margin: '6px 0 2px 0' }}>{meal.name}</h4>
            <p style={{ fontSize: '11px', color: '#71717a', margin: 0 }}>{meal.calories} kcal • {meal.protein}g proteína</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProgressView: React.FC = () => {
  const { measurements, addMeasurement, streak, workoutLogs } = useFitApp();
  const [weightInput, setWeightInput] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Analytics</span>
        <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Progreso</h1>
      </div>

      <div style={s.grid}>
        <div style={s.card}>
          <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 700 }}>Racha</span>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#fb923c', margin: '6px 0 0 0' }}>🔥 {streak} días</div>
        </div>
        <div style={s.card}>
          <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 700 }}>Sesiones</span>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#22d3ee', margin: '6px 0 0 0' }}>⚡ {workoutLogs.length}</div>
        </div>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', margin: '0 0 8px 0' }}>Registrar Peso Actual</h3>
        <form onSubmit={e => { e.preventDefault(); const w = Number(weightInput); if(w) { addMeasurement(w); setWeightInput(''); }}} style={{ display: 'flex', gap: '8px' }}>
          <input type="number" step="0.1" placeholder="Ej: 78 kg" value={weightInput} onChange={e => setWeightInput(e.target.value)} style={{ ...s.input, margin: 0, flex: 1 }} />
          <button type="submit" style={{ background: '#22d3ee', color: '#09090b', border: 'none', padding: '0 16px', borderRadius: '14px', fontWeight: 900, fontSize: '12px' }}>Guardar</button>
        </form>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', margin: '0 0 10px 0' }}>Historial</h3>
        {measurements.slice().reverse().map((m, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderBottom: '1px solid #27272a', paddingBottom: '8px', marginBottom: '8px' }}>
            <span style={{ color: '#a1a1aa' }}>{m.date}</span>
            <span style={{ color: '#ffffff', fontWeight: 800 }}>{m.weight} kg</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProfileView: React.FC = () => {
  const { profile, updateProfile } = useFitApp();
  const [name, setName] = useState(profile.name);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Configuración</span>
        <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Perfil</h1>
      </div>
      <div style={s.card}>
        <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 800 }}>Nombre Comercial</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} style={s.input} />
        <button onClick={() => { updateProfile({ name }); alert('¡Actualizado con éxito!'); }} style={s.buttonCyan}>
          GUARDAR CAMBIOS
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 6. COMPONENTE PRINCIPAL APP
// ==========================================
function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeWorkoutExercises, setActiveWorkoutExercises] = useState<Exercise[] | null>(null);

  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: '⚡' },
    { id: 'train', label: 'Entrenar', icon: '🔥' },
    { id: 'nutrition', label: 'Nutrición', icon: '🥗' },
    { id: 'progress', label: 'Progreso', icon: '📈' },
    { id: 'profile', label: 'Perfil', icon: '👤' },
  ];

  return (
    <div style={s.container}>
      <header style={s.header}>
        <span style={s.logo}>FITAPP PRO</span>
        <span style={s.badge}>v2.0 ELITE</span>
      </header>

      <main style={{ flex: 1 }}>
        {activeWorkoutExercises ? (
          <ActiveWorkoutPlayer exercises={activeWorkoutExercises} onFinish={() => setActiveWorkoutExercises(null)} />
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard onStartWorkout={() => setActiveTab('train')} onGoToNutrition={() => setActiveTab('nutrition')} />}
            {activeTab === 'train' && <WorkoutView onSelectExerciseToPlay={(exs) => setActiveWorkoutExercises(exs)} />}
            {activeTab === 'nutrition' && <NutritionView />}
            {activeTab === 'progress' && <ProgressView />}
            {activeTab === 'profile' && <ProfileView />}
          </>
        )}
      </main>

      {!activeWorkoutExercises && (
        <nav style={s.nav}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={s.navItem(isActive)}>
                <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <FitAppProvider>
      <AppContent />
    </FitAppProvider>
  );
}
