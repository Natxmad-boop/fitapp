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
}

interface MealIdea {
  id: string;
  type: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  title: string;
  description: string;
  caloriesApprox: string;
  ingredients: string[]; // Ingredientes clave para el filtrado
}

const AVAILABLE_GOALS = [
  'Ganar fuerza',
  'Perder grasa',
  'Ganar masa muscular',
  'Mejorar resistencia',
  'Movilidad y salud'
];

// Lista de ingredientes predefinidos para seleccionar
const AVAILABLE_INGREDIENTS = [
  'Pollo',
  'Arroz',
  'Brócoli',
  'Zanahoria',
  'Lomo',
  'Huevo',
  'Aguacate',
  'Salmón',
  'Avena',
  'Plátano',
  'Ternera',
  'Patata'
];

const EXERCISES: Exercise[] = [
  // --- CASA ---
  { 
    id: '1', 
    name: 'Sentadillas Libres', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Garrafa de agua o mochila con libros',
    instructions: 'Espalda recta, baja controlando el movimiento y empuja desde los talones.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+hacer+sentadillas+correctamente'
  },
  { 
    id: '2', 
    name: 'Flexiones de Pecho', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Manos elevadas en una silla o bordillo si te cuesta',
    instructions: 'Cuerpo completamente alineado, baja el pecho cerca del suelo sin arquear la espalda.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+hacer+flexiones+de+pecho'
  },
  { 
    id: '3', 
    name: 'Zancadas Alternas', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Dos botellas de agua o botes de leche en las manos',
    instructions: 'Da un paso al frente y baja ambas rodillas formando ángulos de 90 grados.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+hacer+zancadas+correctamente'
  },
  { 
    id: '4', 
    name: 'Plancha Abdominal', 
    location: 'Casa', 
    category: 'Core', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Toalla doblada bajo los codos',
    instructions: 'Apóyate sobre los antebrazos y puntas de los pies, contrayendo el abdomen con fuerza.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+hacer+plancha+abdominal'
  },
  { 
    id: '5', 
    name: 'Puente de Glúteos', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Libro pesado o mochila sobre la cadera',
    instructions: 'Tumbado boca arriba con rodillas flexionadas, eleva la cadera contrayendo glúteos.',
    videoUrl: 'https://www.youtube.com/results?search_query=puente+de+gluteos+ejercicio'
  },
  { 
    id: '6', 
    name: 'Jumping Jacks', 
    location: 'Casa', 
    category: 'Cardio', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Ninguno necesario',
    instructions: 'Salta abriendo y cerrando piernas y brazos de forma rítmica.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+hacer+jumping+jacks'
  },
  { 
    id: '7', 
    name: 'Curl de Bíceps', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Banda o Mochila', 
    homeSubstitute: 'Mochila cargada con libros',
    instructions: 'Sujeta la mochila firmemente y eleva los antebrazos contrayendo los bíceps.',
    videoUrl: 'https://www.youtube.com/results?search_query=curl+de+biceps+en+casa+con+mochila'
  },
  { 
    id: '8', 
    name: 'Press Militar', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Mancuernas / Botellas', 
    homeSubstitute: 'Dos botellas de agua o bricks de leche',
    instructions: 'Eleva el peso por encima de la cabeza de forma controlada.',
    videoUrl: 'https://www.youtube.com/results?search_query=press+de+hombros+en+casa+con+botellas'
  },
  
  // --- GIMNASIO ---
  { 
    id: '9', 
    name: 'Press de Banca Plano', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Barra y banco', 
    homeSubstitute: 'No aplica',
    instructions: 'Acuéstate, baja la barra de manera controlada al pecho y empuja hacia arriba.',
    videoUrl: 'https://www.youtube.com/results?search_query=press+de+banca+plano+tecnica'
  },
  { 
    id: '10', 
    name: 'Sentadilla en Barra Libre', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Jaula y barra', 
    homeSubstitute: 'No aplica',
    instructions: 'Coloca la barra sobre los trapecios, rompe el paralelo bajando la cadera y sube firme.',
    videoUrl: 'https://www.youtube.com/results?search_query=sentadilla+con+barra+libre+tecnica'
  },
  { 
    id: '11', 
    name: 'Dominadas Asistidas / Libres', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Máquina o barra fija', 
    homeSubstitute: 'No aplica',
    instructions: 'Tira con la fuerza de la espalda llevando el pecho hacia la barra.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+hacer+dominadas+correctamente'
  },
  { 
    id: '12', 
    name: 'Remo en Polea Baja', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Máquina de poleas', 
    homeSubstitute: 'No aplica',
    instructions: 'Espalda recta, tira del agarre hacia el abdomen contrayendo las escápulas.',
    videoUrl: 'https://www.youtube.com/results?search_query=remo+en+polea+baja+espalda'
  },
  { 
    id: '13', 
    name: 'Prensa de Piernas 45º', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Máquina de prensa', 
    homeSubstitute: 'No aplica',
    instructions: 'Coloca los pies en la plataforma, baja controlando y empuja sin bloquear las rodillas.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+usar+prensa+de+piernas+45'
  },
  { 
    id: '14', 
    name: 'Extensiones de Cuádriceps', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Máquina de extensiones', 
    homeSubstitute: 'No aplica',
    instructions: 'Eleva las piernas contrayendo los cuádriceps de forma estricta arriba.',
    videoUrl: 'https://www.youtube.com/results?search_query=extension+de+cuadriceps+maquina'
  },
  { 
    id: '15', 
    name: 'Curl Femoral Tumbado', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Máquina femoral', 
    homeSubstitute: 'No aplica',
    instructions: 'Flexiona las piernas llevando los talones hacia los glúteos.',
    videoUrl: 'https://www.youtube.com/results?search_query=curl+femoral+tumbado+tecnica'
  },
  { 
    id: '16', 
    name: 'Elevaciones Laterales', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Mancuernas', 
    homeSubstitute: 'No aplica',
    instructions: 'Eleva los brazos hacia los lados hasta la altura de los hombros.',
    videoUrl: 'https://www.youtube.com/results?search_query=elevaciones+laterales+mancuernas'
  },
  { 
    id: '17', 
    name: 'Tríceps en Polea Alta', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Polea y cuerda', 
    homeSubstitute: 'No aplica',
    instructions: 'Codos pegados al cuerpo y extiende los antebrazos hacia abajo.',
    videoUrl: 'https://www.youtube.com/results?search_query=triceps+en+polea+alta+con+cuerda'
  },
  { 
    id: '18', 
    name: 'Cinta de Correr o Elíptica', 
    location: 'Gimnasio', 
    category: 'Cardio', 
    equipment: 'Máquina de cardio', 
    homeSubstitute: 'No aplica',
    instructions: 'Mantén un ritmo constante aeróbico durante el tiempo establecido.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+correr+en+cinta+de+gimnasio'
  }
];

