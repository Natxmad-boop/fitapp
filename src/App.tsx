import React, { useState, useEffect } from 'react';

const themes = {
  light: {
    bg: '#f8fafc',
    cardBg: '#ffffff',
    text: '#111111',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    primary: '#0284c7',
    primaryHover: '#0369a1',
    statBg: '#f1f5f9',
    inputBg: '#ffffff',
    inputBorder: '#cbd5e1',
    navBg: '#ffffff',
    navText: '#64748b',
    navActive: '#0284c7',
    dangerBg: '#ef4444',
  },
  dark: {
    bg: '#0f172a',
    cardBg: '#1e293b',
    text: '#f8fafc',
    textSecondary: '#94a3b8',
    border: '#334155',
    primary: '#38bdf8',
    primaryHover: '#0ea5e9',
    statBg: '#0f172a',
    inputBg: '#0f172a',
    inputBorder: '#475569',
    navBg: '#1e293b',
    navText: '#94a3b8',
    navActive: '#38bdf8',
    dangerBg: '#dc2626',
  }
};

interface UserProfile {
  id: string;
  name: string;
  pin: string;
  goal: string;
  level: string;
  equipment: string[];
  // Nuevos campos estrictos del guion maestro
  allergies: string[]; // Restricciones estrictas (Alergias / Intolerancias)
  dislikedFoods: string[]; // Preferencias (No me gusta)
  medicalNotes: string; // Medicación o restricciones profesionales
  bodyMetrics: {
    waist: string;
    hip: string;
    chest: string;
    arm: string;
    thigh: string;
  };
}

interface Exercise {
  id: string;
  name: string;
  category: 'Fuerza' | 'Core' | 'Cardio' | 'Movilidad' | 'HIIT' | 'Resistencia';
  targetMuscle: string;
  equipment: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  instructions: string;
  commonErrors: string;
}

