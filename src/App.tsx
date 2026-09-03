import React, { useState, useEffect } from 'react';

const themes = {
  light: {
    bg: '#f8fafc',
    cardBg: '#ffffff',
    text: '#111111',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    primary: '#0284c7',
    primaryHover: '#0369a1',
    statBg: '#f1f5f9',
    inputBg: '#ffffff',
    inputBorder: '#cbd5e1',
    navBg: '#ffffff',
    navText: '#64748b',
    navActive: '#0284c7',
    dangerBg: '#ef4444',
  },
  dark: {
    bg: '#0f172a',
    cardBg: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#334155',
    primary: '#38bdf8',
    primaryHover: '#0ea5e9',
    statBg: '#0f172a',
    inputBg: '#0f172a',
    inputBorder: '#475569',
    navBg: '#1e293b',
    navText: '#94a3b8',
    navActive: '#38bdf8',
    dangerBg: '#dc2626',
  }
};

interface UserProfile {
  id: string;
  name: string;
  pin: string;
  goal: string;
  level: string;
  equipment: string[];
}

interface Exercise {
  id: string;
  name: string;
  category: 'Fuerza' | 'Core' | 'Cardio' | 'Movilidad' | 'HIIT' | 'Resistencia';
  targetMuscle: string;
  equipment: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  instructions: string;
  commonErrors: string;
  isFavorite?: boolean;
}

interface SetItem {
  name: string;
  weight: number;
  reps: number;
  difficulty?: 'Fácil' | 'Normal' | 'Difícil';
  note?: string;
  date: string;
}

