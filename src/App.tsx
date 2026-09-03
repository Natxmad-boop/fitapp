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

interface CustomWorkoutRoutine {
  id: string;
  name: string;
  exercises: string[];
}

interface AutoRoutineDay {
  day: string;
  focus: string;
  exercises: string[];
}

const INITIAL_INGREDIENTS = [
  'Pollo', 'Ternera', 'Salmón', 'Huevo', 'Arroz', 'Avena', 
  'Brócoli', 'Espinacas', 'Aguacate', 'Plátano', 'Manzana', 
  'Fresa', 'Queso batido', 'Yogur griego', 'Leche', 'Proteína en polvo'
];

const EXERCISES: Exercise[] = [
  { 
    id: 'c_emp_1', 
    name: 'Flexiones Declinadas con Banda', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Bandas elásticas y silla', 
    homeSubstitute: 'Flexiones normales en suelo',
    instructions: 'Pies elevados en silla, banda cruzada en la espalda para añadir resistencia.',
    videoUrl: 'https://www.youtube.com/results?search_query=flexiones+declinadas+con+bandas'
  },
  { 
    id: 'c_trac_1', 
    name: 'Remo al Pecho con Banda', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Bandas elásticas', 
    homeSubstitute: 'Remo con mochila pesada',
    instructions: 'Pisa la banda, sujeta los extremos y rema hacia las costillas apretando la espalda.',
    videoUrl: 'https://www.youtube.com/results?search_query=remo+con+banda+elastica+espalda'
  },
  { 
    id: 'c_leg_1', 
    name: 'Sentadillas Búlgaras con Banda', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Bandas elásticas y silla', 
    homeSubstitute: 'Zancadas estáticas',
    instructions: 'Apoya un pie en la silla detrás, pasa la banda por el pie delantero y sujeta en los hombros.',
    videoUrl: 'https://www.youtube.com/results?search_query=sentadillas+bulgaras+con+banda+elastica'
  },
  { 
    id: 'c_core_1', 
    name: 'Plancha Abdominal con Toque de Hombros', 
    location: 'Casa', 
    category: 'Core', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Plancha estática',
    instructions: 'En posición de plancha alta, toca alternativamente tus hombros sin girar la cadera.',
    videoUrl: 'https://www.youtube.com/results?search_query=plancha+con+toque+de+hombros'
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
      { id: 'user_1', name: 'Eli', weight: 50, goal: ['Ganar fuerza'], allergies: [], trainingDaysPerWeek: 3, reminderTime: '09:00', selectedDays: ['Lun', 'Mié', 'Vie'] }
    ];
  });

  const [activeUserId, setActiveUserId] = useState<string>(() => {
    const savedId = localStorage.getItem('fitapp_active_user_id');
    return savedId || 'user_1';
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

  const [customRoutines, setCustomRoutines] = useState<CustomWorkoutRoutine[]>(() => {
    const saved = localStorage.getItem('fitapp_custom_routines');
    return saved ? JSON.parse(saved) : [
      { id: 'rut_1', name: 'Full Body Base (Casa)', exercises: ['Flexiones Declinadas con Banda', 'Remo al Pecho con Banda', 'Sentadillas Búlgaras con Banda', 'Plancha Abdominal con Toque de Hombros'] }
    ];
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['Plátano', 'Yogur griego', 'Avena']);
  const [smoothieSeed, setSmoothieSeed] = useState<number>(0);
  
  const [dailyMenu, setDailyMenu] = useState<{ desayuno?: MealIdea; almuerzo?: MealIdea; cena?: MealIdea; snack?: MealIdea; bebida?: MealIdea }>({});

  const [selectedExerciseName, setSelectedExerciseName] = useState<string>(EXERCISES[0].name);
  const [weightUsedInput, setWeightUsedInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');

  const [newIngName, setNewIngName] = useState<string>('');
  const [newMealTitle, setNewMealTitle] = useState<string>('');
  const [newMealDesc, setNewMealDesc] = useState<string>('');
  const [newMealCalories, setNewMealCalories] = useState<string>('');

  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(0);
  const [isResting, setIsResting] = useState<boolean>(false);

  // Alertas de Entrenamiento y Agua
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      const currentDayIndex = now.getDay();
      const mapDays: Record<number, string> = { 1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb', 0: 'Dom' };
      const currentDayName = mapDays[currentDayIndex];

      if (Notification.permission === 'granted') {
        // Alarma de entreno
        if (profile.reminderTime === currentTimeStr && profile.selectedDays?.includes(currentDayName)) {
          new Notification('FitApp Pro ⚡ Entreno', {
            body: `¡Hola ${profile.name}! Es hora de tu entrenamiento de hoy (${currentDayName}). ¡A por todas! 💪`,
            icon: '🏋️'
          });
        }
      }
    }, 30000);

    return () => clearInterval(checkInterval);
  }, [profile.reminderTime, profile.selectedDays, profile.name]);

  // Recordatorio periódico de agua (cada hora si está activado)
  useEffect(() => {
    let waterInterval: any = null;
    if (waterReminderActive) {
      waterInterval = setInterval(() => {
        if (Notification.permission === 'granted') {
          new Notification('💧 FitApp Pro - Hidratación', {
            body: `¡Hora de beber un vaso de agua! Llevas ${waterGlasses}/8 vasos hoy. 🌊`,
            icon: '🥤'
          });
        }
      }, 3600000); // Cada 1 hora
    }
    return () => clearInterval(waterInterval);
  }, [waterReminderActive, waterGlasses]);

  const requestNotificationPermission = () => {
    if (!('Notification' in window)) {
      alert('⚠️ Este navegador no soporta notificaciones.');
      return;
    }
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        alert('🔔 ¡Permiso de notificaciones concedido con éxito!');
      } else {
        alert('❌ Permiso denegado.');
      }
    });
  };

  useEffect(() => {
    let interval: any = null;
    if (isResting && restTimerSeconds > 0) {
      interval = setInterval(() => {
        setRestTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (restTimerSeconds === 0 && isResting) {
      setIsResting(false);
      alert('⏰ ¡Tiempo de descanso finalizado! A por la siguiente serie 💪');
    }
    return () => clearInterval(interval);
  }, [isResting, restTimerSeconds]);

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
    localStorage.setItem('fitapp_custom_routines', JSON.stringify(customRoutines));
  }, [customRoutines]);

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

  // Selector de días que autogenera la rutina inteligente
  const handleToggleSpecificDay = (dayKey: string) => {
    const currentDays = profile.selectedDays || [];
    const updatedDays = currentDays.includes(dayKey)
      ? currentDays.filter(d => d !== dayKey)
      : [...currentDays, dayKey];
    
    const updatedProfiles = profilesList.map(p => p.id === profile.id ? { ...p, selectedDays: updatedDays, trainingDaysPerWeek: updatedDays.length } : p);
    setProfilesList(updatedProfiles);
  };

  // Generador inteligente automático de rutina basado en los días seleccionados
  const getAutoGeneratedRoutine = (): AutoRoutineDay[] => {
    const days = profile.selectedDays || [];
    return days.map((day, index) => {
      let focus = 'Full Body Fuerza';
      let exercises = ['Flexiones Declinadas con Banda', 'Remo al Pecho con Banda', 'Sentadillas Búlgaras con Banda'];
      
      if (index % 3 === 1) {
        focus = 'Core & Movilidad';
        exercises = ['Plancha Abdominal con Toque de Hombros', 'Movilidad de Cadera', 'Sentadillas Búlgaras con Banda'];
      } else if (index % 3 === 2) {
        focus = 'Tren Superior & Push';
        exercises = ['Flexiones Declinadas con Banda', 'Remo al Pecho con Banda', 'Plancha Abdominal con Toque de Hombros'];
      }
      return { day, focus, exercises };
    });
  };

  const handleToggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) ? prev.filter(i => i !== ingredient) : [...prev, ingredient]
    );
  };

  const handleAddIngredientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newIngName.trim();
    if (!cleanName) return;
    if (customIngredients.includes(cleanName)) return;
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

  const handleSubstituteExercise = (currentExName: string) => {
    const alternatives = EXERCISES.filter(ex => ex.name !== currentExName);
    if (alternatives.length === 0) return;
    const randomAlternative = alternatives[Math.floor(Math.random() * alternatives.length)];
    alert(`🔄 Ejercicio sustituto sugerido:\n\n👉 "${randomAlternative.name}"`);
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
    description: selectedIngredients.length > 0 ? `Combinación optimizada con tus ingredientes: ${selectedIngredients.join(', ')}.` : 'Selecciona ingredientes en Nutrición para personalizarlo.',
    caloriesApprox: `${180 + ((selectedIngredients.length * 25 + smoothieSeed * 15) % 150)} kcal`
  };

  const autoRoutine = getAutoGeneratedRoutine();

  const t = isDarkMode ? {
    bg: '#0f172a', card: '#1e293b', text: '#f8fafc', textSec: '#94a3b8', primary: '#38bdf8', border: '#334155'
  } : {
    bg: '#f8fafc', card: '#ffffff', text: '#0f172a', textSec: '#64748b', primary: '#0284c7', border: '#e2e8f0'
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '16px', paddingBottom: '90px', backgroundColor: t.bg, color: t.text, minHeight: '100vh', boxSizing: 'border-box' }}>
      
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '18px', margin: 0, color: t.primary }}>FitApp Pro ⚡</h1>
          <p style={{ fontSize: '11px', color: t.textSec, margin: '2px 0 0 0' }}>Usuario: <strong>{profile?.name}</strong> ({profile?.weight} kg)</p>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {isResting && (
        <div style={{ backgroundColor: '#0284c7', color: '#fff', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
          <span>⏱️ Descanso: {Math.floor(restTimerSeconds / 60)}:{('0' + (restTimerSeconds % 60)).slice(-2)} min</span>
          <button onClick={() => setIsResting(false)} style={{ background: '#fff', color: '#0284c7', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '10px' }}>Saltar ⏹️</button>
        </div>
      )}

      {/* PESTAÑA: ENTRENAMIENTO (CON RUTINA AUTOMÁTICA Y MODO LIBRE) */}
      {activeTab === 'entreno' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Selector de días */}
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '6px' }}>📅 Días de Entrenamiento</h2>
            <p style={{ fontSize: '11px', color: t.textSec, margin: '0 0 8px 0' }}>Elige tus días y el sistema creará tu rutina:</p>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {DAYS_LIST.map(day => {
                const isSelected = profile.selectedDays?.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => handleToggleSpecificDay(day)}
                    style={{
                      padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold',
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

          {/* Rutina Generada Automáticamente */}
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '14px', margin: '0 0 8px 0', color: t.primary }}>🤖 Rutina Generada Automáticamente</h3>
            {autoRoutine.length === 0 ? (
              <p style={{ fontSize: '11px', color: t.textSec, margin: 0 }}>Selecciona al menos un día arriba para generar tu planificación.</p>
            ) : (
              autoRoutine.map((item, idx) => (
                <div key={idx} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '12px', color: t.primary }}>📌 Día: {item.day}</strong>
                    <span style={{ fontSize: '10px', backgroundColor: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>{item.focus}</span>
                  </div>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '11px', color: t.textSec }}>
                    {item.exercises.map((exName, i) => (
                      <li key={i} style={{ margin: '2px 0' }}>{exName}</li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>

          {/* Modo Libre de Registro */}
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '14px', marginTop: 0, marginBottom: '8px' }}>⚡ Registro de Modo Libre</h3>
            <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <select value={selectedExerciseName} onChange={e => setSelectedExerciseName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}>
                {EXERCISES.map(ex => (<option key={ex.id} value={ex.name}>{ex.name}</option>))}
              </select>
              <input type="text" placeholder="Peso añadido (ej: 10 kg o libre)..." value={weightUsedInput} onChange={e => setWeightUsedInput(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
              <input type="text" placeholder="Notas del entrenamiento..." value={notesInput} onChange={e => setNotesInput(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
              <button type="submit" style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Guardar Serie Libre 🚀</button>
            </form>
          </div>

          {/* Notificaciones y Recordatorios */}
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '13px', marginTop: 0, marginBottom: '6px' }}>🔔 Avisos y Notificaciones Push</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: t.textSec }}>Hora de entreno:</span>
                <input 
                  type="time" 
                  value={profile.reminderTime || '09:00'} 
                  onChange={e => handleUpdateActiveProfile('reminderTime', e.target.value)}
                  style={{ padding: '6px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, fontSize: '12px' }}
                />
              </div>
              <button 
                onClick={requestNotificationPermission} 
                style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
              >
                🔔 Activar Permisos en el Móvil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA: NUTRICIÓN Y AGUA CON RECORDATORIO */}
      {activeTab === 'nutricion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '14px', margin: 0 }}>💧 Hidratación y Alarma</h2>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: t.primary }}>{waterGlasses} / 8 vasos</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
              <button onClick={() => setWaterGlasses(prev => Math.max(0, prev - 1))} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>➖</button>
              <div style={{ flex: 1, backgroundColor: t.bg, borderRadius: '8px', height: '12px', overflow: 'hidden', border: `1px solid ${t.border}` }}>
                <div style={{ width: `${Math.min(100, (waterGlasses / 8) * 100)}%`, backgroundColor: '#38bdf8', height: '100%' }}></div>
              </div>
              <button onClick={() => setWaterGlasses(prev => prev + 1)} style={{ backgroundColor: t.primary, color: '#fff', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: 'bold' }}>➕ Vaso</button>
            </div>
            <button 
              onClick={() => setWaterReminderActive(!waterReminderActive)}
              style={{ width: '100%', backgroundColor: waterReminderActive ? '#ef4444' : '#0284c7', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {waterReminderActive ? '🔕 Desactivar aviso de agua cada hora' : '🔔 Activar recordatorio periódico de agua'}
            </button>
          </div>

          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '6px' }}>🛒 Selecciona tus Ingredientes</h2>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {customIngredients.map(ing => {
                const isSelected = selectedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => handleToggleIngredient(ing)}
                    style={{
                      padding: '6px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '600',
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

          <h3 style={{ fontSize: '15px', margin: '4px 0' }}>🍳 Platos ({solidMealsList.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {solidMealsList.map(meal => (
              <div key={meal.id} style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '12px' }}>
                <span style={{ fontSize: '10px', backgroundColor: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{meal.type}</span>
                <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0' }}>{meal.title}</strong>
                <p style={{ fontSize: '12px', color: t.textSec, margin: '0' }}>{meal.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA: BATIDOS */}
      {activeTab === 'batidos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '14px', margin: 0, color: '#8b5cf6' }}>🪄 Batido Generado</h2>
              <button 
                onClick={() => setSmoothieSeed(prev => prev + 1)} 
                style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '11px', color: t.text, fontWeight: 'bold' }}
              >
                🔄 Cambiar idea
              </button>
            </div>
            <div style={{ backgroundColor: t.bg, border: '1px dashed #8b5cf6', borderRadius: '8px', padding: '10px' }}>
              <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0' }}>{generatedSmartSmoothie.title}</strong>
              <p style={{ fontSize: '11px', color: t.textSec, margin: '0 0 6px 0' }}>{generatedSmartSmoothie.description}</p>
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: t.primary }}>⚡ {generatedSmartSmoothie.caloriesApprox}</span>
            </div>
          </div>

          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '14px', marginTop: 0, marginBottom: '6px' }}>🥤 Crear Batido Personalizado</h3>
            <form onSubmit={handleAddBatidoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <input type="text" placeholder="Nombre..." value={newMealTitle} onChange={e => setNewMealTitle(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
              <input type="text" placeholder="Calorías (ej: 250 kcal)..." value={newMealCalories} onChange={e => setNewMealCalories(e.target.value)} style={{ padding: '8px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
              <button type="submit" style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Guardar Batido 🚀</button>
            </form>
          </div>
        </div>
      )}

      {/* PESTAÑA: DESPENSA */}
      {activeTab === 'despensa' && (
        <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '6px' }}>🧀 Añadir Alimento</h2>
          <form onSubmit={handleAddIngredientSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input type="text" placeholder="Ej: Fresa, Leche..." value={newIngName} onChange={e => setNewIngName(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, fontSize: '12px' }} />
            <button type="submit" style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Añadir ➕</button>
          </form>
        </div>
      )}

      {/* PESTAÑA: MENÚ */}
      {activeTab === 'menu' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, marginBottom: '14px' }}>
            <h2 style={{ fontSize: '15px', marginTop: 0, marginBottom: '6px' }}>🍽️ Generador de Menú</h2>
            <button onClick={generateDailyMenu} style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', width: '100%' }}>🎲 Generar Menú del Día</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
            {dailyMenu.desayuno && <div style={{ backgroundColor: t.card, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}` }}><strong style={{fontSize:'12px'}}>🌅 Desayuno:</strong> {dailyMenu.desayuno.title}</div>}
            {dailyMenu.bebida && <div style={{ backgroundColor: t.card, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}` }}><strong style={{fontSize:'12px', color:'#8b5cf6'}}>🥤 Batido:</strong> {dailyMenu.bebida.title}</div>}
            {dailyMenu.almuerzo && <div style={{ backgroundColor: t.card, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}` }}><strong style={{fontSize:'12px'}}>☀️ Almuerzo:</strong> {dailyMenu.almuerzo.title}</div>}
            {dailyMenu.cena && <div style={{ backgroundColor: t.card, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}` }}><strong style={{fontSize:'12px'}}>🌙 Cena:</strong> {dailyMenu.cena.title}</div>}
          </div>
        </div>
      )}

      {/* PESTAÑA: PROGRESO */}
      {activeTab === 'progreso' && (
        <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '10px' }}>📈 Historial de Entrenamientos ({logs.length})</h2>
          {logs.length === 0 ? (
            <p style={{ fontSize: '12px', color: t.textSec }}>No hay entrenamientos registrados aún.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {logs.map(lg => (
                <div key={lg.id} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '10px', fontSize: '11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: t.textSec, marginBottom: '2px' }}>
                    <span>📅 {lg.date}</span>
                    <strong style={{ color: t.primary }}>{lg.weightUsed}</strong>
                  </div>
                  <strong style={{ fontSize: '12px', display: 'block' }}>{lg.exerciseName}</strong>
                  <p style={{ margin: '4px 0 0 0', color: t.textSec }}>{lg.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA: PERFIL */}
      {activeTab === 'perfil' && profile && (
        <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '15px', marginTop: 0 }}>👤 Perfil: {profile.name}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', marginTop: '10px' }}>
            <label>Nombre:
              <input type="text" value={profile.name} onChange={e => handleUpdateActiveProfile('name', e.target.value)} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
            </label>
            <label>Peso (kg):
              <input type="number" value={profile.weight} onChange={e => handleUpdateActiveProfile('weight', Number(e.target.value))} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
            </label>
          </div>
        </div>
      )}

      {/* Navegación Inferior */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: t.card, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-around', padding: '8px 0', maxWidth: '480px', margin: '0 auto', zIndex: 100 }}>
        <button onClick={() => setActiveTab('entreno')} style={{ background: 'none', border: 'none', fontSize: '9px', fontWeight: activeTab === 'entreno' ? '700' : '400', color: activeTab === 'entreno' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '15px' }}>🏋️</span> Entreno
        </button>
        <button onClick={() => setActiveTab('nutricion')} style={{ background: 'none', border: 'none', fontSize: '9px', fontWeight: activeTab === 'nutricion' ? '700' : '400', color: activeTab === 'nutricion' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '15px' }}>🥗</span> Nutrición
        </button>
        <button onClick={() => setActiveTab('batidos')} style={{ background: 'none', border: 'none', fontSize: '9px', fontWeight: activeTab === 'batidos' ? '700' : '400', color: activeTab === 'batidos' ? '#8b5cf6' : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '15px' }}>🥤</span> Batidos
        </button>
        <button onClick={() => setActiveTab('despensa')} style={{ background: 'none', border: 'none', fontSize: '9px', fontWeight: activeTab === 'despensa' ? '700' : '400', color: activeTab === 'despensa' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '15px' }}>🛒</span> Despensa
        </button>
        <button onClick={() => setActiveTab('menu')} style={{ background: 'none', border: 'none', fontSize: '9px', fontWeight: activeTab === 'menu' ? '700' : '400', color: activeTab === 'menu' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '15px' }}>🍽️</span> Menú
        </button>
        <button onClick={() => setActiveTab('progreso')} style={{ background: 'none', border: 'none', fontSize: '9px', fontWeight: activeTab === 'progreso' ? '700' : '400', color: activeTab === 'progreso' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '15px' }}>📈</span> Progreso
        </button>
        <button onClick={() => setActiveTab('perfil')} style={{ background: 'none', border: 'none', fontSize: '9px', fontWeight: activeTab === 'perfil' ? '700' : '400', color: activeTab === 'perfil' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '15px' }}>👤</span> Perfil
        </button>
      </nav>

    </div>
  );
}
