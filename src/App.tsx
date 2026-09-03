import React, { useState, useEffect } from 'interface'; // React standard

interface Exercise {
  id: string;
  name: string;
  location: 'Casa' | 'Gimnasio';
  category: 'Fuerza' | 'Core' | 'Cardio';
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

const EXERCISES: Exercise[] = [
  // --- CASA ---
  { 
    id: '1', 
    name: 'Sentadillas Libres', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Ninguno (puedes abrazar una garrafa de agua o mochila con peso)',
    instructions: 'Espalda recta, baja controlando el movimiento y empuja desde los talones.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+hacer+sentadillas+correctamente'
  },
  { 
    id: '2', 
    name: 'Flexiones de Pecho', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Apoyar manos en una silla o banco estable si te cuesta, o pared para empezar',
    instructions: 'Cuerpo completamente alineado, baja el pecho cerca del suelo sin arquear la espalda.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+hacer+flexiones+de+pecho'
  },
  { 
    id: '3', 
    name: 'Zancadas Alternas', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Sostener dos botellas de agua o botes de leche en las manos',
    instructions: 'Da un paso al frente y baja ambas rodillas formando ángulos de 90 grados.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+hacer+zancadas+correctamente'
  },
  { 
    id: '4', 
    name: 'Plancha Abdominal', 
    location: 'Casa', 
    category: 'Core', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Toalla doblada bajo los codos si te resbalas',
    instructions: 'Apóyate sobre los antebrazos y puntas de los pies, contrayendo el abdomen con fuerza.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+hacer+plancha+abdominal'
  },
  { 
    id: '5', 
    name: 'Puente de Glúteos', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Peso corporal', 
    homeSubstitute: 'Colocar un libro pesado o garrafa sobre la cadera para añadir resistencia',
    instructions: 'Tumbado boca arriba con rodillas flexionadas, eleva la cadera contrayendo glúteos.',
    videoUrl: 'https://www.youtube.com/results?search_query=puente+de+gluteos+ejercicio'
  },
  { 
    id: '6', 
    name: 'Press de Hombros con Botellas', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Mancuernas / Botellas', 
    homeSubstitute: 'Dos botellas de agua de 1.5L o bricks de leche llenos',
    instructions: 'Eleva el peso por encima de la cabeza de forma controlada.',
    videoUrl: 'https://www.youtube.com/results?search_query=press+de+hombros+en+casa+con+botellas'
  },
  { 
    id: '7', 
    name: 'Remo invertido bajo mesa', 
    location: 'Casa', 
    category: 'Fuerza', 
    equipment: 'Barra fija / Mesa resistente', 
    instructions: 'Métete debajo de una mesa firme, agarra el borde y eleva el pecho hacia ella.',
    videoUrl: 'https://www.youtube.com/results?search_query=remo+invertido+bajo+mesa+en+casa'
  },

  // --- GIMNASIO ---
  { 
    id: '8', 
    name: 'Press de Banca Plano', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Barra y banco', 
    homeSubstitute: 'No aplica (Gimnasio)',
    instructions: 'Acuéstate, baja la barra de manera controlada al pecho y empuja hacia arriba.',
    videoUrl: 'https://www.youtube.com/results?search_query=press+de+banca+plano+tecnica'
  },
  { 
    id: '9', 
    name: 'Sentadilla en Barra Libre', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Jaula y barra', 
    homeSubstitute: 'No aplica (Gimnasio)',
    instructions: 'Coloca la barra sobre los trapecios, rompe el paralelo bajando la cadera y sube firme.',
    videoUrl: 'https://www.youtube.com/results?search_query=sentadilla+con+barra+libre+tecnica'
  },
  { 
    id: '10', 
    name: 'Remo en Polea Baja', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Máquina de poleas', 
    homeSubstitute: 'No aplica (Gimnasio)',
    instructions: 'Espalda recta, tira del agarre hacia el abdomen contrayendo las escápulas.',
    videoUrl: 'https://www.youtube.com/results?search_query=remo+en+polea+baja+espalda'
  },
  { 
    id: '11', 
    name: 'Prensa de Piernas 45º', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Máquina de prensa', 
    homeSubstitute: 'No aplica (Gimnasio)',
    instructions: 'Coloca los pies en la plataforma, baja controlando y empuja sin bloquear las rodillas.',
    videoUrl: 'https://www.youtube.com/results?search_query=como+usar+prensa+de+piernas+45'
  },
  { 
    id: '12', 
    name: 'Tríceps en Polea Alta', 
    location: 'Gimnasio', 
    category: 'Fuerza', 
    equipment: 'Polea y cuerda', 
    homeSubstitute: 'No aplica (Gimnasio)',
    instructions: 'Codos pegados al cuerpo y extiende los antebrazos hacia abajo.',
    videoUrl: 'https://www.youtube.com/results?search_query=triceps+en+polea+alta+con+cuerda'
  }
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fitapp_profile_v2');
    return saved ? JSON.parse(saved) : { name: 'Nacho', weight: 70, goal: 'Ganar fuerza y músculo' };
  });

  const [logs, setLogs] = useState<WorkoutLog[]>(() => {
    const saved = localStorage.getItem('fitapp_logs_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<'entreno' | 'progreso' | 'perfil'>('entreno');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<'Todos' | 'Casa' | 'Gimnasio'>('Todos');

  // Formulario rápido para registrar entreno
  const [selectedExerciseName, setSelectedExerciseName] = useState<string>(EXERCISES[0].name);
  const [weightUsedInput, setWeightUsedInput] = useState<string>('');
  const [notesInput, setNotesInput] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('fitapp_profile_v2', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('fitapp_logs_v2', JSON.stringify(logs));
  }, [logs]);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExerciseName) return;

    const newLog: WorkoutLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      exerciseName: selectedExerciseName,
      weightUsed: weightUsedInput ? `${weightUsedInput} kg` : 'Peso corporal / Sin datos',
      notes: notesInput || 'Sesión completada con éxito'
    };

    setLogs([newLog, ...logs]);
    setWeightUsedInput('');
    setNotesInput('');
    alert('¡Entrenamiento registrado y guardado en tus avances! 🚀');
  };

  const filteredExercises = EXERCISES.filter(ex => {
    if (selectedLocation !== 'Todos' && ex.location !== selectedLocation) return false;
    return true;
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
          <p style={{ fontSize: '11px', color: t.textSec, margin: '2px 0 0 0' }}>Hola, {profile.name} ({profile.weight} kg)</p>
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
            <div style={{ display: 'flex', gap: '6px' }}>
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
          </div>

          <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>Ejercicios y Utensilios en Casa</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredExercises.map(ex => (
              <div key={ex.id} style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px' }}>{ex.name}</strong>
                  <span style={{ fontSize: '9px', backgroundColor: ex.location === 'Casa' ? '#0ea5e9' : '#8b5cf6', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{ex.location}</span>
                </div>
                
                {ex.location === 'Casa' && (
                  <p style={{ fontSize: '11px', color: '#10b981', margin: '2px 0', fontWeight: '500' }}>
                    💡 <strong>Sin material en casa:</strong> {ex.homeSubstitute}
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
                  ▶️ Ver vídeo
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA: PROGRESO Y REGISTRO */}
      {activeTab === 'progreso' && (
        <div>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, marginBottom: '16px' }}>
            <h2 style={{ fontSize: '14px', marginTop: 0, marginBottom: '10px' }}>📝 Registrar Entrenamiento</h2>
            <form onSubmit={handleAddLog} style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px' }}>
              <label>Ejercicio realizado:
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

              <label>Peso utilizado o dificultad:
                <input 
                  type="text" 
                  placeholder="Ej: 15 kg, o botellas de agua..." 
                  value={weightUsedInput} 
                  onChange={e => setWeightUsedInput(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
                />
              </label>

              <label>Comentarios / Series:
                <input 
                  type="text" 
                  placeholder="Ej: 4 series de 10 repeticiones, muy bien" 
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
            <p style={{ fontSize: '12px', color: t.textSec, textAlign: 'center', padding: '20px' }}>Aún no hay entrenamientos guardados. ¡Registra el primero arriba!</p>
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
            <p style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>✅ Los cambios se guardan automáticamente en tu navegador.</p>
          </div>
        </div>
      )}

      {/* Barra de Navegación Inferior */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: t.card, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-around', padding: '10px 0', maxWidth: '480px', margin: '0 auto', zIndex: 100 }}>
        <button onClick={() => setActiveTab('entreno')} style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: activeTab === 'entreno' ? '700' : '400', color: activeTab === 'entreno' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>🏋️</span> Entreno
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
