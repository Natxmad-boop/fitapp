import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'training' | 'nutrition' | 'progress' | 'profile'>('home');

  // Estilos limpios, deportivos y mobile-first
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      maxWidth: '480px',
      margin: '0 auto',
      padding: '16px',
      paddingBottom: '90px',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      minHeight: '100vh',
      boxSizing: 'border-box' as const,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      borderBottom: '1px solid #1e293b',
      paddingBottom: '12px',
    },
    logo: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#38bdf8',
      margin: 0,
    },
    subTitle: {
      fontSize: '12px',
      color: '#94a3b8',
      margin: 0,
    },
    card: {
      backgroundColor: '#1e293b',
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      border: '1px solid #334155',
    },
    cardTitle: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#f8fafc',
      marginTop: 0,
      marginBottom: '8px',
    },
    text: {
      fontSize: '13px',
      color: '#94a3b8',
      margin: 0,
      lineHeight: '1.4',
    },
    nav: {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#1e293b',
      borderTop: '1px solid #334155',
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
      fontSize: '10px',
      fontWeight: active ? '700' : '500',
      color: active ? '#38bdf8' : '#94a3b8',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '4px',
    }),
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.logo}>FitSystem ⚡</h1>
          <p style={styles.subTitle}>Entrenamiento, Nutrición y Progreso</p>
        </div>
        <span style={{ fontSize: '12px', backgroundColor: '#334155', padding: '4px 8px', borderRadius: '6px', color: '#38bdf8' }}>Fase 1</span>
      </header>

      {/* VISTA 1: INICIO */}
      {activeTab === 'home' && (
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🏠 Panel de Inicio</h2>
            <p style={styles.text}>Bienvenido a tu ecosistema inteligente. Aquí visualizaras el resumen diario, tu entrenamiento programado y tus objetivos en las próximas fases.</p>
          </div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>¿Qué hago hoy?</h2>
            <p style={styles.text}>El sistema inteligente te indicará tu sesión óptima diaria en cuanto conectemos la lógica de entrenamiento.</p>
          </div>
        </div>
      )}

      {/* VISTA 2: ENTRENAR */}
      {activeTab === 'training' && (
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🏋️ Zona de Entrenamiento</h2>
            <p style={styles.text}>Preparado para la gestión de calentamientos, series, pesos, tiempos de descanso y alternativas de ejercicios.</p>
          </div>
        </div>
      )}

      {/* VISTA 3: NUTRICIÓN */}
      {activeTab === 'nutrition' && (
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🍽️ Nutrición y Menús</h2>
            <p style={styles.text}>Aquí se integrarán los menús personalizados, adaptaciones por tiempo o presupuesto y la lista de la compra automática.</p>
          </div>
        </div>
      )}

      {/* VISTA 4: PROGRESO */}
      {activeTab === 'progress' && (
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📈 Seguimiento de Progreso</h2>
            <p style={styles.text}>Espacio reservado para el control de peso corporal, medidas, evolución de fuerza y fotografías privadas.</p>
          </div>
        </div>
      )}

      {/* VISTA 5: PERFIL */}
      {activeTab === 'profile' && (
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>👤 Configuración del Perfil</h2>
            <p style={styles.text}>Gestión de perfiles independientes protegidos por PIN y preferencias de equipamiento y salud.</p>
          </div>
        </div>
      )}

      {/* Navegación Inferior de 5 apartados */}
      <nav style={styles.nav}>
        <button style={styles.navItem(activeTab === 'home')} onClick={() => setActiveTab('home')}>
          <span style={{ fontSize: '16px' }}>🏠</span> Inicio
        </button>
        <button style={styles.navItem(activeTab === 'training')} onClick={() => setActiveTab('training')}>
          <span style={{ fontSize: '16px' }}>🏋️</span> Entrenar
        </button>
        <button style={styles.navItem(activeTab === 'nutrition')} onClick={() => setActiveTab('nutrition')}>
          <span style={{ fontSize: '16px' }}>🍽️</span> Nutrición
        </button>
        <button style={styles.navItem(activeTab === 'progress')} onClick={() => setActiveTab('progress')}>
          <span style={{ fontSize: '16px' }}>📈</span> Progreso
        </button>
        <button style={styles.navItem(activeTab === 'profile')} onClick={() => setActiveTab('profile')}>
          <span style={{ fontSize: '16px' }}>👤</span> Perfil
        </button>
      </nav>
    </div>
  );
}
