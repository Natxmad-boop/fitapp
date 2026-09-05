import React from 'react';
import { useFitAppSupabase } from './hooks/useFitAppSupabase';

export default function App() {
  const { profile, loading, error, updateProfile } = useFitAppSupabase();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <p>Cargando perfil de FitApp desde Supabase...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', fontFamily: 'sans-serif' }}>
        <h2>Error de conexión</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>FitApp Cloud</h1>
      <p>¡Tu aplicación ya está conectada a PostgreSQL y Supabase!</p>

      {profile ? (
        <div style={{ background: '#f4f4f5', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <h3>Perfil del Atleta</h3>
          <p><strong>Nombre:</strong> {profile.name}</p>
          <p><strong>Edad:</strong> {profile.age} años</p>
          <p><strong>Nivel:</strong> {profile.experience_level}</p>
          <p><strong>Ubicación de entrenamiento:</strong> {profile.workout_location}</p>
          <p><strong>Días por semana:</strong> {profile.training_days_per_week}</p>

          <button
            onClick={() => updateProfile({ name: profile.name + ' (Pro)' })}
            style={{
              marginTop: '15px',
              padding: '10px 15px',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Actualizar Perfil de Prueba
          </button>
        </div>
      ) : (
        <p>No se ha encontrado ninguna sesión activa. Inicia sesión para ver tus datos.</p>
      )}
    </div>
  );
}
