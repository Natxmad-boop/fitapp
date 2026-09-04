import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Utensils, 
  Droplet, 
  User, 
  CheckCircle2, 
  Flame, 
  Info, 
  RefreshCw,
  Plus,
  Trash2,
  Calendar,
  BarChart3,
  Award,
  Settings,
  ShieldCheck,
  Zap,
  TrendingUp,
  Clock,
  Timer,
  Play,
  Check
} from 'lucide-react';

export default function FitAppProEnterprise() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('fitapp_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Carlos Mendoza',
      age: 28,
      weight: 75.5,
      height: 178,
      goal: 'Ganar Masa Muscular (Hipertrofia)',
      equipment: 'Casa con mancuernas y barra',
      activityLevel: 'Moderadamente Activo (3-5 días/sem)',
      experience: 'Intermedio'
    };
  });

  useEffect(() => {
    localStorage.setItem('fitapp_profile', JSON.stringify(profile));
  }, [profile]);

  const [waterGlasses, setWaterGlasses] = useState(5);
  const targetWater = 10;

  // Temporizador de Descanso
  const [restTime, setRestTime] = useState(90);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerActive && restTime > 0) {
      interval = setInterval(() => {
        setRestTime((prev) => prev - 1);
      }, 1000);
    } else if (restTime === 0) {
      setIsTimerActive(false);
      setRestTime(90);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, restTime]);

  // Modo Entrenamiento Activo (PLAY)
  const [activeWorkoutSession, setActiveWorkoutSession] = useState(null);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [isWorkoutRunning, setIsWorkoutRunning] = useState(false);

  useEffect(() => {
    let wInterval = null;
    if (isWorkoutRunning) {
      wInterval = setInterval(() => {
        setWorkoutTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(wInterval);
  }, [isWorkoutRunning]);

  const [dietPlan, setDietPlan] = useState({
    meal: 'Pechuga de pollo a la plancha (200g) con puré de boniato (250g) y espárragos trigueros salteados en aceite de oliva.',
    shake: 'Batido post-entreno: 40g de proteína Whey, 60g de avena molida, 1 plátano maduro y 2 cucharadas de mantequilla de cacahuete.',
    calories: 2850,
    protein: 185,
    carbs: 320,
    fats: 75
  });

  const [exerciseLibrary, setExerciseLibrary] = useState([
    {
      id: 1,
      title: 'Flexiones Declinadas (Enfoque Pecho Superior)',
      category: 'Calistenia Avanzada / Pecho',
      difficulty: 'Intermedio-Avanzado',
      description: 'Variante avanzada donde los pies se elevan en un banco o soporte, desplazando mayor carga corporal hacia el cinturón escapular superior.',
      steps: [
        'El cuerpo se mueve como una sola pieza, una tabla sólida de cabeza a talones.',
        'Aprieta glúteos, abdomen firme y costillas hacia abajo.',
        'Desciende en bloque llevando el esternón hacia el suelo.'
      ],
      targetMuscles: 'Pectoral mayor, tríceps braquial y serrato anterior.',
      proTip: 'Prioriza repeticiones idénticas con un control estricto de la fase excéntrica.'
    },
    {
      id: 2,
      title: 'Sentadillas Búlgaras con Mancuernas',
      category: 'Piernas / Hipertrofia Unilateral',
      difficulty: 'Avanzado',
      description: 'Ejercicio unilateral de alta exigencia para el desarrollo de cuádriceps y estabilidad de cadera.',
      steps: [
        'Apoya el empeine del pie trasero sobre un banco horizontal.',
        'Da un paso amplio al frente con el pie de apoyo.',
        'Desciende de forma controlada hasta que la rodilla trasera roce levemente el suelo.'
      ],
      targetMuscles: 'Cuádriceps, glúteo mayor y estabilizadores del core.',
      proTip: 'Controla el equilibrio fijando la mirada en un punto fijo al frente.'
    },
    {
      id: 3,
      title: 'Remo con Mancuernas a una Mano',
      category: 'Espalda / Tracción Horizontal',
      difficulty: 'Intermedio',
      description: 'Movimiento clave para el grosor de la espalda media y la activación del dorsal ancho.',
      steps: [
        'Apoya la rodilla y la mano contraria sobre un banco firme.',
        'Tira de la mancuerna hacia la cadera guiando el movimiento con el codo.'
      ],
      targetMuscles: 'Dorsal ancho, redondo mayor y romboides.',
      proTip: 'Evita rotar excesivamente el tronco superior para hacer trampa.'
    }
  ]);

  const [exerciseLogs, setExerciseLogs] = useState([
    { id: 101, exercise: 'Flexiones Declinadas', setNum: 1, reps: 15, weight: 'Peso Corporal', timestamp: '10:15 AM' },
    { id: 102, exercise: 'Flexiones Declinadas', setNum: 2, reps: 13, weight: 'Peso Corporal', timestamp: '10:18 AM' }
  ]);

  const [newLog, setNewLog] = useState({ 
    exercise: 'Flexiones Declinadas', 
    reps: '', 
    weight: 'Peso Corporal' 
  });

  const [weeklySchedule] = useState({
    Lunes: { focus: 'Pecho y Tríceps (Enfoque Superior)', status: 'Completado', duration: '55 min' },
    Martes: { focus: 'Pierna Completa (Cuádriceps y Core)', status: 'Programado', duration: '65 min' },
    Miércoles: { focus: 'Descanso Activo / Movilidad', status: 'Programado', duration: '30 min' },
    Jueves: { focus: 'Espalda y Bíceps (Tracción)', status: 'Pendiente', duration: '60 min' },
    Viernes: { focus: 'Hombros y Brazos (Hipertrofia)', status: 'Pendiente', duration: '50 min' },
    Sábado: { focus: 'Pierna (Cadena Posterior y Glúteos)', status: 'Pendiente', duration: '60 min' },
    Domingo: { focus: 'Descanso Total y Nutrición', status: 'Descanso', duration: '0 min' }
  });

  const startWorkoutSession = (dayName, focusTitle) => {
    setActiveWorkoutSession({
      name: `${dayName}: ${focusTitle}`,
      exercises: exerciseLibrary.map(ex => ({ ...ex, completedSets: 0 }))
    });
    setWorkoutTimer(0);
    setIsWorkoutRunning(true);
  };

  const finishWorkoutSession = () => {
    setIsWorkoutRunning(false);
    setActiveWorkoutSession(null);
    alert('¡Entrenamiento finalizado y guardado con éxito!');
  };

  const handleAddLog = (e) => {
    e.preventDefault();
    if (!newLog.reps) return;
    
    const entry = {
      id: Date.now(),
      exercise: newLog.exercise,
      setNum: exerciseLogs.filter(l => l.exercise === newLog.exercise).length + 1,
      reps: Number(newLog.reps),
      weight: newLog.weight,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setExerciseLogs([entry, ...exerciseLogs]);
    setNewLog({ ...newLog, reps: '' });
    setIsTimerActive(true);
    setRestTime(90);
  };

  const deleteLog = (id) => {
    setExerciseLogs(exerciseLogs.filter(item => item.id !== id));
  };

  const generateNewMenu = () => {
    const mealOptions = [
      'Salmón salvaje al horno (220g) con quinoa salteada en verduras y brócoli al vapor con aove.',
      'Ternera magra salteada en tiras con pimientos rojos, cebolla morada y base de arroz integral basmati.',
      'Tortilla francesa de 1 huevo entero y 4 claras con espinacas frescas y aguacate.'
    ];
    const shakeOptions = [
      'Batido recuperador: 40g proteína aislado, cacao puro 100%, avena instantánea y leche de almendras.',
      'Batido hipercalórico limpio: Crema de cacahuete natural, plátano, leche desnatada y proteína de vainilla.'
    ];

    setDietPlan({
      meal: mealOptions[Math.floor(Math.random() * mealOptions.length)],
      shake: shakeOptions[Math.floor(Math.random() * shakeOptions.length)],
      calories: Math.floor(Math.random() * (3100 - 2500) + 2500),
      protein: Math.floor(Math.random() * (210 - 160) + 160),
      carbs: Math.floor(Math.random() * (350 - 260) + 260),
      fats: Math.floor(Math.random() * (85 - 60) + 60)
    });
  };

  const heightInMeters = profile.height / 100;
  const imc = (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  const estimatedBMR = Math.round(10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* MODO ENTRENAMIENTO ACTIVO (PLAY) */}
      {activeWorkoutSession && (
        <div className="fixed inset-0 z-[100] bg-slate-950/98 backdrop-blur-xl flex flex-col p-4 md:p-8 overflow-y-auto">
          <div className="max-w-4xl w-full mx-auto space-y-6 pb-20">
            <div className="bg-gradient-to-r from-emerald-950 to-slate-900 border border-emerald-500/30 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-xs uppercase font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  ⚡ Sesión en Vivo en Curso
                </span>
                <h2 className="text-2xl font-black text-slate-100 mt-2">{activeWorkoutSession.name}</h2>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-2xl font-mono text-emerald-400 text-sm">
                  ⏱️ {Math.floor(workoutTimer / 60)}:{String(workoutTimer % 60).padStart(2, '0')}
                </div>
                <button 
                  onClick={finishWorkoutSession}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-2.5 rounded-2xl text-xs transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Terminar Sesión
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-200">Ejercicios de la Rutina:</h3>
              {activeWorkoutSession.exercises.map((ex, idx) => (
                <div key={ex.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono text-emerald-400">{ex.category}</span>
                      <h4 className="text-xl font-bold text-slate-100">{ex.title}</h4>
                    </div>
                    <span className="text-xs font-mono bg-slate-950 px-3 py-1 rounded-xl text-slate-400 border border-slate-800">
                      Series hechas: <strong className="text-emerald-400">{ex.completedSets}</strong>/4
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">{ex.description}</p>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400">💡 {ex.proTip}</span>
                    <button 
                      onClick={() => {
                        const updated = { ...activeWorkoutSession };
                        updated.exercises[idx].completedSets += 1;
                        setActiveWorkoutSession(updated);
                        setIsTimerActive(true);
                        setRestTime(90);
                      }}
                      className="bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 font-bold px-4 py-2 rounded-xl text-xs transition flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Registrar Serie (+ Descanso 90s)
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <button onClick={() => setActiveWorkoutSession(null)} className="text-slate-500 hover:text-slate-300 text-xs underline">
                Minimizar / Ocultar pantalla de entrenamiento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Superior */}
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-emerald-600 to-teal-400 p-2.5 rounded-2xl text-slate-950 shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                FITAPP PRO
              </h1>
              <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                ENTERPRISE v3.1
              </span>
            </div>
            <p className="text-xs text-slate-400">Sistema de Optimización Biomecánica y Nutricional</p>
          </div>
        </div>

        {/* Widget de Descanso Activo en Header */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-xs font-mono transition ${
            isTimerActive ? 'bg-amber-500/10 border-amber-500/40 text-amber-400' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <Timer className="w-4 h-4" />
            <span>Descanso: <strong>{Math.floor(restTime / 60)}:{String(restTime % 60).padStart(2, '0')}</strong></span>
            {isTimerActive && (
              <button onClick={() => setIsTimerActive(false)} className="ml-2 text-[10px] underline hover:text-amber-300">Pausar</button>
            )}
          </div>
        </div>
      </header>

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 pb-32 space-y-8">
        
        {/* DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="space-y-2 z-10">
                <span className="text-xs uppercase tracking-widest font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Panel de Control Activo
                </span>
                <h2 className="text-3xl font-black text-slate-100">¡Hola, {profile.name}!</h2>
                <p className="text-sm text-slate-400 max-w-xl">
                  Tu plan está optimizado para <strong className="text-emerald-400">{profile.goal}</strong> usando <strong className="text-slate-200">{profile.equipment}</strong>.
                </p>
              </div>
              <button 
                onClick={() => setActiveTab('workouts')}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-2xl text-sm transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 z-10"
              >
                <Dumbbell className="w-4 h-4" /> Ver Rutinas y Entrenar
              </button>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-lg">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase font-mono">Peso Corporal</span>
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-100">{profile.weight}</span>
                  <span className="text-xs text-slate-400 font-bold">kg</span>
                </div>
                <p className="text-xs text-emerald-400 font-medium">IMC: {imc}</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-lg">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase font-mono">Calorías Diarias</span>
                  <Flame className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-100">{dietPlan.calories}</span>
                  <span className="text-xs text-slate-400 font-bold">kcal/día</span>
                </div>
                <p className="text-xs text-slate-400">TDEE base: {estimatedBMR + 400} kcal</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-lg">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase font-mono">Proteína Objetivo</span>
                  <Utensils className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-100">{dietPlan.protein}</span>
                  <span className="text-xs text-slate-400 font-bold">gramos</span>
                </div>
                <p className="text-xs text-emerald-400 font-medium">{(profile.weight * 2.2).toFixed(0)}g recomendados</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-2 shadow-lg">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs uppercase font-mono">Hidratación</span>
                  <Droplet className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-slate-100">{waterGlasses}</span>
                  <span className="text-xs text-slate-400 font-bold">/ {targetWater} vasos</span>
                </div>
                <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${(waterGlasses/targetWater)*100}%` }}></div>
                </div>
              </div>
            </div>

            {/* Calendario Semanal */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <h3 className="text-xl font-black text-emerald-400 flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Planificación Semanal de Entrenamiento
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {Object.entries(weeklySchedule).map(([day, info], idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">{day}</span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full ${
                          info.status === 'Completado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                          info.status === 'Descanso' ? 'bg-slate-800 text-slate-400' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {info.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium leading-relaxed mt-2">{info.focus}</p>
                    </div>
                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Duración:</span>
                      <span className="text-slate-300 font-bold">{info.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* WORKOUTS */}
        {activeTab === 'workouts' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-slate-900 to-slate-900/40 p-6 rounded-3xl border border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-emerald-400 flex items-center gap-2">
                  <Dumbbell className="w-6 h-6" /> Tus Rutinas y Sesiones
                </h2>
                <p className="text-sm text-slate-400 mt-1">Selecciona el día de la semana y presiona Empezar para abrir el modo de entrenamiento en vivo.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(weeklySchedule).map(([day, info], idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">{day}</span>
                      <span className="text-xs font-mono bg-slate-950 px-3 py-1 rounded-xl text-slate-400 border border-slate-800">
                        {info.duration}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-100">{info.focus}</h3>
                  </div>

                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Estado: <strong className="text-slate-200">{info.status}</strong></span>
                    <button 
                      onClick={() => startWorkoutSession(day, info.focus)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-4 py-2.5 rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" /> Empezar Rutina
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Biblioteca Biomecánica */}
            <div className="space-y-6 pt-4">
              <h3 className="text-xl font-bold text-slate-200">Biblioteca Biomecánica y Técnica</h3>
              {exerciseLibrary.map((ex) => (
                <div key={ex.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        {ex.category}
                      </span>
                      <h3 className="text-xl font-bold text-slate-100 mt-2">{ex.title}</h3>
                    </div>
                    <span className="text-xs bg-slate-950 text-slate-300 border border-slate-800 px-3 py-1 rounded-xl">
                      Dificultad: <strong className="text-emerald-400">{ex.difficulty}</strong>
                    </span>
                  </div>

                  <p className="text-sm text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 leading-relaxed">
                    {ex.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-3">
                      <h4 className="text-xs uppercase font-extrabold text-emerald-400 flex items-center gap-1.5">
                        <Info className="w-4 h-4" /> Pasos de Ejecución Técnica:
                      </h4>
                      <ul className="space-y-2.5">
                        {ex.steps.map((step, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">💡 Consejo Pro</span>
                        <p className="text-xs text-emerald-200/90 italic leading-relaxed">"{ex.proTip}"</p>
                      </div>
                      <div className="pt-3 border-t border-emerald-900/30 text-xs text-emerald-400 font-mono">
                        <span>Músculos: {ex.targetMuscles}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Registro de Series Manual */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" /> Registro en Vivo de Series y Cargas
              </h3>

              <form onSubmit={handleAddLog} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div className="md:col-span-2">
                  <label className="text-xs text-slate-400 font-semibold">Ejercicio</label>
                  <select 
                    value={newLog.exercise}
                    onChange={(e)=>setNewLog({...newLog, exercise: e.target.value})}
                    className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    {exerciseLibrary.map(ex => (
                      <option key={ex.id}>{ex.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold">Peso</label>
                  <input 
                    type="text" 
                    value={newLog.weight}
                    onChange={(e)=>setNewLog({...newLog, weight: e.target.value})}
                    className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 font-semibold">Repeticiones</label>
                  <input 
                    type="number" 
                    placeholder="Ej. 12"
                    value={newLog.reps}
                    onChange={(e)=>setNewLog({...newLog, reps: e.target.value})}
                    className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-end">
                  <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold p-3 rounded-xl text-xs transition flex items-center justify-center gap-1 shadow-lg shadow-emerald-500/20">
                    <Plus className="w-4 h-4" /> Registrar
                  </button>
                </div>
              </form>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Hora</th>
                      <th className="p-3.5">Ejercicio</th>
                      <th className="p-3.5">Nº Serie</th>
                      <th className="p-3.5">Peso</th>
                      <th className="p-3.5">Reps</th>
                      <th className="p-3.5 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {exerciseLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-950/40">
                        <td className="p-3.5 text-slate-500 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {log.timestamp}
                        </td>
                        <td className="p-3.5 font-bold text-slate-200">{log.exercise}</td>
                        <td className="p-3.5 text-emerald-400 font-mono font-extrabold">Serie #{log.setNum}</td>
                        <td className="p-3.5 text-slate-300">{log.weight}</td>
                        <td className="p-3.5 text-slate-300 font-bold">{log.reps} reps</td>
                        <td className="p-3.5 text-right">
                          <button onClick={()=>deleteLog(log.id)} className="text-rose-400 hover:text-rose-300 p-1.5 rounded-lg bg-rose-500/10 transition">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* NUTRITION */}
        {activeTab === 'nutrition' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-slate-900 to-slate-900/40 p-6 rounded-3xl border border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-emerald-400 flex items-center gap-2">
                  <Utensils className="w-6 h-6" /> Nutrición Inteligente y Macros
                </h2>
                <p className="text-sm text-slate-400 mt-1">Planes dietéticos ajustados automáticamente.</p>
              </div>
              <button 
                onClick={generateNewMenu}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
              >
                <RefreshCw className="w-4 h-4" /> Generar Nuevos Platos
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-center space-y-1">
                <span className="text-xs uppercase font-mono text-slate-400">Calorías Totales</span>
                <p className="text-2xl font-black text-slate-100">{dietPlan.calories} kcal</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-center space-y-1">
                <span className="text-xs uppercase font-mono text-slate-400">Proteínas</span>
                <p className="text-2xl font-black text-emerald-400">{dietPlan.protein}g</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-center space-y-1">
                <span className="text-xs uppercase font-mono text-slate-400">Carbohidratos</span>
                <p className="text-2xl font-black text-slate-100">{dietPlan.carbs}g</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-center space-y-1">
                <span className="text-xs uppercase font-mono text-slate-400">Grasas</span>
                <p className="text-2xl font-black text-slate-100">{dietPlan.fats}g</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
                <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Comida Principal</span>
                <p className="text-base font-bold text-slate-100 leading-relaxed pt-2">{dietPlan.meal}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
                <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">Batido Recuperador</span>
                <p className="text-base font-bold text-slate-100 leading-relaxed pt-2">{dietPlan.shake}</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                  <Droplet className="w-5 h-5" /> Control de Hidratación
                </h3>
                <span className="text-sm font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-mono">
                  {waterGlasses} / {targetWater} Vasos
                </span>
              </div>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                {Array.from({ length: targetWater }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setWaterGlasses(index < waterGlasses ? index : index + 1)}
                    className={`h-16 rounded-2xl border flex flex-col items-center justify-center transition gap-1 ${
                      index < waterGlasses 
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/20' 
                        : 'bg-slate-950 border-slate-800 text-slate-600 hover:border-slate-700'
                    }`}
                  >
                    <Droplet className="w-4 h-4" />
                    <span className="text-[10px] font-mono">{index + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
                <User className="w-5 h-5" /> Configuración Avanzada de Perfil
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase font-semibold">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={profile.name} 
                    onChange={(e)=>setProfile({...profile, name: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 uppercase font-semibold">Objetivo Principal</label>
                  <select 
                    value={profile.goal}
                    onChange={(e)=>setProfile({...profile, goal: e.target.value})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  >
                    <option>Ganar Masa Muscular (Hipertrofia)</option>
                    <option>Perder Grasa / Definición</option>
                    <option>Mantener Rendimiento y Salud</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 uppercase font-semibold">Peso Actual (kg)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={profile.weight} 
                    onChange={(e)=>setProfile({...profile, weight: Number(e.target.value)})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 uppercase font-semibold">Altura (cm)</label>
                  <input 
                    type="number" 
                    value={profile.height} 
                    onChange={(e)=>setProfile({...profile, height: Number(e.target.value)})}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-center space-y-1 shadow-lg">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <span className="text-xs text-slate-400 uppercase font-mono">IMC</span>
                <p className="font-black text-xl text-slate-100">{imc} kg/m²</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-center space-y-1 shadow-lg">
                <TrendingUp className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <span className="text-xs text-slate-400 uppercase font-mono">BMR</span>
                <p className="font-black text-xl text-slate-100">{estimatedBMR} kcal</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl text-center space-y-1 shadow-lg">
                <Settings className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <span className="text-xs text-slate-400 uppercase font-mono">Experiencia</span>
                <p className="font-black text-xl text-slate-100">{profile.experience}</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Barra de Navegación Inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-3 flex justify-around items-center z-40 max-w-lg mx-auto md:rounded-t-3xl shadow-2xl">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1.5 px-4 rounded-2xl transition ${activeTab === 'dashboard' ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-mono">Panel</span>
        </button>

        <button 
          onClick={() => setActiveTab('workouts')}
          className={`flex flex-col items-center py-1.5 px-4 rounded-2xl transition ${activeTab === 'workouts' ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Dumbbell className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-mono">Rutinas</span>
        </button>

        <button 
          onClick={() => setActiveTab('nutrition')}
          className={`flex flex-col items-center py-1.5 px-4 rounded-2xl transition ${activeTab === 'nutrition' ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-mono">Nutrición</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1.5 px-4 rounded-2xl transition ${activeTab === 'profile' ? 'text-emerald-400 bg-emerald-500/10 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] mt-1 font-mono">Perfil</span>
        </button>
      </nav>

    </div>
  );
}
