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

const AVAILABLE_HOME_TOOLS = [
  'Bandas elásticas', 'Mancuernas', 'Silla / Banco', 'Esterilla', 'Barra dominadas'
];

const EXERCISES: Exercise[] = [
  { 
    id: 'c_emp_1', 
    name: 'Flexiones Declinadas', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Bandas elásticas y silla', 
    homeSubstitute: 'Si no tienes bandas, haz flexiones normales en el suelo apoyando las rodillas si es necesario.',
    instructions: 'Pies elevados en silla, manos en el suelo a la altura de los hombros. Baja el pecho de forma controlada.',
    videoUrl: 'https://www.youtube.com/results?search_query=flexiones+declinadas+correctas'
  },
  { 
    id: 'c_trac_1', 
    name: 'Remo con Banda Elástica', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Bandas elásticas', 
    homeSubstitute: 'Si no tienes bandas, usa una mochila cargada con libros y haz remo inclinado a una mano.',
    instructions: 'Pisa la banda con ambos pies, cruza los extremos para más tensión y tira hacia las costillas apretando la espalda.',
    videoUrl: 'https://www.youtube.com/results?search_query=remo+con+banda+elastica+espalda'
  },
  { 
    id: 'c_leg_1', 
    name: 'Sentadillas Búlgaras', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Silla / Banco', 
    homeSubstitute: 'Si te cuesta el equilibrio, apóyate ligeramente a una pared o haz zancadas estáticas normales.',
    instructions: 'Coloca el empeine de un pie en una silla detrás de ti y baja la cadera manteniendo el torso erguido.',
    videoUrl: 'https://www.youtube.com/results?search_query=sentadillas+bulgaras+tecnica'
  },
  { 
    id: 'c_core_1', 
    name: 'Plancha Abdominal con Toque', 
    location: 'Casa', 
    category: 'Core', 
    equipment: 'Esterilla', 
    homeSubstitute: 'Si te molestan las muñecas, mantén una plancha estática sobre antebrazos.',
    instructions: 'En posición de plancha alta, eleva una mano para tocar el hombro opuesto intentando no rotar la cadera.',
    videoUrl: 'https://www.youtube.com/results?search_query=plancha+con+toque+de+hombros'
  },
  { 
    id: 'g_emp_1', 
    name: 'Press de Banca con Barra', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Banco y Barra con discos', 
    homeSubstitute: 'Sustituible por press con mancuernas o flexiones pesadas en casa.',
    instructions: 'Tumbado en el banco, baja la barra de forma controlada hacia la línea media del pecho y empuja hacia arriba.',
    videoUrl: 'https://www.youtube.com/results?search_query=press+de+banca+con+barra+tecnica'
  },
  { 
    id: 'g_trac_1', 
    name: 'Jalón al Pecho en Polea', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Máquina de polea alta', 
    homeSubstitute: 'Dominadas asistidas o remo con bandas en casa.',
    instructions: 'Sujeta la barra con las manos un poco más abiertas que los hombros y tira hacia la parte alta del pecho.',
    videoUrl: 'https://www.youtube.com/results?search_query=jalon+al+pecho+en+polea+tecnica'
  }
];