interface Meal {
  id: string;
  type: 'Desayuno' | 'Almuerzo' | 'Comida' | 'Merienda' | 'Cena';
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface ShoppingItem {
  id: string;
  name: string;
  category: 'Frutas y Verduras' | 'Carnicería / Pescadería' | 'Lácteos y Huevos' | 'Despensa / Cereales' | 'Otros';
  checked: boolean;
  amount: string;
}

interface SetItem {
  name: string;
  weight: number;
  reps: number;
  difficulty?: 'Fácil' | 'Normal' | 'Difícil';
  note?: string;
  date: string;
}

export default function App() {
  // 1. Perfiles y Seguridad Avanzada (Guion Maestro)
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('fitapp_profiles_v11');
    return saved ? JSON.parse(saved) : [
      { 
        id: '1', 
        name: 'Atleta Principal', 
        pin: '1234', 
        goal: 'Ganar músculo', 
        level: 'Intermedio', 
        equipment: ['Mancuernas', 'Barra'],
        allergies: ['Gluten'],
        dislikedFoods: ['Brócoli'],
        medicalNotes: 'Ninguna restricción médica severa.',
        bodyMetrics: { waist: '80', hip: '95', chest: '100', arm: '35', thigh: '55' }
      }
    ];
  });
  
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('fitapp_active_profile_v11');
    return saved ? JSON.parse(saved) : null;
  });

  const [inputPin, setInputPin] = useState('');
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfilePin, setNewProfilePin] = useState('');
  const [newProfileGoal, setNewProfileGoal] = useState('Ganar músculo');
  const [newProfileLevel, setNewProfileLevel] = useState('Intermedio');

  const [activeTab, setActiveTab] = useState<'inicio' | 'entrenar' | 'biblioteca' | 'nutricion' | 'compra' | 'progreso' | 'perfil'>('inicio');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('fitapp_dark_mode');
    return saved ? JSON.parse(saved) : false;
  });

  const t = isDarkMode ? themes.dark : themes.light;
  const pKey = currentProfile ? `_${currentProfile.id}` : '_default';

  // Estados editables del Perfil extendidos
  const [editGoal, setEditGoal] = useState(currentProfile?.goal || 'Ganar músculo');
  const [editLevel, setEditLevel] = useState(currentProfile?.level || 'Intermedio');
  const [editEquipment, setEditEquipment] = useState<string[]>(currentProfile?.equipment || ['Mancuernas']);
  const [editAllergies, setEditAllergies] = useState<string[]>(currentProfile?.allergies || []);
  const [editDisliked, setEditDisliked] = useState<string[]>(currentProfile?.dislikedFoods || []);
  const [editMedical, setEditMedical] = useState(currentProfile?.medicalNotes || '');

  useEffect(() => {
    if (currentProfile) {
      setEditGoal(currentProfile.goal);
      setEditLevel(currentProfile.level);
      setEditEquipment(currentProfile.equipment || ['Mancuernas']);
      setEditAllergies(currentProfile.allergies || []);
      setEditDisliked(currentProfile.dislikedFoods || []);
      setEditMedical(currentProfile.medicalNotes || '');
    }
  }, [currentProfile]);

  // 2. Biblioteca de Ejercicios
  const defaultExercises: Exercise[] = [
    { id: 'ex_1', name: 'Press de Banca con Barra', category: 'Fuerza', targetMuscle: 'Pectorales, Tríceps', equipment: 'Barra', difficulty: 'Intermedio', instructions: 'Acuéstate en el banco, retrae omóplatos y baja la barra controladamente hasta el pecho.', commonErrors: 'Rebotar la barra en el pecho.' },
    { id: 'ex_2', name: 'Sentadilla Goblet', category: 'Fuerza', targetMuscle: 'Cuádriceps, Glúteos', equipment: 'Mancuernas', difficulty: 'Principiante', instructions: 'Sostén la mancuerna verticalmente frente al pecho, baja la cadera manteniendo la espalda recta.', commonErrors: 'Levantar los talones del suelo.' },
  ];

  const [exerciseLibrary] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem(`fitapp_library_v11${pKey}`);
    return saved ? JSON.parse(saved) : defaultExercises;
  });

  // 3. Nutrición y Menús (Filtrados por Restricciones de Seguridad)
  const defaultDailyMeals: Meal[] = [
    { id: 'm_1', type: 'Desayuno', title: 'Avena Energética con Proteína', description: '60g de avena sin gluten cocida en leche vegetal, plátano y 1 scoop de whey.', calories: 450, protein: 32, carbs: 65, fats: 8 },
    { id: 'm_2', type: 'Comida', title: 'Pechuga de Pollo con Arroz y Calabacín', description: '200g de pechuga a la plancha, 180g de arroz y calabacín salteado (Sustituto de brócoli por preferencia).', calories: 610, protein: 52, carbs: 68, fats: 12 },
    { id: 'm_3', type: 'Merienda', title: 'Yogur Griego con Frutos Rojos', description: '200g de yogur griego natural con arándanos y nueces.', calories: 280, protein: 20, carbs: 18, fats: 12 },
    { id: 'm_4', type: 'Cena', title: 'Salmón al Horno con Patata', description: '180g de salmón al horno con hierbas y patata cocida.', calories: 540, protein: 40, carbs: 35, fats: 22 }
  ];

  const [dailyMeals, setDailyMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem(`fitapp_meals_v11${pKey}`);
    return saved ? JSON.parse(saved) : defaultDailyMeals;
  });

  const [activeMealModal, setActiveMealModal] = useState<Meal | null>(null);

  // 4. Lista de la Compra
  const defaultShoppingList: ShoppingItem[] = [
    { id: 's_1', name: 'Avena certificada sin gluten', category: 'Despensa / Cereales', checked: false, amount: '500g' },
    { id: 's_2', name: 'Plátanos', category: 'Frutas y Verduras', checked: false, amount: '1 kg' },
    { id: 's_3', name: 'Pechuga de pollo fresca', category: 'Carnicería / Pescadería', checked: false, amount: '1 kg' },
    { id: 's_4', name: 'Arroz blanco', category: 'Despensa / Cereales', checked: false, amount: '1 kg' },
    { id: 's_5', name: 'Calabacín fresco', category: 'Frutas y Verduras', checked: false, amount: '2 unidades' },
    { id: 's_6', name: 'Filetes de salmón', category: 'Carnicería / Pescadería', checked: false, amount: '500g' },
  ];

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem(`fitapp_shopping_v11${pKey}`);
    return saved ? JSON.parse(saved) : defaultShoppingList;
  });

  const [newCustomItemName, setNewCustomItemName] = useState('');
  const [newCustomItemCat, setNewCustomItemCat] = useState<ShoppingItem['category']>('Despensa / Cereales');
  const [newCustomItemAmount, setNewCustomItemAmount] = useState('');

  // 5. Historial y Progreso
  const defaultHistory: SetItem[] = [
    { name: 'Press de Banca con Barra', weight: 70, reps: 10, date: '10/05/2026' },
    { name: 'Sentadilla Goblet', weight: 24, reps: 12, date: '18/05/2026' },
  ];

  const [history, setHistory] = useState<SetItem[]>(() => {
    const saved = localStorage.getItem(`fitapp_history_v11${pKey}`);
    return saved ? JSON.parse(saved) : defaultHistory;
  });

  const [weightInput, setWeightInput] = useState('');
  const [repsInput, setRepsInput] = useState('');
  const [selectedExerciseForLog, setSelectedExerciseForLog] = useState('Press de Banca con Barra');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Fácil' | 'Normal' | 'Difícil'>('Normal');
  const [exerciseNote, setExerciseNote] = useState('');
  const [selectedExerciseForGraph, setSelectedExerciseForGraph] = useState('Press de Banca con Barra');

  // Temporizador
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem('fitapp_dark_mode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    if (currentProfile) {
      localStorage.setItem('fitapp_active_profile_v11', JSON.stringify(currentProfile));
      localStorage.setItem(`fitapp_library_v11${pKey}`, JSON.stringify(exerciseLibrary));
      localStorage.setItem(`fitapp_meals_v11${pKey}`, JSON.stringify(dailyMeals));
      localStorage.setItem(`fitapp_shopping_v11${pKey}`, JSON.stringify(shoppingList));
      localStorage.setItem(`fitapp_history_v11${pKey}`, JSON.stringify(history));
    }
  }, [currentProfile, exerciseLibrary, dailyMeals, shoppingList, history, pKey]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  const startTimer = (seconds: number) => {
    setTimeLeft(seconds);
    setIsTimerRunning(true);
  };

  const handleLogin = (prof: UserProfile) => {
    if (prof.pin && prof.pin.length > 0) {
      if (inputPin === prof.pin) {
        setCurrentProfile(prof);
        setInputPin('');
      } else {
        alert('PIN incorrecto. Inténtalo de nuevo.');
      }
    } else {
      setCurrentProfile(prof);
    }
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    const newProf: UserProfile = {
      id: Date.now().toString(),
      name: newProfileName,
      pin: newProfilePin.trim(),
      goal: newProfileGoal,
      level: newProfileLevel,
      equipment: ['Mancuernas'],
      allergies: [],
      dislikedFoods: [],
      medicalNotes: '',
      bodyMetrics: { waist: '75', hip: '90', chest: '95', arm: '32', thigh: '50' }
    };
    const updated = [...profiles, newProf];
    setProfiles(updated);
    localStorage.setItem('fitapp_profiles_v11', JSON.stringify(updated));
    setNewProfileName('');
    setNewProfilePin('');
    setIsCreatingProfile(false);
    setCurrentProfile(newProf);
  };

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfile) return;
    const updatedProfile: UserProfile = {
      ...currentProfile,
      goal: editGoal,
      level: editLevel,
      equipment: editEquipment,
      allergies: editAllergies,
      dislikedFoods: editDisliked,
      medicalNotes: editMedical
    };
    setCurrentProfile(updatedProfile);
    const updatedProfiles = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
    setProfiles(updatedProfiles);
    localStorage.setItem('fitapp_profiles_v11', JSON.stringify(updatedProfiles));
    alert('¡Perfil, restricciones de seguridad y preferencias actualizados!');
  };

  const toggleEquipmentOption = (item: string) => {
    if (editEquipment.includes(item)) {
      setEditEquipment(editEquipment.filter(e => e !== item));
    } else {
      setEditEquipment([...editEquipment, item]);
    }
  };

  const toggleAllergyOption = (allergen: string) => {
    if (editAllergies.includes(allergen)) {
      setEditAllergies(editAllergies.filter(a => a !== allergen));
    } else {
      setEditAllergies([...editAllergies, allergen]);
    }
  };

  const handleExportData = () => {
    const backupData = {
      version: '11.0-MASTER',
      exportDate: new Date().toISOString(),
      profiles,
      currentProfile,
      history,
      shoppingList,
      dailyMeals,
      exerciseLibrary
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `fitapp_master_backup_${currentProfile?.name || 'atleta'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target?.result as string);
          if (parsedData.profiles && parsedData.history) {
            setProfiles(parsedData.profiles);
            localStorage.setItem('fitapp_profiles_v11', JSON.stringify(parsedData.profiles));
            if (parsedData.currentProfile) {
              setCurrentProfile(parsedData.currentProfile);
              localStorage.setItem('fitapp_active_profile_v11', JSON.stringify(parsedData.currentProfile));
            }
            if (parsedData.history) setHistory(parsedData.history);
            if (parsedData.shoppingList) setShoppingList(parsedData.shoppingList);
            if (parsedData.dailyMeals) setDailyMeals(parsedData.dailyMeals);
            alert('¡Copia de seguridad maestra restaurada con éxito!');
            window.location.reload();
          } else {
            alert('El archivo no tiene un formato válido.');
          }
        } catch (err) {
          alert('Error al leer el archivo JSON.');
        }
      };
    }
  };

  const handleAddSet = () => {
    const w = parseFloat(weightInput);
    const r = parseInt(repsInput, 10);
    if (isNaN(w) || isNaN(r)) return;

    const newSet: SetItem = {
      name: selectedExerciseForLog,
      weight: w,
      reps: r,
      difficulty: selectedDifficulty,
      note: exerciseNote,
      date: new Date().toLocaleDateString()
    };

    setHistory([newSet, ...history]);
    setWeightInput('');
    setRepsInput('');
    setExerciseNote('');
    startTimer(90);
    alert('¡Serie registrada! El sistema inteligente adaptará tu próxima sesión.');
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList(shoppingList.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const addCustomShoppingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomItemName.trim()) return;
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newCustomItemName,
      category: newCustomItemCat,
      checked: false,
      amount: newCustomItemAmount.trim() || '1 ud'
    };
    setShoppingList([newItem, ...shoppingList]);
    setNewCustomItemName('');
    setNewCustomItemAmount('');
  };

  const dynamicStyles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      maxWidth: '480px',
      margin: '0 auto',
      padding: '16px',
      paddingBottom: '90px',
      color: t.text,
      backgroundColor: t.bg,
      minHeight: '100vh',
    },
    card: {
      backgroundColor: t.cardBg,
      borderRadius: '12px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: `1px solid ${t.border}`,
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: t.text,
      marginTop: 0,
      marginBottom: '12px',
    },
    button: {
      backgroundColor: t.primary,
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
      backgroundColor: isDarkMode ? '#334155' : '#e2e8f0',
      color: t.text,
      border: 'none',
      padding: '8px 12px',
      borderRadius: '6px',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '12px',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: `1px solid ${t.inputBorder}`,
      backgroundColor: t.inputBg,
      color: t.text,
      fontSize: '14px',
      marginBottom: '10px',
      boxSizing: 'border-box' as const,
    },
    nav: {
      position: 'fixed' as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: t.navBg,
      borderTop: `1px solid ${t.border}`,
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0',
      maxWidth: '480px',
      margin: '0 auto',
      zIndex: 100,
    },
    navItem: (active: boolean) => ({
      background: 'none',
      border: 'none',
      fontSize: '9px',
      fontWeight: active ? '700' : '500',
      color: active ? t.navActive : t.navText,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '2px',
    }),
    listItem: {
      padding: '12px 0',
      borderBottom: `1px solid ${t.border}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
    },
  };

  if (!currentProfile) {
    return (
      <div style={dynamicStyles.container}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.text, margin: '0 0 4px 0' }}>FitApp Pro 🛡️</h1>
            <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>Sistema de Perfiles Aislados y Reglas de Seguridad</p>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={dynamicStyles.secondaryButton}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div style={dynamicStyles.card}>
          <h2 style={dynamicStyles.cardTitle}>🔐 Selección de Perfil Seguro</h2>
          {profiles.map((prof) => (
            <div key={prof.id} style={{ ...dynamicStyles.listItem, flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '15px', color: t.text }}>{prof.name}</strong>
                  <p style={{ fontSize: '11px', color: t.textSecondary, margin: '2px 0 0 0' }}>Objetivo: {prof.goal} | Alergias: {prof.allergies.length > 0 ? prof.allergies.join(', ') : 'Ninguna'}</p>
                </div>
              </div>
              {prof.pin ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="password" placeholder="PIN 4 dígitos" value={inputPin} onChange={(e) => setInputPin(e.target.value)} style={{ ...dynamicStyles.input, margin: 0 }} maxLength={4} />
                  <button style={{ ...dynamicStyles.button, width: '100px', margin: 0 }} onClick={() => handleLogin(prof)}>Acceder</button>
                </div>
              ) : (
                <button style={dynamicStyles.button} onClick={() => handleLogin(prof)}>Entrar</button>
              )}
            </div>
          ))}
        </div>

        <div style={dynamicStyles.card}>
          {!isCreatingProfile ? (
            <button style={dynamicStyles.secondaryButton} onClick={() => setIsCreatingProfile(true)}>+ Crear Nuevo Perfil Aislado</button>
          ) : (
            <form onSubmit={handleCreateProfile}>
              <h2 style={dynamicStyles.cardTitle}>Nuevo Perfil Atleta</h2>
              <input type="text" placeholder="Nombre completo" value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} style={dynamicStyles.input} />
              <input type="password" placeholder="PIN de seguridad (4 dígitos)" value={newProfilePin} onChange={(e) => setNewProfilePin(e.target.value)} style={dynamicStyles.input} maxLength={4} />
              <button type="submit" style={dynamicStyles.button}>Crear Perfil</button>
              <button type="button" style={dynamicStyles.secondaryButton} onClick={() => setIsCreatingProfile(false)}>Cancelar</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  const totalCalories = dailyMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = dailyMeals.reduce((acc, m) => acc + m.protein, 0);

  const exerciseHistoryFiltered = history.filter(h => h.name === selectedExerciseForGraph).reverse();
  const maxWeightRegistered = exerciseHistoryFiltered.length > 0 ? Math.max(...exerciseHistoryFiltered.map(h => h.weight)) : 0;

  return (
    <div style={dynamicStyles.container}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: t.text, margin: '0 0 2px 0' }}>FitApp Pro 🚀</h1>
          <p style={{ fontSize: '12px', color: t.primary, margin: 0, fontWeight: '600' }}>Atleta: {currentProfile.name}</p>
        </div>
        <button onClick={() => setIsDarkMode(!isDarkMode)} style={dynamicStyles.secondaryButton}>
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      {/* 🏠 1. INICIO */}
      {activeTab === 'inicio' && (
        <div>
          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>🎯 Panel Inteligente</h2>
            <p style={{ fontSize: '13px', color: t.textSecondary, marginBottom: '12px' }}>
              Menú adaptado bajo restricciones estrictas. Calorías objetivo: <strong>{totalCalories} kcal</strong>.
            </p>
            {currentProfile.allergies.length > 0 && (
              <div style={{ backgroundColor: isDarkMode ? '#450a0a' : '#fee2e2', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: '#dc2626' }}>🛡️ REGLAS DE SEGURIDAD ACTIVAS:</span>
                <p style={{ fontSize: '12px', color: t.text, margin: '2px 0 0 0' }}>Excluyendo alérgenos estrictos: {currentProfile.allergies.join(', ')}</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={dynamicStyles.button} onClick={() => setActiveTab('entrenar')}>Entrenar 🏋️</button>
              <button style={{ ...dynamicStyles.button, backgroundColor: '#10b981' }} onClick={() => setActiveTab('compra')}>Compra 🛒</button>
            </div>
          </div>
        </div>
      )}

      {/* 🏋️ 2. ENTRENAR */}
      {activeTab === 'entrenar' && (
        <div>
          {timeLeft > 0 && (
            <div style={{ ...dynamicStyles.card, backgroundColor: isDarkMode ? '#032541' : '#eff6ff', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: t.textSecondary, margin: '0 0 4px 0' }}>⏱️ Descanso Automático</p>
              <span style={{ fontSize: '28px', fontWeight: '700', color: t.primary }}>
                {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
              </span>
            </div>
          )}

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>🏋️ Registrar Serie</h2>
            <select value={selectedExerciseForLog} onChange={(e) => setSelectedExerciseForLog(e.target.value)} style={dynamicStyles.input}>
              {exerciseLibrary.map(ex => (
                <option key={ex.id} value={ex.name}>{ex.name}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="number" placeholder="Peso (kg)" value={weightInput} onChange={(e) => setWeightInput(e.target.value)} style={dynamicStyles.input} />
              <input type="number" placeholder="Reps" value={repsInput} onChange={(e) => setRepsInput(e.target.value)} style={dynamicStyles.input} />
            </div>
            <button style={dynamicStyles.button} onClick={handleAddSet}>Guardar Serie y Descansar</button>
          </div>
        </div>
      )}

      {/* 📚 3. BIBLIOTECA */}
      {activeTab === 'biblioteca' && (
        <div style={dynamicStyles.card}>
          <h2 style={dynamicStyles.cardTitle}>📚 Biblioteca de Ejercicios</h2>
          {exerciseLibrary.map((ex) => (
            <div key={ex.id} style={dynamicStyles.listItem}>
              <div>
                <strong style={{ fontSize: '14px', color: t.text }}>{ex.name}</strong>
                <span style={{ fontSize: '11px', color: t.primary, display: 'block' }}>{ex.category} • {ex.targetMuscle}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🍽️ 4. NUTRICIÓN */}
      {activeTab === 'nutricion' && (
        <div style={dynamicStyles.card}>
          <h2 style={dynamicStyles.cardTitle}>🍽️ Nutrición Personalizada</h2>
          {dailyMeals.map((meal) => (
            <div key={meal.id} style={{ ...dynamicStyles.listItem, flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: t.primary }}>{meal.type}</span>
                <span style={{ fontSize: '11px', color: t.textSecondary }}>{meal.calories} kcal</span>
              </div>
              <strong style={{ fontSize: '14px', color: t.text }}>{meal.title}</strong>
              <button style={dynamicStyles.secondaryButton} onClick={() => setActiveMealModal(meal)}>Ver Receta 📖</button>
            </div>
          ))}
        </div>
      )}

      {/* 🛒 5. LISTA DE LA COMPRA */}
      {activeTab === 'compra' && (
        <div style={dynamicStyles.card}>
          <h2 style={dynamicStyles.cardTitle}>🛒 Lista de Compra Segura</h2>
          <form onSubmit={addCustomShoppingItem} style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${t.border}` }}>
            <input type="text" placeholder="Añadir producto..." value={newCustomItemName} onChange={(e) => setNewCustomItemName(e.target.value)} style={dynamicStyles.input} />
            <button type="submit" style={{ ...dynamicStyles.button, marginTop: '8px', backgroundColor: '#10b981' }}>+ Añadir</button>
          </form>

          {shoppingList.map(item => (
            <div key={item.id} onClick={() => toggleShoppingItem(item.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', backgroundColor: t.statBg, borderRadius: '6px', marginBottom: '6px', cursor: 'pointer', border: `1px solid ${t.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>{item.checked ? '✅' : '⬜'}</span>
                <span style={{ fontSize: '13px', textDecoration: item.checked ? 'line-through' : 'none', color: item.checked ? t.textSecondary : t.text, fontWeight: '500' }}>
                  {item.name}
                </span>
              </div>
              <span style={{ fontSize: '12px', color: t.textSecondary, fontWeight: '600' }}>{item.amount}</span>
            </div>
          ))}
        </div>
      )}

      {/* 📈 6. PROGRESO */}
      {activeTab === 'progreso' && (
        <div style={dynamicStyles.card}>
          <h2 style={dynamicStyles.cardTitle}>📈 Progreso y Cargas</h2>
          <select value={selectedExerciseForGraph} onChange={(e) => setSelectedExerciseForGraph(e.target.value)} style={dynamicStyles.input}>
            {Array.from(new Set(history.map(h => h.name))).map(exName => (
              <option key={exName} value={exName}>{exName}</option>
            ))}
          </select>
          <div style={{ backgroundColor: t.statBg, padding: '12px', borderRadius: '8px', textAlign: 'center', margin: '10px 0' }}>
            <span style={{ fontSize: '18px', fontWeight: '700', color: t.primary }}>{maxWeightRegistered} kg</span>
            <p style={{ fontSize: '11px', color: t.textSecondary, margin: '2px 0 0 0' }}>Peso Máximo Registrado</p>
          </div>
        </div>
      )}

      {/* 👤 7. PERFIL Y RESTRICCIONES */}
      {activeTab === 'perfil' && (
        <div>
          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>👤 Perfil y Restricciones Médicas</h2>
            <form onSubmit={handleSaveProfileSettings}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: t.textSecondary, display: 'block', marginBottom: '4px' }}>Objetivo</label>
                <select value={editGoal} onChange={(e) => setEditGoal(e.target.value)} style={dynamicStyles.input}>
                  <option value="Ganar músculo">Ganar músculo</option>
                  <option value="Perder grasa">Perder grasa</option>
                  <option value="Mantener peso">Mantener peso</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#dc2626', display: 'block', marginBottom: '6px' }}>⚠️ Restricciones Estrictas (Alergias / Intolerancias)</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Gluten', 'Lactosa', 'Frutos secos', 'Marisco', 'Huevo'].map(allergen => {
                    const isSelected = editAllergies.includes(allergen);
                    return (
                      <button
                        type="button"
                        key={allergen}
                        onClick={() => toggleAllergyOption(allergen)}
                        style={{
                          backgroundColor: isSelected ? '#dc2626' : t.statBg,
                          color: isSelected ? '#ffffff' : t.text,
                          border: `1px solid ${isSelected ? '#dc2626' : t.border}`,
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '}{allergen}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: t.textSecondary, display: 'block', marginBottom: '4px' }}>Preferencias ("No me gusta")</label>
                <input type="text" value={editDisliked.join(', ')} onChange={(e) => setEditDisliked(e.target.value.split(',').map(s => s.trim()))} style={dynamicStyles.input} placeholder="Ej. Brócoli, Pescado azul" />
              </div>

              <button type="submit" style={dynamicStyles.button}>Guardar Cambios de Perfil</button>
            </form>
          </div>

          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>💾 Respaldo y Seguridad</h2>
            <button style={{ ...dynamicStyles.button, backgroundColor: '#10b981', marginBottom: '10px' }} onClick={handleExportData}>
              📥 Exportar Datos Maestro (JSON)
            </button>
            <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', width: '100%', marginBottom: '10px' }}>
              <button style={{ ...dynamicStyles.secondaryButton, width: '100%', padding: '12px', textAlign: 'center' }}>
                📂 Restaurar Datos
              </button>
              <input type="file" accept=".json" onChange={handleImportData} style={{ position: 'absolute', left: 0, top: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
            </div>
            <button style={dynamicStyles.secondaryButton} onClick={() => setCurrentProfile(null)}>🚪 Bloquear / Cambiar Perfil</button>
          </div>
        </div>
      )}

      {/* Modal Receta */}
      {activeMealModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px', zIndex: 200 }}>
          <div style={{ backgroundColor: t.cardBg, borderRadius: '12px', padding: '20px', maxWidth: '400px', width: '100%', border: `1px solid ${t.border}` }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: t.primary }}>{activeMealModal.type}</span>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: t.text, margin: '4px 0 10px 0' }}>{activeMealModal.title}</h3>
            <p style={{ fontSize: '13px', color: t.textSecondary, margin: '0 0 16px 0', lineHeight: '1.4' }}>{activeMealModal.description}</p>
            <button style={dynamicStyles.button} onClick={() => setActiveMealModal(null)}>Cerrar</button>
          </div>
        </div>
      )}

      {/* Navegación */}
      <nav style={dynamicStyles.nav}>
        <button style={dynamicStyles.navItem(activeTab === 'inicio')} onClick={() => setActiveTab('inicio')}>🏠 Inicio</button>
        <button style={dynamicStyles.navItem(activeTab === 'entrenar')} onClick={() => setActiveTab('entrenar')}>🏋️ Entreno</button>
        <button style={dynamicStyles.navItem(activeTab === 'biblioteca')} onClick={() => setActiveTab('biblioteca')}>📚 Biblioteca</button>
        <button style={dynamicStyles.navItem(activeTab === 'nutricion')} onClick={() => setActiveTab('nutricion')}>🍽️ Menús</button>
        <button style={dynamicStyles.navItem(activeTab === 'compra')} onClick={() => setActiveTab('compra')}>🛒 Compra</button>
        <button style={dynamicStyles.navItem(activeTab === 'progreso')} onClick={() => setActiveTab('progreso')}>📈 Progreso</button>
        <button style={dynamicStyles.navItem(activeTab === 'perfil')} onClick={() => setActiveTab('perfil')}>👤 Perfil</button>
      </nav>
    </div>
  );
}
