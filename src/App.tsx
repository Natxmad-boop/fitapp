import React, { useState, useEffect } from 'react';

// Definición de temas de colores (Modo Claro / Modo Oscuro)
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
  pin: string; // Seguridad basada en PIN según el guion
}

interface ExerciseInRoutine {
  id: number;
  name: string;
  targetSets: string;
}

interface RoutineItem {
  id: number;
  name: string;
  exercises: ExerciseInRoutine[];
}

interface SetItem {
  name: string;
  weight: number;
  reps: number;
  note?: string;
  date: string;
}

interface MealItem {
  id: number;
  category: string;
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  date: string;
}

interface WeightItem {
  id: number;
  weight: number;
  date: string;
}

interface DailyNoteItem {
  id: number;
  text: string;
  date: string;
}

export default function App() {
  // --- FASE 1 DEL GUION: GESTIÓN DE PERFILES Y SEGURIDAD CON PIN ---
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('fitapp_profiles');
    return saved ? JSON.parse(saved) : [{ id: '1', name: 'Atleta Principal', pin: '1234' }];
  });
  
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('fitapp_active_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [inputPin, setInputPin] = useState('');
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfilePin, setNewProfilePin] = useState('');
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'routines' | 'tracker' | 'nutrition' | 'body' | 'notes'>('dashboard');
  
  // Estado de Tema Oscuro / Claro
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('fitapp_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const t = isDarkMode ? themes.dark : themes.light;

  // Claves de almacenamiento aisladas por perfil (Aislamiento de datos del Guion)
  const pKey = currentProfile ? `_${currentProfile.id}` : '_default';

  // Estados persistentes por perfil
  const [routines, setRoutines] = useState<RoutineItem[]>(() => {
    const saved = localStorage.getItem(`fitapp_routines_v2${pKey}`);
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        name: 'Día 1: Full Body Fuerza',
        exercises: [
          { id: 101, name: 'Press de Banca', targetSets: '4 series x 6-8 reps' },
          { id: 102, name: 'Sentadilla Libre', targetSets: '4 series x 6-8 reps' },
        ],
      },
    ];
  });

  const [history, setHistory] = useState<SetItem[]>(() => {
    const saved = localStorage.getItem(`fitapp_history${pKey}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [meals, setMeals] = useState<MealItem[]>(() => {
    const saved = localStorage.getItem(`fitapp_meals${pKey}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [bodyWeights, setBodyWeights] = useState<WeightItem[]>(() => {
    const saved = localStorage.getItem(`fitapp_body_weights${pKey}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [dailyNotes, setDailyNotes] = useState<DailyNoteItem[]>(() => {
    const saved = localStorage.getItem(`fitapp_daily_notes${pKey}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [healthNotes, setHealthNotes] = useState(() => {
    return localStorage.getItem(`fitapp_health${pKey}`) || 'Sin lesiones ni restricciones médicas registradas.';
  });
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [tempHealth, setTempHealth] = useState(healthNotes);

  const [targetCalories, setTargetCalories] = useState<number>(() => {
    const saved = localStorage.getItem(`fitapp_target_cal${pKey}`);
    return saved ? JSON.parse(saved) : 2500;
  });
  const [targetProtein, setTargetProtein] = useState<number>(() => {
    const saved = localStorage.getItem(`fitapp_target_pro${pKey}`);
    return saved ? JSON.parse(saved) : 160;
  });
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [tempCal, setTempCal] = useState(String(targetCalories));
  const [tempPro, setTempPro] = useState(String(targetProtein));

  // Formularios y estados locales
  const [newRoutineName, setNewRoutineName] = useState('');
  const [selectedRoutineId, setSelectedRoutineId] = useState<number | null>(null);
  const [newExName, setNewExName] = useState('');
  const [newExTarget, setNewExTarget] = useState('');

  const [exerciseName, setExerciseName] = useState('Press de Banca');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [exerciseNote, setExerciseNote] = useState('');

  const [mealCategory, setMealCategory] = useState('Desayuno');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');

  const [newWeight, setNewWeight] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  const [rmWeight, setRmWeight] = useState('');
  const [rmReps, setRmReps] = useState('');

  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Sincronización de efectos con aislamiento por perfil
  useEffect(() => {
    localStorage.setItem('fitapp_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem('fitapp_active_profile', JSON.stringify(currentProfile));
    } else {
      localStorage.removeItem('fitapp_active_profile');
    }
  }, [currentProfile]);

  useEffect(() => {
    if (!currentProfile) return;
    localStorage.setItem(`fitapp_routines_v2${pKey}`, JSON.stringify(routines));
    localStorage.setItem(`fitapp_history${pKey}`, JSON.stringify(history));
    localStorage.setItem(`fitapp_meals${pKey}`, JSON.stringify(meals));
    localStorage.setItem(`fitapp_body_weights${pKey}`, JSON.stringify(bodyWeights));
    localStorage.setItem(`fitapp_daily_notes${pKey}`, JSON.stringify(dailyNotes));
    localStorage.setItem(`fitapp_health${pKey}`, healthNotes);
    localStorage.setItem(`fitapp_target_cal${pKey}`, JSON.stringify(targetCalories));
    localStorage.setItem(`fitapp_target_pro${pKey}`, JSON.stringify(targetProtein));
  }, [routines, history, meals, bodyWeights, dailyNotes, healthNotes, targetCalories, targetProtein, currentProfile, pKey]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };

  const handleLogin = (profile: UserProfile) => {
    if (profile.pin && profile.pin.length > 0) {
      if (inputPin === profile.pin) {
        setCurrentProfile(profile);
        setInputPin('');
      } else {
        alert('PIN incorrecto.');
      }
    } else {
      setCurrentProfile(profile);
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    const newProf: UserProfile = {
      id: Date.now().toString(),
      name: newProfileName,
      pin: newProfilePin.trim(),
    };
    const updated = [...profiles, newProf];
    setProfiles(updated);
    localStorage.setItem('fitapp_profiles', JSON.stringify(updated));
    setNewProfileName('');
    setNewProfilePin('');
    setIsCreatingProfile(false);
    setCurrentProfile(newProf);
  };

  // Handlers funcionales de la app
  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineName.trim()) return;
    setRoutines([...routines, { id: Date.now(), name: newRoutineName, exercises: [] }]);
    setNewRoutineName('');
  };

  const handleAddExerciseToRoutine = (routineId: number, e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;
    setRoutines(
      routines.map((r) => {
        if (r.id === routineId) {
          return {
            ...r,
            exercises: [
              ...r.exercises,
              { id: Date.now(), name: newExName, targetSets: newExTarget || '3 series x 10 reps' },
            ],
          };
        }
        return r;
      })
    );
    setNewExName('');
    setNewExTarget('');
  };

  const handleAddSet = () => {
    const parsedWeight = parseFloat(weight);
    const parsedReps = parseInt(reps, 10);
    if (isNaN(parsedWeight) || isNaN(parsedReps)) return;

    const newSet: SetItem = {
      name: exerciseName.trim() || 'Ejercicio',
      weight: parsedWeight,
      reps: parsedReps,
      note: exerciseNote.trim(),
      date: new Date().toLocaleDateString(),
    };

    setHistory([newSet, ...history]);
    setWeight('');
    setReps('');
    setExerciseNote('');
    startTimer(90);
  };

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    const newMeal: MealItem = {
      id: Date.now(),
      category: mealCategory,
      food: foodName,
      calories: parseInt(calories, 10) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fats: parseFloat(fats) || 0,
      date: new Date().toLocaleDateString(),
    };

    setMeals([newMeal, ...meals]);
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
  };

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(newWeight);
    if (isNaN(parsed)) return;

    setBodyWeights([{ id: Date.now(), weight: parsed, date: new Date().toLocaleDateString() }, ...bodyWeights]);
    setNewWeight('');
  };

  const handleAddDailyNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setDailyNotes([{ id: Date.now(), text: newNoteText, date: new Date().toLocaleDateString() }, ...dailyNotes]);
    setNewNoteText('');
  };

  const clearHistory = () => {
    if (window.confirm('¿Borrar historial de series?')) setHistory([]);
  };

  const clearMeals = () => {
    if (window.confirm('¿Borrar registro de comidas?')) setMeals([]);
  };

  const saveHealthNotes = () => {
    setHealthNotes(tempHealth);
    setIsEditingHealth(false);
  };

  const saveGoals = () => {
    const c = parseInt(tempCal, 10);
    const p = parseFloat(tempPro);
    if (!isNaN(c)) setTargetCalories(c);
    if (!isNaN(p)) setTargetProtein(p);
    setIsEditingGoals(false);
  };

  const exportData = () => {
    const data = { routines, history, meals, bodyWeights, dailyNotes, healthNotes, targetCalories, targetProtein };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitapp_${currentProfile?.name}_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  // Cálculos
  const personalRecords = history.reduce((acc: { [key: string]: number }, item) => {
    if (!acc[item.name] || item.weight > acc[item.name]) {
      acc[item.name] = item.weight;
    }
    return acc;
  }, {});

  const exerciseCounts = history.reduce((acc: { [key: string]: number }, item) => {
    acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {});

  const totalCaloriesToday = meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProteinToday = meals.reduce((acc, m) => acc + m.protein, 0);
  const latestWeight = bodyWeights.length > 0 ? bodyWeights[0].weight : '--';

  const calc1RM = () => {
    const w = parseFloat(rmWeight);
    const r = parseInt(rmReps, 10);
    if (isNaN(w) || isNaN(r) || r <= 0) return 0;
    if (r === 1) return w;
    return Math.round(w * (1 + r / 30));
  };
  const estimated1RM = calc1RM();

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
      transition: 'background-color 0.3s ease, color 0.3s ease',
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
    dangerButton: {
      backgroundColor: t.dangerBg,
      color: '#ffffff',
      border: 'none',
      padding: '6px 10px',
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
    select: {
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
      padding: '8px 0',
      maxWidth: '480px',
      margin: '0 auto',
      zIndex: 100,
    },
    navItem: (active: boolean) => ({
      background: 'none',
      border: 'none',
      fontSize: '9px',
      fontWeight: active ? '700' : '500',
      color: active ? t.navActive : t.navText,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '2px',
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

  // --- PANTALLA DE SELECCIÓN DE PERFIL / SEGURIDAD (Fase 1 del Guion) ---
  if (!currentProfile) {
    return (
      <div style={dynamicStyles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.text, margin: '0 0 4px 0' }}>FitApp Pro 💪</h1>
            <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>Selecciona tu perfil de acceso</p>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={dynamicStyles.secondaryButton}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div style={dynamicStyles.card}>
          <h2 style={dynamicStyles.cardTitle}>🔐 Perfiles Registrados</h2>
          {profiles.map((prof) => (
            <div key={prof.id} style={{ ...dynamicStyles.listItem, flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '15px', color: t.text }}>{prof.name}</strong>
              </div>
              {prof.pin ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="password"
                    placeholder="Introduce PIN"
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                    style={{ ...dynamicStyles.input, margin: 0 }}
                    maxLength={4}
                  />
                  <button style={{ ...dynamicStyles.button, width: '120px', margin: 0 }} onClick={() => handleLogin(prof)}>
                    Entrar
                  </button>
                </div>
              ) : (
                <button style={dynamicStyles.button} onClick={() => handleLogin(prof)}>
                  Entrar sin PIN
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
              <h2 style={dynamicStyles.cardTitle}>Nuevo Perfil</h2>
              <input
                type="text"
                placeholder="Nombre del atleta"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                style={dynamicStyles.input}
              />
              <input
                type="password"
                placeholder="PIN de seguridad (opcional)"
                value={newProfilePin}
                onChange={(e) => setNewProfilePin(e.target.value)}
                style={dynamicStyles.input}
                maxLength={4}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={dynamicStyles.button}>Crear y Acceder</button>
                <button type="button" style={dynamicStyles.secondaryButton} onClick={() => setIsCreatingProfile(false)}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- APLICACIÓN PRINCIPAL (Con el perfil ya autenticado y aislado) ---
  return (
    <div style={dynamicStyles.container}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', color: t.text, margin: '0 0 2px 0' }}>FitApp 💪</h1>
          <p style={{ fontSize: '12px', color: t.primary, margin: 0, fontWeight: '600' }}>Atleta: {currentProfile.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setCurrentProfile(null)} style={{ ...dynamicStyles.secondaryButton, fontSize: '11px' }}>
            Cambiar Perfil
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={dynamicStyles.secondaryButton}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* VISTA 1: DASHBOARD, ESTADÍSTICAS Y GRÁFICOS */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>Resumen General</h2>
            <div style={dynamicStyles.grid}>
              <div style={dynamicStyles.statBox}>
                <p style={dynamicStyles.statValue}>{latestWeight} kg</p>
                <p style={dynamicStyles.statLabel}>Peso Corporal</p>
              </div>
              <div style={dynamicStyles.statBox}>
                <p style={dynamicStyles.statValue}>{totalCaloriesToday} kcal</p>
                <p style={dynamicStyles.statLabel}>Calorías Hoy</p>
              </div>
            </div>

            <div style={{ marginTop: '14px', borderTop: `1px solid ${t.border}`, paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: t.textSecondary }}>Calorías (Meta: {targetCalories} kcal)</span>
                <span style={{ fontWeight: '600', color: t.text }}>{Math.min(Math.round((totalCaloriesToday / targetCalories) * 100), 100)}%</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: t.statBg, borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${Math.min((totalCaloriesToday / targetCalories) * 100, 100)}%`, height: '100%', backgroundColor: t.primary, borderRadius: '4px' }}></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: t.textSecondary }}>Proteína (Meta: {targetProtein}g)</span>
                <span style={{ fontWeight: '600', color: t.text }}>{totalProteinToday}g</span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: t.statBg, borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min((totalProteinToday / targetProtein) * 100, 100)}%`, height: '100%', backgroundColor: '#10b981', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>📈 Gráfico de Evolución de Peso</h2>
            {bodyWeights.length === 0 ? (
              <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>Registra tu peso en la pestaña "Peso" para ver la evolución.</p>
            ) : (
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '100px', gap: '8px', paddingBottom: '10px', borderBottom: `1px solid ${t.border}` }}>
                {bodyWeights.slice().reverse().map((item, idx) => {
                  const minW = Math.min(...bodyWeights.map(w => w.weight)) - 2;
                  const maxW = Math.max(...bodyWeights.map(w => w.weight)) + 2;
                  const heightPercent = Math.max(15, Math.min(100, ((item.weight - minW) / (maxW - minW || 1)) * 100));
                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '10px', color: t.primary, marginBottom: '2px', fontWeight: '600' }}>{item.weight}</span>
                      <div style={{ width: '100%', height: `${heightPercent}%`, backgroundColor: t.primary, borderRadius: '4px 4px 0 0' }}></div>
                      <span style={{ fontSize: '9px', color: t.textSecondary, marginTop: '4px' }}>{item.date.slice(0, 5)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>📊 Estadísticas de Entrenamiento</h2>
            <div style={dynamicStyles.grid}>
              <div style={dynamicStyles.statBox}>
                <p style={dynamicStyles.statValue}>{history.length}</p>
                <p style={dynamicStyles.statLabel}>Series Totales</p>
              </div>
              <div style={dynamicStyles.statBox}>
                <p style={dynamicStyles.statValue}>{Object.keys(exerciseCounts).length}</p>
                <p style={dynamicStyles.statLabel}>Ejercicios Únicos</p>
              </div>
            </div>
          </div>

          <div style={dynamicStyles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{ ...dynamicStyles.cardTitle, margin: 0 }}>🩺 Estado de Salud</h2>
              {!isEditingHealth && (
                <button style={dynamicStyles.secondaryButton} onClick={() => { setTempHealth(healthNotes); setIsEditingHealth(true); }}>Editar</button>
              )}
            </div>
            {isEditingHealth ? (
              <div>
                <textarea value={tempHealth} onChange={(e) => setTempHealth(e.target.value)} style={{ ...dynamicStyles.input, height: '70px', resize: 'none' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={dynamicStyles.button} onClick={saveHealthNotes}>Guardar</button>
                  <button style={dynamicStyles.secondaryButton} onClick={() => setIsEditingHealth(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0, lineHeight: '1.4' }}>{healthNotes}</p>
            )}
          </div>

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>🏆 Récords Personales (PRs)</h2>
            {Object.keys(personalRecords).length === 0 ? (
              <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>Sin registros todavía.</p>
            ) : (
              Object.entries(personalRecords).map(([ex, maxWeight]) => (
                <div key={ex} style={dynamicStyles.listItem}>
                  <strong style={{ color: t.text }}>{ex}</strong>
                  <span style={{ color: t.primary, fontWeight: '700' }}>{maxWeight} kg máx</span>
                </div>
              ))
            )}
          </div>

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>💾 Copia de Seguridad</h2>
            <button style={dynamicStyles.secondaryButton} onClick={exportData}>Exportar Respaldo del Atleta (.json)</button>
          </div>
        </div>
      )}

      {/* VISTA 2: RUTINAS DETALLADAS */}
      {activeTab === 'routines' && (
        <div>
          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>Crear Nueva Rutina</h2>
            <form onSubmit={handleAddRoutine}>
              <input type="text" placeholder="Ej: Día 3: Pierna" value={newRoutineName} onChange={(e) => setNewRoutineName(e.target.value)} style={dynamicStyles.input} />
              <button type="submit" style={dynamicStyles.button}>Añadir Rutina</button>
            </form>
          </div>

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>Mis Rutinas</h2>
            {routines.map((routine) => (
              <div key={routine.id} style={{ ...dynamicStyles.listItem, flexDirection: 'column', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <strong style={{ color: t.text, fontSize: '15px' }}>{routine.name}</strong>
                  <button style={dynamicStyles.secondaryButton} onClick={() => setSelectedRoutineId(selectedRoutineId === routine.id ? null : routine.id)}>
                    {selectedRoutineId === routine.id ? 'Ocultar' : 'Ver Ejercicios'}
                  </button>
                </div>

                {selectedRoutineId === routine.id && (
                  <div style={{ width: '100%', marginTop: '12px', borderTop: `1px solid ${t.border}`, paddingTop: '8px' }}>
                    {routine.exercises.length === 0 ? (
                      <p style={{ fontSize: '12px', color: t.textSecondary }}>No hay ejercicios añadidos.</p>
                    ) : (
                      routine.exercises.map((ex) => (
                        <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: `1px dashed ${t.border}` }}>
                          <span style={{ color: t.text }}>{ex.name}</span>
                          <span style={{ color: t.primary, fontWeight: '600' }}>{ex.targetSets}</span>
                        </div>
                      ))
                    )}

                    <form onSubmit={(e) => handleAddExerciseToRoutine(routine.id, e)} style={{ marginTop: '10px' }}>
                      <input type="text" placeholder="Nombre ejercicio" value={newExName} onChange={(e) => setNewExName(e.target.value)} style={dynamicStyles.input} />
                      <input type="text" placeholder="Series/Reps (ej. 3x10)" value={newExTarget} onChange={(e) => setNewExTarget(e.target.value)} style={dynamicStyles.input} />
                      <button type="submit" style={dynamicStyles.secondaryButton}>+ Añadir Ejercicio</button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 3: TRACKER DE ENTRENAMIENTO Y 1RM */}
      {activeTab === 'tracker' && (
        <div>
          <div style={{ ...dynamicStyles.card, backgroundColor: timeLeft > 0 ? (isDarkMode ? '#032541' : '#eff6ff') : t.cardBg }}>
            <h2 style={dynamicStyles.cardTitle}>⏱️ Descanso entre Series</h2>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '32px', fontWeight: '700', color: timeLeft > 0 ? t.primary : t.textSecondary }}>
                {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
              <button style={dynamicStyles.secondaryButton} onClick={() => startTimer(60)}>1 min</button>
              <button style={dynamicStyles.secondaryButton} onClick={() => startTimer(90)}>1:30 min</button>
              <button style={dynamicStyles.secondaryButton} onClick={() => startTimer(120)}>2 min</button>
              {isTimerRunning && (
                <button style={{ ...dynamicStyles.secondaryButton, backgroundColor: '#fee2e2', color: '#991b1b' }} onClick={() => { setIsTimerRunning(false); setTimeLeft(0); }}>Parar</button>
              )}
            </div>
          </div>

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>Registrar Serie</h2>
            <input type="text" placeholder="Nombre del ejercicio" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} style={dynamicStyles.input} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" placeholder="Peso (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} style={dynamicStyles.input} />
              <input type="number" placeholder="Reps" value={reps} onChange={(e) => setReps(e.target.value)} style={dynamicStyles.input} />
            </div>
            <input type="text" placeholder="Notas (RPE...)" value={exerciseNote} onChange={(e) => setExerciseNote(e.target.value)} style={dynamicStyles.input} />
            <button style={dynamicStyles.button} onClick={handleAddSet}>Guardar Serie y Descansar</button>
          </div>

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>🔢 Calculadora de 1RM</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" placeholder="Peso (kg)" value={rmWeight} onChange={(e) => setRmWeight(e.target.value)} style={dynamicStyles.input} />
              <input type="number" placeholder="Reps" value={rmReps} onChange={(e) => setRmReps(e.target.value)} style={dynamicStyles.input} />
            </div>
            <div style={{ textAlign: 'center', marginTop: '6px', padding: '10px', backgroundColor: t.statBg, borderRadius: '8px' }}>
              <span style={{ fontSize: '13px', color: t.textSecondary }}>1RM Estimado: </span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: t.primary }}>{estimated1RM} kg</span>
            </div>
          </div>

          {history.length > 0 && (
            <div style={dynamicStyles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ ...dynamicStyles.cardTitle, margin: 0 }}>Historial</h2>
                <button style={dynamicStyles.dangerButton} onClick={clearHistory}>Limpiar</button>
              </div>
              {history.map((item, index) => (
                <div key={index} style={dynamicStyles.listItem}>
                  <div>
                    <strong style={{ color: t.text, display: 'block' }}>{item.name}</strong>
                    {item.note && <span style={{ fontSize: '11px', color: t.primary, display: 'block' }}>{item.note}</span>}
                    <span style={{ fontSize: '11px', color: t.textSecondary }}>{item.date}</span>
                  </div>
                  <span style={{ color: t.primary, fontWeight: '600' }}>{item.weight} kg × {item.reps} reps</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VISTA 4: NUTRICIÓN */}
      {activeTab === 'nutrition' && (
        <div>
          <div style={dynamicStyles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ ...dynamicStyles.cardTitle, margin: 0 }}>🎯 Objetivos Diarios</h2>
              {!isEditingGoals && (
                <button style={dynamicStyles.secondaryButton} onClick={() => { setTempCal(String(targetCalories)); setTempPro(String(targetProtein)); setIsEditingGoals(true); }}>Configurar</button>
              )}
            </div>
            {isEditingGoals ? (
              <div>
                <input type="number" placeholder="Calorías objetivo" value={tempCal} onChange={(e) => setTempCal(e.target.value)} style={dynamicStyles.input} />
                <input type="number" placeholder="Proteína objetivo (g)" value={tempPro} onChange={(e) => setTempPro(e.target.value)} style={dynamicStyles.input} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={dynamicStyles.button} onClick={saveGoals}>Guardar Metas</button>
                  <button style={dynamicStyles.secondaryButton} onClick={() => setIsEditingGoals(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: t.textSecondary }}>
                Meta actual: <strong>{targetCalories} kcal</strong> | Proteína: <strong>{targetProtein}g</strong>
              </div>
            )}
          </div>

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>🥗 Registrar Comida</h2>
            <form onSubmit={handleAddMeal}>
              <select value={mealCategory} onChange={(e) => setMealCategory(e.target.value)} style={dynamicStyles.select}>
                <option value="Desayuno">Desayuno</option>
                <option value="Almuerzo">Almuerzo</option>
                <option value="Cena">Cena</option>
                <option value="Snack / Extra">Snack / Extra</option>
              </select>
              <input type="text" placeholder="Ej: Arroz con pollo" value={foodName} onChange={(e) => setFoodName(e.target.value)} style={dynamicStyles.input} />
              <input type="number" placeholder="Calorías (kcal)" value={calories} onChange={(e) => setCalories(e.target.value)} style={dynamicStyles.input} />
              <div style={{ display: 'flex', gap: '6px' }}>
                <input type="number" placeholder="Proteína (g)" value={protein} onChange={(e) => setProtein(e.target.value)} style={dynamicStyles.input} />
                <input type="number" placeholder="Carbos (g)" value={carbs} onChange={(e) => setCarbs(e.target.value)} style={dynamicStyles.input} />
                <input type="number" placeholder="Grasas (g)" value={fats} onChange={(e) => setFats(e.target.value)} style={dynamicStyles.input} />
              </div>
              <button type="submit" style={dynamicStyles.button}>Añadir al Registro</button>
            </form>
          </div>

          <div style={dynamicStyles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ ...dynamicStyles.cardTitle, margin: 0 }}>Historial de Nutrición</h2>
              {meals.length > 0 && <button style={dynamicStyles.dangerButton} onClick={clearMeals}>Limpiar</button>}
            </div>
            {meals.length === 0 ? (
              <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>No hay comidas registradas.</p>
            ) : (
              meals.map((meal) => (
                <div key={meal.id} style={dynamicStyles.listItem}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: t.primary, textTransform: 'uppercase' }}>{meal.category}</span>
                    <strong style={{ color: t.text, display: 'block' }}>{meal.food}</strong>
                    <span style={{ fontSize: '11px', color: t.textSecondary }}>P: {meal.protein}g | C: {meal.carbs}g | G: {meal.fats}g</span>
                  </div>
                  <span style={{ color: t.text, fontWeight: '600' }}>{meal.calories} kcal</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VISTA 5: PESO CORPORAL */}
      {activeTab === 'body' && (
        <div>
          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>⚖️ Registrar Peso Corporal</h2>
            <form onSubmit={handleAddWeight}>
              <input type="number" step="0.1" placeholder="Peso actual (ej. 75.5)" value={newWeight} onChange={(e) => setNewWeight(e.target.value)} style={dynamicStyles.input} />
              <button type="submit" style={dynamicStyles.button}>Guardar Peso</button>
            </form>
          </div>

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>Historial de Pesajes</h2>
            {bodyWeights.length === 0 ? (
              <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>Aún no hay pesajes.</p>
            ) : (
              bodyWeights.map((item) => (
                <div key={item.id} style={dynamicStyles.listItem}>
                  <span style={{ fontSize: '13px', color: t.textSecondary }}>{item.date}</span>
                  <strong style={{ color: t.primary, fontSize: '16px' }}>{item.weight} kg</strong>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VISTA 6: DIARIO */}
      {activeTab === 'notes' && (
        <div>
          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>📝 Diario y Sensaciones</h2>
            <form onSubmit={handleAddDailyNote}>
              <textarea placeholder="¿Cómo ha ido el día? ¿Estrés, energía, sueño...?" value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} style={{ ...dynamicStyles.input, height: '80px', resize: 'none' }} />
              <button type="submit" style={dynamicStyles.button}>Guardar Nota</button>
            </form>
          </div>

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>Historial del Diario</h2>
            {dailyNotes.length === 0 ? (
              <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>Sin notas registradas.</p>
            ) : (
              dailyNotes.map((note) => (
                <div key={note.id} style={{ ...dynamicStyles.listItem, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '11px', color: t.primary, fontWeight: '600', marginBottom: '2px' }}>{note.date}</span>
                  <p style={{ fontSize: '13px', color: t.text, margin: 0, lineHeight: '1.4' }}>{note.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Navegación Inferior */}
      <nav style={dynamicStyles.nav}>
        <button style={dynamicStyles.navItem(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>📊 Panel</button>
        <button style={dynamicStyles.navItem(activeTab === 'routines')} onClick={() => setActiveTab('routines')}>📋 Rutinas</button>
        <button style={dynamicStyles.navItem(activeTab === 'tracker')} onClick={() => setActiveTab('tracker')}>⚡ Entrenar</button>
        <button style={dynamicStyles.navItem(activeTab === 'nutrition')} onClick={() => setActiveTab('nutrition')}>🥗 Nutrición</button>
        <button style={dynamicStyles.navItem(activeTab === 'body')} onClick={() => setActiveTab('body')}>⚖️ Peso</button>
        <button style={dynamicStyles.navItem(activeTab === 'notes')} onClick={() => setActiveTab('notes')}>📝 Diario</button>
      </nav>
    </div>
  );
}
