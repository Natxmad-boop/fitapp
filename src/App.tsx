import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Component,
  ErrorInfo,
  ReactNode,
} from 'react';

// ==========================================
// 0. ERROR BOUNDARY
// ==========================================
interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, backgroundColor: '#7f1d1d', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h2>¡Vaya, algo ha fallado!</h2>
          <p style={{ fontSize: 12, background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, wordBreak: 'break-all' }}>
            {this.state.error?.toString()}
          </p>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: 20, padding: 12, background: '#fff', color: '#000', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}
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
// 1. TIPOS
// ==========================================
export type Goal = 'perder_grasa' | 'ganar_musculo' | 'ganar_fuerza' | 'mantener';
export type ExperienceLevel = 'Principiante' | 'Intermedio' | 'Avanzado';
export type ContextType = 'casa' | 'gimnasio' | 'fuera_de_casa';
export type EquipmentType = 'sin_material' | 'mobiliario' | 'carga_improvisada' | 'accesorios';

export interface CustomEquipmentItem { id: string; name: string; icon: string; }
export interface WeeklyRoutineDay { dayName: string; muscles: string[]; isRestDay: boolean; }

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
  equipment: EquipmentType[];
  customEquipmentList: CustomEquipmentItem[];
  weeklyRoutine: WeeklyRoutineDay[];
  allergies: string[];
  dislikedFoods: string[];
  pantryIngredients: string[];
}

export interface Exercise {
  id: string;
  name: string;
  muscle: 'pecho' | 'espalda' | 'hombros' | 'piernas' | 'biceps' | 'triceps' | 'abdomen' | 'core' | 'cardio' | 'movilidad';
  defaultSets: number;
  defaultReps: number;
  defaultWeight: string;
  context: ContextType[];
  equipment: EquipmentType;
  level: ExperienceLevel;
  description: string;
  homeAlternative: string;
  imageUrl: string;
}

