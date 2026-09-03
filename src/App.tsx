import React, { useState, useEffect } from 'react';

interface Exercise {
  id: string;
  name: string;
  location: 'Casa' | 'Gimnasio';
  category: 'Fuerza' | 'Core' | 'Cardio' | 'Movilidad';
  equipment: string;
  instructions: string;
}

interface UserProfile {
  id: string;
  name: string;
  weight: number;
  goal: string;
}

const EXERCISES: Exercise[] = [
  // --- CASA ---
  { id: '1', name: 'Sentadillas Libres', location: 'Casa', category: 'Fuerza', equipment: 'Peso corporal', instructions: 'Espalda recta, baja controlando el movimiento y empuja desde los talones.' },
  { id: '2', name: 'Flexiones de Pecho', location: 'Casa', category: 'Fuerza', equipment: 'Peso corporal', instructions: 'Cuerpo completamente alineado, baja el pecho cerca del suelo sin arquear la espalda.' },
  { id: '3', name: 'Zancadas Alternas', location: 'Casa', category: 'Fuerza', equipment: 'Peso corporal', instructions: 'Da un paso al frente y baja ambas rodillas formando ángulos de 90 grados.' },
  { id: '4', name: 'Plancha Abdominal', location: 'Casa', category: 'Core', equipment: 'Peso corporal', instructions: 'Apóyate sobre los antebrazos y puntas de los pies, contrayendo el abdomen con fuerza.' },
  { id: '5', name: 'Puente de Glúteos', location: 'Casa', category: 'Fuerza', equipment: 'Peso corporal', instructions: 'Tumbado boca arriba con rodillas flexionadas, eleva la cadera contrayendo glúteos.' },
  { id: '6', name: 'Jumping Jacks', location: 'Casa', category: 'Cardio', equipment: 'Peso corporal', instructions: 'Salta abriendo y cerrando piernas y brazos de forma rítmica.' },
  { id: '7', name: 'Curl de Bíceps con Bandas / Mochila', location: 'Casa', category: 'Fuerza', equipment: 'Banda elástica o mochila con peso', instructions: 'Pisa la banda o sujeta la mochila y eleva los brazos contrayendo los bíceps.' },
  { id: '8', name: 'Press Militar con Mancuernas / Botellas', location: 'Casa', category: 'Fuerza', equipment: 'Mancuernas o botellas de agua', instructions: 'Eleva el peso por encima de la cabeza de forma controlada.' },
  
  // --- GIMNASIO ---
  { id: '9', name: 'Press de Banca Plano', location: 'Gimnasio', category: 'Fuerza', equipment: 'Barra y banco', instructions: 'Acuéstate, baja la barra de manera controlada al pecho y empuja hacia arriba.' },
  { id: '10', name: 'Sentadilla en Barra Libre (Squat)', location: 'Gimnasio', category: 'Fuerza', equipment: 'Jaula de potencia y barra', instructions: 'Coloca la barra sobre los trapecios, rompe el paralelo bajando la cadera y sube firme.' },
  { id: '11', name: 'Dominadas asistidas o libres', location: 'Gimnasio', category: 'Fuerza', equipment: 'Máquina de dominadas o barra fija', instructions: 'Succiona con la fuerza de la espalda llevando el pecho hacia la barra.' },
  { id: '12', name: 'Remo en Polea Baja', location: 'Gimnasio', category: 'Fuerza', equipment: 'Máquina de poleas', instructions: 'Espalda recta, tira del agarre hacia el abdomen contrayendo las escápulas.' },
  { id: '13', name: 'Prensa de Piernas 45º', location: 'Gimnasio', category: 'Fuerza', equipment: 'Máquina de prensa', instructions: 'Coloca los pies en la plataforma, baja controlando y empuja sin bloquear las rodillas.' },
  { id: '14', name: 'Extensiones de Cuádriceps', location: 'Gimnasio', category: 'Fuerza', equipment: 'Máquina de extensiones', instructions: 'Eleva las piernas contrayendo los cuádriceps de forma estricta arriba.' },
  { id: '15', name: 'Curl Femoral tumbado', location: 'Gimnasio', category: 'Fuerza', equipment: 'Máquina femoral', instructions: 'Flexiona las piernas llevando los talones hacia los glúteos.' },
  { id: '16', name: 'Elevaciones Laterales con Mancuernas', location: 'Gimnasio', category: 'Fuerza', equipment: 'Mancuernas', instructions: 'Eleva los brazos hacia los lados hasta la altura de los hombros.' },
  { id: '17', name: 'Tríceps en Polea Alta', location: 'Gimnasio', category: 'Fuerza', equipment: 'Polea y cuerda', instructions: 'Codos pegados al cuerpo y extiende los antebrazos hacia abajo.' },
  { id: '18', name: 'Cinta de Correr o Elíptica', location: 'Gimnasio', category: 'Cardio', equipment: 'Máquina de cardio', instructions: 'Mantén un ritmo constante aeróbico durante el tiempo establecido.' }
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fitapp_simple_profile');
    return saved ? JSON.parse(saved) : { id: '1', name: 'Nacho', weight: 70, goal: 'Ganar fuerza y músculo' };
  });

  const [activeTab, setActiveTab] = useState<'entreno' | 'perfil'>('entreno');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<'Todos' | 'Casa' | 'Gimnasio'>('Todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  useEffect(() => {
    localStorage.setItem('fitapp_simple_profile', JSON.stringify(profile));
  }, [profile]);

  const filteredExercises = EXERCISES.filter(ex => {
    if (selectedLocation !== 'Todos' && ex.location !== selectedLocation) return false;
    if (selectedCategory !== 'Todos' && ex.category !== selectedCategory) return false;
    return true;
  });

  const t = isDarkMode ? {
    bg: '#0f172a',
    card: '#1e293b',
    text: '#f8fafc',
    textSec: '#94a3b8',
    primary: '#38bdf8',
    border: '#334155'
  } : {
    bg: '#f8fafc',
    card: '#ffffff',
    text: '#0f172a',
    textSec: '#64748b',
    primary: '#0284c7',
    border: '#e2e8f0'
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '16px', paddingBottom: '90px', backgroundColor: t.bg, color: t.text, minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Cabecera */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '18px', margin: 0, color: t.primary }}>FitApp Pro ⚡</h1>
          <p style={{ fontSize: '11px', color: t.textSec, margin: '2px 0 0 0' }}>¡Hola, {profile.name}!</p>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Contenido de Entreno */}
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
                    flex: 1, 
                    padding: '8px', 
                    borderRadius: '8px', 
                    border: `1px solid ${selectedLocation === loc ? t.primary : t.border}`, 
                    backgroundColor: selectedLocation === loc ? t.primary : t.bg, 
                    color: selectedLocation === loc ? '#fff' : t.text, 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    cursor: 'pointer' 
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
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    border: `1px solid ${selectedCategory === cat ? t.primary : t.border}`, 
                    backgroundColor: selectedCategory === cat ? t.primary : t.bg, 
                    color: selectedCategory === cat ? '#fff' : t.text, 
                    fontSize: '11px', 
                    cursor: 'pointer' 
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>Ejercicios Disponibles ({filteredExercises.length})</h3>
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
                <p style={{ fontSize: '11px', color: t.primary, margin: '2px 0 4px 0' }}>🛠️ Material: {ex.equipment}</p>
                <p style={{ fontSize: '12px', color: t.textSec, margin: 0 }}>{ex.instructions}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contenido de Perfil */}
      {activeTab === 'perfil' && (
        <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '15px', marginTop: 0 }}>Configurar Perfil</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', marginTop: '12px' }}>
            <label>Tu nombre:
              <input 
                type="text" 
                value={profile.name} 
                onChange={e => setProfile({...profile, name: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
              />
            </label>
            <label>Peso (kg):
              <input 
                type="number" 
                value={profile.weight} 
                onChange={e => setProfile({...profile, weight: Number(e.target.value)})}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
              />
            </label>
            <label>Objetivo:
              <input 
                type="text" 
                value={profile.goal} 
                onChange={e => setProfile({...profile, goal: e.target.value})}
                style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text, boxSizing: 'border-box' }}
              />
            </label>
          </div>
        </div>
      )}

      {/* Barra de Navegación Inferior */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: t.card, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-around', padding: '10px 0', maxWidth: '480px', margin: '0 auto', zIndex: 100 }}>
        <button onClick={() => setActiveTab('entreno')} style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: activeTab === 'entreno' ? '700' : '400', color: activeTab === 'entreno' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>🏋️</span> Entreno
        </button>
        <button onClick={() => setActiveTab('perfil')} style={{ background: 'none', border: 'none', fontSize: '11px', fontWeight: activeTab === 'perfil' ? '700' : '400', color: activeTab === 'perfil' ? t.primary : t.textSec, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
          <span style={{ fontSize: '18px' }}>👤</span> Perfil
        </button>
      </nav>

    </div>
  );
}