const INITIAL_MEALS: MealIdea[] = [
  { 
    id: 'm1', 
    type: 'Almuerzo', 
    title: 'Pechuga de pollo a la plancha con arroz y brócoli', 
    description: 'Pechuga marinada a la plancha acompañada de arroz blanco y brócoli al vapor.', 
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
        homeEquipment: ['Bandas elásticas', 'Silla / Banco', 'Esterilla']
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

  const [waterReminderActive, setWaterReminderActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'entreno' | 'nutricion' | 'batidos' | 'despensa' | 'menu' | 'progreso' | 'perfil'>('entreno');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['Plátano', 'Yogur griego', 'Avena']);
  const [smoothieSeed, setSmoothieSeed] = useState<number>(0);
  const [dailyMenu, setDailyMenu] = useState<{ desayuno?: MealIdea; almuerzo?: MealIdea; cena?: MealIdea; bebida?: MealIdea }>({});

  const [selectedExerciseName, setSelectedExerciseName] = useState<string>(EXERCISES[0].name);
  const [weightUsedInput, setWeightUsedInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');
  const [newIngName, setNewIngName] = useState<string>('');
  const [newMealTitle, setNewMealTitle] = useState<string>('');
  const [newMealDesc, setNewMealDesc] = useState<string>('');
  const [newMealCalories, setNewMealCalories] = useState<string>('');

  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(0);
  const [isResting, setIsResting] = useState<boolean>(false);

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

  const getAutoGeneratedRoutine = (): AutoRoutineDay[] => {
    const days = profile.selectedDays || [];
    const locationFilter = profile.workoutLocation || 'Casa';
    const poolExercises = EXERCISES.filter(ex => ex.location === locationFilter);

    return days.map((day, index) => {
      let focus = locationFilter === 'Casa' ? 'Full Body en Casa' : 'Fuerza Gimnasio';
      let routineExs = poolExercises.length > 0 ? poolExercises : EXERCISES;
      
      if (index % 2 === 1 && poolExercises.length > 1) {
        routineExs = [poolExercises[1], poolExercises[0], poolExercises[poolExercises.length - 1] || poolExercises[0]];
      }

      return { day, focus, exercises: routineExs.slice(0, 3) };
    });
  };

  const autoRoutine = getAutoGeneratedRoutine();

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
    bg: '#090d16', card: '#111827', text: '#f9fafb', textSec: '#9ca3af', primary: '#3b82f6', border: '#1f2937', accentGrad: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', navBg: 'rgba(17, 24, 39, 0.85)'
  } : {
    bg: '#f3f4f6', card: '#ffffff', text: '#111827', textSec: '#4b5563', primary: '#2563eb', border: '#e5e7eb', accentGrad: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', navBg: 'rgba(255, 255, 255, 0.85)'
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '20px', paddingBottom: '110px', backgroundColor: t.bg, color: t.text, minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Cabecera */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: t.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px' }}>⚡</div>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: '800', margin: 0 }}>FitApp Pro</h1>
            <p style={{ fontSize: '11px', color: t.textSec, margin: '2px 0 0 0' }}>Hola, <strong style={{ color: t.primary }}>{profile?.name}</strong> ({profile?.weight} kg)</p>
          </div>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer' }}>{isDarkMode ? '☀️' : '🌙'}</button>
      </header>

      {/* PESTAÑA: ENTRENAMIENTO */}
      {activeTab === 'entreno' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Selector de Lugar y Materiales en Casa */}
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
                  {AVAILABLE_HOME_TOOLS.map(tool => {
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

          {/* Días de Entrenamiento */}
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

          {/* Rutina Generada con Vídeos y Sustitutos */}
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

          {/* Registro Modo Libre */}
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '12px' }}>⚡ Registro Modo Libre</h3>
            <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <select value={selectedExerciseName} onChange={e => setSelectedExerciseName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none' }}>
                {EXERCISES.map(ex => (<option key={ex.id} value={ex.name}>{ex.name}</option>))}
              </select>
              <input type="text" placeholder="Peso utilizado (ej: 10 kg)..." value={weightUsedInput} onChange={e => setWeightUsedInput(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none', boxSizing: 'border-box' }} />
              <input type="text" placeholder="Notas..." value={notesInput} onChange={e => setNotesInput(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none', boxSizing: 'border-box' }} />
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
            <p style={{ fontSize: '12px', color: t.textSec, textAlign: 'center', padding: '10px 0' }}>No hay registros aún.</p>
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

      {/* PESTAÑA: PERFIL */}
      {activeTab === 'perfil' && profile && (
        <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', color: t.textSec, marginTop: 0, marginBottom: '14px' }}>👤 Perfil</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
            <label style={{ color: t.textSec, fontWeight: '600' }}>Nombre:
              <input type="text" value={profile.name} onChange={e => handleUpdateActiveProfile('name', e.target.value)} style={{ width: '100%', padding: '10px 12px', marginTop: '4px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none', boxSizing: 'border-box' }} />
            </label>
            <label style={{ color: t.textSec, fontWeight: '600' }}>Peso (kg):
              <input type="number" value={profile.weight} onChange={e => handleUpdateActiveProfile('weight', Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', marginTop: '4px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none', boxSizing: 'border-box' }} />
            </label>
          </div>
        </div>
      )}

      {/* Barra de Navegación Inferior */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: t.navBg, backdropFilter: 'blur(12px)', borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-around', padding: '10px 0 16px 0', maxWidth: '480px', margin: '0 auto', zIndex: 100 }}>
        {[
          { id: 'entreno', label: 'Entreno', icon: '🏋️' },
          { id: 'nutricion', label: 'Nutrición', icon: '🥗' },
          { id: 'batidos', label: 'Batidos', icon: '🥤' },
          { id: 'despensa', label: 'Despensa', icon: '🛒' },
          { id: 'menu', label: 'Menú', icon: '🍽️' },
          { id: 'progreso', label: 'Progreso', icon: '📈' },
          { id: 'perfil', label: 'Perfil', icon: '👤' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', opacity: activeTab === tab.id ? 1 : 0.6 }}
          >
            <span style={{ fontSize: '18px' }}>{tab.icon}</span>
            <span style={{ fontSize: '9px', fontWeight: activeTab === tab.id ? '800' : '500', color: activeTab === tab.id ? t.primary : t.textSec }}>{tab.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}