export interface WorkoutSetLog {
  setNumber: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutLogRecord {
  id: string;
  sessionId: string;
  date: string;
  exerciseName: string;
  sets: WorkoutSetLog[];
}

export interface MealItem {
  id: string;
  name: string;
  category: 'desayuno' | 'comida' | 'cena' | 'snack' | 'batido' | 'bebida';
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  requiredIngredients: string[];
  icon?: string;
  desc?: string;
}

export interface BodyMeasurement { date: string; weight: number; bodyFat?: number; }

// ==========================================
// 2. CONSTANTES Y BIBLIOTECA MAESTRA
// ==========================================
const DEFAULT_WEEKLY_ROUTINE: WeeklyRoutineDay[] = [
  { dayName: 'Lunes', muscles: ['pecho'], isRestDay: false },
  { dayName: 'Martes', muscles: ['espalda'], isRestDay: false },
  { dayName: 'Miércoles', muscles: ['piernas'], isRestDay: false },
  { dayName: 'Jueves', muscles: ['hombros'], isRestDay: false },
  { dayName: 'Viernes', muscles: ['biceps', 'triceps'], isRestDay: false },
  { dayName: 'Sábado', muscles: ['core', 'cardio'], isRestDay: false },
  { dayName: 'Domingo', muscles: [], isRestDay: true },
];

const DEFAULT_CUSTOM_EQUIPMENT: CustomEquipmentItem[] = [
  { id: 'mobiliario', name: 'Mobiliario (Silla, sofá, mesa)', icon: '🪑' },
  { id: 'carga_improvisada', name: 'Carga improvisada (Mochila, botellas)', icon: '🎒' },
  { id: 'accesorios', name: 'Accesorios (Bandas elásticas, esterilla)', icon: '🧻' },
];

const MASTER_EXERCISES: Exercise[] = [
  { id: 'leg_01', name: 'Sentadillas', muscle: 'piernas', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Principiante', description: 'Pies al ancho de caderas, baja la cadera manteniendo el pecho erguido.', homeAlternative: 'Sentadilla libre con peso corporal.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_02', name: 'Sentadillas sumo', muscle: 'piernas', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Principiante', description: 'Pies abiertos con puntas hacia fuera.', homeAlternative: 'Sentadilla sumo libre.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_04', name: 'Zancadas hacia delante', muscle: 'piernas', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Principiante', description: 'Da un paso al frente y baja la rodilla trasera.', homeAlternative: 'Zancadas clásicas.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_06', name: 'Sentadilla búlgara', muscle: 'piernas', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'mobiliario', level: 'Intermedio', description: 'Pie trasero elevado en silla o sofá.', homeAlternative: 'Usa una silla del salón.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_07', name: 'Hip thrust apoyado en sofá', muscle: 'piernas', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'mobiliario', level: 'Intermedio', description: 'Espalda alta apoyada en el borde del sofá.', homeAlternative: 'Usa el borde de la cama o sofá.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'chest_01', name: 'Flexiones clásicas', muscle: 'pecho', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Intermedio', description: 'Cuerpo recto, codos a 45 grados.', homeAlternative: 'Suelo de casa.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80' },
  { id: 'chest_03', name: 'Flexiones inclinadas (mesa)', muscle: 'pecho', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'mobiliario', level: 'Principiante', description: 'Manos apoyadas en una mesa o encimera alta.', homeAlternative: 'Mesa de comedor.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80' },
  { id: 'back_01', name: 'Remo con mochila', muscle: 'espalda', defaultSets: 4, defaultReps: 12, defaultWeight: '10', context: ['casa', 'gimnasio'], equipment: 'carga_improvisada', level: 'Intermedio', description: 'Mochila cargada, inclinación de tronco a 45º.', homeAlternative: 'Mochila con libros.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },
  { id: 'back_03', name: 'Superman', muscle: 'espalda', defaultSets: 3, defaultReps: 15, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Principiante', description: 'Tumbado boca abajo, eleva brazos y piernas.', homeAlternative: 'Suelo o esterilla.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },
  { id: 'sh_01', name: 'Press militar con mochila', muscle: 'hombros', defaultSets: 4, defaultReps: 10, defaultWeight: '8', context: ['casa', 'gimnasio'], equipment: 'carga_improvisada', level: 'Intermedio', description: 'Sujeta la mochila por las asas y empuja arriba.', homeAlternative: 'Mochila o botellas.', imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?auto=format&fit=crop&w=600&q=80' },
  { id: 'sh_02', name: 'Elevaciones laterales con botellas', muscle: 'hombros', defaultSets: 3, defaultReps: 15, defaultWeight: '2', context: ['casa', 'gimnasio'], equipment: 'carga_improvisada', level: 'Principiante', description: 'Botellas como mancuernas.', homeAlternative: 'Botellas de 1.5L.', imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?auto=format&fit=crop&w=600&q=80' },
  { id: 'bic_01', name: 'Curl con botellas', muscle: 'biceps', defaultSets: 3, defaultReps: 15, defaultWeight: '2', context: ['casa', 'gimnasio'], equipment: 'carga_improvisada', level: 'Principiante', description: 'Flexión de codo con codos pegados.', homeAlternative: 'Botellas de agua.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },
  { id: 'tri_01', name: 'Fondos en silla', muscle: 'triceps', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'mobiliario', level: 'Intermedio', description: 'Manos en el borde de una silla.', homeAlternative: 'Silla firme.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80' },
  { id: 'core_01', name: 'Plancha frontal', muscle: 'core', defaultSets: 3, defaultReps: 1, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Principiante', description: 'Apoyo sobre antebrazos y puntas de pies.', homeAlternative: 'Suelo o esterilla.', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80' },
  { id: 'core_02', name: 'Mountain climbers', muscle: 'core', defaultSets: 3, defaultReps: 30, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Intermedio', description: 'Rodillas al pecho alternando.', homeAlternative: 'Suelo.', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80' },
  { id: 'card_01', name: 'Jumping jacks', muscle: 'cardio', defaultSets: 3, defaultReps: 40, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Principiante', description: 'Saltos abriendo y cerrando piernas.', homeAlternative: 'Espacio libre.', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80' },
  { id: 'card_02', name: 'Burpees', muscle: 'cardio', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Avanzado', description: 'Sentadilla, plancha, flexión y salto.', homeAlternative: 'Suelo.', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80' },
];

const MASTER_MEALS: MealItem[] = [
  { id: 'm1', name: 'Avena con plátano y proteína', category: 'desayuno', calories: 380, protein: 25, carbs: 55, fats: 6, requiredIngredients: ['avena', 'platano', 'proteina'], icon: '🥣', desc: 'Desayuno completo con carbohidratos complejos y proteína.' },
  { id: 'm2', name: 'Pechuga de pollo con arroz y brócoli', category: 'comida', calories: 550, protein: 48, carbs: 60, fats: 8, requiredIngredients: ['pollo', 'arroz', 'brocoli'], icon: '🍗', desc: 'Comida clásica de definición y volumen limpio.' },
  { id: 'm3', name: 'Tortilla francesa con espinacas y pavo', category: 'cena', calories: 310, protein: 35, carbs: 5, fats: 10, requiredIngredients: ['huevo', 'espinacas', 'pavo'], icon: '🍳', desc: 'Cena ligera alta en proteína.' },
  { id: 'm4', name: 'Tortitas de arroz con crema de cacahuete', category: 'snack', calories: 200, protein: 7, carbs: 22, fats: 9, requiredIngredients: ['arroz', 'cacahuete'], icon: '🥜', desc: 'Snack rápido pre-entreno.' },
  { id: 'bat_1', name: 'Smoothie de Cacao y Cacahuete', category: 'batido', calories: 320, protein: 28, carbs: 22, fats: 12, requiredIngredients: ['cacao', 'cacahuete', 'proteina', 'platano'], icon: '🥤', desc: 'Ideal post-entreno para ganar músculo.' },
  { id: 'beb_1', name: 'Agua de Limón y Jengibre', category: 'bebida', calories: 5, protein: 0, carbs: 1, fats: 0, requiredIngredients: ['limon', 'jengibre'], icon: '🍋', desc: 'Activa el metabolismo en ayunas.' },
];

// ==========================================
// 3. HELPERS
// ==========================================
const STORAGE_PREFIX = 'fitapp_v20_';

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Error guardando en storage:', e);
  }
};

const calculateStreak = (logs: WorkoutLogRecord[]): number => {
  const days = Array.from(new Set(logs.map(l => l.date))).sort().reverse();
  if (days.length === 0) return 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (days[0] !== today && days[0] !== yesterday) return 0;
  let s = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = (new Date(days[i - 1]).getTime() - new Date(days[i]).getTime()) / 86400000;
    if (diff === 1) s++;
    else break;
  }
  return s;
};

// ==========================================
// 4. CONTEXTO GLOBAL
// ==========================================
interface FitAppContextData {
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  updateWeeklyRoutine: (newRoutine: WeeklyRoutineDay[]) => void;
  workoutLogs: WorkoutLogRecord[];
  saveWorkoutLog: (log: WorkoutLogRecord) => void;
  measurements: BodyMeasurement[];
  addMeasurement: (weight: number) => void;
  streak: number;
  excludedExercises: string[];
  excludeExercise: (name: string) => void;
  resetExclusions: () => void;
  toggleEquipment: (item: EquipmentType) => void;
  togglePantryIngredient: (ingredient: string) => void;
  addPantryIngredient: (ingredient: string) => void;
  clearAllData: () => void;
}

const defaultProfile: UserProfile = {
  name: 'Atleta',
  age: 28,
  gender: 'Hombre',
  height: 178,
  weight: 75,
  experience: 'Intermedio',
  goal: 'ganar_musculo',
  daysAvailable: 5,
  context: 'casa',
  equipment: ['mobiliario', 'carga_improvisada', 'accesorios'],
  customEquipmentList: DEFAULT_CUSTOM_EQUIPMENT,
  weeklyRoutine: DEFAULT_WEEKLY_ROUTINE,
  allergies: [],
  dislikedFoods: [],
  pantryIngredients: ['avena', 'platano', 'pollo', 'arroz', 'brocoli', 'huevo', 'espinacas', 'pavo', 'limon', 'cacao', 'cacahuete', 'proteina', 'agua'],
};

const FitAppContext = createContext<FitAppContextData | undefined>(undefined);

export const FitAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const loaded = loadFromStorage<UserProfile>('profile', defaultProfile);
    if (!loaded.weeklyRoutine || loaded.weeklyRoutine.length === 0) {
      loaded.weeklyRoutine = DEFAULT_WEEKLY_ROUTINE;
    }
    return loaded;
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogRecord[]>(() =>
    loadFromStorage<WorkoutLogRecord[]>('logs', [])
  );

  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(() =>
    loadFromStorage<BodyMeasurement[]>('measurements', [
      { date: new Date().toISOString().split('T')[0], weight: defaultProfile.weight },
    ])
  );

  const [excludedExercises, setExcludedExercises] = useState<string[]>(() =>
    loadFromStorage<string[]>('excluded', [])
  );

  useEffect(() => saveToStorage('profile', profile), [profile]);
  useEffect(() => saveToStorage('logs', workoutLogs), [workoutLogs]);
  useEffect(() => saveToStorage('measurements', measurements), [measurements]);
  useEffect(() => saveToStorage('excluded', excludedExercises), [excludedExercises]);

  const updateProfile = (newProfile: Partial<UserProfile>) =>
    setProfile(prev => ({ ...prev, ...newProfile }));

  const updateWeeklyRoutine = (newRoutine: WeeklyRoutineDay[]) =>
    setProfile(prev => ({ ...prev, weeklyRoutine: newRoutine }));

  const saveWorkoutLog = (log: WorkoutLogRecord) =>
    setWorkoutLogs(prev => [log, ...prev]);

  const addMeasurement = (weight: number) => {
    const today = new Date().toISOString().split('T')[0];
    setMeasurements(prev => [...prev.filter(m => m.date !== today), { date: today, weight }]);
    updateProfile({ weight });
  };

  const excludeExercise = (name: string) => {
    if (!excludedExercises.includes(name)) setExcludedExercises(prev => [...prev, name]);
  };

  const resetExclusions = () => setExcludedExercises([]);

  const toggleEquipment = (item: EquipmentType) => {
    const exists = profile.equipment.includes(item);
    const newEq = exists ? profile.equipment.filter(e => e !== item) : [...profile.equipment, item];
    updateProfile({ equipment: newEq });
  };

  const togglePantryIngredient = (ing: string) => {
    const exists = profile.pantryIngredients.includes(ing);
    const updated = exists ? profile.pantryIngredients.filter(i => i !== ing) : [...profile.pantryIngredients, ing];
    updateProfile({ pantryIngredients: updated });
  };

  const addPantryIngredient = (ing: string) => {
    const clean = ing.trim().toLowerCase();
    if (clean && !profile.pantryIngredients.includes(clean)) {
      updateProfile({ pantryIngredients: [...profile.pantryIngredients, clean] });
    }
  };

  const clearAllData = () => {
    Object.keys(localStorage)
      .filter(k => k.startsWith(STORAGE_PREFIX))
      .forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  const streak = calculateStreak(workoutLogs);

  return (
    <FitAppContext.Provider value={{
      profile, updateProfile, updateWeeklyRoutine,
      workoutLogs, saveWorkoutLog,
      measurements, addMeasurement,
      streak,
      excludedExercises, excludeExercise, resetExclusions,
      toggleEquipment, togglePantryIngredient, addPantryIngredient,
      clearAllData,
    }}>
      {children}
    </FitAppContext.Provider>
  );
};

export const useFitApp = () => {
  const context = useContext(FitAppContext);
  if (!context) throw new Error('useFitApp debe usarse dentro de FitAppProvider');
  return context;
};

// ==========================================
// 5. ESTILOS
// ==========================================
const s = {
  container: { backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', maxWidth: 480, margin: '0 auto', padding: 16, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', paddingBottom: 100, boxSizing: 'border-box' as const },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid #27272a', marginBottom: 20 },
  logo: { fontSize: 18, fontWeight: 900, background: 'linear-gradient(90deg, #ffffff 0%, #22d3ee 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' },
  badge: { fontSize: 10, backgroundColor: '#18181b', color: '#22d3ee', border: '1px solid rgba(34, 211, 238, 0.3)', padding: '4px 10px', borderRadius: 20, fontWeight: 800 },
  card: { backgroundColor: '#121215', border: '1px solid #27272a', borderRadius: 24, padding: 20, marginBottom: 16, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' },
  heroCard: { background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #1e1b4b 100%)', borderRadius: 24, padding: 24, color: '#ffffff', marginBottom: 16, boxShadow: '0 15px 30px -10px rgba(2, 132, 199, 0.4)' },
  buttonPrimary: { width: '100%', padding: 16, backgroundColor: '#ffffff', color: '#09090b', fontWeight: 900, borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 14, letterSpacing: '0.5px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', marginTop: 12 },
  buttonCyan: { width: '100%', padding: 16, background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)', color: '#ffffff', fontWeight: 900, borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 14 },
  buttonDanger: { width: '100%', padding: 14, backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#f87171', fontWeight: 800, borderRadius: 14, border: '1px solid rgba(239, 68, 68, 0.4)', cursor: 'pointer', fontSize: 13 },
  buttonBack: { background: 'rgba(255, 255, 255, 0.08)', border: '1px solid #27272a', color: '#22d3ee', padding: '8px 14px', borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 16 },
  input: { width: '100%', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: 16, padding: 14, color: '#ffffff', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, marginTop: 6, marginBottom: 12 },
  select: { width: '100%', backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: 16, padding: 14, color: '#ffffff', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const, marginTop: 6, marginBottom: 12 },
  nav: { position: 'fixed' as const, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(18, 18, 21, 0.95)', backdropFilter: 'blur(10px)', borderTop: '1px solid #27272a', display: 'flex', justifyContent: 'space-around', padding: '12px 0', maxWidth: 480, margin: '0 auto', zIndex: 100 },
  navItem: (active: boolean) => ({ background: 'none', border: 'none', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4, color: active ? '#22d3ee' : '#71717a', fontSize: 11, fontWeight: active ? 800 : 500, cursor: 'pointer' }),
  label: { fontSize: 11, color: '#a1a1aa', fontWeight: 800, display: 'block', marginBottom: 4 },
};

// ==========================================
// 6. VISTAS
// ==========================================
const Dashboard: React.FC<{
  onStartWorkout: () => void;
  onGoToProfile: () => void;
  onGoToNutrition: () => void;
  onGoToPlanner: () => void;
}> = ({ onStartWorkout, onGoToProfile, onGoToNutrition, onGoToPlanner }) => {
  const { profile, streak, workoutLogs } = useFitApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkouts = workoutLogs.filter(l => l.date === todayStr);

  const goalLabels: Record<Goal, string> = {
    ganar_musculo: 'Ganar Músculo (Hipertrofia)',
    perder_grasa: 'Perder Grasa (Definición)',
    ganar_fuerza: 'Ganar Fuerza',
    mantener: 'Mantenimiento y Salud',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: '#22d3ee', fontWeight: 800 }}>
              OBJETIVO: {goalLabels[profile.goal]}
            </span>
            <h1 style={{ fontSize: 20, fontWeight: 900, margin: '4px 0 0 0', color: '#ffffff' }}>Hola, {profile.name} ✨</h1>
          </div>
          <div style={{ background: 'rgba(249, 115, 22, 0.15)', border: '1px solid rgba(249, 115, 22, 0.3)', padding: '8px 12px', borderRadius: 14, color: '#fb923c', fontWeight: 900, fontSize: 12 }}>
            🔥 {streak} DÍAS
          </div>
        </div>
      </div>

      <div style={s.heroCard}>
        <span style={{ fontSize: 10, background: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>
          Entorno: {profile.context.toUpperCase()}
        </span>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: '12px 0 8px 0' }}>Sesión Adaptada</h2>
        <p style={{ fontSize: 12, color: '#e0f2fe', margin: 0, lineHeight: 1.5 }}>
          {todayWorkouts.length > 0
            ? `⚡ ¡Gran trabajo! Has registrado ${todayWorkouts.length} ejercicio(s) hoy.`
            : `El sistema seleccionará ejercicios compatibles con tu inventario actual y objetivo.`}
        </p>
        <button onClick={onStartWorkout} style={s.buttonPrimary}>🚀 ENTRENAR HOY</button>
      </div>

      <div onClick={onGoToPlanner} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.15) 0%, #121215 100%)', border: '1px solid rgba(34, 211, 238, 0.4)' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>📅</span> Planificador Semanal
          </div>
          <p style={{ fontSize: 12, color: '#a1a1aa', margin: '4px 0 0 0' }}>Gestiona los 7 días y adáptalos si surge un imprevisto.</p>
        </div>
        <span style={{ color: '#22d3ee', fontSize: 20, fontWeight: 'bold' }}>➔</span>
      </div>

      <div onClick={onGoToNutrition} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🥗</span> Mis Alimentos y Recetas
          </div>
          <p style={{ fontSize: 12, color: '#a1a1aa', margin: '4px 0 0 0' }}>Añade alimentos y desbloquea recetas al instante.</p>
        </div>
        <span style={{ color: '#22d3ee', fontSize: 18, fontWeight: 'bold' }}>➔</span>
      </div>

      <div onClick={onGoToProfile} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚙️</span> Mi Perfil
          </div>
          <p style={{ fontSize: 12, color: '#a1a1aa', margin: '4px 0 0 0' }}>Configura tus datos, objetivo y equipamiento.</p>
        </div>
        <span style={{ color: '#22d3ee', fontSize: 18, fontWeight: 'bold' }}>➔</span>
      </div>
    </div>
  );
};

// =============== PLANNER ===============
const WeeklyPlannerView: React.FC<{
  onBackToHome: () => void;
  onStartWorkoutForDay: (muscles: string[]) => void;
}> = ({ onBackToHome, onStartWorkoutForDay }) => {
  const { profile, updateWeeklyRoutine } = useFitApp();
  const routine = profile.weeklyRoutine || DEFAULT_WEEKLY_ROUTINE;

  const availableMuscles = [
    { key: 'pecho', label: '🦾 Pecho' },
    { key: 'espalda', label: '🦇 Espalda' },
    { key: 'piernas', label: '🦵 Piernas' },
    { key: 'hombros', label: '🛡️ Hombros' },
    { key: 'biceps', label: '💪 Bíceps' },
    { key: 'triceps', label: '🦾 Tríceps' },
    { key: 'core', label: '⚡ Core' },
    { key: 'cardio', label: '🏃 Cardio' },
  ];

  const handleToggleMuscle = (dayIndex: number, muscleKey: string) => {
    const updated = routine.map((day, idx) => {
      if (idx !== dayIndex || day.isRestDay) return day;
      const hasMuscle = day.muscles.includes(muscleKey);
      const newMuscles = hasMuscle
        ? day.muscles.filter(m => m !== muscleKey)
        : [...day.muscles, muscleKey];
      return { ...day, muscles: newMuscles };
    });
    updateWeeklyRoutine(updated);
  };

  const handleToggleRestDay = (dayIndex: number) => {
    const updated = routine.map((day, idx) => {
      if (idx !== dayIndex) return day;
      const nextRest = !day.isRestDay;
      return { ...day, isRestDay: nextRest, muscles: nextRest ? [] : day.muscles };
    });
    updateWeeklyRoutine(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onBackToHome} style={s.buttonBack}>← Volver al inicio</button>

      <div>
        <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Control Semanal</span>
        <h1 style={{ fontSize: 20, fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Planificador de los 7 Días</h1>
      </div>

      {routine.map((day, dayIndex) => (
        <div key={day.dayName} style={{ ...s.card, margin: 0, padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: '#ffffff', margin: 0 }}>{day.dayName}</h3>
            <button
              onClick={() => handleToggleRestDay(dayIndex)}
              style={{
                background: day.isRestDay ? 'rgba(34, 211, 238, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: day.isRestDay ? '1px solid #22d3ee' : '1px solid #27272a',
                color: day.isRestDay ? '#22d3ee' : '#a1a1aa',
                padding: '4px 10px',
                borderRadius: 10,
                fontSize: 10,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {day.isRestDay ? '💤 Descanso' : '🏋️ Entreno'}
            </button>
          </div>

          {!day.isRestDay ? (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {availableMuscles.map(m => {
                  const isSelected = day.muscles.includes(m.key);
                  return (
                    <button
                      key={m.key}
                      onClick={() => handleToggleMuscle(dayIndex, m.key)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 10,
                        fontSize: 11,
                        fontWeight: 700,
                        border: isSelected ? '1px solid #22d3ee' : '1px solid #27272a',
                        background: isSelected ? 'rgba(34, 211, 238, 0.2)' : '#09090b',
                        color: isSelected ? '#22d3ee' : '#71717a',
                        cursor: 'pointer',
                      }}
                    >
                      {isSelected ? `✓ ${m.label}` : `+ ${m.label}`}
                    </button>
                  );
                })}
              </div>
              {day.muscles.length > 0 && (
                <button
                  onClick={() => onStartWorkoutForDay(day.muscles)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: 10,
                    borderRadius: 12,
                    fontWeight: 900,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  🚀 Entrenar este día ({day.muscles.join(', ')})
                </button>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 11, color: '#71717a', fontStyle: 'italic' }}>
              Día de descanso / recuperación.
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// =============== WORKOUT CONFIG ===============
const WorkoutView: React.FC<{
  onSelectExerciseToPlay: (exercises: Exercise[], timeMinutes: number) => void;
  onBackToHome: () => void;
  initialMuscles?: string[];
}> = ({ onSelectExerciseToPlay, onBackToHome, initialMuscles }) => {
  const { profile } = useFitApp();
  const [selectedTime, setSelectedTime] = useState(30);
  const [selectedMuscles, setSelectedMuscles] = useState<string[]>(
    initialMuscles && initialMuscles.length > 0 ? initialMuscles : ['piernas']
  );

  useEffect(() => {
    if (initialMuscles && initialMuscles.length > 0) {
      setSelectedMuscles(initialMuscles);
    }
  }, [initialMuscles]);

  const timeOptions = [
    { minutes: 15, label: '15 min', desc: 'Express' },
    { minutes: 30, label: '30 min', desc: 'Media' },
    { minutes: 45, label: '45 min', desc: 'Completa' },
    { minutes: 60, label: '60 min', desc: 'Pro' },
  ];

  const muscles = [
    { key: 'piernas', label: '🦵 Piernas' },
    { key: 'pecho', label: '🦾 Pecho' },
    { key: 'espalda', label: '🦇 Espalda' },
    { key: 'hombros', label: '🛡️ Hombros' },
    { key: 'biceps', label: '💪 Bíceps' },
    { key: 'triceps', label: '🦾 Tríceps' },
    { key: 'core', label: '⚡ Core' },
    { key: 'cardio', label: '🏃 Cardio' },
  ];

  const toggleMuscle = (key: string) => {
    setSelectedMuscles(prev =>
      prev.includes(key) ? prev.filter(m => m !== key) : [...prev, key]
    );
  };

  const handleStart = () => {
    if (selectedMuscles.length === 0) {
      alert('Selecciona al menos un grupo muscular.');
      return;
    }

    const allowedEquipment = new Set<string>(['sin_material', ...profile.equipment]);

    let filtered = MASTER_EXERCISES.filter(ex =>
      selectedMuscles.includes(ex.muscle) && allowedEquipment.has(ex.equipment)
    );

    if (filtered.length === 0) {
      alert('No hay ejercicios compatibles con tu equipamiento actual.');
      return;
    }

    // Mezclar para no repetir siempre los mismos
    filtered = [...filtered].sort(() => Math.random() - 0.5);

    const limitMap: Record<number, number> = { 15: 2, 30: 4, 45: 6, 60: 8 };
    const maxExercises = limitMap[selectedTime] || 4;
    filtered = filtered.slice(0, maxExercises);

    onSelectExerciseToPlay(filtered, selectedTime);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onBackToHome} style={s.buttonBack}>← Volver al inicio</button>

      <div>
        <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Biblioteca Inteligente</span>
        <h1 style={{ fontSize: 20, fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Configurar Sesión</h1>
      </div>

      <div style={s.card}>
        <label style={s.label}>⏱️ ¿Cuánto tiempo tienes hoy?</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {timeOptions.map(opt => {
            const isSelected = selectedTime === opt.minutes;
            return (
              <button
                key={opt.minutes}
                onClick={() => setSelectedTime(opt.minutes)}
                style={{
                  padding: '10px 4px',
                  borderRadius: 12,
                  border: isSelected ? '2px solid #22d3ee' : '1px solid #27272a',
                  background: isSelected ? 'rgba(34, 211, 238, 0.2)' : '#09090b',
                  color: isSelected ? '#22d3ee' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 900 }}>{opt.label}</div>
                <div style={{ fontSize: 9, color: isSelected ? '#a5f3fc' : '#71717a', marginTop: 2 }}>{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={s.card}>
        <label style={s.label}>🎯 Selecciona músculos (puedes elegir varios)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {muscles.map(m => {
            const isSelected = selectedMuscles.includes(m.key);
            return (
              <button
                key={m.key}
                onClick={() => toggleMuscle(m.key)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: isSelected ? '2px solid #22d3ee' : '1px solid #27272a',
                  background: isSelected ? 'rgba(34, 211, 238, 0.2)' : '#09090b',
                  color: isSelected ? '#22d3ee' : '#ffffff',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {isSelected ? `✓ ${m.label}` : m.label}
              </button>
            );
          })}
        </div>
        <button onClick={handleStart} style={s.buttonCyan}>GENERAR SESIÓN</button>
      </div>
    </div>
  );
};

// =============== PREVIEW ===============
const DailyWorkoutPreview: React.FC<{
  exercises: Exercise[];
  selectedTime: number;
  onConfirmAndStart: (finalExercises: Exercise[]) => void;
  onBack: () => void;
}> = ({ exercises, selectedTime, onConfirmAndStart, onBack }) => {
  const { excludedExercises, excludeExercise, profile } = useFitApp();
  const [list, setList] = useState<Exercise[]>(exercises);

  const handleSwap = (indexToSwap: number) => {
    const currentEx = list[indexToSwap];
    excludeExercise(currentEx.name);

    const allowedEquipment = new Set<string>(['sin_material', ...profile.equipment]);
    const availableAlternatives = MASTER_EXERCISES.filter(ex =>
      ex.muscle === currentEx.muscle &&
      !list.some(item => item.id === ex.id) &&
      !excludedExercises.includes(ex.name) &&
      allowedEquipment.has(ex.equipment)
    );

    if (availableAlternatives.length > 0) {
      const replacement = availableAlternatives[Math.floor(Math.random() * availableAlternatives.length)];
      const updated = [...list];
      updated[indexToSwap] = replacement;
      setList(updated);
    } else {
      alert('No hay más variantes disponibles con tu equipamiento actual.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onBack} style={s.buttonBack}>← Volver</button>

      <div>
        <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#fb923c', fontWeight: 800 }}>
          🛡️ Sesión adaptada a {selectedTime} min
        </span>
        <h1 style={{ fontSize: 20, fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Tabla Diaria</h1>
      </div>

      {list.map((ex, idx) => (
        <div key={ex.id} style={{ ...s.card, margin: 0, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: 10, color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase' }}>
                Material: {ex.equipment.replace('_', ' ')}
              </span>
              <h3 style={{ fontSize: 15, fontWeight: 900, color: '#ffffff', margin: '2px 0 0 0' }}>{ex.name}</h3>
            </div>
            <button
              onClick={() => handleSwap(idx)}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                color: '#f87171',
                padding: '6px 10px',
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              🩹 Cambiar
            </button>
          </div>
          <div style={{ fontSize: 11, color: '#d4d4d8', background: '#18181b', padding: '8px 12px', borderRadius: 10 }}>
            🎯 Series: <strong>{ex.defaultSets}</strong> | Reps: <strong>{ex.defaultReps}</strong>
          </div>
        </div>
      ))}

      <button onClick={() => onConfirmAndStart(list)} style={s.buttonPrimary}>
        ▶️ EMPEZAR ENTRENAMIENTO
      </button>
    </div>
  );
};

// =============== PLAYER ===============
const ActiveWorkoutPlayer: React.FC<{ exercises: Exercise[]; onFinish: () => void }> = ({ exercises, onFinish }) => {
  const { saveWorkoutLog } = useFitApp();
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 11));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState(exercises[0]?.defaultWeight || '0');
  const [reps, setReps] = useState(String(exercises[0]?.defaultReps || 10));
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(60);

  const currentEx = exercises[currentIndex];

  useEffect(() => {
    if (!isResting) return;
    if (restTime <= 0) { setIsResting(false); return; }
    const timer = setTimeout(() => setRestTime(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [isResting, restTime]);

  const skipRest = () => {
    setIsResting(false);
    setRestTime(60);
  };

  const handleCompleteSet = () => {
    saveWorkoutLog({
      id: Math.random().toString(36).substring(2, 11),
      sessionId,
      date: new Date().toISOString().split('T')[0],
      exerciseName: currentEx.name,
      sets: [{ setNumber: currentSet, weight: Number(weight), reps: Number(reps), completed: true }],
    });

    if (currentSet < currentEx.defaultSets) {
      setCurrentSet(prev => prev + 1);
      setIsResting(true);
      setRestTime(60);
    } else {
      if (currentIndex < exercises.length - 1) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setCurrentSet(1);
        setWeight(exercises[nextIdx].defaultWeight);
        setReps(String(exercises[nextIdx].defaultReps));
        setIsResting(true);
        setRestTime(60);
      } else {
        alert('🏆 ¡Entrenamiento completado con éxito!');
        onFinish();
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onFinish} style={s.buttonBack}>← Salir al menú</button>

      <div style={{ ...s.card, display: 'flex', flexDirection: 'column', gap: 16, margin: 0 }}>
        {isResting && (
          <div style={{ background: '#082f49', border: '1px solid #0284c7', padding: 16, borderRadius: 16, textAlign: 'center' }}>
            <span style={{ fontSize: 11, color: '#38bdf8', fontWeight: 900, textTransform: 'uppercase' }}>⏸ Descanso</span>
            <div style={{ fontSize: 36, fontWeight: 900, color: '#ffffff', margin: '4px 0' }}>
              0:{restTime < 10 ? `0${restTime}` : restTime}
            </div>
            <button
              onClick={skipRest}
              style={{ background: '#0369a1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 10, fontSize: 11, fontWeight: 'bold', cursor: 'pointer' }}
            >
              Saltar Descanso
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#a1a1aa', fontWeight: 800 }}>
          <span>Ejercicio {currentIndex + 1} de {exercises.length}</span>
          <span style={{ color: '#22d3ee' }}>Serie {currentSet} / {currentEx.defaultSets}</span>
        </div>

        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', margin: 0 }}>{currentEx.name}</h2>
          <span style={{ fontSize: 11, color: '#22d3ee', textTransform: 'uppercase', fontWeight: 700 }}>
            Grupo: {currentEx.muscle}
          </span>
        </div>

        <div style={{ background: '#18181b', borderRadius: 16, padding: 12, border: '1px solid #27272a' }}>
          <div style={{ fontSize: 10, color: '#22d3ee', fontWeight: 900, textTransform: 'uppercase', marginBottom: 6 }}>
            🎥 Técnica
          </div>
          <img
            src={currentEx.imageUrl}
            alt={currentEx.name}
            style={{ width: '100%', height: 170, objectFit: 'cover', borderRadius: 12, marginBottom: 10, border: '1px solid #27272a' }}
          />
          <div style={{ fontSize: 12, color: '#e4e4e7', lineHeight: 1.4 }}>{currentEx.description}</div>
        </div>

        <div>
          <label style={s.label}>Carga (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={{ ...s.input, marginBottom: 0 }} />
        </div>

        <div>
          <label style={s.label}>Repeticiones</label>
          <input type="number" value={reps} onChange={e => setReps(e.target.value)} style={{ ...s.input, marginBottom: 0 }} />
        </div>

        <button onClick={handleCompleteSet} disabled={isResting} style={{ ...s.buttonCyan, opacity: isResting ? 0.5 : 1 }}>
          ✓ COMPLETAR SERIE
        </button>
      </div>
    </div>
  );
};

// =============== NUTRITION ===============
const NutritionView: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const { profile, addPantryIngredient } = useFitApp();
  const [quickFoodName, setQuickFoodName] = useState('');

  const availableMeals = MASTER_MEALS.filter(meal =>
    meal.requiredIngredients.every(ing => profile.pantryIngredients.includes(ing))
  );

  const lockedMeals = MASTER_MEALS.filter(meal =>
    !meal.requiredIngredients.every(ing => profile.pantryIngredients.includes(ing))
  );

  const categoryLabels: Record<string, string> = {
    desayuno: '🍳 Desayunos',
    comida: '🍽️ Comidas',
    cena: '🌙 Cenas',
    snack: '🥨 Snacks',
    batido: '🥤 Batidos',
    bebida: '💧 Bebidas',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onBackToHome} style={s.buttonBack}>← Volver al inicio</button>

      <div>
        <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Nutrición Inteligente</span>
        <h1 style={{ fontSize: 20, fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Alimentos y Recetas</h1>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>➕ Añadir alimento a la despensa</h3>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (quickFoodName.trim()) {
              addPantryIngredient(quickFoodName);
              setQuickFoodName('');
            }
          }}
          style={{ display: 'flex', gap: 8 }}
        >
          <input
            type="text"
            placeholder="Ej: atún, merluza..."
            value={quickFoodName}
            onChange={e => setQuickFoodName(e.target.value)}
            style={{ ...s.input, margin: 0, flex: 1 }}
          />
          <button
            type="submit"
            style={{ background: '#22d3ee', color: '#09090b', border: 'none', padding: '0 16px', borderRadius: 14, fontWeight: 900, fontSize: 12, cursor: 'pointer' }}
          >
            Añadir
          </button>
        </form>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>
          ✅ Disponibles ahora ({availableMeals.length})
        </h3>
        {availableMeals.length === 0 ? (
          <p style={{ fontSize: 12, color: '#a1a1aa', margin: 0 }}>
            Añade más ingredientes a tu despensa para desbloquear recetas.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {availableMeals.map(m => (
              <div key={m.id} style={{ background: '#09090b', borderRadius: 14, padding: 12, border: '1px solid #27272a' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>
                    {m.icon} {m.name}
                  </span>
                  <span style={{ fontSize: 10, color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase' }}>
                    {categoryLabels[m.category]}
                  </span>
                </div>
                {m.desc && <p style={{ fontSize: 11, color: '#a1a1aa', margin: '4px 0' }}>{m.desc}</p>}
                <div style={{ display: 'flex', gap: 12, fontSize: 10, color: '#d4d4d8', marginTop: 6 }}>
                  <span>🔥 {m.calories} kcal</span>
                  <span>🥩 {m.protein}g</span>
                  <span>🍞 {m.carbs}g</span>
                  <span>🥑 {m.fats}g</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lockedMeals.length > 0 && (
        <div style={s.card}>
          <h3 style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>
            🔒 Bloqueadas ({lockedMeals.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lockedMeals.map(m => {
              const missing = m.requiredIngredients.filter(i => !profile.pantryIngredients.includes(i));
              return (
                <div key={m.id} style={{ background: '#09090b', borderRadius: 14, padding: 12, border: '1px solid #27272a', opacity: 0.6 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#ffffff' }}>
                    {m.icon} {m.name}
                  </span>
                  <p style={{ fontSize: 10, color: '#f87171', margin: '4px 0 0 0' }}>
                    Falta: {missing.join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// =============== PROFILE ===============
const ProfileView: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const { profile, updateProfile, clearAllData, resetExclusions, excludedExercises } = useFitApp();
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(String(profile.age));
  const [height, setHeight] = useState(String(profile.height));
  const [weight, setWeight] = useState(String(profile.weight));

  useEffect(() => { setName(profile.name); }, [profile.name]);
  useEffect(() => { setAge(String(profile.age)); }, [profile.age]);
  useEffect(() => { setHeight(String(profile.height)); }, [profile.height]);
  useEffect(() => { setWeight(String(profile.weight)); }, [profile.weight]);

  const handleSave = () => {
    updateProfile({
      name,
      age: Number(age) || profile.age,
      height: Number(height) || profile.height,
      weight: Number(weight) || profile.weight,
    });
    alert('✅ Perfil guardado');
  };

  const equipmentOptions: { key: EquipmentType; label: string }[] = [
    { key: 'mobiliario', label: '🪑 Mobiliario' },
    { key: 'carga_improvisada', label: '🎒 Carga improvisada' },
    { key: 'accesorios', label: '🧻 Accesorios' },
  ];

  const goalOptions: { key: Goal; label: string }[] = [
    { key: 'perder_grasa', label: '🔥 Perder grasa' },
    { key: 'ganar_musculo', label: '💪 Ganar músculo' },
    { key: 'ganar_fuerza', label: '⚡ Ganar fuerza' },
    { key: 'mantener', label: '⚖️ Mantener' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <button onClick={onBackToHome} style={s.buttonBack}>← Volver al inicio</button>

      <div>
        <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Ajustes</span>
        <h1 style={{ fontSize: 20, fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Mi Perfil</h1>
      </div>

      <div style={s.card}>
        <label style={s.label}>Nombre</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} style={s.input} />

        <label style={s.label}>Edad</label>
        <input type="number" value={age} onChange={e => setAge(e.target.value)} style={s.input} />

        <label style={s.label}>Altura (cm)</label>
        <input type="number" value={height} onChange={e => setHeight(e.target.value)} style={s.input} />

        <label style={s.label}>Peso (kg)</label>
        <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={s.input} />

        <button onClick={handleSave} style={s.buttonCyan}>GUARDAR PERFIL</button>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>🎯 Objetivo</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {goalOptions.map(g => {
            const isActive = profile.goal === g.key;
            return (
              <button
                key={g.key}
                onClick={() => updateProfile({ goal: g.key })}
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: isActive ? '2px solid #22d3ee' : '1px solid #27272a',
                  background: isActive ? 'rgba(34, 211, 238, 0.2)' : '#09090b',
                  color: isActive ? '#22d3ee' : '#ffffff',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>🏠 Equipamiento</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {equipmentOptions.map(e => {
            const isActive = profile.equipment.includes(e.key);
            return (
              <button
                key={e.key}
                onClick={() => {
                  const newEq = isActive
                    ? profile.equipment.filter(x => x !== e.key)
                    : [...profile.equipment, e.key];
                  updateProfile({ equipment: newEq });
                }}
                style={{
                  padding: '10px 14px',
                  borderRadius: 12,
                  border: isActive ? '2px solid #22d3ee' : '1px solid #27272a',
                  background: isActive ? 'rgba(34, 211, 238, 0.2)' : '#09090b',
                  color: isActive ? '#22d3ee' : '#ffffff',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {e.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>🚫 Datos</h3>
        <p style={{ fontSize: 11, color: '#a1a1aa', margin: '0 0 12px 0' }}>
          Ejercicios excluidos: <strong>{excludedExercises.length}</strong>
        </p>
        {excludedExercises.length > 0 && (
          <button onClick={resetExclusions} style={{ ...s.buttonDanger, marginBottom: 12 }}>
            Restaurar ejercicios excluidos
          </button>
        )}
        <button onClick={() => {
          if (confirm('¿Seguro que quieres borrar TODOS tus datos? Esta acción no se puede deshacer.')) {
            clearAllData();
          }
        }} style={s.buttonDanger}>
          🗑️ Borrar todos mis datos
        </button>
      </div>

      <p style={{ fontSize: 10, color: '#52525b', textAlign: 'center', marginTop: 8 }}>
        🔒 Todos los datos se guardan SOLO en este dispositivo. Nadie más los ve.
      </p>
    </div>
  );
};

// ==========================================
// 7. APP PRINCIPAL
// ==========================================
function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pendingWorkoutData, setPendingWorkoutData] = useState<{ exercises: Exercise[]; time: number } | null>(null);
  const [activeWorkoutExercises, setActiveWorkoutExercises] = useState<Exercise[] | null>(null);
  const [plannerSelectedMuscles, setPlannerSelectedMuscles] = useState<string[]>([]);

  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: '⚡' },
    { id: 'planner', label: 'Rutina', icon: '📅' },
    { id: 'train', label: 'Entrenar', icon: '🔥' },
    { id: 'nutrition', label: 'Nutrición', icon: '🥗' },
    { id: 'profile', label: 'Perfil', icon: '⚙️' },
  ];

  return (
    <div style={s.container}>
      <header style={s.header}>
        <span style={s.logo}>FITAPP PRO</span>
        <span style={s.badge}>v6.7 LOCAL</span>
      </header>

      <main style={{ flex: 1 }}>
        {activeWorkoutExercises ? (
          <ActiveWorkoutPlayer
            exercises={activeWorkoutExercises}
            onFinish={() => setActiveWorkoutExercises(null)}
          />
        ) : pendingWorkoutData ? (
          <DailyWorkoutPreview
            exercises={pendingWorkoutData.exercises}
            selectedTime={pendingWorkoutData.time}
            onConfirmAndStart={(finalExs) => {
              setPendingWorkoutData(null);
              setActiveWorkoutExercises(finalExs);
            }}
            onBack={() => setPendingWorkoutData(null)}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                onStartWorkout={() => setActiveTab('train')}
                onGoToProfile={() => setActiveTab('profile')}
                onGoToNutrition={() => setActiveTab('nutrition')}
                onGoToPlanner={() => setActiveTab('planner')}
              />
            )}
            {activeTab === 'planner' && (
              <WeeklyPlannerView
                onBackToHome={() => setActiveTab('dashboard')}
                onStartWorkoutForDay={(muscles) => {
                  setPlannerSelectedMuscles(muscles);
                  setActiveTab('train');
                }}
              />
            )}
            {activeTab === 'train' && (
              <WorkoutView
                key={`train-${plannerSelectedMuscles.join('-')}`}
                initialMuscles={plannerSelectedMuscles}
                onSelectExerciseToPlay={(exs, time) => setPendingWorkoutData({ exercises: exs, time })}
                onBackToHome={() => setActiveTab('dashboard')}
              />
            )}
            {activeTab === 'nutrition' && <NutritionView onBackToHome={() => setActiveTab('dashboard')} />}
            {activeTab === 'profile' && <ProfileView onBackToHome={() => setActiveTab('dashboard')} />}
          </>
        )}
      </main>

      {!activeWorkoutExercises && !pendingWorkoutData && (
        <nav style={s.nav}>
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={s.navItem(isActive)}>
                <span style={{ fontSize: 18 }}>{tab.icon}</span>
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
