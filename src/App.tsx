import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

interface Exercise {
  id: string;
  name: string;
  category: 'Fuerza' | 'Core' | 'Cardio' | 'Movilidad';
  targetMuscle: string;
  equipmentNeeded: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  instructions: string;
  commonMistakes: string;
  alternative: string;
  contraindications?: string[];
}

interface Meal {
  id: string;
  title: string;
  type: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  calories: number;
  protein: number;
  ingredients: string[];
  isAllowed: boolean;
}

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  secondary_goal?: string;
  body_priorities?: string[];
  level?: string;
  days_per_week?: number;
  session_duration?: number;
  pin_hash: string | null;
  healthRestrictions: string[];
  medications: string[];
  diseasesOrConditions: string[];
  equipment: string[];
  injuries: string[];
  dislikedIngredients: string[];
  streakDays: number;
  points: number;
  created_at: string;
}

const EXERCISE_LIBRARY: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Sentadillas con Mancuernas',
    category: 'Fuerza',
    targetMuscle: 'Piernas y Glúteos',
    equipmentNeeded: 'Mancuernas',
    difficulty: 'Principiante',
    instructions: 'Mantén los pies al ancho de los hombros. Baja la cadera controlando el descenso y empuja con fuerza desde los talones para subir.',
    commonMistakes: 'Dejar que las rodillas colapsen hacia adentro.',
    alternative: 'Sentadillas libres sin peso',
    contraindications: ['Rodilla', 'Espalda baja']
  },
  {
    id: 'ex-2',
    name: 'Sentadillas Libres (Sin Peso)',
    category: 'Fuerza',
    targetMuscle: 'Piernas y Glúteos',
    equipmentNeeded: 'Ninguno',
    difficulty: 'Principiante',
    instructions: 'Realiza el movimiento de sentadilla controlando la bajada utilizando únicamente el peso corporal.',
    commonMistakes: 'Inclinarse demasiado hacia adelante.',
    alternative: 'Sentadillas sumo',
    contraindications: ['Rodilla']
  },
  {
    id: 'ex-3',
    name: 'Press de Banca con Mancuernas',
    category: 'Fuerza',
    targetMuscle: 'Pecho y Tríceps',
    equipmentNeeded: 'Mancuernas',
    difficulty: 'Intermedio',
    instructions: 'Acuéstate boca arriba y empuja las mancuernas hacia arriba contrayendo el pecho.',
    commonMistakes: 'Arquear excesivamente la espalda baja.',
    alternative: 'Flexiones de pecho',
    contraindications: ['Hombro']
  },
  {
    id: 'ex-4',
    name: 'Plancha Abdominal',
    category: 'Core',
    targetMuscle: 'Abdomen y Core',
    equipmentNeeded: 'Esterilla',
    difficulty: 'Principiante',
    instructions: 'Mantén el cuerpo en línea recta apoyado sobre antebrazos y puntas de los pies.',
    commonMistakes: 'Dejar caer la cadera hacia el suelo.',
    alternative: 'Plancha sobre rodillas',
    contraindications: ['Espalda baja']
  },
  {
    id: 'ex-5',
    name: 'Remo con Mancuerna',
    category: 'Fuerza',
    targetMuscle: 'Espalda',
    equipmentNeeded: 'Mancuernas',
    difficulty: 'Principiante',
    instructions: 'Inclina el tronco apoyando una mano y lleva la mancuerna hacia la cadera.',
    commonMistakes: 'Girar el torso al elevar el peso.',
    alternative: 'Remo con banda elástica',
    contraindications: ['Espalda baja']
  }
];

const MEAL_LIBRARY: Meal[] = [
  {
    id: 'meal-1',
    title: 'Tostada integral con aguacate y huevo revuelto',
    type: 'Desayuno',
    calories: 380,
    protein: 18,
    ingredients: ['Pan integral', 'Aguacate', 'Huevo', 'Aceite de oliva'],
    isAllowed: true
  },
  {
    id: 'meal-2',
    title: 'Pechuga de pollo a la plancha con arroz y brócoli',
    type: 'Almuerzo',
    calories: 520,
    protein: 42,
    ingredients: ['Pechuga de pollo', 'Arroz blanco', 'Brócoli', 'Aceite de oliva'],
    isAllowed: true
  },
  {
    id: 'meal-3',
    title: 'Batido de proteína con leche de vaca y plátano',
    type: 'Snack',
    calories: 310,
    protein: 25,
    ingredients: ['Proteína Whey', 'Leche de vaca', 'Plátano'],
    isAllowed: false
  },
  {
    id: 'meal-4',
    title: 'Salmón al horno con espárragos trigueros',
    type: 'Cena',
    calories: 450,
    protein: 35,
    ingredients: ['Salmón', 'Espárragos', 'Limón', 'Especias'],
    isAllowed: true
  }
];

