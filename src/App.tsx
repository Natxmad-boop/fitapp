import React, { useState, useEffect } from 'react';

interface Exercise {
  id: string;
  name: string;
  category: 'Fuerza' | 'Core' | 'Cardio';
  instructions: string;
}

interface UserProfile {
  id: string;
  name: string;
  weight: number;
  goal: string;
}

const EXERCISES: Exercise[] = [
  { id: '1', name: 'Sentadillas', category: 'Fuerza', instructions: 'Espalda recta, baja controlando el movimiento.' },
  { id: '2', name: 'Flexiones de Pecho', category: 'Fuerza', instructions: 'Mantén el cuerpo alineado y baja el pecho.' },
  { id: '3', name: 'Plancha Abdominal', category: 'Core', instructions: 'Contrae el abdomen y aguanta sin arquear la espalda.' },
  { id: '4', name: 'Jumping Jacks', category: 'Cardio', instructions: 'Salta abriendo y cerrando brazos y piernas con ritmo.' }
];

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fitapp_simple_profile');
    return saved ? JSON.parse(saved) : { id: '1', name: 'Atleta', weight: 70, goal: 'Ganar fuerza' };
  });

  const [activeTab, setActiveTab] = useState<'entreno' | 'perfil'>('entreno');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('fitapp_simple_profile', JSON.stringify(profile));
  }, [profile]);

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
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '16px', paddingBottom: '80px', backgroundColor: t.bg, color: t.text, minHeight: '100vh', boxSizing: 'border-box' }}>
      
      {/* Cabecera */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '18px', margin: 0, color: t.primary }}>FitApp Pro ⚡</h1>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px' }}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Contenido de Entreno */}
      {activeTab === 'entreno' && (
        <div>
          <div style={{ backgroundColor: t.card, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}`, marginBottom: '16px' }}>
            <h2 style={{ fontSize: '15px', marginTop: 0 }}>¡Hola, {profile.name}! 👋</h2>
            <p style={{ fontSize: '13px', color: t.textSec, margin: '4px 0 0 0' }}>Tu objetivo actual es: <strong>{profile.goal}</strong></p>
          </div>

          <h3 style={{ fontSize: '15px', marginBottom: '10px' }}>Rutina recomendada</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {EXERCISES.map(ex => (
              <div key={ex.id} style={{ backgroundColor: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '14px' }}>{ex.name}</strong>
                  <span style={{ fontSize: '10px', backgroundColor: t.border, padding: '2px 6px', borderRadius: '4px' }}>{ex.category}</span>
                </div>
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