export default function App() {
  // Perfiles y Seguridad (Fases 1 y 2)
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('fitapp_profiles');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Atleta Principal', pin: '1234', goal: 'Ganar músculo', level: 'Intermedio', equipment: ['Mancuernas', 'Barra'] }
    ];
  });
  
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('fitapp_active_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [inputPin, setInputPin] = useState('');
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfilePin, setNewProfilePin] = useState('');
  const [newProfileGoal, setNewProfileGoal] = useState('Ganar músculo');
  const [newProfileLevel, setNewProfileLevel] = useState('Intermedio');

  const [activeTab, setActiveTab] = useState<'inicio' | 'entrenar' | 'biblioteca' | 'progreso' | 'perfil'>('inicio');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('fitapp_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const t = isDarkMode ? themes.dark : themes.light;
  const pKey = currentProfile ? `_${currentProfile.id}` : '_default';

  // Biblioteca de Ejercicios Oficial (Fase 4 del Guion)
  const defaultExercises: Exercise[] = [
    { id: 'ex_1', name: 'Press de Banca con Barra', category: 'Fuerza', targetMuscle: 'Pectorales, Tríceps', equipment: 'Barra', difficulty: 'Intermedio', instructions: 'Acuéstate en el banco, retrae omóplatos y baja la barra controladamente hasta el pecho.', commonErrors: 'Rebotar la barra en el pecho o arquear en exceso la zona lumbar.' },
    { id: 'ex_2', name: 'Sentadilla Goblet', category: 'Fuerza', targetMuscle: 'Cuádriceps, Glúteos', equipment: 'Mancuernas', difficulty: 'Principiante', instructions: 'Sostén la mancuerna verticalmente frente al pecho, baja la cadera manteniendo la espalda recta.', commonErrors: 'Levantar los talones del suelo o inclinar el tronco hacia adelante.' },
    { id: 'ex_3', name: 'Remo con Mancuerna a 1 Mano', category: 'Fuerza', targetMuscle: 'Espalda, Bíceps', equipment: 'Mancuernas', difficulty: 'Principiante', instructions: 'Apoya una mano y rodilla en el banco, tira de la mancuerna hacia tu cadera apretando la espalda.', commonErrors: 'Rotar excesivamente el torso durante el tirón.' },
    { id: 'ex_4', name: 'Plancha Abdominal Isométrica', category: 'Core', targetMuscle: 'Abdomen, Core', equipment: 'Esterilla', difficulty: 'Principiante', instructions: 'Apóyate sobre antebrazos y puntas de pies, mantén el cuerpo en línea recta contrayendo el abdomen.', commonErrors: 'Dejar caer la cadera hacia el suelo por fatiga.' },
    { id: 'ex_5', name: 'Burpees sin Salto', category: 'HIIT', targetMuscle: 'Cuerpo completo', equipment: 'Sin material', difficulty: 'Intermedio', instructions: 'Ponte en cuclillas, lleva las piernas atrás en plancha, regresa y levántate con energía.', commonErrors: 'Arquear la espalda al extender la plancha.' },
    { id: 'ex_6', name: 'Movilidad de Cadera 90/90', category: 'Movilidad', targetMuscle: 'Caderas, Glúteos', equipment: 'Esterilla', difficulty: 'Principiante', instructions: 'Sentado en el suelo con piernas flexionadas a 90 grados, rota las rodillas de un lado a otro.', commonErrors: 'Realizar el movimiento de forma muy rápida sin control articular.' }
  ];

  const [exerciseLibrary, setExerciseLibrary] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem(`fitapp_library_v4${pKey}`);
    return saved ? JSON.parse(saved) : defaultExercises;
  });

  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('Todas');
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');
  const [activeExerciseModal, setActiveExerciseModal] = useState<Exercise | null>(null);

  // Estados de entrenamiento y progreso
  const [history, setHistory] = useState<SetItem[]>(() => {
    const saved = localStorage.getItem(`fitapp_history_v4${pKey}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [selectedExerciseForLog, setSelectedExerciseForLog] = useState('Press de Banca con Barra');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Fácil' | 'Normal' | 'Difícil'>('Normal');
  const [exerciseNote, setExerciseNote] = useState('');

  // Temporizador
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem('fitapp_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem('fitapp_active_profile', JSON.stringify(currentProfile));
      localStorage.setItem(`fitapp_library_v4${pKey}`, JSON.stringify(exerciseLibrary));
      localStorage.setItem(`fitapp_history_v4${pKey}`, JSON.stringify(history));
    }
  }, [currentProfile, exerciseLibrary, history, pKey]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };

  const handleLogin = (prof: UserProfile) => {
    if (prof.pin && prof.pin.length > 0) {
      if (inputPin === prof.pin) {
        setCurrentProfile(prof);
        setInputPin('');
      } else {
        alert('PIN incorrecto. Inténtalo de nuevo.');
      }
    } else {
      setCurrentProfile(prof);
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    const newProf: UserProfile = {
      id: Date.now().toString(),
      name: newProfileName,
      pin: newProfilePin.trim(),
      goal: newProfileGoal,
      level: newProfileLevel,
      equipment: ['Mancuernas', 'Esterilla']
    };
    const updated = [...profiles, newProf];
    setProfiles(updated);
    localStorage.setItem('fitapp_profiles', JSON.stringify(updated));
    setNewProfileName('');
    setNewProfilePin('');
    setIsCreatingProfile(false);
    setCurrentProfile(newProf);
  };

  const handleAddSet = () => {
    const w = parseFloat(weightInput);
    const r = parseInt(repsInput, 10);
    if (isNaN(w) || isNaN(r)) return;

    const newSet: SetItem = {
      name: selectedExerciseForLog,
      weight: w,
      reps: r,
      difficulty: selectedDifficulty,
      note: exerciseNote,
      date: new Date().toLocaleDateString()
    };

    setHistory([newSet, ...history]);
    setWeightInput('');
    setRepsInput('');
    setExerciseNote('');
    startTimer(90);
  };

  const toggleFavoriteExercise = (id: string) => {
    setExerciseLibrary(exerciseLibrary.map(ex => ex.id === id ? { ...ex, isFavorite: !ex.isFavorite } : ex));
  };

  const dynamicStyles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      maxWidth: '480px',
      margin: '0 auto',
      padding: '16px',
      paddingBottom: '90px',
      color: t.text,
      backgroundColor: t.bg,
      minHeight: '100vh',
    },
    card: {
      backgroundColor: t.cardBg,
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: `1px solid ${t.border}`,
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: t.text,
      marginTop: 0,
      marginBottom: '12px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
    },
    statBox: {
      backgroundColor: t.statBg,
      padding: '12px',
      borderRadius: '8px',
      textAlign: 'center' as const,
      border: `1px solid ${t.border}`,
    },
    statValue: {
      fontSize: '18px',
      fontWeight: '700',
      color: t.primary,
      margin: '0 0 4px 0',
    },
    statLabel: {
      fontSize: '12px',
      color: t.textSecondary,
      margin: 0,
    },
    button: {
      backgroundColor: t.primary,
      color: '#ffffff',
      border: 'none',
      padding: '12px 16px',
      borderRadius: '8px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'center' as const,
      fontSize: '14px',
      marginBottom: '8px',
    },
    secondaryButton: {
      backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
      color: t.text,
      border: 'none',
      padding: '8px 12px',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '12px',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: `1px solid ${t.inputBorder}`,
      backgroundColor: t.inputBg,
      color: t.text,
      fontSize: '14px',
      marginBottom: '10px',
      boxSizing: 'border-box' as const,
    },
    nav: {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: t.navBg,
      borderTop: `1px solid ${t.border}`,
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0',
      maxWidth: '480px',
      margin: '0 auto',
      zIndex: 100,
    },
    navItem: (active: boolean) => ({
      background: 'none',
      border: 'none',
      fontSize: '11px',
      fontWeight: active ? '700' : '500',
      color: active ? t.navActive : t.navText,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '3px',
    }),
    listItem: {
      padding: '12px 0',
      borderBottom: `1px solid ${t.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
    },
  };

  if (!currentProfile) {
    return (
      <div style={dynamicStyles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.text, margin: '0 0 4px 0' }}>FitApp Pro 💪</h1>
            <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>Selecciona tu perfil de atleta</p>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={dynamicStyles.secondaryButton}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div style={dynamicStyles.card}>
          <h2 style={dynamicStyles.cardTitle}>🔐 Perfiles Seguros</h2>
          {profiles.map((prof) => (
            <div key={prof.id} style={{ ...dynamicStyles.listItem, flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '15px', color: t.text }}>{prof.name}</strong>
                  <p style={{ fontSize: '11px', color: t.textSecondary, margin: '2px 0 0 0' }}>Objetivo: {prof.goal} ({prof.level})</p>
                </div>
              </div>
              {prof.pin ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    placeholder="PIN 4 dígitos"
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                    style={{ ...dynamicStyles.input, margin: 0 }}
                    maxLength={4}
                  />
                  <button style={{ ...dynamicStyles.button, width: '100px', margin: 0 }} onClick={() => handleLogin(prof)}>
                    Acceder
                  </button>
                </div>
              ) : (
                <button style={dynamicStyles.button} onClick={() => handleLogin(prof)}>
                  Entrar
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={dynamicStyles.card}>
          {!isCreatingProfile ? (
            <button style={dynamicStyles.secondaryButton} onClick={() => setIsCreatingProfile(true)}>
              + Crear Nuevo Perfil
            </button>
          ) : (
            <form onSubmit={handleCreateProfile}>
              <h2 style={dynamicStyles.cardTitle}>Nuevo Perfil de Atleta</h2>
              <input type="text" placeholder="Nombre completo" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} style={dynamicStyles.input} />
              <input type="password" placeholder="PIN de seguridad (4 dígitos)" value={newProfilePin} onChange={(e) => setNewProfilePin(e.target.value)} style={dynamicStyles.input} maxLength={4} />
              
              <label style={{ fontSize: '12px', color: t.textSecondary, display: 'block', marginBottom: '4px' }}>Objetivo Principal</label>
              <select value={newProfileGoal} onChange={(e) => setNewProfileGoal(e.target.value)} style={{ ...dynamicStyles.input, marginBottom: '10px' }}>
                <option value="Ganar músculo">Ganar músculo</option>
                <option value="Perder grasa">Perder grasa</option>
                <option value="Recomposición corporal">Recomposición corporal</option>
                <option value="Mejorar fuerza">Mejorar fuerza</option>
              </select>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={dynamicStyles.button}>Crear Perfil</button>
                <button type="button" style={dynamicStyles.secondaryButton} onClick={() => setIsCreatingProfile(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  const filteredExercises = exerciseLibrary.filter(ex => {
    const matchesCat = selectedCategoryFilter === 'Todas' || ex.category === selectedCategoryFilter;
    const matchesSearch = ex.name.toLowerCase().includes(exerciseSearchQuery.toLowerCase()) || ex.targetMuscle.toLowerCase().includes(exerciseSearchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={dynamicStyles.container}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: t.text, margin: '0 0 2px 0' }}>FitApp Pro 💪</h1>
          <p style={{ fontSize: '12px', color: t.primary, margin: 0, fontWeight: '600' }}>Atleta: {currentProfile.name} ({currentProfile.goal})</p>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={dynamicStyles.secondaryButton}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* 🏠 1. INICIO */}
      {activeTab === 'inicio' && (
        <div>
          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>🎯 ¿Qué hago hoy?</h2>
            <p style={{ fontSize: '13px', color: t.textSecondary, marginBottom: '12px' }}>
              Basado en tu nivel ({currentProfile.level}) y equipamiento disponible, tienes acceso a <strong>{exerciseLibrary.length} ejercicios</strong> validados en tu biblioteca.
            </p>
            <button style={dynamicStyles.button} onClick={() => setActiveTab('entrenar')}>
              Ir a Entrenar 🚀
            </button>
          </div>

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>⭐ Tus Ejercicios Favoritos</h2>
            {exerciseLibrary.filter(ex => ex.isFavorite).length === 0 ? (
              <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>No has marcado ejercicios como favoritos todavía. Explora la biblioteca.</p>
            ) : (
              exerciseLibrary.filter(ex => ex.isFavorite).map(ex => (
                <div key={ex.id} style={dynamicStyles.listItem}>
                  <div>
                    <strong style={{ fontSize: '13px', color: t.text }}>{ex.name}</strong>
                    <span style={{ fontSize: '11px', color: t.textSecondary, display: 'block' }}>{ex.targetMuscle} • {ex.equipment}</span>
                  </div>
                  <button style={dynamicStyles.secondaryButton} onClick={() => setActiveExerciseModal(ex)}>Ver Técnica</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 🏋️ 2. ENTRENAR Y REGISTRO */}
      {activeTab === 'entrenar' && (
        <div>
          {timeLeft > 0 && (
            <div style={{ ...dynamicStyles.card, backgroundColor: isDarkMode ? '#032541' : '#eff6ff', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: t.textSecondary, margin: '0 0 4px 0' }}>⏱️ Descanso Automático</p>
              <span style={{ fontSize: '28px', fontWeight: '700', color: t.primary }}>
                {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
              </span>
            </div>
          )}

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>🏋️ Registrar Serie y Rendimiento</h2>
            
            <label style={{ fontSize: '12px', color: t.textSecondary, display: 'block', marginBottom: '4px' }}>Seleccionar Ejercicio de la Biblioteca</label>
            <select value={selectedExerciseForLog} onChange={(e) => setSelectedExerciseForLog(e.target.value)} style={dynamicStyles.input}>
              {exerciseLibrary.map(ex => (
                <option key={ex.id} value={ex.name}>{ex.name} ({ex.category})</option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" placeholder="Peso (kg)" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} style={dynamicStyles.input} />
              <input type="number" placeholder="Reps" value={repsInput} onChange={(e) => setRepsInput(e.target.value)} style={dynamicStyles.input} />
            </div>

            <label style={{ fontSize: '12px', color: t.textSecondary, display: 'block', marginBottom: '4px' }}>Dificultad Percibida (Feedback IA)</label>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {(['Fácil', 'Normal', 'Difícil'] as const).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setSelectedDifficulty(diff)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: `1px solid ${selectedDifficulty === diff ? t.primary : t.inputBorder}`,
                    backgroundColor: selectedDifficulty === diff ? t.primary : t.inputBg,
                    color: selectedDifficulty === diff ? '#ffffff' : t.text,
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {diff}
                </button>
              ))}
            </div>

            <input type="text" placeholder="Observaciones técnicas o sensaciones" value={exerciseNote} onChange={(e) => setExerciseNote(e.target.value)} style={dynamicStyles.input} />
            <button style={dynamicStyles.button} onClick={handleAddSet}>Guardar Serie y Descansar</button>
          </div>
        </div>
      )}

      {/* 📚 3. BIBLIOTECA DE EJERCICIOS (Fase 4 del Guion) */}
      {activeTab === 'biblioteca' && (
        <div>
          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>📚 Biblioteca de Ejercicios Oficial</h2>
            <p style={{ fontSize: '12px', color: t.textSecondary, marginBottom: '12px' }}>
              Ejercicios estructurados con instrucciones y técnica correcta. La IA selecciona exclusivamente de esta base.
            </p>
            <input 
              type="text" 
              placeholder="Buscar ejercicio o músculo..." 
              value={exerciseSearchQuery} 
              onChange={(e) => setExerciseSearchQuery(e.target.value)} 
              style={dynamicStyles.input} 
            />
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px' }}>
              {['Todas', 'Fuerza', 'Core', 'Cardio', 'Movilidad', 'HIIT'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  style={{
                    backgroundColor: selectedCategoryFilter === cat ? t.primary : (isDarkMode ? '#334155' : '#e2e8f0'),
                    color: selectedCategoryFilter === cat ? '#ffffff' : t.text,
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '16px',
                    fontSize: '11px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={dynamicStyles.card}>
            {filteredExercises.length === 0 ? (
              <p style={{ fontSize: '13px', color: t.textSecondary, textAlign: 'center' }}>No se encontraron ejercicios con esos filtros.</p>
            ) : (
              filteredExercises.map((ex) => (
                <div key={ex.id} style={{ ...dynamicStyles.listItem, flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '14px', color: t.text }}>{ex.name}</strong>
                      <span style={{ fontSize: '11px', color: t.primary, display: 'block' }}>{ex.category} • {ex.targetMuscle} ({ex.equipment})</span>
                    </div>
                    <button 
                      onClick={() => toggleFavoriteExercise(ex.id)} 
                      style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' }}
                      title="Marcar favorito"
                    >
                      {ex.isFavorite ? '⭐' : '☆'}
                    </button>
                  </div>
                  <button style={dynamicStyles.secondaryButton} onClick={() => setActiveExerciseModal(ex)}>
                    📖 Ver Instrucciones y Errores Frecuentes
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 📈 4. PROGRESO */}
      {activeTab === 'progreso' && (
        <div>
          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>🏆 Historial de Rendimiento</h2>
            {history.length === 0 ? (
              <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>Aún no hay registros en este perfil.</p>
            ) : (
              history.map((item, idx) => (
                <div key={idx} style={dynamicStyles.listItem}>
                  <div>
                    <strong style={{ color: t.text, display: 'block' }}>{item.name}</strong>
                    <span style={{ fontSize: '11px', color: t.primary }}>Feedback: {item.difficulty || 'Normal'} {item.note ? `| ${item.note}` : ''}</span>
                  </div>
                  <span style={{ color: t.text, fontWeight: '700' }}>{item.weight} kg × {item.reps} reps</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 👤 5. PERFIL */}
      {activeTab === 'perfil' && (
        <div>
          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>👤 Configuración del Perfil</h2>
            <div style={{ fontSize: '14px', color: t.text, lineHeight: '1.6', marginBottom: '16px' }}>
              <p style={{ margin: '4px 0' }}><strong>Nombre:</strong> {currentProfile.name}</p>
              <p style={{ margin: '4px 0' }}><strong>Objetivo:</strong> {currentProfile.goal}</p>
              <p style={{ margin: '4px 0' }}><strong>Nivel:</strong> {currentProfile.level}</p>
              <p style={{ margin: '4px 0' }}><strong>Equipamiento:</strong> {currentProfile.equipment.join(', ')}</p>
            </div>
            <button style={dynamicStyles.secondaryButton} onClick={() => setCurrentProfile(null)}>
              🚪 Cerrar Sesión / Cambiar Perfil
            </button>
          </div>
        </div>
      )}

      {/* Modal de Técnica de Ejercicio */}
      {activeExerciseModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 200 }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '20px', maxWidth: '400px', width: '100%', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: t.text, marginTop: 0 }}>{activeExerciseModal.name}</h3>
            <p style={{ fontSize: '12px', color: t.primary, fontWeight: '600', marginBottom: '10px' }}>{activeExerciseModal.category} | Músculos: {activeExerciseModal.targetMuscle}</p>
            
            <div style={{ marginBottom: '12px' }}>
              <strong style={{ fontSize: '12px', color: t.text, display: 'block', marginBottom: '2px' }}>Instrucciones Técnicas:</strong>
              <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0, lineHeight: '1.4' }}>{activeExerciseModal.instructions}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '12px', color: t.dangerBg || '#ef4444', display: 'block', marginBottom: '2px' }}>⚠️ Errores Frecuentes:</strong>
              <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0, lineHeight: '1.4' }}>{activeExerciseModal.commonErrors}</p>
            </div>

            <button style={dynamicStyles.button} onClick={() => setActiveExerciseModal(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Navegación Oficial de 5 Apartados */}
      <nav style={dynamicStyles.nav}>
        <button style={dynamicStyles.navItem(activeTab === 'inicio')} onClick={() => setActiveTab('inicio')}>🏠 Inicio</button>
        <button style={dynamicStyles.navItem(activeTab === 'entrenar')} onClick={() => setActiveTab('entrenar')}>🏋️ Entrenar</button>
        <button style={dynamicStyles.navItem(activeTab === 'biblioteca')} onClick={() => setActiveTab('biblioteca')}>📚 Biblioteca</button>
        <button style={dynamicStyles.navItem(activeTab === 'progreso')} onClick={() => setActiveTab('progreso')}>📈 Progreso</button>
        <button style={dynamicStyles.navItem(activeTab === 'perfil')} onClick={() => setActiveTab('perfil')}>👤 Perfil</button>
      </nav>
    </div>
  );
}
