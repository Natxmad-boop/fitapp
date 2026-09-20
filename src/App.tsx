import React, { createContext, useContext, useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };
  public static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) { console.error('Error:', error, errorInfo); }
  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, backgroundColor: '#7f1d1d', color: '#fff', minHeight: '100vh' }}>
          <h2>¡Algo ha fallado!</h2>
          <p style={{ fontSize: 12 }}>{this.state.error?.toString()}</p>
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ marginTop: 20, padding: 12, background: '#fff', color: '#000', border: 'none', borderRadius: 8, fontWeight: 'bold' }}>Limpiar y reiniciar</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export type Goal = 'perder_grasa' | 'ganar_musculo' | 'ganar_fuerza' | 'mantener';
export type ContextType = 'casa' | 'gimnasio' | 'fuera_de_casa';
export type FoodCategory = 'proteina' | 'carbo' | 'grasa' | 'verdura' | 'fruta' | 'lacteo' | 'otro';
export type FoodUse = 'plato' | 'salteado' | 'batido' | 'snack' | 'desayuno' | 'bebida' | 'smoothie';

export interface HomeItem { id: string; name: string; icon: string; context: ContextType; category: string; description: string; }
export interface WeeklyRoutineDay { dayName: string; muscles: string[]; isRestDay: boolean; }
export interface UserProfile {
  name: string; age: number; gender: string; height: number; weight: number;
  goal: Goal; context: ContextType; homeItems: string[]; weeklyRoutine: WeeklyRoutineDay[];
  pantryIngredients: string[]; hiddenFoods: string[]; hiddenExercises: string[]; hiddenHomeItems: string[];
}
export interface Exercise {
  id: string; name: string; muscle: string; defaultSets: number; defaultReps: number;
  defaultWeight: string; context: ContextType[]; requiredItems: string[];
  level: string; description: string; steps: string[]; mistakes: string; tip: string; imageUrl: string;
}
export interface WorkoutSetLog { setNumber: number; weight: number; reps: number; completed: boolean; }
export interface WorkoutLogRecord { id: string; sessionId: string; date: string; exerciseName: string; sets: WorkoutSetLog[]; }
export interface Food { id: string; name: string; aliases: string[]; category: FoodCategory; kcal: number; protein: number; carbs: number; fats: number; unit: string; uses: FoodUse[]; }
export interface Recipe { id: string; name: string; category: string; ingredients: { name: string; grams: number }[]; kcal: number; protein: number; carbs: number; fats: number; desc: string; icon: string; }
export interface WeeklyMenuDay { dayName: string; meals: { desayuno: Recipe | null; comida: Recipe | null; cena: Recipe | null; snack: Recipe | null; }; }

export const HOME_ITEMS_LIBRARY: HomeItem[] = [
  { id: 'silla', name: 'Silla', icon: '🪑', context: 'casa', category: 'mueble', description: 'Silla firme' },
  { id: 'sofa', name: 'Sofá', icon: '🛋️', context: 'casa', category: 'mueble', description: 'Sofá bajo' },
  { id: 'mesa', name: 'Mesa', icon: '🪵', context: 'casa', category: 'mueble', description: 'Mesa firme' },
  { id: 'cama', name: 'Cama', icon: '🛏️', context: 'casa', category: 'mueble', description: 'Cama o colchón' },
  { id: 'pared', name: 'Pared', icon: '🧱', context: 'casa', category: 'estructura', description: 'Pared firme' },
  { id: 'puerta', name: 'Marco puerta', icon: '🚪', context: 'casa', category: 'estructura', description: 'Marco firme' },
  { id: 'escaleras', name: 'Escaleras', icon: '🪜', context: 'casa', category: 'estructura', description: 'Escaleras' },
  { id: 'mochila', name: 'Mochila', icon: '🎒', context: 'casa', category: 'peso', description: 'Con libros' },
  { id: 'botellas', name: 'Botellas agua', icon: '🍶', context: 'casa', category: 'peso', description: 'Botellas 1.5L' },
  { id: 'garrafa', name: 'Garrafa 5L', icon: '🪣', context: 'casa', category: 'peso', description: 'Garrafa' },
  { id: 'gomas', name: 'Gomas elásticas', icon: '🔗', context: 'casa', category: 'accesorio', description: 'Bandas' },
  { id: 'bandas', name: 'Bandas resistencia', icon: '🎗️', context: 'casa', category: 'accesorio', description: 'Bandas' },
  { id: 'esterilla', name: 'Esterilla', icon: '🧘', context: 'casa', category: 'accesorio', description: 'Yoga mat' },
  { id: 'toalla', name: 'Toalla', icon: '🧻', context: 'casa', category: 'accesorio', description: 'Toalla' },
  { id: 'pelota_pilates', name: 'Pelota pilates', icon: '⚪', context: 'casa', category: 'accesorio', description: 'Pelota' },
  { id: 'cuerda_saltar', name: 'Cuerda saltar', icon: '🪢', context: 'casa', category: 'cardio', description: 'Cuerda' },
  { id: 'trx_casero', name: 'TRX casero', icon: '🪢', context: 'casa', category: 'accesorio', description: 'TRX' },
  { id: 'barra_puerta', name: 'Barra puerta', icon: '🚪', context: 'casa', category: 'estructura', description: 'Barra' },
  { id: 'nevera', name: 'Nevera', icon: '🧊', context: 'casa', category: 'cocina', description: 'Nevera' },
  { id: 'espejo', name: 'Espejo', icon: '🪞', context: 'casa', category: 'accesorio', description: 'Espejo' },
  { id: 'mancuernas', name: 'Mancuernas', icon: '🏋️', context: 'gimnasio', category: 'peso', description: 'Mancuernas' },
  { id: 'mancuernas_ajust', name: 'Mancuernas ajustables', icon: '⚙️', context: 'gimnasio', category: 'peso', description: 'Regulables' },
  { id: 'barra', name: 'Barra olímpica', icon: '➖', context: 'gimnasio', category: 'peso', description: 'Barra 20kg' },
  { id: 'discos', name: 'Discos', icon: '⚫', context: 'gimnasio', category: 'peso', description: 'Discos' },
  { id: 'kettlebell', name: 'Kettlebell', icon: '🔔', context: 'gimnasio', category: 'peso', description: 'Pesa rusa' },
  { id: 'banco', name: 'Banco plano', icon: '🛏️', context: 'gimnasio', category: 'mueble', description: 'Banco' },
  { id: 'banco_incl', name: 'Banco inclinado', icon: '📐', context: 'gimnasio', category: 'mueble', description: 'Banco incl' },
  { id: 'rack', name: 'Rack sentadillas', icon: '🛗', context: 'gimnasio', category: 'estructura', description: 'Rack' },
  { id: 'polea_alta', name: 'Polea alta', icon: '🎣', context: 'gimnasio', category: 'maquina', description: 'Polea alta' },
  { id: 'polea_baja', name: 'Polea baja', icon: '🎣', context: 'gimnasio', category: 'maquina', description: 'Polea baja' },
  { id: 'smith', name: 'Máquina Smith', icon: '🏗️', context: 'gimnasio', category: 'maquina', description: 'Smith' },
  { id: 'prensa', name: 'Prensa piernas', icon: '🦵', context: 'gimnasio', category: 'maquina', description: 'Prensa' },
  { id: 'hack', name: 'Hack squat', icon: '🦿', context: 'gimnasio', category: 'maquina', description: 'Hack' },
  { id: 'trx', name: 'TRX', icon: '🪢', context: 'gimnasio', category: 'accesorio', description: 'TRX' },
  { id: 'cajon', name: 'Cajón pliométrico', icon: '📦', context: 'gimnasio', category: 'estructura', description: 'Cajón' },
  { id: 'banda_gym', name: 'Banda gym', icon: '🎗️', context: 'gimnasio', category: 'accesorio', description: 'Banda' },
  { id: 'barra_dominadas', name: 'Barra dominadas', icon: '🏗️', context: 'gimnasio', category: 'estructura', description: 'Barra fija' },
  { id: 'cinta', name: 'Cinta correr', icon: '🏃', context: 'gimnasio', category: 'cardio', description: 'Treadmill' },
  { id: 'bici', name: 'Bici estática', icon: '🚴', context: 'gimnasio', category: 'cardio', description: 'Bici' },
  { id: 'remo_maquina', name: 'Máquina remo', icon: '🚣', context: 'gimnasio', category: 'cardio', description: 'Remo' },
  { id: 'barra_parque', name: 'Barra parque', icon: '🌳', context: 'fuera_de_casa', category: 'estructura', description: 'Barra calistenia' },
  { id: 'banco_publico', name: 'Banco público', icon: '🪑', context: 'fuera_de_casa', category: 'mueble', description: 'Banco parque' },
  { id: 'escaleras_parque', name: 'Escaleras parque', icon: '🪜', context: 'fuera_de_casa', category: 'estructura', description: 'Escaleras' },
  { id: 'cuesta', name: 'Cuesta', icon: '⛰️', context: 'fuera_de_casa', category: 'estructura', description: 'Pendiente' },
  { id: 'arena', name: 'Arena', icon: '🏖️', context: 'fuera_de_casa', category: 'estructura', description: 'Arena' },
  { id: 'columpio', name: 'Columpio', icon: '🎠', context: 'fuera_de_casa', category: 'estructura', description: 'Columpio' },
  { id: 'valla', name: 'Valla baja', icon: '🚧', context: 'fuera_de_casa', category: 'estructura', description: 'Valla' },
  { id: 'arbol', name: 'Árbol rama', icon: '🌲', context: 'fuera_de_casa', category: 'estructura', description: 'Rama' },
  { id: 'muro', name: 'Muro bajo', icon: '🧱', context: 'fuera_de_casa', category: 'estructura', description: 'Muro' },
  { id: 'terreno', name: 'Terreno irregular', icon: '🌄', context: 'fuera_de_casa', category: 'estructura', description: 'Desniveles' },
  { id: 'campo', name: 'Campo fútbol', icon: '⚽', context: 'fuera_de_casa', category: 'estructura', description: 'Campo' },
  { id: 'parque_inf', name: 'Parque infantil', icon: '🛝', context: 'fuera_de_casa', category: 'estructura', description: 'Parque' },
  { id: 'espacio', name: 'Espacio abierto', icon: '🌅', context: 'fuera_de_casa', category: 'estructura', description: 'Espacio' },
  { id: 'pergola', name: 'Banco pérgola', icon: '🏛️', context: 'fuera_de_casa', category: 'estructura', description: 'Pérgola' },
  { id: 'plaza', name: 'Plaza juegos', icon: '🎡', context: 'fuera_de_casa', category: 'estructura', description: 'Plaza' },
];

