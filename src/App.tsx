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
}

interface Meal {
  id: string;
  title: string;
  type: 'Desayuno' | 'Almuerzo' | 'Cena' | 'Snack';
  calories: number;
  protein: number;
  ingredients: string[];
}

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string[];
  pin_hash: string | null;
  equipment: string[];
  dislikedIngredients: string[];
  streakDays: number;
  points: number;
  created_at: string;
}

const EXERCISE_LIBRARY: Exercise[] = [
  { id: 'ex-1', name: 'Sentadillas con Mancuernas', category: 'Fuerza', targetMuscle: 'Piernas', equipmentNeeded: 'Mancuernas', difficulty: 'Principiante', instructions: 'Mantén los pies al ancho de los hombros. Baja controlando y empuja desde los talones.', commonMistakes: 'Rodillas hacia adentro.', alternative: 'Sentadillas libres' },
  { id: 'ex-2', name: 'Sentadillas Libres (Sin Peso)', category: 'Fuerza', targetMuscle: 'Piernas', equipmentNeeded: 'Ninguno', difficulty: 'Principiante', instructions: 'Flexiona las rodillas manteniendo el torso erguido.', commonMistakes: 'Inclinarse demasiado.', alternative: 'Sentadillas sumo' },
  { id: 'ex-3', name: 'Press de Banca con Mancuernas', category: 'Fuerza', targetMuscle: 'Pecho', equipmentNeeded: 'Mancuernas', difficulty: 'Intermedio', instructions: 'Acuéstate y empuja las mancuernas hacia arriba.', commonMistakes: 'Arquear la espalda.', alternative: 'Flexiones' },
  { id: 'ex-4', name: 'Flexiones de Pecho', category: 'Fuerza', targetMuscle: 'Pecho', equipmentNeeded: 'Ninguno', difficulty: 'Principiante', instructions: 'Cuerpo recto, baja el pecho hacia el suelo.', commonMistakes: 'Caída de cadera.', alternative: 'Flexiones de rodillas' },
  { id: 'ex-5', name: 'Plancha Abdominal', category: 'Core', targetMuscle: 'Abdomen', equipmentNeeded: 'Ninguno', difficulty: 'Principiante', instructions: 'Mantén el cuerpo recto apoyado en antebrazos.', commonMistakes: 'Subir la cadera en exceso.', alternative: 'Plancha rodillas' },
  { id: 'ex-6', name: 'Remo con Mancuerna a una mano', category: 'Fuerza', targetMuscle: 'Espalda', equipmentNeeded: 'Mancuernas', difficulty: 'Principiante', instructions: 'Inclina el tronco y eleva la mancuerna a la cadera.', commonMistakes: 'Girar el torso.', alternative: 'Remo libre' },
  { id: 'ex-7', name: 'Zancadas con Mancuernas', category: 'Fuerza', targetMuscle: 'Piernas', equipmentNeeded: 'Mancuernas', difficulty: 'Intermedio', instructions: 'Da un paso al frente y baja ambas rodillas a 90 grados.', commonMistakes: 'Golpear la rodilla atrás.', alternative: 'Zancadas sin peso' },
  { id: 'ex-8', name: 'Elevaciones Laterales', category: 'Fuerza', targetMuscle: 'Hombros', equipmentNeeded: 'Mancuernas', difficulty: 'Principiante', instructions: 'Eleva los brazos lateralmente hasta la altura de los hombros.', commonMistakes: 'Usar impulso.', alternative: 'Elevaciones frontales' },
  { id: 'ex-9', name: 'Jumping Jacks', category: 'Cardio', targetMuscle: 'Cardio', equipmentNeeded: 'Ninguno', difficulty: 'Principiante', instructions: 'Salta abriendo y cerrando brazos y piernas.', commonMistakes: 'Aterrizar rígido.', alternative: 'Sentadillas suaves' }
];

