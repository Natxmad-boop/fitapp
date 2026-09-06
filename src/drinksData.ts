export const DRINKS_DATABASE = [
  {
    id: "smoothie-fresa-platano",
    nombre: "Smoothie de fresa y plátano",
    categoria: "Smoothies",
    descripcion: "Un clásico cremoso, energético y lleno de sabor natural.",
    imagen: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "5 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 210,
    proteinas: 8,
    carbohidratos: 38,
    grasas: 3,
    etiquetas: ["sin azúcar añadido", "energía", "vegetariano"],
    objetivos: ["mantenimiento", "energía"],
    momentos: ["desayuno", "snack"],
    ingredientesSustituibles: "Puedes cambiar el yogur natural por yogur griego o kéfir.",
    ingredientes: [
      { nombre: "Fresas", cantidad: 150, unidad: "g" },
      { nombre: "Plátano", cantidad: 1, unidad: "unidad" },
      { nombre: "Leche o bebida vegetal", cantidad: 200, unidad: "ml" },
      { nombre: "Yogur natural", cantidad: 100, unidad: "g" },
      { nombre: "Hielo", cantidad: 3, unidad: "cubitos" }
    ],
    preparacion: [
      "Lavar y retirar los tallos de las fresas.",
      "Trocear el plátano e introducirlo en la batidora junto con las fresas.",
      "Añadir la leche y el yogur natural.",
      "Triturar a máxima potencia hasta obtener una textura suave y homogénea."
    ]
  },
  {
    id: "smoothie-tropical",
    nombre: "Smoothie tropical",
    categoria: "Smoothies",
    descripcion: "Bebida refrescante con toque exótico, ideal para la hidratación.",
    imagen: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "5 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 160,
    proteinas: 2,
    carbohidratos: 38,
    grasas: 1,
    etiquetas: ["hidratación", "refrescante", "vegano", "sin azúcar añadido"],
    objetivos: ["hidratación", "pérdida de grasa"],
    momentos: ["snack", "media mañana"],
    ingredientesSustituibles: "El agua de coco se puede sustituir por agua mineral con un toque de lima.",
    ingredientes: [
      { nombre: "Mango", cantidad: 100, unidad: "g" },
      { nombre: "Piña", cantidad: 100, unidad: "g" },
      { nombre: "Plátano", cantidad: 0.5, unidad: "unidad" },
      { nombre: "Agua de coco", cantidad: 200, unidad: "ml" }
    ],
    preparacion: [
      "Cortar el mango y la piña en dados.",
      "Colocar toda la fruta en la batidora junto con el agua de coco fría.",
      "Batir hasta que no queden grumos y servir al instante."
    ]
  },
  {
    id: "smoothie-frutos-rojos",
    nombre: "Smoothie de frutos rojos",
    categoria: "Smoothies",
    descripcion: "Cargado de antioxidantes y con un perfecto balance ácido-dulce.",
    imagen: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "4 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 185,
    proteinas: 6,
    carbohidratos: 32,
    grasas: 2,
    etiquetas: ["antioxidantes", "desayuno", "sin azúcar añadido"],
    objetivos: ["mantenimiento", "pérdida de grasa"],
    momentos: ["desayuno", "snack"],
    ingredientesSustituibles: "Usa frutos rojos congelados si no los tienes frescos.",
    ingredientes: [
      { nombre: "Frutos rojos", cantidad: 100, unidad: "g" },
      { nombre: "Plátano", cantidad: 0.5, unidad: "unidad" },
      { nombre: "Yogur natural", cantidad: 150, unidad: "g" },
      { nombre: "Leche", cantidad: 150, unidad: "ml" },
      { nombre: "Canela", cantidad: 1, unidad: "pizca" }
    ],
    preparacion: [
      "Añadir los frutos rojos y el medio plátano en el vaso de la batidora.",
      "Incorporar el yogur y la leche.",
      "Batir bien y espolvorear una pizca de canela antes de servir."
    ]
  },
  {
    id: "smoothie-verde",
    nombre: "Smoothie verde",
    categoria: "Smoothies",
    descripcion: "Nutritivo, depurativo y lleno de vitalidad para empezar el día.",
    imagen: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "5 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 130,
    proteinas: 3,
    carbohidratos: 26,
    grasas: 1,
    etiquetas: ["ligero", "refrescante", "vegano", "sin azúcar añadido"],
    objetivos: ["pérdida de grasa", "hidratación"],
    momentos: ["desayuno", "media mañana"],
    ingredientesSustituibles: "Puedes cambiar el agua por té verde frío.",
    ingredientes: [
      { nombre: "Kiwi", cantidad: 1, unidad: "unidad" },
      { nombre: "Manzana", cantidad: 0.5, unidad: "unidad" },
      { nombre: "Espinacas frescas", cantidad: 30, unidad: "g" },
      { nombre: "Pepino", cantidad: 0.5, unidad: "unidad" },
      { nombre: "Agua", cantidad: 200, unidad: "ml" },
      { nombre: "Zumo de limón", cantidad: 0.5, unidad: "unidad" }
    ],
    preparacion: [
      "Lavar bien las espinacas, el pepino y la manzana.",
      "Trocear la manzana y el kiwi.",
      "Poner todo en la batidora junto con el agua y el zumo de limón.",
      "Licuar a máxima potencia hasta lograr una textura líquida y homogénea."
    ]
  },
  {
    id: "smoothie-mango-yogur",
    nombre: "Smoothie de mango y yogur",
    categoria: "Smoothies",
    descripcion: "Textura sedosa y sabor tropical reconfortante.",
    imagen: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "4 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 195,
    proteinas: 7,
    carbohidratos: 36,
    grasas: 2,
    etiquetas: ["vegetariano", "snack"],
    objetivos: ["mantenimiento"],
    momentos: ["snack", "merienda"],
    ingredientesSustituibles: "Añade un toque de jengibre si buscas un contraste picante.",
    ingredientes: [
      { nombre: "Mango", cantidad: 150, unidad: "g" },
      { nombre: "Yogur natural", cantidad: 150, unidad: "g" },
      { nombre: "Leche", cantidad: 100, unidad: "ml" },
      { nombre: "Hielo", cantidad: 3, unidad: "cubitos" }
    ],
    preparacion: [
      "Cortar el mango en trozos.",
      "Añadir el mango, el yogur y la leche en la batidora.",
      "Batir hasta integrar completamente."
    ]
  },
  {
    id: "batido-chocolate-platano",
    nombre: "Batido de chocolate y plátano",
    categoria: "Batidos ricos en proteína",
    descripcion: "El aliado perfecto para recuperar energía tras un entrenamiento.",
    imagen: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "3 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 280,
    proteinas: 24,
    carbohidratos: 35,
    grasas: 4,
    etiquetas: ["alto en proteína", "post-entreno", "sin azúcar añadido"],
    objetivos: ["ganancia muscular", "mantenimiento"],
    momentos: ["post-entreno"],
    ingredientesSustituibles: "Usa proteína de chocolate o de sabor neutro.",
    ingredientes: [
      { nombre: "Plátano", cantidad: 1, unidad: "unidad" },
      { nombre: "Leche", cantidad: 250, unidad: "ml" },
      { nombre: "Proteína en polvo", cantidad: 25, unidad: "g" },
      { nombre: "Cacao puro", cantidad: 5, unidad: "g" }
    ],
    preparacion: [
      "Colocar la leche y el plátano troceado en la batidora.",
      "Agregar la proteína en polvo y el cacao puro.",
      "Batir enérgicamente hasta disolver por completo."
    ]
  },
  {
    id: "batido-vainilla-frutos-rojos",
    nombre: "Batido de vainilla y frutos rojos",
    categoria: "Batidos ricos en proteína",
    descripcion: "Dulce, proteico y refrescante.",
    imagen: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "3 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 240,
    proteinas: 22,
    carbohidratos: 28,
    grasas: 3,
    etiquetas: ["alto en proteína", "post-entreno"],
    objetivos: ["ganancia muscular"],
    momentos: ["post-entreno", "snack"],
    ingredientesSustituibles: "Compatible con leche de almendras sin azúcar.",
    ingredientes: [
      { nombre: "Leche", cantidad: 200, unidad: "ml" },
      { nombre: "Frutos rojos", cantidad: 100, unidad: "g" },
      { nombre: "Proteína de vainilla", cantidad: 25, unidad: "g" },
      { nombre: "Plátano", cantidad: 0.5, unidad: "unidad" }
    ],
    preparacion: [
      "Verter la leche en el vaso batidor.",
      "Añadir la proteína de vainilla, los frutos rojos y el medio plátano.",
      "Batir hasta obtener una textura homogénea."
    ]
  },
  {
    id: "batido-cafe-proteina",
    nombre: "Batido de café y proteína",
    categoria: "Batidos ricos en proteína",
    descripcion: "Doble función: energía del café y recuperación muscular.",
    imagen: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "3 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 180,
    proteinas: 23,
    carbohidratos: 12,
    grasas: 2,
    etiquetas: ["alto en proteína", "pre-entreno", "energía"],
    objetivos: ["ganancia muscular", "energía"],
    momentos: ["desayuno", "pre-entreno"],
    ingredientesSustituibles: "Usa café descafeinado si lo tomas por la tarde.",
    ingredientes: [
      { nombre: "Café frío", cantidad: 150, unidad: "ml" },
      { nombre: "Leche", cantidad: 150, unidad: "ml" },
      { nombre: "Proteína de vainilla", cantidad: 25, unidad: "g" },
      { nombre: "Hielo", cantidad: 4, unidad: "cubitos" }
    ],
    preparacion: [
      "Mezclar el café frío con la leche.",
      "Añadir la proteína de vainilla y los cubitos de hielo.",
      "Agitar en coctelera o batir brevemente."
    ]
  },
  {
    id: "batido-cacao-cacahuete",
    nombre: "Batido de cacao y crema de cacahuete",
    categoria: "Batidos ricos en proteína",
    descripcion: "Sabor intenso y saciante para después de entrenar duro.",
    imagen: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "3 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 320,
    proteinas: 28,
    carbohidratos: 15,
    grasas: 14,
    etiquetas: ["alto en proteína", "post-entreno"],
    objetivos: ["ganancia muscular"],
    momentos: ["post-entreno", "snack"],
    ingredientesSustituibles: "Crema de almendras como alternativa al cacahuete.",
    ingredientes: [
      { nombre: "Leche", cantidad: 250, unidad: "ml" },
      { nombre: "Proteína", cantidad: 25, unidad: "g" },
      { nombre: "Cacao puro", cantidad: 5, unidad: "g" },
      { nombre: "Crema de cacahuete", cantidad: 15, unidad: "g" }
    ],
    preparacion: [
      "Calentar ligeramente la leche si la crema de cacahuete está muy densa, o batir directamente.",
      "Añadir la proteína, el cacao y la crema de cacahuete.",
      "Batir hasta integrar por completo."
    ]
  },
  {
    id: "batido-yogur-platano",
    nombre: "Batido de yogur y plátano",
    categoria: "Batidos ricos en proteína",
    descripcion: "Cremoso, natural y con aporte proteico equilibrado.",
    imagen: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "3 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 250,
    proteinas: 15,
    carbohidratos: 34,
    grasas: 5,
    etiquetas: ["vegetariano", "snack"],
    objetivos: ["mantenimiento"],
    momentos: ["snack", "desayuno"],
    ingredientesSustituibles: "Yogur griego para mayor cremosidad.",
    ingredientes: [
      { nombre: "Yogur griego natural", cantidad: 150, unidad: "g" },
      { nombre: "Plátano", cantidad: 0.5, unidad: "unidad" },
      { nombre: "Leche", cantidad: 200, unidad: "ml" },
      { nombre: "Canela", cantidad: 1, unidad: "pizca" }
    ],
    preparacion: [
      "Incorporar todos los ingredientes en la batidora.",
      "Triturar hasta conseguir una textura uniforme.",
      "Servir con canela espolvoreada."
    ]
  },
  {
    id: "limonada-natural",
    nombre: "Limonada natural",
    categoria: "Bebidas refrescantes e hidratantes",
    descripcion: "Clásica, revitalizante y sin azúcares añadidos.",
    imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "4 min",
    dificultad: "Fácil",
    raciones: 2,
    calorias: 25,
    proteinas: 0,
    carbohidratos: 6,
    grasas: 0,
    etiquetas: ["refrescante", "hidratación", "vegano", "sin azúcar añadido"],
    objetivos: ["hidratación", "pérdida de grasa"],
    momentos: ["snack", "comida"],
    ingredientesSustituibles: "Añade hojas de hierbabuena para potenciar el frescor.",
    ingredientes: [
      { nombre: "Limón", cantidad: 1, unidad: "unidad" },
      { nombre: "Agua", cantidad: 500, unidad: "ml" },
      { nombre: "Hierbabuena", cantidad: 4, unidad: "hojas" },
      { nombre: "Edulcorante al gusto", cantidad: 1, unidad: "opcional" }
    ],
    preparacion: [
      "Exprimir el zumo del limón.",
      "Mezclar el zumo con el agua fría en una jarra.",
      "Añadir la hierbabuena y hielo al gusto."
    ]
  },
  {
    id: "agua-limon-pepino-menta",
    nombre: "Agua de limón, pepino y menta",
    categoria: "Bebidas refrescantes e hidratantes",
    descripcion: "Infusión fría detox perfecta para mantener la hidratación diaria.",
    imagen: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "5 min",
    dificultad: "Fácil",
    raciones: 2,
    calorias: 15,
    proteinas: 0,
    carbohidratos: 3,
    grasas: 0,
    etiquetas: ["hidratación", "refrescante", "vegano", "sin azúcar añadido"],
    objetivos: ["hidratación", "pérdida de grasa"],
    momentos: ["snack", "comida", "cena"],
    ingredientesSustituibles: "Dejar reposar en la nevera 30 minutos para mejor sabor.",
    ingredientes: [
      { nombre: "Agua", cantidad: 500, unidad: "ml" },
      { nombre: "Limón en rodajas", cantidad: 0.5, unidad: "unidad" },
      { nombre: "Pepino en rodajas", cantidad: 0.5, unidad: "unidad" },
      { nombre: "Hojas de menta", cantidad: 6, unidad: "hojas" }
    ],
    preparacion: [
      "Colocar las rodajas de limón, pepino y las hojas de menta en una jarra con agua.",
      "Refrigerar durante al menos 30 minutos antes de consumir."
    ]
  },
  {
    id: "agua-frutos-rojos",
    nombre: "Agua de frutos rojos",
    categoria: "Bebidas refrescantes e hidratantes",
    descripcion: "Agua aromatizada con un toque sutil a bayas silvestres.",
    imagen: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "3 min",
    dificultad: "Fácil",
    raciones: 2,
    calorias: 20,
    proteinas: 0,
    carbohidratos: 4,
    grasas: 0,
    etiquetas: ["hidratación", "refrescante", "vegano", "sin azúcar añadido"],
    objetivos: ["hidratación"],
    momentos: ["snack"],
    ingredientesSustituibles: "Machacar ligeramente los frutos rojos para que suelten el jugo.",
    ingredientes: [
      { nombre: "Agua", cantidad: 500, unidad: "ml" },
      { nombre: "Frutos rojos", cantidad: 50, unidad: "g" },
      { nombre: "Rodajas de limón", cantidad: 3, unidad: "unidades" },
      { nombre: "Menta", cantidad: 4, unidad: "hojas" }
    ],
    preparacion: [
      "Añadir los frutos rojos y el limón en una jarra con agua fría.",
      "Incorporar la menta y dejar infusionar en frío."
    ]
  },
  {
    id: "agua-naranja-jengibre",
    nombre: "Agua de naranja y jengibre",
    categoria: "Bebidas refrescantes e hidratantes",
    descripcion: "Aromática, digestiva y con un punto estimulante.",
    imagen: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "4 min",
    dificultad: "Fácil",
    raciones: 2,
    calorias: 25,
    proteinas: 0,
    carbohidratos: 5,
    grasas: 0,
    etiquetas: ["hidratación", "refrescante", "vegano", "sin azúcar añadido"],
    objetivos: ["hidratación", "energía"],
    momentos: ["media mañana", "snack"],
    ingredientesSustituibles: "Controla la cantidad de jengibre según te guste el picante.",
    ingredientes: [
      { nombre: "Agua", cantidad: 500, unidad: "ml" },
      { nombre: "Naranja en rodajas", cantidad: 0.5, unidad: "unidad" },
      { nombre: "Jengibre fresco rallado", cantidad: 5, unidad: "g" }
    ],
    preparacion: [
      "Cortar la naranja en rodajas finas.",
      "Rallar un poco de jengibre fresco.",
      "Mezclar con el agua en una jarra y dejar reposar."
    ]
  },
  {
    id: "bebida-sandia-lima",
    nombre: "Bebida de sandía y lima",
    categoria: "Bebidas refrescantes e hidratantes",
    descripcion: "Sumamente hidratante para los días calurosos.",
    imagen: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "5 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 80,
    proteinas: 1,
    carbohidratos: 18,
    grasas: 0,
    etiquetas: ["hidratación", "refrescante", "vegano", "sin azúcar añadido"],
    objetivos: ["hidratación", "pérdida de grasa"],
    momentos: ["snack"],
    ingredientesSustituibles: "La lima aporta un toque ácido perfecto que contrasta con la sandía.",
    ingredientes: [
      { nombre: "Sandía", cantidad: 200, unidad: "g" },
      { nombre: "Zumo de lima", cantidad: 0.5, unidad: "unidad" },
      { nombre: "Agua", cantidad: 150, unidad: "ml" },
      { nombre: "Hojas de menta", cantidad: 4, unidad: "hojas" }
    ],
    preparacion: [
      "Triturar la sandía junto con el agua y el zumo de lima.",
      "Servir muy fría con hojas de menta fresca."
    ]
  },
  {
    id: "cafe-con-canela",
    nombre: "Café con canela",
    categoria: "Bebidas calientes",
    descripcion: "Un clásico estimulante con el toque aromático de la canela.",
    imagen: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "2 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 15,
    proteinas: 1,
    carbohidratos: 2,
    grasas: 0,
    etiquetas: ["energía", "caliente", "sin azúcar añadido"],
    objetivos: ["energía", "pérdida de grasa"],
    momentos: ["desayuno", "pre-entreno"],
    ingredientesSustituibles: "Añade un chorrito de leche si lo prefieres cortado.",
    ingredientes: [
      { nombre: "Café preparado", cantidad: 1, unidad: "taza" },
      { nombre: "Canela en polvo", cantidad: 1, unidad: "pizca" },
      { nombre: "Leche o bebida vegetal", cantidad: 30, unidad: "ml (opcional)" }
    ],
    preparacion: [
      "Preparar una taza de café caliente.",
      "Espolvorear la canela por encima y remover bien."
    ]
  },
  {
    id: "chocolate-caliente-saludable",
    nombre: "Chocolate caliente saludable",
    categoria: "Bebidas calientes",
    descripcion: "Cremoso, reconfortante y elaborado con cacao 100% puro.",
    imagen: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "5 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 140,
    proteinas: 7,
    carbohidratos: 12,
    grasas: 6,
    etiquetas: ["caliente", "sin azúcar añadido", "vegetariano"],
    objetivos: ["mantenimiento"],
    momentos: ["merienda", "noche"],
    ingredientesSustituibles: "Usa bebida de avena o almendras.",
    ingredientes: [
      { nombre: "Leche o bebida vegetal", cantidad: 200, unidad: "ml" },
      { nombre: "Cacao puro en polvo", cantidad: 10, unidad: "g" },
      { nombre: "Canela", cantidad: 1, unidad: "pizca" },
      { nombre: "Edulcorante al gusto", cantidad: 1, unidad: "opcional" }
    ],
    preparacion: [
      "Calentar la leche en un cazo sin que llegue a hervir.",
      "Añadir el cacao puro y remover constantemente con unas varillas hasta disolver.",
      "Servir caliente con una pizca de canela."
    ]
  },
  {
    id: "leche-dorada",
    nombre: "Leche dorada",
    categoria: "Bebidas calientes",
    descripcion: "Bebida ayurvédica a base de cúrcuma con potentes propiedades antiinflamatorias.",
    imagen: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "6 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 150,
    proteinas: 6,
    carbohidratos: 14,
    grasas: 7,
    etiquetas: ["caliente", "vegetariano", "sin azúcar añadido"],
    objetivos: ["mantenimiento"],
    momentos: ["noche", "cena"],
    ingredientesSustituibles: "La pizca de pimienta negra es obligatoria para activar la curcumina.",
    ingredientes: [
      { nombre: "Leche o bebida vegetal", cantidad: 200, unidad: "ml" },
      { nombre: "Cúrcuma en polvo", cantidad: 0.5, unidad: "cucharadita" },
      { nombre: "Canela", cantidad: 1, unidad: "pizca" },
      { nombre: "Pimienta negra molida", cantidad: 1, unidad: "pizca pequeña" }
    ],
    preparacion: [
      "Calentar la leche en un cazo a fuego medio.",
      "Añadir la cúrcuma, la canela y la pimienta negra.",
      "Remover bien durante 3-5 minutos sin que hierva y servir caliente."
    ]
  },
  {
    id: "infusion-jengibre-limon",
    nombre: "Infusión de jengibre y limón",
    categoria: "Bebidas calientes",
    descripcion: "Ideal para calentar el cuerpo, calmar la garganta y activar la digestión.",
    imagen: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "5 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 10,
    proteinas: 0,
    carbohidratos: 2,
    grasas: 0,
    etiquetas: ["caliente", "vegano", "sin azúcar añadido", "ligero"],
    objetivos: ["pérdida de grasa", "hidratación"],
    momentos: ["desayuno", "noche"],
    ingredientesSustituibles: "Añade unas gotitas de limón al terminar.",
    ingredientes: [
      { nombre: "Agua", cantidad: 250, unidad: "ml" },
      { nombre: "Jengibre fresco", cantidad: 10, unidad: "g (rodajas)" },
      { nombre: "Zumo de limón", cantidad: 0.5, unidad: "unidad" }
    ],
    preparacion: [
      "Hervir el agua con las rodajas de jengibre durante 5 minutos.",
      "Retirar del fuego, añadir el zumo de limón y dejar reposar 2 minutos antes de tomar."
    ]
  },
  {
    id: "rooibos-canela-naranja",
    nombre: "Rooibos con canela y naranja",
    categoria: "Bebidas calientes",
    descripcion: "Infusión libre de teína, dulce de forma natural y muy reconfortante.",
    imagen: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "5 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 5,
    proteinas: 0,
    carbohidratos: 1,
    grasas: 0,
    etiquetas: ["caliente", "vegano", "sin azúcar añadido", "noche"],
    objetivos: ["mantenimiento"],
    momentos: ["noche", "merienda"],
    ingredientesSustituibles: "Excelente opción para relajarse antes de dormir.",
    ingredientes: [
      { nombre: "Infusión rooibos", cantidad: 1, unidad: "sobre o bolsita" },
      { nombre: "Agua", cantidad: 250, unidad: "ml" },
      { nombre: "Canela en rama", cantidad: 1, unidad: "pequeña" },
      { nombre: "Piel de naranja", cantidad: 1, unidad: "tira" }
    ],
    preparacion: [
      "Calentar el agua y añadir el rooibos, la canela y la piel de naranja.",
      "Dejar infusionar durante 5 minutos y colar."
    ]
  },
  {
    id: "smoothie-energetico-platano-avena",
    nombre: "Smoothie energético de plátano y avena",
    categoria: "Pre-entreno / energía",
    descripcion: "Carbohidratos complejos de absorción sostenida para dar el 100% en el entreno.",
    imagen: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "5 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 310,
    proteinas: 9,
    carbohidratos: 60,
    grasas: 4,
    etiquetas: ["pre-entreno", "energía", "vegetariano"],
    objetivos: ["ganancia muscular", "energía"],
    momentos: ["pre-entreno"],
    ingredientesSustituibles: "Tritura la avena previamente si buscas textura líquida.",
    ingredientes: [
      { nombre: "Plátano", cantidad: 1, unidad: "unidad" },
      { nombre: "Avena", cantidad: 20, unidad: "g" },
      { nombre: "Leche o bebida vegetal", cantidad: 200, unidad: "ml" },
      { nombre: "Canela", cantidad: 1, unidad: "pizca" }
    ],
    preparacion: [
      "Introducir la avena y el plátano troceado en la batidora.",
      "Añadir la leche y batir a alta velocidad hasta conseguir una consistencia cremosa."
    ]
  },
  {
    id: "smoothie-cafe-platano-cacao",
    nombre: "Smoothie de café, plátano y cacao",
    categoria: "Pre-entreno / energía",
    descripcion: "La combinación definitiva para activarte antes de ir al gimnasio.",
    imagen: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "4 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 230,
    proteinas: 6,
    carbohidratos: 45,
    grasas: 3,
    etiquetas: ["pre-entreno", "energía", "sin azúcar añadido"],
    objetivos: ["energía", "ganancia muscular"],
    momentos: ["pre-entreno"],
    ingredientesSustituibles: "Usa café soluble deshecho en agua fría si no tienes café preparado.",
    ingredientes: [
      { nombre: "Plátano", cantidad: 1, unidad: "unidad" },
      { nombre: "Café frío", cantidad: 150, unidad: "ml" },
      { nombre: "Leche", cantidad: 150, unidad: "ml" },
      { nombre: "Cacao puro", cantidad: 5, unidad: "g" }
    ],
    preparacion: [
      "Batir el plátano con el café frío y la leche.",
      "Añadir el cacao puro y mezclar hasta integrar."
    ]
  },
  {
    id: "smoothie-mango-platano",
    nombre: "Smoothie de mango y plátano",
    categoria: "Pre-entreno / energía",
    descripcion: "Aporte rápido de glucógeno gracias a sus azúcares naturales.",
    imagen: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "4 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 215,
    proteinas: 3,
    carbohidratos: 50,
    grasas: 1,
    etiquetas: ["pre-entreno", "vegano", "energía"],
    objetivos: ["energía"],
    momentos: ["pre-entreno"],
    ingredientesSustituibles: "Ideal con agua de coco.",
    ingredientes: [
      { nombre: "Mango", cantidad: 100, unidad: "g" },
      { nombre: "Plátano", cantidad: 0.5, unidad: "unidad" },
      { nombre: "Agua o bebida vegetal", cantidad: 200, unidad: "ml" }
    ],
    preparacion: [
      "Trocear el mango y el plátano.",
      "Licuar junto con el agua o bebida vegetal hasta obtener una textura suave."
    ]
  },
  {
    id: "batido-avena-frutos-rojos",
    nombre: "Batido de avena y frutos rojos",
    categoria: "Pre-entreno / energía",
    descripcion: "Sostenibilidad energética y antioxidantes en un solo vaso.",
    imagen: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "5 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 260,
    proteinas: 8,
    carbohidratos: 48,
    grasas: 3,
    etiquetas: ["pre-entreno", "energía"],
    objetivos: ["energía", "ganancia muscular"],
    momentos: ["pre-entreno", "desayuno"],
    ingredientesSustituibles: "Perfecto para tomar 1 hora antes de entrenar.",
    ingredientes: [
      { nombre: "Frutos rojos", cantidad: 100, unidad: "g" },
      { nombre: "Avena", cantidad: 20, unidad: "g" },
      { nombre: "Leche", cantidad: 200, unidad: "ml" },
      { nombre: "Plátano", cantidad: 0.5, unidad: "unidad" }
    ],
    preparacion: [
      "Poner todos los ingredientes en la batidora.",
      "Triturar bien hasta que la avena esté completamente integrada."
    ]
  },
  {
    id: "smoothie-manzana-canela",
    nombre: "Smoothie de manzana y canela",
    categoria: "Pre-entreno / energía",
    descripcion: "Sabor a tarta de manzana ligera y digestiva.",
    imagen: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "5 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 220,
    proteinas: 7,
    carbohidratos: 42,
    grasas: 2,
    etiquetas: ["pre-entreno", "energía"],
    objetivos: ["energía"],
    momentos: ["pre-entreno", "desayuno"],
    ingredientesSustituibles: "Usa manzana reineta o golden.",
    ingredientes: [
      { nombre: "Manzana", cantidad: 1, unidad: "unidad" },
      { nombre: "Leche", cantidad: 200, unidad: "ml" },
      { nombre: "Avena", cantidad: 20, unidad: "g" },
      { nombre: "Canela", cantidad: 1, unidad: "cucharadita" }
    ],
    preparacion: [
      "Lavar y trocear la manzana (puedes pelarla si lo prefieres).",
      "Batir junto con la leche, la avena y la canela hasta que quede homogéneo."
    ]
  },
  {
    id: "batido-ligero-frutos-rojos",
    nombre: "Batido ligero de frutos rojos",
    categoria: "Bebidas ligeras / noche",
    descripcion: "Bajo en calorías, saciante y perfecto para la última hora del día.",
    imagen: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "3 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 120,
    proteinas: 7,
    carbohidratos: 18,
    grasas: 2,
    etiquetas: ["ligero", "noche", "sin azúcar añadido"],
    objetivos: ["pérdida de grasa", "mantenimiento"],
    momentos: ["cena", "noche"],
    ingredientesSustituibles: "Puedes usar agua o hielo en lugar de leche para aligerarlo más.",
    ingredientes: [
      { nombre: "Frutos rojos", cantidad: 100, unidad: "g" },
      { nombre: "Yogur natural", cantidad: 150, unidad: "g" },
      { nombre: "Agua", cantidad: 100, unidad: "ml" },
      { nombre: "Canela", cantidad: 1, unidad: "pizca" }
    ],
    preparacion: [
      "Añadir los frutos rojos, el yogur y el agua en la batidora.",
      "Triturar hasta conseguir una textura ligera y servir con canela."
    ]
  },
  {
    id: "smoothie-kiwi-yogur",
    nombre: "Smoothie de kiwi y yogur",
    categoria: "Bebidas ligeras / noche",
    descripcion: "Aporte de vitamina C y digestión ligera antes de dormir.",
    imagen: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "3 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 115,
    proteinas: 6,
    carbohidratos: 20,
    grasas: 1,
    etiquetas: ["ligero", "noche", "vegetariano"],
    objetivos: ["pérdida de grasa"],
    momentos: ["noche", "cena"],
    ingredientesSustituibles: "Excelente para digestiones pesadas.",
    ingredientes: [
      { nombre: "Kiwi", cantidad: 1, unidad: "unidad" },
      { nombre: "Yogur natural", cantidad: 150, unidad: "g" },
      { nombre: "Agua", cantidad: 100, unidad: "ml" }
    ],
    preparacion: [
      "Pelar y trocear el kiwi.",
      "Batir junto con el yogur y el agua fría hasta integrar."
    ]
  },
  {
    id: "infusion-fria-frutos-rojos",
    nombre: "Infusión fría de frutos rojos",
    categoria: "Bebidas ligeras / noche",
    descripcion: "Refrescante, sin calorías y apta para cualquier momento nocturno.",
    imagen: "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "4 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 5,
    proteinas: 0,
    carbohidratos: 1,
    grasas: 0,
    etiquetas: ["ligero", "noche", "vegano", "sin azúcar añadido"],
    objetivos: ["pérdida de grasa", "hidratación"],
    momentos: ["noche", "cena"],
    ingredientesSustituibles: "Prepara la infusión caliente primero y déjala enfriar.",
    ingredientes: [
      { nombre: "Bolsita de infusión de frutos rojos", cantidad: 1, unidad: "unidad" },
      { nombre: "Agua caliente", cantidad: 200, unidad: "ml" },
      { nombre: "Hielo", cantidad: 4, unidad: "cubitos" },
      { nombre: "Rodaja de limón y menta", cantidad: 1, unidad: "opcional" }
    ],
    preparacion: [
      "Infusionar la bolsita en agua caliente durante 5 minutos.",
      "Dejar templar y verter sobre un vaso lleno de hielo con menta y limón."
    ]
  },
  {
    id: "leche-caliente-canela",
    nombre: "Leche caliente con canela",
    categoria: "Bebidas ligeras / noche",
    descripcion: "El remedio tradicional por excelencia para inducir al descanso.",
    imagen: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "3 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 110,
    proteinas: 6,
    carbohidratos: 10,
    grasas: 4,
    etiquetas: ["ligero", "noche", "caliente"],
    objetivos: ["mantenimiento"],
    momentos: ["noche"],
    ingredientesSustituibles: "Usa leche de almendras o avena si prefieres vegetal.",
    ingredientes: [
      { nombre: "Leche", cantidad: 200, unidad: "ml" },
      { nombre: "Canela en polvo", cantidad: 1, unidad: "pizca" },
      { nombre: "Vainilla", cantidad: 3, unidad: "gotas (opcional)" }
    ],
    preparacion: [
      "Calentar la leche en un cazo o microondas sin que hierva.",
      "Añadir la canela y unas gotitas de vainilla, remover y tomar templada."
    ]
  },
  {
    id: "infusion-manzanilla-canela",
    nombre: "Infusión de manzanilla y canela",
    categoria: "Bebidas ligeras / noche",
    descripcion: "Relajante digestiva con un toque cálido de canela.",
    imagen: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=500&auto=format&fit=crop&q=60",
    tiempoPreparacion: "4 min",
    dificultad: "Fácil",
    raciones: 1,
    calorias: 5,
    proteinas: 0,
    carbohidratos: 1,
    grasas: 0,
    etiquetas: ["ligero", "noche", "vegano", "sin azúcar añadido"],
    objetivos: ["pérdida de grasa"],
    momentos: ["noche", "cena"],
    ingredientesSustituibles: "Perfecta para cerrar el día.",
    ingredientes: [
      { nombre: "Bolsita de manzanilla", cantidad: 1, unidad: "unidad" },
      { nombre: "Agua caliente", cantidad: 250, unidad: "ml" },
      { nombre: "Canela en rama", cantidad: 0.5, unidad: "unidad" }
    ],
    preparacion: [
      "Verter agua hirviendo sobre la manzanilla y la ramita de canela.",
      "Dejar reposar tapado durante 5 minutos antes de consumir."
    ]
  }
];
