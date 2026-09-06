import React, { createContext, useContext, useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';

// ==========================================
// 0. CAPTURADOR VISUAL DE ERRORES (BLINDADO)
// ==========================================
interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#7f1d1d', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h2>¡Vaya, algo ha fallado!</h2>
          <p style={{ fontSize: '12px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', wordBreak: 'break-all' }}>
            {this.state.error && this.state.error.toString()}
          </p>
          <button 
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: '20px', padding: '12px', background: '#fff', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Limpiar datos y reiniciar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ==========================================
// 1. TIPOS E INTERFACES
// ==========================================
export type Goal = 'perder_grasa' | 'ganar_musculo' | 'ganar_fuerza' | 'mantener';
export type ExperienceLevel = 'principiante' | 'intermedio' | 'avanzado';
export type ContextType = 'casa' | 'gimnasio' | 'fuera_de_casa';

export interface CustomEquipmentItem {
  id: string;
  name: string;
  icon: string;
}

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
  customEquipmentList: CustomEquipmentItem[];
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
  context: ('casa' | 'gimnasio' | 'fuera_de_casa')[];
  equipmentNeeded: string;
  description: string;
  homeAlternative: string;
  videoUrl: string;
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
// 2. CONSTANTES Y MATERIALES BASE
// ==========================================
const DEFAULT_CUSTOM_EQUIPMENT: CustomEquipmentItem[] = [
  { id: 'bandas_elasticas', name: 'Bandas elásticas', icon: '🪡' },
  { id: 'rodillo_abdominal', name: 'Rodillo de abdominales', icon: '⭕' },
  { id: 'tronco_madera', name: 'Tronco de madera', icon: '🪵' },
  { id: 'silla_toalla', name: 'Silla / Toalla casera', icon: '🪑' }
];

const MASTER_EXERCISES: Exercise[] = [
  { 
    id: '1', 
    name: 'Press de Banca Plano', 
    muscle: 'pecho', 
    defaultSets: 4, 
    defaultReps: 10, 
    defaultWeight: '60', 
    context: ['gimnasio'], 
    equipmentNeeded: 'barra',
    description: 'Acuéstate en el banco, agarra la barra un poco más ancha que los hombros, baja de forma controlada hasta el pecho y empuja hacia arriba.',
    homeAlternative: 'Flexiones declinadas o press de suelo con bandas elásticas pisadas en la espalda.',
    videoUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '2', 
    name: 'Flexiones de Pecho', 
    muscle: 'pecho', 
    defaultSets: 3, 
    defaultReps: 15, 
    defaultWeight: '0', 
    context: ['casa', 'gimnasio', 'fuera_de_casa'], 
    equipmentNeeded: 'corporal',
    description: 'Manos a la altura de los hombros, cuerpo totalmente recto y flexionar codos a 45 grados sin arquear la zona lumbar.',
    homeAlternative: 'Se puede hacer con manos sobre una silla si es muy duro, o en el suelo.',
    videoUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '3', 
    name: 'Remo con Mancuerna a 1 Mano', 
    muscle: 'espalda', 
    defaultSets: 3, 
    defaultReps: 12, 
    defaultWeight: '18', 
    context: ['casa', 'gimnasio'], 
    equipmentNeeded: 'mancuernas',
    description: 'Apoya una rodilla y mano en un banco o silla, mantén la espalda neutra y tira del peso hacia tu cadera apretando la escápula.',
    homeAlternative: 'Usa una mochila cargada de libros o un tronco de madera ligero.',
    videoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '4', 
    name: 'Elevaciones Laterales', 
    muscle: 'hombros', 
    defaultSets: 4, 
    defaultReps: 15, 
    defaultWeight: '10', 
    context: ['casa', 'gimnasio'], 
    equipmentNeeded: 'mancuernas',
    description: 'De pie, eleva los brazos hacia los lados con una ligera flexión de codo hasta que queden paralelos al suelo.',
    homeAlternative: 'Usa bandas elásticas pisadas con los pies o botellas de agua.',
    videoUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '5', 
    name: 'Sentadilla Libre / Con Carga', 
    muscle: 'piernas', 
    defaultSets: 4, 
    defaultReps: 10, 
    defaultWeight: '50', 
    context: ['casa', 'gimnasio', 'fuera_de_casa'], 
    equipmentNeeded: 'barra',
    description: 'Pies al ancho de caderas, baja la cadera hacia atrás manteniendo el pecho erguido y las rodillas alineadas con la punta de los pies.',
    homeAlternative: 'Si estás sin peso, sostén un tronco de madera en los hombros o haz sentadillas búlgaras apoyando el pie en una silla.',
    videoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=400&q=80'
  },
  { 
    id: '6', 
    name: 'Rueda Abdominal (Rodillo)', 
    muscle: 'abdomen', 
    defaultSets: 3, 
    defaultReps: 12, 
    defaultWeight: '0', 
    context: ['casa', 'gimnasio'], 
    equipmentNeeded: 'rodillo_abdominal',
    description: 'De rodillas, rueda hacia adelante contrayendo fuertemente el abdomen sin arquear la espalda baja antes de volver.',
    homeAlternative: 'Si no tienes el rodillo, usa una toalla deslizable sobre suelo liso o haz plancha isométrica.',
    videoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&q=80'
  }
];

const MASTER_MEALS: MealItem[] = [
  { id: 'm1', name: 'Avena con plátano y proteína', category: 'desayuno', calories: 380, protein: 25, carbs: 55, fats: 6 },
  { id: 'm2', name: 'Pechuga de pollo con arroz y brócoli', category: 'comida', calories: 550, protein: 48, carbs: 60, fats: 8 },
  { id: 'm3', name: 'Tortilla francesa con espinacas y pavo', category: 'cena', calories: 310, protein: 35, carbs: 5, fats: 10 }
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
  toggleEquipment: (item: string) => void;
  addNewCustomEquipment: (name: string, icon: string) => void;
}

const defaultProfile: UserProfile = {
  name: 'Atleta',
  age: 28,
  gender: 'Hombre',
  height: 178,
  weight: 75,
  experience: 'intermedio',
  goal: 'ganar_musculo',
  daysAvailable: 4,
  context: 'casa',
  equipment: ['bandas_elasticas', 'rodillo_abdominal', 'tronco_madera'],
  customEquipmentList: DEFAULT_CUSTOM_EQUIPMENT,
  allergies: [],
  dislikedFoods: []
};

const FitAppContext = createContext<FitAppContextData | undefined>(undefined);

export const FitAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('fitapp_profile_v7');
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch (e) {
      return defaultProfile;
    }
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fitapp_logs_v7');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(() => {
    try {
      const saved = localStorage.getItem('fitapp_measurements_v7');
      return saved ? JSON.parse(saved) : [{ date: new Date().toISOString().split('T')[0], weight: defaultProfile.weight }];
    } catch (e) {
      return [{ date: new Date().toISOString().split('T')[0], weight: defaultProfile.weight }];
    }
  });

  const [excludedExercises, setExcludedExercises] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fitapp_excluded_v7');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => { localStorage.setItem('fitapp_profile_v7', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('fitapp_logs_v7', JSON.stringify(workoutLogs)); }, [workoutLogs]);
  useEffect(() => { localStorage.setItem('fitapp_measurements_v7', JSON.stringify(measurements)); }, [measurements]);
  useEffect(() => { localStorage.setItem('fitapp_excluded_v7', JSON.stringify(excludedExercises)); }, [excludedExercises]);

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

  const toggleEquipment = (item: string) => {
    const exists = profile.equipment.includes(item);
    const newEq = exists ? profile.equipment.filter(e => e !== item) : [...profile.equipment, item];
    updateProfile({ equipment: newEq });
  };

  const addNewCustomEquipment = (name: string, icon: string) => {
    if (!name.trim()) return;
    const newId = 'custom_' + Date.now();
    const newItem: CustomEquipmentItem = { id: newId, name: name.trim(), icon: icon || '🏋️‍♂️' };
    
    setProfile(prev => ({
      ...prev,
      customEquipmentList: [...prev.customEquipmentList, newItem],
      equipment: [...prev.equipment, newId]
    }));
  };

  const uniqueDays = new Set(workoutLogs.map(l => l.date)).size;
  const streak = uniqueDays > 0 ? uniqueDays : 1;

  return (
    <FitAppContext.Provider value={{
      profile, updateProfile, workoutLogs, saveWorkoutLog, measurements,
      addMeasurement, streak, excludedExercises, excludeExercise, toggleEquipment, addNewCustomEquipment
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
// 4. ESTILOS CSS INLINE
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
  buttonBack: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid #27272a',
    color: '#22d3ee',
    padding: '8px 14px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 800,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '16px'
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
// 5. VISTAS FUNCIONALES
// ==========================================
const Dashboard: React.FC<{ onStartWorkout: () => void; onGoToProfile: () => void }> = ({ onStartWorkout, onGoToProfile }) => {
  const { profile, streak, workoutLogs } = useFitApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkouts = workoutLogs.filter(l => l.date === todayStr);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#22d3ee', fontWeight: 800 }}>ENTORNO: {profile.context.toUpperCase()}</span>
            <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '4px 0 0 0', color: '#ffffff' }}>Hola, {profile.name} ✨</h1>
          </div>
          <div style={{ background: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '8px 12px', borderRadius: '14px', color: '#fb923c', fontWeight: 900, fontSize: '12px' }}>
            🔥 {streak} DÍAS
          </div>
        </div>
      </div>

      <div style={s.heroCard}>
        <span style={{ fontSize: '10px', background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
          Modo activo: {profile.context.replace('_', ' ')}
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '12px 0 8px 0' }}>Sesión Adaptada</h2>
        <p style={{ fontSize: '12px', color: '#e0f2fe', margin: 0, lineHeight: 1.5 }}>
          {todayWorkouts.length > 0 
            ? `⚡ ¡Gran trabajo! Has registrado ${todayWorkouts.length} ejercicio(s) hoy.` 
            : `Optimizando ejercicios para ${profile.context.replace('_', ' ')} con tus ${profile.equipment.length} materiales activos.`}
        </p>
        <button onClick={onStartWorkout} style={s.buttonPrimary}>
          🚀 EMPEZAR ENTRENAMIENTO
        </button>
      </div>

      <div onClick={onGoToProfile} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎒</span> Gestionar Materiales y Entorno
          </div>
          <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '4px 0 0 0' }}>
            Cambia entre casa, gimnasio o añade compras nuevas.
          </p>
        </div>
        <span style={{ color: '#22d3ee', fontSize: '18px', fontWeight: 'bold' }}>➔</span>
      </div>
    </div>
  );
};