// Función auxiliar simple para hash seguro del PIN en cliente (Evita texto plano)
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + 'fitapp_salt_secure_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'inicio' | 'entrenar' | 'nutricion' | 'progreso' | 'perfil'>('inicio');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState<boolean>(false);

  const [profilePinTarget, setProfilePinTarget] = useState<UserProfile | null>(null);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [pinAttempts, setPinAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number>(0);

  const [selectedWorkoutFilter, setSelectedWorkoutFilter] = useState<string>('Todos');
  const [selectedMealFilter, setSelectedMealFilter] = useState<string>('Todos');
  const [newWeightInput, setNewWeightInput] = useState<string>('');
  const [newDislikedInput, setNewDislikedInput] = useState<string>('');
  const [activeDemoExerciseId, setActiveDemoExerciseId] = useState<string | null>(null);

  const [newEquipmentInput, setNewEquipmentInput] = useState<string>('');
  const [newMedicationInput, setNewMedicationInput] = useState<string>('');
  const [newDiseaseInput, setNewDiseaseInput] = useState<string>('');

  const [newProfileData, setNewProfileData] = useState({
    name: '',
    age: 25,
    gender: 'Masculino',
    height: 175,
    weight: 70,
    goal: 'Perder grasa',
    pin: '0000'
  });

  // Comprobación de sesión al abrir y escucha de cambios de Auth
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cargar perfiles desde Supabase cuando hay sesión activa
  useEffect(() => {
    if (session?.user) {
      fetchProfiles();
    } else {
      setProfiles([]);
      setActiveProfileId(null);
    }
  }, [session]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      const mappedProfiles: UserProfile[] = (data || []).map(p => ({
        id: p.id,
        user_id: p.user_id,
        name: p.name,
        age: p.age,
        gender: p.gender,
        height: p.height,
        weight: p.weight,
        goal: p.goal,
        secondary_goal: p.secondary_goal,
        body_priorities: p.body_priorities,
        level: p.level,
        days_per_week: p.days_per_week,
        session_duration: p.session_duration,
        pin_hash: p.pin_hash,
        healthRestrictions: p.allergies || [],
        medications: p.medication || [],
        diseasesOrConditions: p.restrictions || [],
        equipment: p.equipment || ['Mancuernas', 'Ninguno'],
        injuries: [],
        dislikedIngredients: p.disliked_foods || [],
        streakDays: p.streak_days || 1,
        points: p.points || 50,
        created_at: p.created_at
      }));

      setProfiles(mappedProfiles);
      if (mappedProfiles.length > 0 && !activeProfileId) {
        // No auto-activamos si requiere PIN, pero si no tiene PIN configurado o es el único, se puede gestionar
      }
    } catch (err: any) {
      console.error('Error cargando perfiles:', err.message);
    }
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  const t = isDarkMode ? {
    bg: '#0f172a',
    cardBg: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#334155',
    primary: '#38bdf8',
    navBg: '#1e293b',
    navText: '#94a3b8',
    navActive: '#38bdf8',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444'
  } : {
    bg: '#f8fafc',
    cardBg: '#ffffff',
    text: '#111111',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    primary: '#0284c7',
    navBg: '#ffffff',
    navText: '#64748b',
    navActive: '#0284c7',
    success: '#16a34a',
    warning: '#d97706',
    danger: '#dc2626'
  };

  if (authLoading) {
    return (
      <div style={{ fontFamily: '-apple-system, sans-serif', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', color: '#111' }}>
        <p>Cargando FitApp Pro...</p>
      </div>
    );
  }

  // Pantalla de Autenticación Supabase (Login / Registro / Recuperación)
  if (!session) {
    return (
      <div style={{ fontFamily: '-apple-system, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '24px', color: '#111', backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '6px', color: '#0284c7' }}>FitApp Pro 🏆</h1>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
            {authMode === 'login' && 'Inicia sesión en tu cuenta segura'}
            {authMode === 'register' && 'Crea tu cuenta en Supabase Auth'}
            {authMode === 'forgot' && 'Recupera acceso a tu cuenta'}
          </p>

          {authError && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>{authError}</div>}
          {authSuccessMsg && <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>{authSuccessMsg}</div>}

          <form onSubmit={async (e) => {
            e.preventDefault();
            setAuthError(null);
            setAuthSuccessMsg(null);
            if (authMode === 'login') {
              const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
              if (error) setAuthError(error.message);
            } else if (authMode === 'register') {
              const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
              if (error) setAuthError(error.message);
              else setAuthSuccessMsg('¡Registro exitoso! Comprueba tu correo o inicia sesión.');
            } else if (authMode === 'forgot') {
              const { error } = await supabase.auth.resetPasswordForEmail(authEmail);
              if (error) setAuthError(error.message);
              else setAuthSuccessMsg('Se ha enviado un enlace de recuperación a tu correo.');
            }
          }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500' }}>Correo electrónico:
              <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
            </label>

            {authMode !== 'forgot' && (
              <label style={{ fontSize: '13px', fontWeight: '500' }}>Contraseña:
                <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
              </label>
            )}

            <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '6px' }}>
              {authMode === 'login' && 'Iniciar Sesión'}
              {authMode === 'register' && 'Registrarse'}
              {authMode === 'forgot' && 'Enviar enlace'}
            </button>
          </form>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '16px', color: '#0284c7' }}>
            {authMode === 'login' && (
              <>
                <span style={{ cursor: 'pointer' }} onClick={() => { setAuthMode('register'); setAuthError(null); setAuthSuccessMsg(null); }}>¿No tienes cuenta? Regístrate</span>
                <span style={{ cursor: 'pointer' }} onClick={() => { setAuthMode('forgot'); setAuthError(null); setAuthSuccessMsg(null); }}>¿Olvidaste tu contraseña?</span>
              </>
            )}
            {authMode !== 'login' && (
              <span style={{ cursor: 'pointer', width: '100%', textAlign: 'center' }} onClick={() => { setAuthMode('login'); setAuthError(null); setAuthSuccessMsg(null); }}>← Volver al inicio de sesión</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de selección de perfil o bloqueo por PIN si no hay perfil activo
  if (!activeProfileId) {
    const isLockedOut = Date.now() < lockoutUntil;

    return (
      <div style={{ fontFamily: '-apple-system, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '20px', color: t.text, backgroundColor: t.bg, minHeight: '100vh', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '20px', margin: 0 }}>FitApp Pro 🏆</h1>
            <p style={{ fontSize: '11px', color: t.textSecondary }}>Usuario: {session.user.email}</p>
          </div>
          <button onClick={() => supabase.auth.signOut()} style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px', color: t.danger }}>
            Cerrar Sesión
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '13px', color: t.textSecondary, marginBottom: '24px' }}>Selecciona tu perfil seguro</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {profiles.length === 0 ? (
            <p style={{ textAlign: 'center', color: t.textSecondary, fontSize: '13px' }}>No tienes ningún perfil creado todavía.</p>
          ) : (
            profiles.map(p => (
              <div key={p.id} style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{p.name}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: t.textSecondary }}>Objetivo: {p.goal} | 🔒 Protegido con PIN seguro</p>
                </div>
                <button 
                  onClick={() => {
                    if (isLockedOut) return;
                    setProfilePinTarget(p);
                    setEnteredPin('');
                    setPinError(false);
                  }}
                  style={{ backgroundColor: isLockedOut ? t.border : t.primary, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', cursor: isLockedOut ? 'not-allowed' : 'pointer', fontWeight: '600' }}
                >
                  Entrar ➔
                </button>
              </div>
            ))
          )}

          <button 
            onClick={() => setIsCreatingProfile(true)}
            style={{ backgroundColor: 'transparent', border: `2px dashed ${t.primary}`, color: t.primary, padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' }}
          >
            + Crear Nuevo Perfil Independiente
          </button>
        </div>

        {/* Modal de PIN seguro */}
        {profilePinTarget && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
            <div style={{ backgroundColor: t.cardBg, borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '320px', border: `1px solid ${t.border}`, textAlign: 'center' }}>
              <h2 style={{ fontSize: '18px', marginTop: 0 }}>PIN de Acceso para {profilePinTarget.name}</h2>
              {isLockedOut ? (
                <p style={{ color: t.danger, fontSize: '12px' }}>Demasiados intentos fallidos. Bloqueo temporal activo.</p>
              ) : (
                <>
                  <p style={{ fontSize: '12px', color: t.textSecondary, marginBottom: '16px' }}>Introduce tu PIN numérico de seguridad.</p>
                  <input 
                    type="password" 
                    maxLength={4}
                    value={enteredPin} 
                    onChange={e => setEnteredPin(e.target.value)}
                    placeholder="****"
                    style={{ width: '120px', textAlign: 'center', fontSize: '20px', letterSpacing: '8px', padding: '8px', borderRadius: '8px', border: `1px solid ${pinError ? t.danger : t.border}`, backgroundColor: t.bg, color: t.text, marginBottom: '12px' }} 
                  />
                  {pinError && <p style={{ color: t.danger, fontSize: '11px', margin: '0 0 10px 0' }}>PIN incorrecto. Intentos restantes: {3 - (pinAttempts + 1)}</p>}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setProfilePinTarget(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}`, background: 'transparent', color: t.text, cursor: 'pointer' }}>Cancelar</button>
                    <button onClick={async () => {
                      const hashedInput = await hashPin(enteredPin);
                      if (!profilePinTarget.pin_hash || profilePinTarget.pin_hash === hashedInput) {
                        setActiveProfileId(profilePinTarget.id);
                        setProfilePinTarget(null);
                        setPinAttempts(0);
                      } else {
                        const newAttempts = pinAttempts + 1;
                        setPinAttempts(newAttempts);
                        setPinError(true);
                        if (newAttempts >= 3) {
                          setLockoutUntil(Date.now() + 30000); // Bloqueo de 30 segundos
                        }
                      }
                    }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: t.primary, color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Acceder</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Modal de Creación de Perfil */}
        {isCreatingProfile && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
            <div style={{ backgroundColor: t.cardBg, borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '400px', border: `1px solid ${t.border}` }}>
              <h2 style={{ fontSize: '18px', marginTop: 0 }}>Nuevo Perfil</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <label>Nombre:
                  <input type="text" value={newProfileData.name} onChange={e => setNewProfileData({...newProfileData, name: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <label style={{ flex: 1 }}>Edad:
                    <input type="number" value={newProfileData.age} onChange={e => setNewProfileData({...newProfileData, age: Number(e.target.value)})} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
                  </label>
                  <label style={{ flex: 1 }}>Peso (kg):
                    <input type="number" value={newProfileData.weight} onChange={e => setNewProfileData({...newProfileData, weight: Number(e.target.value)})} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
                  </label>
                </div>
                <label>Objetivo Principal:
                  <select value={newProfileData.goal} onChange={e => setNewProfileData({...newProfileData, goal: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}>
                    <option>Perder grasa</option>
                    <option>Ganar músculo</option>
                    <option>Recomposición corporal</option>
                    <option>Mejorar fuerza</option>
                  </select>
                </label>
                <label>PIN de Seguridad (4 dígitos):
                  <input type="password" maxLength={4} value={newProfileData.pin} onChange={e => setNewProfileData({...newProfileData, pin: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
                </label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => setIsCreatingProfile(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}`, background: 'transparent', color: t.text, cursor: 'pointer' }}>Cancelar</button>
                  <button onClick={async () => {
                    if (!newProfileData.name || !newProfileData.pin) return;
                    const pinHashed = await hashPin(newProfileData.pin);
                    const { data, error } = await supabase.from('profiles').insert([{
                      user_id: session.user.id,
                      name: newProfileData.name,
                      age: newProfileData.age,
                      gender: newProfileData.gender,
                      height: newProfileData.height,
                      weight: newProfileData.weight,
                      goal: newProfileData.goal,
                      pin_hash: pinHashed,
                      equipment: ['Mancuernas', 'Ninguno'],
                      streak_days: 1,
                      points: 50
                    }]).select();

                    if (error) {
                      alert('Error al crear perfil: ' + error.message);
                    } else if (data) {
                      await fetchProfiles();
                      setIsCreatingProfile(false);
                    }
                  }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: t.primary, color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Guardar Perfil</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Filtrado de ejercicios y menús
  const filteredExercises = EXERCISE_LIBRARY.filter(ex => {
    if (selectedWorkoutFilter !== 'Todos' && ex.category !== selectedWorkoutFilter) return false;
    const hasEquipment = activeProfile?.equipment.some(eq => 
      ex.equipmentNeeded.toLowerCase() === 'ninguno' || eq.toLowerCase().includes(ex.equipmentNeeded.toLowerCase())
    );
    if (!hasEquipment) return false;
    const hasInjuryConflict = activeProfile?.injuries.some(injury => ex.contraindications?.includes(injury));
    if (hasInjuryConflict) return false;
    return true;
  });

  const smartFilteredMeals = MEAL_LIBRARY.filter(meal => {
    const hasAllergyConflict = !meal.isAllowed && activeProfile?.healthRestrictions.some(r => r.toLowerCase().includes('lactosa'));
    if (hasAllergyConflict) return false;
    const hasDislikedIngredient = meal.ingredients.some(ing => 
      activeProfile?.dislikedIngredients.some(disliked => ing.toLowerCase().includes(disliked.toLowerCase()))
    );
    if (hasDislikedIngredient) return false;
    return true;
  });

  const shoppingList = Array.from(new Set(smartFilteredMeals.flatMap(m => m.ingredients)));
  const currentDemoExercise = EXERCISE_LIBRARY.find(ex => ex.id === activeDemoExerciseId);

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '480px',
      margin: '0 auto',
      padding: '16px',
      paddingBottom: '90px',
      color: t.text,
      backgroundColor: t.bg,
      minHeight: '100vh',
      boxSizing: 'border-box'
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>FitApp Pro 🏆</h1>
            <span style={{ fontSize: '11px', backgroundColor: t.primary, color: '#fff', padding: '2px 6px', borderRadius: '10px' }}>{activeProfile?.name}</span>
          </div>
          <p style={{ fontSize: '11px', color: t.textSecondary, margin: '2px 0 0 0' }}>🔥 Racha: <strong style={{ color: t.warning }}>{activeProfile?.streakDays} días</strong> | 🌟 {activeProfile?.points} pts</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={() => setActiveProfileId(null)} 
            style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', fontSize: '12px', color: t.textSecondary }}
            title="Cambiar Perfil"
          >
            👥
          </button>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', fontSize: '14px' }}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* 1. SECCIÓN INICIO */}
      {activeTab === 'inicio' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '15px', fontWeight: '600', marginTop: 0, display: 'flex', justifyContent: 'space-between' }}>
              <span>🎯 Panel Personalizado Supabase</span>
              <span style={{ fontSize: '11px', color: t.primary }}>Seguro y Persistente</span>
            </h2>
            <p style={{ fontSize: '13px', color: t.textSecondary, lineHeight: '1.4', marginBottom: '12px' }}>
              Objetivo: <strong>{activeProfile?.goal}</strong>. Tus datos están sincronizados en tiempo real mediante RLS.
            </p>
            <button 
              onClick={() => setActiveTab('entrenar')}
              style={{ width: '100%', backgroundColor: t.primary, color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              Comenzar Entrenamiento 🚀
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, backgroundColor: t.cardBg, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, textAlign: 'center' }}>
              <span style={{ fontSize: '20px' }}>🔥</span>
              <h3 style={{ fontSize: '14px', margin: '6px 0 2px 0' }}>{activeProfile?.streakDays} Días</h3>
              <p style={{ fontSize: '11px', color: t.textSecondary, margin: 0 }}>Racha Activa</p>
            </div>
            <div style={{ flex: 1, backgroundColor: t.cardBg, borderRadius: '12px', padding: '14px', border: `1px solid ${t.border}`, textAlign: 'center' }}>
              <span style={{ fontSize: '20px' }}>⭐</span>
              <h3 style={{ fontSize: '14px', margin: '6px 0 2px 0' }}>{activeProfile?.points} Pts</h3>
              <p style={{ fontSize: '11px', color: t.textSecondary, margin: 0 }}>Disciplina</p>
            </div>
          </div>
        </div>
      )}

      {/* 2. SECCIÓN ENTRENAR */}
      {activeTab === 'entrenar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>🏋️ Ejercicios Adaptados a tu Perfil</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {['Todos', 'Fuerza', 'Core'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedWorkoutFilter(cat)}
                  style={{ padding: '6px 12px', borderRadius: '6px', border: `1px solid ${t.border}`, background: selectedWorkoutFilter === cat ? t.primary : t.cardBg, color: selectedWorkoutFilter === cat ? '#fff' : t.text, fontSize: '12px', cursor: 'pointer' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredExercises.length === 0 ? (
                <p style={{ fontSize: '13px', color: t.danger, textAlign: 'center', margin: '20px 0' }}>
                  No hay ejercicios disponibles para tu selección o tus condiciones médicas actuales. Revisa tu <strong>Perfil</strong>.
                </p>
              ) : (
                filteredExercises.map(ex => (
                  <div key={ex.id} style={{ padding: '12px', backgroundColor: t.bg, borderRadius: '8px', border: `1px solid ${t.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '14px' }}>{ex.name}</strong>
                      <span style={{ fontSize: '11px', backgroundColor: t.border, padding: '2px 6px', borderRadius: '4px' }}>Req: {ex.equipmentNeeded}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: t.textSecondary, margin: '0 0 8px 0' }}>💡 {ex.instructions.substring(0, 80)}...</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <button 
                        onClick={() => setActiveDemoExerciseId(ex.id)}
                        style={{ background: 'transparent', border: `1px solid ${t.primary}`, color: t.primary, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
                      >
                        📺 Ver Demostración y Técnica
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
                      <input type="text" placeholder="Peso (kg)" style={{ width: '70px', padding: '6px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text }} />
                      <input type="text" placeholder="Reps" style={{ width: '50px', padding: '6px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text }} />
                      <select style={{ flex: 1, padding: '6px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.cardBg, color: t.text }}>
                        <option>Normal (RPE 7-8)</option>
                        <option>Fácil 🟢</option>
                        <option>Difícil 🔴</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Demostración */}
      {currentDemoExercise && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '400px', border: `1px solid ${t.border}`, maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '16px', margin: 0 }}>🎬 {currentDemoExercise.name}</h2>
              <button onClick={() => setActiveDemoExerciseId(null)} style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', color: t.text }}>✕</button>
            </div>
            
            <div style={{ backgroundColor: t.bg, borderRadius: '8px', padding: '12px', textAlign: 'center', marginBottom: '14px', border: `1px solid ${t.border}` }}>
              <span style={{ fontSize: '32px' }}>🎯</span>
              <p style={{ fontSize: '12px', color: t.textSecondary, margin: '4px 0 0 0' }}>Demostración Visual / Material: <strong>{currentDemoExercise.equipmentNeeded}</strong></p>
            </div>

            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '10px', color: t.text }}>
              <div>
                <strong style={{ color: t.primary }}>📝 Instrucciones de Ejecución:</strong>
                <p style={{ margin: '4px 0 0 0', color: t.textSecondary, lineHeight: '1.4' }}>{currentDemoExercise.instructions}</p>
              </div>
              <div>
                <strong style={{ color: t.danger }}>⚠️ Error Común a Evitar:</strong>
                <p style={{ margin: '4px 0 0 0', color: t.textSecondary, lineHeight: '1.4' }}>{currentDemoExercise.commonMistakes}</p>
              </div>
              <div>
                <strong style={{ color: t.success }}>🔄 Alternativa Sugerida:</strong>
                <p style={{ margin: '4px 0 0 0', color: t.textSecondary, lineHeight: '1.4' }}>{currentDemoExercise.alternative}</p>
              </div>
            </div>

            <button 
              onClick={() => setActiveDemoExerciseId(null)}
              style={{ width: '100%', marginTop: '16px', backgroundColor: t.primary, color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* 3. SECCIÓN NUTRICIÓN */}
      {activeTab === 'nutricion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>🍽️ Menús Inteligentes y Gustos</h2>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
              {['Todos', 'Desayuno', 'Almuerzo', 'Snack', 'Cena'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedMealFilter(cat)}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: `1px solid ${t.border}`, background: selectedMealFilter === cat ? t.primary : t.cardBg, color: selectedMealFilter === cat ? '#fff' : t.text, fontSize: '11px', cursor: 'pointer' }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {smartFilteredMeals
                .filter(meal => selectedMealFilter === 'Todos' || meal.type === selectedMealFilter)
                .map(meal => (
                  <div key={meal.id} style={{ padding: '12px', backgroundColor: t.bg, borderRadius: '8px', border: `1px solid ${t.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '13px' }}>{meal.title}</strong>
                      <span style={{ fontSize: '10px', backgroundColor: t.border, padding: '2px 6px', borderRadius: '4px' }}>{meal.type}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: t.textSecondary, margin: '0 0 6px 0' }}>Ingredientes: {meal.ingredients.join(', ')}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', marginTop: '6px' }}>
                      <span>🔥 {meal.calories} kcal | 🥩 {meal.protein}g proteína</span>
                      <span style={{ color: t.success, fontWeight: '600' }}>✅ Apto</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h3 style={{ fontSize: '15px', fontWeight: '600', marginTop: 0 }}>🛒 Lista de la Compra Automática</h3>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', color: t.text }}>
              {shoppingList.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 4. SECCIÓN PROGRESO */}
      {activeTab === 'progreso' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>📈 Progreso y Métricas</h2>
            <p style={{ fontSize: '13px', color: t.textSecondary, marginBottom: '16px' }}>
              Peso actual registrado: <strong style={{ color: t.text }}>{activeProfile?.weight} kg</strong>
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="number" 
                placeholder="Nuevo peso (kg)" 
                value={newWeightInput} 
                onChange={e => setNewWeightInput(e.target.value)}
                style={{ flex: 1, padding: '8px', fontSize: '13px', borderRadius: '8px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} 
              />
              <button 
                onClick={async () => {
                  if(!newWeightInput || !activeProfile) return;
                  const val = Number(newWeightInput);
                  const newPoints = activeProfile.points + 10;
                  
                  const { error } = await supabase
                    .from('profiles')
                    .update({ weight: val, points: newPoints })
                    .eq('id', activeProfile.id);

                  if (!error) {
                    setProfiles(profiles.map(p => p.id === activeProfile.id ? { ...p, weight: val, points: newPoints } : p));
                    setNewWeightInput('');
                  } else {
                    alert('Error al actualizar peso: ' + error.message);
                  }
                }}
                style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SECCIÓN PERFIL */}
      {activeTab === 'perfil' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>👤 Configuración y Salud</h2>
              <button 
                onClick={() => supabase.auth.signOut()} 
                style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '11px', color: t.danger }}
              >
                Cerrar Sesión General
              </button>
            </div>
            
            <div style={{ backgroundColor: isDarkMode ? '#1e1b4b' : '#eff6ff', border: `1px solid ${isDarkMode ? '#3730a3' : '#bfdbfe'}`, padding: '10px', borderRadius: '8px', marginBottom: '14px' }}>
              <p style={{ fontSize: '11px', color: isDarkMode ? '#93c5fd' : '#1e40af', margin: 0, lineHeight: '1.4' }}>
                ⚠️ <strong>Aviso Médico:</strong> Cualquier recomendación de ejercicio o nutrición debe ser consultada con un especialista médico o nutricionista antes de llevarla a la práctica.
              </p>
            </div>

            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', color: t.textSecondary, marginBottom: '16px' }}>
              <p style={{ margin: 0 }}><strong>Nombre:</strong> {activeProfile?.name}</p>
              <p style={{ margin: 0 }}><strong>Objetivo:</strong> {activeProfile?.goal}</p>
              <p style={{ margin: 0 }}><strong>Materiales Disponibles:</strong> <span style={{ color: t.primary, fontWeight: '600' }}>{activeProfile?.equipment.join(', ') || 'Ninguno'}</span></p>
              <p style={{ margin: 0 }}><strong>Condiciones Médicas:</strong> <span style={{ color: t.warning }}>{activeProfile?.diseasesOrConditions.join(', ') || 'Ninguna'}</span></p>
              <p style={{ margin: 0 }}><strong>Medicación Actual:</strong> <span style={{ color: t.warning }}>{activeProfile?.medications.join(', ') || 'Ninguna'}</span></p>
              <p style={{ margin: 0 }}><strong>Alimentos que NO te gustan:</strong> <span style={{ color: t.danger }}>{activeProfile?.dislikedIngredients.join(', ') || 'Ninguno'}</span></p>
            </div>

            {/* Añadir Condición Médica */}
            <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '12px', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '13px', margin: '0 0 6px 0', color: t.text }}>Registrar Condición Médica:</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Ej. Hipertensión, Asma..." 
                  value={newDiseaseInput}
                  onChange={e => setNewDiseaseInput(e.target.value)}
                  style={{ flex: 1, padding: '6px 8px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}
                />
                <button 
                  onClick={async () => {
                    if (!newDiseaseInput || !activeProfile) return;
                    const updatedRestrictions = [...activeProfile.diseasesOrConditions, newDiseaseInput.trim()];
                    const { error } = await supabase.from('profiles').update({ restrictions: updatedRestrictions }).eq('id', activeProfile.id);
                    if (!error) {
                      setProfiles(profiles.map(p => p.id === activeProfile.id ? { ...p, diseasesOrConditions: updatedRestrictions } : p));
                      setNewDiseaseInput('');
                    }
                  }}
                  style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Añadir
                </button>
              </div>
            </div>

            {/* Añadir Medicación */}
            <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '12px', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '13px', margin: '0 0 6px 0', color: t.text }}>Registrar Medicación Actual:</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Ej. Anticoagulantes..." 
                  value={newMedicationInput}
                  onChange={e => setNewMedicationInput(e.target.value)}
                  style={{ flex: 1, padding: '6px 8px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}
                />
                <button 
                  onClick={async () => {
                    if (!newMedicationInput || !activeProfile) return;
                    const updatedMedications = [...activeProfile.medications, newMedicationInput.trim()];
                    const { error } = await supabase.from('profiles').update({ medication: updatedMedications }).eq('id', activeProfile.id);
                    if (!error) {
                      setProfiles(profiles.map(p => p.id === activeProfile.id ? { ...p, medications: updatedMedications } : p));
                      setNewMedicationInput('');
                    }
                  }}
                  style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Añadir
                </button>
              </div>
            </div>

            {/* Añadir Material */}
            <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '12px', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '13px', margin: '0 0 6px 0', color: t.text }}>Añadir material disponible:</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Ej. Bandas elásticas..." 
                  value={newEquipmentInput}
                  onChange={e => setNewEquipmentInput(e.target.value)}
                  style={{ flex: 1, padding: '6px 8px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}
                />
                <button 
                  onClick={async () => {
                    if (!newEquipmentInput || !activeProfile) return;
                    const updatedEquipment = [...activeProfile.equipment, newEquipmentInput.trim()];
                    const { error } = await supabase.from('profiles').update({ equipment: updatedEquipment }).eq('id', activeProfile.id);
                    if (!error) {
                      setProfiles(profiles.map(p => p.id === activeProfile.id ? { ...p, equipment: updatedEquipment } : p));
                      setNewEquipmentInput('');
                    }
                  }}
                  style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Añadir
                </button>
              </div>
            </div>

            {/* Eliminar Perfil */}
            <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '16px', textAlign: 'center' }}>
              <button 
                onClick={async () => {
                  if (!confirm('¿Estás seguro de que deseas eliminar este perfil permanentemente?')) return;
                  if (!activeProfile) return;
                  const { error } = await supabase.from('profiles').delete().eq('id', activeProfile.id);
                  if (!error) {
                    setProfiles(profiles.filter(p => p.id !== activeProfile.id));
                    setActiveProfileId(null);
                  } else {
                    alert('Error al eliminar perfil: ' + error.message);
                  }
                }}
                style={{ backgroundColor: 'transparent', color: t.danger, border: `1px solid ${t.danger}`, padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
              >
                🗑️ Eliminar este Perfil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navegación Inferior estricta de 5 apartados */}
      <nav style={{
        position: 'fixed',
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
        zIndex: 100
      }}>
        {[
          { id: 'inicio', label: 'Inicio', icon: '🏠' },
          { id: 'entrenar', label: 'Entrenar', icon: '🏋️' },
          { id: 'nutricion', label: 'Nutrición', icon: '🍽️' },
          { id: 'progreso', label: 'Progreso', icon: '📈' },
          { id: 'perfil', label: 'Perfil', icon: '👤' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '10px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? t.navActive : t.navText,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
