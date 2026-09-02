import React, { useState } from 'react';

// Estilos base incrustados para que luzca limpio y profesional al instante
const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    maxWidth: '480px',
    margin: '0 auto',
    padding: '16px',
    paddingBottom: '80px', // Espacio para la barra de navegación inferior
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
    color: '#white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    textAlign: 'center' as const,
    fontSize: '14px',
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
    padding: '10px 0',
    borderBottom: '1px solid #f1f5f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'routines' | 'tracker'>('dashboard');
  const [routines, setRoutines] = useState([
    { id: 1, name: 'Día 1: Full Body Fuerza', exercises: 5 },
    { id: 2, name: 'Día 2: Hipertrofia Tren Superior', exercises: 6 },
    { id: 3, name: 'Día 3: Pierna y Core', exercises: 4 },
  ]);

  return (
    <div style={styles.container}>
      {/* Cabecera */}
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
                <p style={styles.statValue}>3</p>
                <p style={styles.statLabel}>Entrenos Realizados</p>
              </div>
              <div style={styles.statBox}>
                <p style={styles.statValue}>2.4h</p>
                <p style={styles.statLabel}>Tiempo Total</p>
              </div>
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Próximo Objetivo</h2>
            <p style={{ fontSize: '14px', color: '#334155', margin: '0 0 12px 0' }}>
              Completar la rutina de Tren Superior manteniendo la sobrecarga progresiva en press de banca.
            </p>
            <button style={styles.button} onClick={() => setActiveTab('tracker')}>
              Comenzar Entrenamiento
            </button>
          </div>
        </div>
      )}

      {/* VISTA 2: RUTINAS */}
      {activeTab === 'routines' && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Mis Rutinas</h2>
          <div>
            {routines.map((routine) => (
              <div key={routine.id} style={styles.listItem}>
                <div>
                  <strong style={{ color: '#1e293b' }}>{routine.name}</strong>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
                    {routine.exercises} ejercicios configurados
                  </p>
                </div>
                <span style={{ color: '#0284c7', fontSize: '13px', fontWeight: '600' }}>Ver</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISTA 3: TRACKER DE EJERCICIOS */}
      {activeTab === 'tracker' && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Entrenamiento en Curso</h2>
          <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
            Registra tus marcas serie a serie:
          </p>
          <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
            <strong style={{ fontSize: '14px', color: '#0f172a' }}>Press de Banca</strong>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <input type="text" placeholder="Peso (kg)" style={{ width: '50%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Reps" style={{ width: '50%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
            </div>
          </div>
          <button style={styles.button}>Añadir Serie</button>
        </div>
      )}

      {/* Barra de Navegación Inferior */}
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