const WorkoutView: React.FC<{ onSelectExerciseToPlay: (exercises: Exercise[]) => void; onBackToHome: () => void }> = ({ onSelectExerciseToPlay, onBackToHome }) => {
  const { profile, excludedExercises } = useFitApp();

  const muscles = [
    { key: 'pecho', label: '🦾 Pecho', desc: 'Fuerza y volumen', bg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.15))' },
    { key: 'espalda', label: '🦇 Espalda', desc: 'Anchura y densidad', bg: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(79, 70, 229, 0.15))' },
    { key: 'hombros', label: '🛡️ Hombros', desc: 'Definición 3D', bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(225, 29, 72, 0.15))' },
    { key: 'piernas', label: '🦵 Piernas', desc: 'Potencia inferior', bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 88, 12, 0.15))' },
    { key: 'abdomen', label: '⚡ Abdomen', desc: 'Core blindado', bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(20, 184, 166, 0.15))' },
    { key: 'cardio', label: '🏃‍♂️ Cardio', desc: 'HIIT & Resistencia', bg: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(37, 99, 235, 0.15))' }
  ];

  const handleStartMuscle = (muscleKey: string) => {
    // Filtramos por músculo, que no esté excluido, y que encaje en el contexto actual del usuario
    const filtered = MASTER_EXERCISES.filter(ex => 
      ex.muscle === muscleKey && 
      !excludedExercises.includes(ex.name) &&
      ex.context.includes(profile.context)
    );

    if (filtered.length === 0) {
      alert(`No hay ejercicios de este grupo adaptados para "${profile.context.toUpperCase()}". Cambia de entorno en el Perfil.`);
      return;
    }
    onSelectExerciseToPlay(filtered);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button onClick={onBackToHome} style={s.buttonBack}>
        ← Volver al inicio
      </button>

      <div>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Entorno activo: {profile.context.toUpperCase()}</span>
        <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Selecciona Músculo</h1>
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
              <span style={{ fontSize: '10px', color: '#22d3ee', fontWeight: 800, marginTop: '4px', display: 'inline-block' }}>Iniciar Play ➔</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const ActiveWorkoutPlayer: React.FC<{ exercises: Exercise[]; onFinish: () => void }> = ({ exercises, onFinish }) => {
  const { saveWorkoutLog, profile } = useFitApp();
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
        alert('🏆 ¡Entrenamiento completado con éxito!');
        onFinish();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button onClick={onFinish} style={s.buttonBack}>
        ← Salir al menú
      </button>

      <div style={{ ...s.card, display: 'flex', flexDirection: 'column', gap: '16px', margin: 0 }}>
        {isResting && (
          <div style={{ background: '#082f49', border: '1px solid #0284c7', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 900, textTransform: 'uppercase' }}>⏸ Descanso Automático</span>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>0:{restTime < 10 ? `0${restTime}` : restTime}</div>
            <button onClick={() => { setIsResting(false); setRestTime(0); }} style={{ background: '#0369a1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Saltar Descanso</button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#a1a1aa', fontWeight: 800 }}>
          <span>Ejercicio {currentIndex + 1} de {exercises.length}</span>
          <span style={{ color: '#22d3ee' }}>Serie {currentSet} / {currentEx.defaultSets}</span>
        </div>

        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', margin: 0 }}>{currentEx.name}</h2>
          <span style={{ fontSize: '11px', color: '#22d3ee', textTransform: 'uppercase', fontWeight: 700 }}>Grupo: {currentEx.muscle}</span>
        </div>

        <div style={{ background: '#18181b', borderRadius: '16px', padding: '12px', border: '1px solid #27272a' }}>
          <img 
            src={currentEx.videoUrl} 
            alt={currentEx.name} 
            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '8px' }} 
          />
          <div style={{ fontSize: '12px', color: '#e4e4e7', lineHeight: 1.4, marginBottom: '6px' }}>
            <strong>💡 Técnica correcta:</strong> {currentEx.description}
          </div>
          {profile.context === 'casa' && (
            <div style={{ fontSize: '11px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '8px', borderRadius: '8px' }}>
              🏠 <strong>Alternativa en casa:</strong> {currentEx.homeAlternative}
            </div>
          )}
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 800 }}>Peso Aplicado (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={s.input} />
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 800 }}>Repeticiones Realizadas</label>
          <input type="number" value={reps} onChange={e => setReps(e.target.value)} style={s.input} />
        </div>

        <button onClick={handleCompleteSet} disabled={isResting} style={{ ...s.buttonCyan, opacity: isResting ? 0.5 : 1, cursor: 'pointer' }}>
          ✓ COMPLETAR SERIE Y DESCANSAR
        </button>

        <button onClick={onFinish} style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '12px', fontWeight: 700, cursor: 'pointer', padding: '8px' }}>
          Finalizar sesión
        </button>
      </div>
    </div>
  );
};

