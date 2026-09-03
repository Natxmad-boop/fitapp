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
  trainingDaysPerWeek: number; // Nuevo: días elegidos a la semana
}

interface MealIdea {
  id: string;
  type: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
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

const AVAILABLE_GOALS = [
  'Ganar fuerza',
  'Perder grasa',
  'Ganar masa muscular',
  'Mejorar resistencia',
  'Movilidad y salud'
];

const INITIAL_INGREDIENTS = [
  'Pollo', 'Ternera', 'Lomo', 'Salmón', 'Atún', 'Merluza', 'Huevo', 
  'Arroz', 'Patata', 'Avena', 'Pan integral', 'Garbanzos', 'Lentejas',
  'Brócoli', 'Zanahoria', 'Espinacas', 'Tomate', 'Aguacate', 'Calabacín',
  'Queso fresco', 'Yogur', 'Plátano', 'Manzana', 'Nueces', 'Almendras',
  'Queso batido', 'Yogur griego'
];

const AVAILABLE_ALLERGIES = [
  'Gluten',
  'Lactosa',
  'Frutos secos',
  'Pescado',
  'Huevo',
  'Marisco'
];

const EXERCISES: Exercise[] = [
  // --- CALISTENIA / CASA CON BANDAS Y PESO CORPORAL ---
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
    id: 'c_emp_2', 
    name: 'Flexiones Diamante', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Flexiones cerradas',
    instructions: 'Manos juntas bajo el pecho para enfocar el esfuerzo en tríceps.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+hacer+flexiones+diamante'
  },
  { 
    id: 'c_emp_3', 
    name: 'Flexiones en Pica (Pike Push-ups)', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Press militar con botellas',
    instructions: 'Cadera arriba formando una V invertida, baja la cabeza hacia el suelo para hombros.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+hacer+flexiones+en+pica'
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
    id: 'c_trac_2', 
    name: 'Remo Inclinado a una mano con Banda', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Bandas elásticas', 
    homeSubstitute: 'Remo a una mano con garrafa',
    instructions: 'Pisa un extremo con un pie de lado y tira del otro extremo hacia la cadera.',
    videoUrl: 'https://www.youtube.com/results?search_query=remo+a+una+mano+con+bandas+elasticas'
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
    id: 'c_leg_2', 
    name: 'Peso Muerto Rumano con Banda', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Bandas elásticas', 
    homeSubstitute: 'Peso muerto con garrafa',
    instructions: 'Pisa la banda con ambos pies, mantén la espalda recta y lleva la cadera atrás.',
    videoUrl: 'https://www.youtube.com/results?search_query=peso+muerto+con+bandas+elasticas'
  },
  { 
    id: 'c_leg_3', 
    name: 'Puente de Glúteos a una pierna', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Puente de glúteos normal',
    instructions: 'Tumbado boca arriba, eleva la cadera apoyando solo un talón.',
    videoUrl: 'https://www.youtube.com/results?search_query=puente+de+gluteos+a+una+pierna'
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
  },
  { 
    id: 'c_core_2', 
    name: 'Hollow Body Hold (Tensión Constante)', 
    location: 'Casa', 
    category: 'Core', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Elevación de piernas',
    instructions: 'Tumbado boca arriba, eleva ligeramente piernas y hombros despegando la zona lumbar.',
    videoUrl: 'https://www.youtube.com/results?search_query=hollow+body+hold+ejercicio'
  },
  // --- GIMNASIO ---
  { 
    id: 'g_1', 
    name: 'Press de Banca Plano', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Barra y banco', 
    homeSubstitute: 'No aplica',
    instructions: 'Acuéstate, baja la barra de manera controlada al pecho y empuja hacia arriba.',
    videoUrl: 'https://www.youtube.com/results?search_query=press+de+banca+plano+tecnica'
  },
  { 
    id: 'g_2', 
    name: 'Sentadilla con Barra Libre', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Jaula y barra', 
    homeSubstitute: 'No aplica',
    instructions: 'Barra en los trapecios, rompe el paralelo bajando la cadera y sube firme.',
    videoUrl: 'https://www.youtube.com/results?search_query=sentadilla+con+barra+libre+tecnica'
  },
  { 
    id: 'g_3', 
    name: 'Dominadas Asistidas / Libres', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Barra fija', 
    homeSubstitute: 'No aplica',
    instructions: 'Tira con la fuerza de la espalda llevando el pecho hacia la barra.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+hacer+dominadas+correctamente'
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
    title: 'Tostada integral con aguacate y huevo pochado', 
    description: 'Pan integral, medio aguacate machacado por encima y un huevo pochado.', 
    caloriesApprox: '320 kcal',
    ingredients: ['Pan integral', 'Aguacate', 'Huevo'],
    allergens: ['Gluten', 'Huevo'] 
  },
  { 
    id: 'm12',
    type: 'Snack',
    title: 'Bol de queso batido con arándanos y almendras',
    description: 'Queso batido cremoso rico en proteínas con frutos secos.',
    caloriesApprox: '220 kcal',
    ingredients: ['Queso batido', 'Almendras'],
    allergens: ['Lactosa', 'Frutos secos']
  },
  {
    id: 'm13',
    type: 'Desayuno',
    title: 'Yogur griego con plátano y nueces',
    description: 'Yogur griego natural con rodajas de plátano y nueces crujientes.',
    caloriesApprox: '340 kcal',
    ingredients: ['Yogur griego', 'Plátano', 'Nueces'],
    allergens: ['Lactosa', 'Frutos secos']
  }
];

