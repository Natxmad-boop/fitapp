import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  Component,
  ErrorInfo,
  ReactNode,
} from 'react';

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
          <h2>¡Algo ha fallado!</h2>
          <p style={{ fontSize: 12, background: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8, wordBreak: 'break-all' }}>
            {this.state.error?.toString()}
          </p>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ marginTop: 20, padding: 12, background: '#fff', color: '#000', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer' }}>
            Limpiar datos y reiniciar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export type Goal = 'perder_grasa' | 'ganar_musculo' | 'ganar_fuerza' | 'mantener';
export type ExperienceLevel = 'Principiante' | 'Intermedio' | 'Avanzado';
export type ContextType = 'casa' | 'gimnasio' | 'fuera_de_casa';
export type FoodCategory = 'proteina' | 'carbo' | 'grasa' | 'verdura' | 'fruta' | 'lacteo' | 'otro';

export interface HomeItem {
  id: string; name: string; icon: string; context: ContextType;
  category: string; description: string;
}

export interface WeeklyRoutineDay { dayName: string; muscles: string[]; isRestDay: boolean; }

export interface UserProfile {
  name: string; age: number; gender: string; height: number; weight: number;
  experience: ExperienceLevel; goal: Goal; daysAvailable: number; context: ContextType;
  homeItems: string[]; weeklyRoutine: WeeklyRoutineDay[];
  pantryIngredients: string[]; hiddenFoods: string[]; hiddenExercises: string[]; hiddenHomeItems: string[];
}

export interface Exercise {
  id: string; name: string; muscle: string; defaultSets: number; defaultReps: number;
  defaultWeight: string; context: ContextType[]; requiredItems: string[];
  level: ExperienceLevel; type: 'generico' | 'especifico';
  description: string; steps: string[]; mistakes: string; tip: string; imageUrl: string;
  isCustom?: boolean;
}

export interface WorkoutSetLog { setNumber: number; weight: number; reps: number; completed: boolean; }
export interface WorkoutLogRecord { id: string; sessionId: string; date: string; exerciseName: string; sets: WorkoutSetLog[]; }

export interface Food {
  id: string; name: string; aliases: string[]; category: FoodCategory;
  kcal: number; protein: number; carbs: number; fats: number; unit: string;
  isCustom?: boolean;
}

export interface Recipe {
  id: string; name: string; category: 'desayuno' | 'comida' | 'cena' | 'snack' | 'batido' | 'bebida';
  ingredients: { name: string; grams: number }[];
  kcal: number; protein: number; carbs: number; fats: number;
  desc: string; icon: string;
}

export interface WeeklyMenuDay {
  dayName: string;
  meals: { desayuno: Recipe | null; comida: Recipe | null; cena: Recipe | null; snack: Recipe | null; };
}

// ==========================================
// BIBLIOTECA DE MATERIALES (18)
// ==========================================
export const HOME_ITEMS_LIBRARY: HomeItem[] = [
  { id: 'silla', name: 'Silla', icon: '🪑', context: 'casa', category: 'mueble', description: 'Silla firme sin ruedas' },
  { id: 'sofa', name: 'Sofá', icon: '🛋️', context: 'casa', category: 'mueble', description: 'Sofá o sillón bajo' },
  { id: 'mesa', name: 'Mesa', icon: '🪵', context: 'casa', category: 'mueble', description: 'Mesa firme' },
  { id: 'mochila', name: 'Mochila', icon: '🎒', context: 'casa', category: 'peso', description: 'Con libros o botellas' },
  { id: 'botellas', name: 'Botellas agua', icon: '🍶', context: 'casa', category: 'peso', description: 'Botellas 1.5L' },
  { id: 'gomas', name: 'Gomas elásticas', icon: '🔗', context: 'casa', category: 'accesorio', description: 'Bandas de resistencia' },
  { id: 'escaleras', name: 'Escaleras', icon: '🪜', context: 'casa', category: 'estructura', description: 'Escaleras o escalón' },
  { id: 'esterilla', name: 'Esterilla', icon: '🧘', context: 'casa', category: 'accesorio', description: 'Esterilla de yoga' },

  { id: 'mancuernas', name: 'Mancuernas', icon: '🏋️', context: 'gimnasio', category: 'peso', description: 'Mancuernas varias' },
  { id: 'barra', name: 'Barra y discos', icon: '➖', context: 'gimnasio', category: 'peso', description: 'Barra olímpica con discos' },
  { id: 'banco', name: 'Banco', icon: '🛏️', context: 'gimnasio', category: 'mueble', description: 'Banco plano o inclinado' },
  { id: 'polea', name: 'Polea', icon: '🎣', context: 'gimnasio', category: 'maquina', description: 'Polea alta o baja' },
  { id: 'rack', name: 'Rack', icon: '🛗', context: 'gimnasio', category: 'estructura', description: 'Rack de sentadillas' },
  { id: 'prensa', name: 'Prensa piernas', icon: '🦵', context: 'gimnasio', category: 'maquina', description: 'Prensa 45º' },

  { id: 'barra_parque', name: 'Barra parque', icon: '🌳', context: 'fuera_de_casa', category: 'estructura', description: 'Barra de calistenia' },
  { id: 'banco_publico', name: 'Banco público', icon: '🪑', context: 'fuera_de_casa', category: 'mueble', description: 'Banco de parque' },
  { id: 'escaleras_parque', name: 'Escaleras parque', icon: '🪜', context: 'fuera_de_casa', category: 'estructura', description: 'Escaleras al aire libre' },
  { id: 'espacio_abierto', name: 'Espacio abierto', icon: '🌅', context: 'fuera_de_casa', category: 'estructura', description: 'Zona amplia' },
];

