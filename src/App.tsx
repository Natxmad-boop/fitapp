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
  // 1. Perfiles y Seguridad
  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('fitapp_profiles');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Atleta Principal', pin: '1234', goal: 'Ganar músculo', level: 'Intermedio', equipment: ['Mancuernas', 'Barra'] }
    ];
  });
  
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('fitapp_active_profile');
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

  // Estados editables del Perfil
  const [editGoal, setEditGoal] = useState(currentProfile?.goal || 'Ganar músculo');
  const [editLevel, setEditLevel] = useState(currentProfile?.level || 'Intermedio');
  const [editEquipment, setEditEquipment] = useState<string[]>(currentProfile?.equipment || ['Mancuernas']);

  useEffect(() => {
    if (currentProfile) {
      setEditGoal(currentProfile.goal);
      setEditLevel(currentProfile.level);
      setEditEquipment(currentProfile.equipment || ['Mancuernas']);
    }
  }, [currentProfile]);

  // 2. Biblioteca de Ejercicios
  const defaultExercises: Exercise[] = [
    { id: 'ex_1', name: 'Press de Banca con Barra', category: 'Fuerza', targetMuscle: 'Pectorales, Tríceps', equipment: 'Barra', difficulty: 'Intermedio', instructions: 'Acuéstate en el banco, retrae omóplatos y baja la barra controladamente hasta el pecho.', commonErrors: 'Rebotar la barra en el pecho.' },
    { id: 'ex_2', name: 'Sentadilla Goblet', category: 'Fuerza', targetMuscle: 'Cuádriceps, Glúteos', equipment: 'Mancuernas', difficulty: 'Principiante', instructions: 'Sostén la mancuerna verticalmente frente al pecho, baja la cadera manteniendo la espalda recta.', commonErrors: 'Levantar los talones del suelo.' },
  ];

  const [exerciseLibrary] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem(`fitapp_library_v9${pKey}`);
    return saved ? JSON.parse(saved) : defaultExercises;
  });

  // 3. Nutrición y Menús
  const defaultDailyMeals: Meal[] = [
    { id: 'm_1', type: 'Desayuno', title: 'Avena Energética con Proteína', description: '60g de avena cocida en leche o bebida vegetal, 1 plátano en rodajas y 1 scoop de proteína de suero.', calories: 450, protein: 32, carbs: 65, fats: 8 },
    { id: 'm_2', type: 'Comida', title: 'Pechuga de Pollo con Arroz y Verduras', description: '200g de pechuga a la plancha, 180g de arroz cocido y brócoli al vapor con aceite de oliva.', calories: 620, protein: 52, carbs: 70, fats: 14 },
    { id: 'm_3', type: 'Merienda', title: 'Yogur Griego con Frutos Rojos', description: '200g de yogur griego natural bajo en grasa con un puñado de arándanos y nueces.', calories: 280, protein: 20, carbs: 18, fats: 12 },
    { id: 'm_4', type: 'Cena', title: 'Salmón al Horno con Patata', description: '180g de filete de salmón al horno con hierbas provenzales y una patata mediana cocida.', calories: 540, protein: 40, carbs: 35, fats: 22 }
  ];

  const [dailyMeals, setDailyMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem(`fitapp_meals_v9${pKey}`);
    return saved ? JSON.parse(saved) : defaultDailyMeals;
  });

  const [activeMealModal, setActiveMealModal] = useState<Meal | null>(null);

  // 4. Lista de la Compra
  const defaultShoppingList: ShoppingItem[] = [
    { id: 's_1', name: 'Avena en copos', category: 'Despensa / Cereales', checked: false, amount: '500g' },
    { id: 's_2', name: 'Plátanos', category: 'Frutas y Verduras', checked: false, amount: '1 kg' },
    { id: 's_3', name: 'Proteína de suero (Whey)', category: 'Despensa / Cereales', checked: true, amount: '1 bote' },
    { id: 's_4', name: 'Pechuga de pollo fresca', category: 'Carnicería / Pescadería', checked: false, amount: '1 kg' },
    { id: 's_5', name: 'Arroz blanco o integral', category: 'Despensa / Cereales', checked: false, amount: '1 kg' },
    { id: 's_6', name: 'Brócoli fresco', category: 'Frutas y Verduras', checked: false, amount: '2 unidades' },
    { id: 's_7', name: 'Yogur griego natural', category: 'Lácteos y Huevos', checked: false, amount: '1 pack (4 uds)' },
    { id: 's_8', name: 'Filetes de salmón', category: 'Carnicería / Pescadería', checked: false, amount: '500g' },
    { id: 's_9', name: 'Patatas', category: 'Frutas y Verduras', checked: false, amount: '1 kg' },
  ];

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem(`fitapp_shopping_v9${pKey}`);
    return saved ? JSON.parse(saved) : defaultShoppingList;
  });

  const [newCustomItemName, setNewCustomItemName] = useState('');
  const [newCustomItemCat, setNewCustomItemCat] = useState<ShoppingItem['category']>('Despensa / Cereales');
  const [newCustomItemAmount, setNewCustomItemAmount] = useState('');

  // 5. Historial y Progreso
  const defaultHistory: SetItem[] = [
    { name: 'Press de Banca con Barra', weight: 70, reps: 10, date: '10/05/2026' },
    { name: 'Press de Banca con Barra', weight: 75, reps: 8, date: '17/05/2026' },
    { name: 'Press de Banca con Barra', weight: 80, reps: 6, date: '24/05/2026' },
    { name: 'Sentadilla Goblet', weight: 24, reps: 12, date: '18/05/2026' },
    { name: 'Sentadilla Goblet', weight: 28, reps: 10, date: '25/05/2026' },
  ];

  const [history, setHistory] = useState<SetItem[]>(() => {
    const saved = localStorage.getItem(`fitapp_history_v9${pKey}`);
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
      localStorage.setItem('fitapp_active_profile', JSON.stringify(currentProfile));
      localStorage.setItem(`fitapp_library_v9${pKey}`, JSON.stringify(exerciseLibrary));
      localStorage.setItem(`fitapp_meals_v9${pKey}`, JSON.stringify(dailyMeals));
      localStorage.setItem(`fitapp_shopping_v9${pKey}`, JSON.stringify(shoppingList));
      localStorage.setItem(`fitapp_history_v9${pKey}`, JSON.stringify(history));
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
      equipment: ['Mancuernas']
    };
    const updated = [...profiles, newProf];
    setProfiles(updated);
    localStorage.setItem('fitapp_profiles', JSON.stringify(updated));
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
      equipment: editEquipment
    };
    setCurrentProfile(updatedProfile);
    const updatedProfiles = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
    setProfiles(updatedProfiles);
    localStorage.setItem('fitapp_profiles', JSON.stringify(updatedProfiles));
    alert('¡Preferencias de perfil actualizadas con éxito!');
  };

  const toggleEquipmentOption = (item: string) => {
    if (editEquipment.includes(item)) {
      setEditEquipment(editEquipment.filter(e => e !== item));
    } else {
      setEditEquipment([...editEquipment, item]);
    }
  };

  // Fase 9: Funciones de Exportación e Importación de Datos
  const handleExportData = () => {
    const backupData = {
      version: '9.0',
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
    downloadAnchor.setAttribute("download", `fitapp_backup_${currentProfile?.name || 'atleta'}_${new Date().toISOString().slice(0, 10)}.json`);
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
            localStorage.setItem('fitapp_profiles', JSON.stringify(parsedData.profiles));
            if (parsedData.currentProfile) {
              setCurrentProfile(parsedData.currentProfile);
              localStorage.setItem('fitapp_active_profile', JSON.stringify(parsedData.currentProfile));
            }
            if (parsedData.history) setHistory(parsedData.history);
            if (parsedData.shoppingList) setShoppingList(parsedData.shoppingList);
            if (parsedData.dailyMeals) setDailyMeals(parsedData.dailyMeals);
            alert('¡Copia de seguridad restaurada con éxito!');
            window.location.reload();
          } else {
            alert('El archivo no tiene un formato válido de FitApp.');
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
    alert('¡Serie registrada con éxito! Tu gráfico de evolución se ha actualizado.');
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

  const regenerateMeal = (mealId: string) => {
    const alternatives: Record<string, { title: string; desc: string; cal: number; p: number; c: number; f: number }> = {
      'Desayuno': { title: 'Tortilla Francesa con Tostada Integral', desc: '3 claras y 1 huevo entero en tortilla con pan integral tostado y aguacate.', cal: 420, p: 28, c: 40, f: 12 },
      'Comida': { title: 'Ternera Magra con Patata Asada y Ensalada', desc: '180g de filete de ternera magra con patata al horno y ensalada verde.', cal: 590, p: 48, c: 60, f: 15 },
      'Merienda': { title: 'Batido de Proteína con Frutos Secos', desc: 'Scoop de proteína con leche desnatada y 20g de almendras.', cal: 310, p: 30, c: 14, f: 14 },
      'Cena': { title: 'Merluza al Vapor con Verduras Salteadas', desc: '200g de lomos de merluza con wok de verduras y aceite de sésamo.', cal: 410, p: 42, c: 22, f: 10 }
    };

    setDailyMeals(dailyMeals.map(m => {
      if (m.id === mealId) {
        const alt = alternatives[m.type] || alternatives['Comida'];
        return { ...m, title: alt.title, description: alt.desc, calories: alt.cal, protein: alt.p, carbs: alt.c, fats: alt.f };
      }
      return m;
    }));
    alert('Comida regenerada y actualizada en tu plan nutricional.');
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
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: t.text, margin: '0 0 4px 0' }}>FitApp Pro 💪</h1>
            <p style={{ fontSize: '13px', color: t.textSecondary, margin: 0 }}>Selecciona tu perfil de atleta</p>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={dynamicStyles.secondaryButton}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <div style={dynamicStyles.card}>
          <h2 style={dynamicStyles.cardTitle}>🔐 Perfiles Seguros</h2>
          {profiles.map((prof) => (
            <div key={prof.id} style={{ ...dynamicStyles.listItem, flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '15px', color: t.text }}>{prof.name}</strong>
                  <p style={{ fontSize: '11px', color: t.textSecondary, margin: '2px 0 0 0' }}>Objetivo: {prof.goal} ({prof.level})</p>
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
            <button style={dynamicStyles.secondaryButton} onClick={() => setIsCreatingProfile(true)}>+ Crear Nuevo Perfil</button>
          ) : (
            <form onSubmit={handleCreateProfile}>
              <h2 style={dynamicStyles.cardTitle}>Nuevo Perfil de Atleta</h2>
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
  const estimated1RM = exerciseHistoryFiltered.length > 0 ? Math.round(maxWeightRegistered * (1 + 0.0333 * Math.max(...exerciseHistoryFiltered.map(h => h.reps)))) : 0;

  return (
    <div style={dynamicStyles.container}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: '700', color: t.text, margin: '0 0 2px 0' }}>FitApp Pro 💪</h1>
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
            <h2 style={dynamicStyles.cardTitle}>🎯 Panel de Control Diario</h2>
            <p style={{ fontSize: '13px', color: t.textSecondary, marginBottom: '12px' }}>
              Tu menú diario activo suma <strong>{totalCalories} kcal</strong> y <strong>{totalProtein}g de proteína</strong>. Todo sincronizado para tu objetivo ({currentProfile.goal}).
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={dynamicStyles.button} onClick={() => setActiveTab('entrenar')}>Entrenar 🚀</button>
              <button style={{ ...dynamicStyles.button, backgroundColor: '#10b981' }} onClick={() => setActiveTab('compra')}>Lista Compra 🛒</button>
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
            <h2 style={dynamicStyles.cardTitle}>🏋️ Registrar Serie y Rendimiento</h2>
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
          <h2 style={dynamicStyles.cardTitle}>🍽️ Menú Diario y Recetas</h2>
          {dailyMeals.map((meal) => (
            <div key={meal.id} style={{ ...dynamicStyles.listItem, flexDirection: 'column', alignItems: 'stretch', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', color: t.primary }}>{meal.type}</span>
                <span style={{ fontSize: '11px', color: t.textSecondary }}>{meal.calories} kcal</span>
              </div>
              <strong style={{ fontSize: '14px', color: t.text }}>{meal.title}</strong>
              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <button style={dynamicStyles.secondaryButton} onClick={() => setActiveMealModal(meal)}>Ver Receta 📖</button>
                <button style={{ ...dynamicStyles.secondaryButton, backgroundColor: isDarkMode ? '#1e3a8a' : '#e0f2fe', color: t.primary }} onClick={() => regenerateMeal(meal.id)}>🔄 Cambiar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🛒 5. LISTA DE LA COMPRA */}
      {activeTab === 'compra' && (
        <div style={dynamicStyles.card}>
          <h2 style={dynamicStyles.cardTitle}>🛒 Lista de la Compra Inteligente</h2>
          <p style={{ fontSize: '12px', color: t.textSecondary, marginBottom: '14px' }}>
            Generada automáticamente a partir de tu menú semanal. Organizada por secciones del supermercado.
          </p>

          <form onSubmit={addCustomShoppingItem} style={{ marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${t.border}` }}>
            <input type="text" placeholder="Añadir producto (ej. Tomates)..." value={newCustomItemName} onChange={(e) => setNewCustomItemName(e.target.value)} style={dynamicStyles.input} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="Cantidad (ej. 500g)" value={newCustomItemAmount} onChange={(e) => setNewCustomItemAmount(e.target.value)} style={{ ...dynamicStyles.input, margin: 0 }} />
              <select value={newCustomItemCat} onChange={(e) => setNewCustomItemCat(e.target.value as any)} style={{ ...dynamicStyles.input, margin: 0 }}>
                <option value="Frutas y Verduras">Frutas y Verduras</option>
                <option value="Carnicería / Pescadería">Carnicería / Pescadería</option>
                <option value="Lácteos y Huevos">Lácteos y Huevos</option>
                <option value="Despensa / Cereales">Despensa / Cereales</option>
              </select>
            </div>
            <button type="submit" style={{ ...dynamicStyles.button, marginTop: '8px', backgroundColor: '#10b981' }}>+ Añadir a la Compra</button>
          </form>

          {(['Frutas y Verduras', 'Carnicería / Pescadería', 'Lácteos y Huevos', 'Despensa / Cereales'] as const).map(category => {
            const itemsInCat = shoppingList.filter(item => item.category === category);
            if (itemsInCat.length === 0) return null;
            return (
              <div key={category} style={{ marginBottom: '14px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: '700', color: t.primary, marginBottom: '6px', textTransform: 'uppercase' }}>{category}</h3>
                {itemsInCat.map(item => (
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
            );
          })}
        </div>
      )}

      {/* 📈 6. PROGRESO Y GRÁFICOS */}
      {activeTab === 'progreso' && (
        <div style={dynamicStyles.card}>
          <h2 style={dynamicStyles.cardTitle}>📈 Gráficos de Evolución y 1RM</h2>
          <p style={{ fontSize: '12px', color: t.textSecondary, marginBottom: '12px' }}>
            Analiza tu progresión de cargas y estima tu repetición máxima teórica (1RM).
          </p>

          <select value={selectedExerciseForGraph} onChange={(e) => setSelectedExerciseForGraph(e.target.value)} style={dynamicStyles.input}>
            {Array.from(new Set(history.map(h => h.name))).map(exName => (
              <option key={exName} value={exName}>{exName}</option>
            ))}
          </select>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '14px 0' }}>
            <div style={{ backgroundColor: t.statBg, padding: '12px', borderRadius: '8px', textAlign: 'center', border: `1px solid ${t.border}` }}>
              <span style={{ fontSize: '18px', fontWeight: '700', color: t.primary }}>{maxWeightRegistered} kg</span>
              <p style={{ fontSize: '11px', color: t.textSecondary, margin: '2px 0 0 0' }}>Peso Máximo</p>
            </div>
            <div style={{ backgroundColor: t.statBg, padding: '12px', borderRadius: '8px', textAlign: 'center', border: `1px solid ${t.border}` }}>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>{estimated1RM} kg</span>
              <p style={{ fontSize: '11px', color: t.textSecondary, margin: '2px 0 0 0' }}>1RM Estimado</p>
            </div>
          </div>

          <h3 style={{ fontSize: '13px', fontWeight: '600', color: t.text, marginBottom: '8px' }}>Historial de Sesiones</h3>
          {exerciseHistoryFiltered.length === 0 ? (
            <p style={{ fontSize: '12px', color: t.textSecondary }}>No hay registros para este ejercicio.</p>
          ) : (
            exerciseHistoryFiltered.map((item, idx) => (
              <div key={idx} style={{ padding: '10px 0', borderBottom: `1px solid ${t.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '12px', color: t.textSecondary, display: 'block' }}>{item.date}</span>
                  <strong style={{ fontSize: '14px', color: t.text }}>{item.weight} kg × {item.reps} reps</strong>
                </div>
                <span style={{ fontSize: '12px', fontWeight: '600', color: t.primary, backgroundColor: t.statBg, padding: '4px 8px', borderRadius: '4px' }}>
                  Volumen: {item.weight * item.reps} kg
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* 👤 7. PERFIL Y COPIA DE SEGURIDAD (Fase 9 del Guion) */}
      {activeTab === 'perfil' && (
        <div>
          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>👤 Configuración de Atleta</h2>
            
            <form onSubmit={handleSaveProfileSettings}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: t.textSecondary, display: 'block', marginBottom: '4px' }}>Nombre del Atleta</label>
                <input type="text" value={currentProfile.name} disabled style={{ ...dynamicStyles.input, backgroundColor: t.statBg, opacity: 0.8 }} />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: t.textSecondary, display: 'block', marginBottom: '4px' }}>Objetivo Principal</label>
                <select value={editGoal} onChange={(e) => setEditGoal(e.target.value)} style={dynamicStyles.input}>
                  <option value="Ganar músculo">Ganar músculo (Hipertrofia)</option>
                  <option value="Perder grasa">Perder grasa (Definición)</option>
                  <option value="Ganar fuerza">Ganar fuerza máxima</option>
                  <option value="Resistencia y salud">Resistencia y salud general</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: t.textSecondary, display: 'block', marginBottom: '4px' }}>Nivel de Experiencia</label>
                <select value={editLevel} onChange={(e) => setEditLevel(e.target.value)} style={dynamicStyles.input}>
                  <option value="Principiante">Principiante</option>
                  <option value="Intermedio">Intermedio</option>
                  <option value="Avanzado">Avanzado</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: t.textSecondary, display: 'block', marginBottom: '6px' }}>Equipamiento Disponible</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Mancuernas', 'Barra', 'Bandas elásticas', 'Máquinas', 'Peso corporal'].map(eq => {
                    const isSelected = editEquipment.includes(eq);
                    return (
                      <button
                        type="button"
                        key={eq}
                        onClick={() => toggleEquipmentOption(eq)}
                        style={{
                          backgroundColor: isSelected ? t.primary : t.statBg,
                          color: isSelected ? '#ffffff' : t.text,
                          border: `1px solid ${isSelected ? t.primary : t.border}`,
                          padding: '6px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {isSelected ? '✓ ' : '+ '}{eq}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" style={dynamicStyles.button}>Guardar Cambios de Perfil</button>
            </form>
          </div>

          {/* Módulo de Copias de Seguridad (Fase 9) */}
          <div style={dynamicStyles.card}>
            <h2 style={dynamicStyles.cardTitle}>💾 Copia de Seguridad y Datos</h2>
            <p style={{ fontSize: '12px', color: t.textSecondary, marginBottom: '14px' }}>
              Exporta todos tus historiales, perfiles y listas de compra en un archivo JSON seguro o restaura una copia anterior.
            </p>

            <button style={{ ...dynamicStyles.button, backgroundColor: '#10b981', marginBottom: '10px' }} onClick={handleExportData}>
              📥 Exportar Datos (Backup JSON)
            </button>

            <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block', width: '100%' }}>
              <button style={{ ...dynamicStyles.secondaryButton, width: '100%', padding: '12px', textAlign: 'center', backgroundColor: isDarkMode ? '#334155' : '#e2e8f0' }}>
                📂 Restaurar Datos desde JSON
              </button>
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImportData} 
                style={{ position: 'absolute', left: 0, top: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} 
              />
            </div>

            <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: `1px solid ${t.border}` }}>
              <button style={dynamicStyles.secondaryButton} onClick={() => setCurrentProfile(null)}>🚪 Cambiar de Perfil / Bloquear</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Receta */}
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

      {/* Navegación Oficial de 7 Apartados */}
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
