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
  name: string;
  weight: number;
  goal: string;
}

interface MealIdea {
  id: string;
  type: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  dietType: 'Perder peso' | 'Ganar masa' | 'Sin lactosa' | 'Sin gluten';
  title: string;
  description: string;
  caloriesApprox: string;
}

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
  // Perder Peso
  { id: 'm1', type: 'Desayuno', dietType: 'Perder peso', title: 'Tostada integral con aguacate y huevo pochado', description: 'Pan de centeno integral, medio aguacate machacado y un huevo cocido o pochado.', caloriesApprox: '320 kcal' },
  { id: 'm2', type: 'Almuerzo', dietType: 'Perder peso', title: 'Pechuga de pollo a la plancha con espárragos y quinoa', description: '150g de pollo, manojo de espárragos trigueros salteados y 40g de quinoa cocida.', caloriesApprox: '410 kcal' },
  { id: 'm3', type: 'Cena', dietType: 'Perder peso', title: 'Crema de calabacín ligera y merluza al horno', description: 'Crema casera sin patata y lomo de merluza con chorrito de aceite de oliva.', caloriesApprox: '300 kcal' },
  { id: 'm4', type: 'Snack', dietType: 'Perder peso', title: 'Yogur griego desnatado con arándanos', description: 'Yogur natural sin azúcar con un puñado pequeño de arándanos frescos.', caloriesApprox: '130 kcal' },

  // Ganar Masa Muscular
  { id: 'm5', type: 'Desayuno', dietType: 'Ganar masa', title: 'Porridge de avena energético con plátano y nueces', description: '80g de copos de avena con leche, un plátano en rodajas y 20g de nueces.', caloriesApprox: '550 kcal' },
  { id: 'm6', type: 'Almuerzo', dietType: 'Ganar masa', title: 'Ternera magra con arroz blanco y patata', description: '180g de carne de ternera, 150g de arroz cocido y patata asada.', caloriesApprox: '650 kcal' },
  { id: 'm7', type: 'Cena', dietType: 'Ganar masa', title: 'Tortilla de 3 huevos con atún y pan integral', description: 'Tortilla francesa con una lata de atún al natural y dos rebanadas de pan de masa madre.', caloriesApprox: '520 kcal' },
  { id: 'm8', type: 'Snack', dietType: 'Ganar masa', title: 'Batido casero de plátano, crema de cacahuete y leche', description: '1 plátano, 2 cucharadas soperas de crema de cacahuete 100% y vaso grande de leche.', caloriesApprox: '450 kcal' },

  // Sin Lactosa
  { id: 'm9', type: 'Desayuno', dietType: 'Sin lactosa', title: 'Tostadas con jamón serrano y tomate natural', description: 'Pan integral tostado con aceite de oliva virgen extra, tomate rallado y jamón.', caloriesApprox: '310 kcal' },
  { id: 'm10', type: 'Almuerzo', dietType: 'Sin lactosa', title: 'Salmón al horno con patatas panaderas', description: 'Filete de salmón fresco al horno con rodajas finas de patata y cebolla.', caloriesApprox: '500 kcal' },
  { id: 'm11', type: 'Cena', dietType: 'Sin lactosa', title: 'Salteado de pavo con verduras variadas', description: 'Tiras de pavo salteadas en wok con pimientos, calabacín y salsa de soja.', caloriesApprox: '380 kcal' },
  { id: 'm12', type: 'Snack', dietType: 'Sin lactosa', title: 'Frutos secos naturales y una pieza de fruta', description: 'Mix de almendras y nueces con una manzana.', caloriesApprox: '220 kcal' },

  // Sin Gluten
  { id: 'm13', type: 'Desayuno', dietType: 'Sin gluten', title: 'Tortitas caseras de avena sin gluten y plátano', description: 'Avena certificada sin gluten batida con un huevo y un plátano a la plancha.', caloriesApprox: '340 kcal' },
  { id: 'm14', type: 'Almuerzo', dietType: 'Sin gluten', title: 'Pechuga de pollo desmenuzada con arroz y frijoles', description: 'Plato completo estilo bol con arroz, pollo especiado y judías negras.', caloriesApprox: '490 kcal' },
  { id: 'm15', type: 'Cena', dietType: 'Sin gluten', title: 'Tortilla de patatas casera con ensalada verde', description: 'Clásica tortilla de patata y cebolla con aceite de oliva acompañada de lechuga.', caloriesApprox: '420 kcal' },
  { id: 'm16', type: 'Snack', dietType: 'Sin gluten', title: 'Tortitas de maíz con crema de cacahuete', description: '3 tortitas de maíz soplado untadas con crema de cacahuete.', caloriesApprox: '180 kcal' }
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fitapp_profile_v4');
    return saved ? JSON.parse(saved) : { name: 'Nacho', weight: 70, goal: 'Ganar fuerza y músculo' };
  });

  const [logs, setLogs] = useState<WorkoutLog[]>(() => {
    const saved = localStorage.getItem('fitapp_logs_v4');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'entreno' | 'nutricion' | 'progreso' | 'perfil'>('entreno');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<'Todos' | 'Casa' | 'Gimnasio'>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedDietType, setSelectedDietType] = useState<'Perder peso' | 'Ganar masa' | 'Sin lactosa' | 'Sin gluten'>('Perder peso');

  // Formulario registro
  const [selectedExerciseName, setSelectedExerciseName] = useState<string>(EXERCISES[0].name);
  const [weightUsedInput, setWeightUsedInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('fitapp_profile_v4', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('fitapp_logs_v4', JSON.stringify(logs));
  }, [logs]);

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
    alert('¡Entrenamiento guardado en tus avances! 🚀');
  };

  const filteredExercises = EXERCISES.filter(ex => {
    if (selectedLocation !== 'Todos' && ex.location !== selectedLocation) return false;
    if (selectedCategory !== 'Todos' && ex.category !== selectedCategory) return false;
    return true;
  });

  const filteredMeals = MEALS.filter(meal => meal.dietType === selectedDietType);

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
          <p style={{ fontSize: '11px', color: t.textSec, margin: '2px 0 0 0' }}>¡Hola, {profile.name}! ({profile.weight} kg)</p>
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
                
                <a 
                  href={ex.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', 
                    color: '#fff', backgroundColor: '#dc2626', padding: '4px 10px', borderRadius: '6px', textDecoration: 'none' 
                  }}
                >
                  ▶️ Ver vídeo demostración
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA: NUTRICIÓN Y DIETAS */}
      {activeTab === 'nutricion' && (
        <div>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, marginBottom: '14px' }}>
            <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '8px' }}>🥗 Elige tu objetivo o dieta:</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {(['Perder peso', 'Ganar masa', 'Sin lactosa', 'Sin gluten'] as const).map(diet => (
                <button 
                  key={diet} 
                  onClick={() => setSelectedDietType(diet)}
                  style={{ 
                    padding: '8px', borderRadius: '8px', 
                    border: `1px solid ${selectedDietType === diet ? t.primary : t.border}`, 
                    backgroundColor: selectedDietType === diet ? t.primary : t.bg, 
                    color: selectedDietType === diet ? '#fff' : t.text, 
                    fontSize: '11px', fontWeight: '600', cursor: 'pointer', textAlign: 'center' 
                  }}
                >
                  {diet === 'Perder peso' ? '🔥 Perder Peso' : diet === 'Ganar masa' ? '💪 Ganar Masa' : diet === 'Sin lactosa' ? '🥛 Sin Lactosa' : '🌾 Sin Gluten'}
                </button>
              ))}
            </div>
          </div>

          <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>Ideas de Comidas ({selectedDietType})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredMeals.map(meal => (
              <div key={meal.id} style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '10px', backgroundColor: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{meal.type}</span>
                  <span style={{ fontSize: '10px', color: t.textSec, fontWeight: '600' }}>⚡ Aprox: {meal.caloriesApprox}</span>
                </div>
                <strong style={{ fontSize: '13px', display: 'block', margin: '4px 0' }}>{meal.title}</strong>
                <p style={{ fontSize: '12px', color: t.textSec, margin: 0 }}>{meal.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA: PROGRESO Y AVANCES */}
      {activeTab === 'progreso' && (
        <div>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '10px' }}>📝 Registrar Entrenamiento</h2>
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
                Guardar Avance 💾
              </button>
            </form>
          </div>

          <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>📊 Tus Avances Guardados ({logs.length})</h3>
          {logs.length === 0 ? (
            <p style={{ fontSize: '12px', color: t.textSec, textAlign: 'center', padding: '20px' }}>Aún no hay entrenamientos registrados. ¡Haz tu primer registro arriba!</p>
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

      {/* PESTAÑA: PERFIL */}
      {activeTab === 'perfil' && (
        <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '15px', marginTop: 0 }}>👤 Tu Perfil Personal</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', marginTop: '12px' }}>
            <label>Tu nombre:
              <input 
                type="text" 
                value={profile.name} 
                onChange={e => setProfile({...profile, name: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
              />
            </label>
            <label>Peso actual (kg):
              <input 
                type="number" 
                value={profile.weight} 
                onChange={e => setProfile({...profile, weight: Number(e.target.value)})}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
              />
            </label>
            <label>Objetivo principal:
              <input 
                type="text" 
                value={profile.goal} 
                onChange={e => setProfile({...profile, goal: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
              />
            </label>
            <p style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>✅ Guardado automático local en el dispositivo.</p>
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
