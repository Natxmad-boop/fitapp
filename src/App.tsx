import React, { useState, useEffect } from 'react';

interface Exercise {
  id: string;
  name: string;
  location: 'Casa' | 'Gimnasio';
  category: 'Fuerza' | 'Core' | 'Cardio' | 'Movilidad';
  equipment: string;
  homeSubstitute: string;
  instructions: string;
  videoUrl: string;
}

interface WorkoutLog {
  id: string;
  date: string;
  exerciseName: string;
  weightUsed: string;
  notes: string;
}

interface UserProfile {
  id: string;
  name: string;
  weight: number;
  goal: string[];
  allergies: string[];
  trainingDaysPerWeek: number;
  reminderTime: string;
  selectedDays: string[];
  workoutLocation: 'Casa' | 'Gimnasio';
  homeEquipment: string[];
  gymEquipment: string[];
}

interface MealIdea {
  id: string;
  type: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack' | 'Bebida / Batido';
  title: string;
  description: string;
  caloriesApprox: string;
  ingredients: string[]; 
  allergens: string[];
}

interface AutoRoutineDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

const INITIAL_INGREDIENTS = [
  'Pollo', 'Ternera', 'Salmón', 'Huevo', 'Arroz', 'Avena', 
  'Brócoli', 'Espinacas', 'Aguacate', 'Plátano', 'Manzana', 
  'Fresa', 'Queso batido', 'Yogur griego', 'Leche', 'Proteína en polvo'
];

const DEFAULT_HOME_TOOLS = [
  'Bandas elásticas', 'Mancuernas', 'Silla / Banco', 'Esterilla', 'Barra dominadas'
];

const DEFAULT_GYM_TOOLS = [
  'Barra olímpica', 'Mancuernas', 'Poleas', 'Máquinas guiadas', 'Kettlebells'
];