const MEALS: MealIdea[] = [
  { 
    id: 'm1', 
    type: 'Almuerzo', 
    title: 'Pechuga de pollo a la plancha con arroz y brócoli', 
    description: 'Pechuga marinada a la plancha acompañada de arroz blanco y brócoli al vapor.', 
    caloriesApprox: '450 kcal',
    ingredients: ['Pollo', 'Arroz', 'Brócoli'] 
  },
  { 
    id: 'm2', 
    type: 'Almuerzo', 
    title: 'Lomo adobado salteado con zanahorias y patata', 
    description: 'Tiras de lomo adobado con patata asada y bastoncitos de zanahoria tierna.', 
    caloriesApprox: '490 kcal',
    ingredients: ['Lomo', 'Zanahoria', 'Patata'] 
  },
  { 
    id: 'm3', 
    type: 'Desayuno', 
    title: 'Tostada integral con aguacate y huevo pochado', 
    description: 'Pan integral, medio aguacate machacado por encima y un huevo pochado.', 
    caloriesApprox: '320 kcal',
    ingredients: ['Huevo', 'Aguacate'] 
  },
  { 
    id: 'm4', 
    type: 'Cena', 
    title: 'Salmón al horno con brócoli y zanahorias', 
    description: 'Lomo de salmón fresco al horno con guarnición de verduras crujientes.', 
    caloriesApprox: '510 kcal',
    ingredients: ['Salmón', 'Brócoli', 'Zanahoria'] 
  },
  { 
    id: 'm5', 
    type: 'Almuerzo', 
    title: 'Ternera magra con arroz y patata', 
    description: 'Filete de ternera a la plancha con arroz blanco y patata cocida.', 
    caloriesApprox: '580 kcal',
    ingredients: ['Ternera', 'Arroz', 'Patata'] 
  },
  { 
    id: 'm6', 
    type: 'Desayuno', 
    title: 'Porridge de avena con plátano', 
    description: 'Copos de avena cocidos con leche o bebida vegetal y rodajas de plátano.', 
    caloriesApprox: '380 kcal',
    ingredients: ['Avena', 'Plátano'] 
  },
  { 
    id: 'm7', 
    type: 'Cena', 
    title: 'Tortilla francesa con lomo y ensalada de zanahoria', 
    description: 'Tortilla de dos huevos acompañada de unos taquitos de lomo y zanahoria rallada.', 
    caloriesApprox: '410 kcal',
    ingredients: ['Huevo', 'Lomo', 'Zanahoria'] 
  },
  { 
    id: 'm8', 
    type: 'Snack', 
    title: 'Tortitas de arroz con aguacate y huevo', 
    description: 'Snack energético salado con base de aguacate y huevo cocido picado.', 
    caloriesApprox: '250 kcal',
    ingredients: ['Aguacate', 'Huevo'] 
  }
];

