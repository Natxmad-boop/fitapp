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

export interface HomeItem {
  id: string;
  name: string;
  icon: string;
  category: 'mueble' | 'peso' | 'accesorio' | 'estructura' | 'cocina';
  description: string;
  exercisesUnlocked: string[];
}

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
  homeItems: string[];
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
  requiredItems: string[];
  level: ExperienceLevel;
  description: string;
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
// 2. BIBLIOTECA DE OBJETOS DE CASA
// ==========================================
export const HOME_ITEMS_LIBRARY: HomeItem[] = [
  { id: 'silla', name: 'Silla', icon: '🪑', category: 'mueble', description: 'Silla firme sin ruedas', exercisesUnlocked: ['Sentadilla búlgara', 'Fondos en silla', 'Step-ups'] },
  { id: 'sofa', name: 'Sofá', icon: '🛋️', category: 'mueble', description: 'Sofá o sillón bajo', exercisesUnlocked: ['Hip thrust', 'Elevaciones de piernas', 'Puente glúteo'] },
  { id: 'mesa', name: 'Mesa', icon: '🪵', category: 'mueble', description: 'Mesa de comedor o escritorio', exercisesUnlocked: ['Flexiones inclinadas', 'Remo invertido'] },
  { id: 'cama', name: 'Cama', icon: '🛏️', category: 'mueble', description: 'Cama o colchón en el suelo', exercisesUnlocked: ['Hip thrust', 'Puente glúteo', 'Plancha'] },
  { id: 'mochila', name: 'Mochila', icon: '🎒', category: 'peso', description: 'Mochila con libros o botellas', exercisesUnlocked: ['Remo con mochila', 'Press militar', 'Sentadilla con peso'] },
  { id: 'botellas', name: 'Botellas de agua', icon: '🍶', category: 'peso', description: 'Botellas de 1.5L o 2L', exercisesUnlocked: ['Curl con botellas', 'Elevaciones laterales', 'Press de hombros'] },
  { id: 'garrafa', name: 'Garrafa 5L', icon: '🪣', category: 'peso', description: 'Garrafa grande o bidón', exercisesUnlocked: ['Peso muerto', 'Remo pesado', 'Sentadilla goblet'] },
  { id: 'toalla', name: 'Toalla', icon: '🧻', category: 'accesorio', description: 'Toalla grande de baño', exercisesUnlocked: ['Deslizamientos', 'Isométricos de espalda'] },
  { id: 'gomas', name: 'Gomas elásticas', icon: '🔗', category: 'accesorio', description: 'Bandas elásticas de cualquier resistencia', exercisesUnlocked: ['Remo con gomas', 'Aperturas', 'Patadas glúteo'] },
  { id: 'escaleras', name: 'Escaleras', icon: '🪜', category: 'estructura', description: 'Escaleras de casa o escalón firme', exercisesUnlocked: ['Step-ups', 'Gemelos', 'Sentadilla búlgara'] },
  { id: 'pared', name: 'Pared', icon: '🧱', category: 'estructura', description: 'Pared firme y despejada', exercisesUnlocked: ['Flexiones verticales', 'Isométrico de sentadilla'] },
  { id: 'puerta', name: 'Marco de puerta', icon: '🚪', category: 'estructura', description: 'Marco firme para anclar', exercisesUnlocked: ['Dominadas asistidas', 'Remo con toalla'] },
  { id: 'nevera', name: 'Nevera / Comida', icon: '🧊', category: 'cocina', description: 'Acceso a nevera y utensilios básicos', exercisesUnlocked: [] },
  { id: 'espejo', name: 'Espejo grande', icon: '🪞', category: 'accesorio', description: 'Espejo para corregir técnica', exercisesUnlocked: ['Corrección postural'] },
];

// ==========================================
// 3. RUTINA SEMANAL POR DEFECTO
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