const NutritionView: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button onClick={onBackToHome} style={s.buttonBack}>
        ← Volver al inicio
      </button>

      <div>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Nutrición Inteligente</span>
        <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Plan de Macros</h1>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {MASTER_MEALS.map(meal => (
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

const ProgressView: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const { measurements, addMeasurement, streak, workoutLogs } = useFitApp();
  const [weightInput, setWeightInput] = useState('');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button onClick={onBackToHome} style={s.buttonBack}>
        ← Volver al inicio
      </button>

      <div>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Analytics</span>
        <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Progreso y Peso</h1>
      </div>

      <div style={s.grid}>
        <div style={s.card}>
          <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 700 }}>Racha Activa</span>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#fb923c', margin: '6px 0 0 0' }}>🔥 {streak} días</div>
        </div>
        <div style={s.card}>
          <span style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 700 }}>Series Totales</span>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#22d3ee', margin: '6px 0 0 0' }}>⚡ {workoutLogs.length}</div>
        </div>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', margin: '0 0 8px 0' }}>Registrar Peso de Hoy</h3>
        <form onSubmit={e => { e.preventDefault(); const w = Number(weightInput); if(w) { addMeasurement(w); setWeightInput(''); }}} style={{ display: 'flex', gap: '8px' }}>
          <input type="number" step="0.1" placeholder="Ej: 76.5 kg" value={weightInput} onChange={e => setWeightInput(e.target.value)} style={{ ...s.input, margin: 0, flex: 1 }} />
          <button type="submit" style={{ background: '#22d3ee', color: '#09090b', border: 'none', padding: '0 16px', borderRadius: '14px', fontWeight: 900, fontSize: '12px', cursor: 'pointer' }}>Guardar</button>
        </form>
      </div>
    </div>
  );
};