export default function App() {
  const [profilesList, setProfilesList] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('fitapp_profiles_directory');
    return saved ? JSON.parse(saved) : [
      { id: 'user_1', name: 'Nacho', weight: 70, goal: ['Ganar fuerza'] },
      { id: 'user_2', name: 'Lucía', weight: 60, goal: ['Perder grasa'] }
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

  const [activeTab, setActiveTab] = useState<'entreno' | 'nutricion' | 'progreso' | 'perfil'>('entreno');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<'Todos' | 'Casa' | 'Gimnasio'>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  // NUEVO ESTADO: Ingredientes seleccionados para filtrar la nutrición (por defecto vacío para mostrar todo o los que marque)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  // Formulario registro entreno
  const [selectedExerciseName, setSelectedExerciseName] = useState<string>(EXERCISES[0].name);
  const [weightUsedInput, setWeightUsedInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');

  // Nuevo usuario inputs
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserWeight, setNewUserWeight] = useState<string>('');
  const [newUserGoals, setNewUserGoals] = useState<string[]>(['Ganar fuerza']);

  useEffect(() => {
    localStorage.setItem('fitapp_profiles_directory', JSON.stringify(profilesList));
  }, [profilesList]);

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
    let updatedGoals;
    if (currentGoals.includes(goalOption)) {
      if (currentGoals.length === 1) {
        alert('⚠️ Debes seleccionar al menos un objetivo.');
        return;
      }
      updatedGoals = currentGoals.filter(g => g !== goalOption);
    } else {
      updatedGoals = [...currentGoals, goalOption];
    }
    handleUpdateActiveProfile('goal', updatedGoals);
  };

  const handleToggleNewUserGoal = (goalOption: string) => {
    if (newUserGoals.includes(goalOption)) {
      if (newUserGoals.length === 1) return;
      setNewUserGoals(newUserGoals.filter(g => g !== goalOption));
    } else {
      setNewUserGoals([...newUserGoals, goalOption]);
    }
  };

  // Función para alternar ingredientes favoritos en la pestaña de nutrición
  const handleToggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
    } else {
      setSelectedIngredients([...selectedIngredients, ingredient]);
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
      goal: newUserGoals
    };

    setProfilesList([...profilesList, newUser]);
    setActiveUserId(newId);
    setNewUserName('');
    setNewUserWeight('');
    setNewUserGoals(['Ganar fuerza']);
    alert(`¡Perfil de ${newUser.name} creado y seleccionado con éxito! 🎉`);
  };

  const handleDeleteUserProfile = (userIdToDelete: string) => {
    if (profilesList.length <= 1) {
      alert('⚠️ No puedes borrar el único perfil disponible.');
      return;
    }

    const targetUser = profilesList.find(p => p.id === userIdToDelete);
    if (!window.confirm(`¿Estás seguro de que quieres eliminar el perfil de "${targetUser?.name}" y todos sus registros guardados?`)) {
      return;
    }

    localStorage.removeItem(`fitapp_logs_${userIdToDelete}`);
    const updatedList = profilesList.filter(p => p.id !== userIdToDelete);
    setProfilesList(updatedList);

    if (activeUserId === userIdToDelete) {
      setActiveUserId(updatedList[0].id);
    }

    alert('Perfil eliminado correctamente.');
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExerciseName) return;

    const newLog: WorkoutLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      exerciseName: selectedExerciseName,
      weightUsed: weightUsedInput ? `${weightUsedInput}` : 'Peso corporal / Sin especificar',
      notes: notesInput || 'Completado con éxito'
    };

    setLogs([newLog, ...logs]);
    setWeightUsedInput('');
    setNotesInput('');
    alert(`¡Entrenamiento guardado para ${profile.name}! 🚀`);
  };

  const handleSubstituteExercise = (currentEx: Exercise) => {
    const alternatives = EXERCISES.filter(ex => 
      ex.id !== currentEx.id && 
      ex.category === currentEx.category && 
      ex.location === currentEx.location
    );

    if (alternatives.length === 0) {
      alert('⚠️ No encontramos otra alternativa exacta en el mismo campo y ubicación.');
      return;
    }

    const randomAlternative = alternatives[Math.floor(Math.random() * alternatives.length)];
    alert(`🏥 Sustituto sugerido por molestia:\n\n👉 En lugar de "${currentEx.name}", te recomendamos hacer:\n⭐ ${randomAlternative.name} (${randomAlternative.category} - ${randomAlternative.location})\n\n💡 Material: ${randomAlternative.equipment}`);
  };

  const filteredExercises = EXERCISES.filter(ex => {
    if (selectedLocation !== 'Todos' && ex.location !== selectedLocation) return false;
    if (selectedCategory !== 'Todos' && ex.category !== selectedCategory) return false;
    return true;
  });

  // Filtrado de recetas: si hay ingredientes marcados, muestra las recetas que contengan AL MENOS UNO de los ingredientes seleccionados. Si no hay ninguno marcado, muestra todas.
  const filteredMeals = MEALS.filter(meal => {
    if (selectedIngredients.length === 0) return true;
    return meal.ingredients.some(ing => selectedIngredients.includes(ing));
  });

  const t = isDarkMode ? {
    bg: '#0f172a', card: '#1e293b', text: '#f8fafc', textSec: '#94a3b8', primary: '#38bdf8', border: '#334155'
  } : {
    bg: '#f8fafc', card: '#ffffff', text: '#0f172a', textSec: '#64748b', primary: '#0284c7', border: '#e2e8f0'
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '16px', paddingBottom: '90px', backgroundColor: t.bg, color: t.text, minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Cabecera */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '18px', margin: 0, color: t.primary }}>FitApp Pro ⚡</h1>
          <p style={{ fontSize: '11px', color: t.textSec, margin: '2px 0 0 0' }}>Usuario: <strong>{profile?.name}</strong> ({profile?.weight} kg)</p>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* PESTAÑA: ENTRENAMIENTO */}
      {activeTab === 'entreno' && (
        <div>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, marginBottom: '14px' }}>
            <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '8px' }}>📍 ¿Dónde vas a entrenar hoy?</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              {['Todos', 'Casa', 'Gimnasio'].map(loc => (
                <button 
                  key={loc} 
                  onClick={() => setSelectedLocation(loc as any)}
                  style={{ 
                    flex: 1, padding: '8px', borderRadius: '8px', 
                    border: `1px solid ${selectedLocation === loc ? t.primary : t.border}`, 
                    backgroundColor: selectedLocation === loc ? t.primary : t.bg, 
                    color: selectedLocation === loc ? '#fff' : t.text, 
                    fontSize: '12px', fontWeight: '600', cursor: 'pointer' 
                  }}
                >
                  {loc === 'Casa' ? '🏠 Casa' : loc === 'Gimnasio' ? '🏋️ Gimnasio' : '🌐 Todos'}
                </button>
              ))}
            </div>

            <h3 style={{ fontSize: '13px', margin: '10px 0 6px 0', color: t.textSec }}>Filtrar por tipo:</h3>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {['Todos', 'Fuerza', 'Core', 'Cardio'].map(cat => (
                <button 
                  key={cat} 
                  onClick={() => setSelectedCategory(cat)}
                  style={{ 
                    padding: '4px 10px', borderRadius: '6px', 
                    border: `1px solid ${selectedCategory === cat ? t.primary : t.border}`, 
                    backgroundColor: selectedCategory === cat ? t.primary : t.bg, 
                    color: selectedCategory === cat ? '#fff' : t.text, 
                    fontSize: '11px', cursor: 'pointer' 
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>Ejercicios ({filteredExercises.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredExercises.map(ex => (
              <div key={ex.id} style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px' }}>{ex.name}</strong>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ fontSize: '9px', backgroundColor: ex.location === 'Casa' ? '#0ea5e9' : '#8b5cf6', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{ex.location}</span>
                    <span style={{ fontSize: '9px', backgroundColor: t.border, padding: '2px 6px', borderRadius: '4px' }}>{ex.category}</span>
                  </div>
                </div>

                <p style={{ fontSize: '11px', color: t.primary, margin: '2px 0' }}>🛠️ Material: {ex.equipment}</p>
                
                {ex.location === 'Casa' && (
                  <p style={{ fontSize: '11px', color: '#10b981', margin: '2px 0', fontWeight: '500' }}>
                    💡 <strong>Si no tienes material:</strong> {ex.homeSubstitute}
                  </p>
                )}

                <p style={{ fontSize: '12px', color: t.textSec, margin: '4px 0 8px 0' }}>{ex.instructions}</p>
                
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <a 
                    href={ex.videoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', 
                      color: '#fff', backgroundColor: '#dc2626', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none' 
                    }}
                  >
                    ▶️ Ver vídeo
                  </a>
                  
                  <button
                    onClick={() => handleSubstituteExercise(ex)}
                    style={{ 
                      display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', 
                      color: '#fff', backgroundColor: '#f59e0b', padding: '4px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer' 
                    }}
                  >
                    🔄 Tengo una dolencia (Sustituir)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA: NUTRICIÓN Y SELECCIÓN DE INGREDIENTES */}
      {activeTab === 'nutricion' && (
        <div>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, marginBottom: '14px' }}>
            <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '6px' }}>🛒 ¿Qué ingredientes tienes o te apetece comer?</h2>
            <p style={{ fontSize: '11px', color: t.textSec, marginBottom: '10px' }}>Pincha para marcar tus favoritos y te daremos ideas adaptadas:</p>
            
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {AVAILABLE_INGREDIENTS.map(ing => {
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

            {selectedIngredients.length > 0 && (
              <button 
                onClick={() => setSelectedIngredients([])}
                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', cursor: 'pointer', marginTop: '10px', padding: 0, textDecoration: 'underline' }}
              >
                Limpiar filtros de ingredientes
              </button>
            )}
          </div>

          <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>
            Ideas de Comidas ({filteredMeals.length}) {selectedIngredients.length > 0 ? 'filtradas' : 'totales'}
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredMeals.length === 0 ? (
              <p style={{ fontSize: '12px', color: t.textSec, textAlign: 'center', padding: '20px' }}>No hay recetas que coincidan con todos los ingredientes seleccionados.</p>
            ) : (
              filteredMeals.map(meal => (
                <div key={meal.id} style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', backgroundColor: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{meal.type}</span>
                    <span style={{ fontSize: '10px', color: t.textSec, fontWeight: '600' }}>⚡ Aprox: {meal.caloriesApprox}</span>
                  </div>
                  <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0' }}>{meal.title}</strong>
                  <p style={{ fontSize: '12px', color: t.textSec, margin: '0 0 6px 0' }}>{meal.description}</p>
                  
                  {/* Etiquetas de ingredientes de la receta */}
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {meal.ingredients.map(ing => (
                      <span key={ing} style={{ fontSize: '9px', backgroundColor: t.bg, border: `1px solid ${t.border}`, color: t.textSec, padding: '2px 6px', borderRadius: '4px' }}>
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* PESTAÑA: PROGRESO Y AVANCES */}
      {activeTab === 'progreso' && (
        <div>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '10px' }}>📝 Registrar Entrenamiento de {profile?.name}</h2>
            <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <label>Ejercicio:
                <select 
                  value={selectedExerciseName} 
                  onChange={e => setSelectedExerciseName(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}
                >
                  {EXERCISES.map(ex => (
                    <option key={ex.id} value={ex.name}>{ex.name} ({ex.location})</option>
                  ))}
                </select>
              </label>

              <label>Carga o peso usado:
                <input 
                  type="text" 
                  placeholder="Ej: 15 kg, o garrafa de agua..." 
                  value={weightUsedInput} 
                  onChange={e => setWeightUsedInput(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
                />
              </label>

              <label>Notas / Series:
                <input 
                  type="text" 
                  placeholder="Ej: 4 series de 10 reps" 
                  value={notesInput} 
                  onChange={e => setNotesInput(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
                />
              </label>

              <button type="submit" style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' }}>
                Guardar Avance para {profile?.name} 💾
              </button>
            </form>
          </div>

          <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>📊 Historial de {profile?.name} ({logs.length})</h3>
          {logs.length === 0 ? (
            <p style={{ fontSize: '12px', color: t.textSec, textAlign: 'center', padding: '20px' }}>Aún no hay entrenamientos registrados para este usuario.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {logs.map(log => (
                <div key={log.id} style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px', color: t.primary }}>{log.exerciseName}</strong>
                    <span style={{ fontSize: '10px', color: t.textSec }}>{log.date}</span>
                  </div>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>🏋️ <strong>Carga:</strong> {log.weightUsed}</p>
                  <p style={{ fontSize: '11px', color: t.textSec, margin: 0 }}>💬 {log.notes}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA: PERFIL Y MULTI-USUARIO */}
      {activeTab === 'perfil' && profile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          
          {/* Selector y Borrado de Perfiles */}
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '15px', marginTop: 0 }}>👥 Gestión de Usuarios</h2>
            <p style={{ fontSize: '11px', color: t.textSec, marginBottom: '10px' }}>Selecciona para cambiar o elimina los perfiles que ya no uses:</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {profilesList.map(p => (
                <div key={p.id} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button
                    onClick={() => setActiveUserId(p.id)}
                    style={{
                      flex: 1, textAlign: 'left', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer',
                      backgroundColor: p.id === activeUserId ? t.primary : t.bg,
                      color: p.id === activeUserId ? '#fff' : t.text,
                      border: `1px solid ${p.id === activeUserId ? t.primary : t.border}`,
                      fontWeight: p.id === activeUserId ? 'bold' : 'normal',
                      fontSize: '12px'
                    }}
                  >
                    👤 {p.name} ({p.weight} kg) {p.id === activeUserId ? '✓ (Activo)' : ''}
                  </button>
                  <button
                    onClick={() => handleDeleteUserProfile(p.id)}
                    title="Eliminar perfil"
                    style={{
                      background: 'none', border: `1px solid #ef4444`, color: '#ef4444', 
                      borderRadius: '8px', padding: '8px 10px', cursor: 'pointer', fontSize: '12px'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Editar Perfil Activo */}
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '15px', marginTop: 0 }}>⚙️ Configurar a: {profile.name}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', marginTop: '10px' }}>
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

              <div>
                <span style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Objetivos (puedes marcar varios):</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {AVAILABLE_GOALS.map(goalOption => {
                    const isSelected = profile.goal?.includes(goalOption);
                    return (
                      <div 
                        key={goalOption}
                        onClick={() => handleToggleActiveGoal(goalOption)}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer',
                          backgroundColor: isSelected ? (isDarkMode ? '#0369a1' : '#e0f2fe') : t.bg,
                          border: `1px solid ${isSelected ? t.primary : t.border}`,
                          color: isSelected ? t.text : t.textSec
                        }}
                      >
                        <span style={{ fontSize: '14px' }}>{isSelected ? '✅' : '⬜'}</span>
                        <span style={{ fontWeight: isSelected ? '600' : 'normal' }}>{goalOption}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>

          {/* Crear Nuevo Usuario */}
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '15px', marginTop: 0 }}>➕ Añadir Nuevo Perfil</h2>
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', marginTop: '10px' }}>
              <label>Nombre del nuevo usuario:
                <input 
                  type="text" 
                  placeholder="Ej: Carlos" 
                  value={newUserName} 
                  onChange={e => setNewUserName(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
                />
              </label>
              <label>Peso inicial (kg):
                <input 
                  type="number" 
                  placeholder="Ej: 75" 
                  value={newUserWeight} 
                  onChange={e => setNewUserWeight(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
                />
              </label>

              <div>
                <span style={{ display: 'block', marginBottom: '6px', fontWeight: '600' }}>Selecciona sus objetivos:</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {AVAILABLE_GOALS.map(goalOption => {
                    const isSelected = newUserGoals.includes(goalOption);
                    return (
                      <div 
                        key={goalOption}
                        onClick={() => handleToggleNewUserGoal(goalOption)}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 8px', borderRadius: '6px', cursor: 'pointer',
                          backgroundColor: isSelected ? (isDarkMode ? '#0369a1' : '#e0f2fe') : t.bg,
                          border: `1px solid ${isSelected ? t.primary : t.border}`,
                          color: t.text
                        }}
                      >
                        <span style={{ fontSize: '12px' }}>{isSelected ? '✅' : '⬜'}</span>
                        <span>{goalOption}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button type="submit" style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '6px' }}>
                Crear y Cambiar a este Usuario 🚀
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Barra de Navegación Inferior */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: t.card, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-around', padding: '10px 0', maxWidth: '480px', margin: '0 auto', zIndex: 100 }}>
        <button onClick={() => setActiveTab('entreno')} style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: activeTab === 'entreno' ? '700' : '400', color: activeTab === 'entreno' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>🏋️</span> Entreno
        </button>
        <button onClick={() => setActiveTab('nutricion')} style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: activeTab === 'nutricion' ? '700' : '400', color: activeTab === 'nutricion' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>🥗</span> Nutrición
        </button>
        <button onClick={() => setActiveTab('progreso')} style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: activeTab === 'progreso' ? '700' : '400', color: activeTab === 'progreso' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>📈</span> Progreso
        </button>
        <button onClick={() => setActiveTab('perfil')} style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: activeTab === 'perfil' ? '700' : '400', color: activeTab === 'perfil' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>👤</span> Perfil
        </button>
      </nav>

    </div>
  );
}
