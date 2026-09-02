import React, { useState } from 'react';

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
    fontSize: '12px',
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

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'routines' | 'tracker'>('dashboard');
  
  // Estados interactivos para añadir rutinas y registrar series
  const [routines, setRoutines] = useState([
    { id: 1, name: 'Día 1: Full Body Fuerza', exercises: 5 },
    { id: 2, name: 'Día 2: Hipertrofia Tren Superior', exercises: 6 },
  ]);
  const [newRoutineName, setNewRoutineName] = useState('');

  const [exerciseName, setExerciseName] = useState('Press de Banca');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [history, setHistory] = useState<Array<{ name: string; weight: string; reps: string }>>([]);

  const handleAddRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineName.trim()) return;
    setRoutines([...routines, { id: Date.now(), name: newRoutineName, exercises: 4 }]);
    setNewRoutineName('');
  };

  const handleAddSet = () => {
    if (!weight || !reps) return;
    setHistory([...history, { name: exerciseName, weight, reps }]);
    setWeight('');
    setReps('');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>FitApp 💪</h1>
        <p style={styles.subtitle}>Tu progreso diario bajo control</p>
      </header>

      {/* VISTA 1: DASHBOARD */}
      {activeTab === 'dashboard' && (
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Resumen Semanal</h2>
            <div style={styles.grid}>
              <div style={styles.statBox}>
                <p style={styles.statValue}>{history.length + 3}</p>
                <p style={styles.statLabel}>Series Registradas</p>
              </div>
              <div style={styles.statBox}>
                <p style={styles.statValue}>{routines.length}</p>
                <p style={styles.statLabel}>Rutinas Activas</p>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Próximo Entrenamiento</h2>
            <p style={{ fontSize: '14px', color: '#334155', margin: '0 0 12px 0' }}>
              Mantén la sobrecarga progresiva y registra cada serie al momento.
            </p>
            <button style={styles.button} onClick={() => setActiveTab('tracker')}>
              Comenzar Entrenamiento
            </button>
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
            {routines.map((routine) => (
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

      {/* VISTA 3: TRACKER DE EJERCICIOS */}
      {activeTab === 'tracker' && (
        <div>
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
            <button style={styles.button} onClick={handleAddSet}>Guardar Serie</button>
          </div>

          {history.length > 0 && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Series de la Sesión</h2>
              {history.map((item, index) => (
                <div key={index} style={styles.listItem}>
                  <span style={{ fontWeight: '600', color: '#1e293b' }}>{item.name}</span>
                  <span style={{ color: '#0284c7', fontWeight: '600' }}>{item.weight} kg × {item.reps} reps</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navegación Inferior */}
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
      </nav>
    </div>
  );
}
