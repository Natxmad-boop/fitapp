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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true); // Por defecto en modo oscuro que luce más moderno
  
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
      }, 3600000);
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
    
    const updatedProfiles = profilesList.map(p => p.id === profile.id ? { ...p, selectedDays: updatedDays, trainingDaysPerWeek: updatedDays.length } : p);
    setProfilesList(updatedProfiles);
  };

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

  // Diseño UI Tokens modernos y limpios
  const t = isDarkMode ? {
    bg: '#090d16', 
    card: '#111827', 
    cardHover: '#1f2937',
    text: '#f9fafb', 
    textSec: '#9ca3af', 
    primary: '#3b82f6', 
    primaryGlow: 'rgba(59, 130, 246, 0.15)',
    border: '#1f2937',
    accentGrad: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    navBg: 'rgba(17, 24, 39, 0.85)'
  } : {
    bg: '#f3f4f6', 
    card: '#ffffff', 
    cardHover: '#f9fafb',
    text: '#111827', 
    textSec: '#4b5563', 
    primary: '#2563eb', 
    primaryGlow: 'rgba(37, 99, 235, 0.1)',
    border: '#e5e7eb',
    accentGrad: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    navBg: 'rgba(255, 255, 255, 0.85)'
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '20px', paddingBottom: '110px', backgroundColor: t.bg, color: t.text, minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Cabecera estilizada */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: t.accentGrad, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
            ⚡
          </div>
          <div>
            <h1 style={{ fontSize: '17px', fontWeight: '800', margin: 0, letterSpacing: '-0.3px' }}>FitApp Pro</h1>
            <p style={{ fontSize: '11px', color: t.textSec, margin: '2px 0 0 0' }}>Hola, <strong style={{ color: t.primary }}>{profile?.name}</strong> ({profile?.weight} kg)</p>
          </div>
        </div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)} 
          style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Alerta de descanso flotante */}
      {isResting && (
        <div style={{ background: t.accentGrad, color: '#fff', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', boxShadow: '0 8px 20px rgba(37,99,235,0.3)', animation: 'pulse 2s infinite' }}>
          <span style={{ fontSize: '13px' }}>⏱️ Descanso: {Math.floor(restTimerSeconds / 60)}:{('0' + (restTimerSeconds % 60)).slice(-2)} min</span>
          <button onClick={() => setIsResting(false)} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: '600' }}>Saltar ⏹️</button>
        </div>
      )}

      {/* PESTAÑA: ENTRENAMIENTO */}
      {activeTab === 'entreno' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Selector de días moderno */}
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: t.textSec, marginTop: 0, marginBottom: '8px' }}>📅 Días de Entrenamiento</h2>
            <p style={{ fontSize: '12px', color: t.textSec, margin: '0 0 12px 0' }}>Selecciona tus días para autogenerar la rutina:</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px' }}>
              {DAYS_LIST.map(day => {
                const isSelected = profile.selectedDays?.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => handleToggleSpecificDay(day)}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: '10px', cursor: 'pointer', fontSize: '11px', fontWeight: '700',
                      transition: 'all 0.2s ease',
                      backgroundColor: isSelected ? t.primary : t.bg,
                      color: isSelected ? '#fff' : t.text,
                      border: `1px solid ${isSelected ? t.primary : t.border}`,
                      boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.3)' : 'none'
                    }}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rutina Generada Automáticamente */}
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: t.primary, margin: '0 0 12px 0' }}>🤖 Planificación Inteligente</h3>
            {autoRoutine.length === 0 ? (
              <p style={{ fontSize: '12px', color: t.textSec, margin: 0, textAlign: 'center', padding: '10px 0' }}>Selecciona al menos un día arriba para crear tu rutina.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {autoRoutine.map((item, idx) => (
                  <div key={idx} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '13px', color: t.text }}>Día {item.day}</strong>
                      <span style={{ fontSize: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>{item.focus}</span>
                    </div>
                    <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '12px', color: t.textSec }}>
                      {item.exercises.map((exName, i) => (
                        <li key={i} style={{ margin: '3px 0' }}>{exName}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modo Libre de Registro */}
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: t.textSec, marginTop: 0, marginBottom: '12px' }}>⚡ Registro Modo Libre</h3>
            <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: t.textSec, display: 'block', marginBottom: '4px' }}>Ejercicio:</label>
                <select value={selectedExerciseName} onChange={e => setSelectedExerciseName(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, fontSize: '12px', outline: 'none' }}>
                  {EXERCISES.map(ex => (<option key={ex.id} value={ex.name}>{ex.name}</option>))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: t.textSec, display: 'block', marginBottom: '4px' }}>Peso utilizado:</label>
                <input type="text" placeholder="Ej: 10 kg o peso corporal..." value={weightUsedInput} onChange={e => setWeightUsedInput(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: t.textSec, display: 'block', marginBottom: '4px' }}>Notas:</label>
                <input type="text" placeholder="Sensaciones, repeticiones..." value={notesInput} onChange={e => setNotesInput(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button type="submit" style={{ background: t.accentGrad, color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px', fontSize: '13px', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>Guardar Serie Libre 🚀</button>
            </form>
          </div>

          {/* Notificaciones y Recordatorios */}
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: t.textSec, marginTop: 0, marginBottom: '12px' }}>🔔 Avisos y Notificaciones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: t.bg, padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}` }}>
                <span style={{ fontSize: '12px', fontWeight: '600' }}>Hora de aviso de entreno:</span>
                <input 
                  type="time" 
                  value={profile.reminderTime || '09:00'} 
                  onChange={e => handleUpdateActiveProfile('reminderTime', e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: `1px solid ${t.border}`, backgroundColor: t.card, color: t.text, fontSize: '12px', outline: 'none' }}
                />
              </div>
              <button 
                onClick={requestNotificationPermission} 
                style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '11px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold', width: '100%', boxShadow: '0 4px 12px rgba(16,185,129,0.25)' }}
              >
                🔔 Sincronizar Permisos en el Móvil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA: NUTRICIÓN Y AGUA */}
      {activeTab === 'nutricion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Tarjeta de agua moderna */}
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: t.textSec, margin: 0 }}>💧 Hidratación Diaria</h2>
              <span style={{ fontSize: '13px', fontWeight: '800', color: t.primary }}>{waterGlasses} / 8 vasos</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
              <button onClick={() => setWaterGlasses(prev => Math.max(0, prev - 1))} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', fontWeight: 'bold' }}>➖</button>
              <div style={{ flex: 1, backgroundColor: t.bg, borderRadius: '10px', height: '14px', overflow: 'hidden', border: `1px solid ${t.border}`, padding: '1px' }}>
                <div style={{ width: `${Math.min(100, (waterGlasses / 8) * 100)}%`, background: 'linear-gradient(90deg, #38bdf8 0%, #0284c7 100%)', height: '100%', borderRadius: '8px', transition: 'width 0.3s ease' }}></div>
              </div>
              <button onClick={() => setWaterGlasses(prev => prev + 1)} style={{ backgroundColor: t.primary, color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 14px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(56,189,248,0.3)' }}>➕</button>
            </div>
            <button 
              onClick={() => setWaterReminderActive(!waterReminderActive)}
              style={{ width: '100%', backgroundColor: waterReminderActive ? '#ef4444' : t.bg, color: waterReminderActive ? '#fff' : t.text, border: `1px solid ${waterReminderActive ? '#ef4444' : t.border}`, padding: '10px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              {waterReminderActive ? '🔕 Desactivar alarma horaria de agua' : '🔔 Activar recordatorio periódico de agua'}
            </button>
          </div>

          {/* Filtro de ingredientes */}
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: t.textSec, marginTop: 0, marginBottom: '8px' }}>🛒 ¿Qué tienes en casa?</h2>
            <p style={{ fontSize: '12px', color: t.textSec, margin: '0 0 12px 0' }}>Selecciona tus ingredientes para filtrar platos:</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {customIngredients.map(ing => {
                const isSelected = selectedIngredients.includes(ing);
                return (
                  <button
                    key={ing}
                    onClick={() => handleToggleIngredient(ing)}
                    style={{
                      padding: '7px 12px', borderRadius: '10px', cursor: 'pointer', fontSize: '11px', fontWeight: '600',
                      transition: 'all 0.2s',
                      backgroundColor: isSelected ? t.primary : t.bg,
                      color: isSelected ? '#fff' : t.text,
                      border: `1px solid ${isSelected ? t.primary : t.border}`,
                      boxShadow: isSelected ? '0 4px 10px rgba(37,99,235,0.2)' : 'none'
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
              <div key={meal.id} style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '14px', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>{meal.type}</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: t.textSec }}>⚡ {meal.caloriesApprox}</span>
                </div>
                <strong style={{ fontSize: '13px', display: 'block', margin: '6px 0 4px 0', fontWeight: '700' }}>{meal.title}</strong>
                <p style={{ fontSize: '12px', color: t.textSec, margin: '0' }}>{meal.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA: BATIDOS */}
      {activeTab === 'batidos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#8b5cf6', margin: 0 }}>🪄 Batido Inteligente</h2>
              <button 
                onClick={() => setSmoothieSeed(prev => prev + 1)} 
                style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '11px', color: t.text, fontWeight: '700' }}
              >
                🔄 Otro batido
              </button>
            </div>
            <div style={{ backgroundColor: t.bg, border: '1px dashed #8b5cf6', borderRadius: '12px', padding: '14px' }}>
              <strong style={{ fontSize: '13px', display: 'block', margin: '0 0 4px 0', fontWeight: '700' }}>{generatedSmartSmoothie.title}</strong>
              <p style={{ fontSize: '12px', color: t.textSec, margin: '0 0 8px 0' }}>{generatedSmartSmoothie.description}</p>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#8b5cf6' }}>⚡ Aprox. {generatedSmartSmoothie.caloriesApprox}</span>
            </div>
          </div>

          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: t.textSec, marginTop: 0, marginBottom: '12px' }}>🥤 Crear Batido Personalizado</h3>
            <form onSubmit={handleAddBatidoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <input type="text" placeholder="Nombre del batido..." value={newMealTitle} onChange={e => setNewMealTitle(e.target.value)} style={{ padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none' }} />
              <input type="text" placeholder="Calorías (ej: 250 kcal)..." value={newMealCalories} onChange={e => setNewMealCalories(e.target.value)} style={{ padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none' }} />
              <button type="submit" style={{ backgroundColor: '#8b5cf6', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(139,92,246,0.25)' }}>Guardar Batido 🚀</button>
            </form>
          </div>
        </div>
      )}

      {/* PESTAÑA: DESPENSA */}
      {activeTab === 'despensa' && (
        <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: t.textSec, marginTop: 0, marginBottom: '10px' }}>🧀 Ampliar Despensa</h2>
          <form onSubmit={handleAddIngredientSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input type="text" placeholder="Ej: Fresa, Nueces, Queso..." value={newIngName} onChange={e => setNewIngName(e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, fontSize: '12px', outline: 'none' }} />
            <button type="submit" style={{ background: t.accentGrad, color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', boxShadow: '0 4px 10px rgba(37,99,235,0.2)' }}>Añadir ➕</button>
          </form>
        </div>
      )}

      {/* PESTAÑA: MENÚ */}
      {activeTab === 'menu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: t.textSec, marginTop: 0, marginBottom: '10px' }}>🍽️ Generador de Menú Diario</h2>
            <button onClick={generateDailyMenu} style={{ background: t.accentGrad, color: '#fff', border: 'none', padding: '12px 16px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', width: '100%', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}>🎲 Generar Menú Aleatorio</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {dailyMenu.desayuno && <div style={{ backgroundColor: t.card, padding: '12px 14px', borderRadius: '12px', border: `1px solid ${t.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}><strong style={{fontSize:'12px', color: t.primary}}>🌅 Desayuno:</strong> <div style={{fontSize:'13px', marginTop:'2px'}}>{dailyMenu.desayuno.title}</div></div>}
            {dailyMenu.bebida && <div style={{ backgroundColor: t.card, padding: '12px 14px', borderRadius: '12px', border: `1px solid ${t.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}><strong style={{fontSize:'12px', color:'#8b5cf6'}}>🥤 Batido:</strong> <div style={{fontSize:'13px', marginTop:'2px'}}>{dailyMenu.bebida.title}</div></div>}
            {dailyMenu.almuerzo && <div style={{ backgroundColor: t.card, padding: '12px 14px', borderRadius: '12px', border: `1px solid ${t.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}><strong style={{fontSize:'12px', color: t.primary}}>☀️ Almuerzo:</strong> <div style={{fontSize:'13px', marginTop:'2px'}}>{dailyMenu.almuerzo.title}</div></div>}
            {dailyMenu.cena && <div style={{ backgroundColor: t.card, padding: '12px 14px', borderRadius: '12px', border: `1px solid ${t.border}`, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}><strong style={{fontSize:'12px', color: t.primary}}>🌙 Cena:</strong> <div style={{fontSize:'13px', marginTop:'2px'}}>{dailyMenu.cena.title}</div></div>}
          </div>
        </div>
      )}

      {/* PESTAÑA: PROGRESO */}
      {activeTab === 'progreso' && (
        <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: t.textSec, marginTop: 0, marginBottom: '12px' }}>📈 Historial de Entrenamientos ({logs.length})</h2>
          {logs.length === 0 ? (
            <p style={{ fontSize: '12px', color: t.textSec, textAlign: 'center', padding: '10px 0' }}>No hay registros de entrenamiento aún.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {logs.map(lg => (
                <div key={lg.id} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '12px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: t.textSec, marginBottom: '4px', fontSize: '11px' }}>
                    <span>📅 {lg.date}</span>
                    <strong style={{ color: t.primary }}>{lg.weightUsed}</strong>
                  </div>
                  <strong style={{ fontSize: '13px', display: 'block', fontWeight: '700' }}>{lg.exerciseName}</strong>
                  <p style={{ margin: '4px 0 0 0', color: t.textSec, fontSize: '11px' }}>{lg.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA: PERFIL */}
      {activeTab === 'perfil' && profile && (
        <div style={{ backgroundColor: t.card, borderRadius: '16px', padding: '16px', border: `1px solid ${t.border}`, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '13px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', color: t.textSec, marginTop: 0, marginBottom: '14px' }}>👤 Configuración de Perfil</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
            <label style={{ color: t.textSec, fontWeight: '600' }}>Nombre:
              <input type="text" value={profile.name} onChange={e => handleUpdateActiveProfile('name', e.target.value)} style={{ width: '100%', padding: '10px 12px', marginTop: '4px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none', boxSizing: 'border-box' }} />
            </label>
            <label style={{ color: t.textSec, fontWeight: '600' }}>Peso actual (kg):
              <input type="number" value={profile.weight} onChange={e => handleUpdateActiveProfile('weight', Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', marginTop: '4px', borderRadius: '10px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, outline: 'none', boxSizing: 'border-box' }} />
            </label>
          </div>
        </div>
      )}

      {/* Barra de Navegación Inferior Estilizada (Glassmorphism) */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: t.navNavBg || t.navBg, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-around', padding: '10px 0 16px 0', maxWidth: '480px', margin: '0 auto', zIndex: 100 }}>
        {[
          { id: 'entreno', label: 'Entreno', icon: '🏋️' },
          { id: 'nutricion', label: 'Nutrición', icon: '🥗' },
          { id: 'batidos', label: 'Batidos', icon: '🥤', color: '#8b5cf6' },
          { id: 'despensa', label: 'Despensa', icon: '🛒' },
          { id: 'menu', label: 'Menú', icon: '🍽️' },
          { id: 'progreso', label: 'Progreso', icon: '📈' },
          { id: 'perfil', label: 'Perfil', icon: '👤' },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          const activeColor = tab.color || t.primary;
          return (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)} 
              style={{ 
                background: 'none', border: 'none', cursor: 'pointer', 
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
                opacity: isActive ? 1 : 0.6,
                transform: isActive ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              <span style={{ fontSize: '9px', fontWeight: isActive ? '800' : '500', color: isActive ? activeColor : t.textSec }}>{tab.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