const EXERCISES: Exercise[] = [
  // CASA / CALISTENIA
  { 
    id: 'c_emp_1', 
    name: 'Flexiones Declinadas', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Bandas elásticas y silla', 
    homeSubstitute: 'Flexiones normales en el suelo apoyando rodillas.',
    instructions: 'Pies elevados en silla, manos en el suelo. Baja el pecho de forma controlada.',
    videoUrl: 'https://www.youtube.com/results?search_query=flexiones+declinadas+correctas'
  },
  { 
    id: 'c_emp_2', 
    name: 'Flexiones Diamante', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Flexiones con manos juntas enfocadas a tríceps.',
    instructions: 'Manos juntas formando un diamante con índices y pulgares. Baja el pecho hacia las manos.',
    videoUrl: 'https://www.youtube.com/results?search_query=flexiones+diamante+tecnica'
  },
  { 
    id: 'c_emp_3', 
    name: 'Flexiones en Pica (Hombro)', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Press militar con mancuernas si tienes.',
    instructions: 'Cadera arriba formando una V invertida. Baja la coronilla hacia el suelo flexionando brazos.',
    videoUrl: 'https://www.youtube.com/results?search_query=flexiones+en+pica+hombros'
  },
  { 
    id: 'c_trac_1', 
    name: 'Remo con Banda Elástica', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Bandas elásticas', 
    homeSubstitute: 'Mochila cargada con libros haciendo remo a una mano.',
    instructions: 'Pisa la banda con ambos pies y tira hacia las costillas apretando la espalda.',
    videoUrl: 'https://www.youtube.com/results?search_query=remo+con+banda+elastica+espalda'
  },
  { 
    id: 'c_trac_2', 
    name: 'Dominadas en Barra / Invertidas', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Barra dominadas', 
    homeSubstitute: 'Remo invertido bajo una mesa resistente.',
    instructions: 'Sujeción prona o supina, eleva la barbilla por encima de la barra de forma estricta.',
    videoUrl: 'https://www.youtube.com/results?search_query=dominadas+tecnica+correcta'
  },
  { 
    id: 'c_leg_1', 
    name: 'Sentadillas Búlgaras', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Silla / Banco', 
    homeSubstitute: 'Zancadas estáticas en el suelo.',
    instructions: 'Empeine de un pie en la silla detrás, baja la cadera manteniendo torso erguido.',
    videoUrl: 'https://www.youtube.com/results?search_query=sentadillas+bulgaras+tecnica'
  },
  { 
    id: 'c_leg_2', 
    name: 'Sentadillas Pistol (Un pierna)', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Sentadillas normales profundas a dos piernas.',
    instructions: 'Baja sobre una pierna manteniendo la otra extendida al frente sin tocar el suelo.',
    videoUrl: 'https://www.youtube.com/results?search_query=pistol+squats+progreso'
  },
  { 
    id: 'c_leg_3', 
    name: 'Puente de Glúteos a Una Pierna', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Esterilla', 
    homeSubstitute: 'Puente de glúteos normal a dos piernas.',
    instructions: 'Tumbada boca arriba, eleva una pierna y empuja con el talón opuesto para subir la cadera.',
    videoUrl: 'https://www.youtube.com/results?search_query=puente+de+gluteos+una+pierna'
  },
  { 
    id: 'c_core_1', 
    name: 'Plancha Abdominal con Toque', 
    location: 'Casa', 
    category: 'Core', 
    equipment: 'Esterilla', 
    homeSubstitute: 'Plancha estática sobre antebrazos.',
    instructions: 'En plancha alta, eleva una mano para tocar el hombro opuesto sin rotar la cadera.',
    videoUrl: 'https://www.youtube.com/results?search_query=plancha+con+toque+de+hombros'
  },
  { 
    id: 'c_core_2', 
    name: 'Elevaciones de Piernas en Suelo', 
    location: 'Casa', 
    category: 'Core', 
    equipment: 'Esterilla', 
    homeSubstitute: 'Encogimientos abdominales clásicos (crunch).',
    instructions: 'Manos bajo los glúteos, eleva las piernas rectas sin arquear la zona lumbar.',
    videoUrl: 'https://www.youtube.com/results?search_query=elevacion+de+piernas+suelo+abdomen'
  },

  // GIMNASIO
  { 
    id: 'g_emp_1', 
    name: 'Press de Banca con Barra', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Banco y Barra con discos', 
    homeSubstitute: 'Press con mancuernas o flexiones pesadas en casa.',
    instructions: 'Tumbada en banco, baja la barra hacia el pecho y empuja hacia arriba.',
    videoUrl: 'https://www.youtube.com/results?search_query=press+de+banca+con+barra+tecnica'
  },
  { 
    id: 'g_emp_2', 
    name: 'Press Militar con Mancuernas', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Mancuernas y Banco', 
    homeSubstitute: 'Flexiones en pica en casa.',
    instructions: 'Sentada o de pie, eleva las mancuernas por encima de la cabeza de forma controlada.',
    videoUrl: 'https://www.youtube.com/results?search_query=press+militar+con+mancuernas'
  },
  { 
    id: 'g_trac_1', 
    name: 'Jalón al Pecho en Polea', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Máquina de polea alta', 
    homeSubstitute: 'Dominadas asistidas o remo con bandas en casa.',
    instructions: 'Sujeta la barra un poco más abierta que los hombros y tira hacia la parte alta del pecho.',
    videoUrl: 'https://www.youtube.com/results?search_query=jalon+al+pecho+en+polea+tecnica'
  },
  { 
    id: 'g_trac_2', 
    name: 'Remo en Polea Baja', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Polea baja', 
    homeSubstitute: 'Remo con bandas elásticas en casa.',
    instructions: 'Espalda recta, tira del manillar hacia el abdomen contrarayendo escápulas.',
    videoUrl: 'https://www.youtube.com/results?search_query=remo+en+polea+baja+espalda'
  },
  { 
    id: 'g_leg_1', 
    name: 'Sentadilla Libre con Barra', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Jaula y Barra olímpica', 
    homeSubstitute: 'Sentadillas búlgaras o con mochila en casa.',
    instructions: 'Barra en trapecios, baja la cadera manteniendo el pecho alto y empuja con toda la planta.',
    videoUrl: 'https://www.youtube.com/results?search_query=sentadilla+libre+con+barra+tecnica'
  },
  { 
    id: 'g_leg_2', 
    name: 'Peso Muerto Rumano', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Barra o Mancuernas', 
    homeSubstitute: 'Peso muerto con bandas o garrafas en casa.',
    instructions: 'Bisagra de cadera hacia atrás sintiendo el estiramiento en femoral y glúteo.',
    videoUrl: 'https://www.youtube.com/results?search_query=peso+muerto+rumano+tecnica'
  }
];

const INITIAL_MEALS: MealIdea[] = [
  { 
    id: 'm1', 
    type: 'Almuerzo', 
    title: 'Pechuga de pollo a la plancha con arroz y brócoli', 
    description: 'Pechuga marinada acompañada de arroz blanco y brócoli al vapor.', 
    caloriesApprox: '450 kcal',
    ingredients: ['Pollo', 'Arroz', 'Brócoli'],
    allergens: [] 
  },
  { 
    id: 'm2', 
    type: 'Desayuno', 
    title: 'Bol de Avena, Plátano y Yogur Griego', 
    description: 'Avena mezclada con yogur griego y rodajas de plátano fresco.', 
    caloriesApprox: '380 kcal',
    ingredients: ['Avena', 'Yogur griego', 'Plátano'],
    allergens: [] 
  }
];