// ==========================================
// EJERCICIOS (20)
// ==========================================
export const MASTER_EXERCISES: Exercise[] = [
  // PIERNAS
  { id: 'leg_01', name: 'Sentadillas', muscle: 'piernas', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', type: 'generico', description: 'Ejercicio básico de piernas.', steps: ['Pies al ancho de caderas', 'Baja la cadera como si te sentaras', 'Rodillas alineadas con pies', 'Sube empujando talones'], mistakes: 'Rodillas hacia dentro o talones despegados.', tip: 'Baja hasta que los muslos queden paralelos al suelo.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'leg_02', name: 'Zancadas', muscle: 'piernas', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', type: 'generico', description: 'Trabajo unilateral de piernas.', steps: ['Da un paso al frente', 'Baja la rodilla trasera', 'Vuelve empujando con talón delantero', 'Alterna piernas'], mistakes: 'Inclinar el torso hacia delante.', tip: 'Mantén el torso recto y mira al frente.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'leg_03', name: 'Sentadilla búlgara', muscle: 'piernas', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: ['silla'], level: 'Intermedio', type: 'generico', description: 'Sentadilla con pie elevado.', steps: ['Empeine trasero en silla', 'Pie delantero a 60 cm', 'Baja flexionando rodilla delantera', 'Sube con el talón'], mistakes: 'Apoyar peso en la silla.', tip: 'Apóyate en una pared si te falta equilibrio.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'leg_04', name: 'Hip thrust', muscle: 'piernas', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['sofa'], level: 'Intermedio', type: 'generico', description: 'Aislamiento de glúteos.', steps: ['Espalda alta en el sofá', 'Pies al ancho de caderas', 'Baja la cadera sin tocar el suelo', 'Sube apretando glúteos'], mistakes: 'Empujar con lumbar en vez de glúteos.', tip: 'Aprieta el glúteo 2 segundos arriba.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'leg_05', name: 'Peso muerto', muscle: 'piernas', defaultSets: 4, defaultReps: 8, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['barra'], level: 'Avanzado', type: 'especifico', description: 'Cadena posterior con barra.', steps: ['Barra cerca de espinillas', 'Bisagra de cadera con espalda recta', 'Agarra la barra', 'Sube extendiendo cadera y rodillas'], mistakes: 'Redondear la espalda.', tip: 'Empuja el suelo con los pies.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'leg_06', name: 'Step-ups', muscle: 'piernas', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'fuera_de_casa'], requiredItems: ['escaleras'], level: 'Principiante', type: 'generico', description: 'Subida a escalón.', steps: ['Apoya pie completo en escalón', 'Sube empujando con ese pie', 'Baja controlado', 'Alterna piernas'], mistakes: 'Impulsarse con la pierna de abajo.', tip: 'Controla la bajada, no te dejes caer.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },

  // PECHO
  { id: 'chest_01', name: 'Flexiones', muscle: 'pecho', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Intermedio', type: 'generico', description: 'Pecho con peso corporal.', steps: ['Manos a la altura de hombros', 'Cuerpo recto', 'Baja el pecho al suelo', 'Sube empujando palmas'], mistakes: 'Cadera arriba o abajo.', tip: 'Codos a 45º del torso.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' },
  { id: 'chest_02', name: 'Flexiones inclinadas', muscle: 'pecho', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['mesa'], level: 'Principiante', type: 'generico', description: 'Flexiones con manos elevadas.', steps: ['Manos en la mesa', 'Cuerpo diagonal recto', 'Baja pecho a la mesa', 'Sube controlado'], mistakes: 'Cadera caída.', tip: 'Cuanto más alto, más fácil.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' },
  { id: 'chest_03', name: 'Press banca', muscle: 'pecho', defaultSets: 4, defaultReps: 10, defaultWeight: '40', context: ['gimnasio'], requiredItems: ['barra', 'banco'], level: 'Intermedio', type: 'especifico', description: 'Press banca con barra.', steps: ['Túmbate con pies firmes', 'Agarre más ancho que hombros', 'Baja barra al pecho', 'Empuja a extensión'], mistakes: 'Rebotar la barra.', tip: 'Retrae escápulas y arquea ligeramente.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' },
  { id: 'chest_04', name: 'Fondos en silla', muscle: 'triceps', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'fuera_de_casa'], requiredItems: ['silla'], level: 'Intermedio', type: 'generico', description: 'Fondos con silla.', steps: ['Manos en el borde de la silla', 'Piernas extendidas', 'Baja flexionando codos', 'Sube empujando'], mistakes: 'Codos abiertos a 90º.', tip: 'Cuanto más lejos los pies, más difícil.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' },

  // ESPALDA
  { id: 'back_01', name: 'Remo con mochila', muscle: 'espalda', defaultSets: 4, defaultReps: 12, defaultWeight: '10', context: ['casa'], requiredItems: ['mochila'], level: 'Intermedio', type: 'generico', description: 'Remo con peso improvisado.', steps: ['Mochila cargada con libros', 'Bisagra cadera a 45º', 'Tira mochila al pecho', 'Baja controlado'], mistakes: 'Tirar con la lumbar.', tip: 'Junta escápulas al final.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'back_02', name: 'Superman', muscle: 'espalda', defaultSets: 3, defaultReps: 15, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', type: 'generico', description: 'Extensión lumbar.', steps: ['Boca abajo en el suelo', 'Brazos extendidos al frente', 'Eleva brazos y piernas', 'Mantén 2 seg'], mistakes: 'Forzar el cuello.', tip: 'Mira al suelo para no tensionar cuello.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'back_03', name: 'Remo con gomas', muscle: 'espalda', defaultSets: 3, defaultReps: 15, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['gomas'], level: 'Principiante', type: 'generico', description: 'Remo con banda.', steps: ['Ancla la goma', 'Siéntate o de pie', 'Tira al pecho', 'Vuelve controlado'], mistakes: 'Usar el torso para tirar.', tip: 'Ajusta distancia para sentir tensión.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'back_04', name: 'Dominadas', muscle: 'espalda', defaultSets: 4, defaultReps: 6, defaultWeight: '0', context: ['gimnasio', 'fuera_de_casa'], requiredItems: ['barra_parque'], level: 'Avanzado', type: 'generico', description: 'Dominadas en barra.', steps: ['Agarre prono ancho', 'Cuélgate con brazos extendidos', 'Tira hasta que barbilla pase barra', 'Baja controlado'], mistakes: 'Balanceo del cuerpo.', tip: 'Usa banda elástica si no puedes ninguna.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },

  // HOMBROS
  { id: 'sh_01', name: 'Press militar mochila', muscle: 'hombros', defaultSets: 4, defaultReps: 10, defaultWeight: '8', context: ['casa'], requiredItems: ['mochila'], level: 'Intermedio', type: 'generico', description: 'Press vertical con mochila.', steps: ['Mochila a la altura pecho', 'Empuja arriba', 'Bloquea brazos', 'Baja controlado'], mistakes: 'Arquear la lumbar.', tip: 'Activa core para no arquear.', imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?w=400' },
  { id: 'sh_02', name: 'Elevaciones laterales', muscle: 'hombros', defaultSets: 3, defaultReps: 15, defaultWeight: '2', context: ['casa', 'gimnasio'], requiredItems: ['botellas'], level: 'Principiante', type: 'generico', description: 'Deltoides lateral.', steps: ['Botellas a los lados', 'Eleva brazos a altura hombros', 'Baja controlado'], mistakes: 'Subir por encima de hombros.', tip: 'Imagina verter agua al subir.', imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?w=400' },

  // BÍCEPS/TRÍCEPS
  { id: 'bic_01', name: 'Curl botellas', muscle: 'biceps', defaultSets: 3, defaultReps: 15, defaultWeight: '2', context: ['casa', 'gimnasio'], requiredItems: ['botellas'], level: 'Principiante', type: 'generico', description: 'Curl de bíceps.', steps: ['Botellas a los lados', 'Codos pegados al torso', 'Sube botellas', 'Baja controlado'], mistakes: 'Balancear el cuerpo.', tip: 'Aprieta el bíceps arriba.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'tri_01', name: 'Fondos banco', muscle: 'triceps', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['fuera_de_casa', 'gimnasio'], requiredItems: ['banco_publico'], level: 'Principiante', type: 'generico', description: 'Fondos en banco.', steps: ['Manos en banco', 'Piernas extendidas', 'Baja codos', 'Sube controlado'], mistakes: 'Codos abiertos.', tip: 'Talones en suelo si es muy difícil.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' },

  // CORE
  { id: 'core_01', name: 'Plancha frontal', muscle: 'core', defaultSets: 3, defaultReps: 1, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', type: 'generico', description: 'Isométrico de core.', steps: ['Apoyo antebrazos y puntas pies', 'Cuerpo recto', 'Abdomen contraído', 'Mantén la posición'], mistakes: 'Cadera elevada o caída.', tip: 'Aprieta glúteos para estabilizar.', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
  { id: 'core_02', name: 'Mountain climbers', muscle: 'core', defaultSets: 3, defaultReps: 30, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Intermedio', type: 'generico', description: 'Core dinámico.', steps: ['Posición flexión', 'Rodilla al pecho', 'Alterna rápido'], mistakes: 'Cadera muy alta.', tip: 'Imagina correr en plancha.', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
  { id: 'card_01', name: 'Burpees', muscle: 'cardio', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Avanzado', type: 'generico', description: 'Cardio completo.', steps: ['De pie a cuclillas', 'Salta a plancha', 'Flexión opcional', 'Salta arriba'], mistakes: 'No completar salto.', tip: 'Haz por tiempo si eres principiante.', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400' },
];

// ==========================================
// ALIMENTOS (45)
// ==========================================
export const FOOD_DATABASE: Food[] = [
  { id: 'pollo', name: 'Pechuga pollo', aliases: ['pollo'], category: 'proteina', kcal: 165, protein: 31, carbs: 0, fats: 3.6, unit: '100g' },
  { id: 'ternera', name: 'Ternera magra', aliases: ['ternera'], category: 'proteina', kcal: 187, protein: 26, carbs: 0, fats: 9, unit: '100g' },
  { id: 'pavo', name: 'Pavo', aliases: ['pavo'], category: 'proteina', kcal: 135, protein: 29, carbs: 0, fats: 1.7, unit: '100g' },
  { id: 'atun', name: 'Atún natural', aliases: ['atun'], category: 'proteina', kcal: 116, protein: 26, carbs: 0, fats: 1, unit: '100g' },
  { id: 'salmon', name: 'Salmón', aliases: ['salmon'], category: 'proteina', kcal: 208, protein: 20, carbs: 0, fats: 13, unit: '100g' },
  { id: 'merluza', name: 'Merluza', aliases: ['merluza'], category: 'proteina', kcal: 90, protein: 18, carbs: 0, fats: 1, unit: '100g' },
  { id: 'huevo', name: 'Huevo', aliases: ['huevo'], category: 'proteina', kcal: 155, protein: 13, carbs: 1, fats: 11, unit: '100g' },
  { id: 'tofu', name: 'Tofu', aliases: ['tofu'], category: 'proteina', kcal: 144, protein: 15, carbs: 3, fats: 9, unit: '100g' },
  { id: 'lentejas', name: 'Lentejas cocidas', aliases: ['lentejas'], category: 'proteina', kcal: 116, protein: 9, carbs: 20, fats: 0.4, unit: '100g' },
  { id: 'garbanzos', name: 'Garbanzos cocidos', aliases: ['garbanzos'], category: 'proteina', kcal: 164, protein: 8.9, carbs: 27, fats: 2.6, unit: '100g' },
  { id: 'proteina_polvo', name: 'Proteína polvo', aliases: ['whey'], category: 'proteina', kcal: 400, protein: 80, carbs: 8, fats: 5, unit: '100g' },

  { id: 'arroz', name: 'Arroz blanco', aliases: ['arroz'], category: 'carbo', kcal: 130, protein: 2.7, carbs: 28, fats: 0.3, unit: '100g' },
  { id: 'arroz_int', name: 'Arroz integral', aliases: ['arroz integral'], category: 'carbo', kcal: 123, protein: 2.7, carbs: 26, fats: 1, unit: '100g' },
  { id: 'pasta', name: 'Pasta cocida', aliases: ['pasta'], category: 'carbo', kcal: 158, protein: 6, carbs: 31, fats: 0.9, unit: '100g' },
  { id: 'pan_int', name: 'Pan integral', aliases: ['pan'], category: 'carbo', kcal: 247, protein: 13, carbs: 41, fats: 3.4, unit: '100g' },
  { id: 'avena', name: 'Avena', aliases: ['avena'], category: 'carbo', kcal: 389, protein: 17, carbs: 66, fats: 7, unit: '100g' },
  { id: 'patata', name: 'Patata cocida', aliases: ['patata'], category: 'carbo', kcal: 87, protein: 2, carbs: 20, fats: 0.1, unit: '100g' },
  { id: 'batata', name: 'Batata', aliases: ['batata'], category: 'carbo', kcal: 86, protein: 1.6, carbs: 20, fats: 0.1, unit: '100g' },
  { id: 'quinoa', name: 'Quinoa', aliases: ['quinoa'], category: 'carbo', kcal: 120, protein: 4.4, carbs: 21, fats: 1.9, unit: '100g' },

  { id: 'aceite', name: 'Aceite oliva', aliases: ['aceite'], category: 'grasa', kcal: 884, protein: 0, carbs: 0, fats: 100, unit: '100ml' },
  { id: 'aguacate', name: 'Aguacate', aliases: ['aguacate'], category: 'grasa', kcal: 160, protein: 2, carbs: 9, fats: 15, unit: '100g' },
  { id: 'nueces', name: 'Nueces', aliases: ['nueces'], category: 'grasa', kcal: 654, protein: 15, carbs: 14, fats: 65, unit: '100g' },
  { id: 'almendras', name: 'Almendras', aliases: ['almendras'], category: 'grasa', kcal: 579, protein: 21, carbs: 22, fats: 50, unit: '100g' },
  { id: 'cacahuete', name: 'Crema cacahuete', aliases: ['cacahuete'], category: 'grasa', kcal: 588, protein: 25, carbs: 20, fats: 50, unit: '100g' },
  { id: 'chia', name: 'Semillas chía', aliases: ['chia'], category: 'grasa', kcal: 486, protein: 17, carbs: 42, fats: 31, unit: '100g' },

  { id: 'brocoli', name: 'Brócoli', aliases: ['brocoli'], category: 'verdura', kcal: 34, protein: 2.8, carbs: 7, fats: 0.4, unit: '100g' },
  { id: 'espinaca', name: 'Espinacas', aliases: ['espinaca'], category: 'verdura', kcal: 23, protein: 2.9, carbs: 3.6, fats: 0.4, unit: '100g' },
  { id: 'tomate', name: 'Tomate', aliases: ['tomate'], category: 'verdura', kcal: 18, protein: 0.9, carbs: 3.9, fats: 0.2, unit: '100g' },
  { id: 'lechuga', name: 'Lechuga', aliases: ['lechuga'], category: 'verdura', kcal: 15, protein: 1.4, carbs: 2.9, fats: 0.2, unit: '100g' },
  { id: 'zanahoria', name: 'Zanahoria', aliases: ['zanahoria'], category: 'verdura', kcal: 41, protein: 0.9, carbs: 10, fats: 0.2, unit: '100g' },
  { id: 'calabacin', name: 'Calabacín', aliases: ['calabacin'], category: 'verdura', kcal: 17, protein: 1.2, carbs: 3.1, fats: 0.3, unit: '100g' },

  { id: 'platano', name: 'Plátano', aliases: ['platano'], category: 'fruta', kcal: 89, protein: 1.1, carbs: 23, fats: 0.3, unit: '100g' },
  { id: 'manzana', name: 'Manzana', aliases: ['manzana'], category: 'fruta', kcal: 52, protein: 0.3, carbs: 14, fats: 0.2, unit: '100g' },
  { id: 'naranja', name: 'Naranja', aliases: ['naranja'], category: 'fruta', kcal: 47, protein: 0.9, carbs: 12, fats: 0.1, unit: '100g' },
  { id: 'fresas', name: 'Fresas', aliases: ['fresas'], category: 'fruta', kcal: 32, protein: 0.7, carbs: 7.7, fats: 0.3, unit: '100g' },
  { id: 'arandanos', name: 'Arándanos', aliases: ['arandanos'], category: 'fruta', kcal: 57, protein: 0.7, carbs: 14, fats: 0.3, unit: '100g' },

  { id: 'yogur', name: 'Yogur griego', aliases: ['yogur'], category: 'lacteo', kcal: 97, protein: 9, carbs: 4, fats: 5, unit: '100g' },
  { id: 'leche', name: 'Leche semidesnatada', aliases: ['leche'], category: 'lacteo', kcal: 47, protein: 3.2, carbs: 4.8, fats: 1.6, unit: '100ml' },
  { id: 'queso_fresco', name: 'Queso fresco batido', aliases: ['queso'], category: 'lacteo', kcal: 78, protein: 12, carbs: 4, fats: 1.5, unit: '100g' },
  { id: 'skyr', name: 'Skyr', aliases: ['skyr'], category: 'lacteo', kcal: 63, protein: 11, carbs: 4, fats: 0.2, unit: '100g' },

  { id: 'cacao', name: 'Cacao puro', aliases: ['cacao'], category: 'otro', kcal: 228, protein: 20, carbs: 58, fats: 14, unit: '100g' },
  { id: 'miel', name: 'Miel', aliases: ['miel'], category: 'otro', kcal: 304, protein: 0.3, carbs: 82, fats: 0, unit: '100g' },
  { id: 'limon', name: 'Limón', aliases: ['limon'], category: 'fruta', kcal: 29, protein: 1.1, carbs: 9, fats: 0.3, unit: '100g' },
  { id: 'jengibre', name: 'Jengibre', aliases: ['jengibre'], category: 'otro', kcal: 80, protein: 1.8, carbs: 18, fats: 0.8, unit: '100g' },
  { id: 'hummus', name: 'Hummus', aliases: ['hummus'], category: 'otro', kcal: 166, protein: 8, carbs: 14, fats: 10, unit: '100g' },
];

// ==========================================
// HELPERS
// ==========================================
const STORAGE_PREFIX = 'fitapp_v20_';

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(STORAGE_PREFIX + key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try { localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value)); } catch {}
};

const calculateStreak = (logs: WorkoutLogRecord[]): number => {
  const days = Array.from(new Set(logs.map(l => l.date))).sort().reverse();
  if (days.length === 0) return 0;
  const today = new Date().toISOString().split('T')[0];
  const yest = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  if (days[0] !== today && days[0] !== yest) return 0;
  let s = 1;
  for (let i = 1; i < days.length; i++) {
    const diff = (new Date(days[i - 1]).getTime() - new Date(days[i]).getTime()) / 86400000;
    if (diff === 1) s++; else break;
  }
  return s;
};

const calculateTargetKcal = (profile: UserProfile): number => {
  const isMale = profile.gender.toLowerCase().includes('hombre') || profile.gender.toLowerCase() === 'm';
  const bmr = isMale
    ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5
    : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  const tdee = bmr * 1.375;
  switch (profile.goal) {
    case 'perder_grasa': return Math.round(tdee - 500);
    case 'ganar_musculo': return Math.round(tdee + 300);
    case 'ganar_fuerza': return Math.round(tdee + 200);
    default: return Math.round(tdee);
  }
};

const CATEGORY_DEFAULTS: Record<FoodCategory, { kcal: number; protein: number; carbs: number; fats: number }> = {
  proteina: { kcal: 150, protein: 25, carbs: 0, fats: 5 },
  carbo: { kcal: 350, protein: 8, carbs: 70, fats: 2 },
  grasa: { kcal: 600, protein: 5, carbs: 5, fats: 60 },
  verdura: { kcal: 30, protein: 2, carbs: 5, fats: 0 },
  fruta: { kcal: 60, protein: 1, carbs: 15, fats: 0 },
  lacteo: { kcal: 100, protein: 6, carbs: 10, fats: 4 },
  otro: { kcal: 100, protein: 5, carbs: 10, fats: 5 },
};

const guessCategory = (name: string): FoodCategory => {
  const n = name.toLowerCase();
  if (/pollo|ternera|pavo|pescado|atun|salmon|merluza|huevo|tofu|gamba|lenteja|garbanzo|proteina|whey/.test(n)) return 'proteina';
  if (/arroz|pasta|pan|avena|patata|batata|quinoa/.test(n)) return 'carbo';
  if (/aceite|nuez|almendra|aguacate|cacahuete|chia/.test(n)) return 'grasa';
  if (/lechuga|tomate|brocoli|espinaca|zanahoria|calabacin/.test(n)) return 'verdura';
  if (/manzana|platano|naranja|fresa|arandano|limon/.test(n)) return 'fruta';
  if (/leche|yogur|queso|skyr/.test(n)) return 'lacteo';
  return 'otro';
};

const searchFoods = (query: string): Food[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return FOOD_DATABASE.filter(f =>
    f.name.toLowerCase().includes(q) || f.aliases.some(a => a.toLowerCase().includes(q))
  ).slice(0, 5);
};

// ==========================================
// GENERADOR RECETAS
// ==========================================
const TEMPLATES: Record<string, { needs: FoodCategory[]; name: string; icon: string; desc: string }> = {
  comun: { needs: ['proteina', 'carbo', 'verdura'], name: 'Plato', icon: '🍽️', desc: 'Comida equilibrada con proteína, carbohidratos y verdura.' },
  ligero: { needs: ['proteina', 'verdura'], name: 'Salteado', icon: '🥗', desc: 'Salteado ligero alto en proteína.' },
  batido: { needs: ['proteina', 'fruta'], name: 'Batido', icon: '🥤', desc: 'Batido post-entreno.' },
  verde: { needs: ['verdura', 'fruta'], name: 'Smoothie', icon: '🥬', desc: 'Smoothie detox.' },
  bebida: { needs: ['fruta'], name: 'Infusión', icon: '🍵', desc: 'Bebida saludable.' },
};

const generateRecipe = (foods: Food[], templateKey: string, category: Recipe['category']): Recipe | null => {
  const tpl = TEMPLATES[templateKey];
  if (!tpl) return null;
  const byCat: Record<string, Food[]> = {};
  tpl.needs.forEach(c => { byCat[c] = foods.filter(f => f.category === c); });
  if (tpl.needs.some(c => byCat[c].length === 0)) return null;
  const grams: Record<string, number> = { proteina: 150, carbo: 80, grasa: 15, verdura: 100, fruta: 100, lacteo: 100, otro: 20 };
  const chosen: { name: string; grams: number }[] = [];
  let kcal = 0, protein = 0, carbs = 0, fats = 0;
  tpl.needs.forEach(c => {
    const food = byCat[c][Math.floor(Math.random() * byCat[c].length)];
    const g = grams[c] || 100;
    chosen.push({ name: food.name, grams: g });
    const f = g / 100;
    kcal += food.kcal * f; protein += food.protein * f;
    carbs += food.carbs * f; fats += food.fats * f;
  });
  const main = chosen[0].name.split(' ')[0];
  return {
    id: Math.random().toString(36).substring(2, 11),
    name: `${tpl.name} de ${main}`,
    category,
    ingredients: chosen,
    kcal: Math.round(kcal),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fats: Math.round(fats),
    desc: tpl.desc,
    icon: tpl.icon,
  };
};

const generateMeal = (foods: Food[], category: Recipe['category']): Recipe | null => {
  const cats = foods.map(f => f.category);
  const has = (c: FoodCategory) => cats.includes(c);
  let tpl: string | null = null;
  if (category === 'desayuno') {
    if (has('proteina') && has('carbo')) tpl = 'comun';
    else if (has('proteina') && has('fruta')) tpl = 'batido';
  } else if (category === 'comida' || category === 'cena') {
    if (has('proteina') && has('carbo') && has('verdura')) tpl = 'comun';
    else if (has('proteina') && has('verdura')) tpl = 'ligero';
  } else if (category === 'snack') {
    if (has('proteina') && has('fruta')) tpl = 'batido';
  } else if (category === 'batido') {
    if (has('proteina') && has('fruta')) tpl = 'batido';
    else if (has('verdura') && has('fruta')) tpl = 'verde';
  } else if (category === 'bebida') {
    if (has('fruta')) tpl = 'bebida';
  }
  if (!tpl) return null;
  return generateRecipe(foods, tpl, category);
};

// ==========================================
// CONTEXTO
// ==========================================
interface FitAppContextData {
  profile: UserProfile;
  updateProfile: (p: Partial<UserProfile>) => void;
  updateWeeklyRoutine: (r: WeeklyRoutineDay[]) => void;
  workoutLogs: WorkoutLogRecord[];
  saveWorkoutLog: (l: WorkoutLogRecord) => void;
  streak: number;
  excludedExercises: string[];
  excludeExercise: (n: string) => void;
  toggleHomeItem: (id: string) => void;
  customFoods: Food[];
  addCustomFood: (f: Food) => void;
  removeCustomFood: (id: string) => void;
  allFoods: Food[];
  hideFood: (id: string) => void;
  unhideFood: (id: string) => void;
  hideExercise: (id: string) => void;
  unhideExercise: (id: string) => void;
  hideHomeItem: (id: string) => void;
  unhideHomeItem: (id: string) => void;
  clearAllData: () => void;
}

const DEFAULT_ROUTINE: WeeklyRoutineDay[] = [
  { dayName: 'Lunes', muscles: ['pecho'], isRestDay: false },
  { dayName: 'Martes', muscles: ['espalda'], isRestDay: false },
  { dayName: 'Miércoles', muscles: ['piernas'], isRestDay: false },
  { dayName: 'Jueves', muscles: ['hombros'], isRestDay: false },
  { dayName: 'Viernes', muscles: ['biceps', 'triceps'], isRestDay: false },
  { dayName: 'Sábado', muscles: ['core', 'cardio'], isRestDay: false },
  { dayName: 'Domingo', muscles: [], isRestDay: true },
];

const defaultProfile: UserProfile = {
  name: 'Atleta', age: 28, gender: 'Hombre', height: 178, weight: 75,
  experience: 'Intermedio', goal: 'ganar_musculo', daysAvailable: 5, context: 'casa',
  homeItems: ['silla', 'mesa', 'sofa', 'mochila', 'botellas'],
  weeklyRoutine: DEFAULT_ROUTINE,
  pantryIngredients: ['pollo', 'arroz', 'brocoli', 'avena', 'platano', 'huevo', 'aceite', 'tomate', 'yogur', 'espinaca'],
  hiddenFoods: [], hiddenExercises: [], hiddenHomeItems: [],
};

const FitAppContext = createContext<FitAppContextData | undefined>(undefined);

export const FitAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const l = loadFromStorage<UserProfile>('profile', defaultProfile);
    if (!l.weeklyRoutine || l.weeklyRoutine.length === 0) l.weeklyRoutine = DEFAULT_ROUTINE;
    if (!l.homeItems) l.homeItems = defaultProfile.homeItems;
    if (!l.hiddenFoods) l.hiddenFoods = [];
    if (!l.hiddenExercises) l.hiddenExercises = [];
    if (!l.hiddenHomeItems) l.hiddenHomeItems = [];
    return l;
  });
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogRecord[]>(() => loadFromStorage('logs', []));
  const [excludedExercises, setExcludedExercises] = useState<string[]>(() => loadFromStorage('excluded', []));
  const [customFoods, setCustomFoods] = useState<Food[]>(() => loadFromStorage('customFoods', []));

  useEffect(() => saveToStorage('profile', profile), [profile]);
  useEffect(() => saveToStorage('logs', workoutLogs), [workoutLogs]);
  useEffect(() => saveToStorage('excluded', excludedExercises), [excludedExercises]);
  useEffect(() => saveToStorage('customFoods', customFoods), [customFoods]);

  const updateProfile = (p: Partial<UserProfile>) => setProfile(prev => ({ ...prev, ...p }));
  const updateWeeklyRoutine = (r: WeeklyRoutineDay[]) => setProfile(prev => ({ ...prev, weeklyRoutine: r }));
  const saveWorkoutLog = (l: WorkoutLogRecord) => setWorkoutLogs(prev => [l, ...prev]);
  const excludeExercise = (n: string) => { if (!excludedExercises.includes(n)) setExcludedExercises(prev => [...prev, n]); };
  const toggleHomeItem = (id: string) => {
    const exists = profile.homeItems.includes(id);
    updateProfile({ homeItems: exists ? profile.homeItems.filter(i => i !== id) : [...profile.homeItems, id] });
  };
  const addCustomFood = (f: Food) => setCustomFoods(prev => [...prev, f]);
  const removeCustomFood = (id: string) => setCustomFoods(prev => prev.filter(f => f.id !== id));
  const hideFood = (id: string) => updateProfile({ hiddenFoods: [...profile.hiddenFoods, id] });
  const unhideFood = (id: string) => updateProfile({ hiddenFoods: profile.hiddenFoods.filter(i => i !== id) });
  const hideExercise = (id: string) => updateProfile({ hiddenExercises: [...profile.hiddenExercises, id] });
  const unhideExercise = (id: string) => updateProfile({ hiddenExercises: profile.hiddenExercises.filter(i => i !== id) });
  const hideHomeItem = (id: string) => updateProfile({ hiddenHomeItems: [...profile.hiddenHomeItems, id] });
  const unhideHomeItem = (id: string) => updateProfile({ hiddenHomeItems: profile.hiddenHomeItems.filter(i => i !== id) });
  const clearAllData = () => {
    Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX)).forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };

  const allFoods = [
    ...FOOD_DATABASE.filter(f => !profile.hiddenFoods.includes(f.id)),
    ...customFoods.filter(f => !profile.hiddenFoods.includes(f.id)),
  ].filter(f => profile.pantryIngredients.includes(f.id));

  const streak = calculateStreak(workoutLogs);

  return (
    <FitAppContext.Provider value={{
      profile, updateProfile, updateWeeklyRoutine,
      workoutLogs, saveWorkoutLog, streak,
      excludedExercises, excludeExercise, toggleHomeItem,
      customFoods, addCustomFood, removeCustomFood, allFoods,
      hideFood, unhideFood, hideExercise, unhideExercise, hideHomeItem, unhideHomeItem,
      clearAllData,
    }}>
      {children}
    </FitAppContext.Provider>
  );
};

