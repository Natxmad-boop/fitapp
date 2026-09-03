import React, { useState, useEffect } from 'react';

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    maxWidth: '480px',
    margin: '0 auto',
    padding: '16px',
    paddingBottom: '90px',
    color: '#111',
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
  },
  header: {
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 0,
    marginBottom: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  statBox: {
    backgroundColor: '#f1f5f9',
    padding: '12px',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
  statValue: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0284c7',
    margin: '0 0 4px 0',
  },
  statLabel: {
    fontSize: '12px',
    color: '#475569',
    margin: 0,
  },
  button: {
    backgroundColor: '#0284c7',
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
    backgroundColor: '#e2e8f0',
    color: '#334155',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '12px',
  },
  dangerButton: {
    backgroundColor: '#ef4444',
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
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    marginBottom: '10px',
    boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    marginBottom: '10px',
    backgroundColor: '#fff',
    boxSizing: 'border-box' as const,
  },
  nav: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0',
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
    color: active ? '#0284c7' : '#64748b',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
  }),
  listItem: {
    padding: '12px 0',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
  },
};

interface SetItem {
  name: string;
  weight: number;
  reps: number;
  date: string;
}

interface MealItem {
  id: number;
  category: string;
  food: string;
  calories: number;
  date: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'routines' | 'tracker' | 'nutrition'>('dashboard');

