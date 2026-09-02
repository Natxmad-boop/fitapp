import React, { useState } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'workout' | 'nutrition' | 'progress' | 'profile'>('home');

  return (
    <div className="app-container">
      <div className="content-area">
        {activeTab === 'home' && (
          <div>
            <h2>🏠 Inicio</h2>
            <p>Bienvenido a tu sistema inteligente. Aquí verás tu resumen diario en las siguientes fases.</p>
          </div>
        )}

        {activeTab === 'workout' && (
          <div>
            <h2>🏋️ Entrenar</h2>
            <p>Sección de rutinas personalizadas y "¿Qué hago hoy?".</p>
          </div>
        )}

        {activeTab === 'nutrition' && (
          <div>
            <h2>🍽️ Nutrición</h2>
            <p>Menús adaptados, recetas y lista de la compra automática.</p>
          </div>
        )}

        {activeTab === 'progress' && (
          <div>
            <h2>📈 Progreso</h2>
            <p>Seguimiento de peso, medidas, fuerza y fotografías de evolución.</p>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <h2>👤 Perfil</h2>
            <p>Gestión de perfiles independientes, objetivos y seguridad con PIN.</p>
          </div>
        )}
      </div>

      <nav className="nav-bar">
        <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <span className="icon">🏠</span>
          <span>Inicio</span>
        </button>

        <button className={`nav-item ${activeTab === 'workout' ? 'active' : ''}`} onClick={() => setActiveTab('workout')}>
          <span className="icon">🏋️</span>
          <span>Entrenar</span>
        </button>

        <button className={`nav-item ${activeTab === 'nutrition' ? 'active' : ''}`} onClick={() => setActiveTab('nutrition')}>
          <span className="icon">🍽️</span>
          <span>Nutrición</span>
        </button>

        <button className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`} onClick={() => setActiveTab('progress')}>
          <span className="icon">📈</span>
          <span>Progreso</span>
        </button>

        <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <span className="icon">👤</span>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  );
}