const DAYS_LIST = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function App() {
  const [profilesList, setProfilesList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('fitapp_profiles_directory');
    return saved ? JSON.parse(saved) : [
      { 
        id: 'user_1', 
        name: 'Eli', 
        weight: 50, 
        goal: ['Ganar fuerza'], 
        allergies: [], 
        trainingDaysPerWeek: 3, 
        reminderTime: '09:00', 
        selectedDays: ['Lun', 'Mié', 'Vie'],
        workoutLocation: 'Casa',
        homeEquipment: DEFAULT_HOME_TOOLS,
        gymEquipment: DEFAULT_GYM_TOOLS
      }
    ];
  });

  const [activeUserId, setActiveUserId] = useState<string>(() => {
    return localStorage.getItem('fitapp_active_user_id') || 'user_1';
  });

  const profile = profilesList.find(p => p.id === activeUserId) || profilesList[0];

  const [logs, setLogs] = useState<WorkoutLog[]>(() => {
    const saved = localStorage.getItem(`fitapp_logs_${activeUserId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [customIngredients, setCustomIngredients] = useState<string[]>(() => {
    const saved = localStorage.getItem('fitapp_custom_ingredients');
    return saved ? JSON.parse(saved) : INITIAL_INGREDIENTS;
  });

  const [customMeals, setCustomMeals] = useState<MealIdea[]>(() => {
    const saved = localStorage.getItem('fitapp_custom_meals');
    return saved ? JSON.parse(saved) : INITIAL_MEALS;
  });

  const [waterGlasses, setWaterGlasses] = useState<number>(() => {
    const todayStr = new Date().toDateString();
    const savedData = localStorage.getItem('fitapp_water_tracker');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      if (parsed.date === todayStr) return parsed.count;
    }
    return 0;
  });

  const [activeTab, setActiveTab] = useState<'entreno' | 'nutricion' | 'menu' | 'progreso' | 'ejercicios' | 'batidos' | 'herramientas' | 'despensa' | 'perfil'>('entreno');
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['Plátano', 'Yogur griego', 'Avena']);
  const [smoothieSeed, setSmoothieSeed] = useState<number>(0);
  const [dailyMenu, setDailyMenu] = useState<{ desayuno?: MealIdea; almuerzo?: MealIdea; cena?: MealIdea; bebida?: MealIdea }>({});

  const [selectedExerciseName, setSelectedExerciseName] = useState<string>(EXERCISES[0].name);
  const [weightUsedInput, setWeightUsedInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  
  const [libraryFilterLocation, setLibraryFilterLocation] = useState<'Casa' | 'Gimnasio' | 'Todas'>('Casa');

  const [newIngName, setNewIngName] = useState<string>('');
  const [newHomeToolName, setNewHomeToolName] = useState<string>('');
  const [newGymToolName, setNewGymToolName] = useState<string>('');

  const [newMealTitle, setNewMealTitle] = useState<string>('');
  const [newMealDesc, setNewMealDesc] = useState<string>('');
  const [newMealCalories, setNewMealCalories] = useState<string>('');

  const [newProfileName, setNewProfileName] = useState<string>('');
  const [newProfileWeight, setNewProfileWeight] = useState<string>('60');

  useEffect(() => {
    localStorage.setItem('fitapp_profiles_directory', JSON.stringify(profilesList));
  }, [profilesList]);

  useEffect(() => {
    localStorage.setItem('fitapp_custom_ingredients', JSON.stringify(customIngredients));
  }, [customIngredients]);

  useEffect(() => {
    localStorage.setItem('fitapp_custom_meals', JSON.stringify(customMeals));
  }, [customMeals]);

  useEffect(() => {
    localStorage.setItem('fitapp_water_tracker', JSON.stringify({ date: new Date().toDateString(), count: waterGlasses }));
  }, [waterGlasses]);

  useEffect(() => {
    localStorage.setItem('fitapp_active_user_id', activeUserId);
    const savedLogs = localStorage.getItem(`fitapp_logs_${activeUserId}`);
    setLogs(savedLogs ? JSON.parse(savedLogs) : []);
  }, [activeUserId]);

  useEffect(() => {
    localStorage.setItem(`fitapp_logs_${activeUserId}`, JSON.stringify(logs));
  }, [logs, activeUserId]);

  const handleUpdateActiveProfile = (field: keyof UserProfile, value: any) => {
    const updated = profilesList.map(p => p.id === profile.id ? { ...p, [field]: value } : p);
    setProfilesList(updated);
  };

  const handleCreateNewProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;

    const newId = 'user_' + Date.now();
    const createdUser: UserProfile = {
      id: newId,
      name: newProfileName.trim(),
      weight: Number(newProfileWeight) || 60,
      goal: ['Salud y bienestar'],
      allergies: [],
      trainingDaysPerWeek: 3,
      reminderTime: '09:00',
      selectedDays: ['Lun', 'Mié', 'Vie'],
      workoutLocation: 'Casa',
      homeEquipment: DEFAULT_HOME_TOOLS,
      gymEquipment: DEFAULT_GYM_TOOLS
    };

    setProfilesList([...profilesList, createdUser]);
    setActiveUserId(newId);
    setNewProfileName('');
    setNewProfileWeight('60');
    alert(`¡Perfil de ${createdUser.name} creado con éxito! 🎉`);
  };

  // Función para eliminar un perfil
  const handleDeleteProfile = (idToDelete: string) => {
    if (profilesList.length <= 1) {
      alert('No puedes eliminar el único perfil existente.');
      return;
    }
    const target = profilesList.find(p => p.id === idToDelete);
    if (!window.confirm(`¿Seguro que deseas eliminar el perfil de "${target?.name}"?`)) return;

    const remaining = profilesList.filter(p => p.id !== idToDelete);
    setProfilesList(remaining);
    setActiveUserId(remaining[0].id);
  };

  const handleToggleSpecificDay = (dayKey: string) => {
    const currentDays = profile.selectedDays || [];
    const updatedDays = currentDays.includes(dayKey)
      ? currentDays.filter(d => d !== dayKey)
      : [...currentDays, dayKey];
    handleUpdateActiveProfile('selectedDays', updatedDays);
  };

  const handleToggleHomeEquipment = (tool: string) => {
    const currentTools = profile.homeEquipment || [];
    const updatedTools = currentTools.includes(tool)
      ? currentTools.filter(t => t !== tool)
      : [...currentTools, tool];
    handleUpdateActiveProfile('homeEquipment', updatedTools);
  };

  const handleAddCustomHomeTool = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newHomeToolName.trim();
    if (!clean) return;
    const currentTools = profile.homeEquipment || [];
    if (!currentTools.includes(clean)) {
      handleUpdateActiveProfile('homeEquipment', [...currentTools, clean]);
    }
    setNewHomeToolName('');
  };

  const handleAddCustomGymTool = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newGymToolName.trim();
    if (!clean) return;
    const currentTools = profile.gymEquipment || DEFAULT_GYM_TOOLS;
    if (!currentTools.includes(clean)) {
      handleUpdateActiveProfile('gymEquipment', [...currentTools, clean]);
    }
    setNewGymToolName('');
  };

  const getAutoGeneratedRoutine = (): AutoRoutineDay[] => {
    const days = profile.selectedDays || [];
    const locationFilter = profile.workoutLocation || 'Casa';
    const poolExercises = EXERCISES.filter(ex => ex.location === locationFilter);

    return days.map((day, index) => {
      let focus = locationFilter === 'Casa' ? 'Full Body Calistenia' : 'Fuerza Gimnasio';
      let routineExs = poolExercises.length > 0 ? poolExercises : EXERCISES;
      
      if (index % 2 === 1 && poolExercises.length > 2) {
        routineExs = [poolExercises[1], poolExercises[2], poolExercises[0]];
      }

      return { day, focus, exercises: routineExs.slice(0, 3) };
    });
  };

  const autoRoutine = getAutoGeneratedRoutine();
  const filteredExercisesForLog = EXERCISES.filter(ex => ex.location === (profile.workoutLocation || 'Casa'));

  const handleToggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) ? prev.filter(i => i !== ingredient) : [...prev, ingredient]
    );
  };

  const handleAddIngredientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newIngName.trim();
    if (!cleanName || customIngredients.includes(cleanName)) return;
    setCustomIngredients([...customIngredients, cleanName]);
    setNewIngName('');
  };

  const handleAddBatidoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealTitle.trim()) return;

    const newBatidoObj: MealIdea = {
      id: 'custom_batido_' + Date.now(),
      type: 'Bebida / Batido',
      title: newMealTitle.trim(),
      description: newMealDesc.trim() || 'Batido saludable personalizado.',
      caloriesApprox: newMealCalories.trim() ? `${newMealCalories.trim()} kcal` : '200 kcal',
      ingredients: selectedIngredients.length > 0 ? [...selectedIngredients] : ['Plátano', 'Leche'],
      allergens: []
    };

    setCustomMeals([newBatidoObj, ...customMeals]);
    setNewMealTitle('');
    setNewMealDesc('');
    setNewMealCalories('');
    alert('¡Batido guardado con éxito! 🥤');
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExerciseName) return;

    const newLog: WorkoutLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      exerciseName: selectedExerciseName,
      weightUsed: weightUsedInput ? `${weightUsedInput} kg` : 'Peso corporal',
      notes: notesInput || 'Completado con éxito'
    };

    setLogs([newLog, ...logs]);
    setWeightUsedInput('');
    setNotesInput('');
    alert('¡Entrenamiento libre guardado con éxito! 🚀');
  };

  const generateDailyMenu = () => {
    const getRandom = (arr: MealIdea[]) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : undefined;
    setDailyMenu({
      desayuno: getRandom(customMeals.filter(m => m.type === 'Desayuno')),
      almuerzo: getRandom(customMeals.filter(m => m.type === 'Almuerzo')),
      cena: getRandom(customMeals.filter(m => m.type === 'Cena')),
      bebida: getRandom(customMeals.filter(m => m.type === 'Bebida / Batido'))
    });
  };

  const filteredMeals = customMeals.filter(meal => {
    if (selectedIngredients.length > 0) {
      return meal.ingredients.some(ing => selectedIngredients.includes(ing));
    }
    return true;
  });

  const solidMealsList = filteredMeals.filter(m => m.type !== 'Bebida / Batido');
  
  const smoothieStyles = ['Smart Express', 'Power Protein', 'Detox Vital', 'Recovery Boost', 'Fit Energy'];
  const currentStyleIndex = smoothieSeed % smoothieStyles.length;
  const generatedSmartSmoothie = {
    title: selectedIngredients.length > 0 ? `Batido ${smoothieStyles[currentStyleIndex]} de ${selectedIngredients.slice(0, 2).join(' y ')}` : 'Batido Energético Base',
    description: selectedIngredients.length > 0 ? `Combinación optimizada con tus ingredientes: ${selectedIngredients.join(', ')}.` : 'Selecciona ingredientes en Nutrición.',
    caloriesApprox: `${180 + ((selectedIngredients.length * 25 + smoothieSeed * 15) % 150)} kcal`
  };

  const t = isDarkMode ? {
    bg: '#090d16', card: '#111827', text: '#f9fafb', textSec: '#9ca3af', primary: '#3b82f6', border: '#1f2937', accentGrad: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', navBg: 'rgba(17, 24, 39, 0.95)'
  } : {
    bg: '#f3f4f6', card: '#ffffff', text: '#111827', textSec: '#4b5563', primary: '#2563eb', border: '#e5e7eb', accentGrad: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', navBg: 'rgba(255, 255, 255, 0.95)'
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '20px', paddingBottom: '110px', backgroundColor: t.bg, color: t.text, minHeight: '100vh', boxSizing: 'border-box', position: 'relative' }}>
      
      {/* Cabecera */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: t.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px' }}>⚡</div>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: '800', margin: 0 }}>FitApp Pro</h1>
            <p style={{ fontSize: '11px', color: t.textSec, margin: '2px 0 0 0' }}>Usuario activo: <strong style={{ color: t.primary }}>{profile?.name}</strong> ({profile?.weight} kg)</p>
          </div>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}>{isDarkMode ? '☀️' : '🌙'}</button>
      </header>

      {/* PESTAÑA: ENTRENAMIENTO */}
      {activeTab === 'entreno' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '10px' }}>📍 ¿Dónde vas a entrenar?</h2>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              {(['Casa', 'Gimnasio'] as const).map(loc => {
                const isSelected = profile.workoutLocation === loc;
                return (
                  <button
                    key={loc}
                    onClick={() => handleUpdateActiveProfile('workoutLocation', loc)}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '12px',
                      backgroundColor: isSelected ? t.primary : t.bg,
                      color: isSelected ? '#fff' : t.text,
                      border: `1px solid ${isSelected ? t.primary : t.border}`
                    }}
                  >
                    {loc === 'Casa' ? '🏠 En Casa' : '🏋️ Gimnasio'}
                  </button>
                );
              })}
            </div>

            {profile.workoutLocation === 'Casa' && (
              <div>
                <p style={{ fontSize: '11px', color: t.textSec, margin: '0 0 8px 0' }}>Material disponible en casa:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(profile.homeEquipment || DEFAULT_HOME_TOOLS).map(tool => {
                    const hasTool = profile.homeEquipment?.includes(tool);
                    return (
                      <button
                        key={tool}
                        onClick={() => handleToggleHomeEquipment(tool)}
                        style={{
                          padding: '6px 10px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', fontWeight: '600',
                          backgroundColor: hasTool ? 'rgba(16, 185, 129, 0.15)' : t.bg,
                          color: hasTool ? '#10b981' : t.textSec,
                          border: `1px solid ${hasTool ? '#10b981' : t.border}`
                        }}
                      >
                        {hasTool ? '✓ ' : '+ '} {tool}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '8px' }}>📅 Días de Entrenamiento</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
              {DAYS_LIST.map(day => {
                const isSelected = profile.selectedDays?.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => handleToggleSpecificDay(day)}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: '10px', cursor: 'pointer', fontSize: '11px', fontWeight: '700',
                      backgroundColor: isSelected ? t.primary : t.bg,
                      color: isSelected ? '#fff' : t.text,
                      border: `1px solid ${isSelected ? t.primary : t.border}`
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.primary, margin: '0 0 12px 0' }}>🤖 Rutina Adaptada ({profile.workoutLocation})</h3>
            
            {autoRoutine.length === 0 ? (
              <p style={{ fontSize: '12px', color: t.textSec, textAlign: 'center' }}>Selecciona días arriba.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {autoRoutine.map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px' }}>Día {item.day}</strong>
                      <span style={{ fontSize: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>{item.focus}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {item.exercises.map((ex, i) => (
                        <div key={i} style={{ backgroundColor: t.card, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}` }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '12px', color: t.text }}>{ex.name}</strong>
                            <a 
                              href={ex.videoUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              style={{ fontSize: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: t.primary, padding: '3px 8px', borderRadius: '6px', textDecoration: 'none', fontWeight: '700' }}
                            >
                              ▶️ Ver Vídeo
                            </a>
                          </div>
                          <p style={{ fontSize: '11px', color: t.textSec, margin: '4px 0 2px 0' }}>💡 <strong>Cómo hacerlo:</strong> {ex.instructions}</p>
                          <p style={{ fontSize: '10px', color: '#f59e0b', margin: '2px 0 0 0' }}>🛠️ <strong>Alternativa si no tienes material:</strong> {ex.homeSubstitute}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '12px' }}>⚡ Registro Modo Libre</h3>
            <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <select value={selectedExerciseName} onChange={e => setSelectedExerciseName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none' }}>
                {filteredExercisesForLog.map(ex => (<option key={ex.id} value={ex.name}>{ex.name} ({ex.category})</option>))}
              </select>
              <input type="text" placeholder="Peso utilizado (ej: 10 kg o PC)..." value={weightUsedInput} onChange={e => setWeightUsedInput(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Notas de la serie..." value={notesInput} onChange={e => setNotesInput(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none', boxSizing: 'border-box' }} />
              <button type="submit" style={{ background: t.accentGrad, color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Guardar Serie 🚀</button>
            </form>
          </div>
        </div>
      )}

      {/* PESTAÑA: NUTRICIÓN */}
      {activeTab === 'nutricion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, margin: 0 }}>💧 Hidratación</h2>
              <span style={{ fontSize: '13px', fontWeight: '800', color: t.primary }}>{waterGlasses} / 8 vasos</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={() => setWaterGlasses(prev => Math.max(0, prev - 1))} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '10px 14px', cursor: 'pointer' }}>➖</button>
              <div style={{ flex: 1, backgroundColor: t.bg, borderRadius: '10px', height: '14px', overflow: 'hidden', border: `1px solid ${t.border}` }}>
                <div style={{ width: `${Math.min(100, (waterGlasses / 8) * 100)}%`, background: '#38bdf8', height: '100%' }}></div>
              </div>
              <button onClick={() => setWaterGlasses(prev => prev + 1)} style={{ backgroundColor: t.primary, color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer' }}>➕</button>
            </div>
          </div>

          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '8px' }}>🛒 Ingredientes en casa</h2>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {customIngredients.map(ing => {
                const isSelected = selectedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => handleToggleIngredient(ing)}
                    style={{
                      padding: '7px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                      backgroundColor: isSelected ? t.primary : t.bg,
                      color: isSelected ? '#fff' : t.text,
                      border: `1px solid ${isSelected ? t.primary : t.border}`
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '} {ing}
                  </button>
                );
              })}
            </div>
          </div>

          <h3 style={{ fontSize: '14px', fontWeight: '800', margin: '4px 0 0 4px' }}>🍳 Platos Disponibles ({solidMealsList.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {solidMealsList.map(meal => (
              <div key={meal.id} style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '14px' }}>
                <span style={{ fontSize: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>{meal.type}</span>
                <strong style={{ fontSize: '13px', display: 'block', margin: '6px 0 4px 0' }}>{meal.title}</strong>
                <p style={{ fontSize: '12px', color: t.textSec, margin: 0 }}>{meal.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA: MENÚ */}
      {activeTab === 'menu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, textAlign: 'center' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '10px' }}>🍽️ Menú Diario</h2>
            <button onClick={generateDailyMenu} style={{ background: t.accentGrad, color: '#fff', border: 'none', padding: '12px 16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', width: '100%' }}>🎲 Generar Menú</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dailyMenu.desayuno && <div style={{ backgroundColor: t.card, padding: '12px 14px', borderRadius: '12px', border: `1px solid ${t.border}` }}><strong style={{fontSize:'12px', color: t.primary}}>🌅 Desayuno:</strong> <div style={{fontSize:'13px', marginTop:'2px'}}>{dailyMenu.desayuno.title}</div></div>}
            {dailyMenu.bebida && <div style={{ backgroundColor: t.card, padding: '12px 14px', borderRadius: '12px', border: `1px solid ${t.border}` }}><strong style={{fontSize:'12px', color:'#8b5cf6'}}>🥤 Batido:</strong> <div style={{fontSize:'13px', marginTop:'2px'}}>{dailyMenu.bebida.title}</div></div>}
            {dailyMenu.almuerzo && <div style={{ backgroundColor: t.card, padding: '12px 14px', borderRadius: '12px', border: `1px solid ${t.border}` }}><strong style={{fontSize:'12px', color: t.primary}}>☀️ Almuerzo:</strong> <div style={{fontSize:'13px', marginTop:'2px'}}>{dailyMenu.almuerzo.title}</div></div>}
            {dailyMenu.cena && <div style={{ backgroundColor: t.card, padding: '12px 14px', borderRadius: '12px', border: `1px solid ${t.border}` }}><strong style={{fontSize:'12px', color: t.primary}}>🌙 Cena:</strong> <div style={{fontSize:'13px', marginTop:'2px'}}>{dailyMenu.cena.title}</div></div>}
          </div>
        </div>
      )}

      {/* PESTAÑA: PROGRESO */}
      {activeTab === 'progreso' && (
        <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '12px' }}>📈 Historial ({logs.length})</h2>
          {logs.length === 0 ? (
            <p style={{ fontSize: '12px', color: t.textSec, textAlign: 'center', padding: '10px 0' }}>No hay registros aún para este perfil.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {logs.map(lg => (
                <div key={lg.id} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '12px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: t.textSec, marginBottom: '4px', fontSize: '11px' }}>
                    <span>📅 {lg.date}</span>
                    <strong style={{ color: t.primary }}>{lg.weightUsed}</strong>
                  </div>
                  <strong style={{ fontSize: '13px', display: 'block' }}>{lg.exerciseName}</strong>
                  <p style={{ margin: '4px 0 0 0', color: t.textSec, fontSize: '11px' }}>{lg.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA: BIBLIOTECA DE EJERCICIOS */}
      {activeTab === 'ejercicios' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '10px' }}>📖 Biblioteca Libre de Ejercicios</h2>
            <p style={{ fontSize: '11px', color: t.textSec, margin: '0 0 12px 0' }}>Elige el tipo de ejercicios que quieres consultar con explicaciones y vídeos:</p>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['Casa', 'Gimnasio', 'Todas'] as const).map(opt => {
                const isSel = libraryFilterLocation === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => setLibraryFilterLocation(opt)}
                    style={{
                      flex: 1, padding: '8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                      backgroundColor: isSel ? t.primary : t.bg,
                      color: isSel ? '#fff' : t.text,
                      border: `1px solid ${isSel ? t.primary : t.border}`
                    }}
                  >
                    {opt === 'Casa' ? '🏠 Casa' : opt === 'Gimnasio' ? '🏋️ Gimnasio' : '✨ Todas'}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {EXERCISES.filter(ex => libraryFilterLocation === 'Todas' || ex.location === libraryFilterLocation).map(ex => (
              <div key={ex.id} style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '10px', backgroundColor: ex.location === 'Casa' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: ex.location === 'Casa' ? t.primary : '#10b981', padding: '2px 8px', borderRadius: '6px', fontWeight: '700' }}>
                      {ex.location === 'Casa' ? '🏠 Casa' : '🏋️ Gimnasio'}
                    </span>
                    <span style={{ fontSize: '10px', backgroundColor: t.bg, color: t.textSec, padding: '2px 6px', borderRadius: '6px', border: `1px solid ${t.border}` }}>{ex.category}</span>
                  </div>
                  <a 
                    href={ex.videoUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ fontSize: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: t.primary, padding: '3px 8px', borderRadius: '6px', textDecoration: 'none', fontWeight: '700' }}
                  >
                    ▶️ Ver Vídeo
                  </a>
                </div>

                <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0 4px 0' }}>{ex.name}</strong>
                <p style={{ fontSize: '11px', color: t.textSec, margin: '0 0 4px 0' }}>💡 <strong>Cómo hacerlo:</strong> {ex.instructions}</p>
                <p style={{ fontSize: '10px', color: '#f59e0b', margin: 0 }}>🛠️ <strong>Material / Alternativa:</strong> {ex.equipment} ({ex.homeSubstitute})</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA: BATIDOS */}
      {activeTab === 'batidos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: '#8b5cf6', margin: 0 }}>🪄 Batido Inteligente</h2>
              <button onClick={() => setSmoothieSeed(prev => prev + 1)} style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: '700' }}>🔄 Otro</button>
            </div>
            <div style={{ backgroundColor: t.bg, border: '1px dashed #8b5cf6', borderRadius: '12px', padding: '14px' }}>
              <strong style={{ fontSize: '13px', display: 'block', margin: '0 0 4px 0' }}>{generatedSmartSmoothie.title}</strong>
              <p style={{ fontSize: '12px', color: t.textSec, margin: '0 0 8px 0' }}>{generatedSmartSmoothie.description}</p>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#8b5cf6' }}>⚡ Aprox. {generatedSmartSmoothie.caloriesApprox}</span>
            </div>
          </div>

          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '12px' }}>🥤 Crear Batido</h3>
            <form onSubmit={handleAddBatidoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <input type="text" placeholder="Nombre..." value={newMealTitle} onChange={e => setNewMealTitle(e.target.value)} style={{ padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none' }} />
              <input type="text" placeholder="Calorías (ej: 250 kcal)..." value={newMealCalories} onChange={e => setNewMealCalories(e.target.value)} style={{ padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none' }} />
              <button type="submit" style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Guardar Batido 🚀</button>
            </form>
          </div>
        </div>
      )}

      {/* PESTAÑA: HERRAMIENTAS */}
      {activeTab === 'herramientas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '10px' }}>🛠️ Añadir Herramienta / Material en Casa</h2>
            <form onSubmit={handleAddCustomHomeTool} style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="Ej: TRX, Rueda abdominal..." value={newHomeToolName} onChange={e => setNewHomeToolName(e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, fontSize: '12px', outline: 'none' }} />
              <button type="submit" style={{ background: t.accentGrad, color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Añadir ➕</button>
            </form>
          </div>

          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '10px' }}>🏋️ Equipamiento en Gimnasio</h2>
            <form onSubmit={handleAddCustomGymTool} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input type="text" placeholder="Ej: Multipower, Prensa 45°..." value={newGymToolName} onChange={e => setNewGymToolName(e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, fontSize: '12px', outline: 'none' }} />
              <button type="submit" style={{ background: t.accentGrad, color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Añadir ➕</button>
            </form>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(profile.gymEquipment || DEFAULT_GYM_TOOLS).map(eq => (
                <span key={eq} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '600' }}>
                  🏋️ {eq}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA: DESPENSA */}
      {activeTab === 'despensa' && (
        <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '10px' }}>🧀 Ampliar Despensa</h2>
          <form onSubmit={handleAddIngredientSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input type="text" placeholder="Ej: Fresa, Nueces..." value={newIngName} onChange={e => setNewIngName(e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, fontSize: '12px', outline: 'none' }} />
            <button type="submit" style={{ background: t.accentGrad, color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Añadir ➕</button>
          </form>
        </div>
      )}

      {/* PESTAÑA: PERFIL Y MULTIPERFIL */}
      {activeTab === 'perfil' && profile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Selector de perfiles existentes */}
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, margin: 0 }}>👥 Cambiar / Gestionar Perfiles</h2>
              <button 
                onClick={() => handleDeleteProfile(profile.id)} 
                style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', padding: '4px 8px', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}
              >
                🗑️ Eliminar este perfil
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {profilesList.map(p => {
                const isCurrent = p.id === activeUserId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActiveUserId(p.id)}
                    style={{
                      padding: '8px 14px', borderRadius: '10px', cursor: 'pointer', fontSize: '12px', fontWeight: '700',
                      backgroundColor: isCurrent ? t.primary : t.bg,
                      color: isCurrent ? '#fff' : t.text,
                      border: `1px solid ${isCurrent ? t.primary : t.border}`
                    }}
                  >
                    👤 {p.name} ({p.weight} kg) {isCurrent && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Crear un nuevo perfil */}
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '10px' }}>➕ Crear Nuevo Perfil</h3>
            <form onSubmit={handleCreateNewProfile} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <input type="text" placeholder="Nombre (ej: Marc)..." value={newProfileName} onChange={e => setNewProfileName(e.target.value)} style={{ padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none' }} />
              <input type="number" placeholder="Peso inicial (kg)..." value={newProfileWeight} onChange={e => setNewProfileWeight(e.target.value)} style={{ padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none' }} />
              <button type="submit" style={{ background: t.accentGrad, color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Crear y Activar Perfil 🚀</button>
            </form>
          </div>

          {/* Editar el perfil actual */}
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '12px' }}>⚙️ Editar Perfil Actual: {profile.name}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <label style={{ color: t.textSec, fontWeight: '600' }}>Nombre:
                <input type="text" value={profile.name} onChange={e => handleUpdateActiveProfile('name', e.target.value)} style={{ width: '100%', padding: '10px 12px', marginTop: '4px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none', boxSizing: 'border-box' }} />
              </label>
              <label style={{ color: t.textSec, fontWeight: '600' }}>Peso (kg):
                <input type="number" value={profile.weight} onChange={e => handleUpdateActiveProfile('weight', Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', marginTop: '4px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none', boxSizing: 'border-box' }} />
              </label>
            </div>
          </div>

        </div>
      )}

      {/* MENÚ DESPLEGABLE "MÁS" */}
      {isMoreMenuOpen && (
        <div style={{ position: 'fixed', bottom: '75px', left: '20px', right: '20px', maxWidth: '440px', margin: '0 auto', backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '20px', padding: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', zIndex: 101, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {[
            { id: 'ejercicios', label: 'Ejercicios', icon: '📖' },
            { id: 'batidos', label: 'Batidos', icon: '🥤' },
            { id: 'herramientas', label: 'Utilidades', icon: '🛠️' },
            { id: 'despensa', label: 'Despensa', icon: '🛒' },
            { id: 'perfil', label: 'Perfil', icon: '👤' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as any); setIsMoreMenuOpen(false); }}
              style={{
                background: activeTab === item.id ? 'rgba(59, 130, 246, 0.15)' : t.bg,
                border: `1px solid ${activeTab === item.id ? t.primary : t.border}`,
                borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: t.text
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: '700' }}>{item.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Barra de Navegación Inferior Limpia */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: t.navBg, backdropFilter: 'blur(12px)', borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '10px 10px 16px 10px', maxWidth: '480px', margin: '0 auto', zIndex: 100 }}>
        {[
          { id: 'entreno', label: 'Entreno', icon: '🏋️' },
          { id: 'nutricion', label: 'Nutrición', icon: '🥗' },
          { id: 'menu', label: 'Menú', icon: '🍽️' },
          { id: 'progreso', label: 'Progreso', icon: '📈' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button 
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setIsMoreMenuOpen(false); }} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', opacity: isActive ? 1 : 0.6, flex: 1 }}
            >
              <span style={{ fontSize: '20px' }}>{tab.icon}</span>
              <span style={{ fontSize: '10px', fontWeight: isActive ? '800' : '500', color: isActive ? t.primary : t.textSec }}>{tab.label}</span>
            </button>
          );
        })}

        {/* Botón "Más" para desplegar la sección de Biblioteca de Ejercicios y herramientas secundarias */}
        <button 
          onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', opacity: ['ejercicios', 'batidos', 'herramientas', 'despensa', 'perfil'].includes(activeTab) ? 1 : 0.6, flex: 1 }}
        >
          <span style={{ fontSize: '20px' }}>📂</span>
          <span style={{ fontSize: '10px', fontWeight: ['ejercicios', 'batidos', 'herramientas', 'despensa', 'perfil'].includes(activeTab) ? '800' : '500', color: ['ejercicios', 'batidos', 'herramientas', 'despensa', 'perfil'].includes(activeTab) ? t.primary : t.textSec }}>Más</span>
        </button>
      </nav>

    </div>
  );
}