  // Estados de Entreno y Rutinas (con localStorage)
  const [routines, setRoutines] = useState(() => {
    const saved = localStorage.getItem('fitapp_routines');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Día 1: Full Body Fuerza', exercises: 5 },
      { id: 2, name: 'Día 2: Hipertrofia Tren Superior', exercises: 6 },
    ];
  });

  const [history, setHistory] = useState<SetItem[]>(() => {
    const saved = localStorage.getItem('fitapp_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Estados de Nutrición y Salud (con localStorage)
  const [meals, setMeals] = useState<MealItem[]>(() => {
    const saved = localStorage.getItem('fitapp_meals');
    return saved ? JSON.parse(saved) : [];
  });

  const [healthNotes, setHealthNotes] = useState(() => {
    return localStorage.getItem('fitapp_health') || 'Sin lesiones ni restricciones médicas registradas.';
  });
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [tempHealth, setTempHealth] = useState(healthNotes);

  const [newRoutineName, setNewRoutineName] = useState('');
  const [exerciseName, setExerciseName] = useState('Press de Banca');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');

  // Formulario de Nutrición
  const [mealCategory, setMealCategory] = useState('Desayuno');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');

  // Temporizador
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem('fitapp_routines', JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem('fitapp_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('fitapp_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('fitapp_health', healthNotes);
  }, [healthNotes]);

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

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineName.trim()) return;
    setRoutines([...routines, { id: Date.now(), name: newRoutineName, exercises: 4 }]);
    setNewRoutineName('');
  };

  const handleAddSet = () => {
    const parsedWeight = parseFloat(weight);
    const parsedReps = parseInt(reps, 10);
    if (isNaN(parsedWeight) || isNaN(parsedReps)) return;

    const newSet: SetItem = {
      name: exerciseName.trim() || 'Ejercicio',
      weight: parsedWeight,
      reps: parsedReps,
      date: new Date().toLocaleDateString(),
    };

    setHistory([newSet, ...history]);
    setWeight('');
    setReps('');
    startTimer(90);
  };

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;
    const parsedCals = parseInt(calories, 10) || 0;

    const newMeal: MealItem = {
      id: Date.now(),
      category: mealCategory,
      food: foodName,
      calories: parsedCals,
      date: new Date().toLocaleDateString(),
    };

    setMeals([newMeal, ...meals]);
    setFoodName('');
    setCalories('');
  };

  const clearHistory = () => {
    if (window.confirm('¿Seguro que quieres borrar el historial de series?')) {
      setHistory([]);
    }
  };

  const clearMeals = () => {
    if (window.confirm('¿Seguro que quieres borrar el registro de comidas?')) {
      setMeals([]);
    }
  };

  const saveHealthNotes = () => {
    setHealthNotes(tempHealth);
    setIsEditingHealth(false);
  };

  // Cálculos rápidos
  const personalRecords = history.reduce((acc: { [key: string]: number }, item) => {
    if (!acc[item.name] || item.weight > acc[item.name]) {
      acc[item.name] = item.weight;
    }
    return acc;
  }, {});

  const totalCaloriesToday = meals.reduce((acc, m) => acc + m.calories, 0);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>FitApp 💪</h1>
        <p style={styles.subtitle}>Entreno, Nutrición y Salud</p>
      </header>

      {/* VISTA 1: DASHBOARD (PANEL GENERAL) */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Resumen General</h2>
            <div style={styles.grid}>
              <div style={styles.statBox}>
                <p style={styles.statValue}>{history.length}</p>
                <p style={styles.statLabel}>Series Hechas</p>
              </div>
              <div style={styles.statBox}>
                <p style={styles.statValue}>{totalCaloriesToday} kcal</p>
                <p style={styles.statLabel}>Calorías Registradas</p>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h2 style={{ ...styles.cardTitle, margin: 0 }}>🩺 Estado de Salud y Notas</h2>
              {!isEditingHealth && (
                <button style={styles.secondaryButton} onClick={() => { setTempHealth(healthNotes); setIsEditingHealth(true); }}>
                  Editar
                </button>
              )}
            </div>
            {isEditingHealth ? (
              <div>
                <textarea
                  value={tempHealth}
                  onChange={(e) => setTempHealth(e.target.value)}
                  style={{ ...styles.input, height: '70px', resize: 'none' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={styles.button} onClick={saveHealthNotes}>Guardar</button>
                  <button style={styles.secondaryButton} onClick={() => setIsEditingHealth(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: '13px', color: '#334155', margin: 0, lineHeight: '1.4' }}>
                {healthNotes}
              </p>
            )}
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🏆 Récords Personales (PRs)</h2>
            {Object.keys(personalRecords).length === 0 ? (
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Sin registros todavía. ¡Empieza a entrenar!
              </p>
            ) : (
              Object.entries(personalRecords).map(([ex, maxWeight]) => (
                <div key={ex} style={styles.listItem}>
                  <strong style={{ color: '#1e293b' }}>{ex}</strong>
                  <span style={{ color: '#0284c7', fontWeight: '700' }}>{maxWeight} kg máx</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VISTA 2: RUTINAS */}
      {activeTab === 'routines' && (
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Crear Nueva Rutina</h2>
            <form onSubmit={handleAddRoutine}>
              <input
                type="text"
                placeholder="Ej: Día 3: Pierna y Hombro"
                value={newRoutineName}
                onChange={(e) => setNewRoutineName(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.button}>Añadir Rutina</button>
            </form>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Mis Rutinas</h2>
            {routines.map((routine: { id: number; name: string; exercises: number }) => (
              <div key={routine.id} style={styles.listItem}>
                <div>
                  <strong style={{ color: '#1e293b' }}>{routine.name}</strong>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                    {routine.exercises} ejercicios configurados
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 3: TRACKER DE ENTRENAMIENTO */}
      {activeTab === 'tracker' && (
        <div>
          <div style={{ ...styles.card, backgroundColor: timeLeft > 0 ? '#eff6ff' : '#ffffff', borderColor: timeLeft > 0 ? '#bfdbfe' : '#e2e8f0' }}>
            <h2 style={styles.cardTitle}>⏱️ Descanso entre Series</h2>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '32px', fontWeight: '700', color: timeLeft > 0 ? '#0284c7' : '#94a3b8' }}>
                {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
              </span>
            </div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
              <button style={styles.secondaryButton} onClick={() => startTimer(60)}>1 min</button>
              <button style={styles.secondaryButton} onClick={() => startTimer(90)}>1:30 min</button>
              <button style={styles.secondaryButton} onClick={() => startTimer(120)}>2 min</button>
              {isTimerRunning && (
                <button style={{ ...styles.secondaryButton, backgroundColor: '#fee2e2', color: '#991b1b' }} onClick={() => { setIsTimerRunning(false); setTimeLeft(0); }}>Parar</button>
              )}
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Registrar Serie</h2>
            <input
              type="text"
              placeholder="Nombre del ejercicio"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              style={styles.input}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                placeholder="Peso (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                style={styles.input}
              />
              <input
                type="number"
                placeholder="Reps"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                style={styles.input}
              />
            </div>
            <button style={styles.button} onClick={handleAddSet}>Guardar Serie y Descansar</button>
          </div>

          {history.length > 0 && (
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h2 style={{ ...styles.cardTitle, margin: 0 }}>Historial de Series</h2>
                <button style={styles.dangerButton} onClick={clearHistory}>Limpiar</button>
              </div>
              {history.map((item: SetItem, index: number) => (
                <div key={index} style={styles.listItem}>
                  <div>
                    <strong style={{ color: '#1e293b', display: 'block' }}>{item.name}</strong>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{item.date}</span>
                  </div>
                  <span style={{ color: '#0284c7', fontWeight: '600' }}>{item.weight} kg × {item.reps} reps</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VISTA 4: NUTRICIÓN Y COMIDAS */}
      {activeTab === 'nutrition' && (
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🥗 Registrar Comida</h2>
            <form onSubmit={handleAddMeal}>
              <select
                value={mealCategory}
                onChange={(e) => setMealCategory(e.target.value)}
                style={styles.select}
              >
                <option value="Desayuno">Desayuno</option>
                <option value="Almuerzo">Almuerzo</option>
                <option value="Cena">Cena</option>
                <option value="Snack / Extra">Snack / Extra</option>
              </select>
              <input
                type="text"
                placeholder="Ej: Avena con plátano y proteína"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                style={styles.input}
              />
              <input
                type="number"
                placeholder="Calorías estimadas (kcal)"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.button}>Añadir al Registro</button>
            </form>
          </div>

          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ ...styles.cardTitle, margin: 0 }}>Historial de Nutrición</h2>
              {meals.length > 0 && (
                <button style={styles.dangerButton} onClick={clearMeals}>Limpiar</button>
              )}
            </div>
            {meals.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                No hay comidas registradas todavía.
              </p>
            ) : (
              meals.map((meal: MealItem) => (
                <div key={meal.id} style={styles.listItem}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: '#0284c7', textTransform: 'uppercase' }}>
                      {meal.category}
                    </span>
                    <strong style={{ color: '#1e293b', display: 'block' }}>{meal.food}</strong>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{meal.date}</span>
                  </div>
                  <span style={{ color: '#334155', fontWeight: '600' }}>{meal.calories} kcal</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Navegación Inferior Actualizada */}
      <nav style={styles.nav}>
        <button style={styles.navItem(activeTab === 'dashboard')} onClick={() => setActiveTab('dashboard')}>
          📊 Panel
        </button>
        <button style={styles.navItem(activeTab === 'routines')} onClick={() => setActiveTab('routines')}>
          📋 Rutinas
        </button>
        <button style={styles.navItem(activeTab === 'tracker')} onClick={() => setActiveTab('tracker')}>
          ⚡ Entrenar
        </button>
        <button style={styles.navItem(activeTab === 'nutrition')} onClick={() => setActiveTab('nutrition')}>
          🥗 Nutrición
        </button>
      </nav>
    </div>
  );
}
