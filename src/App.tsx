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
export type ExperienceLevel = 'Principiante' | 'Intermedio' | 'Avanzado';
export type ContextType = 'casa' | 'gimnasio' | 'fuera_de_casa';
export type EquipmentType = 'sin_material' | 'mobiliario' | 'carga_improvisada' | 'accesorios';

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
  equipment: EquipmentType[];
  customEquipmentList: CustomEquipmentItem[];
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
  requiredIngredients: string[];
}

export interface BodyMeasurement {
  date: string;
  weight: number;
  bodyFat?: number;
}

// ==========================================
// 2. CONSTANTES Y BIBLIOTECA MAESTRA (50+ EJERCICIOS)
// ==========================================
const DEFAULT_CUSTOM_EQUIPMENT: CustomEquipmentItem[] = [
  { id: 'mobiliario', name: 'Mobiliario (Silla, sofá, mesa)', icon: '🪑' },
  { id: 'carga_improvisada', name: 'Carga improvisada (Mochila, botellas)', icon: '🎒' },
  { id: 'accesorios', name: 'Accesorios (Bandas elásticas, esterilla)', icon: '🧻' }
];

const MASTER_EXERCISES: Exercise[] = [
  // 🦵 Piernas y glúteos
  { id: 'leg_01', name: 'Sentadillas', muscle: 'piernas', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Principiante', description: 'Pies al ancho de caderas, baja la cadera manteniendo el pecho erguido.', homeAlternative: 'Sentadilla libre con peso corporal.', videoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_02', name: 'Sentadillas sumo', muscle: 'piernas', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Principiante', description: 'Pies abiertos con puntas hacia fuera para enfatizar abductores y glúteos.', homeAlternative: 'Sentadilla sumo libre en casa.', videoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_03', name: 'Sentadilla isométrica contra la pared', muscle: 'piernas', defaultSets: 3, defaultReps: 1, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'sin_material', level: 'Intermedio', description: 'Espalda apoyada en pared formando 90 grados con las rodillas.', homeAlternative: 'Pared libre en salón.', videoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_04', name: 'Zancadas hacia delante', muscle: 'piernas', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Principiante', description: 'Da un paso al frente y baja la rodilla trasera sin tocar el suelo.', homeAlternative: 'Zancadas clásicas.', videoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_05', name: 'Zancadas hacia atrás', muscle: 'piernas', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Principiante', description: 'Paso atrás para mayor estabilidad en rodillas.', homeAlternative: 'Zancadas inversas.', videoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_06', name: 'Sentadilla búlgara', muscle: 'piernas', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'mobiliario', level: 'Intermedio', description: 'Pie trasero elevado en una silla o sofá.', homeAlternative: 'Usa una silla del salón.', videoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_07', name: 'Hip thrust apoyado en sofá', muscle: 'piernas', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'mobiliario', level: 'Intermedio', description: 'Espalda alta apoyada en el borde del sofá, empuje de cadera.', homeAlternative: 'Usa el borde de la cama o sofá.', videoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },
  { id: 'leg_08', name: 'Elevaciones de gemelos', muscle: 'piernas', defaultSets: 4, defaultReps: 20, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'sin_material', level: 'Principiante', description: 'Sube sobre las puntas de los pies en un escalón.', homeAlternative: 'Borde de un escalón de casa.', videoUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80' },

  // 💪 Pecho
  { id: 'chest_01', name: 'Flexiones clásicas', muscle: 'pecho', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Intermedio', description: 'Cuerpo recto, codos a 45 grados.', homeAlternative: 'Suelo de casa.', videoUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80' },
  { id: 'chest_02', name: 'Flexiones con rodillas apoyadas', muscle: 'pecho', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'sin_material', level: 'Principiante', description: 'Variante accesible para principiantes apoyando rodillas.', homeAlternative: 'Suelo con rodillas.', videoUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80' },
  { id: 'chest_03', name: 'Flexiones inclinadas (mesa)', muscle: 'pecho', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'mobiliario', level: 'Principiante', description: 'Manos apoyadas en una mesa o encimera alta.', homeAlternative: 'Mesa de comedor o respaldo de sofá.', videoUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80' },
  { id: 'chest_04', name: 'Flexiones declinadas', muscle: 'pecho', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'mobiliario', level: 'Avanzado', description: 'Pies elevados en silla o sofá y manos en el suelo.', homeAlternative: 'Silla para pies.', videoUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80' },

  // 🪽 Espalda
  { id: 'back_01', name: 'Remo con mochila', muscle: 'espalda', defaultSets: 4, defaultReps: 12, defaultWeight: '10', context: ['casa', 'gimnasio'], equipment: 'carga_improvisada', level: 'Intermedio', description: 'Mochila cargada con libros o botellas, inclinación de tronco a 45º.', homeAlternative: 'Mochila con libros pesados.', videoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },
  { id: 'back_02', name: 'Remo con banda elástica', muscle: 'espalda', defaultSets: 3, defaultReps: 15, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'accesorios', level: 'Intermedio', description: 'Pisa la banda con los pies y tira de los extremos hacia tu cadera.', homeAlternative: 'Bandas elásticas ancladas.', videoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },
  { id: 'back_03', name: 'Superman', muscle: 'espalda', defaultSets: 3, defaultReps: 15, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Principiante', description: 'Tumbado boca abajo, eleva brazos y piernas simultáneamente.', homeAlternative: 'Suelo o esterilla.', videoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },

  // 🏋️ Hombros
  { id: 'sh_01', name: 'Press militar con mochila', muscle: 'hombros', defaultSets: 4, defaultReps: 10, defaultWeight: '8', context: ['casa', 'gimnasio'], equipment: 'carga_improvisada', level: 'Intermedio', description: 'Sujeta la mochila por las asas y desórdala por encima de la cabeza.', homeAlternative: 'Mochila o botellas de agua.', videoUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?auto=format&fit=crop&w=600&q=80' },
  { id: 'sh_02', name: 'Elevaciones laterales con botellas', muscle: 'hombros', defaultSets: 3, defaultReps: 15, defaultWeight: '2', context: ['casa', 'gimnasio'], equipment: 'carga_improvisada', level: 'Principiante', description: 'Botellas de agua como mancuernas para elevación lateral.', homeAlternative: 'Botellas de 1.5L llenas de agua.', videoUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?auto=format&fit=crop&w=600&q=80' },
  { id: 'sh_03', name: 'Pike push-ups', muscle: 'hombros', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'sin_material', level: 'Intermedio', description: 'Flexiones con cadera elevada en V invertida para incidir en hombro.', homeAlternative: 'Suelo en posición V.', videoUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?auto=format&fit=crop&w=600&q=80' },

  // 💪 Bíceps y Tríceps
  { id: 'bic_01', name: 'Curl con botellas', muscle: 'biceps', defaultSets: 3, defaultReps: 15, defaultWeight: '2', context: ['casa', 'gimnasio'], equipment: 'carga_improvisada', level: 'Principiante', description: 'Flexión de codo manteniendo los codos pegados al torso.', homeAlternative: 'Botellas de agua.', videoUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80' },
  { id: 'tri_01', name: 'Fondos en silla', muscle: 'triceps', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'mobiliario', level: 'Intermedio', description: 'Manos en el borde de una silla, baja el cuerpo flexionando brazos.', homeAlternative: 'Silla firme de casa.', videoUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=600&q=80' },

  // 🧱 Abdomen y Core
  { id: 'core_01', name: 'Plancha frontal', muscle: 'core', defaultSets: 3, defaultReps: 1, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Principiante', description: 'Apoyo sobre antebrazos y puntas de pies con abdomen contraído.', homeAlternative: 'Suelo o esterilla.', videoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80' },
  { id: 'core_02', name: 'Mountain climbers', muscle: 'core', defaultSets: 3, defaultReps: 30, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Intermedio', description: 'Posición de flexión alternando rodillas al pecho a ritmo dinámico.', homeAlternative: 'Suelo.', videoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80' },
  { id: 'core_03', name: 'Russian twist', muscle: 'core', defaultSets: 3, defaultReps: 20, defaultWeight: '0', context: ['casa', 'gimnasio'], equipment: 'sin_material', level: 'Intermedio', description: 'Sentado con tronco inclinado hacia atrás, gira el torso de lado a lado.', homeAlternative: 'Suelo o con mochila de peso.', videoUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80' },

  // ❤️ Cardio
  { id: 'card_01', name: 'Jumping jacks', muscle: 'cardio', defaultSets: 3, defaultReps: 40, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Principiante', description: 'Saltos abriendo y cerrando piernas y brazos.', homeAlternative: 'Espacio libre.', videoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80' },
  { id: 'card_02', name: 'Burpees', muscle: 'cardio', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], equipment: 'sin_material', level: 'Avanzado', description: 'Sentadilla, plancha, flexión opcional y salto vertical.', homeAlternative: 'Suelo.', videoUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80' }
];

const MASTER_MEALS: MealItem[] = [
  { id: 'm1', name: 'Avena con plátano y proteína', category: 'desayuno', calories: 380, protein: 25, carbs: 55, fats: 6, requiredIngredients: ['avena', 'platano', 'proteina'] },
  { id: 'm2', name: 'Pechuga de pollo con arroz y brócoli', category: 'comida', calories: 550, protein: 48, carbs: 60, fats: 8, requiredIngredients: ['pollo', 'arroz', 'brocoli'] },
  { id: 'm3', name: 'Tortilla francesa con espinacas y pavo', category: 'cena', calories: 310, protein: 35, carbs: 5, fats: 10, requiredIngredients: ['huevo', 'espinacas', 'pavo'] },
  { id: 'm4', name: 'Smoothie Verde Detox Energético', category: 'snack', calories: 180, protein: 12, carbs: 28, fats: 3, requiredIngredients: ['espinacas', 'platano', 'limon'] }
];

const HEALTHY_DRINKS = [
  { id: 'd1', name: 'Agua Infusionada de Limón y Jengibre', desc: 'Ideal para activar el metabolismo en ayunas.', icon: '🍋' },
  { id: 'd2', name: 'Té Matcha Ceremonial con Hielo', desc: 'Antioxidante y energía limpia sin picos de cortisol.', icon: '🍵' },
  { id: 'd3', name: 'Kéfir de Agua con Frutos Rojos', desc: 'Excelente probiótico para la salud intestinal e inmunológica.', icon: '🫐' }
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
  toggleEquipment: (item: EquipmentType) => void;
  togglePantryIngredient: (ingredient: string) => void;
  toggleAllergy: (allergy: string) => void;
}

const defaultProfile: UserProfile = {
  name: 'Atleta',
  age: 28,
  gender: 'Hombre',
  height: 178,
  weight: 75,
  experience: 'Intermedio',
  goal: 'ganar_musculo',
  daysAvailable: 4,
  context: 'casa',
  equipment: ['mobiliario', 'carga_improvisada', 'accesorios'],
  customEquipmentList: DEFAULT_CUSTOM_EQUIPMENT,
  allergies: [],
  dislikedFoods: [],
  pantryIngredients: ['avena', 'platano', 'pollo', 'arroz', 'huevo']
};

const FitAppContext = createContext<FitAppContextData | undefined>(undefined);

export const FitAppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('fitapp_profile_v9');
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch (e) {
      return defaultProfile;
    }
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogRecord[]>(() => {
    try {
      const saved = localStorage.getItem('fitapp_logs_v9');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(() => {
    try {
      const saved = localStorage.getItem('fitapp_measurements_v9');
      return saved ? JSON.parse(saved) : [{ date: new Date().toISOString().split('T')[0], weight: defaultProfile.weight }];
    } catch (e) {
      return [{ date: new Date().toISOString().split('T')[0], weight: defaultProfile.weight }];
    }
  });

  const [excludedExercises, setExcludedExercises] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fitapp_excluded_v9');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => { localStorage.setItem('fitapp_profile_v9', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('fitapp_logs_v9', JSON.stringify(workoutLogs)); }, [workoutLogs]);
  useEffect(() => { localStorage.setItem('fitapp_measurements_v9', JSON.stringify(measurements)); }, [measurements]);
  useEffect(() => { localStorage.setItem('fitapp_excluded_v9', JSON.stringify(excludedExercises)); }, [excludedExercises]);

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

  const toggleAllergy = (allergy: string) => {
    const exists = profile.allergies.includes(allergy);
    const updated = exists ? profile.allergies.filter(a => a !== allergy) : [...profile.allergies, allergy];
    updateProfile({ allergies: updated });
  };

  const uniqueDays = new Set(workoutLogs.map(l => l.date)).size;
  const streak = uniqueDays > 0 ? uniqueDays : 1;

  return (
    <FitAppContext.Provider value={{
      profile, updateProfile, workoutLogs, saveWorkoutLog, measurements,
      addMeasurement, streak, excludedExercises, excludeExercise, toggleEquipment,
      togglePantryIngredient, toggleAllergy
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
          Biblioteca activa filtrada por tus materiales
        </span>
        <h2 style={{ fontSize: '24px', fontWeight: 900, margin: '12px 0 8px 0' }}>Sesión Adaptada</h2>
        <p style={{ fontSize: '12px', color: '#e0f2fe', margin: 0, lineHeight: 1.5 }}>
          {todayWorkouts.length > 0 
            ? `⚡ ¡Gran trabajo! Has registrado ${todayWorkouts.length} ejercicio(s) hoy.` 
            : `El sistema seleccionará ejercicios compatibles con tu inventario actual (${profile.equipment.length} categorías de material).`}
        </p>
        <button onClick={onStartWorkout} style={s.buttonPrimary}>
          🚀 REVISAR TABLA Y ENTRENAR
        </button>
      </div>

      <div onClick={onGoToProfile} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🎒</span> Gestionar Materiales y Despensa
          </div>
          <p style={{ fontSize: '12px', color: '#a1a1aa', margin: '4px 0 0 0' }}>
            Activa o desactiva mobiliario, mochilas y bandas.
          </p>
        </div>
        <span style={{ color: '#22d3ee', fontSize: '18px', fontWeight: 'bold' }}>➔</span>
      </div>
    </div>
  );
};

const WorkoutView: React.FC<{ onSelectExerciseToPlay: (exercises: Exercise[]) => void; onBackToHome: () => void }> = ({ onSelectExerciseToPlay, onBackToHome }) => {
  const { profile } = useFitApp();

  const muscles = [
    { key: 'piernas', label: '🦵 Piernas y Glúteos', desc: 'Sentadillas, zancadas, hip thrust', bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(234, 88, 12, 0.15))' },
    { key: 'pecho', label: '🦾 Pecho', desc: 'Flexiones clásicas y declinadas', bg: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.15))' },
    { key: 'espalda', label: '🦇 Espalda', desc: 'Remo con mochila o bandas', bg: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15), rgba(79, 70, 229, 0.15))' },
    { key: 'hombros', label: '🛡️ Hombros', desc: 'Press militar y elevaciones', bg: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(225, 29, 72, 0.15))' },
    { key: 'core', label: '⚡ Abdomen y Core', desc: 'Planchas y mountain climbers', bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(20, 184, 166, 0.15))' },
    { key: 'cardio', label: '🏃‍♂️ Cardio', desc: 'Jumping jacks y burpees', bg: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(37, 99, 235, 0.15))' }
  ];

  const handleStartMuscle = (muscleKey: string) => {
    // Permitir ejercicios de peso corporal (sin_material) + los que requieran materiales marcados en el perfil
    const allowedEquipment = new Set<string>(['sin_material', ...profile.equipment]);

    const filtered = MASTER_EXERCISES.filter(ex => 
      ex.muscle === muscleKey && 
      allowedEquipment.has(ex.equipment)
    );

    if (filtered.length === 0) {
      alert(`No hay ejercicios de este grupo compatibles con tus materiales activos. Revisa tu perfil.`);
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
        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Biblioteca Inteligente</span>
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
              height: '115px'
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>{m.label}</span>
            <div>
              <span style={{ fontSize: '11px', color: '#a1a1aa', display: 'block' }}>{m.desc}</span>
              <span style={{ fontSize: '10px', color: '#22d3ee', fontWeight: 800, marginTop: '4px', display: 'inline-block' }}>Generar Sesión ➔</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const DailyWorkoutPreview: React.FC<{ exercises: Exercise[]; onConfirmAndStart: (finalExercises: Exercise[]) => void; onBack: () => void }> = ({ exercises, onConfirmAndStart, onBack }) => {
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
      const replacement = availableAlternatives[0];
      const updated = [...list];
      updated[indexToSwap] = replacement;
      setList(updated);
      alert(`⚠️ Ejercicio cambiado: "${currentEx.name}" sustituido por "${replacement.name}".`);
    } else {
      alert('No hay más variantes disponibles con tu equipamiento actual.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button onClick={onBack} style={s.buttonBack}>
        ← Volver a selección
      </button>

      <div>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#fb923c', fontWeight: 800 }}>🛡️ Personalización de Sesión</span>
        <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Tabla Diaria</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {list.map((ex, idx) => (
          <div key={ex.id} style={{ ...s.card, margin: 0, padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#22d3ee', fontWeight: 800, textTransform: 'uppercase' }}>Material: {ex.equipment.replace('_', ' ')}</span>
                <h3 style={{ fontSize: '15px', fontWeight: 900, color: '#ffffff', margin: '2px 0 0 0' }}>{ex.name}</h3>
              </div>
              <button 
                onClick={() => handleSwap(idx)}
                style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#f87171', padding: '6px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
              >
                🩹 Cambiar
              </button>
            </div>
            <div style={{ fontSize: '11px', color: '#d4d4d8', background: '#18181b', padding: '8px 12px', borderRadius: '10px' }}>
              🎯 Series: <strong>{ex.defaultSets}</strong> | Repeticiones: <strong>{ex.defaultReps}</strong>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => onConfirmAndStart(list)} style={s.buttonPrimary}>
        ▶️ EMPEZAR ENTRENAMIENTO
      </button>
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
          <div style={{ fontSize: '10px', color: '#22d3ee', fontWeight: 900, textTransform: 'uppercase', marginBottom: '6px' }}>🎥 Demostración y Técnica</div>
          <img 
            src={currentEx.videoUrl} 
            alt={currentEx.name} 
            style={{ width: '100%', height: '170px', objectFit: 'cover', borderRadius: '12px', marginBottom: '10px', border: '1px solid #27272a' }} 
          />
          <div style={{ fontSize: '12px', color: '#e4e4e7', lineHeight: 1.4, marginBottom: '6px' }}>
            {currentEx.description}
          </div>
          <div style={{ fontSize: '11px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '8px', borderRadius: '8px', marginTop: '6px' }}>
            🏠 <strong>Alternativa en casa:</strong> {currentEx.homeAlternative}
          </div>
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 800 }}>Carga Aplicada (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={s.input} />
        </div>

        <div>
          <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 800 }}>Repeticiones Realizadas</label>
          <input type="number" value={reps} onChange={e => setReps(e.target.value)} style={s.input} />
        </div>

        <button onClick={handleCompleteSet} disabled={isResting} style={{ ...s.buttonCyan, opacity: isResting ? 0.5 : 1, cursor: 'pointer' }}>
          ✓ COMPLETAR SERIE Y DESCANSAR
        </button>
      </div>
    </div>
  );
};

const NutritionView: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const { profile, togglePantryIngredient, toggleAllergy } = useFitApp();
  const commonIngredients = ['avena', 'platano', 'pollo', 'arroz', 'brocoli', 'huevo', 'espinacas', 'pavo', 'limon'];
  const commonAllergies = ['Gluten', 'Lácteos', 'Frutos Secos', 'Huevo'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <button onClick={onBackToHome} style={s.buttonBack}>
        ← Volver al inicio
      </button>

      <div>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#22d3ee', fontWeight: 800 }}>Nutrición Inteligente</span>
        <h1 style={{ fontSize: '20px', fontWeight: 900, margin: '2px 0 0 0', color: '#ffffff' }}>Menús y Despensa</h1>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#f87171', margin: '0 0 8px 0' }}>⚠️ Alergias e Intolerancias</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {commonAllergies.map(alg => {
            const active = profile.allergies.includes(alg);
            return (
              <button
                key={alg}
                onClick={() => toggleAllergy(alg)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  border: active ? '1px solid #f87171' : '1px solid #27272a',
                  background: active ? 'rgba(239, 68, 68, 0.2)' : '#09090b',
                  color: active ? '#f87171' : '#a1a1aa',
                  cursor: 'pointer'
                }}
              >
                {active ? `✓ ${alg}` : `+ ${alg}`}
              </button>
            );
          })}
        </div>
      </div>

      <div style={s.card}>
        <h3 style={{ fontSize: '13px', fontWeight: 900, color: '#ffffff', margin: '0 0 8px 0' }}>🥬 Ingredientes en tu Despensa</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {commonIngredients.map(ing => {
            const hasIt = profile.pantryIngredients.includes(ing);
            return (
              <button
                key={ing}
                onClick={() => togglePantryIngredient(ing)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  border: hasIt ? '1px solid #22d3ee' : '1px solid #27272a',
                  background: hasIt ? 'rgba(34, 211, 238, 0.15)' : '#09090b',
                  color: hasIt ? '#22d3ee' : '#71717a',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {hasIt ? `✓ ${ing}` : `+ ${ing}`}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#ffffff', margin: '0 0 10px 0' }}>🍳 Propuestas de Comidas</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MASTER_MEALS.map(meal => (
            <div key={meal.id} style={s.card}>
              <span style={{ fontSize: '9px', fontWeight: 900, color: '#22d3ee', textTransform: 'uppercase', background: 'rgba(34, 211, 238, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>{meal.category}</span>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', margin: '6px 0 2px 0' }}>{meal.name}</h4>
              <p style={{ fontSize: '11px', color: '#71717a', margin: '0 0 6px 0' }}>{meal.calories} kcal • {meal.protein}g proteína</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#ffffff', margin: '0 0 10px 0' }}>🫖 Bebidas Saludables</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {HEALTHY_DRINKS.map(drink => (
            <div key={drink.id} style={{ ...s.card, display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', margin: 0 }}>
              <span style={{ fontSize: '24px' }}>{drink.icon}</span>
              <div>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', margin: '0 0 2px 0' }}>{drink.name}</h4>
                <p style={{ fontSize: '11px', color: '#a1a1aa', margin: 0, lineHeight: 1.3 }}>{drink.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProgressView: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  const { addMeasurement, streak, workoutLogs } = useFitApp();
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
  const { profile, updateProfile, toggleEquipment } = useFitApp();
  const [name, setName] = useState(profile.name);

  const equipmentList: { key: EquipmentType; label: string; icon: string }[] = [
    { key: 'mobiliario', label: 'Mobiliario (Silla, sofá, mesa)', icon: '🪑' },
    { key: 'carga_improvisada', label: 'Carga improvisada (Mochila, botellas)', icon: '🎒' },
    { key: 'accesorios', label: 'Accesorios (Bandas elásticas, esterilla)', icon: '🧻' }
  ];

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
                onClick={() => updateProfile({ context: ctx })}
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

        <label style={{ fontSize: '11px', color: '#a1a1aa', fontWeight: 800, display: 'block', marginBottom: '8px' }}>
          📦 Materiales disponibles en casa:
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
          {equipmentList.map(item => {
            const isChecked = profile.equipment.includes(item.key);
            return (
              <div 
                key={item.key} 
                onClick={() => toggleEquipment(item.key)}
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
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff' }}>{item.icon} {item.label}</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: isChecked ? '#22d3ee' : '#71717a' }}>{isChecked ? '✓ Activo' : '+ Activar'}</span>
              </div>
            );
          })}
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
  const [pendingWorkoutExercises, setPendingWorkoutExercises] = useState<Exercise[] | null>(null);
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
        <span style={s.badge}>v4.0 INTEGRAL</span>
      </header>

      <main style={{ flex: 1 }}>
        {activeWorkoutExercises ? (
          <ActiveWorkoutPlayer exercises={activeWorkoutExercises} onFinish={() => setActiveWorkoutExercises(null)} />
        ) : pendingWorkoutExercises ? (
          <DailyWorkoutPreview 
            exercises={pendingWorkoutExercises} 
            onConfirmAndStart={(finalExs) => { setPendingWorkoutExercises(null); setActiveWorkoutExercises(finalExs); }} 
            onBack={() => setPendingWorkoutExercises(null)} 
          />
        ) : (
          <>
            {activeTab === 'dashboard' && <Dashboard onStartWorkout={() => setActiveTab('train')} onGoToProfile={() => setActiveTab('profile')} />}
            {activeTab === 'train' && <WorkoutView onSelectExerciseToPlay={(exs) => setPendingWorkoutExercises(exs)} onBackToHome={() => setActiveTab('dashboard')} />}
            {activeTab === 'nutrition' && <NutritionView onBackToHome={() => setActiveTab('dashboard')} />}
            {activeTab === 'progress' && <ProgressView onBackToHome={() => setActiveTab('dashboard')} />}
            {activeTab === 'profile' && <ProfileView onBackToHome={() => setActiveTab('dashboard')} />}
          </>
        )}
      </main>

      {!activeWorkoutExercises && !pendingWorkoutExercises && (
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