export default function App() {
  const [profilesList, setProfilesList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('fitapp_profiles_directory');
    return saved ? JSON.parse(saved) : [
      { id: 'user_1', name: 'Nacho', weight: 70, goal: ['Ganar fuerza'], allergies: [], trainingDaysPerWeek: 3 }
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

  // Rutinas creadas por el usuario (Modo Libre / Creador)
  const [customRoutines, setCustomRoutines] = useState<CustomWorkoutRoutine[]>(() => {
    const saved = localStorage.getItem('fitapp_custom_routines');
    return saved ? JSON.parse(saved) : [
      { id: 'rut_1', name: 'Full Body Base (Casa)', exercises: ['Flexiones Declinadas con Banda', 'Remo al Pecho con Banda', 'Sentadillas Búlgaras con Banda', 'Plancha Abdominal con Toque de Hombros'] }
    ];
  });

  const [activeTab, setActiveTab] = useState<'entreno' | 'nutricion' | 'despensa' | 'menu' | 'progreso' | 'perfil'>('entreno');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<'Todos' | 'Casa' | 'Gimnasio'>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [dailyMenu, setDailyMenu] = useState<{ desayuno?: MealIdea; almuerzo?: MealIdea; cena?: MealIdea; snack?: MealIdea }>({});

  const [selectedExerciseName, setSelectedExerciseName] = useState<string>(EXERCISES[0].name);
  const [weightUsedInput, setWeightUsedInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');

  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserWeight, setNewUserWeight] = useState<string>('');
  const [newUserGoals, setNewUserGoals] = useState<string[]>(['Ganar fuerza']);
  const [newUserAllergies, setNewUserAllergies] = useState<string[]>([]);

  // Estados Despensa / Recetas
  const [newIngName, setNewIngName] = useState<string>('');
  const [newMealTitle, setNewMealTitle] = useState<string>('');
  const [newMealType, setNewMealType] = useState<'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack'>('Almuerzo');
  const [newMealDesc, setNewMealDesc] = useState<string>('');
  const [newMealCalories, setNewMealCalories] = useState<string>('');
  const [newMealSelectedIngs, setNewMealSelectedIngs] = useState<string[]>([]);
  const [newMealAllergens, setNewMealAllergens] = useState<string[]>([]);

  // Estados para Creador de Rutinas Libres
  const [newRoutineName, setNewRoutineName] = useState<string>('');
  const [newRoutineSelectedExs, setNewRoutineSelectedExs] = useState<string[]>([]);

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

  const handleToggleActiveGoal = (goalOption: string) => {
    const currentGoals = profile.goal || [];
    let updatedGoals = currentGoals.includes(goalOption) 
      ? currentGoals.filter(g => g !== goalOption) 
      : [...currentGoals, goalOption];
    if (updatedGoals.length === 0) return;
    handleUpdateActiveProfile('goal', updatedGoals);
  };

  const handleToggleActiveAllergy = (allergyOption: string) => {
    const currentAllergies = profile.allergies || [];
    let updatedAllergies = currentAllergies.includes(allergyOption)
      ? currentAllergies.filter(a => a !== allergyOption)
      : [...currentAllergies, allergyOption];
    handleUpdateActiveProfile('allergies', updatedAllergies);
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
    if (customIngredients.includes(cleanName)) {
      alert('⚠️ Este alimento ya existe.');
      return;
    }
    setCustomIngredients([...customIngredients, cleanName]);
    setNewIngName('');
    alert(`¡Alimento "${cleanName}" añadido con éxito! 🛒`);
  };

  const handleAddMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMealTitle.trim()) return;

    const newMealObj: MealIdea = {
      id: 'custom_meal_' + Date.now(),
      type: newMealType,
      title: newMealTitle.trim(),
      description: newMealDesc.trim() || 'Receta de despensa.',
      caloriesApprox: newMealCalories.trim() ? `${newMealCalories.trim()} kcal` : '350 kcal',
      ingredients: newMealSelectedIngs.length > 0 ? newMealSelectedIngs : ['Queso batido'],
      allergens: newMealAllergens
    };

    setCustomMeals([newMealObj, ...customMeals]);
    setNewMealTitle('');
    setNewMealDesc('');
    setNewMealCalories('');
    setNewMealSelectedIngs([]);
    setNewMealAllergens([]);
    alert(`¡Receta añadida correctamente! 🍳`);
  };

  // Función de sustitución instantánea ("Cambiar ejercicio")
  const handleSubstituteExercise = (currentExName: string) => {
    const currentExObj = EXERCISES.find(ex => ex.name === currentExName);
    const categoryToMatch = currentExObj ? currentExObj.category : 'Fuerza';
    const locationToMatch = currentExObj ? currentExObj.location : 'Casa';

    const alternatives = EXERCISES.filter(ex => 
      ex.name !== currentExName && 
      ex.category === categoryToMatch && 
      ex.location === locationToMatch
    );

    if (alternatives.length === 0) {
      alert('⚠️ No hay otra alternativa exacta en esta categoría, pero puedes elegir cualquier otro ejercicio de la lista.');
      return;
    }

    const randomAlternative = alternatives[Math.floor(Math.random() * alternatives.length)];
    alert(`🔄 Ejercicio sustituto sugerido:\n\n⭐ En lugar de "${currentExName}", prueba hoy:\n👉 "${randomAlternative.name}"\n\n💡 Material: ${randomAlternative.equipment}`);
  };

  // Crear rutina personalizada propia (Modo Libre)
  const handleCreateRoutineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineName.trim() || newRoutineSelectedExs.length === 0) {
      alert('⚠️ Ponle un nombre a tu rutina y selecciona al menos un ejercicio.');
      return;
    }

    const newRoutine: CustomWorkoutRoutine = {
      id: 'rut_' + Date.now(),
      name: newRoutineName.trim(),
      exercises: newRoutineSelectedExs
    };

    setCustomRoutines([...customRoutines, newRoutine]);
    setNewRoutineName('');
    setNewRoutineSelectedExs([]);
    alert('¡Tu rutina personalizada ha sido guardada con éxito! 💪');
  };

  const handleDeleteCustomRoutine = (routineId: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta rutina personalizada?')) {
      setCustomRoutines(customRoutines.filter(r => r.id !== routineId));
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;

    const newId = 'user_' + Date.now();
    const newUser: UserProfile = {
      id: newId,
      name: newUserName.trim(),
      weight: Number(newUserWeight) || 65,
      goal: newUserGoals,
      allergies: newUserAllergies,
      trainingDaysPerWeek: 3
    };

    setProfilesList([...profilesList, newUser]);
    setActiveUserId(newId);
    setNewUserName('');
    setNewUserWeight('');
    alert(`¡Perfil creado con éxito! 🎉`);
  };

  const handleDeleteUserProfile = (userIdToDelete: string) => {
    if (profilesList.length <= 1) {
      alert('⚠️ No puedes borrar el único perfil.');
      return;
    }
    if (window.confirm('¿Estás seguro de eliminar este perfil?')) {
      localStorage.removeItem(`fitapp_logs_${userIdToDelete}`);
      const updated = profilesList.filter(p => p.id !== userIdToDelete);
      setProfilesList(updated);
      if (activeUserId === userIdToDelete) setActiveUserId(updated[0].id);
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExerciseName) return;

    const newLog: WorkoutLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      exerciseName: selectedExerciseName,
      weightUsed: weightUsedInput ? `${weightUsedInput}` : 'Peso corporal',
      notes: notesInput || 'Completado'
    };

    setLogs([newLog, ...logs]);
    setWeightUsedInput('');
    setNotesInput('');
    alert(`¡Entrenamiento guardado para ${profile.name}! 🚀`);
  };

  const generateDailyMenu = () => {
    const userAllergies = profile.allergies || [];
    let safeMeals = customMeals.filter(meal => !meal.allergens.some(al => userAllergies.includes(al)));
    const matchingMeals = safeMeals.filter(meal => 
      selectedIngredients.length === 0 || meal.ingredients.some(ing => selectedIngredients.includes(ing))
    );
    const pool = matchingMeals.length > 0 ? matchingMeals : safeMeals;

    const getRandom = (arr: MealIdea[]) => arr.length > 0 ? arr[Math.floor(Math.random() * arr.length)] : undefined;

    setDailyMenu({
      desayuno: getRandom(pool.filter(m => m.type === 'Desayuno')),
      almuerzo: getRandom(pool.filter(m => m.type === 'Almuerzo')),
      cena: getRandom(pool.filter(m => m.type === 'Cena')),
      snack: getRandom(pool.filter(m => m.type === 'Snack'))
    });
  };

  const filteredExercises = EXERCISES.filter(ex => {
    if (selectedLocation !== 'Todos' && ex.location !== selectedLocation) return false;
    if (selectedCategory !== 'Todos' && ex.category !== selectedCategory) return false;
    return true;
  });

  const filteredMeals = customMeals.filter(meal => {
    const userAllergies = profile.allergies || [];
    if (meal.allergens.some(al => userAllergies.includes(al))) return false;
    if (selectedIngredients.length > 0) {
      return meal.ingredients.some(ing => selectedIngredients.includes(ing));
    }
    return true;
  });

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
          <p style={{ fontSize: '11px', color: t.textSec, margin: '2px 0 0 0' }}>Usuario: <strong>{profile?.name}</strong> ({profile?.weight} kg) | 📅 {profile?.trainingDaysPerWeek || 3} días/sem</p>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* PESTAÑA: ENTRENAMIENTO */}
      {activeTab === 'entreno' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Bloque de Frecuencia Semanal y Plan Automático */}
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '6px' }}>📅 Tus Días de Entrenamiento</h2>
            <p style={{ fontSize: '11px', color: t.textSec, marginBottom: '10px' }}>Indica cuántos días a la semana quieres entrenar:</p>
            
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {[2, 3, 4, 5].map(days => (
                <button
                  key={days}
                  onClick={() => handleUpdateActiveProfile('trainingDaysPerWeek', days)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                    backgroundColor: (profile.trainingDaysPerWeek || 3) === days ? t.primary : t.bg,
                    color: (profile.trainingDaysPerWeek || 3) === days ? '#fff' : t.text,
                    border: `1px solid ${(profile.trainingDaysPerWeek || 3) === days ? t.primary : t.border}`
                  }}
                >
                  {days} Días
                </button>
              ))}
            </div>

            <div style={{ backgroundColor: isDarkMode ? '#0f172a' : '#f1f5f9', padding: '10px', borderRadius: '8px', fontSize: '11px' }}>
              🎯 <strong>Programa sugerido ({profile.trainingDaysPerWeek || 3} días):</strong> Se alternan bloques de Fuerza-Control y Densidad con bandas elásticas y peso corporal para evitar repetir los mismos estímulos.
            </div>
          </div>

          {/* Tus Rutinas Creadas (Modo Libre) */}
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '14px', margin: 0 }}>📂 Tus Rutinas Personalizadas ({customRoutines.length})</h3>
            </div>
            
            {customRoutines.map(rut => (
              <div key={rut.id} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '12px', color: t.primary }}>⭐ {rut.name}</strong>
                  <button onClick={() => handleDeleteCustomRoutine(rut.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer' }}>🗑️ Borrar</button>
                </div>
                <ul style={{ margin: '4px 0 0 16px', padding: 0, fontSize: '11px', color: t.textSec }}>
                  {rut.exercises.map((exName, idx) => (
                    <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2px 0' }}>
                      <span>{exName}</span>
                      <button 
                        onClick={() => handleSubstituteExercise(exName)}
                        title="Cambiar ejercicio si no puedes hacerlo"
                        style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '4px', fontSize: '9px', padding: '2px 6px', cursor: 'pointer', color: t.text }}
                      >
                        🔄 Cambiar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Formulario rápido para crear una rutina libre */}
            <form onSubmit={handleCreateRoutineSubmit} style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Nombre de tu nueva rutina (ej: Tren Superior Express)" 
                value={newRoutineName}
                onChange={e => setNewRoutineName(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, fontSize: '11px', boxSizing: 'border-box' }}
              />
              <span style={{ fontSize: '11px', fontWeight: '600', color: t.textSec }}>Selecciona ejercicios para incluir:</span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxHeight: '100px', overflowY: 'auto', border: `1px solid ${t.border}`, padding: '6px', borderRadius: '6px' }}>
                {EXERCISES.map(ex => {
                  const isSelected = newRoutineSelectedExs.includes(ex.name);
                  return (
                    <button
                      type="button"
                      key={ex.id}
                      onClick={() => {
                        setNewRoutineSelectedExs(prev => isSelected ? prev.filter(name => name !== ex.name) : [...prev, ex.name]);
                      }}
                      style={{
                        padding: '3px 6px', borderRadius: '4px', fontSize: '10px', cursor: 'pointer',
                        backgroundColor: isSelected ? t.primary : t.bg,
                        color: isSelected ? '#fff' : t.text,
                        border: `1px solid ${isSelected ? t.primary : t.border}`
                      }}
                    >
                      {isSelected ? '✓ ' : '+ '} {ex.name}
                    </button>
                  );
                })}
              </div>
              <button type="submit" style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>
                Guardar Nueva Rutina Libre ➕
              </button>
            </form>
          </div>

          {/* Filtros de Ubicación y Categoría */}
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '13px', marginTop: 0, marginBottom: '8px' }}>📍 Explorar Biblioteca de Ejercicios</h3>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {['Todos', 'Casa', 'Gimnasio'].map(loc => (
                <button 
                  key={loc} 
                  onClick={() => setSelectedLocation(loc as any)}
                  style={{ 
                    flex: 1, padding: '6px', borderRadius: '6px', 
                    border: `1px solid ${selectedLocation === loc ? t.primary : t.border}`, 
                    backgroundColor: selectedLocation === loc ? t.primary : t.bg, 
                    color: selectedLocation === loc ? '#fff' : t.text, 
                    fontSize: '11px', fontWeight: '600', cursor: 'pointer' 
                  }}
                >
                  {loc}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {['Todos', 'Fuerza', 'Core', 'Cardio', 'Movilidad'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  style={{ 
                    padding: '4px 8px', borderRadius: '6px', 
                    border: `1px solid ${selectedCategory === cat ? t.primary : t.border}`, 
                    backgroundColor: selectedCategory === cat ? t.primary : t.bg, 
                    color: selectedCategory === cat ? '#fff' : t.text, 
                    fontSize: '10px', cursor: 'pointer' 
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Ejercicios con botón de Sustitución Instantánea */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {filteredExercises.map(ex => (
              <div key={ex.id} style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '12px' }}>{ex.name}</strong>
                  <span style={{ fontSize: '9px', backgroundColor: ex.location === 'Casa' ? '#0ea5e9' : '#8b5cf6', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{ex.location}</span>
                </div>
                <p style={{ fontSize: '11px', color: t.primary, margin: '2px 0' }}>🛠️ Material: {ex.equipment}</p>
                <p style={{ fontSize: '11px', color: t.textSec, margin: '2px 0 6px 0' }}>{ex.instructions}</p>
                
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleSubstituteExercise(ex.name)}
                    style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '600', 
                      color: '#fff', backgroundColor: '#f59e0b', padding: '4px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer' 
                    }}
                  >
                    🔄 Cambiar ejercicio (Alternativa)
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* PESTAÑA: NUTRICIÓN */}
      {activeTab === 'nutricion' && (
        <div>
          {profile.allergies && profile.allergies.length > 0 && (
            <div style={{ backgroundColor: isDarkMode ? '#7f1d1d' : '#fee2e2', border: `1px solid ${isDarkMode ? '#991b1b' : '#fecaca'}`, borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', fontSize: '11px', color: isDarkMode ? '#fca5a5' : '#991b1b' }}>
              🛡️ <strong>Filtro de alérgenos activo:</strong> Ocultando recetas con {profile.allergies.join(', ')}.
            </div>
          )}

          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, marginBottom: '14px' }}>
            <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '6px' }}>🛒 Selecciona ingredientes de tu despensa</h2>
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

          <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>Recetas Disponibles ({filteredMeals.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredMeals.map(meal => (
              <div key={meal.id} style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', backgroundColor: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{meal.type}</span>
                  <span style={{ fontSize: '10px', color: t.textSec, fontWeight: '600' }}>⚡ {meal.caloriesApprox}</span>
                </div>
                <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0' }}>{meal.title}</strong>
                <p style={{ fontSize: '12px', color: t.textSec, margin: '0 0 6px 0' }}>{meal.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA: DESPENSA */}
      {activeTab === 'despensa' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '6px' }}>🧀 Añadir Alimentos (Queso batido, yogur, etc.)</h2>
            <form onSubmit={handleAddIngredientSubmit} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                placeholder="Ej: Queso fresco batido 0%" 
                value={newIngName}
                onChange={e => setNewIngName(e.target.value)}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, fontSize: '12px' }}
              />
              <button type="submit" style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
                Añadir ➕
              </button>
            </form>
          </div>

          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '6px' }}>🍳 Crear Receta Personalizada</h2>
            <form onSubmit={handleAddMealSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <input 
                type="text" 
                placeholder="Título de la receta..." 
                value={newMealTitle}
                onChange={e => setNewMealTitle(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
              />
              <select 
                value={newMealType}
                onChange={e => setNewMealType(e.target.value as any)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}
              >
                <option value="Desayuno">🌅 Desayuno</option>
                <option value="Almuerzo">☀️ Almuerzo</option>
                <option value="Snack">🍎 Snack</option>
                <option value="Cena">🌙 Cena</option>
              </select>
              <input 
                type="text" 
                placeholder="Calorías (ej: 250 kcal)..." 
                value={newMealCalories}
                onChange={e => setNewMealCalories(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
              />
              <button type="submit" style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}>
                Guardar Receta 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PESTAÑA: MENÚ */}
      {activeTab === 'menu' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, marginBottom: '14px' }}>
            <h2 style={{ fontSize: '15px', marginTop: 0, marginBottom: '6px' }}>🍽️ Generador de Menú Automático</h2>
            <button 
              onClick={generateDailyMenu}
              style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', width: '100%' }}
            >
              🎲 Generar Menú del Día
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
            {dailyMenu.desayuno && <div style={{ backgroundColor: t.card, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}` }}><strong style={{fontSize:'12px'}}>🌅 Desayuno:</strong> {dailyMenu.desayuno.title}</div>}
            {dailyMenu.almuerzo && <div style={{ backgroundColor: t.card, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}` }}><strong style={{fontSize:'12px'}}>☀️ Almuerzo:</strong> {dailyMenu.almuerzo.title}</div>}
            {dailyMenu.snack && <div style={{ backgroundColor: t.card, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}` }}><strong style={{fontSize:'12px'}}>🍎 Snack:</strong> {dailyMenu.snack.title}</div>}
            {dailyMenu.cena && <div style={{ backgroundColor: t.card, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}` }}><strong style={{fontSize:'12px'}}>🌙 Cena:</strong> {dailyMenu.cena.title}</div>}
          </div>
        </div>
      )}

      {/* PESTAÑA: PROGRESO */}
      {activeTab === 'progreso' && (
        <div>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '10px' }}>📝 Registrar Entrenamiento</h2>
            <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <select 
                value={selectedExerciseName} 
                onChange={e => setSelectedExerciseName(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}
              >
                {EXERCISES.map(ex => (
                  <option key={ex.id} value={ex.name}>{ex.name}</option>
                ))}
              </select>
              <input 
                type="text" 
                placeholder="Carga / Notas (ej: 3 series con banda fuerte)" 
                value={notesInput} 
                onChange={e => setNotesInput(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
              />
              <button type="submit" style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
                Guardar Avance 💾
              </button>
            </form>
          </div>

          <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>📊 Historial ({logs.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.map(log => (
              <div key={log.id} style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '12px' }}>
                <strong style={{ fontSize: '12px', color: t.primary }}>{log.exerciseName}</strong>
                <p style={{ fontSize: '11px', color: t.textSec, margin: '2px 0' }}>{log.date} - {log.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA: PERFIL */}
      {activeTab === 'perfil' && profile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '15px', marginTop: 0 }}>👤 Perfil Activo: {profile.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', marginTop: '10px' }}>
              <label>Nombre:
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={e => handleUpdateActiveProfile('name', e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
                />
              </label>
              <label>Peso (kg):
                <input 
                  type="number" 
                  value={profile.weight} 
                  onChange={e => handleUpdateActiveProfile('weight', Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
                />
              </label>

              <span style={{ fontWeight: '600', marginTop: '6px' }}>🛡️ Alergias Activas:</span>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {AVAILABLE_ALLERGIES.map(al => {
                  const isSel = profile.allergies?.includes(al);
                  return (
                    <button
                      key={al}
                      onClick={() => handleToggleActiveAllergy(al)}
                      style={{
                        padding: '4px 8px', borderRadius: '6px', fontSize: '10px', cursor: 'pointer',
                        backgroundColor: isSel ? '#ef4444' : t.bg,
                        color: isSel ? '#fff' : t.text,
                        border: `1px solid ${isSel ? '#ef4444' : t.border}`
                      }}
                    >
                      {al}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navegación Inferior */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: t.card, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-around', padding: '8px 0', maxWidth: '480px', margin: '0 auto', zIndex: 100 }}>
        <button onClick={() => setActiveTab('entreno')} style={{ background: 'none', border: 'none', fontSize: '10px', fontWeight: activeTab === 'entreno' ? '700' : '400', color: activeTab === 'entreno' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '16px' }}>🏋️</span> Entreno
        </button>
        <button onClick={() => setActiveTab('nutricion')} style={{ background: 'none', border: 'none', fontSize: '10px', fontWeight: activeTab === 'nutricion' ? '700' : '400', color: activeTab === 'nutricion' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '16px' }}>🥗</span> Nutrición
        </button>
        <button onClick={() => setActiveTab('despensa')} style={{ background: 'none', border: 'none', fontSize: '10px', fontWeight: activeTab === 'despensa' ? '700' : '400', color: activeTab === 'despensa' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '16px' }}>🛒</span> Despensa
        </button>
        <button onClick={() => setActiveTab('menu')} style={{ background: 'none', border: 'none', fontSize: '10px', fontWeight: activeTab === 'menu' ? '700' : '400', color: activeTab === 'menu' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '16px' }}>🍽️</span> Menú
        </button>
        <button onClick={() => setActiveTab('progreso')} style={{ background: 'none', border: 'none', fontSize: '10px', fontWeight: activeTab === 'progreso' ? '700' : '400', color: activeTab === 'progreso' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '16px' }}>📈</span> Progreso
        </button>
        <button onClick={() => setActiveTab('perfil')} style={{ background: 'none', border: 'none', fontSize: '10px', fontWeight: activeTab === 'perfil' ? '700' : '400', color: activeTab === 'perfil' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '16px' }}>👤</span> Perfil
        </button>
      </nav>

    </div>
  );
}