export const MASTER_EXERCISES: Exercise[] = [
  { id: 'leg_01', name: 'Sentadillas', muscle: 'piernas', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', description: 'Ejercicio básico de piernas.', steps: ['Pies al ancho de caderas', 'Baja la cadera como si te sentaras', 'Rodillas alineadas con pies', 'Sube empujando talones'], mistakes: 'Rodillas hacia dentro o talones despegados.', tip: 'Baja hasta muslos paralelos.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'leg_02', name: 'Zancadas', muscle: 'piernas', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', description: 'Trabajo unilateral.', steps: ['Paso al frente', 'Baja la rodilla trasera', 'Vuelve con talón delantero', 'Alterna piernas'], mistakes: 'Inclinar el torso.', tip: 'Mantén torso recto.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'leg_03', name: 'Sentadilla búlgara', muscle: 'piernas', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: ['silla'], level: 'Intermedio', description: 'Unilateral con pie elevado.', steps: ['Empeine trasero en silla', 'Pie delantero a 60 cm', 'Baja flexionando', 'Sube con talón'], mistakes: 'Apoyar peso en silla.', tip: 'Apóyate en pared si falta equilibrio.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'leg_04', name: 'Hip thrust', muscle: 'piernas', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['sofa'], level: 'Intermedio', description: 'Aislamiento glúteos.', steps: ['Espalda alta en sofá', 'Pies al ancho caderas', 'Baja cadera', 'Sube apretando glúteos'], mistakes: 'Empujar con lumbar.', tip: 'Aprieta glúteo 2 seg arriba.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'leg_05', name: 'Peso muerto', muscle: 'piernas', defaultSets: 4, defaultReps: 8, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['barra'], level: 'Avanzado', description: 'Cadena posterior.', steps: ['Barra cerca espinillas', 'Bisagra cadera', 'Agarra barra', 'Sube extendiendo'], mistakes: 'Redondear espalda.', tip: 'Empuja suelo con pies.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'leg_06', name: 'Step-ups', muscle: 'piernas', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'fuera_de_casa'], requiredItems: ['escaleras'], level: 'Principiante', description: 'Subida escalón.', steps: ['Apoya pie completo', 'Sube empujando', 'Baja controlado', 'Alterna'], mistakes: 'Impulsarse.', tip: 'Controla bajada.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'chest_01', name: 'Flexiones', muscle: 'pecho', defaultSets: 4, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Intermedio', description: 'Pecho peso corporal.', steps: ['Manos altura hombros', 'Cuerpo recto', 'Baja pecho', 'Sube empujando'], mistakes: 'Cadera arriba/abajo.', tip: 'Codos a 45º.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' },
  { id: 'chest_02', name: 'Flexiones inclinadas', muscle: 'pecho', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['mesa'], level: 'Principiante', description: 'Flexiones manos elevadas.', steps: ['Manos en mesa', 'Cuerpo diagonal', 'Baja pecho', 'Sube controlado'], mistakes: 'Cadera caída.', tip: 'Más alto más fácil.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' },
  { id: 'chest_03', name: 'Press banca', muscle: 'pecho', defaultSets: 4, defaultReps: 10, defaultWeight: '40', context: ['gimnasio'], requiredItems: ['barra', 'banco'], level: 'Intermedio', description: 'Press con barra.', steps: ['Pies firmes', 'Agarre ancho', 'Baja barra', 'Empuja extensión'], mistakes: 'Rebotar barra.', tip: 'Retrae escápulas.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' },
  { id: 'chest_04', name: 'Fondos en silla', muscle: 'triceps', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'fuera_de_casa'], requiredItems: ['silla'], level: 'Intermedio', description: 'Fondos silla.', steps: ['Manos borde silla', 'Piernas extendidas', 'Baja flexionando', 'Sube empujando'], mistakes: 'Codos abiertos.', tip: 'Pies lejos más difícil.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' },
  { id: 'back_01', name: 'Remo con mochila', muscle: 'espalda', defaultSets: 4, defaultReps: 12, defaultWeight: '10', context: ['casa'], requiredItems: ['mochila'], level: 'Intermedio', description: 'Remo peso improvisado.', steps: ['Mochila cargada', 'Bisagra 45º', 'Tira al pecho', 'Baja controlado'], mistakes: 'Tirar con lumbar.', tip: 'Junta escápulas.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'back_02', name: 'Superman', muscle: 'espalda', defaultSets: 3, defaultReps: 15, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', description: 'Extensión lumbar.', steps: ['Boca abajo', 'Brazos al frente', 'Eleva brazos y piernas', 'Mantén 2 seg'], mistakes: 'Forzar cuello.', tip: 'Mira al suelo.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'back_03', name: 'Remo con gomas', muscle: 'espalda', defaultSets: 3, defaultReps: 15, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['gomas'], level: 'Principiante', description: 'Remo banda.', steps: ['Ancla goma', 'Siéntate o de pie', 'Tira al pecho', 'Vuelve controlado'], mistakes: 'Usar torso.', tip: 'Ajusta distancia.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'back_04', name: 'Dominadas', muscle: 'espalda', defaultSets: 4, defaultReps: 6, defaultWeight: '0', context: ['gimnasio', 'fuera_de_casa'], requiredItems: ['barra_parque'], level: 'Avanzado', description: 'Dominadas en barra.', steps: ['Agarre prono', 'Cuélgate', 'Tira hasta barbilla', 'Baja controlado'], mistakes: 'Balanceo.', tip: 'Usa banda.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'back_05', name: 'Jalón al pecho', muscle: 'espalda', defaultSets: 4, defaultReps: 10, defaultWeight: '50', context: ['gimnasio'], requiredItems: ['polea_alta'], level: 'Intermedio', description: 'Jalón polea.', steps: ['Siéntate', 'Agarre ancho', 'Tira al pecho', 'Vuelve'], mistakes: 'Tirar con brazos.', tip: 'Codos abajo.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'sh_01', name: 'Press militar mochila', muscle: 'hombros', defaultSets: 4, defaultReps: 10, defaultWeight: '8', context: ['casa'], requiredItems: ['mochila'], level: 'Intermedio', description: 'Press vertical.', steps: ['Mochila al pecho', 'Empuja arriba', 'Bloquea', 'Baja controlado'], mistakes: 'Arquear lumbar.', tip: 'Activa core.', imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?w=400' },
  { id: 'sh_02', name: 'Elevaciones laterales', muscle: 'hombros', defaultSets: 3, defaultReps: 15, defaultWeight: '2', context: ['casa', 'gimnasio'], requiredItems: ['botellas'], level: 'Principiante', description: 'Deltoides lateral.', steps: ['Botellas a los lados', 'Eleva altura hombros', 'Baja controlado'], mistakes: 'Subir por encima.', tip: 'Imagina verter agua.', imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?w=400' },
  { id: 'sh_03', name: 'Press banca militar', muscle: 'hombros', defaultSets: 4, defaultReps: 8, defaultWeight: '30', context: ['gimnasio'], requiredItems: ['barra', 'banco_incl'], level: 'Intermedio', description: 'Press militar barra.', steps: ['Siéntate banco', 'Barra clavículas', 'Empuja arriba', 'Baja controlado'], mistakes: 'Arquear lumbar.', tip: 'Aprieta core.', imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?w=400' },
  { id: 'bic_01', name: 'Curl botellas', muscle: 'biceps', defaultSets: 3, defaultReps: 15, defaultWeight: '2', context: ['casa', 'gimnasio'], requiredItems: ['botellas'], level: 'Principiante', description: 'Curl bíceps.', steps: ['Botellas a los lados', 'Codos pegados', 'Sube botellas', 'Baja controlado'], mistakes: 'Balancear.', tip: 'Aprieta arriba.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'bic_02', name: 'Curl con barra', muscle: 'biceps', defaultSets: 3, defaultReps: 10, defaultWeight: '20', context: ['gimnasio'], requiredItems: ['barra'], level: 'Principiante', description: 'Curl barra.', steps: ['De pie', 'Agarre supino', 'Sube barra', 'Baja controlado'], mistakes: 'Balancear.', tip: 'Codos fijos.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'tri_01', name: 'Fondos banco', muscle: 'triceps', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['fuera_de_casa', 'gimnasio'], requiredItems: ['banco_publico'], level: 'Principiante', description: 'Fondos banco.', steps: ['Manos en banco', 'Piernas extendidas', 'Baja codos', 'Sube'], mistakes: 'Codos abiertos.', tip: 'Talones al suelo.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' },
  { id: 'tri_02', name: 'Extensión tríceps polea', muscle: 'triceps', defaultSets: 3, defaultReps: 12, defaultWeight: '20', context: ['gimnasio'], requiredItems: ['polea_alta'], level: 'Principiante', description: 'Extensión polea.', steps: ['Frente polea', 'Codos pegados', 'Extiende abajo', 'Vuelve controlado'], mistakes: 'Mover codos.', tip: 'Separa cuerda.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' },
  { id: 'core_01', name: 'Plancha frontal', muscle: 'core', defaultSets: 3, defaultReps: 1, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', description: 'Isométrico core.', steps: ['Antebrazos y puntas pies', 'Cuerpo recto', 'Abdomen contraído', 'Mantén'], mistakes: 'Cadera elevada.', tip: 'Aprieta glúteos.', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
  { id: 'core_02', name: 'Mountain climbers', muscle: 'core', defaultSets: 3, defaultReps: 30, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Intermedio', description: 'Core dinámico.', steps: ['Posición flexión', 'Rodilla al pecho', 'Alterna rápido'], mistakes: 'Cadera alta.', tip: 'Corre en plancha.', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
  { id: 'core_03', name: 'Elevación piernas', muscle: 'core', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: [], level: 'Intermedio', description: 'Abdomen inferior.', steps: ['Boca arriba', 'Piernas rectas', 'Eleva a 90º', 'Baja controlado'], mistakes: 'Arquear lumbar.', tip: 'Flexiona rodillas si cuesta.', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
  { id: 'card_01', name: 'Jumping jacks', muscle: 'cardio', defaultSets: 3, defaultReps: 40, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Principiante', description: 'Cardio clásico.', steps: ['Pies juntos', 'Salta abriendo', 'Vuelve', 'Ritmo constante'], mistakes: 'Saltos pequeños.', tip: 'Aterriza rodillas flexionadas.', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400' },
  { id: 'card_02', name: 'Burpees', muscle: 'cardio', defaultSets: 3, defaultReps: 10, defaultWeight: '0', context: ['casa', 'gimnasio', 'fuera_de_casa'], requiredItems: [], level: 'Avanzado', description: 'Cardio completo.', steps: ['De pie a cuclillas', 'Salta a plancha', 'Flexión opcional', 'Salta arriba'], mistakes: 'No completar.', tip: 'Por tiempo si novato.', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400' },
  { id: 'card_03', name: 'Salto cuerda', muscle: 'cardio', defaultSets: 3, defaultReps: 60, defaultWeight: '0', context: ['casa', 'gimnasio'], requiredItems: ['cuerda_saltar'], level: 'Principiante', description: 'Cardio cuerda.', steps: ['Cuerda detrás', 'Salta con muñecas', 'Ritmo constante'], mistakes: 'Saltos altos.', tip: 'Salta 2 cm.', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400' },
  { id: 'gym_sent', name: 'Sentadilla con barra', muscle: 'piernas', defaultSets: 4, defaultReps: 8, defaultWeight: '60', context: ['gimnasio'], requiredItems: ['barra', 'rack'], level: 'Avanzado', description: 'Sentadilla trasera.', steps: ['Barra trapecios', 'Pies al ancho', 'Baja controlado', 'Sube talones'], mistakes: 'Rodillas dentro.', tip: 'Respira profundo.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'gym_prensa', name: 'Prensa piernas', muscle: 'piernas', defaultSets: 4, defaultReps: 12, defaultWeight: '100', context: ['gimnasio'], requiredItems: ['prensa'], level: 'Principiante', description: 'Prensa.', steps: ['Siéntate', 'Pies en plataforma', 'Empuja', 'Baja controlado'], mistakes: 'Bloquear rodillas.', tip: 'No estires del todo.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'gym_remo', name: 'Remo con barra', muscle: 'espalda', defaultSets: 4, defaultReps: 10, defaultWeight: '50', context: ['gimnasio'], requiredItems: ['barra'], level: 'Intermedio', description: 'Remo inclinado.', steps: ['Bisagra 45º', 'Agarra barra', 'Tira abdomen', 'Baja controlado'], mistakes: 'Torso erguido.', tip: 'Junta escápulas.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'gym_hack', name: 'Hack squat', muscle: 'piernas', defaultSets: 4, defaultReps: 10, defaultWeight: '60', context: ['gimnasio'], requiredItems: ['hack'], level: 'Intermedio', description: 'Sentadilla hack.', steps: ['Espalda apoyada', 'Pies plataforma', 'Baja controlado', 'Sube extendiendo'], mistakes: 'Talones despegados.', tip: 'Bueno para cuádriceps.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'gym_goblet', name: 'Goblet squat', muscle: 'piernas', defaultSets: 3, defaultReps: 12, defaultWeight: '16', context: ['gimnasio'], requiredItems: ['kettlebell'], level: 'Principiante', description: 'Sentadilla kettlebell.', steps: ['Kettlebell pecho', 'Pies al ancho', 'Baja controlado', 'Sube empujando'], mistakes: 'Torso inclinado.', tip: 'Codos entre rodillas.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'out_sprint', name: 'Sprints cuesta', muscle: 'cardio', defaultSets: 6, defaultReps: 1, defaultWeight: '0', context: ['fuera_de_casa'], requiredItems: ['cuesta'], level: 'Intermedio', description: 'Sprint pendiente.', steps: ['Calienta 5 min', 'Sprint 20-30m', 'Baja caminando', 'Repite'], mistakes: 'No calentar.', tip: 'Bueno para grasa.', imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400' },
  { id: 'out_fondos', name: 'Fondos banco parque', muscle: 'triceps', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['fuera_de_casa'], requiredItems: ['banco_publico'], level: 'Principiante', description: 'Fondos aire libre.', steps: ['Manos banco', 'Piernas extendidas', 'Baja codos', 'Sube'], mistakes: 'Codos abiertos.', tip: 'Talones al suelo.', imageUrl: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400' },
  { id: 'out_dominadas', name: 'Dominadas parque', muscle: 'espalda', defaultSets: 4, defaultReps: 6, defaultWeight: '0', context: ['fuera_de_casa'], requiredItems: ['barra_parque'], level: 'Intermedio', description: 'Dominadas outdoor.', steps: ['Agarre prono', 'Cuélgate', 'Tira barbilla', 'Baja controlado'], mistakes: 'Balanceo.', tip: 'Banda si no puedes.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'out_step', name: 'Step-ups escalón parque', muscle: 'piernas', defaultSets: 3, defaultReps: 12, defaultWeight: '0', context: ['fuera_de_casa'], requiredItems: ['escaleras_parque'], level: 'Principiante', description: 'Subida outdoor.', steps: ['Apoya pie', 'Sube empujando', 'Baja controlado', 'Alterna'], mistakes: 'Impulsarse.', tip: 'Controla bajada.', imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400' },
  { id: 'out_plancha', name: 'Plancha en arena', muscle: 'core', defaultSets: 3, defaultReps: 1, defaultWeight: '0', context: ['fuera_de_casa'], requiredItems: ['arena'], level: 'Intermedio', description: 'Plancha inestable.', steps: ['Antebrazos arena', 'Cuerpo recto', 'Abdomen contraído', 'Mantén'], mistakes: 'Cadera elevada.', tip: 'Aprieta core.', imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400' },
  { id: 'gym_curl_manc', name: 'Curl mancuernas', muscle: 'biceps', defaultSets: 3, defaultReps: 12, defaultWeight: '10', context: ['gimnasio'], requiredItems: ['mancuernas'], level: 'Principiante', description: 'Curl mancuernas.', steps: ['Mancuernas a los lados', 'Codos pegados', 'Sube girando', 'Baja controlado'], mistakes: 'Balanceo.', tip: 'Aprieta arriba.', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400' },
  { id: 'gym_press_hombros', name: 'Press hombros mancuernas', muscle: 'hombros', defaultSets: 4, defaultReps: 10, defaultWeight: '15', context: ['gimnasio'], requiredItems: ['mancuernas'], level: 'Intermedio', description: 'Press mancuernas.', steps: ['Sentado', 'Mancuernas a hombros', 'Empuja arriba', 'Baja controlado'], mistakes: 'Arquear lumbar.', tip: 'Core activo.', imageUrl: 'https://images.unsplash.com/photo-1532029837206-abbe2b76ad0e?w=400' },
];

// ALIMENTOS con campo "uses" para saber en qué recetas encajan
export const FOOD_DATABASE: Food[] = [
  // PROTEÍNAS SÓLIDAS (para plato, salteado)
  { id: 'pollo', name: 'Pechuga pollo', aliases: ['pollo'], category: 'proteina', kcal: 165, protein: 31, carbs: 0, fats: 3.6, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'ternera', name: 'Ternera magra', aliases: ['ternera'], category: 'proteina', kcal: 187, protein: 26, carbs: 0, fats: 9, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'pavo', name: 'Pavo', aliases: ['pavo'], category: 'proteina', kcal: 135, protein: 29, carbs: 0, fats: 1.7, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'cerdo', name: 'Lomo cerdo', aliases: ['cerdo'], category: 'proteina', kcal: 145, protein: 26, carbs: 0, fats: 4, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'atun', name: 'Atún natural', aliases: ['atun'], category: 'proteina', kcal: 116, protein: 26, carbs: 0, fats: 1, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'salmon', name: 'Salmón', aliases: ['salmon'], category: 'proteina', kcal: 208, protein: 20, carbs: 0, fats: 13, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'merluza', name: 'Merluza', aliases: ['merluza'], category: 'proteina', kcal: 90, protein: 18, carbs: 0, fats: 1, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'bacalao', name: 'Bacalao', aliases: ['bacalao'], category: 'proteina', kcal: 82, protein: 18, carbs: 0, fats: 0.7, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'gambas', name: 'Gambas', aliases: ['gambas'], category: 'proteina', kcal: 99, protein: 24, carbs: 0, fats: 0.3, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'huevo', name: 'Huevo', aliases: ['huevo'], category: 'proteina', kcal: 155, protein: 13, carbs: 1, fats: 11, unit: '100g', uses: ['plato', 'salteado', 'desayuno'] },
  { id: 'tofu', name: 'Tofu firme', aliases: ['tofu'], category: 'proteina', kcal: 144, protein: 15, carbs: 3, fats: 9, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'tempeh', name: 'Tempeh', aliases: ['tempeh'], category: 'proteina', kcal: 195, protein: 19, carbs: 8, fats: 11, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'lentejas', name: 'Lentejas', aliases: ['lentejas'], category: 'proteina', kcal: 116, protein: 9, carbs: 20, fats: 0.4, unit: '100g', uses: ['plato'] },
  { id: 'garbanzos', name: 'Garbanzos', aliases: ['garbanzos'], category: 'proteina', kcal: 164, protein: 8.9, carbs: 27, fats: 2.6, unit: '100g', uses: ['plato'] },
  // PROTEÍNAS PARA BATIDO (lácteas / polvo)
  { id: 'proteina_polvo', name: 'Proteína polvo', aliases: ['whey'], category: 'proteina', kcal: 400, protein: 80, carbs: 8, fats: 5, unit: '100g', uses: ['batido'] },

  // CARBOHIDRATOS
  { id: 'arroz', name: 'Arroz blanco', aliases: ['arroz'], category: 'carbo', kcal: 130, protein: 2.7, carbs: 28, fats: 0.3, unit: '100g', uses: ['plato'] },
  { id: 'arroz_int', name: 'Arroz integral', aliases: ['arroz int'], category: 'carbo', kcal: 123, protein: 2.7, carbs: 26, fats: 1, unit: '100g', uses: ['plato'] },
  { id: 'pasta', name: 'Pasta cocida', aliases: ['pasta'], category: 'carbo', kcal: 158, protein: 6, carbs: 31, fats: 0.9, unit: '100g', uses: ['plato'] },
  { id: 'pan_int', name: 'Pan integral', aliases: ['pan'], category: 'carbo', kcal: 247, protein: 13, carbs: 41, fats: 3.4, unit: '100g', uses: ['desayuno'] },
  { id: 'pan_blanco', name: 'Pan blanco', aliases: ['pan blanco'], category: 'carbo', kcal: 265, protein: 9, carbs: 49, fats: 3.2, unit: '100g', uses: ['desayuno'] },
  { id: 'avena', name: 'Avena', aliases: ['avena'], category: 'carbo', kcal: 389, protein: 17, carbs: 66, fats: 7, unit: '100g', uses: ['desayuno', 'batido'] },
  { id: 'muesli', name: 'Muesli', aliases: ['muesli'], category: 'carbo', kcal: 360, protein: 10, carbs: 66, fats: 5, unit: '100g', uses: ['desayuno'] },
  { id: 'patata', name: 'Patata', aliases: ['patata'], category: 'carbo', kcal: 87, protein: 2, carbs: 20, fats: 0.1, unit: '100g', uses: ['plato'] },
  { id: 'batata', name: 'Batata', aliases: ['batata'], category: 'carbo', kcal: 86, protein: 1.6, carbs: 20, fats: 0.1, unit: '100g', uses: ['plato'] },
  { id: 'quinoa', name: 'Quinoa', aliases: ['quinoa'], category: 'carbo', kcal: 120, protein: 4.4, carbs: 21, fats: 1.9, unit: '100g', uses: ['plato'] },
  { id: 'cuscus', name: 'Cuscús', aliases: ['cuscus'], category: 'carbo', kcal: 112, protein: 3.8, carbs: 23, fats: 0.2, unit: '100g', uses: ['plato'] },
  { id: 'bulgur', name: 'Bulgur', aliases: ['bulgur'], category: 'carbo', kcal: 83, protein: 3.1, carbs: 19, fats: 0.2, unit: '100g', uses: ['plato'] },
  { id: 'maiz', name: 'Maíz', aliases: ['maiz'], category: 'carbo', kcal: 86, protein: 3.3, carbs: 19, fats: 1.4, unit: '100g', uses: ['plato'] },
  { id: 'tortitas_arroz', name: 'Tortitas arroz', aliases: ['tortitas'], category: 'carbo', kcal: 387, protein: 8, carbs: 82, fats: 3, unit: '100g', uses: ['snack'] },
  { id: 'wrap', name: 'Tortilla wrap', aliases: ['wrap'], category: 'carbo', kcal: 290, protein: 8, carbs: 48, fats: 7, unit: '100g', uses: ['plato'] },

  // GRASAS
  { id: 'aceite', name: 'Aceite oliva', aliases: ['aceite'], category: 'grasa', kcal: 884, protein: 0, carbs: 0, fats: 100, unit: '100ml', uses: ['plato', 'salteado'] },
  { id: 'aceite_coco', name: 'Aceite coco', aliases: ['aceite coco'], category: 'grasa', kcal: 862, protein: 0, carbs: 0, fats: 100, unit: '100ml', uses: ['plato'] },
  { id: 'aguacate', name: 'Aguacate', aliases: ['aguacate'], category: 'grasa', kcal: 160, protein: 2, carbs: 9, fats: 15, unit: '100g', uses: ['plato', 'salteado', 'snack'] },
  { id: 'nueces', name: 'Nueces', aliases: ['nueces'], category: 'grasa', kcal: 654, protein: 15, carbs: 14, fats: 65, unit: '100g', uses: ['snack', 'desayuno'] },
  { id: 'almendras', name: 'Almendras', aliases: ['almendras'], category: 'grasa', kcal: 579, protein: 21, carbs: 22, fats: 50, unit: '100g', uses: ['snack', 'desayuno'] },
  { id: 'avellanas', name: 'Avellanas', aliases: ['avellanas'], category: 'grasa', kcal: 628, protein: 15, carbs: 17, fats: 61, unit: '100g', uses: ['snack'] },
  { id: 'pistachos', name: 'Pistachos', aliases: ['pistachos'], category: 'grasa', kcal: 562, protein: 20, carbs: 28, fats: 45, unit: '100g', uses: ['snack'] },
  { id: 'anacardos', name: 'Anacardos', aliases: ['anacardos'], category: 'grasa', kcal: 553, protein: 18, carbs: 30, fats: 44, unit: '100g', uses: ['snack'] },
  { id: 'cacahuete', name: 'Crema cacahuete', aliases: ['cacahuete'], category: 'grasa', kcal: 588, protein: 25, carbs: 20, fats: 50, unit: '100g', uses: ['batido', 'snack', 'desayuno'] },
  { id: 'chia', name: 'Chía', aliases: ['chia'], category: 'grasa', kcal: 486, protein: 17, carbs: 42, fats: 31, unit: '100g', uses: ['desayuno', 'snack'] },
  { id: 'lino', name: 'Lino', aliases: ['lino'], category: 'grasa', kcal: 534, protein: 18, carbs: 29, fats: 42, unit: '100g', uses: ['desayuno'] },
  { id: 'tahini', name: 'Tahini', aliases: ['tahini'], category: 'grasa', kcal: 595, protein: 17, carbs: 21, fats: 54, unit: '100g', uses: ['salteado'] },

  // VERDURAS
  { id: 'brocoli', name: 'Brócoli', aliases: ['brocoli'], category: 'verdura', kcal: 34, protein: 2.8, carbs: 7, fats: 0.4, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'espinaca', name: 'Espinacas', aliases: ['espinaca'], category: 'verdura', kcal: 23, protein: 2.9, carbs: 3.6, fats: 0.4, unit: '100g', uses: ['plato', 'salteado', 'smoothie'] },
  { id: 'tomate', name: 'Tomate', aliases: ['tomate'], category: 'verdura', kcal: 18, protein: 0.9, carbs: 3.9, fats: 0.2, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'lechuga', name: 'Lechuga', aliases: ['lechuga'], category: 'verdura', kcal: 15, protein: 1.4, carbs: 2.9, fats: 0.2, unit: '100g', uses: ['plato', 'salteado', 'smoothie'] },
  { id: 'zanahoria', name: 'Zanahoria', aliases: ['zanahoria'], category: 'verdura', kcal: 41, protein: 0.9, carbs: 10, fats: 0.2, unit: '100g', uses: ['plato', 'salteado', 'smoothie'] },
  { id: 'calabacin', name: 'Calabacín', aliases: ['calabacin'], category: 'verdura', kcal: 17, protein: 1.2, carbs: 3.1, fats: 0.3, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'pimiento', name: 'Pimiento', aliases: ['pimiento'], category: 'verdura', kcal: 31, protein: 1, carbs: 6, fats: 0.3, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'cebolla', name: 'Cebolla', aliases: ['cebolla'], category: 'verdura', kcal: 40, protein: 1.1, carbs: 9, fats: 0.1, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'ajo', name: 'Ajo', aliases: ['ajo'], category: 'verdura', kcal: 149, protein: 6.4, carbs: 33, fats: 0.5, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'pepino', name: 'Pepino', aliases: ['pepino'], category: 'verdura', kcal: 16, protein: 0.7, carbs: 3.6, fats: 0.1, unit: '100g', uses: ['plato', 'salteado', 'smoothie'] },
  { id: 'coliflor', name: 'Coliflor', aliases: ['coliflor'], category: 'verdura', kcal: 25, protein: 1.9, carbs: 5, fats: 0.3, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'judias_verdes', name: 'Judías verdes', aliases: ['judias'], category: 'verdura', kcal: 31, protein: 1.8, carbs: 7, fats: 0.1, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'berenjena', name: 'Berenjena', aliases: ['berenjena'], category: 'verdura', kcal: 25, protein: 1, carbs: 6, fats: 0.2, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'champinones', name: 'Champiñones', aliases: ['champiñones'], category: 'verdura', kcal: 22, protein: 3.1, carbs: 3.3, fats: 0.3, unit: '100g', uses: ['plato', 'salteado'] },
  { id: 'esparragos', name: 'Espárragos', aliases: ['esparragos'], category: 'verdura', kcal: 20, protein: 2.2, carbs: 3.9, fats: 0.1, unit: '100g', uses: ['plato', 'salteado'] },

  // FRUTAS
  { id: 'platano', name: 'Plátano', aliases: ['platano'], category: 'fruta', kcal: 89, protein: 1.1, carbs: 23, fats: 0.3, unit: '100g', uses: ['batido', 'snack', 'desayuno', 'smoothie'] },
  { id: 'manzana', name: 'Manzana', aliases: ['manzana'], category: 'fruta', kcal: 52, protein: 0.3, carbs: 14, fats: 0.2, unit: '100g', uses: ['snack', 'desayuno', 'smoothie'] },
  { id: 'naranja', name: 'Naranja', aliases: ['naranja'], category: 'fruta', kcal: 47, protein: 0.9, carbs: 12, fats: 0.1, unit: '100g', uses: ['snack', 'desayuno', 'smoothie', 'bebida'] },
  { id: 'fresas', name: 'Fresas', aliases: ['fresas'], category: 'fruta', kcal: 32, protein: 0.7, carbs: 7.7, fats: 0.3, unit: '100g', uses: ['batido', 'snack', 'desayuno', 'smoothie'] },
  { id: 'arandanos', name: 'Arándanos', aliases: ['arandanos'], category: 'fruta', kcal: 57, protein: 0.7, carbs: 14, fats: 0.3, unit: '100g', uses: ['batido', 'snack', 'desayuno', 'smoothie'] },
  { id: 'pera', name: 'Pera', aliases: ['pera'], category: 'fruta', kcal: 57, protein: 0.4, carbs: 15, fats: 0.1, unit: '100g', uses: ['snack', 'desayuno', 'smoothie'] },
  { id: 'kiwi', name: 'Kiwi', aliases: ['kiwi'], category: 'fruta', kcal: 61, protein: 1.1, carbs: 15, fats: 0.5, unit: '100g', uses: ['snack', 'desayuno', 'smoothie'] },
  { id: 'mango', name: 'Mango', aliases: ['mango'], category: 'fruta', kcal: 60, protein: 0.8, carbs: 15, fats: 0.4, unit: '100g', uses: ['batido', 'snack', 'smoothie'] },
  { id: 'pina', name: 'Piña', aliases: ['pina'], category: 'fruta', kcal: 50, protein: 0.5, carbs: 13, fats: 0.1, unit: '100g', uses: ['snack', 'smoothie'] },
  { id: 'melocoton', name: 'Melocotón', aliases: ['melocoton'], category: 'fruta', kcal: 39, protein: 0.9, carbs: 10, fats: 0.3, unit: '100g', uses: ['snack', 'smoothie'] },
  { id: 'uvas', name: 'Uvas', aliases: ['uvas'], category: 'fruta', kcal: 69, protein: 0.7, carbs: 18, fats: 0.2, unit: '100g', uses: ['snack'] },
  { id: 'limon', name: 'Limón', aliases: ['limon'], category: 'fruta', kcal: 29, protein: 1.1, carbs: 9, fats: 0.3, unit: '100g', uses: ['bebida'] },

  // LÁCTEOS (para batido, snack, desayuno)
  { id: 'yogur', name: 'Yogur griego', aliases: ['yogur'], category: 'lacteo', kcal: 97, protein: 9, carbs: 4, fats: 5, unit: '100g', uses: ['batido', 'snack', 'desayuno'] },
  { id: 'yogur_nat', name: 'Yogur natural', aliases: ['yogur nat'], category: 'lacteo', kcal: 61, protein: 3.5, carbs: 4.7, fats: 3.3, unit: '100g', uses: ['batido', 'snack', 'desayuno'] },
  { id: 'skyr', name: 'Skyr', aliases: ['skyr'], category: 'lacteo', kcal: 63, protein: 11, carbs: 4, fats: 0.2, unit: '100g', uses: ['batido', 'snack', 'desayuno'] },
  { id: 'kefir', name: 'Kéfir', aliases: ['kefir'], category: 'lacteo', kcal: 55, protein: 3.3, carbs: 4.5, fats: 3, unit: '100ml', uses: ['batido', 'desayuno'] },
  { id: 'leche', name: 'Leche semidesnatada', aliases: ['leche'], category: 'lacteo', kcal: 47, protein: 3.2, carbs: 4.8, fats: 1.6, unit: '100ml', uses: ['batido', 'desayuno'] },
  { id: 'queso_fresco', name: 'Queso fresco', aliases: ['queso'], category: 'lacteo', kcal: 78, protein: 12, carbs: 4, fats: 1.5, unit: '100g', uses: ['batido', 'snack'] },
  { id: 'mozzarella', name: 'Mozzarella', aliases: ['mozzarella'], category: 'lacteo', kcal: 254, protein: 18, carbs: 3, fats: 19, unit: '100g', uses: ['plato'] },
  { id: 'feta', name: 'Queso feta', aliases: ['feta'], category: 'lacteo', kcal: 264, protein: 14, carbs: 4, fats: 21, unit: '100g', uses: ['plato', 'salteado'] },

  // OTROS
  { id: 'cacao', name: 'Cacao puro', aliases: ['cacao'], category: 'otro', kcal: 228, protein: 20, carbs: 58, fats: 14, unit: '100g', uses: ['batido', 'desayuno'] },
  { id: 'miel', name: 'Miel', aliases: ['miel'], category: 'otro', kcal: 304, protein: 0.3, carbs: 82, fats: 0, unit: '100g', uses: ['desayuno', 'batido'] },
  { id: 'chocolate85', name: 'Chocolate negro 85%', aliases: ['chocolate'], category: 'otro', kcal: 592, protein: 10, carbs: 22, fats: 54, unit: '100g', uses: ['snack'] },
  { id: 'hummus', name: 'Hummus', aliases: ['hummus'], category: 'otro', kcal: 166, protein: 8, carbs: 14, fats: 10, unit: '100g', uses: ['snack', 'salteado'] },
  { id: 'jengibre', name: 'Jengibre', aliases: ['jengibre'], category: 'otro', kcal: 80, protein: 1.8, carbs: 18, fats: 0.8, unit: '100g', uses: ['bebida'] },
];

const STORAGE_PREFIX = 'fitapp_v20_';

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try { const s = localStorage.getItem(STORAGE_PREFIX + key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
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
  const bmr = isMale ? 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5 : 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
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
  if (/pollo|ternera|pavo|pescado|atun|salmon|merluza|bacalao|huevo|tofu|tempeh|gamba|lenteja|garbanzo|proteina|whey/.test(n)) return 'proteina';
  if (/arroz|pasta|pan|avena|patata|batata|quinoa|cuscus|bulgur|maiz|tortita|wrap|muesli/.test(n)) return 'carbo';
  if (/aceite|nuez|almendra|aguacate|cacahuete|chia|lino|tahini|pistacho|anacardo|avellana/.test(n)) return 'grasa';
  if (/lechuga|tomate|brocoli|espinaca|zanahoria|calabacin|pimiento|cebolla|ajo|pepino|coliflor|judia|berenjena|champi|esparrago/.test(n)) return 'verdura';
  if (/manzana|platano|naranja|fresa|arandano|pera|kiwi|mango|pina|melocoton|uva|limon/.test(n)) return 'fruta';
  if (/leche|yogur|queso|skyr|kefir|mozzarella|feta/.test(n)) return 'lacteo';
  return 'otro';
};

const searchFoods = (query: string): Food[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return FOOD_DATABASE.filter(f => f.name.toLowerCase().includes(q) || f.aliases.some(a => a.toLowerCase().includes(q))).slice(0, 5);
};

// PLANTILLAS DE RECETAS con lógica culinaria correcta
const RECIPE_TEMPLATES: Record<string, { use: FoodUse; name: string; icon: string; desc: string; neededCats: FoodCategory[] }> = {
  plato_proteina_carbo_verdura: { use: 'plato', name: 'Plato', icon: '🍽️', desc: 'Proteína con carbohidrato y verdura.', neededCats: ['proteina', 'carbo', 'verdura'] },
  plato_proteina_verdura: { use: 'plato', name: 'Salteado', icon: '🥗', desc: 'Salteado proteico con verduras.', neededCats: ['proteina', 'verdura'] },
  batido_proteico: { use: 'batido', name: 'Batido', icon: '🥤', desc: 'Batido proteico post-entreno.', neededCats: ['lacteo', 'fruta'] },
  batido_polvo: { use: 'batido', name: 'Batido proteico', icon: '🥤', desc: 'Batido con proteína en polvo.', neededCats: ['proteina', 'fruta'] },
  snack_yogur_fruta: { use: 'snack', name: 'Yogur con fruta', icon: '🍓', desc: 'Snack ligero con yogur.', neededCats: ['lacteo', 'fruta'] },
  snack_fruta_seco: { use: 'snack', name: 'Snack de fruta y frutos secos', icon: '🥜', desc: 'Snack energético.', neededCats: ['fruta', 'grasa'] },
  smoothie_verde: { use: 'smoothie', name: 'Smoothie verde', icon: '🥬', desc: 'Smoothie detox con verdura y fruta.', neededCats: ['verdura', 'fruta'] },
  desayuno_completo: { use: 'desayuno', name: 'Desayuno', icon: '🍳', desc: 'Desayuno completo con proteína y carbos.', neededCats: ['lacteo', 'carbo', 'fruta'] },
  bebida_infusion: { use: 'bebida', name: 'Infusión', icon: '🍵', desc: 'Bebida saludable refrescante.', neededCats: ['fruta'] },
};

// Genera una receta cogiendo solo alimentos que tengan el "use" requerido
const generateRecipe = (foods: Food[], templateKey: string, category: string): Recipe | null => {
  const tpl = RECIPE_TEMPLATES[templateKey];
  if (!tpl) return null;

  const candidates: Food[][] = tpl.neededCats.map(cat => 
    foods.filter(f => f.category === cat && f.uses.includes(tpl.use))
  );

  if (candidates.some(list => list.length === 0)) return null;

  const grams: Record<string, number> = { proteina: 150, carbo: 80, grasa: 15, verdura: 100, fruta: 100, lacteo: 150, otro: 20 };
  const chosen: { name: string; grams: number }[] = [];
  let kcal = 0, protein = 0, carbs = 0, fats = 0;

  tpl.neededCats.forEach((cat, i) => {
    const food = candidates[i][Math.floor(Math.random() * candidates[i].length)];
    const g = grams[cat] || 100;
    chosen.push({ name: food.name, grams: g });
    const f = g / 100;
    kcal += food.kcal * f; protein += food.protein * f; carbs += food.carbs * f; fats += food.fats * f;
  });

  const main = chosen[0].name.split(' ')[0];
  return {
    id: Math.random().toString(36).substring(2, 11),
    name: `${tpl.name} de ${main}`, category, ingredients: chosen,
    kcal: Math.round(kcal), protein: Math.round(protein), carbs: Math.round(carbs), fats: Math.round(fats),
    desc: tpl.desc, icon: tpl.icon,
  };
};

// Elige la mejor plantilla según la categoría de receta y los alimentos disponibles
const generateMeal = (foods: Food[], category: string): Recipe | null => {
  const templates: string[] = [];
  if (category === 'comida' || category === 'cena') {
    templates.push('plato_proteina_carbo_verdura', 'plato_proteina_verdura');
  } else if (category === 'desayuno') {
    templates.push('desayuno_completo', 'batido_proteico');
  } else if (category === 'snack') {
    templates.push('snack_yogur_fruta', 'snack_fruta_seco');
  } else if (category === 'batido') {
    templates.push('batido_proteico', 'batido_polvo');
  } else if (category === 'bebida') {
    templates.push('bebida_infusion');
  }
  for (const t of templates) {
    const r = generateRecipe(foods, t, category);
    if (r) return r;
  }
  return null;
};

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
  allFoods: Food[];
  hideFood: (id: string) => void;
  unhideFood: (id: string) => void;
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
  goal: 'ganar_musculo', context: 'casa',
  homeItems: ['silla', 'mesa', 'sofa', 'mochila', 'botellas'],
  weeklyRoutine: DEFAULT_ROUTINE,
  pantryIngredients: ['pollo', 'arroz', 'brocoli', 'avena', 'platano', 'huevo', 'aceite', 'tomate', 'yogur', 'espinaca', 'proteina_polvo'],
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
  const hideFood = (id: string) => updateProfile({ hiddenFoods: [...profile.hiddenFoods, id] });
  const unhideFood = (id: string) => updateProfile({ hiddenFoods: profile.hiddenFoods.filter(i => i !== id) });
  const hideHomeItem = (id: string) => updateProfile({ hiddenHomeItems: [...profile.hiddenHomeItems, id] });
  const unhideHomeItem = (id: string) => updateProfile({ hiddenHomeItems: profile.hiddenHomeItems.filter(i => i !== id) });
  const clearAllData = () => {
    Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX)).forEach(k => localStorage.removeItem(k));
    window.location.reload();
  };
  const allFoods = [...FOOD_DATABASE, ...customFoods].filter(f => profile.pantryIngredients.includes(f.id) && !profile.hiddenFoods.includes(f.id));
  const streak = calculateStreak(workoutLogs);
  return (
    <FitAppContext.Provider value={{
      profile, updateProfile, updateWeeklyRoutine, workoutLogs, saveWorkoutLog, streak,
      excludedExercises, excludeExercise, toggleHomeItem, customFoods, addCustomFood, allFoods,
      hideFood, unhideFood, hideHomeItem, unhideHomeItem, clearAllData,
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

const s = {
  container: { backgroundColor: '#000', color: '#f5f5f7', minHeight: '100vh', maxWidth: 480, margin: '0 auto', padding: 20, fontFamily: '-apple-system, sans-serif', paddingBottom: 110, boxSizing: 'border-box' as const },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, marginBottom: 20 },
  logo: { fontSize: 20, fontWeight: 900, background: 'linear-gradient(135deg, #fff 0%, #22d3ee 60%, #3b82f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
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
            <span style={{ fontSize: 10, color: '#22d3ee', fontWeight: 800 }}>{goalLabels[profile.goal].toUpperCase()}</span>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: '4px 0 0 0' }}>Hola, {profile.name}</h1>
          </div>
          <div style={{ background: 'rgba(249,115,22,0.15)', padding: '8px 12px', borderRadius: 14, color: '#fb923c', fontWeight: 900, fontSize: 12 }}>🔥 {streak}d</div>
        </div>
      </div>
      <div style={s.hero}>
        <span style={{ fontSize: 10, background: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: 20, fontWeight: 800 }}>{ctxLabels[profile.context]}</span>
        <h2 style={{ fontSize: 24, fontWeight: 900, margin: '12px 0 6px 0' }}>Sesión de hoy</h2>
        <p style={{ fontSize: 12, color: '#cffafe', margin: 0 }}>{todayW.length > 0 ? `⚡ ${todayW.length} series registradas hoy.` : `Ejercicios adaptados a los materiales que tengas marcados.`}</p>
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

const HomeInventoryView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { profile, toggleHomeItem, hideHomeItem, unhideHomeItem } = useFitApp();
  const ctxLabels: Record<ContextType, string> = { casa: '🏠 Mi Casa', gimnasio: '🏋️ Mi Gimnasio', fuera_de_casa: '🌳 Exterior' };
  const visibleItems = HOME_ITEMS_LIBRARY.filter(i => i.context === profile.context && !profile.hiddenHomeItems.includes(i.id));
  const hiddenItems = HOME_ITEMS_LIBRARY.filter(i => i.context === profile.context && profile.hiddenHomeItems.includes(i.id));
  const exercisesAvailable = MASTER_EXERCISES.filter(ex =>
    !profile.hiddenExercises.includes(ex.id) && ex.context.includes(profile.context) &&
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
        <div style={{ fontSize: 11, color: '#71717a', fontWeight: 800, marginBottom: 10 }}>DISPONIBLES ({visibleItems.length})</div>
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
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: isSelected ? '#22d3ee' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? '#000' : '#52525b', fontSize: 11, fontWeight: 900 }}>{isSelected ? '✓' : ''}</div>
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
            <button key={item.id} onClick={() => unhideHomeItem(item.id)} style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.03)', border: 'none', color: '#a1a1aa', padding: 10, borderRadius: 12, fontSize: 12, marginBottom: 6, cursor: 'pointer', textAlign: 'left' }}>{item.icon} {item.name}</button>
          ))}
        </div>
      )}
    </div>
  );
};

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
            <button onClick={() => updateWeeklyRoutine(routine.map((d, idx) => idx === i ? { ...d, isRestDay: !d.isRestDay, muscles: !d.isRestDay ? [] : d.muscles } : d))} style={{ background: day.isRestDay ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.05)', border: day.isRestDay ? '1px solid rgba(34,211,238,0.5)' : '1px solid rgba(255,255,255,0.08)', color: day.isRestDay ? '#22d3ee' : '#71717a', padding: '5px 10px', borderRadius: 10, fontSize: 10, fontWeight: 800, cursor: 'pointer' }}>{day.isRestDay ? '💤 DESCANSO' : '🏋️ ENTRENO'}</button>
          </div>
          {!day.isRestDay && (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                {muscles.map(m => {
                  const sel = day.muscles.includes(m);
                  return <button key={m} onClick={() => updateWeeklyRoutine(routine.map((d, idx) => idx === i ? { ...d, muscles: sel ? d.muscles.filter(x => x !== m) : [...d.muscles, m] } : d))} style={{ padding: '6px 10px', borderRadius: 10, fontSize: 11, fontWeight: 800, border: sel ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)', background: sel ? 'rgba(34,211,238,0.15)' : 'rgba(0,0,0,0.4)', color: sel ? '#22d3ee' : '#71717a', cursor: 'pointer' }}>{sel ? `✓ ${m}` : m}</button>;
                })}
              </div>
              {day.muscles.length > 0 && <button onClick={() => onStartForDay(day.muscles)} style={{ ...s.btnCyan, padding: 12, fontSize: 12 }}>🚀 ENTRENAR</button>}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

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
      selMuscles.includes(ex.muscle) && !profile.hiddenExercises.includes(ex.id) &&
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
            return <button key={m.k} onClick={() => setSelMuscles(prev => sel ? prev.filter(x => x !== m.k) : [...prev, m.k])} style={{ padding: '10px 12px', borderRadius: 12, border: sel ? '2px solid #22d3ee' : '1px solid rgba(255,255,255,0.08)', background: sel ? 'rgba(34,211,238,0.15)' : 'rgba(0,0,0,0.4)', color: sel ? '#22d3ee' : '#fff', fontWeight: 800, fontSize: 12, cursor: 'pointer' }}>{sel ? `✓ ${m.l}` : m.l}</button>;
          })}
        </div>
        <button onClick={handleStart} style={s.btnCyan}>GENERAR SESIÓN</button>
      </div>
    </div>
  );
};

const Preview: React.FC<{ exercises: Exercise[]; time: number; onStart: (e: Exercise[]) => void; onBack: () => void }> = ({ exercises, time, onStart, onBack }) => {
  const { excludeExercise, excludedExercises, profile } = useFitApp();
  const [list, setList] = useState(exercises);
  const [showTut, setShowTut] = useState<number | null>(null);
  const swap = (idx: number) => {
    const cur = list[idx];
    excludeExercise(cur.name);
    const alts = MASTER_EXERCISES.filter(ex =>
      ex.muscle === cur.muscle && !list.some(i => i.id === ex.id) &&
      !excludedExercises.includes(ex.name) && ex.context.includes(profile.context) &&
      (ex.requiredItems.length === 0 || ex.requiredItems.every(i => profile.homeItems.includes(i)))
    );
    if (alts.length > 0) { const upd = [...list]; upd[idx] = alts[Math.floor(Math.random() * alts.length)]; setList(upd); }
    else alert('No hay más alternativas.');
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
          <div style={{ fontSize: 12, color: '#d4d4d8', background: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 10, marginBottom: 8 }}><strong>{ex.defaultSets}</strong> series × <strong>{ex.defaultReps}</strong> reps</div>
          <button onClick={() => setShowTut(showTut === i ? null : i)} style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee', padding: '8px 12px', borderRadius: 10, fontSize: 11, fontWeight: 800, cursor: 'pointer', width: '100%' }}>{showTut === i ? '▲ Ocultar tutorial' : '❓ Cómo se hace'}</button>
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

const PantryView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { profile, updateProfile, customFoods, addCustomFood, hideFood, unhideFood } = useFitApp();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [nf, setNf] = useState({ name: '', category: 'proteina' as FoodCategory, kcal: '', protein: '', carbs: '', fats: '' });
  const suggestions = searchFoods(search).filter(f => !profile.hiddenFoods.includes(f.id));
  const pantryFoods: Food[] = [...FOOD_DATABASE, ...customFoods].filter(f => profile.pantryIngredients.includes(f.id) && !profile.hiddenFoods.includes(f.id));
  const hiddenFoods = [...FOOD_DATABASE, ...customFoods].filter(f => profile.hiddenFoods.includes(f.id));
  const addFromDB = (f: Food) => { if (!profile.pantryIngredients.includes(f.id)) updateProfile({ pantryIngredients: [...profile.pantryIngredients, f.id] }); setSearch(''); };
  const addManual = () => {
    if (!nf.name.trim()) return;
    const cat = guessCategory(nf.name);
    const def = CATEGORY_DEFAULTS[nf.category || cat];
    const usesForCat: FoodUse[] = nf.category === 'proteina' ? ['plato', 'salteado'] : nf.category === 'carbo' ? ['plato', 'desayuno'] : nf.category === 'grasa' ? ['snack', 'plato'] : nf.category === 'verdura' ? ['plato', 'salteado'] : nf.category === 'fruta' ? ['snack', 'batido', 'desayuno'] : nf.category === 'lacteo' ? ['batido', 'desayuno', 'snack'] : ['plato'];
    const food: Food = {
      id: 'custom_' + Math.random().toString(36).substring(2, 11), name: nf.name.trim(),
      aliases: [nf.name.toLowerCase().trim()], category: nf.category || cat,
      kcal: Number(nf.kcal) || def.kcal, protein: Number(nf.protein) || def.protein,
      carbs: Number(nf.carbs) || def.carbs, fats: Number(nf.fats) || def.fats, unit: '100g',
      uses: usesForCat,
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
        <input type="text" placeholder="Ej: pollo..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...s.input, marginBottom: 0 }} />
        {suggestions.length > 0 && (
          <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {suggestions.map(f => {
              const already = profile.pantryIngredients.includes(f.id);
              return (
                <div key={f.id} onClick={() => !already && addFromDB(f)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: already ? 'rgba(34,211,238,0.05)' : 'rgba(0,0,0,0.4)', borderRadius: 12, cursor: already ? 'default' : 'pointer', opacity: already ? 0.5 : 1 }}>
                  <div><div style={{ fontSize: 12, fontWeight: 800 }}>{f.name}</div><div style={{ fontSize: 10, color: '#71717a' }}>{f.kcal} kcal · {f.protein}P · {f.carbs}C · {f.fats}G</div></div>
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
            <div style={{ fontSize: 10, color: '#71717a', fontStyle: 'italic', marginBottom: 8 }}>Macros opcionales.</div>
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
            <button key={f.id} onClick={() => unhideFood(f.id)} style={{ display: 'block', width: '100%', background: 'rgba(255,255,255,0.03)', border: 'none', color: '#a1a1aa', padding: 10, borderRadius: 12, fontSize: 11, marginBottom: 6, cursor: 'pointer', textAlign: 'left' }}>{f.name} — restaurar</button>
          ))}
        </div>
      )}
    </div>
  );
};

const RecipesView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { allFoods } = useFitApp();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [cat, setCat] = useState('comida');
  const cats = [{ k: 'desayuno', l: '🍳 Desayuno' }, { k: 'comida', l: '🍽️ Comida' }, { k: 'cena', l: '🌙 Cena' }, { k: 'snack', l: '🥨 Snack' }, { k: 'batido', l: '🥤 Batido' }, { k: 'bebida', l: '💧 Bebida' }];
  const gen = () => {
    if (allFoods.length === 0) { alert('Añade alimentos.'); return; }
    const r: Recipe[] = [];
    for (let i = 0; i < 3; i++) { const rec = generateMeal(allFoods, cat); if (rec && !r.some(x => x.name === rec.name)) r.push(rec); }
    if (r.length === 0) { alert('Faltan alimentos de las categorías necesarias para este tipo de receta.'); return; }
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

const WeeklyMenuView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { allFoods, profile } = useFitApp();
  const [menu, setMenu] = useState<WeeklyMenuDay[]>([]);
  const target = calculateTargetKcal(profile);
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const gen = () => {
    if (allFoods.length < 3) { alert('Añade más alimentos.'); return; }
    const w: WeeklyMenuDay[] = days.map(d => ({
      dayName: d,
      meals: { desayuno: generateMeal(allFoods, 'desayuno'), comida: generateMeal(allFoods, 'comida'), cena: generateMeal(allFoods, 'cena'), snack: generateMeal(allFoods, 'snack') },
    }));
    setMenu(w);
  };
  const regen = (i: number, k: string) => {
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
        <div style={{ fontSize: 10, color: '#71717a', marginTop: 10, fontStyle: 'italic' }}>Al cambiar el contexto, materiales y ejercicios se adaptan.</div>
      </div>
      <div style={s.card}>
        <div style={{ fontSize: 12, fontWeight: 900, marginBottom: 10 }}>🗑️ Datos</div>
        <button onClick={() => { if (confirm('¿Borrar TODOS tus datos?')) clearAllData(); }} style={s.btnDanger}>Borrar todos mis datos</button>
      </div>
      <p style={{ fontSize: 10, color: '#52525b', textAlign: 'center' }}>🔒 Datos guardados solo en este dispositivo.</p>
    </div>
  );
};

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
        <span style={s.badge}>v10.1 RECETAS OK</span>
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