export const useFitApp = () => {
  const c = useContext(FitAppContext);
  if (!c) throw new Error('useFitApp fuera de provider');
  return c;
};

// ==========================================
// ESTILOS
// ==========================================
const s = {
  container: { backgroundColor: '#000', color: '#f5f5f7', minHeight: '100vh', maxWidth: 480, margin: '0 auto', padding: 20, fontFamily: '-apple-system, sans-serif', paddingBottom: 110, boxSizing: 'border-box' as const },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, marginBottom: 20 },
  logo: { fontSize: 20, fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #22d3ee 60%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.8px' },
  badge: { fontSize: 10, background: 'rgba(34,211,238,0.12)', color: '#22d3ee', padding: '5px 12px', borderRadius: 20, fontWeight: 800 },
  card: { backgroundColor: '#0f0f11', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 24, padding: 20, marginBottom: 12 },
  hero: { background: 'linear-gradient(140deg, #0c4a6e 0%, #0369a1 40%, #1e1b4b 100%)', borderRadius: 24, padding: 24, color: '#fff', marginBottom: 12 },
  btnPrimary: { width: '100%', padding: 16, backgroundColor: '#fff', color: '#000', fontWeight: 900, borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 14, marginTop: 12 },
  btnCyan: { width: '100%', padding: 16, background: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)', color: '#fff', fontWeight: 900, borderRadius: 16, border: 'none', cursor: 'pointer', fontSize: 14 },
  btnDanger: { width: '100%', padding: 14, backgroundColor: 'rgba(239,68,68,0.12)', color: '#f87171', fontWeight: 800, borderRadius: 14, border: '1px solid rgba(239,68,68,0.35)', cursor: 'pointer', fontSize: 13 },
  btnBack: { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#22d3ee', padding: '10px 16px', borderRadius: 14, fontSize: 13, fontWeight: 800, cursor: 'pointer', marginBottom: 16 },
  input: { width: '100%', backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, padding: 14, color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box' as const, marginTop: 6, marginBottom: 12 },
  nav: { position: 'fixed' as const, bottom: 0, left: 0, right: 0, background: 'rgba(15,15,17,0.96)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-around', padding: '12px 0', maxWidth: 480, margin: '0 auto', zIndex: 100 },
  navItem: (a: boolean) => ({ background: 'none', border: 'none', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 4, color: a ? '#22d3ee' : '#52525b', fontSize: 10, fontWeight: a ? 800 : 600, cursor: 'pointer' }),
  label: { fontSize: 11, color: '#a1a1aa', fontWeight: 700, display: 'block', marginBottom: 6, textTransform: 'uppercase' as const },
};

// ==========================================
// DASHBOARD
// ==========================================
const Dashboard: React.FC<{ onStart: () => void; onProfile: () => void; onNutrition: () => void; onPlanner: () => void; onHome: () => void }> = ({ onStart, onProfile, onNutrition, onPlanner, onHome }) => {
  const { profile, streak, workoutLogs } = useFitApp();
  const today = new Date().toISOString().split('T')[0];
  const todayW = workoutLogs.filter(l => l.date === today);
  const target = calculateTargetKcal(profile);
  const goalLabels: Record<Goal, string> = { ganar_musculo: 'Ganar Músculo', perder_grasa: 'Perder Grasa', ganar_fuerza: 'Ganar Fuerza', mantener: 'Mantenimiento' };
  const ctxLabels: Record<ContextType, string> = { casa: '🏠 CASA', gimnasio: '🏋️ GIMNASIO', fuera_de_casa: '🌳 EXTERIOR' };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={s.card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: 10, color: '#22d3ee', fontWeight: 800, letterSpacing: 1 }}>{goalLabels[profile.goal].toUpperCase()}</span>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: '4px 0 0 0' }}>Hola, {profile.name}</h1>
          </div>
          <div style={{ background: 'rgba(249,115,22,0.15)', padding: '8px 12px', borderRadius: 14, color: '#fb923c', fontWeight: 900, fontSize: 12 }}>🔥 {streak}d</div>
        </div>
      </div>
      <div style={s.hero}>
        <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 20, fontWeight: 800 }}>{ctxLabels[profile.context]}</span>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: '12px 0 6px 0' }}>Sesión de hoy</h2>
        <p style={{ fontSize: 12, color: '#cffafe', margin: 0 }}>
          {todayW.length > 0 ? `⚡ ${todayW.length} series registradas hoy.` : `Ejercicios adaptados a los materiales que tengas marcados.`}
        </p>
        <button onClick={onStart} style={s.btnPrimary}>🚀 EMPEZAR ENTRENAMIENTO</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div onClick={onHome} style={{ ...s.card, margin: 0, cursor: 'pointer', textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 24 }}>🏠</div>
          <div style={{ fontSize: 12, fontWeight: 900, marginTop: 4 }}>Materiales</div>
          <div style={{ fontSize: 10, color: '#71717a' }}>{profile.homeItems.length} marcados</div>
        </div>
        <div onClick={onPlanner} style={{ ...s.card, margin: 0, cursor: 'pointer', textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 24 }}>📅</div>
          <div style={{ fontSize: 12, fontWeight: 900, marginTop: 4 }}>Planificar</div>
          <div style={{ fontSize: 10, color: '#71717a' }}>7 días</div>
        </div>
      </div>
      <div onClick={onNutrition} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900 }}>🥗 Nutrición</div>
          <div style={{ fontSize: 11, color: '#71717a' }}>Objetivo: {target} kcal/día</div>
        </div>
        <span style={{ color: '#22d3ee', fontSize: 18 }}>➔</span>
      </div>
      <div onClick={onProfile} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 900 }}>⚙️ Perfil</div>
          <div style={{ fontSize: 11, color: '#71717a' }}>Objetivo, contexto y datos</div>
        </div>
        <span style={{ color: '#22d3ee', fontSize: 18 }}>➔</span>
      </div>
    </div>
  );
};

