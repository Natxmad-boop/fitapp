import React, { useState } from 'react';

interface Profile {
  id: string;
  name: string;
  pin: string;
  goal: string;
}

export default function App() {
  // Estado de perfiles y sesión
  const [profiles, setProfiles] = useState<Profile[]>([
    { id: '1', name: 'Usuario Principal', pin: '1234', goal: 'Ganar músculo' },
  ]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [enteringPin, setEnteringPin] = useState<string>('');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  
  // Modal para crear nuevo perfil
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfilePin, setNewProfilePin] = useState('');
  const [newProfileGoal, setNewProfileGoal] = useState('Perder grasa');

  // Navegación principal (Fase 1)
  const [activeTab, setActiveTab] = useState<'home' | 'training' | 'nutrition' | 'progress' | 'profile'>('home');

  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      maxWidth: '480px',
      margin: '0 auto',
      padding: '16px',
      paddingBottom: activeProfile ? '90px' : '16px',
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
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: '1px solid #475569',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      fontSize: '14px',
      marginBottom: '10px',
      boxSizing: 'border-box' as const,
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
      backgroundColor: '#334155',
      color: '#f8fafc',
      border: 'none',
      padding: '8px 12px',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '12px',
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

  // Manejo de inicio de sesión por PIN
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const profile = profiles.find((p) => p.id === selectedProfileId);
    if (profile && profile.pin === enteringPin) {
      setActiveProfile(profile);
      setEnteringPin('');
    } else {
      alert('PIN incorrecto o perfil no seleccionado.');
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim() || newProfilePin.length !== 4) {
      alert('Introduce un nombre y un PIN válido de 4 dígitos.');
      return;
    }
    const newProf: Profile = {
      id: Date.now().toString(),
      name: newProfileName,
      pin: newProfilePin,
      goal: newProfileGoal,
    };
    setProfiles([...profiles, newProf]);
    setNewProfileName('');
    setNewProfilePin('');
    setIsCreatingProfile(false);
  };

  // SI NO HAY PERFIL ACTIVO: PANTALLA DE SELECCIÓN Y PIN (FASE 2)
  if (!activeProfile) {
    return (
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.logo}>FitSystem ⚡</h1>
            <p style={styles.subTitle}>Seguridad y Perfiles Independientes</p>
          </div>
          <span style={{ fontSize: '12px', backgroundColor: '#334155', padding: '4px 8px', borderRadius: '6px', color: '#38bdf8' }}>Fase 2</span>
        </header>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🔒 Selecciona tu Perfil</h2>
          {!isCreatingProfile ? (
            <div>
              <form onSubmit={handleLogin}>
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  style={styles.input}
                >
                  <option value="">-- Elige un perfil --</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.goal})
                    </option>
                  ))}
                </select>

                <input
                  type="password"
                  maxLength={4}
                  placeholder="PIN de 4 dígitos"
                  value={enteringPin}
                  onChange={(e) => setEnteringPin(e.target.value)}
                  style={styles.input}
                />

                <button type="submit" style={styles.button}>Acceder al Perfil</button>
              </form>

              <button
                style={{ ...styles.secondaryButton, width: '100%', marginTop: '10px', padding: '10px' }}
                onClick={() => setIsCreatingProfile(true)}
              >
                + Crear Nuevo Perfil
              </button>
            </div>
          ) : (
            <div>
              <h3 style={{ fontSize: '14px', color: '#38bdf8', marginBottom: '10px' }}>Nuevo Perfil</h3>
              <form onSubmit={handleCreateProfile}>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="password"
                  maxLength={4}
                  placeholder="PIN de 4 dígitos"
                  value={newProfilePin}
                  onChange={(e) => setNewProfilePin(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Objetivo principal"
                  value={newProfileGoal}
                  onChange={(e) => setNewProfileGoal(e.target.value)}
                  style={styles.input}
                />
                <button type="submit" style={styles.button}>Guardar Perfil</button>
                <button
                  type="button"
                  style={{ ...styles.secondaryButton, width: '100%' }}
                  onClick={() => setIsCreatingProfile(false)}
                >
                  Cancelar
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    );
  }

  // SI HAY PERFIL ACTIVO: MUESTRA LA APLICACIÓN Y LA NAVEGACIÓN (FASE 1 & 2)
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.logo}>FitSystem ⚡</h1>
          <p style={styles.subTitle}>Activo: <strong>{activeProfile.name}</strong></p>
        </div>
        <button style={styles.secondaryButton} onClick={() => setActiveProfile(null)}>
          🔒 Bloquear / Salir
        </button>
      </header>

      {/* VISTA 1: INICIO */}
      {activeTab === 'home' && (
        <div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>🏠 Panel de Inicio ({activeProfile.name})</h2>
            <p style={styles.text}>Objetivo actual: <strong>{activeProfile.goal}</strong></p>
          </div>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>¿Qué hago hoy?</h2>
            <p style={styles.text}>Aislamiento de perfil verificado mediante autenticación local por PIN, preparado para conectar con la seguridad RLS de Supabase.</p>
          </div>
        </div>
      )}

      {/* VISTA 2: ENTRENAR */}
      {activeTab === 'training' && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🏋️ Zona de Entrenamiento</h2>
          <p style={styles.text}>Rutinas y registros exclusivos del perfil de {activeProfile.name}.</p>
        </div>
      )}

      {/* VISTA 3: NUTRICIÓN */}
      {activeTab === 'nutrition' && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>🍽️ Nutrición y Menús</h2>
          <p style={styles.text}>Alimentación y restricciones configuradas para {activeProfile.name}.</p>
        </div>
      )}

      {/* VISTA 4: PROGRESO */}
      {activeTab === 'progress' && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>📈 Seguimiento de Progreso</h2>
          <p style={styles.text}>Pesos, medidas y datos privados del perfil.</p>
        </div>
      )}

      {/* VISTA 5: PERFIL */}
      {activeTab === 'profile' && (
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>👤 Configuración del Perfil</h2>
          <p style={styles.text}>Nombre: {activeProfile.name}</p>
          <p style={styles.text}>PIN protegido de 4 dígitos configurado correctamente.</p>
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
