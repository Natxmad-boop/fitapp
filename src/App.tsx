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
    const saved = localStorage.getItem('fitapp_profile_v2');
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLogRecord[]>(() => {
    const saved = localStorage.getItem('fitapp_logs_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(() => {
    const saved = localStorage.getItem('fitapp_measurements_v2');
    return saved ? JSON.parse(saved) : [{ date: new Date().toISOString().split('T')[0], weight: defaultProfile.weight }];
  });

  const [excludedExercises, setExcludedExercises] = useState<string[]>(() => {
    const saved = localStorage.getItem('fitapp_excluded_v2');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('fitapp_profile_v2', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('fitapp_logs_v2', JSON.stringify(workoutLogs)); }, [workoutLogs]);
  useEffect(() => { localStorage.setItem('fitapp_measurements_v2', JSON.stringify(measurements)); }, [measurements]);
  useEffect(() => { localStorage.setItem('fitapp_excluded_v2', JSON.stringify(excludedExercises)); }, [excludedExercises]);

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
  const streak = uniqueDays > 0 ? uniqueDays : 3; // Estética motivacional comercial por defecto

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
// 4. COMPONENTES DE UI COMERCIALES
// ==========================================

const Navigation: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Inicio', icon: '⚡' },
    { id: 'train', label: 'Entrenar', icon: '🔥' },
    { id: 'nutrition', label: 'Nutrición', icon: '🥗' },
    { id: 'progress', label: 'Progreso', icon: '📈' },
    { id: 'profile', label: 'Perfil', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/90 backdrop-blur-xl border-t border-zinc-800/80 flex justify-around items-center py-3.5 z-50 max-w-md mx-auto shadow-2xl">
      {tabs.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-all duration-300 ${
              isActive ? 'text-cyan-400 scale-105 font-bold drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
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
    <div className="space-y-6 pb-28 animate-fadeIn">
      {/* Header Comercial */}
      <div className="relative overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-900 to-cyan-950/40 p-6 rounded-3xl border border-zinc-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex justify-between items-center relative z-10">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-cyan-400 font-extrabold bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-800/50">PRO MEMBER</span>
            <h1 className="text-2xl font-black text-white mt-2 tracking-tight">Hola, {profile.name} ✨</h1>
          </div>
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 px-3.5 py-2 rounded-2xl border border-orange-500/30 flex items-center gap-1.5 text-xs text-orange-400 font-black shadow-inner">
            <span className="text-sm">🔥</span> {streak} DÍAS
          </div>
        </div>
      </div>

      {/* Banner Principal de Entrenamiento */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-900 p-6 rounded-3xl shadow-xl shadow-cyan-500/20 text-white space-y-4">
        <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex justify-between items-start relative z-10">
          <div>
            <span className="text-xs bg-black/20 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-wider font-semibold text-cyan-200 border border-white/10">
              Objetivo: {profile.goal.replace('_', ' ')}
            </span>
            <h2 className="text-2xl font-black mt-2 tracking-tight">Sesión del Día</h2>
          </div>
        </div>

        <p className="text-xs text-cyan-100/90 leading-relaxed relative z-10">
          {todayWorkouts.length > 0 
            ? `⚡ ¡Excelente trabajo! Has completado ${todayWorkouts.length} bloque(s) hoy.` 
            : 'Tu motor adaptativo ha preparado una sesión óptima según tu recuperación.'}
        </p>

        <button
          onClick={onStartWorkout}
          className="w-full py-4 bg-white text-zinc-950 font-black rounded-2xl shadow-xl hover:bg-cyan-50 transition-all duration-300 flex items-center justify-center gap-2 text-sm tracking-wide transform active:scale-95"
        >
          <span>🚀 EMPEZAR ENTRENAMIENTO</span>
        </button>
      </div>

      {/* Sección Nutrición Rápida */}
      <div onClick={onGoToNutrition} className="bg-zinc-900/80 backdrop-blur-md p-5 rounded-3xl border border-zinc-800/80 hover:border-cyan-500/50 transition-all cursor-pointer shadow-xl flex items-center justify-between group">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🥗</span>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">Nutrición & Menú Inteligente</h3>
          </div>
          <p className="text-xs text-zinc-400">Filtro activo para alergias ({profile.allergies.length > 0 ? profile.allergies.join(', ') : 'Ninguna'}).</p>
        </div>
        <span className="text-zinc-500 group-hover:text-cyan-400 transition-colors text-lg font-bold">➔</span>
      </div>
    </div>
  );
};

const WorkoutView: React.FC<{ onSelectExerciseToPlay: (exercises: Exercise[]) => void }> = ({ onSelectExerciseToPlay }) => {
  const { excludedExercises } = useFitApp();

  const muscles = [
    { key: 'pecho', label: '🦾 Pecho', desc: 'Fuerza y volumen', gradient: 'from-blue-600/20 to-cyan-600/20', border: 'border-blue-500/30' },
    { key: 'espalda', label: '🦇 Espalda', desc: 'Anchura y densidad', gradient: 'from-purple-600/20 to-indigo-600/20', border: 'border-purple-500/30' },
    { key: 'hombros', label: '🛡️ Hombros', desc: 'Definición 3D', gradient: 'from-pink-600/20 to-rose-600/20', border: 'border-pink-500/30' },
    { key: 'piernas', label: '🦵 Piernas', desc: 'Potencia y tren inferior', gradient: 'from-amber-600/20 to-orange-600/20', border: 'border-amber-500/30' },
    { key: 'abdomen', label: '⚡ Abdomen', desc: 'Core blindado', gradient: 'from-emerald-600/20 to-teal-600/20', border: 'border-emerald-500/30' },
    { key: 'cardio', label: '🏃‍♂️ Cardio', desc: 'HIIT & Resistencia', gradient: 'from-cyan-600/20 to-blue-600/20', border: 'border-cyan-500/30' }
  ];

  const handleStartMuscleRoutine = (muscleKey: string) => {
    const filtered = MASTER_EXERCISES.filter(ex => ex.muscle === muscleKey && !excludedExercises.includes(ex.name));
    if (filtered.length === 0) {
      alert('No hay ejercicios disponibles para este grupo con tus filtros actuales.');
      return;
    }
    onSelectExerciseToPlay(filtered);
  };

  const handleStartFullRoutine = () => {
    const filtered = MASTER_EXERCISES.filter(ex => !excludedExercises.includes(ex.name));
    onSelectExerciseToPlay(filtered.slice(0, 4));
  };

  return (
    <div className="space-y-6 pb-28 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[11px] font-extrabold text-cyan-400 tracking-wider uppercase">Motor de Fuerza</span>
          <h1 className="text-2xl font-black text-white tracking-tight">Centro de Entrenamiento</h1>
        </div>
        <button
          onClick={handleStartFullRoutine}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black rounded-2xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
        >
          ⚡ Rutina Exprés
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {muscles.map(m => (
          <button
            key={m.key}
            onClick={() => handleStartMuscleRoutine(m.key)}
            className={`bg-gradient-to-br ${m.gradient} bg-zinc-900 border ${m.border} p-4 rounded-3xl text-left transition-all duration-300 hover:scale-[1.02] flex flex-col justify-between h-32 shadow-xl group`}
          >
            <span className="text-xl font-bold group-hover:scale-110 transition-transform origin-left">{m.label}</span>
            <div>
              <span className="text-[11px] text-zinc-300 font-medium block">{m.desc}</span>
              <span className="text-[10px] text-cyan-400 font-bold mt-1 inline-block">Iniciar sesión ➔</span>
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
        alert('🏆 ¡Entrenamiento completado con éxito!');
        onFinish();
      }
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-3xl space-y-6 pb-28 max-w-md mx-auto shadow-2xl animate-fadeIn">
      {isResting && (
        <div className="bg-cyan-950/80 border border-cyan-500/50 p-5 rounded-3xl text-center space-y-3 backdrop-blur-xl animate-pulse">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-black">⏸ Descanso Activo</span>
          <div className="text-5xl font-black text-white">0:{restTime < 10 ? `0${restTime}` : restTime}</div>
          <button onClick={() => { setIsResting(false); setRestTime(0); }} className="text-xs bg-zinc-800 text-zinc-300 px-4 py-1.5 rounded-full font-bold hover:bg-zinc-700">
            Saltar descanso ⏭
          </button>
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-zinc-400 font-bold uppercase tracking-wider">
        <span>Ejercicio {currentIndex + 1} / {exercises.length}</span>
        <span className="text-cyan-400 bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-800/40">Serie {currentSet} de {currentEx.defaultSets}</span>
      </div>

      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">{currentEx.name}</h2>
        <span className="text-xs text-cyan-400 font-semibold uppercase tracking-widest mt-1 block">Grupo: {currentEx.muscle}</span>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-zinc-400 font-bold block mb-1.5">Peso aplicado (kg)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white font-bold text-lg outline-none focus:border-cyan-500 transition-colors" />
        </div>
        <div>
          <label className="text-xs text-zinc-400 font-bold block mb-1.5">Repeticiones</label>
          <input type="number" value={reps} onChange={e => setReps(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-white font-bold text-lg outline-none focus:border-cyan-500 transition-colors" />
        </div>
      </div>

      <button onClick={handleCompleteSet} disabled={isResting} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 transition-all text-sm tracking-wide">
        ✓ REGISTRAR SERIE Y DESCANSAR
      </button>

      <button onClick={onFinish} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-bold rounded-2xl transition-colors">
        Finalizar sesión antes de tiempo
      </button>
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
    <div className="space-y-6 pb-28 animate-fadeIn">
      <div>
        <span className="text-[11px] font-extrabold text-cyan-400 tracking-wider uppercase">Planificación</span>
        <h1 className="text-2xl font-black text-white tracking-tight">Nutrición & Menús</h1>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-3xl space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">⚠️ Restricciones y Alergias</h3>
        <form onSubmit={handleAddAllergy} className="flex gap-2">
          <input type="text" placeholder="Ej: lactosa, frutos secos..." value={newAllergy} onChange={e => setNewAllergy(e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500" />
          <button type="submit" className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black text-xs rounded-2xl transition-all">Añadir</button>
        </form>
        <div className="flex flex-wrap gap-2">
          {profile.allergies.map(a => (
            <span key={a} className="bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-2">
              {a} <button onClick={() => updateProfile({ allergies: profile.allergies.filter(item => item !== a) })} className="font-bold text-amber-400 hover:text-white">×</button>
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-zinc-300">Menús Optimizados</h3>
        {safeMeals.map(meal => (
          <div key={meal.id} className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-3xl shadow-xl flex justify-between items-center group hover:border-cyan-500/40 transition-all">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/30">{meal.category}</span>
              <h4 className="text-sm font-bold text-white mt-1 group-hover:text-cyan-300 transition-colors">{meal.name}</h4>
              <p className="text-xs text-zinc-400 font-medium">{meal.calories} kcal • {meal.protein}g proteína</p>
            </div>
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
    <div className="space-y-6 pb-28 animate-fadeIn">
      <div>
        <span className="text-[11px] font-extrabold text-cyan-400 tracking-wider uppercase">Analytics</span>
        <h1 className="text-2xl font-black text-white tracking-tight">Progreso & Racha</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-amber-950/30 to-zinc-900 border border-amber-500/30 p-5 rounded-3xl shadow-xl">
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Racha Constante</span>
          <div className="text-3xl font-black text-orange-400 mt-2">🔥 {streak} días</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-950/30 to-zinc-900 border border-cyan-500/30 p-5 rounded-3xl shadow-xl">
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Sesiones Totales</span>
          <div className="text-3xl font-black text-cyan-400 mt-2">⚡ {workoutLogs.length}</div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-3xl space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white">Registrar Peso Actual</h3>
        <form onSubmit={e => { e.preventDefault(); const w = Number(weightInput); if(w) { addMeasurement(w); setWeightInput(''); }}} className="flex gap-2">
          <input type="number" step="0.1" placeholder="Ej: 78.5 kg" value={weightInput} onChange={e => setWeightInput(e.target.value)} className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-cyan-500" />
          <button type="submit" className="px-5 py-3 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black text-xs rounded-2xl transition-all">Guardar</button>
        </form>
      </div>

      <div className="bg-zinc-900 border border-zinc-800/80 p-5 rounded-3xl space-y-3 shadow-xl">
        <h3 className="text-sm font-bold text-white">Historial de Evolución</h3>
        <div className="space-y-2.5">
          {measurements.slice().reverse().map((m, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs border-b border-zinc-800/80 pb-2.5">
              <span className="text-zinc-400 font-medium">{m.date}</span>
              <span className="text-white font-black text-sm">{m.weight} kg</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProfileView: React.FC = () => {
  const { profile, updateProfile } = useFitApp();
  const [name, setName] = useState(profile.name);

  return (
    <div className="space-y-6 pb-28 animate-fadeIn">
      <div>
        <span className="text-[11px] font-extrabold text-cyan-400 tracking-wider uppercase">Configuración</span>
        <h1 className="text-2xl font-black text-white tracking-tight">Perfil de Atleta</h1>
      </div>
      <div className="bg-zinc-900 border border-zinc-800/80 p-6 rounded-3xl space-y-5 shadow-2xl">
        <div>
          <label className="text-xs text-zinc-400 font-bold block mb-2">Nombre Comercial</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs font-bold text-white outline-none focus:border-cyan-500" />
        </div>
        <button onClick={() => { updateProfile({ name }); alert('¡Perfil actualizado con éxito!'); }} className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black rounded-2xl text-xs transition-all tracking-wider shadow-lg shadow-cyan-500/20">
          GUARDAR CAMBIOS
        </button>
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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 max-w-md mx-auto relative flex flex-col selection:bg-cyan-500 selection:text-black">
      <header className="py-4 border-b border-zinc-900 mb-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] animate-pulse"></div>
          <span className="text-lg font-black tracking-tighter bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent">FITAPP PRO</span>
        </div>
        <span className="text-[10px] bg-zinc-900 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full font-extrabold tracking-wider shadow-inner">
          v2.0 ELITE
        </span>
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