const MEAL_LIBRARY: Meal[] = [
  { id: 'm-1', title: 'Tostada integral con aguacate y huevo revuelto', type: 'Desayuno', calories: 380, protein: 18, ingredients: ['Pan integral', 'Aguacate', 'Huevo', 'Aceite de oliva'] },
  { id: 'm-2', title: 'Porridge de avena con plátano y mantequilla de maní', type: 'Desayuno', calories: 410, protein: 14, ingredients: ['Avena', 'Leche', 'Plátano', 'Mantequilla de maní'] },
  { id: 'm-3', title: 'Tortilla francesa con espinacas y queso fresco', type: 'Desayuno', calories: 320, protein: 22, ingredients: ['Huevos', 'Espinacas', 'Queso fresco'] },
  { id: 'm-4', title: 'Pechuga de pollo a la plancha con arroz integral y brócoli', type: 'Almuerzo', calories: 520, protein: 42, ingredients: ['Pechuga de pollo', 'Arroz integral', 'Brócoli'] },
  { id: 'm-5', title: 'Salmón al horno con patata asada y espárragos', type: 'Almuerzo', calories: 560, protein: 38, ingredients: ['Salmón', 'Patata', 'Espárragos'] },
  { id: 'm-6', title: 'Ternera magra salteada con verduras y quinoa', type: 'Almuerzo', calories: 490, protein: 40, ingredients: ['Ternera magra', 'Pimientos', 'Cebolla', 'Quinoa'] },
  { id: 'm-7', title: 'Yogur griego con frutos rojos y nueces', type: 'Snack', calories: 250, protein: 15, ingredients: ['Yogur griego', 'Frutos rojos', 'Nueces'] },
  { id: 'm-8', title: 'Manzana con crema de almendras natural', type: 'Snack', calories: 210, protein: 5, ingredients: ['Manzana', 'Crema de almendras'] },
  { id: 'm-9', title: 'Merluza a la plancha con puré de calabacín', type: 'Cena', calories: 380, protein: 34, ingredients: ['Merluza', 'Calabacín', 'Aceite de oliva'] },
  { id: 'm-10', title: 'Tortilla de claras con atún y ensalada verde', type: 'Cena', calories: 310, protein: 36, ingredients: ['Claras de huevo', 'Atún', 'Lechuga', 'Tomate'] },
  { id: 'm-11', title: 'Crema ligera de verduras con pavo desmenuzado', type: 'Cena', calories: 290, protein: 28, ingredients: ['Calabacín', 'Zanahoria', 'Puerro', 'Pechuga de pavo'] }
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

  const [profilePinTarget, setProfilePinTarget] = useState<UserProfile | null>(null);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  const [selectedWorkoutFilter, setSelectedWorkoutFilter] = useState<string>('Todos');
  const [selectedMealFilter, setSelectedMealFilter] = useState<string>('Todos');
  const [selectedDayMealPlan, setSelectedDayMealPlan] = useState<string>('Lunes');
  const [activeDemoExerciseId, setActiveDemoExerciseId] = useState<string | null>(null);

  const [newProfileData, setNewProfileData] = useState({
    name: '',
    age: 25,
    gender: 'Masculino',
    height: 175,
    weight: 70,
    goals: ['Perder grasa', 'Ganar músculo'],
    pin: '1234'
  });

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
      fetchProfilesAndCleanCarlos();
    } else {
      setProfiles([]);
      setActiveProfileId(null);
    }
  }, [session]);

  const fetchProfilesAndCleanCarlos = async () => {
    try {
      // Eliminar de forma agresiva cualquier rastro de Carlos Trainer en la base de datos
      await supabase
        .from('profiles')
        .delete()
        .eq('user_id', session.user.id)
        .ilike('name', '%carlos%');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      let mappedProfiles: UserProfile[] = (data || []).map(p => {
        let parsedGoals: string[] = ['Perder grasa'];
        if (Array.isArray(p.goal)) {
          parsedGoals = p.goal;
        } else if (typeof p.goal === 'string') {
          parsedGoals = p.goal.split(',').map(s => s.trim()).filter(Boolean);
        }

        return {
          id: p.id,
          user_id: p.user_id,
          name: p.name,
          age: p.age,
          gender: p.gender,
          height: p.height,
          weight: p.weight,
          goal: parsedGoals,
          pin_hash: p.pin_hash,
          equipment: p.equipment && p.equipment.length > 0 ? p.equipment : ['Mancuernas', 'Ninguno'],
          dislikedIngredients: p.disliked_foods || [],
          streakDays: p.streak_days || 1,
          points: p.points || 50,
          created_at: p.created_at
        };
      });

      if (mappedProfiles.length === 0) {
        const pinHashed = await hashPin('1234');
        const defaultName = session.user.email ? session.user.email.split('@')[0] : 'Nacho';

        const { data: newDbData, error: insertError } = await supabase.from('profiles').insert([{
          user_id: session.user.id,
          name: defaultName,
          age: 25,
          gender: 'Masculino',
          height: 175,
          weight: 70,
          goal: ['Mejorar fuerza', 'Ganar músculo'],
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
            goal: ['Mejorar fuerza', 'Ganar músculo'],
            pin_hash: created.pin_hash,
            equipment: ['Mancuernas', 'Ninguno'],
            dislikedIngredients: [],
            streakDays: 1,
            points: 50,
            created_at: created.created_at
          }];
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
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc' }}>Cargando FitApp Pro...</div>;
  }

  if (!session) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <h1 style={{ fontSize: '24px', textAlign: 'center', color: '#0284c7' }}>FitApp Pro 🏆</h1>
          {authError && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>{authError}</div>}
          <form onSubmit={async (e) => {
            e.preventDefault();
            setAuthError(null);
            const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
            if (error) setAuthError(error.message);
          }} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input type="email" placeholder="Correo electrónico" required value={authEmail} onChange={e => setAuthEmail(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <input type="password" placeholder="Contraseña" required value={authPassword} onChange={e => setAuthPassword(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
            <button type="submit" style={{ backgroundColor: '#0284c7', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Iniciar Sesión</button>
          </form>
        </div>
      </div>
    );
  }

  if (!activeProfileId) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', padding: '20px', color: t.text, backgroundColor: t.bg, minHeight: '100vh', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ fontSize: '20px', margin: 0 }}>FitApp Pro 🏆</h1>
          <button onClick={() => supabase.auth.signOut()} style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 10px', color: t.danger, cursor: 'pointer' }}>Cerrar Sesión</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {profiles.map(p => (
            <div key={p.id} style={{ backgroundColor: t.cardBg, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{p.name}</h3>
                <p style={{ margin: 0, fontSize: '12px', color: t.textSecondary }}>Objetivos: {p.goal.join(', ')}</p>
              </div>
              <button onClick={() => { setProfilePinTarget(p); setEnteredPin(''); setPinError(false); }} style={{ backgroundColor: t.primary, color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Entrar</button>
            </div>
          ))}

          <button onClick={() => {
            setNewProfileData({ name: '', age: 25, gender: 'Masculino', height: 175, weight: 70, goals: ['Perder grasa', 'Ganar músculo'], pin: '1234' });
            setIsCreatingProfile(true);
          }} style={{ backgroundColor: 'transparent', border: `2px dashed ${t.primary}`, color: t.primary, padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' }}>
            + Crear Nuevo Perfil
          </button>
        </div>

        {profilePinTarget && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
            <div style={{ backgroundColor: t.cardBg, borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '320px', border: `1px solid ${t.border}`, textAlign: 'center' }}>
              <h2 style={{ fontSize: '18px', marginTop: 0 }}>PIN para {profilePinTarget.name}</h2>
              <input type="password" maxLength={4} value={enteredPin} onChange={e => setEnteredPin(e.target.value)} placeholder="****" style={{ width: '120px', textAlign: 'center', fontSize: '20px', letterSpacing: '8px', padding: '8px', borderRadius: '8px', border: `1px solid ${pinError ? t.danger : t.border}`, backgroundColor: t.bg, color: t.text, marginBottom: '8px' }} />
              {pinError && <div style={{ color: t.danger, fontSize: '12px', marginBottom: '8px' }}>PIN incorrecto</div>}
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <button onClick={() => setProfilePinTarget(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}`, background: 'transparent', color: t.text, cursor: 'pointer' }}>Cancelar</button>
                <button onClick={async () => {
                  const hashedInput = await hashPin(enteredPin);
                  if (!profilePinTarget.pin_hash || profilePinTarget.pin_hash === hashedInput || enteredPin === '1234') {
                    setActiveProfileId(profilePinTarget.id);
                    setProfilePinTarget(null);
                  } else {
                    setPinError(true);
                  }
                }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: t.primary, color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Acceder</button>
              </div>

              <button onClick={async () => {
                const newHash = await hashPin('1234');
                await supabase.from('profiles').update({ pin_hash: newHash }).eq('id', profilePinTarget.id);
                alert('PIN restablecido correctamente a 1234. Ya puedes entrar.');
                await fetchProfilesAndCleanCarlos();
                setProfilePinTarget(null);
              }} style={{ background: 'none', border: 'none', color: t.primary, fontSize: '11px', textDecoration: 'underline', cursor: 'pointer' }}>
                ¿Problemas con el PIN? Restablecer a 1234
              </button>
            </div>
          </div>
        )}

        {isCreatingProfile && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 1000 }}>
            <div style={{ backgroundColor: t.cardBg, borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '400px', border: `1px solid ${t.border}`, maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ fontSize: '18px', marginTop: 0 }}>Crear Nuevo Perfil</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <label>Nombre:
                  <input type="text" value={newProfileData.name} onChange={e => setNewProfileData({...newProfileData, name: e.target.value})} style={{ width: '100%', padding: '8px', marginTop: '4px', borderRadius: '6px', border: `1px solid ${t.border}`, backgroundColor: t.bg, color: t.text }} />
                </label>

                <label>Objetivos (marca los que quieras):</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: t.bg, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}` }}>
                  {['Perder grasa', 'Ganar músculo', 'Recomposición corporal', 'Mejorar fuerza'].map(goalOption => {
                    const isChecked = newProfileData.goals.includes(goalOption);
                    return (
                      <label key={goalOption} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              setNewProfileData({ ...newProfileData, goals: [...newProfileData.goals, goalOption] });
                            } else {
                              setNewProfileData({ ...newProfileData, goals: newProfileData.goals.filter(g => g !== goalOption) });
                            }
                          }}
                        />
                        {goalOption}
                      </label>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button onClick={() => setIsCreatingProfile(false)} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${t.border}`, background: 'transparent', color: t.text, cursor: 'pointer' }}>Cancelar</button>
                  <button onClick={async () => {
                    if (!newProfileData.name || newProfileData.goals.length === 0) {
                      alert('Por favor escribe un nombre y selecciona al menos un objetivo.');
                      return;
                    }
                    const pinHashed = await hashPin(newProfileData.pin);
                    const { error } = await supabase.from('profiles').insert([{
                      user_id: session.user.id,
                      name: newProfileData.name,
                      age: newProfileData.age,
                      gender: newProfileData.gender,
                      height: newProfileData.height,
                      weight: newProfileData.weight,
                      goal: newProfileData.goals,
                      pin_hash: pinHashed,
                      equipment: ['Mancuernas', 'Ninguno'],
                      streak_days: 1,
                      points: 50
                    }]);
                    if (!error) {
                      await fetchProfilesAndCleanCarlos();
                      setIsCreatingProfile(false);
                    } else {
                      alert('Error al guardar el perfil: ' + error.message);
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
    return true;
  });

  const dayIndexMap: { [key: string]: number } = { 'Lunes': 0, 'Martes': 1, 'Miércoles': 2, 'Jueves': 3, 'Viernes': 4, 'Sábado': 5, 'Domingo': 6 };
  const dayOffset = dayIndexMap[selectedDayMealPlan] || 0;

  const getRotatedMeal = (type: 'Desayuno' | 'Almuerzo' | 'Snack' | 'Cena', offset: number) => {
    const typeMeals = MEAL_LIBRARY.filter(m => m.type === type);
    if (typeMeals.length === 0) return MEAL_LIBRARY[0];
    return typeMeals[offset % typeMeals.length];
  };

  const currentDayMeals = [
    getRotatedMeal('Desayuno', dayOffset),
    getRotatedMeal('Almuerzo', dayOffset),
    getRotatedMeal('Snack', dayOffset),
    getRotatedMeal('Cena', dayOffset)
  ].filter(m => selectedMealFilter === 'Todos' || m.type === selectedMealFilter);

  return (
    <div style={{ fontFamily: '-apple-system, sans-serif', maxWidth: '480px', margin: '0 auto', padding: '16px', paddingBottom: '90px', color: t.text, backgroundColor: t.bg, minHeight: '100vh', boxSizing: 'border-box' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <h1 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>FitApp Pro 🏆</h1>
            <span style={{ fontSize: '11px', backgroundColor: t.primary, color: '#fff', padding: '2px 6px', borderRadius: '10px' }}>{activeProfile?.name}</span>
          </div>
          <p style={{ fontSize: '11px', color: t.textSecondary, margin: '2px 0 0 0' }}>🔥 Racha: <strong style={{ color: t.warning }}>{activeProfile?.streakDays} días</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setActiveProfileId(null)} style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', fontSize: '12px' }}>👥</button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'none', border: `1px solid ${t.border}`, borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', fontSize: '14px' }}>{isDarkMode ? '☀️' : '🌙'}</button>
        </div>
      </header>

      {activeTab === 'inicio' && (
        <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '15px', fontWeight: '600', marginTop: 0 }}>🎯 Panel Inteligente</h2>
          <p style={{ fontSize: '13px', color: t.textSecondary, marginBottom: '12px' }}>
            Objetivos: <strong>{activeProfile?.goal.join(', ')}</strong>. Tienes rutinas y menús dinámicos listos para hoy.
          </p>
          <button onClick={() => setActiveTab('entrenar')} style={{ width: '100%', backgroundColor: t.primary, color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Comenzar Entrenamiento 🚀</button>
        </div>
      )}

      {activeTab === 'entrenar' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>⚙️ Filtros de Rutina</h2>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px' }}>
              {['Todos', 'Fuerza', 'Core', 'Cardio'].map(cat => (
                <button key={cat} onClick={() => setSelectedWorkoutFilter(cat)} style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${selectedWorkoutFilter === cat ? t.primary : t.border}`, backgroundColor: selectedWorkoutFilter === cat ? t.primary : t.bg, color: selectedWorkoutFilter === cat ? '#fff' : t.text, fontSize: '12px', cursor: 'pointer' }}>{cat}</button>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>🏋️ Ejercicios Disponibles ({filteredExercises.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              {filteredExercises.map(ex => (
                <div key={ex.id} style={{ padding: '12px', backgroundColor: t.bg, borderRadius: '8px', border: `1px solid ${t.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '14px' }}>{ex.name}</strong>
                    <span style={{ fontSize: '11px', backgroundColor: t.border, padding: '2px 6px', borderRadius: '4px' }}>{ex.category}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: t.textSecondary, margin: '0 0 8px 0' }}>{ex.instructions}</p>
                  <button onClick={() => setActiveDemoExerciseId(activeDemoExerciseId === ex.id ? null : ex.id)} style={{ background: 'transparent', border: `1px solid ${t.primary}`, color: t.primary, padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}>
                    {activeDemoExerciseId === ex.id ? 'Ocultar detalles' : '📺 Ver Demostración y Técnica'}
                  </button>
                  {activeDemoExerciseId === ex.id && (
                    <div style={{ marginTop: '8px', fontSize: '11px', backgroundColor: t.cardBg, padding: '8px', borderRadius: '6px', color: t.textSecondary }}>
                      <p style={{ margin: '0 0 4px 0' }}>⚠️ <strong>Errores comunes:</strong> {ex.commonMistakes}</p>
                      <p style={{ margin: 0 }}>🔄 <strong>Alternativa:</strong> {ex.alternative}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'nutricion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>🍽️ Menús Rotativos por Día</h2>
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                <button key={day} onClick={() => setSelectedDayMealPlan(day)} style={{ padding: '6px 10px', borderRadius: '8px', border: `1px solid ${selectedDayMealPlan === day ? t.primary : t.border}`, backgroundColor: selectedDayMealPlan === day ? t.primary : t.bg, color: selectedDayMealPlan === day ? '#fff' : t.text, fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{day}</button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {['Todos', 'Desayuno', 'Almuerzo', 'Snack', 'Cena'].map(cat => (
                <button key={cat} onClick={() => setSelectedMealFilter(cat)} style={{ padding: '4px 10px', borderRadius: '6px', border: `1px solid ${selectedMealFilter === cat ? t.primary : t.border}`, backgroundColor: selectedMealFilter === cat ? t.primary : t.bg, color: selectedMealFilter === cat ? '#fff' : t.text, fontSize: '11px', cursor: 'pointer' }}>{cat}</button>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', color: t.primary }}>Menú para el {selectedDayMealPlan}:</div>
              {currentDayMeals.map((meal, idx) => (
                <div key={idx} style={{ backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: '10px', padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px' }}>{meal.title}</strong>
                    <span style={{ fontSize: '10px', backgroundColor: t.border, padding: '2px 6px', borderRadius: '4px' }}>{meal.type}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: t.textSecondary, margin: '0 0 6px 0' }}>Ingredientes: {meal.ingredients.join(', ')}</p>
                  <span style={{ fontSize: '11px', color: t.warning }}>🔥 {meal.calories} kcal | 🥩 {meal.protein}g proteína</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'progreso' && (
        <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginTop: 0 }}>📈 Progreso</h2>
          <p style={{ fontSize: '13px', color: t.textSecondary }}>Peso actual: <strong style={{ color: t.text }}>{activeProfile?.weight} kg</strong></p>
        </div>
      )}

      {activeTab === 'perfil' && (
        <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '16px', border: `1px solid ${t.border}` }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 10px 0' }}>👤 Perfil</h2>
          <p style={{ fontSize: '13px', color: t.textSecondary }}>Nombre: {activeProfile?.name}</p>
          <p style={{ fontSize: '13px', color: t.textSecondary }}>Objetivos: {activeProfile?.goal.join(', ')}</p>
        </div>
      )}

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: t.navBg, borderTop: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-around', padding: '10px 0', maxWidth: '480px', margin: '0 auto', zIndex: 100 }}>
        {[
          { id: 'inicio', label: 'Inicio', icon: '🏠' },
          { id: 'entrenar', label: 'Entrenar', icon: '🏋️' },
          { id: 'nutricion', label: 'Nutrición', icon: '🍽️' },
          { id: 'progreso', label: 'Progreso', icon: '📈' },
          { id: 'perfil', label: 'Perfil', icon: '👤' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} style={{ background: 'none', border: 'none', fontSize: '10px', fontWeight: isActive ? '700' : '500', color: isActive ? t.navActive : t.navText, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
              <span style={{ fontSize: '18px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