// ==========================================
// MATERIALES
// ==========================================
const HomeInventoryView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { profile, toggleHomeItem, hideHomeItem } = useFitApp();
  const ctxLabels: Record<ContextType, string> = { casa: '🏠 Mi Casa', gimnasio: '🏋️ Mi Gimnasio', fuera_de_casa: '🌳 Exterior' };
  const visibleItems = HOME_ITEMS_LIBRARY.filter(i => i.context === profile.context && !profile.hiddenHomeItems.includes(i.id));
  const hiddenItems = HOME_ITEMS_LIBRARY.filter(i => i.context === profile.context && profile.hiddenHomeItems.includes(i.id));
  const exercisesAvailable = MASTER_EXERCISES.filter(ex =>
    !profile.hiddenExercises.includes(ex.id) &&
    ex.context.includes(profile.context) &&
    (ex.requiredItems.length === 0 || ex.requiredItems.every(i => profile.homeItems.includes(i)))
  ).length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onBack} style={s.btnBack}>← Volver</button>
      <div>
        <span style={{ fontSize: 10, color: '#22d3ee', fontWeight: 800 }}>INVENTARIO</span>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: '4px 0 0 0' }}>{ctxLabels[profile.context]}</h1>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div style={s.card}><div style={{ fontSize: 28, fontWeight: 900 }}>{profile.homeItems.filter(i => visibleItems.some(v => v.id === i)).length}</div><div style={{ fontSize: 10, color: '#71717a', fontWeight: 700 }}>MARCADOS</div></div>
        <div style={s.card}><div style={{ fontSize: 28, fontWeight: 900 }}>{exercisesAvailable}</div><div style={{ fontSize: 10, color: '#71717a', fontWeight: 700 }}>EJERCICIOS</div></div>
      </div>
      <div style={s.card}>
        <div style={{ fontSize: 11, color: '#71717a', fontWeight: 800, marginBottom: 10 }}>OBJETOS DISPONIBLES ({visibleItems.length})</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {visibleItems.map(item => {
            const isSelected = profile.homeItems.includes(item.id);
            return (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 14, background: isSelected ? 'rgba(34,211,238,0.12)' : 'rgba(255,255,255,0.03)', border: isSelected ? '1px solid rgba(34,211,238,0.4)' : '1px solid transparent' }}>
                <div onClick={() => toggleHomeItem(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, cursor: 'pointer' }}>
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: isSelected ? '#22d3ee' : '#fff' }}>{item.name}</div>
                    <div style={{ fontSize: 10, color: '#71717a' }}>{item.description}</div>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: isSelected ? '#22d3ee' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? '#000' : '#52525b', fontSize: 11, fontWeight: 900 }}>
                    {isSelected ? '✓' : ''}
                  </div>
                </div>
                <button onClick={() => hideHomeItem(item.id)} style={{ background: 'transparent', border: 'none', color: '#52525b', fontSize: 14, cursor: 'pointer', padding: 4 }}>🗑️</button>
              </div>
            );
          })}
        </div>
      </div>
      {hiddenItems.length > 0 && (
        <div style={s.card}>
          <div style={{ fontSize: 11, color: '#71717a', fontWeight: 800, marginBottom: 8 }}>OCULTOS ({hiddenItems.length})</div>
          {hiddenItems.map(item => (
            <button key={item.id} onClick={() => useFitApp().unhideHomeItem(item.id)} style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.03)', border: 'none', color: '#a1a1aa', padding: 10, borderRadius: 12, fontSize: 12, marginBottom: 6, cursor: 'pointer', textAlign: 'left' }}>
              {item.icon} {item.name} — pulsar para restaurar
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// PLANNER
// ==========================================
const PlannerView: React.FC<{ onBack: () => void; onStartForDay: (m: string[]) => void }> = ({ onBack, onStartForDay }) => {
  const { profile, updateWeeklyRoutine } = useFitApp();
  const routine = profile.weeklyRoutine || DEFAULT_ROUTINE;
  const muscles = ['pecho', 'espalda', 'piernas', 'hombros', 'biceps', 'triceps', 'core', 'cardio'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onBack} style={s.btnBack}>← Volver</button>
      <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Planificador</h1>
      {routine.map((day, i) => (
        <div key={day.dayName} style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, margin: 0 }}>{day.dayName}</h3>
            <button onClick={() => updateWeeklyRoutine(routine.map((d, idx) => idx === i ? { ...d, isRestDay: !d.isRestDay, muscles: !d.isRestDay ? [] : d.muscles } : d))} style={{ background: day.isRestDay ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.05)', border: day.isRestDay ? '1px solid rgba(34,211,238,0.5)' : '1px solid rgba(255,255,255,0.08)', color: day.isRestDay ? '#22d3ee' : '#71717a', padding: '5px 10px', borderRadius: 10, fontSize: 10, fontWeight: 800, cursor: 'pointer' }}>
              {day.isRestDay ? '💤 DESCANSO' : '🏋️ ENTRENO'}
            </button>
          </div>
          {!day.isRestDay && (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {muscles.map(m => {
                  const sel = day.muscles.includes(m);
                  return (
                    <button key={m} onClick={() => updateWeeklyRoutine(routine.map((d, idx) => idx === i ? { ...d, muscles: sel ? d.muscles.filter(x => x !== m) : [...d.muscles, m] } : d))} style={{ padding: '6px 10px', borderRadius: 10, fontSize: 11, fontWeight: 800, border: sel ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)', background: sel ? 'rgba(34,211,238,0.15)' : 'rgba(0,0,0,0.4)', color: sel ? '#22d3ee' : '#71717a', cursor: 'pointer' }}>
                      {sel ? `✓ ${m}` : m}
                    </button>
                  );
                })}
              </div>
              {day.muscles.length > 0 && (
                <button onClick={() => onStartForDay(day.muscles)} style={{ ...s.btnCyan, padding: 12, fontSize: 12 }}>🚀 ENTRENAR</button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

// ==========================================
// WORKOUT VIEW// ==========================================
const WorkoutView: React.FC<{ onPlay: (e: Exercise[], t: number) => void; onBack: () => void; initialMuscles?: string[] }> = ({ onPlay, onBack, initialMuscles }) => {
  const { profile } = useFitApp();
  const [time, setTime] = useState(30);
  const [selMuscles, setSelMuscles] = useState<string[]>(initialMuscles?.length ? initialMuscles : ['piernas']);
  useEffect(() => { if (initialMuscles?.length) setSelMuscles(initialMuscles); }, [initialMuscles]);
  const times = [{ m: 15, l: '15 min' }, { m: 30, l: '30 min' }, { m: 45, l: '45 min' }, { m: 60, l: '60 min' }];
  const muscles = [
    { k: 'piernas', l: '🦵 Piernas' }, { k: 'pecho', l: '🦾 Pecho' }, { k: 'espalda', l: '🦇 Espalda' },
    { k: 'hombros', l: '🛡️ Hombros' }, { k: 'biceps', l: '💪 Bíceps' }, { k: 'triceps', l: '🦾 Tríceps' },
    { k: 'core', l: '⚡ Core' }, { k: 'cardio', l: '🏃 Cardio' },
  ];
  const handleStart = () => {
    if (selMuscles.length === 0) { alert('Elige al menos un músculo.'); return; }
    let filtered = MASTER_EXERCISES.filter(ex =>
      selMuscles.includes(ex.muscle) &&
      !profile.hiddenExercises.includes(ex.id) &&
      ex.context.includes(profile.context) &&
      (ex.requiredItems.length === 0 || ex.requiredItems.every(i => profile.homeItems.includes(i)))
    );
    if (filtered.length === 0) { alert('No hay ejercicios compatibles. Marca más materiales o cambia el contexto.'); return; }
    filtered = filtered.sort(() => Math.random() - 0.5).slice(0, { 15: 2, 30: 4, 45: 6, 60: 8 }[time] || 4);
    onPlay(filtered, time);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onBack} style={s.btnBack}>← Volver</button>
      <div>
        <span style={{ fontSize: 10, color: '#22d3ee', fontWeight: 800 }}>CONTEXTO: {profile.context.toUpperCase()}</span>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: '4px 0 0 0' }}>Configurar</h1>
      </div>
      <div style={s.card}>
        <label style={s.label}>⏱️ Duración</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
          {times.map(t => (
            <button key={t.m} onClick={() => setTime(t.m)} style={{ padding: 12, borderRadius: 12, border: time === t.m ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)', background: time === t.m ? 'rgba(34,211,238,0.15)' : 'rgba(0,0,0,0.4)', color: time === t.m ? '#22d3ee' : '#fff', fontWeight: 900, fontSize: 12, cursor: 'pointer' }}>{t.l}</button>
          ))}
        </div>
      </div>
      <div style={s.card}>
        <label style={s.label}>🎯 Músculos</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {muscles.map(m => {
            const sel = selMuscles.includes(m.k);
            return (
              <button key={m.k} onClick={() => setSelMuscles(prev => sel ? prev.filter(x => x !== m.k) : [...prev, m.k])} style={{ padding: '10px 12px', borderRadius: 12, border: sel ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)', background: sel ? 'rgba(34,211,238,0.15)' : 'rgba(0,0,0,0.4)', color: sel ? '#22d3ee' : '#fff', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>
                {sel ? `✓ ${m.l}` : m.l}
              </button>
            );
          })}
        </div>
        <button onClick={handleStart} style={s.btnCyan}>GENERAR SESIÓN</button>
      </div>
    </div>
  );
};

// ==========================================
// PREVIEW
// ==========================================
const Preview: React.FC<{ exercises: Exercise[]; time: number; onStart: (e: Exercise[]) => void; onBack: () => void }> = ({ exercises, time, onStart, onBack }) => {
  const { excludeExercise, excludedExercises, profile } = useFitApp();
  const [list, setList] = useState(exercises);
  const [showTut, setShowTut] = useState<number | null>(null);
  const swap = (idx: number) => {
    const cur = list[idx];
    excludeExercise(cur.name);
    const alts = MASTER_EXERCISES.filter(ex =>
      ex.muscle === cur.muscle &&
      !list.some(i => i.id === ex.id) &&
      !excludedExercises.includes(ex.name) &&
      ex.context.includes(profile.context) &&
      (ex.requiredItems.length === 0 || ex.requiredItems.every(i => profile.homeItems.includes(i)))
    );
    if (alts.length > 0) {
      const upd = [...list]; upd[idx] = alts[Math.floor(Math.random() * alts.length)]; setList(upd);
    } else alert('No hay más alternativas.');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onBack} style={s.btnBack}>← Volver</button>
      <div>
        <span style={{ fontSize: 10, color: '#fb923c', fontWeight: 800 }}>SESIÓN {time} MIN</span>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: '4px 0 0 0' }}>Tu tabla</h1>
      </div>
      {list.map((ex, i) => (
        <div key={ex.id} style={s.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 10, color: '#22d3ee', fontWeight: 800 }}>{ex.muscle.toUpperCase()}</span>
              <h3 style={{ fontSize: 15, fontWeight: 900, margin: '2px 0 0 0' }}>{ex.name}</h3>
            </div>
            <button onClick={() => swap(i)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171', padding: '6px 10px', borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>🩹</button>
          </div>
          <div style={{ fontSize: 12, color: '#d4d4d8', background: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 10, marginBottom: 8 }}>
            <strong>{ex.defaultSets}</strong> series × <strong>{ex.defaultReps}</strong> reps
          </div>
          <button onClick={() => setShowTut(showTut === i ? null : i)} style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee', padding: '8px 12px', borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: 'pointer', width: '100%' }}>
            {showTut === i ? '▲ Ocultar tutorial' : '❓ Cómo se hace'}
          </button>
          {showTut === i && (
            <div style={{ marginTop: 10, background: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 12 }}>
              <img src={ex.imageUrl} alt={ex.name} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }} />
              <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 800, marginBottom: 6 }}>PASOS:</div>
              {ex.steps.map((st, si) => <div key={si} style={{ fontSize: 11, color: '#d4d4d8', marginBottom: 4 }}>{si + 1}. {st}</div>)}
              <div style={{ fontSize: 11, color: '#f87171', fontWeight: 800, marginTop: 8 }}>⚠️ ERROR: {ex.mistakes}</div>
              <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 800, marginTop: 6 }}>💡 TIP: {ex.tip}</div>
            </div>
          )}
        </div>
      ))}
      <button onClick={() => onStart(list)} style={s.btnPrimary}>▶️ EMPEZAR ENTRENAMIENTO</button>
    </div>
  );
};

// ==========================================
// PLAYER
// ==========================================
const Player: React.FC<{ exercises: Exercise[]; onFinish: () => void }> = ({ exercises, onFinish }) => {
  const { saveWorkoutLog } = useFitApp();
  const [sid] = useState(() => Math.random().toString(36).substring(2, 11));
  const [idx, setIdx] = useState(0);
  const [set, setSet] = useState(1);
  const [weight, setWeight] = useState(exercises[0]?.defaultWeight || '0');
  const [reps, setReps] = useState(String(exercises[0]?.defaultReps || 10));
  const [resting, setResting] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const cur = exercises[idx];
  useEffect(() => {
    if (!resting) return;
    if (restTime <= 0) { setResting(false); return; }
    const t = setTimeout(() => setRestTime(v => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resting, restTime]);
  const complete = () => {
    saveWorkoutLog({ id: Math.random().toString(36).substring(2, 11), sessionId: sid, date: new Date().toISOString().split('T')[0], exerciseName: cur.name, sets: [{ setNumber: set, weight: Number(weight), reps: Number(reps), completed: true }] });
    if (set < cur.defaultSets) { setSet(set + 1); setResting(true); setRestTime(60); }
    else if (idx < exercises.length - 1) {
      const n = idx + 1;
      setIdx(n); setSet(1); setWeight(exercises[n].defaultWeight); setReps(String(exercises[n].defaultReps));
      setResting(true); setRestTime(60);
    } else { alert('🏆 ¡Entrenamiento completado!'); onFinish(); }
  };
  const progress = ((idx + (set - 1) / cur.defaultSets) / exercises.length) * 100;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onFinish} style={s.btnBack}>← Salir</button>
      <div style={{ width: '100%', height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', transition: 'width 0.3s' }} />
      </div>
      <div style={s.card}>
        {resting && (
          <div style={{ background: 'linear-gradient(135deg, #082f49, #0c4a6e)', padding: 16, borderRadius: 16, textAlign: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: '#38bdf8', fontWeight: 900 }}>DESCANSO</div>
            <div style={{ fontSize: 40, fontWeight: 900, color: '#fff' }}>0:{restTime < 10 ? `0${restTime}` : restTime}</div>
            <button onClick={() => { setResting(false); setRestTime(60); }} style={{ background: 'rgba(56,189,248,0.2)', color: '#38bdf8', border: 'none', padding: '6px 14px', borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>SALTAR</button>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#71717a', fontWeight: 800, marginBottom: 10 }}>
          <span>Ejercicio {idx + 1}/{exercises.length}</span>
          <span style={{ color: '#22d3ee' }}>Serie {set}/{cur.defaultSets}</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>{cur.name}</h2>
        <span style={{ fontSize: 11, color: '#22d3ee', textTransform: 'uppercase', fontWeight: 800 }}>{cur.muscle}</span>
        <img src={cur.imageUrl} alt={cur.name} style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 16, marginTop: 12 }} />
        <div style={{ fontSize: 12, color: '#d4d4d8', background: 'rgba(0,0,0,0.4)', padding: 12, borderRadius: 12, marginTop: 10 }}>{cur.description}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          <div><label style={s.label}>Peso (kg)</label><input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={{ ...s.input, marginBottom: 0 }} /></div>
          <div><label style={s.label}>Reps</label><input type="number" value={reps} onChange={e => setReps(e.target.value)} style={{ ...s.input, marginBottom: 0 }} /></div>
        </div>
        <button onClick={complete} disabled={resting} style={{ ...s.btnCyan, marginTop: 14, opacity: resting ? 0.4 : 1 }}>✓ COMPLETAR SERIE</button>
      </div>
    </div>
  );
};

// ==========================================
// NUTRICIÓN - MENÚ PRINCIPAL
// ==========================================
const NutritionView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [sub, setSub] = useState<'menu' | 'pantry' | 'recipes' | 'weekly'>('menu');
  const { profile } = useFitApp();
  const target = calculateTargetKcal(profile);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onBack} style={s.btnBack}>← Volver</button>
      {sub === 'menu' && (
        <>
          <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Nutrición</h1>
          <div style={s.card}>
            <div style={{ fontSize: 10, color: '#71717a', fontWeight: 800 }}>OBJETIVO DIARIO</div>
            <div style={{ fontSize: 34, fontWeight: 900, marginTop: 4 }}>{target}</div>
            <div style={{ fontSize: 11, color: '#22d3ee', fontWeight: 800 }}>kcal / día</div>
          </div>
          <div onClick={() => setSub('pantry')} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontSize: 14, fontWeight: 900 }}>🥫 Mi Despensa</div><div style={{ fontSize: 11, color: '#71717a' }}>{profile.pantryIngredients.length} alimentos</div></div>
            <span style={{ color: '#22d3ee', fontSize: 18 }}>➔</span>
          </div>
          <div onClick={() => setSub('recipes')} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontSize: 14, fontWeight: 900 }}>🍳 Generador Recetas</div><div style={{ fontSize: 11, color: '#71717a' }}>Comidas, batidos y bebidas</div></div>
            <span style={{ color: '#22d3ee', fontSize: 18 }}>➔</span>
          </div>
          <div onClick={() => setSub('weekly')} style={{ ...s.card, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontSize: 14, fontWeight: 900 }}>📆 Menú Semanal</div><div style={{ fontSize: 11, color: '#71717a' }}>7 días con macros</div></div>
            <span style={{ color: '#22d3ee', fontSize: 18 }}>➔</span>
          </div>
        </>
      )}
      {sub === 'pantry' && <PantryView onBack={() => setSub('menu')} />}
      {sub === 'recipes' && <RecipesView onBack={() => setSub('menu')} />}
      {sub === 'weekly' && <WeeklyMenuView onBack={() => setSub('menu')} />}
    </div>
  );
};

