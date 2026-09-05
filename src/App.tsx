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
  name: 'Atleta FitApp',
  age: 28,
  gender: 'Hombre',
  height: 178,
  weight: 75,
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
    const saved = localStorage.getItem('fitapp_profile');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogRecord[]>(() => {
    const saved = localStorage.getItem('fitapp_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(() => {
    const saved = localStorage.getItem('fitapp_measurements');
    return saved ? JSON.parse(saved) : [{ date: new Date().toISOString().split('T')[0], weight: defaultProfile.weight }];
  });

  const [excludedExercises, setExcludedExercises] = useState<string[]>(() => {
    const saved = localStorage.getItem('fitapp_excluded');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('fitapp_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('fitapp_logs', JSON.stringify(workoutLogs)); }, [workoutLogs]);
  useEffect(() => { localStorage.setItem('fitapp_measurements', JSON.stringify(measurements)); }, [measurements]);
  useEffect(() => { localStorage.setItem('fitapp_excluded', JSON.stringify(excludedExercises)); }, [excludedExercises]);

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
  const streak = uniqueDays > 0 ? uniqueDays : 0;

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
// 4. COMPONENTES DE UI
// ==========================================

const Navigation: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: '🏠' },
    { id: 'train', label: 'Entrenar', icon: '⚡' },
    { id: 'nutrition', label: 'Nutrición', icon: '🥗' },
    { id: 'progress', label: 'Progreso', icon: '📈' },
    { id: 'profile', label: 'Perfil', icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 flex justify-around items-center py-3 z-50 max-w-md mx-auto">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 text-xs font-medium transition-colors ${
              isActive ? 'text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const Dashboard: React.FC<{ onStartWorkout: () => void; onGoToNutrition: () => void }> = ({ onStartWorkout, onGoToNutrition }) => {
  const { profile, streak, workoutLogs } = useFitApp();
  const todayStr = new Date().toISOString().split('T')[0];
  const todayWorkouts = workoutLogs.filter(l => l.date === todayStr);

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center bg-zinc-900 p-5 rounded-2xl border border-zinc-800">
        <div>
          <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">Panel Principal</span>
          <h1 className="text-xl font-bold text-white">Hola, {profile.name} 👋</h1>
        </div>
        <div className="bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700 flex items-center gap-1.5 text-xs text-orange-400 font-bold">
          <span>🔥</span> {streak} días racha
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-950/40 to-zinc-900 p-5 rounded-2xl border border-cyan-800/40 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs text-cyan-400 font-semibold uppercase">Sesión de Hoy</span>
            <h2 className="text-lg font-bold text-white mt-0.5">Enfoque: {profile.goal.replace('_', ' ').toUpperCase()}</h2>
          </div>
          <span className="text-xs bg-cyan-950 text-cyan-300 border border-cyan-700 px-2.5 py-1 rounded-full uppercase">
            {profile.context}
          </span>
        </div>

        <p className="text-xs text-zinc-300">
          {todayWorkouts.length > 0 
            ? `✅ ¡Ya has completado ${todayWorkouts.length} ejercicio(s) hoy!` 
            : 'Tienes tu rutina lista para arrancar con selector muscular o modo exprés.'}
        </p>

        <button
          onClick={onStartWorkout}
          className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <span>⚡ Empezar Entrenamiento</span>
        </button>
      </div>

      <div className="bg-zinc-900 p-5 rounded-2xl border border-zinc-800 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">🥗 Nutrición Diaria</h3>
          <button onClick={onGoToNutrition} className="text-xs text-cyan-400 hover:underline">Ver menú ➔</button>
        </div>
        <p className="text-xs text-zinc-400">Plan adaptado a tus restricciones ({profile.allergies.length > 0 ? profile.allergies.join(', ') : 'Sin restricciones'}).</p>
      </div>
    </div>
  );
};

const WorkoutView: React.FC<{ onSelectExerciseToPlay: (exercises: Exercise[]) => void }> = ({ onSelectExerciseToPlay }) => {
  const { excludedExercises, excludeExercise } = useFitApp();

  const muscles = [
    { key: 'pecho', label: '🦾 Pecho', desc: 'Press y aperturas' },
    { key: 'espalda', label: '🦇 Espalda', desc: 'Dominadas y remos' },
    { key: 'hombros', label: '🛡️ Hombros', desc: 'Press y laterales' },
    { key: 'piernas', label: '🦵 Piernas', desc: 'Sentadillas y prensa' },
    { key: 'abdomen', label: '⚡ Abdomen', desc: 'Core y planchas' },
    { key: 'cardio', label: '🏃‍♂️ Cardio', desc: 'Resistencia e HIIT' }
  ];

  const handleStartMuscleRoutine = (muscleKey: string) => {
    const filtered = MASTER_EXERCISES.filter(ex => ex.muscle === muscleKey && !excludedExercises.includes(ex.name));
    if (filtered.length === 0) {
      alert('No hay ejercicios disponibles para este grupo muscular con tus filtros actuales.');
      return;
    }
    onSelectExerciseToPlay(filtered);
  };

  const handleStartFullRoutine = () => {
    const filtered = MASTER_EXERCISES.filter(ex => !excludedExercises.includes(ex.name));
    onSelectExerciseToPlay(filtered.slice(0, 4));
  };

  return (
    <div className="space-y-6 pb-24">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white">Centro de Entrenamiento</h1>
          <p className="text-xs text-zinc-400">Elige un grupo muscular o arranca rutina.</p>
        </div>
        <button
          onClick={handleStartFullRoutine}
          className="px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold rounded-xl"
        >
          ⚡ Rutina Exprés
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {muscles.map(m => (
          <button
            key={m.key}
            onClick={() => handleStartMuscleRoutine(m.key)}
            className="bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 p-4 rounded-xl text-left transition-all flex flex-col gap-1 group"
          >
            <span className="text-base font-bold text-white group-hover:text-cyan-400">{m.label}</span>
            <span className="text-xs text-zinc-400">{m.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const ActiveWorkoutPlayer: React.FC<{ exercises: Exercise[]; onFinish: () => void }> = ({ exercises, onFinish }) => {
  const { saveWorkoutLog, excludeExercise } = useFitApp();
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
    <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-5 pb-24 max-w-md mx-auto">
      {isResting && (
        <div className="bg-cyan-950/60 border border-cyan-500/50 p-4 rounded-xl text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold">Descanso</span>
          <div className="text-4xl font-extrabold text-white">0:{restTime < 10 ? `0${restTime}` : restTime}</div>
          <button onClick={() => { setIsResting(false); setRestTime(0); }} className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-lg">Saltar</button>
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-zinc-400 font-semibold">
        <span>Ejercicio {currentIndex + 1} de {exercises.length}</span>
        <span className="text-cyan-400">Serie {currentSet} / {currentEx.defaultSets}</span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white">{currentEx.name}</h2>
        <span className="text-xs text-zinc-500 uppercase">Músculo: {currentEx.muscle}</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Peso (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white outline-none" />
        </div>
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Repeticiones</label>
          <input type="number" value={reps} onChange={e => setReps(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white outline-none" />
        </div>
      </div>

      <button onClick={handleCompleteSet} disabled={isResting} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all">
        ✓ Registrar Serie y Descansar
      </button>

      <button onClick={onFinish} className="w-full py-2 bg-zinc-800 text-zinc-300 text-xs rounded-xl">Finalizar Sesión</button>
    </div>
  );
};

const NutritionView: React.FC = () => {
  const { profile, updateProfile } = useFitApp();
  const [newAllergy, setNewAllergy] = useState('');

  const handleAddAllergy = (e: React.FormEvent) => {
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
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-bold text-white">Nutrición y Menús</h1>
        <p className="text-xs text-zinc-400">Alimentación adaptada a tus restricciones.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
        <h3 className="text-sm font-bold text-white">⚠️ Alergias y Restricciones</h3>
        <form onSubmit={handleAddAllergy} className="flex gap-2">
          <input type="text" placeholder="Ej: lactosa..." value={newAllergy} onChange={e => setNewAllergy(e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
          <button type="submit" className="px-4 py-2 bg-cyan-600 text-white text-xs font-bold rounded-xl">Añadir</button>
        </form>
        <div className="flex flex-wrap gap-2">
          {profile.allergies.map(a => (
            <span key={a} className="bg-amber-950/40 text-amber-300 text-xs px-2.5 py-1 rounded-lg">
              {a} <button onClick={() => updateProfile({ allergies: profile.allergies.filter(item => item !== a) })}>×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {safeMeals.map(meal => (
          <div key={meal.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
            <span className="text-[10px] text-cyan-400 uppercase font-bold">{meal.category}</span>
            <h4 className="text-sm font-bold text-white mt-1">{meal.name}</h4>
            <p className="text-xs text-zinc-400">{meal.calories} kcal • {meal.protein}g proteína</p>
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
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-bold text-white">Progreso</h1>
        <p className="text-xs text-zinc-400">Evolución de peso y constancia.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <span className="text-xs text-zinc-400">Racha</span>
          <div className="text-2xl font-black text-orange-400 mt-1">🔥 {streak} días</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
          <span className="text-xs text-zinc-400">Sesiones</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">⚡ {workoutLogs.length}</div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
        <h3 className="text-sm font-bold text-white">Registrar Peso</h3>
        <form onSubmit={e => { e.preventDefault(); const w = Number(weightInput); if(w) { addMeasurement(w); setWeightInput(''); }}} className="flex gap-2">
          <input type="number" step="0.1" placeholder="Ej: 75 kg" value={weightInput} onChange={e => setWeightInput(e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white outline-none" />
          <button type="submit" className="px-4 py-2 bg-cyan-600 text-white text-xs font-bold rounded-xl">Guardar</button>
        </form>
      </div>
    </div>
  );
};

const ProfileView: React.FC = () => {
  const { profile, updateProfile } = useFitApp();
  const [name, setName] = useState(profile.name);

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-bold text-white">Perfil</h1>
      </div>
      <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-4">
        <div>
          <label className="text-xs text-zinc-400 block mb-1">Nombre</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none" />
        </div>
        <button onClick={() => { updateProfile({ name }); alert('Actualizado'); }} className="w-full py-3 bg-cyan-600 text-white font-bold rounded-xl text-xs">Guardar</button>
      </div>
    </div>
  );
};

// ==========================================
// 5. COMPONENTE PRINCIPAL APP
// ==========================================
function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeWorkoutExercises, setActiveWorkoutExercises] = useState<Exercise[] | null>(null);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 max-w-md mx-auto relative flex flex-col">
      <header className="py-4 border-b border-zinc-900 mb-4 flex justify-between items-center">
        <span className="text-base font-black text-cyan-400 tracking-wider">FITAPP PRO</span>
        <span className="text-[10px] bg-zinc-900 text-emerald-400 border border-zinc-800 px-2.5 py-1 rounded-full font-bold">● Local Standalone</span>
      </header>

      <main className="flex-1">
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

      {!activeWorkoutExercises && <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />}
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