// ==========================================
// 4. BIBLIOTECA MAESTRA DE EJERCICIOS
// ==========================================
const MASTER_EXERCISES: Exercise[] = [
  // PIERNAS
  { id: 'leg_01', name: 'Sentadillas', muscle: 'piernas', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', description: 'Pies al ancho de caderas, baja la cadera manteniendo el pecho erguido.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_02', name: 'Sentadillas sumo', muscle: 'piernas', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', description: 'Pies abiertos con puntas hacia fuera.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_04', name: 'Zancadas hacia delante', muscle: 'piernas', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', description: 'Da un paso al frente y baja la rodilla trasera.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_06', name: 'Sentadilla búlgara', muscle: 'piernas', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['silla'], level: 'Intermedio', description: 'Pie trasero elevado en silla.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_07', name: 'Hip thrust en sofá', muscle: 'piernas', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['sofa'], level: 'Intermedio', description: 'Espalda alta en el borde del sofá.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_08', name: 'Peso muerto con garrafa', muscle: 'piernas', defaultSets: 4, defaultReps: 10, defaultWeight: '5', context: ['casa', 'gimnasio'], requiredItems: ['garrafa'], level: 'Intermedio', description: 'Garrafa en el suelo, espalda recta.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_09', name: 'Step-ups en escalón', muscle: 'piernas', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'fuera_de_casa'], requiredItems: ['escaleras'], level: 'Principiante', description: 'Sube y baja de un escalón firme.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_10', name: 'Puente glúteo en cama', muscle: 'piernas', defaultSets: 3, defaultReps: 15, defaultWeight: '0', context: ['casa'], requiredItems: ['cama'], level: 'Principiante', description: 'Espalda apoyada en la cama, empuje de cadera.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },

  // PECHO
  { id: 'chest_01', name: 'Flexiones clásicas', muscle: 'pecho', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Intermedio', description: 'Cuerpo recto, codos a 45 grados.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80' },
  { id: 'chest_03', name: 'Flexiones inclinadas en mesa', muscle: 'pecho', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['mesa'], level: 'Principiante', description: 'Manos apoyadas en una mesa.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80' },
  { id: 'chest_04', name: 'Flexiones verticales en pared', muscle: 'pecho', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['pared'], level: 'Principiante', description: 'De pie frente a la pared, empuje controlado.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80' },

  // ESPALDA
  { id: 'back_01', name: 'Remo con mochila', muscle: 'espalda', defaultSets: 4, defaultReps: 12, defaultWeight: '10', context: ['casa', 'gimnasio'], requiredItems: ['mochila'], level: 'Intermedio', description: 'Mochila cargada, inclinación de tronco a 45º.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },
  { id: 'back_03', name: 'Superman', muscle: 'espalda', defaultSets: 3, defaultReps: 15, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', description: 'Tumbado boca abajo, eleva brazos y piernas.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },
  { id: 'back_04', name: 'Remo con gomas elásticas', muscle: 'espalda', defaultSets: 3, defaultReps: 15, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['gomas'], level: 'Principiante', description: 'Ancla la goma a un punto fijo y rema.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },
  { id: 'back_05', name: 'Remo con toalla en puerta', muscle: 'espalda', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa'], requiredItems: ['puerta', 'toalla'], level: 'Intermedio', description: 'Toalla en el marco de la puerta, tirar con el cuerpo.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },

  // HOMBROS
  { id: 'sh_01', name: 'Press militar con mochila', muscle: 'hombros', defaultSets: 4, defaultReps: 10, defaultWeight: '8', context: ['casa', 'gimnasio'], requiredItems: ['mochila'], level: 'Intermedio', description: 'Sujeta la mochila y empuja arriba.', imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?auto=format&fit=crop&w=600&q=80' },
  { id: 'sh_02', name: 'Elevaciones laterales con botellas', muscle: 'hombros', defaultSets: 3, defaultReps: 15, defaultWeight: '2', context: ['casa', 'gimnasio'], requiredItems: ['botellas'], level: 'Principiante', description: 'Botellas como mancuernas.', imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?auto=format&fit=crop&w=600&q=80' },
  { id: 'sh_03', name: 'Press con botellas', muscle: 'hombros', defaultSets: 3, defaultReps: 12, defaultWeight: '2', context: ['casa', 'gimnasio'], requiredItems: ['botellas'], level: 'Principiante', description: 'Press vertical con botellas.', imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?auto=format&fit=crop&w=600&q=80' },

  // BÍCEPS
  { id: 'bic_01', name: 'Curl con botellas', muscle: 'biceps', defaultSets: 3, defaultReps: 15, defaultWeight: '2', context: ['casa', 'gimnasio'], requiredItems: ['botellas'], level: 'Principiante', description: 'Flexión de codo con codos pegados.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },
  { id: 'bic_02', name: 'Curl con garrafa', muscle: 'biceps', defaultSets: 3, defaultReps: 12, defaultWeight: '5', context: ['casa'], requiredItems: ['garrafa'], level: 'Intermedio', description: 'Curl con garrafa a una mano.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },

  // TRÍCEPS
  { id: 'tri_01', name: 'Fondos en silla', muscle: 'triceps', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['silla'], level: 'Intermedio', description: 'Manos en el borde de una silla.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80' },
  { id: 'tri_02', name: 'Fondos en sofá', muscle: 'triceps', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['sofa'], level: 'Intermedio', description: 'Fondos apoyados en el sofá.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80' },

  // CORE
  { id: 'core_01', name: 'Plancha frontal', muscle: 'core', defaultSets: 3, defaultReps: 1, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', description: 'Apoyo sobre antebrazos y puntas de pies.', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80' },
  { id: 'core_02', name: 'Mountain climbers', muscle: 'core', defaultSets: 3, defaultReps: 30, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Intermedio', description: 'Rodillas al pecho alternando.', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80' },
  { id: 'core_03', name: 'Elevaciones piernas en sofá', muscle: 'core', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa'], requiredItems: ['sofa'], level: 'Intermedio', description: 'Tumbado, eleva piernas rectas.', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80' },

  // CARDIO
  { id: 'card_01', name: 'Jumping jacks', muscle: 'cardio', defaultSets: 3, defaultReps: 40, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', description: 'Saltos abriendo y cerrando piernas.', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80' },
  { id: 'card_02', name: 'Burpees', muscle: 'cardio', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Avanzado', description: 'Sentadilla, plancha, flexión y salto.', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80' },
];

// ==========================================
// 5. RECETAS MAESTRAS
// ==========================================
const MASTER_MEALS: MealItem[] = [
  { id: 'm1', name: 'Avena con plátano y proteína', category: 'desayuno', calories: 380, protein: 25, carbs: 55, fats: 6, requiredIngredients: ['avena', 'platano', 'proteina'], icon: '🥣', desc: 'Desayuno completo con carbohidratos complejos.' },
  { id: 'm2', name: 'Pechuga de pollo con arroz y brócoli', category: 'comida', calories: 550, protein: 48, carbs: 60, fats: 8, requiredIngredients: ['pollo', 'arroz', 'brocoli'], icon: '🍗', desc: 'Comida clásica de definición.' },
  { id: 'm3', name: 'Tortilla francesa con espinacas y pavo', category: 'cena', calories: 310, protein: 35, carbs: 5, fats: 10, requiredIngredients: ['huevo', 'espinacas', 'pavo'], icon: '🍳', desc: 'Cena ligera alta en proteína.' },
  { id: 'm4', name: 'Tortitas de arroz con crema de cacahuete', category: 'snack', calories: 200, protein: 7, carbs: 22, fats: 9, requiredIngredients: ['arroz', 'cacahuete'], icon: '🥜', desc: 'Snack rápido pre-entreno.' },
  { id: 'bat_1', name: 'Smoothie de Cacao y Cacahuete', category: 'batido', calories: 320, protein: 28, carbs: 22, fats: 12, requiredIngredients: ['cacao', 'cacahuete', 'proteina', 'platano'], icon: '🥤', desc: 'Ideal post-entreno.' },
  { id: 'beb_1', name: 'Agua de Limón y Jengibre', category: 'bebida', calories: 5, protein: 0, carbs: 1, fats: 0, requiredIngredients: ['limon', 'jengibre'], icon: '🍋', desc: 'Activa el metabolismo en ayunas.' },
];

// ==========================================
// 6. HELPERS
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
// 7. CONTEXTO
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
  toggleHomeItem: (itemId: string) => void;
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
  homeItems: ['silla', 'mesa', 'sofa', 'mochila', 'botellas', 'nevera'],
  weeklyRoutine: DEFAULT_WEEKLY_ROUTINE,
  allergies: [],
  dislikedFoods: [],
  pantryIngredients: ['avena', 'platano', 'pollo', 'arroz', 'brocoli', 'huevo', 'espinacas', 'pavo', 'limon', 'cacao', 'cacahuete', 'proteina', 'agua', 'jengibre'],
};

const FitAppContext = createContext<FitAppContextData | undefined>(undefined);

export const FitAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const loaded = loadFromStorage<UserProfile>('profile', defaultProfile);
    if (!loaded.weeklyRoutine || loaded.weeklyRoutine.length === 0) {
      loaded.weeklyRoutine = DEFAULT_WEEKLY_ROUTINE;
    }
    if (!loaded.homeItems) {
      loaded.homeItems = defaultProfile.homeItems;
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

  const toggleHomeItem = (itemId: string) => {
    const exists = profile.homeItems.includes(itemId);
    const updated = exists
      ? profile.homeItems.filter(i => i !== itemId)
      : [...profile.homeItems, itemId];
    updateProfile({ homeItems: updated });
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
      toggleHomeItem, togglePantryIngredient, addPantryIngredient,
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
// 8. ESTILOS REDISEÑADOS
// ==========================================
const s = {
  container: {
    backgroundColor: '#000000',
    color: '#f5f5f7',
    minHeight: '100vh',
    maxWidth: 480,
    margin: '0 auto',
    padding: 20,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif',
    paddingBottom: 110,
    boxSizing: 'border-box' as const,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 18,
    marginBottom: 24,
  },
  logo: {
    fontSize: 20,
    fontWeight: 900,
    background: 'linear-gradient(135deg, #ffffff 0%, #22d3ee 60%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.8px',
  },
  badge: {
    fontSize: 10,
    backgroundColor: 'rgba(34, 211, 238, 0.12)',
    color: '#22d3ee',
    padding: '5px 12px',
    borderRadius: 20,
    fontWeight: 800,
    letterSpacing: '0.5px',
  },
  card: {
    backgroundColor: '#0f0f11',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: 28,
    padding: 22,
    marginBottom: 14,
    boxShadow: '0 4px 20px -8px rgba(0, 0, 0, 0.8)',
  },
  heroCard: {
    background: 'linear-gradient(140deg, #0c4a6e 0%, #0369a1 40%, #1e1b4b 100%)',
    borderRadius: 28,
    padding: 26,
    color: '#ffffff',
    marginBottom: 14,
    boxShadow: '0 20px 40px -15px rgba(2, 132, 199, 0.5)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  buttonPrimary: {
    width: '100%',
    padding: 18,
    backgroundColor: '#ffffff',
    color: '#000000',
    fontWeight: 900,
    borderRadius: 18,
    border: 'none',
    cursor: 'pointer',
    fontSize: 15,
    letterSpacing: '0.5px',
    marginTop: 16,
    transition: 'transform 0.15s ease',
  },
  buttonCyan: {
    width: '100%',
    padding: 18,
    background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)',
    color: '#ffffff',
    fontWeight: 900,
    borderRadius: 18,
    border: 'none',
    cursor: 'pointer',
    fontSize: 15,
    transition: 'transform 0.15s ease',
  },
  buttonDanger: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    color: '#f87171',
    fontWeight: 800,
    borderRadius: 16,
    border: '1px solid rgba(239, 68, 68, 0.35)',
    cursor: 'pointer',
    fontSize: 14,
  },
  buttonBack: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#22d3ee',
    padding: '10px 16px',
    borderRadius: 14,
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#000000',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    color: '#ffffff',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box' as const,
    marginTop: 6,
    marginBottom: 14,
  },
  nav: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15, 15, 17, 0.96)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    justifyContent: 'space-around',
    padding: '14px 0',
    maxWidth: 480,
    margin: '0 auto',
    zIndex: 100,
  },
  navItem: (active: boolean) => ({
    background: 'none',
    border: 'none',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 4,
    color: active ? '#22d3ee' : '#52525b',
    fontSize: 10,
    fontWeight: active ? 800 : 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  label: {
    fontSize: 12,
    color: '#a1a1aa',
    fontWeight: 700,
    display: 'block',
    marginBottom: 6,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 900,
    color: '#ffffff',
    letterSpacing: '-1px',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: 10,
    color: '#71717a',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginTop: 4,
  },
};

// ==========================================
// 9. VISTA: DASHBOARD
// ==========================================
const Dashboard: React.FC<{
  onStartWorkout: () => void;
  onGoToProfile: () => void;
  onGoToNutrition: () => void;
  onGoToPlanner: () => void;
  onGoToHome: () => void;
}> = ({ onStartWorkout, onGoToProfile, onGoToNutrition, onGoToPlanner, onGoToHome }) => {
  const { profile, streak, workoutLogs } = useFitApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkouts = workoutLogs.filter(l => l.date === todayStr);

  const goalLabels: Record<Goal, string> = {
    ganar_musculo: 'Ganar Músculo',
    perder_grasa: 'Perder Grasa',
    ganar_fuerza: 'Ganar Fuerza',
    mantener: 'Mantenimiento',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Saludo */}
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.2, color: '#22d3ee', fontWeight: 800 }}>
              {goalLabels[profile.goal]}
            </span>
            <h1 style={{ fontSize: 26, fontWeight: 900, margin: '6px 0 0 0', color: '#ffffff', letterSpacing: '-0.8px' }}>
              Hola, {profile.name}
            </h1>
          </div>
          <div style={{ background: 'rgba(249, 115, 22, 0.15)', padding: '10px 14px', borderRadius: 16, color: '#fb923c', fontWeight: 900, fontSize: 13 }}>
            🔥 {streak}d
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={s.heroCard}>
        <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>
          {profile.context === 'casa' ? '🏠 EN CASA' : profile.context === 'gimnasio' ? '🏋️ GIMNASIO' : '🌳 EXTERIOR'}
        </span>
        <h2 style={{ fontSize: 28, fontWeight: 900, margin: '14px 0 6px 0', letterSpacing: '-1px' }}>Sesión de hoy</h2>
        <p style={{ fontSize: 13, color: '#cffafe', margin: 0, lineHeight: 1.5 }}>
          {todayWorkouts.length > 0
            ? `⚡ ¡Vas genial! ${todayWorkouts.length} serie(s) registradas hoy.`
            : `La app seleccionará los mejores ejercicios según los objetos que tienes en casa.`}
        </p>
        <button
          onClick={onStartWorkout}
          style={s.buttonPrimary}
        >
          🚀 EMPEZAR ENTRENAMIENTO
        </button>
      </div>

      {/* Accesos rápidos */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div onClick={onGoToHome} style={{ ...s.card, margin: 0, cursor: 'pointer', textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>🏠</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#ffffff' }}>Mi Casa</div>
          <div style={{ fontSize: 10, color: '#71717a', marginTop: 2 }}>{profile.homeItems.length} objetos</div>
        </div>
        <div onClick={onGoToPlanner} style={{ ...s.card, margin: 0, cursor: 'pointer', textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 28, marginBottom: 6 }}>📅</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#ffffff' }}>Planificar</div>
          <div style={{ fontSize: 10, color: '#71717a', marginTop: 2 }}>7 días</div>
        </div>
      </div>

      {/* Acceso a nutrición */}
      <div onClick={onGoToNutrition} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#ffffff' }}>🥗 Nutrición</div>
          <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>Recetas, batidos y menú semanal</div>
        </div>
        <span style={{ color: '#22d3ee', fontSize: 20 }}>➔</span>
      </div>

      {/* Acceso a perfil */}
      <div onClick={onGoToProfile} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#ffffff' }}>⚙️ Perfil</div>
          <div style={{ fontSize: 12, color: '#71717a', marginTop: 2 }}>Objetivo, peso y configuración</div>
        </div>
        <span style={{ color: '#22d3ee', fontSize: 20 }}>➔</span>
      </div>
    </div>
  );
};

// ==========================================
// 10. VISTA: MI CASA (NUEVA)
// ==========================================
const HomeInventoryView: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const { profile, toggleHomeItem } = useFitApp();

  const categories: { key: HomeItem['category']; label: string; icon: string }[] = [
    { key: 'mueble', label: 'Muebles', icon: '🪑' },
    { key: 'peso', label: 'Pesos caseros', icon: '⚖️' },
    { key: 'accesorio', label: 'Accesorios', icon: '🧰' },
    { key: 'estructura', label: 'Estructura', icon: '🏗️' },
    { key: 'cocina', label: 'Cocina', icon: '🍳' },
  ];

  // Sugerir objetos que desbloquean más ejercicios
  const suggestions = HOME_ITEMS_LIBRARY
    .filter(item => !profile.homeItems.includes(item.id))
    .filter(item => item.exercisesUnlocked.length > 0)
    .sort((a, b) => b.exercisesUnlocked.length - a.exercisesUnlocked.length)
    .slice(0, 3);

  const exercisesAvailable = MASTER_EXERCISES.filter(ex =>
    ex.requiredItems.length === 0 ||
    ex.requiredItems.every(item => profile.homeItems.includes(item))
  ).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button onClick={onBackToHome} style={s.buttonBack}>← Volver</button>

      <div>
        <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800, letterSpacing: 1 }}>
          Inventario Doméstico
        </span>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: '4px 0 0 0', color: '#ffffff', letterSpacing: '-0.8px' }}>
          Mi Casa
        </h1>
        <p style={{ fontSize: 12, color: '#a1a1aa', marginTop: 6, lineHeight: 1.5 }}>
          Marca los objetos que tienes. La app adaptará los ejercicios automáticamente.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={s.card}>
          <div style={s.statNumber}>{profile.homeItems.length}</div>
          <div style={s.statLabel}>Objetos marcados</div>
        </div>
        <div style={s.card}>
          <div style={s.statNumber}>{exercisesAvailable}</div>
          <div style={s.statLabel}>Ejercicios disponibles</div>
        </div>
      </div>

      {/* Sugerencias */}
      {suggestions.length > 0 && (
        <div style={{ ...s.card, background: 'linear-gradient(135deg, rgba(34,211,238,0.08) 0%, #0f0f11 100%)', border: '1px solid rgba(34,211,238,0.25)' }}>
          <div style={{ fontSize: 12, color: '#22d3ee', fontWeight: 900, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5 }}>
            💡 Sugerencias para desbloquear más
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {suggestions.map(item => (
              <div
                key={item.id}
                onClick={() => toggleHomeItem(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 12,
                  background: 'rgba(0,0,0,0.4)',
                  borderRadius: 16,
                  cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 28 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>{item.name}</div>
                  <div style={{ fontSize: 11, color: '#22d3ee', marginTop: 2 }}>
                    +{item.exercisesUnlocked.length} ejercicios
                  </div>
                </div>
                <span style={{ color: '#22d3ee', fontSize: 18, fontWeight: 900 }}>+</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista por categorías */}
      {categories.map(cat => {
        const items = HOME_ITEMS_LIBRARY.filter(i => i.category === cat.key);
        if (items.length === 0) return null;
        return (
          <div key={cat.key} style={s.card}>
            <div style={{ fontSize: 12, color: '#71717a', fontWeight: 900, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 }}>
              {cat.icon} {cat.label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.map(item => {
                const isSelected = profile.homeItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleHomeItem(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      borderRadius: 16,
                      background: isSelected ? 'rgba(34, 211, 238, 0.12)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '1px solid rgba(34,211,238,0.4)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <span style={{ fontSize: 26 }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: isSelected ? '#22d3ee' : '#ffffff' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#71717a', marginTop: 2 }}>
                        {item.description}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        background: isSelected ? '#22d3ee' : 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? '#000' : '#52525b',
                        fontSize: 12,
                        fontWeight: 900,
                      }}
                    >
                      {isSelected ? '✓' : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// 11. VISTA: PLANNER SEMANAL
// ==========================================
const WeeklyPlannerView: React.FC<{
  onBackToHome: () => void;
  onStartWorkoutForDay: (muscles: string[]) => void;
}> = ({ onBackToHome, onStartWorkoutForDay }) => {
  const { profile, updateWeeklyRoutine } = useFitApp();
  const routine = profile.weeklyRoutine || DEFAULT_WEEKLY_ROUTINE;

  const availableMuscles = [
    { key: 'pecho', label: 'Pecho' },
    { key: 'espalda', label: 'Espalda' },
    { key: 'piernas', label: 'Piernas' },
    { key: 'hombros', label: 'Hombros' },
    { key: 'biceps', label: 'Bíceps' },
    { key: 'triceps', label: 'Tríceps' },
    { key: 'core', label: 'Core' },
    { key: 'cardio', label: 'Cardio' },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button onClick={onBackToHome} style={s.buttonBack}>← Volver</button>

      <div>
        <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800, letterSpacing: 1 }}>
          Control Semanal
        </span>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: '4px 0 0 0', color: '#ffffff', letterSpacing: '-0.8px' }}>
          Planificador
        </h1>
      </div>

      {routine.map((day, dayIndex) => (
        <div key={day.dayName} style={{ ...s.card, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', margin: 0 }}>{day.dayName}</h3>
            <button
              onClick={() => handleToggleRestDay(dayIndex)}
              style={{
                background: day.isRestDay ? 'rgba(34, 211, 238, 0.15)' : 'rgba(255,255,255,0.05)',
                border: day.isRestDay ? '1px solid rgba(34,211,238,0.5)' : '1px solid rgba(255,255,255,0.08)',
                color: day.isRestDay ? '#22d3ee' : '#71717a',
                padding: '6px 12px',
                borderRadius: 12,
                fontSize: 10,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {day.isRestDay ? '💤 DESCANSO' : '🏋️ ENTRENO'}
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
                        padding: '7px 12px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 800,
                        border: isSelected ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)',
                        background: isSelected ? 'rgba(34, 211, 238, 0.15)' : 'rgba(0,0,0,0.4)',
                        color: isSelected ? '#22d3ee' : '#71717a',
                        cursor: 'pointer',
                      }}
                    >
                      {isSelected ? `✓ ${m.label}` : m.label}
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
                    padding: 14,
                    borderRadius: 14,
                    fontWeight: 900,
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  🚀 ENTRENAR ESTE DÍA
                </button>
              )}
            </div>
          ) : (
            <div style={{ fontSize: 12, color: '#52525b', fontStyle: 'italic' }}>
              Día de descanso / recuperación.
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ==========================================
// 12. VISTA: CONFIG ENTRENAMIENTO
// ==========================================
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

    let filtered = MASTER_EXERCISES.filter(ex => {
      if (!selectedMuscles.includes(ex.muscle)) return false;
      if (ex.requiredItems.length === 0) return true;
      return ex.requiredItems.every(item => profile.homeItems.includes(item));
    });

    if (filtered.length === 0) {
      alert('No hay ejercicios compatibles con los objetos que has marcado en Mi Casa.');
      return;
    }

    filtered = [...filtered].sort(() => Math.random() - 0.5);

    const limitMap: Record<number, number> = { 15: 2, 30: 4, 45: 6, 60: 8 };
    const maxExercises = limitMap[selectedTime] || 4;
    filtered = filtered.slice(0, maxExercises);

    onSelectExerciseToPlay(filtered, selectedTime);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button onClick={onBackToHome} style={s.buttonBack}>← Volver</button>

      <div>
        <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800, letterSpacing: 1 }}>
          Biblioteca Inteligente
        </span>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: '4px 0 0 0', color: '#ffffff', letterSpacing: '-0.8px' }}>
          Configurar Sesión
        </h1>
      </div>

      <div style={s.card}>
        <label style={s.label}>⏱️ Duración</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {timeOptions.map(opt => {
            const isSelected = selectedTime === opt.minutes;
            return (
              <button
                key={opt.minutes}
                onClick={() => setSelectedTime(opt.minutes)}
                style={{
                  padding: '12px 4px',
                  borderRadius: 14,
                  border: isSelected ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)',
                  background: isSelected ? 'rgba(34, 211, 238, 0.15)' : 'rgba(0,0,0,0.4)',
                  color: isSelected ? '#22d3ee' : '#ffffff',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 900 }}>{opt.label}</div>
                <div style={{ fontSize: 9, color: isSelected ? '#a5f3fc' : '#52525b', marginTop: 3 }}>{opt.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={s.card}>
        <label style={s.label}>🎯 Músculos (puedes elegir varios)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {muscles.map(m => {
            const isSelected = selectedMuscles.includes(m.key);
            return (
              <button
                key={m.key}
                onClick={() => toggleMuscle(m.key)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 14,
                  border: isSelected ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)',
                  background: isSelected ? 'rgba(34, 211, 238, 0.15)' : 'rgba(0,0,0,0.4)',
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

// ==========================================
// 13. VISTA: PREVIEW
// ==========================================
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

    const availableAlternatives = MASTER_EXERCISES.filter(ex =>
      ex.muscle === currentEx.muscle &&
      !list.some(item => item.id === ex.id) &&
      !excludedExercises.includes(ex.name) &&
      (ex.requiredItems.length === 0 || ex.requiredItems.every(item => profile.homeItems.includes(item)))
    );

    if (availableAlternatives.length > 0) {
      const replacement = availableAlternatives[Math.floor(Math.random() * availableAlternatives.length)];
      const updated = [...list];
      updated[indexToSwap] = replacement;
      setList(updated);
    } else {
      alert('No hay más variantes disponibles con tus objetos actuales.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button onClick={onBack} style={s.buttonBack}>← Volver</button>

      <div>
        <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#fb923c', fontWeight: 800, letterSpacing: 1 }}>
          Sesión de {selectedTime} min
        </span>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: '4px 0 0 0', color: '#ffffff', letterSpacing: '-0.8px' }}>
          Tu tabla
        </h1>
      </div>

      {list.map((ex, idx) => (
        <div key={ex.id} style={{ ...s.card, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 10, color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {ex.muscle}
              </span>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', margin: '4px 0 0 0' }}>{ex.name}</h3>
            </div>
            <button
              onClick={() => handleSwap(idx)}
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                color: '#f87171',
                padding: '8px 12px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              🩹
            </button>
          </div>
          <div style={{ fontSize: 12, color: '#d4d4d8', background: 'rgba(0,0,0,0.4)', padding: '10px 14px', borderRadius: 12 }}>
            <strong>{ex.defaultSets}</strong> series × <strong>{ex.defaultReps}</strong> reps
          </div>
        </div>
      ))}

      <button onClick={() => onConfirmAndStart(list)} style={s.buttonPrimary}>
        ▶️ EMPEZAR ENTRENAMIENTO
      </button>
    </div>
  );
};

// ==========================================
// 14. VISTA: PLAYER ACTIVO
// ==========================================
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
        alert('🏆 ¡Entrenamiento completado!');
        onFinish();
      }
    }
  };

  const progress = ((currentIndex + (currentSet - 1) / currentEx.defaultSets) / exercises.length) * 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button onClick={onFinish} style={s.buttonBack}>← Salir</button>

      {/* Barra de progreso */}
      <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)', transition: 'width 0.3s ease' }} />
      </div>

      <div style={{ ...s.card, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {isResting && (
          <div style={{ background: 'linear-gradient(135deg, #082f49, #0c4a6e)', padding: 20, borderRadius: 20, textAlign: 'center', border: '1px solid rgba(56,189,248,0.3)' }}>
            <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Descanso</div>
            <div style={{ fontSize: 48, fontWeight: 900, color: '#ffffff', margin: '8px 0', letterSpacing: '-2px' }}>
              0:{restTime < 10 ? `0${restTime}` : restTime}
            </div>
            <button
              onClick={skipRest}
              style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8', border: 'none', padding: '8px 16px', borderRadius: 12, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
            >
              SALTAR
            </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#71717a', fontWeight: 800 }}>
          <span>{currentIndex + 1} / {exercises.length}</span>
          <span style={{ color: '#22d3ee' }}>Serie {currentSet} / {currentEx.defaultSets}</span>
        </div>

        <div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.8px' }}>{currentEx.name}</h2>
          <span style={{ fontSize: 12, color: '#22d3ee', textTransform: 'uppercase', fontWeight: 800, letterSpacing: 0.5 }}>
            {currentEx.muscle}
          </span>
        </div>

        <img
          src={currentEx.imageUrl}
          alt={currentEx.name}
          style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 18 }}
        />

        <div style={{ fontSize: 13, color: '#d4d4d8', lineHeight: 1.5, background: 'rgba(0,0,0,0.4)', padding: 14, borderRadius: 14 }}>
          {currentEx.description}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={s.label}>Peso (kg)</label>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={{ ...s.input, marginBottom: 0 }} />
          </div>
          <div>
            <label style={s.label}>Reps</label>
            <input type="number" value={reps} onChange={e => setReps(e.target.value)} style={{ ...s.input, marginBottom: 0 }} />
          </div>
        </div>

        <button onClick={handleCompleteSet} disabled={isResting} style={{ ...s.buttonCyan, opacity: isResting ? 0.4 : 1 }}>
          ✓ COMPLETAR SERIE
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 15. VISTA: NUTRICIÓN (mejorada)
// ==========================================
const NutritionView: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const { profile, addPantryIngredient, togglePantryIngredient } = useFitApp();
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button onClick={onBackToHome} style={s.buttonBack}>← Volver</button>

      <div>
        <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800, letterSpacing: 1 }}>
          Nutrición Inteligente
        </span>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: '4px 0 0 0', color: '#ffffff', letterSpacing: '-0.8px' }}>
          Alimentos y Recetas
        </h1>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', margin: '0 0 12px 0' }}>➕ Añadir alimento</h3>
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
            style={{ background: '#22d3ee', color: '#000', border: 'none', padding: '0 20px', borderRadius: 16, fontWeight: 900, fontSize: 13, cursor: 'pointer' }}
          >
            Añadir
          </button>
        </form>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', margin: '0 0 12px 0' }}>
          ✅ Mi despensa ({profile.pantryIngredients.length})
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {profile.pantryIngredients.map(ing => (
            <button
              key={ing}
              onClick={() => togglePantryIngredient(ing)}
              style={{
                background: 'rgba(34,211,238,0.12)',
                border: '1px solid rgba(34,211,238,0.35)',
                color: '#22d3ee',
                padding: '6px 12px',
                borderRadius: 12,
                fontSize: 11,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {ing} ✕
            </button>
          ))}
        </div>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', margin: '0 0 12px 0' }}>
          ✅ Recetas disponibles ({availableMeals.length})
        </h3>
        {availableMeals.length === 0 ? (
          <p style={{ fontSize: 12, color: '#71717a', margin: 0 }}>
            Añade más ingredientes para desbloquear recetas.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {availableMeals.map(m => (
              <div key={m.id} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 16, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#ffffff' }}>
                    {m.icon} {m.name}
                  </span>
                  <span style={{ fontSize: 10, color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase' }}>
                    {categoryLabels[m.category]}
                  </span>
                </div>
                {m.desc && <p style={{ fontSize: 11, color: '#a1a1aa', margin: '4px 0 8px 0' }}>{m.desc}</p>}
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: '#d4d4d8', fontWeight: 700 }}>
                  <span>🔥 {m.calories}</span>
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
          <h3 style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', margin: '0 0 12px 0' }}>
            🔒 Bloqueadas ({lockedMeals.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {lockedMeals.map(m => {
              const missing = m.requiredIngredients.filter(i => !profile.pantryIngredients.includes(i));
              return (
                <div key={m.id} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 16, padding: 12, opacity: 0.55 }}>
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

// ==========================================
// 16. VISTA: PERFIL
// ==========================================
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

  const goalOptions: { key: Goal; label: string }[] = [
    { key: 'perder_grasa', label: '🔥 Perder grasa' },
    { key: 'ganar_musculo', label: '💪 Ganar músculo' },
    { key: 'ganar_fuerza', label: '⚡ Ganar fuerza' },
    { key: 'mantener', label: '⚖️ Mantener' },
  ];

  const contextOptions: { key: ContextType; label: string }[] = [
    { key: 'casa', label: '🏠 En casa' },
    { key: 'gimnasio', label: '🏋️ Gimnasio' },
    { key: 'fuera_de_casa', label: '🌳 Exterior' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <button onClick={onBackToHome} style={s.buttonBack}>← Volver</button>

      <div>
        <span style={{ fontSize: 10, textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800, letterSpacing: 1 }}>
          Ajustes
        </span>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: '4px 0 0 0', color: '#ffffff', letterSpacing: '-0.8px' }}>
          Mi Perfil
        </h1>
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
        <h3 style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', margin: '0 0 12px 0' }}>🎯 Objetivo</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {goalOptions.map(g => {
            const isActive = profile.goal === g.key;
            return (
              <button
                key={g.key}
                onClick={() => updateProfile({ goal: g.key })}
                style={{
                  padding: '10px 14px',
                  borderRadius: 14,
                  border: isActive ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)',
                  background: isActive ? 'rgba(34, 211, 238, 0.15)' : 'rgba(0,0,0,0.4)',
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
        <h3 style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', margin: '0 0 12px 0' }}>🌍 Contexto</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {contextOptions.map(c => {
            const isActive = profile.context === c.key;
            return (
              <button
                key={c.key}
                onClick={() => updateProfile({ context: c.key })}
                style={{
                  padding: '10px 14px',
                  borderRadius: 14,
                  border: isActive ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)',
                  background: isActive ? 'rgba(34, 211, 238, 0.15)' : 'rgba(0,0,0,0.4)',
                  color: isActive ? '#22d3ee' : '#ffffff',
                  fontWeight: 800,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', margin: '0 0 12px 0' }}>🗑️ Datos</h3>
        <p style={{ fontSize: 11, color: '#a1a1aa', margin: '0 0 12px 0' }}>
          Ejercicios excluidos: <strong>{excludedExercises.length}</strong>
        </p>
        {excludedExercises.length > 0 && (
          <button onClick={resetExclusions} style={{ ...s.buttonDanger, marginBottom: 12 }}>
            Restaurar ejercicios excluidos
          </button>
        )}
        <button
          onClick={() => {
            if (confirm('¿Seguro que quieres borrar TODOS tus datos?')) {
              clearAllData();
            }
          }}
          style={s.buttonDanger}
        >
          Borrar todos mis datos
        </button>
      </div>

      <p style={{ fontSize: 10, color: '#52525b', textAlign: 'center', marginTop: 8, lineHeight: 1.5 }}>
        🔒 Todos los datos se guardan SOLO en este dispositivo.<br />
        Nadie más puede verlos.
      </p>
    </div>
  );
};

// ==========================================
// 17. APP PRINCIPAL
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
    { id: 'home', label: 'Casa', icon: '🏠' },
    { id: 'nutrition', label: 'Nutrición', icon: '🥗' },
    { id: 'profile', label: 'Perfil', icon: '⚙️' },
  ];

  return (
    <div style={s.container}>
      <header style={s.header}>
        <span style={s.logo}>FITAPP</span>
        <span style={s.badge}>v7.0 CASA</span>
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
                onGoToHome={() => setActiveTab('home')}
              />
            )}
            {activeTab === 'home' && <HomeInventoryView onBackToHome={() => setActiveTab('dashboard')} />}
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