// ==========================================
// DESPENSA
// ==========================================
const PantryView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { profile, updateProfile, customFoods, addCustomFood, hideFood, unhideFood } = useFitApp();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [nf, setNf] = useState({ name: '', category: 'proteina' as FoodCategory, kcal: '', protein: '', carbs: '', fats: '' });
  const suggestions = searchFoods(search).filter(f => !profile.hiddenFoods.includes(f.id));
  const pantryFoods: Food[] = [...FOOD_DATABASE, ...customFoods].filter(f => profile.pantryIngredients.includes(f.id) && !profile.hiddenFoods.includes(f.id));
  const hiddenFoods = [...FOOD_DATABASE, ...customFoods].filter(f => profile.hiddenFoods.includes(f.id));
  const addFromDB = (f: Food) => {
    if (!profile.pantryIngredients.includes(f.id)) updateProfile({ pantryIngredients: [...profile.pantryIngredients, f.id] });
    setSearch('');
  };
  const addManual = () => {
    if (!nf.name.trim()) return;
    const cat = guessCategory(nf.name);
    const def = CATEGORY_DEFAULTS[nf.category || cat];
    const food: Food = {
      id: 'custom_' + Math.random().toString(36).substring(2, 11),
      name: nf.name.trim(),
      aliases: [nf.name.toLowerCase().trim()],
      category: nf.category || cat,
      kcal: Number(nf.kcal) || def.kcal,
      protein: Number(nf.protein) || def.protein,
      carbs: Number(nf.carbs) || def.carbs,
      fats: Number(nf.fats) || def.fats,
      unit: '100g',
      isCustom: true,
    };
    addCustomFood(food);
    updateProfile({ pantryIngredients: [...profile.pantryIngredients, food.id] });
    setNf({ name: '', category: 'proteina', kcal: '', protein: '', carbs: '', fats: '' });
    setShowAdd(false);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onBack} style={s.btnBack}>← Volver</button>
      <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>Mis alimentos</h1>
      <div style={s.card}>
        <label style={s.label}>🔍 Buscar</label>
        <input type="text" placeholder="Ej: pollo, arroz..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...s.input, marginBottom: 0 }} />
        {suggestions.length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {suggestions.map(f => {
              const already = profile.pantryIngredients.includes(f.id);
              return (
                <div key={f.id} onClick={() => !already && addFromDB(f)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: already ? 'rgba(34,211,238,0.05)' : 'rgba(0,0,0,0.4)', borderRadius: 12, cursor: already ? 'default' : 'pointer', opacity: already ? 0.5 : 1 }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 800 }}>{f.name}</div>
                    <div style={{ fontSize: 10, color: '#71717a' }}>{f.kcal} kcal · {f.protein}P · {f.carbs}C · {f.fats}G</div>
                  </div>
                  <span style={{ color: already ? '#52525b' : '#22d3ee', fontWeight: 900 }}>{already ? '✓' : '+'}</span>
                </div>
              );
            })}
          </div>
        )}
        {search && suggestions.length === 0 && (
          <button onClick={() => { setNf({ ...nf, name: search }); setShowAdd(true); }} style={{ ...s.btnCyan, marginTop: 10, padding: 12, fontSize: 12 }}>➕ Añadir "{search}"</button>
        )}
        <button onClick={() => setShowAdd(!showAdd)} style={{ ...s.btnCyan, marginTop: 12, padding: 12, fontSize: 12, background: 'rgba(255,255,255,0.08)' }}>{showAdd ? '✕ Cancelar' : '➕ Alimento manual'}</button>
        {showAdd && (
          <div style={{ marginTop: 12, padding: 12, background: 'rgba(0,0,0,0.4)', borderRadius: 14 }}>
            <label style={s.label}>Nombre</label>
            <input type="text" value={nf.name} onChange={e => setNf({ ...nf, name: e.target.value })} style={s.input} />
            <label style={s.label}>Categoría</label>
            <select value={nf.category} onChange={e => setNf({ ...nf, category: e.target.value as FoodCategory })} style={{ ...s.input, background: '#0f0f11' }}>
              {(['proteina','carbo','grasa','verdura','fruta','lacteo','otro'] as FoodCategory[]).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div style={{ fontSize: 10, color: '#71717a', fontStyle: 'italic', marginBottom: 8 }}>Macros opcionales. Si los dejas vacíos, se estiman por categoría.</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div><label style={s.label}>Kcal</label><input type="number" value={nf.kcal} onChange={e => setNf({ ...nf, kcal: e.target.value })} style={{ ...s.input, marginBottom: 0 }} /></div>
              <div><label style={s.label}>Proteína</label><input type="number" value={nf.protein} onChange={e => setNf({ ...nf, protein: e.target.value })} style={{ ...s.input, marginBottom: 0 }} /></div>
              <div><label style={s.label}>Carbos</label><input type="number" value={nf.carbs} onChange={e => setNf({ ...nf, carbs: e.target.value })} style={{ ...s.input, marginBottom: 0 }} /></div>
              <div><label style={s.label}>Grasas</label><input type="number" value={nf.fats} onChange={e => setNf({ ...nf, fats: e.target.value })} style={{ ...s.input, marginBottom: 0 }} /></div>
            </div>
            <button onClick={addManual} style={{ ...s.btnCyan, marginTop: 12 }}>GUARDAR</button>
          </div>
        )}
      </div>
      <div style={s.card}>
        <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 10 }}>🥫 Mi despensa ({pantryFoods.length})</div>
        {pantryFoods.map(f => (
          <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: 'rgba(0,0,0,0.4)', borderRadius: 12, marginBottom: 6 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800 }}>{f.name}</div>
              <div style={{ fontSize: 10, color: '#22d3ee' }}>{f.kcal} kcal · {f.protein}P · {f.carbs}C · {f.fats}G</div>
            </div>
            <button onClick={() => updateProfile({ pantryIngredients: profile.pantryIngredients.filter(i => i !== f.id) })} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#f87171', padding: '4px 8px', borderRadius: 8, fontSize: 10, fontWeight: 800, cursor: 'pointer', marginRight: 4 }}>✕</button>
            <button onClick={() => hideFood(f.id)} style={{ background: 'transparent', border: 'none', color: '#52525b', fontSize: 14, cursor: 'pointer' }}>🗑️</button>
          </div>
        ))}
      </div>
      {hiddenFoods.length > 0 && (
        <div style={s.card}>
          <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 8 }}>OCULTOS ({hiddenFoods.length})</div>
          {hiddenFoods.map(f => (
            <button key={f.id} onClick={() => unhideFood(f.id)} style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.03)', border: 'none', color: '#a1a1aa', padding: 10, borderRadius: 12, fontSize: 11, marginBottom: 6, cursor: 'pointer', textAlign: 'left' }}>
              {f.name} — pulsar para restaurar
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// RECETAS
// ==========================================
const RecipesView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { allFoods } = useFitApp();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [cat, setCat] = useState<Recipe['category']>('comida');
  const cats: { k: Recipe['category']; l: string }[] = [
    { k: 'desayuno', l: '🍳 Desayuno' }, { k: 'comida', l: '🍽️ Comida' }, { k: 'cena', l: '🌙 Cena' },
    { k: 'snack', l: '🥨 Snack' }, { k: 'batido', l: '🥤 Batido' }, { k: 'bebida', l: '💧 Bebida' },
  ];
  const gen = () => {
    if (allFoods.length === 0) { alert('Añade alimentos a la despensa.'); return; }
    const r: Recipe[] = [];
    for (let i = 0; i < 3; i++) {
      const rec = generateMeal(allFoods, cat);
      if (rec && !r.some(x => x.name === rec.name)) r.push(rec);
    }
    if (r.length === 0) { alert('No hay suficientes alimentos de las categorías necesarias.'); return; }
    setRecipes(r);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onBack} style={s.btnBack}>← Volver</button>
      <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>Recetas</h1>
      <div style={s.card}>
        <label style={s.label}>Tipo</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {cats.map(c => {
            const sel = cat === c.k;
            return <button key={c.k} onClick={() => setCat(c.k)} style={{ padding: '8px 12px', borderRadius: 12, border: sel ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)', background: sel ? 'rgba(34,211,238,0.15)' : 'rgba(0,0,0,0.4)', color: sel ? '#22d3ee' : '#fff', fontWeight: 800, fontSize: 11, cursor: 'pointer' }}>{c.l}</button>;
          })}
        </div>
        <button onClick={gen} style={s.btnCyan}>🎲 GENERAR 3 RECETAS</button>
      </div>
      {recipes.map(r => (
        <div key={r.id} style={s.card}>
          <h3 style={{ fontSize: 15, fontWeight: 900, margin: 0 }}>{r.icon} {r.name}</h3>
          <p style={{ fontSize: 11, color: '#a1a1aa', margin: '4px 0 10px 0' }}>{r.desc}</p>
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 12, marginBottom: 10 }}>
            {r.ingredients.map((ing, i) => <div key={i} style={{ fontSize: 11, color: '#d4d4d8', marginBottom: 3 }}>• {ing.name} ({ing.grams}g)</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, textAlign: 'center' }}>
            <div style={{ background: 'rgba(249,115,22,0.1)', padding: 8, borderRadius: 10 }}><div style={{ fontSize: 13, fontWeight: 900, color: '#fb923c' }}>{r.kcal}</div><div style={{ fontSize: 9, color: '#71717a' }}>KCAL</div></div>
            <div style={{ background: 'rgba(239,68,68,0.1)', padding: 8, borderRadius: 10 }}><div style={{ fontSize: 13, fontWeight: 900, color: '#f87171' }}>{r.protein}g</div><div style={{ fontSize: 9, color: '#71717a' }}>PROT</div></div>
            <div style={{ background: 'rgba(34,211,238,0.1)', padding: 8, borderRadius: 10 }}><div style={{ fontSize: 13, fontWeight: 900, color: '#22d3ee' }}>{r.carbs}g</div><div style={{ fontSize: 9, color: '#71717a' }}>CARB</div></div>
            <div style={{ background: 'rgba(250,204,21,0.1)', padding: 8, borderRadius: 10 }}><div style={{ fontSize: 13, fontWeight: 900, color: '#facc15' }}>{r.fats}g</div><div style={{ fontSize: 9, color: '#71717a' }}>GRAS</div></div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ==========================================
// MENÚ SEMANAL
// ==========================================
const WeeklyMenuView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { allFoods, profile } = useFitApp();
  const [menu, setMenu] = useState<WeeklyMenuDay[]>([]);
  const target = calculateTargetKcal(profile);
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const gen = () => {
    if (allFoods.length < 3) { alert('Añade más alimentos.'); return; }
    const w: WeeklyMenuDay[] = days.map(d => ({
      dayName: d,
      meals: {
        desayuno: generateMeal(allFoods, 'desayuno'),
        comida: generateMeal(allFoods, 'comida'),
        cena: generateMeal(allFoods, 'cena'),
        snack: generateMeal(allFoods, 'snack'),
      },
    }));
    setMenu(w);
  };
  const regen = (i: number, k: keyof WeeklyMenuDay['meals']) => {
    const u = [...menu];
    u[i] = { ...u[i], meals: { ...u[i].meals, [k]: generateMeal(allFoods, k) } };
    setMenu(u);
  };
  const totals = (d: WeeklyMenuDay) => {
    let k = 0, p = 0, c = 0, f = 0;
    Object.values(d.meals).forEach(m => { if (m) { k += m.kcal; p += m.protein; c += m.carbs; f += m.fats; } });
    return { k, p, c, f };
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onBack} style={s.btnBack}>← Volver</button>
      <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0 }}>Menú Semanal</h1>
      <div style={{ fontSize: 11, color: '#a1a1aa' }}>Objetivo: <strong style={{ color: '#22d3ee' }}>{target} kcal/día</strong></div>
      <button onClick={gen} style={s.btnCyan}>{menu.length === 0 ? '🎲 GENERAR MENÚ 7 DÍAS' : '🔄 REGENERAR TODO'}</button>
      {menu.map((d, i) => {
        const t = totals(d);
        return (
          <div key={d.dayName} style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <h3 style={{ fontSize: 14, fontWeight: 900, margin: 0 }}>{d.dayName}</h3>
              <span style={{ fontSize: 11, color: Math.abs(t.k - target) < 200 ? '#22c55e' : '#fb923c', fontWeight: 900 }}>{t.k} kcal</span>
            </div>
            {(['desayuno', 'comida', 'cena', 'snack'] as const).map(k => {
              const meal = d.meals[k];
              const labels: Record<string, string> = { desayuno: '🍳 Desayuno', comida: '🍽️ Comida', cena: '🌙 Cena', snack: '🥨 Snack' };
              return (
                <div key={k} style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: 10, marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: '#71717a', fontWeight: 800 }}>{labels[k]}</span>
                    <button onClick={() => regen(i, k)} style={{ background: 'rgba(34,211,238,0.15)', border: 'none', color: '#22d3ee', padding: '3px 8px', borderRadius: 8, fontSize: 10, fontWeight: 800, cursor: 'pointer' }}>🔄</button>
                  </div>
                  {meal ? (
                    <>
                      <div style={{ fontSize: 12, fontWeight: 800 }}>{meal.icon} {meal.name}</div>
                      <div style={{ fontSize: 10, color: '#22d3ee', marginTop: 2 }}>{meal.kcal} kcal · {meal.protein}P · {meal.carbs}C · {meal.fats}G</div>
                    </>
                  ) : <div style={{ fontSize: 11, color: '#71717a', fontStyle: 'italic' }}>Sin generar</div>}
                </div>
              );
            })}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, textAlign: 'center', marginTop: 8 }}>
              <div><div style={{ fontSize: 12, fontWeight: 900, color: '#fb923c' }}>{t.k}</div><div style={{ fontSize: 9, color: '#71717a' }}>KCAL</div></div>
              <div><div style={{ fontSize: 12, fontWeight: 900, color: '#f87171' }}>{t.p}g</div><div style={{ fontSize: 9, color: '#71717a' }}>PROT</div></div>
              <div><div style={{ fontSize: 12, fontWeight: 900, color: '#22d3ee' }}>{t.c}g</div><div style={{ fontSize: 9, color: '#71717a' }}>CARB</div></div>
              <div><div style={{ fontSize: 12, fontWeight: 900, color: '#facc15' }}>{t.f}g</div><div style={{ fontSize: 9, color: '#71717a' }}>GRAS</div></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ==========================================
// PERFIL
// ==========================================
const ProfileView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { profile, updateProfile, clearAllData } = useFitApp();
  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(String(profile.age));
  const [height, setHeight] = useState(String(profile.height));
  const [weight, setWeight] = useState(String(profile.weight));
  useEffect(() => { setName(profile.name); setAge(String(profile.age)); setHeight(String(profile.height)); setWeight(String(profile.weight)); }, [profile]);
  const goals: { k: Goal; l: string }[] = [
    { k: 'perder_grasa', l: '🔥 Perder grasa' }, { k: 'ganar_musculo', l: '💪 Ganar músculo' },
    { k: 'ganar_fuerza', l: '⚡ Ganar fuerza' }, { k: 'mantener', l: '⚖️ Mantener' },
  ];
  const ctxs: { k: ContextType; l: string }[] = [
    { k: 'casa', l: '🏠 Casa' }, { k: 'gimnasio', l: '🏋️ Gimnasio' }, { k: 'fuera_de_casa', l: '🌳 Exterior' },
  ];
  const target = calculateTargetKcal(profile);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <button onClick={onBack} style={s.btnBack}>← Volver</button>
      <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>Mi Perfil</h1>
      <div style={s.card}>
        <label style={s.label}>Nombre</label><input type="text" value={name} onChange={e => setName(e.target.value)} style={s.input} />
        <label style={s.label}>Edad</label><input type="number" value={age} onChange={e => setAge(e.target.value)} style={s.input} />
        <label style={s.label}>Altura (cm)</label><input type="number" value={height} onChange={e => setHeight(e.target.value)} style={s.input} />
        <label style={s.label}>Peso (kg)</label><input type="number" value={weight} onChange={e => setWeight(e.target.value)} style={s.input} />
        <button onClick={() => { updateProfile({ name, age: Number(age) || profile.age, height: Number(height) || profile.height, weight: Number(weight) || profile.weight }); alert('✅ Guardado'); }} style={s.btnCyan}>GUARDAR</button>
      </div>
      <div style={s.card}>
        <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 10 }}>🎯 Objetivo</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {goals.map(g => {
            const a = profile.goal === g.k;
            return <button key={g.k} onClick={() => updateProfile({ goal: g.k })} style={{ padding: '10px 12px', borderRadius: 12, border: a ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)', background: a ? 'rgba(34,211,238,0.15)' : 'rgba(0,0,0,0.4)', color: a ? '#22d3ee' : '#fff', fontWeight: 800, fontSize: 11, cursor: 'pointer' }}>{g.l}</button>;
          })}
        </div>
        <div style={{ marginTop: 12, padding: 12, background: 'rgba(34,211,238,0.08)', borderRadius: 12, border: '1px solid rgba(34,211,238,0.2)' }}>
          <div style={{ fontSize: 10, color: '#22d3ee', fontWeight: 800 }}>KCAL OBJETIVO</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 2 }}>{target} kcal/día</div>
        </div>
      </div>
      <div style={s.card}>
        <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 10 }}>🌍 Contexto</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {ctxs.map(c => {
            const a = profile.context === c.k;
            return <button key={c.k} onClick={() => updateProfile({ context: c.k })} style={{ padding: '10px 12px', borderRadius: 12, border: a ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)', background: a ? 'rgba(34,211,238,0.15)' : 'rgba(0,0,0,0.4)', color: a ? '#22d3ee' : '#fff', fontWeight: 800, fontSize: 11, cursor: 'pointer' }}>{c.l}</button>;
          })}
        </div>
        <div style={{ fontSize: 10, color: '#71717a', marginTop: 10, fontStyle: 'italic' }}>Al cambiar el contexto, los materiales y ejercicios se adaptan automáticamente.</div>
      </div>
      <div style={s.card}>
        <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 10 }}>🗑️ Datos</div>
        <button onClick={() => { if (confirm('¿Borrar TODOS tus datos?')) clearAllData(); }} style={s.btnDanger}>Borrar todos mis datos</button>
      </div>
      <p style={{ fontSize: 10, color: '#52525b', textAlign: 'center' }}>🔒 Datos guardados solo en este dispositivo.</p>
    </div>
  );
};

