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
  goal: string | string[];
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
    id: 'm-1',
    title: 'Tostada integral con aguacate y huevo revuelto',
    type: 'Desayuno',
    calories: 380,
    protein: 18,
    ingredients: ['Pan integral', 'Aguacate', 'Huevo', 'Aceite de oliva'],
    isAllowed: true
  },
  {
    id: 'm-2',
    title: 'Salmón al horno con espárragos trigueros',
    type: 'Cena',
    calories: 450,
    protein: 35,
    ingredients: ['Salmón', 'Espárragos', 'Limón', 'Especias'],
    isAllowed: true
  },
  {
    id: 'm-3',
    title: 'Pechuga de pollo a la plancha con arroz y brócoli',
    type: 'Almuerzo',
    calories: 520,
    protein: 42,
    ingredients: ['Pechuga de pollo', 'Arroz integral', 'Brócoli', 'Aceite de oliva'],
    isAllowed: true
  },
  {
    id: 'm-4',
    title: 'Yogur griego con frutos rojos y nueces',
    type: 'Snack',
    calories: 250,
    protein: 15,
    ingredients: ['Yogur griego', 'Frutos rojos', 'Nueces'],
    isAllowed: true
  }
];

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
  const [authEmail, setAuthEmail] = useState<string>('');
  const [authPassword, setAuthPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'inicio' | 'entrenar' | 'nutricion' | 'progreso' | 'perfil'>('inicio');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isCreatingProfile, setIsCreatingProfile] = useState<boolean>(false);
  const [freshPinNotice, setFreshPinNotice] = useState<string | null>(null);

  const [profilePinTarget, setProfilePinTarget] = useState<UserProfile | null>(null);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);
  const [pinAttempts, setPinAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number>(0);

  const [selectedWorkoutFilter, setSelectedWorkoutFilter] = useState<string>('Todos');
  const [selectedMealFilter, setSelectedMealFilter] = useState<string>('Todos');
  const [newDislikedInput, setNewDislikedInput] = useState<string>('');
  const [activeDemoExerciseId, setActiveDemoExerciseId] = useState<string | null>(null);

  const [trainingGoalChoice, setTrainingGoalChoice] = useState<string>('Hipertrofia');
  const [daysAvailableChoice, setDaysAvailableChoice] = useState<number>(3);

  const [newProfileData, setNewProfileData] = useState({
    name: '',
    age: 25,
    gender: 'Masculino',
    height: 175,
    weight: 70,
    goals: ['Perder grasa'] as string[],
    pin: '1234'
  });

  const [isEditingGoals, setIsEditingGoals] = useState<boolean>(false);
  const [tempGoals, setTempGoals] = useState<string[]>([]);

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

  useEffect(() => {
    if (session?.user) {
      fetchProfilesAndAutoCreate();
    } else {
      setProfiles([]);
      setActiveProfileId(null);
    }
  }, [session]);

  const fetchProfilesAndAutoCreate = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      let rawProfiles = (data || []).filter(p => p && p.name && p.name.trim() !== 'Carlos Trainer');
      let mappedProfiles: UserProfile[] = rawProfiles.map(p => ({
        id: p.id,
        user_id: p.user_id,
        name: p.name,
        age: p.age,
        gender: p.gender,
        height: p.height,
        weight: p.weight,
        goal: p.goal,
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

      if (mappedProfiles.length === 0) {
        const defaultPin = Math.floor(1000 + Math.random() * 9000).toString();
        const pinHashed = await hashPin(defaultPin);
        const defaultName = session.user.email ? session.user.email.split('@')[0] : 'Mi Perfil';

        const { data: newDbData, error: insertError } = await supabase.from('profiles').insert([{
          user_id: session.user.id,
          name: defaultName,
          age: 25,
          gender: 'No especificado',
          height: 175,
          weight: 70,
          goal: 'Perder grasa, Ganar músculo',
          pin_hash: pinHashed,
          equipment: ['Mancuernas', 'Ninguno'],
          streak_days: 1,
          points: 50
        }]).select();

        if (!insertError && newDbData && newDbData[0]) {
          const created = newDbData[0];
          mappedProfiles = [{
            id: created.id,
            user_id: created.user_id,
            name: created.name,
            age: created.age,
            gender: created.gender,
            height: created.height,
            weight: created.weight,
            goal: created.goal,
            pin_hash: created.pin_hash,
            healthRestrictions: [],
            medications: [],
            diseasesOrConditions: [],
            equipment: created.equipment || ['Mancuernas', 'Ninguno'],
            injuries: [],
            dislikedIngredients: [],
            streakDays: 1,
            points: 50,
            created_at: created.created_at
          }];
          setFreshPinNotice(defaultPin);
        }
      }

      setProfiles(mappedProfiles);
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

  if (!session) {
    return (
      <div style={{ fontFamily: '-apple-system, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '24px', color: '#111', backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '24px', textAlign: 'center', marginBottom: '6px', color: '#0284c7' }}>FitApp Pro 🏆</h1>
          <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Inicia sesión en tu cuenta segura</p>

          {authError && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>{authError}</div>}
          
          <form onSubmit={async (e) => {
            e.preventDefault();
            setAuthError(null);
            const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
            if (error) setAuthError(error.message);
          }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: '500' }}>Correo electrónico:
              <input type="email" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
            </label>
            <label style={{ fontSize: '13px', fontWeight: '500' }}>Contraseña:
              <input type="password" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginTop: '4px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' }} />
            </label>
            <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '6px' }}>Iniciar Sesión</button>
          </form>
        </div>
      </div>
    );
  }

  if (!activeProfileId) {
    const isLockedOut = Date.now() < lockoutUntil;

    return (
      <div style={{ fontFamily: '-apple-system, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '20px', color: t.text, backgroundColor: t.bg, minHeight: '100vh', boxSizing: 'border-box' }}>
        {freshPinNotice && (
          <div style={{ backgroundColor: '#dcfce7', border: '1px solid #22c55e', color: '#166534', padding: '12px', borderRadius: '8px', fontSize: '12px', marginBottom: '16px' }}>
            <strong>¡Perfil autogenerado con éxito!</strong> Tu PIN temporal de acceso seguro es: <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{freshPinNotice}</span> (anótalo bien, no se puede recuperar).
          </div>
        )}

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
          {profiles.map(p => {
            const goalDisplay = Array.isArray(p.goal) 
              ? p.goal.join(', ') 
              : (typeof p.goal === 'string' ? p.goal : '');

            return (
              <div key={p.id} style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{p.name}</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: t.textSecondary }}>Objetivos: {goalDisplay} | 🔒 Protegido con PIN</p>
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
            );
          })}

          <button 
            onClick={() => {
              setNewProfileData({ name: '', age: 25, gender: 'Masculino', height: 175, weight: 70, goals: ['Perder grasa'], pin: '0000' });
              setIsCreatingProfile(true);
            }}
            style={{ backgroundColor: 'transparent', border: `2px dashed ${t.primary}`, color: t.primary, padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', marginTop: '10px' }}
          >
            + Crear Nuevo Perfil Adicional
          </button>
        </div>

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
                          setLockoutUntil(Date.now() + 30000);
                        }
                      }
                    }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: t.primary, color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Acceder</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {isCreatingProfile && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
            <div style={{ backgroundColor: t.cardBg, borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '400px', border: `1px solid ${t.border}`, maxHeight: '90vh', overflowY: 'auto' }}>
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
                
                <label style={{ fontWeight: '600', marginTop: '4px' }}>Objetivos Principales (selecciona uno o varios):</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: t.bg, padding: '10px', borderRadius: '6px', border: `1px solid ${t.border}` }}>
                  {['Perder grasa', 'Ganar músculo', 'Recomposición corporal', 'Mejorar fuerza', 'Aumentar resistencia', 'Mejorar salud y movilidad'].map((option) => {
                    const isChecked = newProfileData.goals.includes(option);
                    return (
                      <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px' }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setNewProfileData(prev => {
                              const currentGoals = [...prev.goals];
                              if (checked && !currentGoals.includes(option)) {
                                currentGoals.push(option);
                              } else if (!checked && currentGoals.includes(option)) {
                                const index = currentGoals.indexOf(option);
                                currentGoals.splice(index, 1);
                              }
                              return { ...prev, goals: currentGoals };
                            });
                          }}
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>

                <label style={{ marginTop: '4px' }}>PIN de Seguridad (4 dígitos):
                  <input type="password" maxLength={4} value={newProfileData.pin} onChange={e => setNewProfileData({...newProfileData, pin: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
                </label>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button onClick={() => setIsCreatingProfile(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}`, background: 'transparent', color: t.text, cursor: 'pointer' }}>Cancelar</button>
                  <button onClick={async () => {
                    if (!newProfileData.name || !newProfileData.pin || newProfileData.goals.length === 0) return;
                    const pinHashed = await hashPin(newProfileData.pin);
                    const goalsString = newProfileData.goals.join(', ');

                    const { data, error } = await supabase.from('profiles').insert([{
                      user_id: session.user.id,
                      name: newProfileData.name,
                      age: newProfileData.age,
                      gender: newProfileData.gender,
                      height: newProfileData.height,
                      weight: newProfileData.weight,
                      goal: goalsString,
                      pin_hash: pinHashed,
                      equipment: ['Mancuernas', 'Ninguno'],
                      streak_days: 1,
                      points: 50
                    }]).select();

                    if (error) {
                      alert('Error al crear perfil: ' + error.message);
                    } else if (data) {
                      await fetchProfilesAndAutoCreate();
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

  const filteredMeals = MEAL_LIBRARY.filter(meal => {
    if (selectedMealFilter !== 'Todos' && meal.type !== selectedMealFilter) return false;
    const hasDisliked = meal.ingredients.some(ing => 
      activeProfile?.dislikedIngredients.some(dis => ing.toLowerCase().includes(dis.toLowerCase()))
    );
    if (hasDisliked) return false;
    return true;
  });

  const automatedShoppingList = Array.from(
    new Set(filteredMeals.flatMap(meal => meal.ingredients))
  );

  const displayGoals = Array.isArray(activeProfile?.goal) 
    ? activeProfile?.goal.join(', ') 
    : (typeof activeProfile?.goal === 'string' ? activeProfile?.goal : '');

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
            <h2 style={{ fontSize: '15px', fontWeight: '600', marginTop: 0 }}>🎯 Panel Personalizado Supabase</h2>
            <p style={{ fontSize: '13px', color: t.textSecondary, lineHeight: '1.4', marginBottom: '12px' }}>
              Objetivo(s): <strong>{displayGoals}</strong>.
            </p>
            <button 
              onClick={() => setActiveTab('entrenar')}
              style={{ width: '100%', backgroundColor: t.primary, color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              Comenzar Entrenamiento 🚀
            </button>
          </div>
        </div>
      )}

      {/* 2. SECCIÓN ENTRENAR */}
      {activeTab === 'entrenar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>⚙️ Planificador de Rutinas a Medida</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '14px' }}>
              <label>Objetivo de Entrenamiento:
                <select 
                  value={trainingGoalChoice} 
                  onChange={e => setTrainingGoalChoice(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}
                >
                  <option value="Hipertrofia">Hipertrofia (Ganar músculo)</option>
                  <option value="Definición">Definición / Pérdida de Grasa</option>
                  <option value="Fuerza">Fuerza Pura</option>
                  <option value="Salud">Salud y Movilidad General</option>
                </select>
              </label>

              <label>Días disponibles por semana:
                <select 
                  value={daysAvailableChoice} 
                  onChange={e => setDaysAvailableChoice(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}
                >
                  <option value={2}>2 días (Full Body)</option>
                  <option value={3}>3 días (Torso / Pierna / Full Body)</option>
                  <option value={4}>4 días (Upper / Lower)</option>
                  <option value={5}>5 días (Empuje-Tirón-Pierna)</option>
                </select>
              </label>
            </div>
          </div>

          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>🏋️ Ejercicios Adaptados</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {filteredExercises.map(ex => (
                <div key={ex.id} style={{ padding: '12px', backgroundColor: t.bg, borderRadius: '8px', border: `1px solid ${t.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '14px' }}>{ex.name}</strong>
                    <span style={{ fontSize: '11px', backgroundColor: t.border, padding: '2px 6px', borderRadius: '4px' }}>Req: {ex.equipmentNeeded}</span>
                  </div>
                  <button 
                    onClick={() => setActiveDemoExerciseId(ex.id)}
                    style={{ background: 'transparent', border: `1px solid ${t.primary}`, color: t.primary, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', marginTop: '6px' }}
                  >
                    📺 Ver Demostración
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SECCIÓN NUTRICIÓN (Menús Inteligentes y Lista de Compra Automática) */}
      {activeTab === 'nutricion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>🍽️ Menús Inteligentes y Gustos</h2>
            
            {/* Filtros por tipo de comida */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {['Todos', 'Desayuno', 'Almuerzo', 'Snack', 'Cena'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedMealFilter(cat)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${selectedMealFilter === cat ? t.primary : t.border}`,
                    backgroundColor: selectedMealFilter === cat ? t.primary : t.bg,
                    color: selectedMealFilter === cat ? '#fff' : t.text,
                    fontSize: '12px',
                    fontWeight: selectedMealFilter === cat ? '600' : '400',
                    cursor: 'pointer'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Listado de Menús Filtrados */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredMeals.map(meal => (
                <div key={meal.id} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '14px', flex: 1, paddingRight: '8px' }}>{meal.title}</strong>
                    <span style={{ fontSize: '10px', backgroundColor: t.border, padding: '2px 6px', borderRadius: '4px', color: t.textSecondary, whiteSpace: 'nowrap' }}>{meal.type}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: t.textSecondary, margin: '0 0 8px 0' }}>
                    Ingredientes: {meal.ingredients.join(', ')}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                    <span style={{ color: t.warning, fontWeight: '500' }}>🔥 {meal.calories} kcal | 🥩 {meal.protein}g proteína</span>
                    <span style={{ color: t.success, fontWeight: '600', backgroundColor: '#dcfce7', padding: '2px 6px', borderRadius: '4px', fontSize: '11px' }}>✅ Apto</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de la Compra Automática */}
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>🛒 Lista de la Compra Automática</h2>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: t.textSecondary, display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {automatedShoppingList.map((item, index) => (
                <li key={index} style={{ color: t.text }}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 4. SECCIÓN PROGRESO */}
      {activeTab === 'progreso' && (
        <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>📈 Progreso y Métricas</h2>
          <p style={{ fontSize: '13px', color: t.textSecondary }}>Peso actual: <strong style={{ color: t.text }}>{activeProfile?.weight} kg</strong></p>
        </div>
      )}

      {/* 5. SECCIÓN PERFIL */}
      {activeTab === 'perfil' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>👤 Configuración y Salud</h2>
            </div>
            
            <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', color: t.textSecondary, marginBottom: '16px' }}>
              <p style={{ margin: 0 }}><strong>Nombre:</strong> {activeProfile?.name}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <p style={{ margin: 0 }}><strong>Objetivo(s):</strong> {displayGoals}</p>
                <button 
                  onClick={() => {
                    const currentArray = typeof activeProfile?.goal === 'string' 
                      ? activeProfile.goal.split(',').map(s => s.trim()) 
                      : ['Perder grasa'];
                    setTempGoals(currentArray);
                    setIsEditingGoals(true);
                  }}
                  style={{ background: 'none', border: `1px solid ${t.primary}`, color: t.primary, padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                >
                  Editar Objetivos
                </button>
              </div>
              <p style={{ margin: '4px 0 0 0' }}><strong>Alimentos Bloqueados:</strong> <span style={{ color: t.danger }}>{activeProfile?.dislikedIngredients.join(', ') || 'Ninguno'}</span></p>
            </div>

            {isEditingGoals && (
              <div style={{ backgroundColor: t.bg, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}`, marginBottom: '14px' }}>
                <h4 style={{ fontSize: '13px', margin: '0 0 8px 0' }}>Selecciona tus objetivos:</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                  {['Perder grasa', 'Ganar músculo', 'Recomposición corporal', 'Mejorar fuerza', 'Aumentar resistencia', 'Mejorar salud y movilidad'].map((option) => {
                    const isChecked = tempGoals.includes(option);
                    return (
                      <label key={option} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px' }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            if (checked && !tempGoals.includes(option)) {
                              setTempGoals([...tempGoals, option]);
                            } else if (!checked && tempGoals.includes(option)) {
                              setTempGoals(tempGoals.filter(g => g !== option));
                            }
                          }}
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setIsEditingGoals(false)} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: `1px solid ${t.border}`, background: 'transparent', color: t.text, fontSize: '12px', cursor: 'pointer' }}>Cancelar</button>
                  <button onClick={async () => {
                    if (tempGoals.length === 0 || !activeProfile) return;
                    const newGoalStr = tempGoals.join(', ');
                    const { error } = await supabase.from('profiles').update({ goal: newGoalStr }).eq('id', activeProfile.id);
                    if (!error) {
                      setProfiles(profiles.map(p => p.id === activeProfile.id ? { ...p, goal: newGoalStr } : p));
                      setIsEditingGoals(false);
                    }
                  }} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: 'none', background: t.primary, color: '#fff', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>Guardar</button>
                </div>
              </div>
            )}

            <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: '12px', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '13px', margin: '0 0 6px 0', color: t.text }}>Añadir alimento bloqueado:</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder="Ej. Tomate..." 
                  value={newDislikedInput}
                  onChange={e => setNewDislikedInput(e.target.value)}
                  style={{ flex: 1, padding: '6px 8px', fontSize: '12px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }}
                />
                <button 
                  onClick={async () => {
                    if (!newDislikedInput || !activeProfile) return;
                    const updatedDisliked = [...activeProfile.dislikedIngredients, newDislikedInput.trim()];
                    const { error } = await supabase.from('profiles').update({ disliked_foods: updatedDisliked }).eq('id', activeProfile.id);
                    if (!error) {
                      setProfiles(profiles.map(p => p.id === activeProfile.id ? { ...p, dislikedIngredients: updatedDisliked } : p));
                      setNewDislikedInput('');
                    }
                  }}
                  style={{ backgroundColor: t.danger, color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  Bloquear
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