const ProfileView: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const { profile, updateProfile, toggleEquipment, addNewCustomEquipment } = useFitApp();
  const [name, setName] = useState(profile.name);
  const [newEquipName, setNewEquipName] = useState('');
  const [newEquipIcon, setNewEquipIcon] = useState('🏋️‍♂️');

  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEquipName.trim()) return;
    addNewCustomEquipment(newEquipName, newEquipIcon);
    setNewEquipName('');
    alert(`¡"${newEquipName}" añadido y configurado en tu inventario con éxito!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button onClick={onBackToHome} style={s.buttonBack}>
        ← Volver al inicio
      </button>

      <div>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Configuración de Entorno</span>
        <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Perfil y Materiales</h1>
      </div>

      <div style={s.card}>
        <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 800 }}>¿Dónde vas a entrenar?</label>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px', marginBottom: '16px' }}>
          {(['casa', 'gimnasio', 'fuera_de_casa'] as ContextType[]).map(ctx => {
            const isSelected = profile.context === ctx;
            return (
              <button
                key={ctx}
                onClick={() => {
                  updateProfile({ context: ctx });
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #22d3ee' : '1px solid #27272a',
                  background: isSelected ? 'rgba(34, 211, 238, 0.2)' : '#09090b',
                  color: isSelected ? '#22d3ee' : '#ffffff',
                  fontWeight: isSelected ? 900 : 800,
                  fontSize: '11px',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {ctx.replace('_', ' ')}
              </button>
            );
          })}
        </div>

        <div style={{ background: 'rgba(34, 211, 238, 0.05)', border: '1px solid rgba(34, 211, 238, 0.2)', padding: '12px', borderRadius: '12px', marginBottom: '16px' }}>
          <span style={{ fontSize: '11px', color: '#22d3ee', fontWeight: 'bold' }}>⚡ Entorno actual seleccionado: <strong>{profile.context.toUpperCase()}</strong></span>
          <p style={{ fontSize: '10px', color: '#a1a1aa', margin: '4px 0 0 0' }}>Las rutinas ahora se adaptan automáticamente a este lugar.</p>
        </div>

        <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
          📦 Materiales disponibles ({profile.equipment.length} activos):
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {profile.customEquipmentList.map(item => {
            const isChecked = profile.equipment.includes(item.id);
            return (
              <div 
                key={item.id} 
                onClick={() => toggleEquipment(item.id)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: isChecked ? 'rgba(34, 211, 238, 0.1)' : '#09090b',
                  border: isChecked ? '1px solid #22d3ee' : '1px solid #27272a',
                  padding: '12px',
                  borderRadius: '12px',
                  cursor: 'pointer'
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>{item.icon} {item.name}</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: isChecked ? '#22d3ee' : '#71717a' }}>{isChecked ? '✓ Activo' : '+ Añadir'}</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: '#18181b', padding: '16px', borderRadius: '16px', border: '1px solid #27272a', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>➕ ¿Has comprado material nuevo?</h3>
          <p style={{ fontSize: '11px', color: '#a1a1aa', margin: '0 0 12px 0' }}>Regístralo aquí para que las rutinas cuenten con él de inmediato.</p>
          
          <form onSubmit={handleAddEquipmentSubmit}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Emoji (ej: 🪃)" 
                value={newEquipIcon} 
                onChange={e => setNewEquipIcon(e.target.value)} 
                style={{ ...s.input, width: '70px', margin: 0, textAlign: 'center' }} 
                maxLength={4}
              />
              <input 
                type="text" 
                placeholder="Nombre (ej: Mancuernas ajustables)" 
                value={newEquipName} 
                onChange={e => setNewEquipName(e.target.value)} 
                style={{ ...s.input, margin: 0, flex: 1 }} 
              />
            </div>
            <button type="submit" style={{ ...s.buttonPrimary, marginTop: '10px', background: '#22d3ee', color: '#09090b' }}>
              AGREGAR NUEVO MATERIAL
            </button>
          </form>
        </div>

        <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 800 }}>Nombre del Atleta</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} style={s.input} />

        <button onClick={() => { updateProfile({ name }); alert('¡Configuración guardada!'); }} style={s.buttonCyan}>
          GUARDAR PERFIL
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
    { id: 'profile', label: 'Perfil', icon: '🎒' },
  ];

  return (
    <div style={s.container}>
      <header style={s.header}>
        <span style={s.logo}>FITAPP PRO</span>
        <span style={s.badge}>v3.7 ADAPTATIVA</span>
      </header>

      <main style={{ flex: 1 }}>
        {activeWorkoutExercises ? (
          <ActiveWorkoutPlayer exercises={activeWorkoutExercises} onFinish={() => setActiveWorkoutExercises(null)} />
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard onStartWorkout={() => setActiveTab('train')} onGoToProfile={() => setActiveTab('profile')} />}
            {activeTab === 'train' && <WorkoutView onSelectExerciseToPlay={(exs) => setActiveWorkoutExercises(exs)} onBackToHome={() => setActiveTab('dashboard')} />}
            {activeTab === 'nutrition' && <NutritionView onBackToHome={() => setActiveTab('dashboard')} />}
            {activeTab === 'progress' && <ProgressView onBackToHome={() => setActiveTab('dashboard')} />}
            {activeTab === 'profile' && <ProfileView onBackToHome={() => setActiveTab('dashboard')} />}
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
    <ErrorBoundary>
      <FitAppProvider>
        <AppContent />
      </FitAppProvider>
    </ErrorBoundary>
  );
}