// ==========================================
// APP
// ==========================================
function AppContent() {
  const [tab, setTab] = useState('dashboard');
  const [pending, setPending] = useState<{ e: Exercise[]; t: number } | null>(null);
  const [active, setActive] = useState<Exercise[] | null>(null);
  const [planMuscles, setPlanMuscles] = useState<string[]>([]);
  const tabs = [
    { id: 'dashboard', l: 'Inicio', i: '⚡' }, { id: 'planner', l: 'Rutina', i: '📅' },
    { id: 'train', l: 'Entrenar', i: '🔥' }, { id: 'home', l: 'Materiales', i: '🏠' },
    { id: 'nutrition', l: 'Nutrición', i: '🥗' }, { id: 'profile', l: 'Perfil', i: '⚙️' },
  ];
  return (
    <div style={s.container}>
      <header style={s.header}>
        <span style={s.logo}>FITAPP</span>
        <span style={s.badge}>v10.0</span>
      </header>
      <main>
        {active ? <Player exercises={active} onFinish={() => setActive(null)} />
        : pending ? <Preview exercises={pending.e} time={pending.t} onStart={(e) => { setPending(null); setActive(e); }} onBack={() => setPending(null)} />
        : (
          <>
            {tab === 'dashboard' && <Dashboard onStart={() => setTab('train')} onProfile={() => setTab('profile')} onNutrition={() => setTab('nutrition')} onPlanner={() => setTab('planner')} onHome={() => setTab('home')} />}
            {tab === 'home' && <HomeInventoryView onBack={() => setTab('dashboard')} />}
            {tab === 'planner' && <PlannerView onBack={() => setTab('dashboard')} onStartForDay={(m) => { setPlanMuscles(m); setTab('train'); }} />}
            {tab === 'train' && <WorkoutView key={planMuscles.join('-')} initialMuscles={planMuscles} onPlay={(e, t) => setPending({ e, t })} onBack={() => setTab('dashboard')} />}
            {tab === 'nutrition' && <NutritionView onBack={() => setTab('dashboard')} />}
            {tab === 'profile' && <ProfileView onBack={() => setTab('dashboard')} />}
          </>
        )}
      </main>
      {!active && !pending && (
        <nav style={s.nav}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={s.navItem(tab === t.id)}>
              <span style={{ fontSize: 18 }}>{t.i}</span>
              <span>{t.l}</span>
            </button>
          ))}
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
