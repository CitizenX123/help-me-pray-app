import React, { useState, useEffect } from 'react';
import { Sun, Moon, Users, Sparkles, RefreshCw, User, Send, Utensils, Share2, Copy, MessageCircle, Facebook, Twitter, Smartphone, Instagram, Volume2, Play, Pause, Square, Settings, Crown, Book, Heart, UserCheck } from 'lucide-react';
import { supabase } from './supabaseClient';

// Add beautiful animated background CSS
const backgroundStyles = document.createElement('style');
backgroundStyles.textContent = `
  @keyframes curvedFlow {
    0%, 100% { 
      background-position: 0% 50%, 100% 50%, 50% 0%; 
    }
    33% { 
      background-position: 100% 0%, 0% 100%, 100% 50%; 
    }
    66% { 
      background-position: 100% 100%, 0% 0%, 50% 100%; 
    }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-10px) rotate(1deg); }
    66% { transform: translateY(5px) rotate(-1deg); }
  }
`;
document.head.appendChild(backgroundStyles);
// Force cache bust v2.6 - ACTUAL BACKGROUND IMAGE DEPLOYED - GITHUB SYNC TEST
// import { SubscriptionProvider } from './SubscriptionContext';
// import UnifiedUpgradeModal from './UnifiedUpgradeModal';
// import PremiumUpgradeModal from './PremiumUpgradeModal';

// Translation objects
const translations = {
  en: {
    appTitle: "Help Me Pray",
    appSubtitle: "Find inspiration and guidance through meaningful prayers",
    chooseCategory: "Choose a Category",
    generatePrayer: "Generate Prayer",
    generating: "Generating...",
    listen: "Listen",
    // Prayer categories
    gratitude: "Gratitude",
    morning: "Morning",
    bedtime: "Bedtime", 
    healing: "Healing",
    family: "Family & Friends",
    grace: "Grace",
    bibleVerses: "Bible Verse",
    custom: "Create Custom Prayer",
    // Prayer descriptions
    gratitudeDesc: "Prayers for thanksgiving and expressing appreciation",
    morningDesc: "Prayers to start your day with purpose and hope",
    bedtimeDesc: "Prayers for reflection, rest, and peaceful sleep",
    healingDesc: "Prayers for physical, emotional, and spiritual restoration",
    familyDesc: "Prayers for relationships and loved ones",
    graceDesc: "Dedicated to blessing the meals",
    bibleVersesDesc: "Prayers inspired by Scripture",
    customDesc: "Generate personalized prayers for any situation",
    // Login/Signup
    welcomeBack: "Welcome",
    createAccount: "Create Account",
    signIn: "Sign In",
    signUp: "Sign Up",
    continueWithGoogle: "Continue with Google",
    continueAsGuest: "Continue as Guest",
    fullName: "Full Name",
    emailAddress: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    enterFullName: "Enter your full name",
    enterEmail: "Enter your email",
    enterPassword: "Enter your password",
    confirmYourPassword: "Confirm your password",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    joinCommunity: "Join our prayer community",
    signInToContinue: "Sign in to begin your prayer journey",
    creatingAccount: "Creating Account...",
    signingIn: "Signing In...",
    // Prayer lengths
    briefBeautiful: "Brief & Beautiful",
    perfectlyTimed: "Perfectly Timed", 
    richMeaningful: "Rich & Meaningful",
    briefDesc: "A short, focused prayer (1 paragraph)",
    mediumDesc: "A perfectly timed prayer with good depth (2-3 paragraphs)",
    comprehensiveDesc: "A rich, meaningful prayer with extensive depth (4-5 paragraphs)",
    finalClosingShort: "In your holy name we pray, Amen.",
    finalClosingLong: "We offer this prayer in faith, believing in your goodness and love. In Jesus' name we pray, Amen.",
    comprehensiveMiddle1: "We come before you with humble hearts, acknowledging your sovereignty and grace in our lives.",
    comprehensiveMiddle2: "We trust in your perfect timing and your infinite wisdom, knowing that you work all things together for our good.",
    // Custom prayer templates
    addictionSelf: "Heavenly Father, I come to you broken and in desperate need of your healing power. Lord, I confess that I cannot overcome this addiction on my own - I need your divine intervention. Break the chains that bind me and set me free from this destructive cycle. Give me strength for each moment of temptation and surround me with people who will support my recovery. I trust in your power to make me new. Amen.",
    addictionOther: "Compassionate God, I come to you with a heavy heart, lifting up",
    addictionOther2: "who is battling addiction. Lord, you see the pain and bondage that they are experiencing. I ask for your divine intervention in",
    addictionOther3: "life. Break the chains that bind",
    addictionOther4: "and give",
    addictionOther5: "strength to overcome this destructive cycle. Surround",
    addictionOther6: "with people who will support",
    addictionOther7: "recovery journey with love and without judgment. We trust in your power to redeem and restore",
    generalSelf: "Dear God, I bring my heart and this request before you. Please hear my prayer and respond according to your perfect will and timing. Grant me faith to trust in your goodness, even when I cannot see the way forward. Fill me with your love, peace, and hope. Amen.",
    generalOther: "Loving Father, I lift up",
    generalOther2: "to you in prayer. Please hear this prayer and move in",
    generalOther3: "situation according to your perfect will. Bless",
    generalOther4: "with your presence and fill",
    generalOther5: "heart with hope. Surround",
    generalOther6: "with your love and the support of caring people. Amen.",
    inappropriateContent: "We're sorry, but your prayer request contains inappropriate content. Please revise your request to focus on positive, respectful language that honors the spirit of prayer.",
    inappropriateName: "We're sorry, but the name you entered contains inappropriate content. Please use a respectful name.",
    // Prayer history
    prayerHistory: "Prayer History",
    myPrayers: "My Prayers",
    loadingPrayers: "Loading your prayers...",
    noPrayers: "You haven't generated any prayers yet. Generate your first prayer to start building your history!",
    createdOn: "Created on",
    close: "Close",
    // Main app interface
    readyToGenerate: "Ready to generate a",
    prayer: "prayer",
    clickGenerate: "Click \"Generate Prayer\" to begin",
    readyToCreateCustom: "Ready to create your custom prayer",
    fillFormAndGenerate: "Fill out the form and click \"Generate Prayer\"",
    thisPlayerIs: "This prayer is for:",
    myself: "Myself",
    someoneElse: "Someone else",
    personName: "Person's name:",
    enterTheirName: "Enter their name...",
    specialOccasion: "Special occasion (optional):",
    selectOccasion: "Select an occasion (optional)",
    prayerLength: "Prayer length:",
    whatToPrayAbout: "What would you like to pray about?",
    describePrayer: "Describe your prayer here...",
    characters: "characters",
    mayThisPrayerBring: "May this prayer bring you peace and guidance"
  },
  es: {
    appTitle: "Ayúdame a Orar",
    appSubtitle: "Encuentra inspiración y guía a través de oraciones significativas",
    chooseCategory: "Elige una Categoría",
    generatePrayer: "Generar Oración",
    generating: "Generando...",
    listen: "Escuchar",
    // Prayer categories
    gratitude: "Gratitud",
    morning: "Mañana",
    bedtime: "Noche",
    healing: "Sanación",
    family: "Familia y Amigos",
    grace: "Bendición",
    bibleVerses: "Versículo Bíblico",
    custom: "Crear Oración Personalizada",
    // Prayer descriptions
    gratitudeDesc: "Oraciones de agradecimiento y expresión de aprecio",
    morningDesc: "Oraciones para comenzar tu día con propósito y esperanza",
    bedtimeDesc: "Oraciones para reflexión, descanso y sueño pacífico",
    healingDesc: "Oraciones para restauración física, emocional y espiritual",
    familyDesc: "Oraciones para relaciones y seres queridos",
    graceDesc: "Dedicado a bendecir las comidas",
    bibleVersesDesc: "Oraciones inspiradas en las Escrituras",
    customDesc: "Genera oraciones personalizadas para cualquier situación", 
    // Login/Signup
    welcomeBack: "Bienvenido",
    createAccount: "Crear Cuenta",
    signIn: "Iniciar Sesión",
    signUp: "Registrarse",
    continueWithGoogle: "Continuar con Google",
    continueAsGuest: "🙏 Continuar como Invitado",
    fullName: "Nombre Completo",
    emailAddress: "Dirección de Correo",
    password: "Contraseña",
    confirmPassword: "Confirmar Contraseña",
    enterFullName: "Ingresa tu nombre completo",
    enterEmail: "Ingresa tu correo electrónico",
    enterPassword: "Ingresa tu contraseña",
    confirmYourPassword: "Confirma tu contraseña",
    alreadyHaveAccount: "¿Ya tienes una cuenta?",
    dontHaveAccount: "¿No tienes una cuenta?",
    joinCommunity: "Únete a nuestra comunidad de oración",
    signInToContinue: "Inicia sesión para comenzar tu viaje de oración",
    creatingAccount: "Creando Cuenta...",
    signingIn: "Iniciando Sesión...",
    // Prayer lengths
    briefBeautiful: "Breve y Hermosa",
    perfectlyTimed: "Perfectamente Cronometrada",
    richMeaningful: "Rica y Significativa",
    briefDesc: "Una oración corta y enfocada (1 párrafo)",
    mediumDesc: "Una oración perfectamente cronometrada con buena profundidad (2-3 párrafos)",
    comprehensiveDesc: "Una oración rica y significativa con profundidad extensa (4-5 párrafos)",
    finalClosingShort: "En tu santo nombre oramos, Amén.",
    finalClosingLong: "Ofrecemos esta oración con fe, creyendo en tu bondad y amor. En el nombre de Jesús oramos, Amén.",
    comprehensiveMiddle1: "Venimos ante ti con corazones humildes, reconociendo tu soberanía y gracia en nuestras vidas.",
    comprehensiveMiddle2: "Confiamos en tu tiempo perfecto y tu sabiduría infinita, sabiendo que todas las cosas obran para nuestro bien.",
    // Custom prayer templates
    addictionSelf: "Padre Celestial, vengo ante ti quebrantado y necesitando desesperadamente tu poder sanador. Señor, confieso que no puedo superar esta adicción por mi cuenta - necesito tu intervención divina. Rompe las cadenas que me atan y libérame de este ciclo destructivo. Dame fuerza para cada momento de tentación y rodéame de personas que apoyen mi recuperación. Confío en tu poder para hacerme nuevo. Amén.",
    addictionOther: "Dios compasivo, vengo ante ti con el corazón pesado, elevando a",
    addictionOther2: "quien está luchando contra la adicción. Señor, tú ves el dolor y la esclavitud que está experimentando. Pido tu intervención divina en",
    addictionOther3: "vida. Rompe las cadenas que atan a",
    addictionOther4: "y dale",
    addictionOther5: "fuerza para superar este ciclo destructivo. Rodea a",
    addictionOther6: "con personas que apoyen",
    addictionOther7: "camino de recuperación con amor y sin juicio. Confiamos en tu poder para redimir y restaurar a",
    generalSelf: "Querido Dios, traigo mi corazón y esta petición ante ti. Por favor escucha mi oración y responde de acuerdo a tu perfecta voluntad y tiempo. Concédeme fe para confiar en tu bondad, incluso cuando no puedo ver el camino adelante. Lléname con tu amor, paz y esperanza. Amén.",
    generalOther: "Padre Amoroso, elevo a",
    generalOther2: "ante ti en oración. Por favor escucha esta oración y actúa en",
    generalOther3: "situación de acuerdo a tu perfecta voluntad. Bendice a",
    generalOther4: "con tu presencia y llena",
    generalOther5: "corazón con esperanza. Rodea a",
    generalOther6: "con tu amor y el apoyo de personas que se preocupan. Amén.",
    inappropriateContent: "Lo sentimos, pero tu petición de oración contiene contenido inapropiado. Por favor revisa tu petición para enfocarte en lenguaje positivo y respetuoso que honre el espíritu de la oración.",
    inappropriateName: "Lo sentimos, pero el nombre que ingresaste contiene contenido inapropiado. Por favor usa un nombre respetuoso.",
    // Prayer history
    prayerHistory: "Historial de Oraciones",
    myPrayers: "Mis Oraciones",
    loadingPrayers: "Cargando tus oraciones...",
    noPrayers: "Aún no has generado ninguna oración. ¡Genera tu primera oración para comenzar a construir tu historial!",
    createdOn: "Creado el",
    close: "Cerrar",
    // Main app interface
    readyToGenerate: "Listo para generar una oración de",
    prayer: "oración",
    clickGenerate: "Haz clic en \"Generar Oración\" para comenzar",
    readyToCreateCustom: "Listo para crear tu oración personalizada",
    fillFormAndGenerate: "Completa el formulario y haz clic en \"Generar Oración\"",
    thisPlayerIs: "Esta oración es para:",
    myself: "Yo mismo",
    someoneElse: "Otra persona",
    personName: "Nombre de la persona:",
    enterTheirName: "Ingresa su nombre...",
    specialOccasion: "Ocasión especial (opcional):",
    selectOccasion: "Selecciona una ocasión (opcional)",
    prayerLength: "Duración de la oración:",
    whatToPrayAbout: "¿Por qué te gustaría orar?",
    describePrayer: "Describe tu oración aquí...",
    characters: "caracteres",
    mayThisPrayerBring: "Que esta oración te traiga paz y guía"
  }
};

const HelpMePrayApp = ({ user, setUser }) => {
  // Mobile Screen Navigation State
  const [currentScreen, setCurrentScreen] = useState(user ? 'prayer-selection' : 'login');
  
  // Prayer App State
  const [selectedCategory, setSelectedCategory] = useState('gratitude');
  const [currentPrayerInfo, setCurrentPrayerInfo] = useState({ category: '', verseReference: '', customTopic: '' });
  
  // Clear prayer when category changes to force icon display
  useEffect(() => {
    setCurrentPrayer('');
  }, [selectedCategory]);

  // Screen Navigation Functions for Mobile
  const goToScreen = (screenName) => {
    setCurrentScreen(screenName);
  };

  // Update screen when user state changes
  useEffect(() => {
    if (!user) {
      setCurrentScreen('login');
    } else if (currentScreen === 'login') {
      setCurrentScreen('prayer-selection');
    }
  }, [user, currentScreen]);
  const [currentPrayer, setCurrentPrayer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSignUp, setShowSignUp] = useState(false);
  
  // Custom prayer form state
  const [customRequest, setCustomRequest] = useState('');
  const [prayerFor, setPrayerFor] = useState('myself');
  const [personName, setPersonName] = useState('');
  const [prayerLength, setPrayerLength] = useState('medium');
  const [selectedOccasion, setSelectedOccasion] = useState('');

  // Category icons and colors - defined at component level for global access
  const categoryIcons = {
    gratitude: <Heart size={28} style={{ color: '#60a5fa', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />,
    morning: <Sun size={28} style={{ color: '#eab308', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />,
    bedtime: <Moon size={28} style={{ color: '#a855f7', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />,
    healing: <Sparkles size={28} style={{ color: '#22c55e', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />,
    family: <Users size={28} style={{ color: '#ec4899', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />,
    grace: <Utensils size={28} style={{ color: '#f59e0b', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />,
    bibleVerses: <Book size={28} style={{ color: '#f97316', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />,
    custom: <img src="/prayhands.png" alt="Praying hands" style={{ width: '36px', height: '36px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5)) brightness(0) saturate(100%) invert(41%) sepia(72%) saturate(1815%) hue-rotate(165deg) brightness(95%) contrast(98%)' }} />
  };

  const categoryColors = {
    gratitude: "#60a5fa", // Brighter Blue - peaceful, thankful
    morning: "#eab308",   // Yellow - sunshine, new day
    bedtime: "#a855f7",   // Brighter Purple - calm, restful
    healing: "#22c55e",   // Green - growth, restoration
    family: "#ec4899",    // Pink/Rose - love, warmth
    grace: "#f59e0b",     // Gold - blessed, divine
    bibleVerses: "#f97316", // Orange - wisdom, enlightenment
    custom: "#06b6d4"     // Cyan - creativity, personalization
  };

  // Login/Signup form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [language, setLanguage] = useState(() => {
    // Load saved language preference or default to 'en'
    return localStorage.getItem('helpMePrayLanguage') || 'en';
  });
  
  // Translation helper function
  const t = (key) => translations[language][key] || translations.en[key];
  
  // Function to change language and save preference
  const changeLanguage = (newLanguage) => {
    console.log('Changing language to:', newLanguage);
    setLanguage(newLanguage);
    localStorage.setItem('helpMePrayLanguage', newLanguage);
  };
  
  // Prayer sharing state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareAnonymously, setShareAnonymously] = useState(false);
  
  // Prayer uniqueness tracking
  const [usedPrayers, setUsedPrayers] = useState(new Set());
  
  // Prayer history state
  const [showPrayerHistory, setShowPrayerHistory] = useState(false);
  const [prayerHistory, setPrayerHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const [recipientEmail, setRecipientEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [shareSuccess, setShareSuccess] = useState('');
  
  // Text-to-speech state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [speechRate, setSpeechRate] = useState(1);
  const [showVoiceSettings, setShowVoiceSettings] = useState(true);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  // Simplified voice system - removed Google and ElevenLabs due to cost
  const [ttsProvider, setTtsProvider] = useState('browser'); // Default to browser, premium users can upgrade
  const [useHumanVoice, setUseHumanVoice] = useState(false); // System vs Human-like toggle
  const [currentAudioBlob, setCurrentAudioBlob] = useState(null);
  const [audioElement, setAudioElement] = useState(null);

  // Subscription and usage tracking state
  const [userSession, setUserSession] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  
  // Set premium status for Google logged-in users
  useEffect(() => {
    console.log('Setting premium status - user:', user);
    if (user && user.id !== 'guest') {
      console.log('Google user detected, setting premium to true');
      setIsPremium(true); // Google logged-in users get premium features
    } else {
      console.log('Guest user or no user, setting premium to false');
      setIsPremium(false);
    }
  }, [user]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyPrayerCount, setDailyPrayerCount] = useState(0);
  const [guestPrayerCount, setGuestPrayerCount] = useState(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Guest prayer count management using localStorage
  const getGuestPrayerCount = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const storedData = localStorage.getItem('guestPrayerCount');
      
      if (storedData) {
        const { date, count } = JSON.parse(storedData);
        if (date === today) {
          return count;
        }
      }
      
      // Reset count for new day
      localStorage.setItem('guestPrayerCount', JSON.stringify({ date: today, count: 0 }));
      return 0;
    } catch (error) {
      console.error('Error getting guest prayer count:', error);
      return 0;
    }
  };

  const incrementGuestPrayerCount = () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const currentCount = getGuestPrayerCount();
      const newCount = currentCount + 1;
      localStorage.setItem('guestPrayerCount', JSON.stringify({ date: today, count: newCount }));
      setGuestPrayerCount(newCount);
    } catch (error) {
      console.error('Error incrementing guest prayer count:', error);
    }
  };

  // Download prayer as image function
  const downloadPrayerImage = async () => {
    if (!currentPrayer) {
      alert('Please generate a prayer first!');
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size with higher resolution
      canvas.width = 800;
      canvas.height = 1000;
      
      // Enable high-quality image rendering
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Create photo-realistic backgrounds using actual photographs
      const createPhotoRealisticBackground = async () => {
        // Generate random seed for uniqueness each time
        const randomSeed = Math.random();
        const timeStamp = Date.now();

        // Function to load and draw image on canvas - Safari compatible
        const loadAndDrawImage = (imageUrl) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            
            // Safari-specific: Add timeout and better error handling
            const timeoutId = setTimeout(() => {
              reject(new Error('Image load timeout'));
            }, 15000);
            
            img.onload = () => {
              clearTimeout(timeoutId);
              // Draw image to fill canvas while maintaining aspect ratio
              const canvasRatio = canvas.width / canvas.height;
              const imageRatio = img.width / img.height;
              
              let drawWidth, drawHeight, offsetX = 0, offsetY = 0;
              
              if (canvasRatio > imageRatio) {
                // Canvas is wider than image
                drawWidth = canvas.width;
                drawHeight = canvas.width / imageRatio;
                offsetY = (canvas.height - drawHeight) / 2;
              } else {
                // Canvas is taller than image
                drawHeight = canvas.height;
                drawWidth = canvas.height * imageRatio;
                offsetX = (canvas.width - drawWidth) / 2;
              }
              
              ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
              
              // Add subtle dark overlay for better text readability
              ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              
              resolve();
            };
            img.onerror = () => {
              clearTimeout(timeoutId);
              // Fallback to gradient if image fails to load
              const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
              gradient.addColorStop(0, '#87CEEB');
              gradient.addColorStop(1, '#4682B4');
              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              resolve();
            };
            
            // Safari-specific: Set crossOrigin after setting up handlers
            img.crossOrigin = 'anonymous';
            img.src = imageUrl;
          });
        };

        // Curated photo collections for each category - specific photorealistic images
        const photoCollections = {
          morning: [
            // SUNRISE scenes only - mountain, beach, field sunrises
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop&crop=center', // Mountain sunrise
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=1000&fit=crop&crop=center', // Beach sunrise over ocean
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=1000&fit=crop&crop=center', // Field sunrise
            'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&h=1000&fit=crop&crop=center'  // Lake sunrise reflection
          ],
          bedtime: [
            // STARRY NIGHT, MOON scenes - peaceful nighttime only
            'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&h=1000&fit=crop&crop=center', // Milky Way starry sky
            'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=800&h=1000&fit=crop&crop=center', // Starry night sky
            'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=1000&fit=crop&crop=center', // Moon and stars
            'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=1000&fit=crop&crop=center'  // Night landscape with stars
          ],
          family: [
            // FAMILY gathering spaces - parks, gardens, peaceful outdoor areas
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=1000&fit=crop&crop=center', // Peaceful garden path
            'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=1000&fit=crop&crop=center', // Family picnic area
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1000&fit=crop&crop=center', // Peaceful meadow
            'https://images.unsplash.com/photo-1515263487990-61b07816b132?w=800&h=1000&fit=crop&crop=center'  // Cozy outdoor family space
          ],
          healing: [
            // PEACEFUL FOREST paths, gentle nature healing scenes
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1000&fit=crop&crop=center', // Forest healing path
            'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=1000&fit=crop&crop=center', // Sunlight through healing trees
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=1000&fit=crop&crop=center', // Peaceful healing forest
            'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&h=1000&fit=crop&crop=center'  // Serene nature healing
          ],
          gratitude: [
            // GOLDEN WHEAT fields, harvest abundance, golden hour scenes
            'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=1000&fit=crop&crop=center', // Golden wheat field abundance
            'https://images.unsplash.com/photo-1574919995582-ca2b037ed3cc?w=800&h=1000&fit=crop&crop=center', // Harvest gratitude field
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=1000&fit=crop&crop=center', // Golden hour gratitude field
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=1000&fit=crop&crop=center'  // Abundant nature landscape
          ],
          bibleVerses: [
            // ANCIENT biblical landscapes, desert, Middle Eastern terrain, holy land
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1000&fit=crop&crop=center', // Desert biblical mountain
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1000&fit=crop&crop=center', // Ancient biblical path
            'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=800&h=1000&fit=crop&crop=center', // Holy land style terrain
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=1000&fit=crop&crop=center'  // Middle Eastern biblical landscape
          ]
        };

        // Select random photo from the category collection
        const categoryPhotos = photoCollections[selectedCategory] || photoCollections['morning'];
        const selectedPhoto = categoryPhotos[Math.floor(randomSeed * categoryPhotos.length)];
        
        try {
          await loadAndDrawImage(selectedPhoto);
        } catch (error) {
          console.warn('Failed to load photo, using fallback gradient:', error);
          // Fallback gradient
          const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          gradient.addColorStop(0, '#87CEEB');
          gradient.addColorStop(1, '#4682B4');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Photo background is already loaded above
      };

      // Create the background (wait for photo to load) - Safari compatible with timeout
      try {
        await Promise.race([
          createPhotoRealisticBackground(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Background generation timeout')), 20000)
          )
        ]);
      } catch (error) {
        console.warn('Background generation failed, using simple gradient:', error);
        // Simple fallback gradient for Safari compatibility
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Add elegant category title at the top
      let categoryTitle;
      
      // Use the same category names as in prayer view screen
      const categoryTitles = {
        gratitude: 'A Prayer for Gratitude',
        morning: 'A Prayer to Start Your Day', 
        bedtime: 'A Prayer for a Good Night',
        healing: 'A Prayer for Healing',
        family: 'A Prayer for Family and Friends',
        grace: 'A Prayer for Saying Grace',
        bibleVerses: 'A Bible Verse Prayer',
        custom: 'A Custom Prayer'
      };
      
      categoryTitle = categoryTitles[selectedCategory] || 'Prayer';
      
      // Create personalized titles for custom prayers
      if (selectedCategory === 'custom') {
        if (prayerFor === 'myself') {
          if (selectedOccasion && selectedOccasion !== 'none') {
            // Map occasion values to readable titles
            const occasionTitles = {
              'birthday': 'Birthday',
              'anniversary': 'Anniversary', 
              'graduation': 'Graduation',
              'wedding': 'Wedding',
              'newJob': 'New Job',
              'illness': 'Healing',
              'loss': 'Comfort',
              'travel': 'Safe Travel',
              'exams': 'Exams',
              'pregnancy': 'Pregnancy',
              'retirement': 'Retirement',
              'moving': 'New Home',
              'addiction': 'Recovery'
            };
            categoryTitle = `A Prayer For ${occasionTitles[selectedOccasion] || selectedOccasion}`;
          } else {
            categoryTitle = 'A Personal Prayer';
          }
        } else if (prayerFor === 'someone' && personName.trim()) {
          // Extract first name only for the title
          const firstName = personName.trim().split(' ')[0];
          if (selectedOccasion && selectedOccasion !== 'none') {
            const occasionTitles = {
              'birthday': 'Birthday',
              'anniversary': 'Anniversary',
              'graduation': 'Graduation', 
              'wedding': 'Wedding',
              'newJob': 'New Job',
              'illness': 'Healing',
              'loss': 'Comfort',
              'travel': 'Safe Travel',
              'exams': 'Exams',
              'pregnancy': 'Pregnancy',
              'retirement': 'Retirement',
              'moving': 'New Home',
              'addiction': 'Recovery'
            };
            categoryTitle = `A Prayer For ${firstName}'s ${occasionTitles[selectedOccasion] || selectedOccasion}`;
          } else {
            categoryTitle = `A Prayer For ${firstName}`;
          }
        } else {
          // Fallback for someone else without a name
          if (selectedOccasion && selectedOccasion !== 'none') {
            const occasionTitles = {
              'birthday': 'Birthday',
              'anniversary': 'Anniversary',
              'graduation': 'Graduation',
              'wedding': 'Wedding', 
              'newJob': 'New Job',
              'illness': 'Healing',
              'loss': 'Comfort',
              'travel': 'Safe Travel',
              'exams': 'Exams',
              'pregnancy': 'Pregnancy',
              'retirement': 'Retirement',
              'moving': 'New Home',
              'addiction': 'Recovery'
            };
            categoryTitle = `A Prayer For ${occasionTitles[selectedOccasion] || selectedOccasion}`;
          } else {
            categoryTitle = 'A Prayer For Someone Special';
          }
        }
      }
      
      // Extract creative titles for Bible verses
      else if (selectedCategory === 'bibleVerses') {
        const versePatterns = [
          {match: /plans to prosper you/i, title: "Plans to Prosper You"},
          {match: /plans.*hope.*future/i, title: "Hope and a Future"},
          {match: /fear not|do not fear/i, title: "Fear Not"},
          {match: /trust in the lord/i, title: "Trust in the Lord"},
          {match: /peace.*understanding/i, title: "Peace Beyond Understanding"},
          {match: /love.*never fails/i, title: "Love Never Fails"},
          {match: /refuge.*strength/i, title: "Refuge and Strength"},
          {match: /light.*darkness/i, title: "Light in Darkness"},
          {match: /joy.*morning/i, title: "Joy Comes in the Morning"},
          {match: /good shepherd/i, title: "The Good Shepherd"},
          {match: /valley.*shadow/i, title: "Through the Valley"},
          {match: /rest.*weary/i, title: "Rest for the Weary"},
          {match: /grace.*sufficient/i, title: "Sufficient Grace"},
          {match: /new mercies/i, title: "New Mercies"},
          {match: /eagles.*wings/i, title: "Wings Like Eagles"},
          {match: /mountains.*faith/i, title: "Faith Moves Mountains"},
          {match: /living water/i, title: "Living Water"},
          {match: /bread of life/i, title: "Bread of Life"},
          {match: /narrow.*gate/i, title: "The Narrow Gate"},
          {match: /pearl.*great price/i, title: "Pearl of Great Price"},
        ];
        
        for (let pattern of versePatterns) {
          if (pattern.match.test(currentPrayer)) {
            categoryTitle = pattern.title;
            break;
          }
        }
      }
      
      // Category-specific title styling - ENHANCED for better visibility
      ctx.textAlign = 'center';
      ctx.font = 'bold 64px Georgia, serif';  // Increased from 48px to 64px and made bold
      
      // Add elegant styling based on category
      switch(selectedCategory) {
        case 'morning':
          // Golden sunrise colors
          const morningTitleGradient = ctx.createLinearGradient(0, 40, 0, 100);
          morningTitleGradient.addColorStop(0, '#FFD700');
          morningTitleGradient.addColorStop(1, '#FFA500');
          ctx.fillStyle = morningTitleGradient;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';  // Darker shadow
          ctx.shadowBlur = 8;                      // Increased blur
          ctx.shadowOffsetX = 4;                   // Increased offset
          ctx.shadowOffsetY = 4;
          break;
          
        case 'bedtime':
          // Soft moonlight silver
          const bedtimeTitleGradient = ctx.createLinearGradient(0, 40, 0, 100);
          bedtimeTitleGradient.addColorStop(0, '#E6E6FA');
          bedtimeTitleGradient.addColorStop(1, '#C0C0C0');
          ctx.fillStyle = bedtimeTitleGradient;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          break;
          
        case 'healing':
          // Natural forest green
          const healingTitleGradient = ctx.createLinearGradient(0, 40, 0, 100);
          healingTitleGradient.addColorStop(0, '#98FB98');
          healingTitleGradient.addColorStop(1, '#228B22');
          ctx.fillStyle = healingTitleGradient;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          break;
          
        case 'gratitude':
          // Warm golden wheat
          const gratitudeTitleGradient = ctx.createLinearGradient(0, 40, 0, 100);
          gratitudeTitleGradient.addColorStop(0, '#F0E68C');
          gratitudeTitleGradient.addColorStop(1, '#DAA520');
          ctx.fillStyle = gratitudeTitleGradient;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';  // Darker shadow
          ctx.shadowBlur = 8;                      // Increased blur
          ctx.shadowOffsetX = 4;                   // Increased offset
          ctx.shadowOffsetY = 4;
          break;
          
        case 'family':
          // Peaceful blue waters
          const familyTitleGradient = ctx.createLinearGradient(0, 40, 0, 100);
          familyTitleGradient.addColorStop(0, '#87CEEB');
          familyTitleGradient.addColorStop(1, '#4682B4');
          ctx.fillStyle = familyTitleGradient;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
          ctx.shadowBlur = 5;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          break;
          
        case 'bibleVerses':
          // Ancient parchment
          const bibleTitleGradient = ctx.createLinearGradient(0, 40, 0, 100);
          bibleTitleGradient.addColorStop(0, '#F5DEB3');
          bibleTitleGradient.addColorStop(1, '#D2691E');
          ctx.fillStyle = bibleTitleGradient;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';  // Darker shadow
          ctx.shadowBlur = 8;                      // Increased blur
          ctx.shadowOffsetX = 4;                   // Increased offset
          ctx.shadowOffsetY = 4;
          break;
          
        default:
          ctx.fillStyle = 'white';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          break;
      }
      
      // Draw the category title with proper spacing from top
      ctx.fillText(categoryTitle, canvas.width / 2, 120);
      
      // Reset shadow for prayer text
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      
      // Clean prayer text first
      const cleanPrayer = currentPrayer
        .replace(/🙏/g, '') // Remove emoji
        .replace(/\.+/g, '.') // Fix multiple periods
        .replace(/\.\s*\./g, '.') // Remove duplicate periods with spaces
        .trim();
      
      // Calculate dynamic font size based on text length and available space
      const availableHeight = canvas.height - 280; // Reserve space for title (140px) and branding (140px)
      const textLength = cleanPrayer.length;
      const maxWidth = canvas.width - 120;
      
      let fontSize, lineHeight;
      
      // Dynamic font sizing based on prayer length
      if (textLength < 300) {
        // Short prayers - larger font
        fontSize = 28;
        lineHeight = 34;
      } else if (textLength < 600) {
        // Medium prayers - medium font
        fontSize = 24;
        lineHeight = 30;
      } else if (textLength < 1200) {
        // Long prayers - smaller font
        fontSize = 20;
        lineHeight = 26;
      } else {
        // Very long prayers - smallest font
        fontSize = 18;
        lineHeight = 24;
      }
      
      // Set font and styling
      ctx.font = `normal ${fontSize}px Georgia, serif`;
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      
      // Word wrap with current font size
      const words = cleanPrayer.split(' ');
      const lines = [];
      let currentLine = '';
      
      for (let word of words) {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine.trim());
      
      // Double-check if text fits in available height and adjust if needed
      let totalTextHeight = lines.length * lineHeight;
      
      // If text is still too tall, reduce font size further
      while (totalTextHeight > availableHeight && fontSize > 14) {
        fontSize -= 2;
        lineHeight = fontSize + 6;
        ctx.font = `normal ${fontSize}px Georgia, serif`;
        
        // Recalculate word wrap with new font size
        const newLines = [];
        let newCurrentLine = '';
        
        for (let word of words) {
          const testLine = newCurrentLine + word + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && newCurrentLine !== '') {
            newLines.push(newCurrentLine.trim());
            newCurrentLine = word + ' ';
          } else {
            newCurrentLine = testLine;
          }
        }
        newLines.push(newCurrentLine.trim());
        
        lines.length = 0;
        lines.push(...newLines);
        totalTextHeight = lines.length * lineHeight;
      }
      
      // Final calculation for positioning
      totalTextHeight = lines.length * lineHeight;
      const startY = 180 + (availableHeight - totalTextHeight) / 2;
      
      // Ensure text doesn't go below branding area
      const maxEndY = canvas.height - 140;
      const actualEndY = startY + totalTextHeight;
      
      // If text is too long, adjust starting position
      const adjustedStartY = actualEndY > maxEndY ? startY - (actualEndY - maxEndY) : startY;
      
      lines.forEach((line, index) => {
        // Clean the line to remove any unwanted emojis or characters
        const cleanLine = line
          .replace(/🙏/g, '') // Remove emoji
          .replace(/\.+/g, '.') // Fix multiple periods
          .replace(/\.\s*\./g, '.') // Remove duplicate periods with spaces
          .trim();
        ctx.fillText(cleanLine, canvas.width / 2, adjustedStartY + (index * lineHeight));
      });
      
      // Add branding with actual logo
      const addBrandingWithLogo = async () => {
        try {
          // Load the actual praying hands logo
          const logoImg = new Image();
          logoImg.src = '/prayhands.png';
          
          await new Promise((resolve, reject) => {
            logoImg.onload = resolve;
            logoImg.onerror = reject;
          });
          
          // Position logo and text at the bottom (properly centered)
          const brandingY = canvas.height - 60;
          const logoSize = 80; // Reduced from 120px for better proportions
          const brandingText = 'Help Me Pray App';
          
          // Measure text width for proper centering
          ctx.font = '18px Arial';
          const textWidth = ctx.measureText(brandingText).width;
          const spacing = 8; // Space between logo and text
          const totalWidth = logoSize + spacing + textWidth;
          
          // Center the entire branding group
          const startX = (canvas.width - totalWidth) / 2;
          
          // Draw logo with white filter
          // Create a temporary canvas to apply white filter to the logo
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = logoSize;
          tempCanvas.height = logoSize;
          
          // Enable high-quality rendering on temp canvas
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = 'high';
          
          // Draw logo on temp canvas
          tempCtx.drawImage(logoImg, 0, 0, logoSize, logoSize);
          
          // Apply white filter
          tempCtx.globalCompositeOperation = 'source-atop';
          tempCtx.fillStyle = 'white';
          tempCtx.fillRect(0, 0, logoSize, logoSize);
          
          // Draw the white-filtered logo on main canvas
          ctx.drawImage(tempCanvas, startX, brandingY - logoSize / 2, logoSize, logoSize);
          
          // Draw text next to logo
          ctx.fillStyle = 'white';
          ctx.textAlign = 'left';
          ctx.fillText(brandingText, startX + logoSize + spacing, brandingY + 5);
          
        } catch (error) {
          // Fallback to text-only branding if logo fails to load
          ctx.font = '18px Arial';
          ctx.fillStyle = 'white';
          ctx.textAlign = 'center';
          ctx.fillText('Help Me Pray App', canvas.width / 2, canvas.height - 60);
        }
      };
      
      await addBrandingWithLogo();
      
      // Download the image with descriptive filename
      const link = document.createElement('a');
      link.download = `${categoryTitle.replace(/\s+/g, '_')}_Prayer.png`;
      link.href = canvas.toDataURL();
      link.click();
      
    } catch (error) {
      console.error('Error generating prayer image:', error);
      alert('Error generating image. Please try again.');
    }
  };

  // Text cleanup function for prayer formatting
  const cleanupPrayerText = (text) => {
    if (!text) return '';
    
    let cleaned = text
      // Fix multiple spaces
      .replace(/\s+/g, ' ')
      // Fix spacing around punctuation
      .replace(/\s*([,.!?;:])\s*/g, '$1 ')
      // Remove space before periods at end of sentences
      .replace(/\s+\./g, '.')
      // Ensure sentences start with capital letters
      .replace(/(^|[.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase())
      // Fix common capitalization issues
      .replace(/\bgod\b/gi, 'God')
      .replace(/\bjesus\b/gi, 'Jesus')
      .replace(/\bchrist\b/gi, 'Christ')
      .replace(/\blord\b/gi, 'Lord')
      .replace(/\bamen\b/gi, 'Amen')
      .replace(/\bholy spirit\b/gi, 'Holy Spirit')
      .replace(/\bfather\b/gi, 'Father')
      // Fix apostrophes
      .replace(/'/g, "'")
      .replace(/'/g, "'")
      // Fix quotes
      .replace(/"/g, '"')
      .replace(/"/g, '"')
      // Ensure proper sentence ending
      .replace(/([^.!?])$/, '$1.')
      // Clean up any double periods
      .replace(/\.+/g, '.')
      // Clean up periods with spaces between them
      .replace(/\.\s*\.\s*/g, '.')
      // Remove trailing periods before Amen
      .replace(/\.\s*Amen\.$/g, ' Amen.')
      // Trim whitespace
      .trim();
    
    // Ensure first letter is capitalized
    if (cleaned.length > 0) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    
    return cleaned;
  };

  // Check for existing session on component mount
  useEffect(() => {
    const getSession = async () => {
      console.log('Getting session...');
      console.log('Current URL:', window.location.href);
      console.log('URL hash:', window.location.hash);
      
      if (!supabase) {
        console.log('No supabase client');
        setUserSession(null);
        setIsLoading(false);
        setLoading(false);
        return;
      }
      
      // If we have OAuth tokens in the URL, manually set the session
      if (window.location.hash.includes('access_token')) {
        console.log('OAuth tokens detected in URL, manually setting session...');
        
        // Parse tokens from URL hash
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          console.log('Setting session with tokens...');
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          console.log('Set session result:', data);
          console.log('Set session error:', error);
          
          if (data.session) {
            console.log('Session set successfully:', data.session.user.email);
            setUserSession(data.session);
            if (data.session?.user) {
              await checkUserSubscription(data.session.user.id);
              await getDailyPrayerCount(data.session.user.id);
            }
            setIsLoading(false);
            setLoading(false);
            
            // Clean up URL hash
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
          }
        }
      }
      
      try {
        console.log('Calling supabase.auth.getSession()');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session result:', session);
        console.log('Session error:', error);
        
        setUserSession(session);
        
        if (session?.user) {
          console.log('User found:', session.user.email);
          await checkUserSubscription(session.user.id);
          await getDailyPrayerCount(session.user.id);
        } else {
          console.log('No session user found');
          // Load guest prayer count if not logged in
          setGuestPrayerCount(getGuestPrayerCount());
        }
        setIsLoading(false);
        setLoading(false);
      } catch (error) {
        console.error('Error getting session:', error);
        setUserSession(null);
        setIsLoading(false);
        setLoading(false);
      }
    };

    getSession();
  }, []);

  // Watch for user changes from parent component
  useEffect(() => {
    if (user && user.id !== 'guest') {
      // Real authenticated user
      checkUserSubscription(user.id);
      getDailyPrayerCount(user.id);
    } else if (user && user.id === 'guest') {
      // Guest user
      setGuestPrayerCount(getGuestPrayerCount());
    }
  }, [user]);

  // No premium voice restrictions needed - ElevenLabs removed for cost reasons
  // Google and browser voices available to all users
  useEffect(() => {
    console.log('useEffect triggered - isPremium:', isPremium, 'ttsProvider:', ttsProvider);
    // All voice options now available to everyone (ElevenLabs removed due to cost)
  }, [isPremium, ttsProvider]);

  // Initialize text-to-speech voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      // Set default voice (prefer English voices)
      if (voices.length > 0 && !selectedVoice) {
        const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
        const preferredVoice = englishVoices.find(voice => 
          voice.name.includes('Samantha') || 
          voice.name.includes('Alex') || 
          voice.name.includes('Google')
        ) || englishVoices[0] || voices[0];
        setSelectedVoice(preferredVoice);
      }
    };

    loadVoices();
    
    // Some browsers load voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [selectedVoice]);

  // Dynamic prayer templates for generating unique prayers
  const prayerTemplates = {
    gratitude: {
      openings: [
        "Heavenly Father,",
        "Lord,",
        "God,",
        "Our Father,",
        "Dear Lord,",
        "Almighty God,"
      ],
      subjects: [
        "thank you for the gift of this new day and all the opportunities it brings",
        "I am grateful for the love that surrounds me, the roof over my head, and the food on my table",
        "thank you for my health, my family, and my ability to make a positive difference",
        "I give thanks for the simple joys and everyday miracles you provide",
        "thank you for your strength during difficult times and your presence in good times",
        "I appreciate the wisdom gained through life's experiences",
        "thank you for the beauty found in ordinary moments"
      ],
      closings: [
        "Help me to never take these blessings for granted.",
        "May I use these gifts wisely and with purpose.",
        "Guide me to share this abundance with others.",
        "Keep my heart open to recognize daily miracles.",
        "Let gratitude transform my perspective on life.",
        "May thankfulness be my constant companion."
      ]
    },
    morning: {
      openings: [
        "Lord,",
        "Heavenly Father,",
        "God,",
        "Our Father,",
        "Dear Lord,",
        "Almighty God,"
      ],
      subjects: [
        "as I begin this new day, fill my heart with hope and my mind with clarity",
        "grant me strength for today's challenges and wisdom for today's decisions",
        "help me to start this day with a grateful heart and an open mind",
        "guide my steps and help me be a source of light to others",
        "give me patience for difficulties and joy in small victories",
        "inspire me to live with intention and compassion today",
        "help me to be mindful of your presence throughout this day"
      ],
      closings: [
        "May I be present in each moment and kind in every interaction.",
        "Let me approach each task with patience and purpose.",
        "Help me to make this day meaningful and blessed.",
        "Guide me to spread positivity wherever I go today.",
        "May this day be filled with grace and growth.",
        "Let me be a blessing to all I encounter today."
      ]
    },
    bedtime: {
      openings: [
        "Lord,",
        "Heavenly Father,",
        "God,",
        "Our Father,",
        "Dear God,",
        "Father in Heaven,"
      ],
      subjects: [
        "as this day comes to a close, I reflect on the moments of grace and growth",
        "I release the worries and burdens of today into your loving care",
        "I find peace in your constant presence and faithful love",
        "I surrender my concerns to you and trust in your perfect plan",
        "I cherish the blessings this day has brought and seek your forgiveness",
        "thank you for carrying me through another day of life"
      ],
      closings: [
        "Grant me peaceful sleep and healing rest.",
        "May tomorrow bring new opportunities to serve and love.",
        "Help me wake refreshed and ready for a new day.",
        "Let your peace guard my heart and mind through the night.",
        "May I rest securely in your love and protection.",
        "Prepare my heart for tomorrow's possibilities."
      ]
    },
    healing: {
      openings: [
        "Lord,",
        "Divine Healer,",
        "God,",
        "Our Father,",
        "Heavenly Father,",
        "Great Physician,"
      ],
      subjects: [
        "grant healing to all who are suffering in body, mind, or spirit",
        "help me heal from past hurts and find the courage to forgive",
        "restore what is broken within me and around me",
        "bring comfort to the afflicted and strength to their caregivers",
        "mend the wounds that time alone cannot heal",
        "transform pain into wisdom and suffering into compassion"
      ],
      closings: [
        "Give me patience with the healing process and hope for better days.",
        "May I find strength in weakness and peace in the midst of storms.",
        "Help me trust in your perfect timing for restoration.",
        "Let healing flow through every part of my being.",
        "Grant me the serenity to accept what I cannot change.",
        "May your healing power work miracles in my life and others'."
      ]
    },
    family: {
      openings: [
        "Lord,",
        "Heavenly Father,",
        "God,",
        "Our Father,",
        "Dear God,",
        "Creator of families,"
      ],
      subjects: [
        "bless my family with love, understanding, and unity",
        "watch over my friends and loved ones wherever they may be",
        "help me be a better family member and friend",
        "strengthen the bonds between those I hold dear",
        "bring healing to broken relationships in my family",
        "protect my loved ones from harm and surround them with your love"
      ],
      closings: [
        "Help us support each other through life's joys and challenges.",
        "Give me patience, kindness, and wisdom in all my relationships.",
        "May our family be a source of strength and encouragement.",
        "Let love be the foundation of all our interactions.",
        "Help me to forgive quickly and love unconditionally.",
        "May our relationships reflect your love and grace."
      ]
    },
    grace: {
      openings: [
        "Lord,",
        "God,",
        "Our Father,",
        "Heavenly Father,",
        "Dear Lord,",
        "Almighty God,"
      ],
      subjects: [
        "we thank you for this meal and the hands that prepared it",
        "bless this food to our bodies and our fellowship to your glory",
        "we are grateful for your provision and the abundance before us",
        "thank you for bringing us together around this table",
        "bless those who do not have enough and help us to share",
        "we acknowledge that every good gift comes from you",
        "thank you for the farmers, workers, and all who made this meal possible",
        "we gather in gratitude for your daily provision",
        "bless this nourishment you have provided for our bodies"
      ],
      closings: [
        "May this food nourish our bodies and strengthen us to serve you.",
        "Use us to be a blessing to others as you have blessed us.",
        "Help us to always remember those in need.",
        "May our gratitude overflow into acts of kindness.",
        "Bless this time of fellowship and conversation.",
        "Thank you for your constant care and provision.",
        "Let us never take your blessings for granted.",
        "Guide us to share your love with others."
      ]
    },
    bibleVerses: {
      openings: [
        "Heavenly Father,",
        "Lord,",
        "God,",
        "Our Father,",
        "Dear Lord,",
        "Almighty God,"
      ],
      subjects: [
        "your word is a lamp unto my feet and a light unto my path",
        "help me to hide your word in my heart that I might not sin against you",
        "let your scriptures guide my thoughts and actions today",
        "may your promises bring comfort to my troubled heart",
        "thank you for the wisdom and truth found in your holy word",
        "help me to meditate on your teachings day and night",
        "let your word transform my mind and renew my spirit",
        "may the truth of your scriptures set me free from fear and doubt"
      ],
      closings: [
        "May your word dwell richly within me.",
        "Help me to live according to your scriptural truths.",
        "Let your promises anchor my hope in uncertain times.",
        "Guide me by the light of your holy word.",
        "May your scriptures bring peace to my soul.",
        "Help me to share your word with others through my life."
      ]
    }
  };

  // Spanish prayer templates
  const prayerTemplatesSpanish = {
    gratitude: {
      openings: [
        "Padre Celestial,",
        "Señor,",
        "Dios,",
        "Padre Nuestro,",
        "Querido Señor,",
        "Dios Todopoderoso,"
      ],
      subjects: [
        "te doy gracias por el regalo de este nuevo día y todas las oportunidades que trae",
        "estoy agradecido por el amor que me rodea, el techo sobre mi cabeza y la comida en mi mesa",
        "te agradezco por mi salud, mi familia y mi capacidad de hacer una diferencia positiva",
        "doy gracias por las alegrías simples y los milagros cotidianos que proporcionas",
        "te agradezco por tu fuerza durante los tiempos difíciles y tu presencia en los buenos momentos",
        "aprecio la sabiduría ganada a través de las experiencias de la vida",
        "te agradezco por la belleza encontrada en los momentos ordinarios"
      ],
      closings: [
        "Ayúdame a nunca dar por sentadas estas bendiciones.",
        "Que pueda usar estos dones sabiamente y con propósito.",
        "Guíame para compartir esta abundancia con otros.",
        "Mantén mi corazón abierto para reconocer los milagros diarios.",
        "Que la gratitud transforme mi perspectiva de la vida.",
        "Que el agradecimiento sea mi compañero constante."
      ]
    },
    morning: {
      openings: [
        "Señor,",
        "Padre Celestial,",
        "Dios,",
        "Padre Nuestro,",
        "Querido Señor,",
        "Dios Todopoderoso,"
      ],
      subjects: [
        "al comenzar este nuevo día, llena mi corazón de esperanza y mi mente de claridad",
        "concédeme fuerza para los desafíos de hoy y sabiduría para las decisiones de hoy",
        "ayúdame a comenzar este día con un corazón agradecido y una mente abierta",
        "guía mis pasos y ayúdame a ser una fuente de luz para otros",
        "dame paciencia para las dificultades y alegría en las pequeñas victorias",
        "inspírame a vivir con intención y compasión hoy",
        "ayúdame a ser consciente de tu presencia durante este día"
      ],
      closings: [
        "Que pueda estar presente en cada momento y ser amable en cada interacción.",
        "Déjame abordar cada tarea con paciencia y propósito.",
        "Ayúdame a hacer este día significativo y bendecido.",
        "Guíame para esparcir positividad donde quiera que vaya hoy.",
        "Que este día esté lleno de gracia y crecimiento.",
        "Déjame ser una bendición para todos los que encuentre hoy."
      ]
    },
    bedtime: {
      openings: [
        "Señor,",
        "Padre Celestial,",
        "Dios,",
        "Padre Nuestro,",
        "Querido Dios,",
        "Padre en el Cielo,"
      ],
      subjects: [
        "al terminar este día, reflexiono sobre los momentos de gracia y crecimiento",
        "entrego las preocupaciones y cargas de hoy a tu cuidado amoroso",
        "encuentro paz en tu presencia constante y amor fiel",
        "entrego mis preocupaciones a ti y confío en tu plan perfecto",
        "atesoro las bendiciones que este día ha traído y busco tu perdón",
        "te agradezco por llevarme a través de otro día de vida"
      ],
      closings: [
        "Concédeme un sueño tranquilo y descanso reparador.",
        "Que mañana traiga nuevas oportunidades para servir y amar.",
        "Ayúdame a despertar renovado y listo para un nuevo día.",
        "Que tu paz guarde mi corazón y mente durante la noche.",
        "Que pueda descansar seguro en tu amor y protección.",
        "Prepara mi corazón para las posibilidades del mañana."
      ]
    },
    family: {
      openings: [
        "Padre Amoroso,",
        "Señor,",
        "Dios,",
        "Padre Celestial,",
        "Querido Dios,",
        "Padre Nuestro,"
      ],
      subjects: [
        "te agradezco por el regalo de la familia y los lazos que nos unen",
        "bendice a cada miembro de mi familia con salud y felicidad",
        "ayúdanos a crecer juntos en amor y comprensión",
        "protege a mis seres queridos donde quiera que estén",
        "guía nuestras conversaciones y fortalece nuestras relaciones",
        "que nuestro hogar sea un refugio de paz y amor"
      ],
      closings: [
        "Que el amor una nuestros corazones como uno solo.",
        "Bendice nuestras tradiciones familiares y crea nuevos recuerdos.",
        "Ayúdanos a apoyarnos mutuamente en todas las estaciones de la vida.",
        "Que la gracia abunde en nuestras interacciones diarias.",
        "Protege y guía a nuestra familia con tu mano amorosa.",
        "Que nuestro amor familiar refleje tu amor por nosotros."
      ]
    },
    grace: {
      openings: [
        "Señor,",
        "Dios,",
        "Padre Nuestro,",
        "Padre Celestial,",
        "Querido Señor,",
        "Dios Todopoderoso,"
      ],
      subjects: [
        "te agradecemos por esta comida y las manos que la prepararon",
        "bendice este alimento para nuestros cuerpos y nuestra comunión para tu gloria",
        "estamos agradecidos por tu provisión y la abundancia ante nosotros",
        "gracias por reunirnos alrededor de esta mesa",
        "bendice a los que no tienen suficiente y ayúdanos a compartir",
        "reconocemos que todo buen don viene de ti",
        "gracias por los agricultores, trabajadores, y todos los que hicieron posible esta comida",
        "nos reunimos en gratitud por tu provisión diaria",
        "bendice este alimento que has provisto para nuestros cuerpos"
      ],
      closings: [
        "Que esta comida nutra nuestros cuerpos y nos fortalezca para servirte.",
        "Úsanos para ser una bendición para otros como tú nos has bendecido.",
        "Ayúdanos a recordar siempre a los necesitados.",
        "Que nuestra gratitud se desborde en actos de bondad.",
        "Bendice este tiempo de comunión y conversación.",
        "Gracias por tu cuidado y provisión constantes.",
        "No nos permitas dar por sentadas tus bendiciones.",
        "Guíanos para compartir tu amor con otros."
      ]
    },
    healing: {
      openings: [
        "Señor,",
        "Divino Sanador,",
        "Dios,",
        "Padre Nuestro,",
        "Padre Celestial,",
        "Gran Médico,"
      ],
      subjects: [
        "concede sanidad a todos los que sufren en cuerpo, mente o espíritu",
        "ayúdame a sanar de heridas pasadas y encuentra el valor para perdonar",
        "restaura lo que está roto dentro de mí y a mi alrededor",
        "trae consuelo a los afligidos y fuerza a sus cuidadores",
        "sana las heridas que el tiempo solo no puede curar",
        "transforma el dolor en sabiduría y el sufrimiento en compasión"
      ],
      closings: [
        "Dame paciencia con el proceso de sanación y esperanza para días mejores.",
        "Que pueda encontrar fuerza en la debilidad y paz en medio de las tormentas.",
        "Ayúdame a confiar en tu tiempo perfecto para la restauración.",
        "Deja que la sanación fluya a través de cada parte de mi ser.",
        "Concédeme la serenidad para aceptar lo que no puedo cambiar.",
        "Que tu poder sanador obre milagros en mi vida y en la de otros."
      ]
    },
    bibleVerses: {
      openings: [
        "Padre Celestial,",
        "Señor,",
        "Dios,",
        "Padre Nuestro,",
        "Querido Señor,",
        "Dios Todopoderoso,"
      ],
      subjects: [
        "tu palabra es lámpara a mis pies y lumbrera a mi camino",
        "ayúdame a guardar tu palabra en mi corazón para no pecar contra ti",
        "que tus escrituras guíen mis pensamientos y acciones hoy",
        "que tus promesas traigan consuelo a mi corazón turbado",
        "gracias por la sabiduría y verdad encontradas en tu santa palabra",
        "ayúdame a meditar en tus enseñanzas día y noche",
        "que tu palabra transforme mi mente y renueve mi espíritu",
        "que la verdad de tus escrituras me libere del temor y la duda"
      ],
      closings: [
        "Que tu palabra more abundantemente en mí.",
        "Ayúdame a vivir según tus verdades bíblicas.",
        "Que tus promesas anclen mi esperanza en tiempos inciertos.",
        "Guíame por la luz de tu santa palabra.",
        "Que tus escrituras traigan paz a mi alma.",
        "Ayúdame a compartir tu palabra con otros a través de mi vida."
      ]
    }
  };

  // Function to ensure prayer uniqueness
  const generateUniquePrayer = (generatorFunction, maxAttempts = 10) => {
    let attempts = 0;
    let prayer = '';
    
    do {
      prayer = generatorFunction();
      attempts++;
      
      // Simple uniqueness - if we hit max attempts, just use current prayer
      if (attempts >= maxAttempts) {
        break;
      }
    } while (usedPrayers.has(prayer) && attempts < maxAttempts);
    
    // Add the new prayer to used prayers
    setUsedPrayers(prev => new Set([...prev, prayer]));
    
    return prayer;
  };

  // Internal prayer generator (called by uniqueness checker)
  const generatePrayerInternal = (category, length = 'medium') => {
    try {
    // Special handling for Bible Verses category
    if (category === 'bibleVerses') {
      const bibleVerses = [
        {
          verse: "And we know that God causes everything to work together for the good of those who love God and are called according to his purpose for them.",
          reference: "Romans 8:28 (NLT)",
          theme: "God's sovereignty and purpose",
          prayer: "Heavenly Father, thank you for this beautiful promise that you are working in all circumstances of our lives. When we face uncertainty or difficulty, help us remember that you have a purpose and plan. Give us the faith to trust in your goodness even when we cannot see the outcome. May we find peace knowing that you are weaving all things together for our good and your glory. In Jesus' name, Amen."
        },
        {
          verse: "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.",
          reference: "Zephaniah 3:17 (NLT)",
          theme: "God's love and presence",
          prayer: "Lord, what a wonderful truth that you delight in us and rejoice over us with singing! When we feel alone or unworthy, remind us of your constant presence and unconditional love. Help us to hear your songs of joy over our lives, even in the quiet moments. Fill our hearts with the assurance that we are treasured by you, our Mighty Warrior and Savior. Amen."
        },
        {
          verse: "Give all your worries and cares to God, for he cares about you.",
          reference: "1 Peter 5:7 (NLT)",
          theme: "God's care and peace",
          prayer: "Caring Father, we come to you carrying the weight of our worries and fears. This verse reminds us that we don't have to bear these burdens alone. You invite us to give our worries and cares to you because you truly care for us. Help us to let go of the things that trouble our hearts and minds. Replace our anxiety with your perfect peace, and help us to trust in your loving care for every detail of our lives. Amen."
        },
        {
          verse: "For I know the plans I have for you,\" declares the Lord, \"plans to prosper you and not to harm you, plans to give you hope and a future.",
          reference: "Jeremiah 29:11 (NLT)",
          theme: "God's plans and hope",
          prayer: "Gracious God, thank you for having plans for our lives that are filled with hope and purpose. When we are uncertain about the future or questioning our path, help us to remember that you have good plans for us. Give us patience to wait for your timing and wisdom to follow your guidance. May we find courage in knowing that our future is secure in your loving hands. Amen."
        },
        {
          verse: "He heals the brokenhearted and bandages their wounds.",
          reference: "Psalm 147:3 (NLT)",
          theme: "God's healing and comfort",
          prayer: "Healing God, you see every broken heart and every wound that life has inflicted upon us. This verse assures us that you are the great healer who tenderly cares for our pain. Come and heal the places in our hearts that are broken. Bandage our wounds with your love and mercy. Help us to find comfort in your presence and hope in your promise of restoration. Thank you for being close to the brokenhearted. Amen."
        },
        {
          verse: "Be strong and courageous! Do not be afraid or discouraged. For the Lord your God is with you wherever you go.",
          reference: "Joshua 1:9 (NLT)",
          theme: "God's presence and courage",
          prayer: "Mighty God, when we face challenges that seem overwhelming, this verse reminds us to be strong and courageous. Help us to remember that we are never alone because you are always with us. When fear tries to paralyze us or discouragement weighs us down, fill us with your strength and courage. May we walk boldly into each day knowing that you go before us and beside us wherever we go. Amen."
        },
        {
          verse: "Don't worry about anything; instead, pray about everything. Tell God what you need, and thank him for all he has done.",
          reference: "Philippians 4:6 (NLT)",
          theme: "Prayer and gratitude over worry",
          prayer: "Gracious God, you call us to bring everything to you in prayer rather than carrying the burden of worry. Help us to remember that you want to hear about all our needs, both big and small. Teach us to approach you with thankful hearts, remembering all the ways you have provided for us in the past. When worry tries to overwhelm us, redirect our hearts to pray and give thanks. Thank you for the peace that comes from trusting in you. Amen."
        },
        {
          verse: "And I am convinced that nothing can ever separate us from God's love. Neither death nor life, neither angels nor demons, neither our fears for today nor our worries about tomorrow—not even the powers of hell can separate us from God's love. Nothing in all creation will ever be able to separate us from the love of God that is revealed in Christ Jesus our Lord.",
          reference: "Romans 8:38-39 (NLT)",
          theme: "God's unending love",
          prayer: "Faithful God, what an incredible promise that nothing can separate us from your love! When we feel distant from you or doubt our worth, help us to remember this unshakeable truth. No mistake we've made, no fear we carry, no circumstance we face can diminish your love for us. Give us confidence to rest in this eternal love that surrounds us always. May we live with the freedom and joy that comes from knowing we are forever held in your love. Amen."
        }
      ];

      const randomVerse = bibleVerses[Math.floor(Math.random() * bibleVerses.length)];
      
      if (length === 'brief') {
        return `"${randomVerse.verse}" - ${randomVerse.reference}
        
This verse reminds us of ${randomVerse.theme}. ${randomVerse.prayer}`;
      } else if (length === 'medium') {
        return `"${randomVerse.verse}" - ${randomVerse.reference}
        
This beautiful verse speaks to us about ${randomVerse.theme}. In times of uncertainty and challenge, God's Word provides the foundation we need for hope and strength.

${randomVerse.prayer}`;
      } else {
        return `"${randomVerse.verse}" - ${randomVerse.reference}
        
This powerful verse illuminates the truth about ${randomVerse.theme}. Throughout Scripture, we see God's consistent character of love, faithfulness, and care for His people. When we meditate on His Word, our hearts are strengthened and our faith is renewed.

The wisdom found in this passage reminds us that God's truth is unchanging and His promises are sure. In a world full of uncertainty, we can anchor our souls in the eternal truths of His Word.

${randomVerse.prayer}

May this verse continue to speak to your heart throughout the day, bringing you the peace and assurance that comes from knowing God's heart toward you.`;
      }
    }

    const templates = language === 'es' ? prayerTemplatesSpanish[category] : prayerTemplates[category];
    if (!templates) return null;
    
    if (length === 'brief') {
      // Brief: ~100 words (Brief & Beautiful)
      const randomOpening = templates.openings[Math.floor(Math.random() * templates.openings.length)];
      const randomSubject1 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      let randomSubject2 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      let randomSubject3 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      
      // Ensure different subjects
      while (randomSubject2 === randomSubject1) {
        randomSubject2 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      }
      while (randomSubject3 === randomSubject1 || randomSubject3 === randomSubject2) {
        randomSubject3 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      }
      
      const randomClosing = templates.closings[Math.floor(Math.random() * templates.closings.length)];
      
      const middlePhrases = language === 'es' ? [
        'Te pido con fe que obres en mi vida y me guíes por tus sendas',
        'Derramo mi corazón ante ti, confiando en tu amor y misericordia',
        'Reconozco tu bondad y te alabo por todas tus bendiciones',
        'Busco tu rostro y tu sabiduría para enfrentar cada día'
      ] : [
        'I ask with faith that you work in my life and guide me in your ways',
        'I pour out my heart to you, trusting in your love and mercy',
        'I acknowledge your goodness and praise you for all your blessings',
        'I seek your face and your wisdom to face each day'
      ];
      
      const randomMiddle = middlePhrases[Math.floor(Math.random() * middlePhrases.length)];
      
      return `${randomOpening} ${randomSubject1}. ${randomSubject2}. ${randomMiddle}. ${randomSubject3}. ${randomClosing} ${t('finalClosingShort')}`;
      
    } else if (length === 'medium') {
      // Medium: ~200 words (Perfectly Timed)
      const randomOpening = templates.openings[Math.floor(Math.random() * templates.openings.length)];
      const randomTransition = language === 'es' ? 
        ['Por tanto', 'También', 'Además'][Math.floor(Math.random() * 3)] :
        ['Therefore', 'Also', 'Furthermore'][Math.floor(Math.random() * 3)];
      
      // Get 4 different subjects
      const subjects = [];
      while (subjects.length < 4) {
        const randomSubject = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
        if (!subjects.includes(randomSubject)) {
          subjects.push(randomSubject);
        }
      }
      
      // Get 2 different closings
      const closings = [];
      while (closings.length < 2) {
        const randomClosing = templates.closings[Math.floor(Math.random() * templates.closings.length)];
        if (!closings.includes(randomClosing)) {
          closings.push(randomClosing);
        }
      }
      
      return `${randomOpening} ${subjects[0]}. ${subjects[1]}. ${t('comprehensiveMiddle1')}

${randomTransition}, ${subjects[2]}. ${subjects[3]}. We trust in your perfect timing and boundless mercy. May your will be done in every aspect of our lives.

${closings[0]} ${closings[1]} ${t('finalClosingLong')}`;
      
    } else {
      // Comprehensive: ~300 words (Rich & Meaningful)
      const randomOpening = templates.openings[Math.floor(Math.random() * templates.openings.length)];
      const transitions = language === 'es' ? 
        ['Por tanto', 'También', 'Además', 'Asimismo'] :
        ['Therefore', 'Also', 'Furthermore', 'Moreover'];
      const randomTransition1 = transitions[Math.floor(Math.random() * transitions.length)];
      const randomTransition2 = transitions[Math.floor(Math.random() * transitions.length)];
      
      // Get 6 different subjects
      const subjects = [];
      while (subjects.length < 6) {
        const randomSubject = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
        if (!subjects.includes(randomSubject)) {
          subjects.push(randomSubject);
        }
      }
      
      // Get 3 different closings
      const closings = [];
      while (closings.length < 3) {
        const randomClosing = templates.closings[Math.floor(Math.random() * templates.closings.length)];
        if (!closings.includes(randomClosing)) {
          closings.push(randomClosing);
        }
      }
      
      const gratitudePhrases = language === 'es' ? [
        'Mi corazón se llena de gratitud por todas las bendiciones que derramas sobre nosotros',
        'Te alabo por tu bondad constante y tu amor que nunca falla',
        'Reconozco con humildad todos los dones que nos has otorgado'
      ] : [
        'My heart fills with gratitude for all the blessings you pour upon us',
        'I praise you for your constant goodness and your love that never fails',
        'I humbly acknowledge all the gifts you have bestowed upon us'
      ];
      
      const randomGratitude = gratitudePhrases[Math.floor(Math.random() * gratitudePhrases.length)];
      
      // Create a substantial 4-paragraph prayer
      return `${randomOpening} ${subjects[0]}. ${subjects[1]}. ${t('comprehensiveMiddle1')} We come before you with hearts full of expectation, knowing that you hear every word we speak and understand the deepest longings of our souls.

${subjects[2]}. ${subjects[3]}. Your word reminds us that you are working all things together for good for those who love you. We place our trust in your perfect plan, even when we cannot see the full picture of what you are accomplishing in our lives.

${randomTransition1}, we bring before you these concerns: ${subjects[4]}. ${subjects[5]}. ${t('comprehensiveMiddle2')} We ask for your divine intervention, knowing that nothing is too difficult for you and that your power is made perfect in our weakness.

${randomGratitude}. We celebrate your faithfulness in the past, trust in your provision for today, and have hope in your promises for tomorrow. ${randomTransition2}, ${closings[0]} ${closings[1]} ${closings[2]} ${t('finalClosingLong')}`;
    }
    } catch (error) {
      console.error(`Prayer generation error for category: ${category}, length: ${length}`, error);
      
      // Fallback: Generate a simple prayer if there's an error
      const templates = prayerTemplates[category];
      if (templates && templates.openings && templates.subjects && templates.closings) {
        const opening = templates.openings[0];
        const subject = templates.subjects[0];
        const closing = templates.closings[0];
        return `${opening} ${subject}. ${closing} In your holy name, Amen.`;
      }
      
      // Ultimate fallback
      return `Dear God, we come to you with grateful hearts. Bless us and guide us in your love. In your holy name, Amen.`;
    }
  };

  // Public function that ensures uniqueness
  const generateDynamicPrayer = (category, length = 'medium') => {
    return generateUniquePrayer(() => generatePrayerInternal(category, length));
  };

  const prayerCategories = {
    gratitude: {
      icon: () => (
        <img 
          src="/logo192.png" 
          alt="Praying Hands" 
          style={{ width: '20px', height: '20px' }} 
        />
      ),
      name: t('gratitude'),
      description: t('gratitudeDesc'),
      color: '#6366f1',
      prayers: [
        "Thank you for the gift of this new day and all the opportunities it brings. Help me to see beauty in the ordinary moments and find joy in simple pleasures.",
        "I am grateful for the love that surrounds me, the roof over my head, and the food on my table. May I never take these blessings for granted.",
        "Thank you for my health, my family, and the ability to make a positive difference in the world. Guide me to use these gifts wisely."
      ]
    },
    morning: {
      icon: Sun,
      name: t('morning'),
      description: t('morningDesc'),
      color: '#f59e0b',
      prayers: [
        "As I begin this new day, fill my heart with hope and my mind with clarity. Guide my steps and help me be a source of light to others.",
        "Grant me strength for today's challenges and wisdom for today's decisions. May I approach each task with patience and purpose.",
        "Help me to start this day with a grateful heart and an open mind. May I be present in each moment and kind in every interaction."
      ]
    },
    bedtime: {
      icon: Moon,
      name: t('bedtime'),
      description: t('bedtimeDesc'),
      color: '#1e293b',
      prayers: [
        "As I prepare for sleep, I reflect on the moments of grace and growth from today. Help me learn from today's experiences and rest in Your peace.",
        "Thank you for carrying me through another day. Forgive me for any mistakes I've made and help me do better tomorrow.",
        "Grant me peaceful sleep and healing rest. May tomorrow bring new opportunities to serve and to love more deeply."
      ]
    },
    healing: {
      icon: Sparkles,
      name: t('healing'),
      description: t('healingDesc'),
      color: '#10b981',
      prayers: [
        "Grant healing to all who are suffering - in body, mind, or spirit. Bring comfort to the afflicted and strength to those who care for them.",
        "Help me heal from past hurts and find the courage to forgive. May I release resentment and embrace peace in my heart.",
        "Restore what is broken within me and around me. Give me patience with the healing process and hope for better days ahead."
      ]
    },
    family: {
      icon: Users,
      name: t('family'),
      description: t('familyDesc'),
      color: '#8b5cf6',
      prayers: [
        "Bless my family with love, understanding, and unity. Help us support each other through life's joys and challenges.",
        "Watch over my friends and loved ones wherever they may be. Keep them safe, healthy, and surrounded by your love.",
        "Help me be a better family member and friend. Give me patience, kindness, and the wisdom to know when to speak and when to listen."
      ]
    },
    grace: {
      icon: Utensils,
      name: t('grace'),
      description: t('graceDesc'),
      color: '#8b4513',
      prayers: [
        "Lord, we thank you for this meal and the hands that prepared it. May this food nourish our bodies and strengthen us to serve you.",
        "God, bless this food to our bodies and our fellowship to your glory. Use us to be a blessing to others as you have blessed us.",
        "Our Father, we are grateful for your provision and the abundance before us. Help us to always remember those in need."
      ]
    },
    bibleVerses: {
      icon: Book,
      name: t('bibleVerses'),
      description: t('bibleVersesDesc'),
      color: '#B8860B',
      prayers: []
    },
    custom: {
      icon: Send,
      name: t('custom'),
      description: t('customDesc'),
      color: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
      prayers: []
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    if (!supabase) {
      setAuthError('Authentication not available in offline mode');
      setAuthLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      // Clear form
      setEmail('');
      setPassword('');
    }
    setAuthLoading(false);
  };

  // Password strength validation
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!minLength) return 'Password must be at least 8 characters long';
    if (!hasUpperCase) return 'Password must contain at least one uppercase letter';
    if (!hasLowerCase) return 'Password must contain at least one lowercase letter';
    if (!hasNumbers) return 'Password must contain at least one number';
    if (!hasSpecialChar) return 'Password must contain at least one special character (!@#$%^&*)';
    
    return null; // Password is valid
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Validate full name
    if (!fullName.trim()) {
      setAuthError('Please enter your full name');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAuthError('Please enter a valid email address');
      return;
    }
    
    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setAuthError(passwordError);
      return;
    }
    
    // Check password confirmation
    if (password !== confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }

    setAuthLoading(true);
    setAuthError('');

    if (!supabase) {
      setAuthError('Authentication not available in offline mode');
      setAuthLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
          },
          // Enable email confirmation
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('User already registered')) {
          setAuthError('An account with this email already exists. Please sign in instead.');
        } else if (error.message.includes('Invalid email')) {
          setAuthError('Please enter a valid email address.');
        } else if (error.message.includes('Password should be at least')) {
          setAuthError('Password must be at least 6 characters long.');
        } else {
          setAuthError(error.message);
        }
      } else {
        // Success - show verification message
        if (data.user && !data.user.email_confirmed_at) {
          setAuthError('✅ Account created! Please check your email (including spam folder) for a verification link. You must verify your email before signing in.');
        } else {
          setAuthError('✅ Account created successfully! You can now sign in.');
        }
        
        console.log('Signup successful:', data);
        console.log('Email confirmation required:', !data.user?.email_confirmed_at);
        
        // Developer troubleshooting info
        if (process.env.NODE_ENV === 'development') {
          console.log('📧 EMAIL VERIFICATION TROUBLESHOOTING:');
          console.log('1. Check Supabase Dashboard > Authentication > Settings');
          console.log('2. Ensure "Enable email confirmations" is ON');
          console.log('3. Configure email templates if needed');
          console.log('4. Check spam folder for verification emails');
          console.log('5. Verify SMTP settings in Supabase project');
        }
        
        // Clear form
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setFullName('');
        // Switch back to sign in mode after a delay
        setTimeout(() => {
          setShowSignUp(false);
        }, 4000);
      }
    } catch (err) {
      setAuthError('An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    }
    
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    // Handle guest user sign out
    if (user && user.id === 'guest') {
      console.log('Guest user signing out');
      setUser(null);
      setUserSession(null);
      setIsPremium(false);
      setCurrentPrayer('');
      setGuestPrayerCount(0);
      return;
    }
    
    // Handle Google user sign out
    if (!supabase) {
      console.warn('Cannot sign out - authentication not available in offline mode');
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    } else {
      // Clear user state after successful sign out
      setUser(null);
      setUserSession(null);
      setIsPremium(false);
      setCurrentPrayer('');
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('Google sign-in clicked!');
    setAuthLoading(true);
    setAuthError('');

    console.log('Supabase client:', supabase);
    if (!supabase) {
      console.log('Supabase not available');
      setAuthError('Authentication not available in offline mode');
      setAuthLoading(false);
      return;
    }

    try {
      console.log('Starting OAuth flow...');
      // Always use current domain for redirect - let Supabase handle it
      const redirectUrl = `${window.location.origin}/`;
      console.log('Google OAuth redirect URL:', redirectUrl);
      console.log('Current location:', window.location.href);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });

      if (error) {
        console.error('OAuth error:', error);
        setAuthError(`Google sign-in failed: ${error.message}`);
        setAuthLoading(false);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setAuthError('An unexpected error occurred. Please try again.');
      setAuthLoading(false);
    }
  };

  // Content filtering function
  const filterContent = (text) => {
    if (!text) return text;
    
    // Basic inappropriate words list (expandable)
    const inappropriateWords = [
      'damn', 'hell', 'shit', 'fuck', 'bitch', 'ass', 'crap', 'piss',
      'bastard', 'whore', 'slut', 'idiot', 'stupid', 'hate', 'kill',
      'death', 'murder', 'violence', 'revenge', 'curse', 'satan', 'devil'
    ];
    
    // Convert to lowercase for checking
    const lowerText = text.toLowerCase();
    
    // Check for inappropriate content
    for (const word of inappropriateWords) {
      if (lowerText.includes(word)) {
        return null; // Return null to indicate inappropriate content
      }
    }
    
    // Basic length check (prevent extremely long requests)
    if (text.length > 500) {
      return text.substring(0, 500) + '...';
    }
    
    return text;
  };

  const generateCustomPrayerInternal = (request, isForSelf, name, length, occasion = '') => {
    // Filter the prayer request
    const filteredRequest = filterContent(request);
    
    if (filteredRequest === null) {
      return t('inappropriateContent');
    }
    
    // Filter the person's name and extract first name only
    const filteredName = name ? filterContent(name) : name;
    if (filteredName === null) {
      return t('inappropriateName');
    }
    
    // Extract first name only for more personal prayers
    const firstName = filteredName ? filteredName.split(' ')[0] : filteredName;
    
    let prayerTemplate = "";

    if (occasion === 'addiction') {
      // Create varied addiction prayers
      const addictionOpenings = language === 'es' ? [
        'Padre Celestial,',
        'Dios Todopoderoso,',
        'Señor de la sanidad,',
        'Dios compasivo,',
        'Padre Amoroso,'
      ] : [
        'Heavenly Father,',
        'Almighty God,',
        'Lord of healing,',
        'Compassionate God,',
        'Loving Father,'
      ];

      const addictionMiddles = language === 'es' ? [
        'Señor, confieso que no puedo superar esta lucha por mi cuenta - necesito tu intervención divina.',
        'Reconozco mi necesidad de tu poder transformador en esta batalla.',
        'Admito mi debilidad y busco tu fuerza sobrenatural.',
        'Confieso que solo en ti puedo encontrar la libertad verdadera.',
        'Declaro que tu gracia es suficiente para mi debilidad.'
      ] : [
        'Lord, I confess that I cannot overcome this struggle on my own - I need your divine intervention.',
        'I acknowledge my need for your transforming power in this battle.',
        'I admit my weakness and seek your supernatural strength.',
        'I confess that only in you can I find true freedom.',
        'I declare that your grace is sufficient for my weakness.'
      ];

      const addictionClosings = language === 'es' ? [
        'Dame fuerza para cada momento de tentación y rodéame de personas que apoyen mi recuperación.',
        'Concédeme valor para enfrentar cada día y sabiduría para tomar buenas decisiones.',
        'Llena mi vida con tu presencia y guía mis pasos hacia la sanidad.',
        'Ayúdame a encontrar nuevos hábitos saludables y relaciones que me edifiquen.',
        'Renueva mi mente y transforma mi corazón con tu amor.'
      ] : [
        'Give me strength for each moment of temptation and surround me with people who will support my recovery.',
        'Grant me courage to face each day and wisdom to make good choices.',
        'Fill my life with your presence and guide my steps toward healing.',
        'Help me find new healthy habits and relationships that build me up.',
        'Renew my mind and transform my heart with your love.'
      ];

      const randomOpening = addictionOpenings[Math.floor(Math.random() * addictionOpenings.length)];
      const randomMiddle = addictionMiddles[Math.floor(Math.random() * addictionMiddles.length)];  
      const randomClosing = addictionClosings[Math.floor(Math.random() * addictionClosings.length)];

      if (isForSelf) {
        if (language === 'es') {
          prayerTemplate = `${randomOpening} vengo ante ti quebrantado y necesitando desesperadamente tu poder sanador. ${randomMiddle} ${filteredRequest}. Rompe las cadenas que me atan y libérame de este ciclo destructivo. ${randomClosing} Confío en tu poder para hacerme nuevo. Amén.`;
        } else {
          prayerTemplate = `${randomOpening} I come to you broken and in desperate need of your healing power. ${randomMiddle} ${filteredRequest}. Break the chains that bind me and set me free from this destructive cycle. ${randomClosing} I trust in your power to make me new. Amen.`;
        }
      } else {
        const personRef = firstName || (language === 'es' ? 'esta persona' : 'this person');
        const possessive = firstName ? (language === 'es' ? `de ${firstName}` : firstName + "'s") : (language === 'es' ? 'su' : 'their');
        const objectPronoun = firstName || (language === 'es' ? 'él/ella' : 'them');
        
        if (language === 'es') {
          prayerTemplate = `${randomOpening} vengo ante ti con el corazón pesado, elevando a ${personRef} quien está luchando con esta situación: ${filteredRequest}. Señor, tú ves el dolor y la lucha que está experimentando. Pido tu intervención divina en la vida ${possessive}. Rompe las cadenas que atan a ${objectPronoun} y dale fuerza para superar estos desafíos. ${randomClosing} Confiamos en tu poder para redimir y restaurar a ${objectPronoun}. Amén.`;
        } else {
          prayerTemplate = `${randomOpening} I come to you with a heavy heart, lifting up ${personRef} who is struggling with this situation: ${filteredRequest}. Lord, you see the pain and struggle they are experiencing. I ask for your divine intervention in ${possessive} life. Break the chains that bind ${objectPronoun} and give ${objectPronoun} strength to overcome these challenges. ${randomClosing} We trust in your power to redeem and restore ${objectPronoun}. Amen.`;
        }
      }
    } else {
      // Create varied custom prayers
      const customOpenings = language === 'es' ? [
        'Querido Dios,',
        'Padre Celestial,',
        'Señor,',
        'Dios Todopoderoso,',
        'Padre Amoroso,'
      ] : [
        'Dear God,',
        'Heavenly Father,',
        'Lord,',
        'Almighty God,',
        'Loving Father,'
      ];

      const customMiddles = language === 'es' ? [
        'Te pido que escuches mi oración y respondas según tu perfecta voluntad y tiempo.',
        'Confío en tu sabiduría y busco tu guía en esta situación.',
        'Pongo esta petición en tus manos, sabiendo que tu amor nunca falla.',
        'Busco tu dirección y confío en tu plan perfecto para mi vida.',
        'Te presento esta necesidad, creyendo en tu poder y bondad.'
      ] : [
        'I ask that you hear my prayer and respond according to your perfect will and timing.',
        'I trust in your wisdom and seek your guidance in this situation.',
        'I place this request in your hands, knowing that your love never fails.',
        'I seek your direction and trust in your perfect plan for my life.',
        'I bring this need to you, believing in your power and goodness.'
      ];

      const customClosings = language === 'es' ? [
        'Concédeme fe para confiar en tu bondad, incluso cuando no puedo ver el camino adelante.',
        'Dame paciencia mientras espero tu respuesta y sabiduría para reconocerla.',
        'Fortalece mi fe y ayúdame a descansar en tu amor perfecto.',
        'Guía mis pasos y llena mi corazón con tu paz.',
        'Que tu voluntad se haga en mi vida, y que pueda glorificarte en todo.'
      ] : [
        'Grant me faith to trust in your goodness, even when I cannot see the way forward.',
        'Give me patience as I await your answer and wisdom to recognize it.',
        'Strengthen my faith and help me rest in your perfect love.',
        'Guide my steps and fill my heart with your peace.',
        'May your will be done in my life, and may I glorify you in all things.'
      ];

      const randomOpening = customOpenings[Math.floor(Math.random() * customOpenings.length)];
      
      // Use different templates based on who the prayer is for
      let randomMiddle, randomClosing;
      
      if (isForSelf) {
        randomMiddle = customMiddles[Math.floor(Math.random() * customMiddles.length)];
        randomClosing = customClosings[Math.floor(Math.random() * customClosings.length)];
      } else {
        // Create third-person versions for prayers for others
        const othersMiddles = language === 'es' ? [
          'Te pido que escuches esta oración y respondas según tu perfecta voluntad y tiempo.',
          'Confiamos en tu sabiduría y buscamos tu guía en esta situación.',
          'Ponemos esta petición en tus manos, sabiendo que tu amor nunca falla.',
          'Buscamos tu dirección y confiamos en tu plan perfecto.',
          'Te presentamos esta necesidad, creyendo en tu poder y bondad.'
        ] : [
          'I ask that you hear this prayer and respond according to your perfect will and timing.',
          'We trust in your wisdom and seek your guidance in this situation.',
          'We place this request in your hands, knowing that your love never fails.',
          'We seek your direction and trust in your perfect plan.',
          'We bring this need to you, believing in your power and goodness.'
        ];
        
        const othersClosings = language === 'es' ? [
          'Concédeles fe para confiar en tu bondad, incluso cuando no puedan ver el camino adelante.',
          'Dales paciencia mientras esperan tu respuesta y sabiduría para reconocerla.',
          'Fortalece su fe y ayúdales a descansar en tu amor perfecto.',
          'Guía sus pasos y llena sus corazones con tu paz.',
          'Que tu voluntad se haga en sus vidas, y que puedan glorificarte en todo.'
        ] : [
          'Grant them faith to trust in your goodness, even when they cannot see the way forward.',
          'Give them patience as they await your answer and wisdom to recognize it.',
          'Strengthen their faith and help them rest in your perfect love.',
          'Guide their steps and fill their hearts with your peace.',
          'May your will be done in their lives, and may they glorify you in all things.'
        ];
        
        randomMiddle = othersMiddles[Math.floor(Math.random() * othersMiddles.length)];
        randomClosing = othersClosings[Math.floor(Math.random() * othersClosings.length)];
      }

      if (isForSelf) {
        if (language === 'es') {
          if (length === 'comprehensive') {
            prayerTemplate = `${randomOpening} vengo ante ti con humildad y un corazón abierto, presentando este pedido: ${filteredRequest}. ${randomMiddle} 
            
            Señor, reconozco que tu sabiduría supera mi entendimiento, y confío en que conoces no solo lo que pido, sino también lo que realmente necesito. Ayúdame a someter mi voluntad a la tuya, sabiendo que tus planes para mí son de bien y no de mal.
            
            ${randomClosing} Te pido que durante este tiempo de espera, me enseñes paciencia y me fortalezcas en la fe. Que pueda ser un testimonio de tu bondad para otros que también están esperando respuestas tuyas.
            
            Lléname con tu amor, paz y esperanza mientras espero tu respuesta perfecta en tu tiempo perfecto. Que mi vida refleje tu gloria sin importar el resultado. Amén.`;
          } else if (length === 'medium') {
            prayerTemplate = `${randomOpening} vengo ante ti con este pedido: ${filteredRequest}. ${randomMiddle} Te pido sabiduría para entender tu voluntad y fuerza para aceptar tu respuesta. ${randomClosing} Lléname con tu amor, paz y esperanza mientras espero tu respuesta. Amén.`;
          } else {
            prayerTemplate = `${randomOpening} vengo ante ti con este pedido: ${filteredRequest}. ${randomMiddle} ${randomClosing} Lléname con tu amor, paz y esperanza mientras espero tu respuesta. Amén.`;
          }
        } else {
          if (length === 'comprehensive') {
            prayerTemplate = `${randomOpening} I come before you with humility and an open heart, presenting this request: ${filteredRequest}. ${randomMiddle}
            
            Lord, I recognize that your wisdom surpasses my understanding, and I trust that you know not only what I'm asking for, but also what I truly need. Help me to submit my will to yours, knowing that your plans for me are for good and not for harm.
            
            ${randomClosing} I ask that during this time of waiting, you would teach me patience and strengthen me in faith. May I be a testimony of your goodness to others who are also waiting for answers from you.
            
            Fill me with your love, peace, and hope as I await your perfect answer in your perfect timing. May my life reflect your glory regardless of the outcome. Amen.`;
          } else if (length === 'medium') {
            prayerTemplate = `${randomOpening} I come before you with this request: ${filteredRequest}. ${randomMiddle} I ask for wisdom to understand your will and strength to accept your answer. ${randomClosing} Fill me with your love, peace, and hope as I await your answer. Amen.`;
          } else {
            prayerTemplate = `${randomOpening} I come before you with this request: ${filteredRequest}. ${randomMiddle} ${randomClosing} Fill me with your love, peace, and hope as I await your answer. Amen.`;
          }
        }
      } else {
        const personRef = firstName || (language === 'es' ? 'esta persona' : 'this person');
        const possessive = firstName ? (language === 'es' ? `de ${firstName}` : firstName + "'s") : (language === 'es' ? 'su' : 'their');
        const objectPronoun = firstName || (language === 'es' ? 'él/ella' : 'them');
        
        if (language === 'es') {
          if (length === 'comprehensive') {
            prayerTemplate = `${randomOpening} elevo a ${personRef} ante ti en oración con gran cariño y preocupación, presentando este pedido: ${filteredRequest}. ${randomMiddle}
            
            Padre, tú conoces cada detalle de la vida ${possessive}, cada lucha y cada necesidad. Te pido que obres en ${possessive} situación con tu poder sobrenatural y tu amor infinito. Que ${objectPronoun} pueda sentir tu presencia tangible durante este tiempo.
            
            Bendice a ${objectPronoun} con tu presencia y llena ${possessive} corazón con esperanza renovada. ${randomClosing} Te pido también que me uses como instrumento de tu amor para apoyar a ${objectPronoun} durante este tiempo.
            
            Rodea a ${objectPronoun} con tu amor y el apoyo de personas que se preocupan verdaderamente. Que tu voluntad perfecta se cumpla en ${possessive} vida. Amén.`;
          } else if (length === 'medium') {
            prayerTemplate = `${randomOpening} elevo a ${personRef} ante ti en oración con este pedido: ${filteredRequest}. ${randomMiddle} Te pido sabiduría para ${objectPronoun} y fortaleza durante este tiempo. Bendice a ${objectPronoun} con tu presencia y llena ${possessive} corazón con esperanza. ${randomClosing} Rodea a ${objectPronoun} con tu amor y el apoyo de personas que se preocupan. Amén.`;
          } else {
            prayerTemplate = `${randomOpening} elevo a ${personRef} ante ti en oración con este pedido: ${filteredRequest}. ${randomMiddle} Bendice a ${objectPronoun} con tu presencia y llena ${possessive} corazón con esperanza. ${randomClosing} Rodea a ${objectPronoun} con tu amor y el apoyo de personas que se preocupan. Amén.`;
          }
        } else {
          if (length === 'comprehensive') {
            prayerTemplate = `${randomOpening} I lift up ${personRef} to you in prayer with great care and concern, presenting this request: ${filteredRequest}. ${randomMiddle}
            
            Father, you know every detail of ${possessive} life, every struggle and every need. I ask that you work in ${possessive} situation with your supernatural power and infinite love. May ${objectPronoun} feel your tangible presence during this time.
            
            Bless ${objectPronoun} with your presence and fill ${possessive} heart with renewed hope. ${randomClosing} I also ask that you use me as an instrument of your love to support ${objectPronoun} during this time.
            
            Surround ${objectPronoun} with your love and the support of people who truly care. May your perfect will be accomplished in ${possessive} life. Amen.`;
          } else if (length === 'medium') {
            prayerTemplate = `${randomOpening} I lift up ${personRef} to you in prayer with this request: ${filteredRequest}. ${randomMiddle} I ask for wisdom for ${objectPronoun} and strength during this time. Bless ${objectPronoun} with your presence and fill ${possessive} heart with hope. ${randomClosing} Surround ${objectPronoun} with your love and the support of caring people. Amen.`;
          } else {
            prayerTemplate = `${randomOpening} I lift up ${personRef} to you in prayer with this request: ${filteredRequest}. ${randomMiddle} Bless ${objectPronoun} with your presence and fill ${possessive} heart with hope. ${randomClosing} Surround ${objectPronoun} with your love and the support of caring people. Amen.`;
          }
        }
      }
    }
    
    return prayerTemplate;
  };

  // Public function that ensures uniqueness for custom prayers
  const generateCustomPrayer = (request, isForSelf, name, length, occasion = '') => {
    return generateUniquePrayer(() => generateCustomPrayerInternal(request, isForSelf, name, length, occasion));
  };

  // Prayer history functions
  const fetchPrayerHistory = async () => {
    if (!user) return;
    
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('prayer_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50); // Get last 50 prayers
      
      if (error) {
        console.error('Error fetching prayer history:', error);
      } else {
        setPrayerHistory(data || []);
      }
    } catch (err) {
      console.error('Error fetching prayer history:', err);
    }
    setLoadingHistory(false);
  };

  const openPrayerHistory = () => {
    setShowPrayerHistory(true);
    fetchPrayerHistory();
  };

  // Social sharing functions
  const formatPrayerForSharing = (prayer, includeAttribution = true) => {
    const appBranding = "\n\n🙏 Generated with Help Me Pray\nDownload: helpmepray.app";
    const attribution = shareAnonymously ? "" : (user ? `\n\nShared by ${user.user_metadata?.full_name || 'a friend'}` : "");
    
    return `${prayer}${includeAttribution ? attribution : ""}${appBranding}`;
  };
  
  // ElevenLabs configurations removed due to cost - keeping for reference
  const removedHumanVoices = {
    nurturing: {
      name: 'Maria - Nurturing',
      description: 'Soft, caring Latina voice with bilingual warmth',
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella (ElevenLabs)
      stability: 0.6,
      similarity_boost: 0.7,
      style: 0.1,
      use_speaker_boost: true
    },
    peaceful: {
      name: 'David - Peaceful',
      description: 'Calm, meditative British voice for reflection',
      voiceId: 'ErXwobaYiN019PkySvjV', // Antoni (ElevenLabs)
      stability: 0.7,
      similarity_boost: 0.6,
      style: 0.0,
      use_speaker_boost: true
    },
    soulful: {
      name: 'Grace - Soulful',
      description: 'Rich, expressive African American voice',
      voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel (ElevenLabs)
      stability: 0.6,
      similarity_boost: 0.8,
      style: 0.2,
      use_speaker_boost: true
    },
    gentle: {
      name: 'Aisha - Gentle',
      description: 'Soft, melodic voice with Middle Eastern influence',
      voiceId: 'XB0fDUnXU5powFXDhCwa', // Charlotte (ElevenLabs)
      stability: 0.6,
      similarity_boost: 0.8,
      style: 0.0,
      use_speaker_boost: true
    },
    serene: {
      name: 'Lin - Serene',
      description: 'Calm, centered voice with Asian tranquility',
      voiceId: 'IKne3meq5aSn9XLyUdCD', // Charlie (ElevenLabs)
      stability: 0.8,
      similarity_boost: 0.6,
      style: 0.0,
      use_speaker_boost: true
    },
    aria: {
      name: 'Aria - Melodic',
      description: 'Beautiful, lyrical voice with operatic warmth',
      voiceId: '9BWtsMINqrJLrRacOk9x', // Aria (ElevenLabs)
      stability: 0.6,
      similarity_boost: 0.8,
      style: 0.2,
      use_speaker_boost: true
    },
    brian: {
      name: 'Brian - Steady',
      description: 'Strong, reliable masculine voice for guidance',
      voiceId: 'nPczCjzI2devNBz1zQrb', // Brian (ElevenLabs)
      stability: 0.7,
      similarity_boost: 0.7,
      style: 0.1,
      use_speaker_boost: true
    },
    serena: {
      name: 'Serena - Peaceful',
      description: 'Tranquil, soothing voice for inner peace',
      voiceId: 'pMsXgVXv3BLzUgSXRplE', // Serena (ElevenLabs)
      stability: 0.8,
      similarity_boost: 0.6,
      style: 0.0,
      use_speaker_boost: true
    }
  };

  // Text-to-speech functions  
  const speakPrayer = async (text) => {
    console.log('speakPrayer called with provider:', ttsProvider, 'isPremium:', isPremium);
    
    // Handle different voice providers and quality settings
    switch (ttsProvider) {
      case 'azure':
        await speakWithAzureTTS(text);
        break;
      case 'browser':
      default:
        if (useHumanVoice) {
          speakWithEnhancedSystemVoice(text);
        } else {
          speakWithSystemVoice(text);
        }
        break;
    }
  };

  // ElevenLabs function removed due to high cost

  const speakWithSystemVoice = (text) => {
    if (!selectedVoice) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = speechRate;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };
    
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };
    
    setCurrentUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  };
  
  const pauseSpeech = () => {
    if (audioElement) {
      audioElement.pause();
      setIsPaused(true);
    } else if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };
  
  const resumeSpeech = () => {
    if (audioElement && audioElement.paused) {
      audioElement.play();
      setIsPaused(false);
    } else if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };
  
  const stopSpeech = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setAudioElement(null);
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentUtterance(null);
  };

  const pauseAudio = () => {
    if (audioElement) {
      audioElement.pause();
      setIsPaused(true);
    } else if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setAudioElement(null);
    }
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentUtterance(null);
  };



  // Enhanced system voice with better settings to simulate premium quality
  const speakWithEnhancedSystemVoice = (text) => {
    if (!availableVoices.length) return;
    
    setIsPlaying(true);
    setIsPaused(false);
    
    // Stop any current speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find best quality English voice
    const englishVoices = availableVoices.filter(voice => voice.lang.startsWith('en'));
    const preferredVoice = englishVoices.find(voice => 
      voice.name.includes('Samantha') || 
      voice.name.includes('Alex') || 
      voice.name.includes('Google')
    ) || englishVoices[0] || availableVoices[0];
    
    utterance.voice = preferredVoice;
    
    // Enhanced voice settings for better quality
    utterance.rate = speechRate * 0.9; // Slightly slower for prayer reading
    utterance.pitch = 1.0; // Standard pitch
    utterance.volume = 0.9;
    
    // Event handlers
    utterance.onstart = () => {
      console.log('Enhanced system voice started:', preferredVoice?.name);
      setIsPlaying(true);
      setIsPaused(false);
    };
    
    utterance.onend = () => {
      console.log('Enhanced system voice finished');
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };
    
    utterance.onerror = (event) => {
      console.error('Enhanced system voice error:', event.error);
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentUtterance(null);
    };
    
    setCurrentUtterance(utterance);
    window.speechSynthesis.speak(utterance);
  };

  // Azure Cognitive Services Text-to-Speech (cost-effective alternative)
  const speakWithAzureTTS = async (text) => {
    try {
      console.log('Using Azure Neural TTS with voice:', selectedVoice || 'en-US-AvaMultilingualNeural');
      
      // Stop any currently playing audio
      if (currentAudioBlob) {
        try {
          window.speechSynthesis.cancel();
          if (window.currentAudio) {
            window.currentAudio.pause();
            window.currentAudio.currentTime = 0;
          }
        } catch (e) {
          console.log('No current audio to stop');
        }
      }

      setIsPlaying(true);
      setIsPaused(false);
      
      // Call Azure TTS API (using simple REST implementation)
      const response = await fetch('/api/azure-tts-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voiceName: selectedVoice || 'en-US-AvaMultilingualNeural',
          speakingRate: 0.9,
          pitch: 0,
          languageCode: 'en-US'
        }),
      });

      if (!response.ok) {
        throw new Error(`Azure TTS request failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('Azure TTS successful, playing audio...');
        
        // Convert base64 audio to playable format
        const audioBlob = new Blob([
          Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
        ], { type: 'audio/mpeg' });
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        // Store reference for cleanup
        window.currentAudio = audio;
        
        audio.onloadeddata = () => {
          console.log('Azure audio loaded successfully');
        };
        
        audio.onplay = () => {
          setIsPlaying(true);
          setIsPaused(false);
        };
        
        audio.onended = () => {
          console.log('Azure audio playback ended');
          setIsPlaying(false);
          setIsPaused(false);
          URL.revokeObjectURL(audioUrl);
          window.currentAudio = null;
        };
        
        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          setIsPlaying(false);
          setIsPaused(false);
          URL.revokeObjectURL(audioUrl);
          window.currentAudio = null;
          
          // Fallback to enhanced system voice
          console.log('Falling back to system voice due to audio error');
          speakWithEnhancedSystemVoice(text);
        };
        
        await audio.play();
        
      } else {
        throw new Error(data.details || 'Azure TTS failed');
      }
      
    } catch (error) {
      console.error('Azure TTS error:', error);
      setIsPlaying(false);
      setIsPaused(false);
      
      // Fallback to enhanced system voice
      console.log('Falling back to enhanced system voice due to Azure error');
      speakWithEnhancedSystemVoice(text);
    }
  };
  
  const socialSharing = {
    copyToClipboard: async (text) => {
      try {
        await navigator.clipboard.writeText(formatPrayerForSharing(text));
        setShareSuccess('Prayer copied to clipboard!');
        setTimeout(() => setShareSuccess(''), 3000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    },
    
    shareToWhatsApp: (text) => {
      const url = `https://wa.me/?text=${encodeURIComponent(formatPrayerForSharing(text))}`;
      window.open(url, '_blank');
    },
    
    shareToTwitter: (text) => {
      const tweetText = formatPrayerForSharing(text).substring(0, 280);
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(url, '_blank');
    },
    
    shareToFacebook: (text) => {
      const fbText = formatPrayerForSharing(text);
      const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(fbText)}`;
      window.open(url, '_blank');
    },
    
    shareToMessages: (text) => {
      const messagesText = formatPrayerForSharing(text);
      const url = `sms:&body=${encodeURIComponent(messagesText)}`;
      window.location.href = url;
    },
    
    shareToInstagram: (text) => {
      // Instagram doesn't have direct URL sharing, so we copy to clipboard and inform user
      const instagramText = formatPrayerForSharing(text);
      navigator.clipboard.writeText(instagramText).then(() => {
        setShareSuccess('Prayer copied! Open Instagram and paste in your story or post.');
        setTimeout(() => setShareSuccess(''), 5000);
      }).catch(() => {
        alert('Please copy this prayer and share it on Instagram:\n\n' + instagramText);
      });
    },
    
    // Audio sharing functions
    downloadAudio: () => {
      if (!currentAudioBlob) {
        alert('No audio available. Please generate audio first by clicking "Listen".');
        return;
      }
      
      const url = URL.createObjectURL(currentAudioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prayer-audio-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setShareSuccess('Audio downloaded! You can now share the MP3 file.');
      setTimeout(() => setShareSuccess(''), 3000);
    },
    
    shareAudioToWhatsApp: async () => {
      if (!currentAudioBlob) {
        alert('Please generate audio first by clicking "Listen", then try sharing again.');
        return;
      }
      
      try {
        // Try Web Share API first (works on mobile)
        if (navigator.share && navigator.canShare) {
          const file = new File([currentAudioBlob], `prayer-audio-${Date.now()}.mp3`, {
            type: 'audio/mpeg',
          });

          const shareData = {
            title: 'Prayer Audio',
            text: `🎵 Listen to this beautiful prayer I generated with Help Me Pray!\n\n${formatPrayerForSharing(currentPrayer, false)}`,
            files: [file]
          };

          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            setShareSuccess('Audio shared successfully!');
            setTimeout(() => setShareSuccess(''), 3000);
            return;
          }
        }

        // Fallback: Try to open WhatsApp with text, then provide download
        const whatsappText = `🎵 Listen to this beautiful prayer I generated with Help Me Pray!\n\n${formatPrayerForSharing(currentPrayer, false)}`;
        const url = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
        
        // Try to open WhatsApp
        window.open(url, '_blank');
        
        // Also download the audio file
        setTimeout(() => {
          socialSharing.downloadAudio();
          alert('WhatsApp opened with prayer text. The audio file has been downloaded - you can attach it in your WhatsApp conversation using the 📎 attachment button.');
        }, 1000);
        
      } catch (error) {
        console.error('Error sharing audio:', error);
        // Final fallback: just download
        socialSharing.downloadAudio();
        alert('Unable to share directly. Audio downloaded! Open WhatsApp, start a chat, click the attachment button (📎), and select the downloaded MP3 file.');
      }
    },
    
    shareAudioToMessages: async () => {
      if (!currentAudioBlob) {
        alert('Please generate audio first by clicking "Listen", then try sharing again.');
        return;
      }
      
      try {
        // Try Web Share API first (works on mobile and some desktop browsers)
        if (navigator.share && navigator.canShare) {
          const file = new File([currentAudioBlob], `prayer-audio-${Date.now()}.mp3`, {
            type: 'audio/mpeg',
          });

          const shareData = {
            title: 'Prayer Audio',
            text: `🎵 Listen to this beautiful prayer I generated with Help Me Pray!\n\n${formatPrayerForSharing(currentPrayer, false)}`,
            files: [file]
          };

          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            setShareSuccess('Audio shared successfully!');
            setTimeout(() => setShareSuccess(''), 3000);
            return;
          }
        }

        // Fallback: Try to open Messages with text, then provide download
        const messagesText = `🎵 Listen to this beautiful prayer I generated with Help Me Pray!\n\n${formatPrayerForSharing(currentPrayer, false)}`;
        const url = `sms:&body=${encodeURIComponent(messagesText)}`;
        
        // Try to open Messages app
        window.location.href = url;
        
        // Also download the audio file
        setTimeout(() => {
          socialSharing.downloadAudio();
          alert('Messages opened with prayer text. The audio file has been downloaded - you can attach it manually in the Messages conversation.');
        }, 1000);
        
      } catch (error) {
        console.error('Error sharing audio:', error);
        // Final fallback: just download
        socialSharing.downloadAudio();
        alert('Unable to share directly. Audio downloaded! Open Messages, start a conversation, and attach the downloaded MP3 file.');
      }
    },
    
    copyAudioInfo: () => {
      if (!currentAudioBlob) {
        alert('No audio available. Please generate audio first by clicking "Listen".');
        return;
      }
      
      const audioInfo = `🎵 I've generated a beautiful audio prayer using Help Me Pray app!\n\n${formatPrayerForSharing(currentPrayer, false)}\n\nDownload Help Me Pray to create your own personalized prayer audio: helpmepray.app`;
      
      navigator.clipboard.writeText(audioInfo).then(() => {
        setShareSuccess('Audio description copied! You can paste this and manually attach the audio file.');
        setTimeout(() => setShareSuccess(''), 4000);
      }).catch(() => {
        alert('Please copy this text and share along with your audio file:\n\n' + audioInfo);
      });
    }
  };

  // Usage tracking and subscription functions
  const checkUserSubscription = async (userId) => {
    // Google logged-in users automatically get premium features
    // Don't check subscription table for them
    if (user && user.id !== 'guest') {
      console.log('Google user detected - automatically granting premium access');
      setIsPremium(true);
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();
      
      if (data && !error) {
        setIsPremium(true);
      }
    } catch (err) {
      console.log('No active subscription found');
      setIsPremium(false);
    }
  };

  const getDailyPrayerCount = async (userId) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('prayer_history')
        .select('id')
        .eq('user_id', userId)
        .gte('created_at', today + 'T00:00:00.000Z')
        .lt('created_at', today + 'T23:59:59.999Z');
      
      if (!error) {
        setDailyPrayerCount(data?.length || 0);
      }
    } catch (err) {
      console.error('Error getting daily prayer count:', err);
    }
  };

  const canGeneratePrayer = () => {
    if (isPremium) {
      return true;
    }
    // Check if user is guest or not logged in
    if (!userSession || (user && user.id === 'guest')) {
      return guestPrayerCount < 3;
    }
    return dailyPrayerCount < 3;
  };

  const generatePrayer = async () => {
    // Check if user can generate more prayers
    if (!canGeneratePrayer()) {
      setShowUpgradeModal(true);
      return;
    }

    // Since ALL categories now show custom form, handle it for all categories
    if (showCustomForm) {
      // Only require customRequest for 'custom' category
      if (selectedCategory === 'custom' && !customRequest.trim()) return;
      
      setIsGenerating(true);
      setTimeout(async () => {
        let generatedPrayer;
        
        if (selectedCategory === 'custom') {
          // Generate fully custom prayer with user input
          const isForSelf = prayerFor === 'myself';
          generatedPrayer = generateCustomPrayer(customRequest, isForSelf, personName, prayerLength, selectedOccasion);
        } else {
          // Generate category-specific prayer with selected length
          generatedPrayer = generateDynamicPrayer(selectedCategory, prayerLength);
        }
        
        if (!generatedPrayer) {
          console.error('Prayer generation returned null/undefined');
          generatedPrayer = `Dear God, we come to you with grateful hearts. Thank you for your love and guidance. Please bless us and help us to grow in faith. In your holy name, Amen.`;
        }
        
        const cleanedPrayer = cleanupPrayerText(generatedPrayer);
        setCurrentPrayer(cleanedPrayer);
        
        // Set prayer info for title bar
        let verseReference = '';
        let customTopic = '';
        
        if (selectedCategory === 'bibleVerses' && generatedPrayer) {
          // Extract verse reference from Bible verse prayer (format: "verse text" - Reference)
          const referenceMatch = generatedPrayer.match(/" - ([^"\n]+)/);
          if (referenceMatch) {
            verseReference = referenceMatch[1];
          }
        } else if (selectedCategory === 'custom') {
          // For custom prayers, only show person's name if praying for someone
          if (prayerFor === 'someone' && personName) {
            customTopic = `Prayer for ${personName}`;
          } else {
            customTopic = 'Custom Prayer';
          }
        }
        
        setCurrentPrayerInfo({ category: selectedCategory, verseReference, customTopic });
        
        // Save to prayer history if user is logged in (but not guest)
        if (user && user.id !== 'guest' && supabase) {
          try {
            const { error } = await supabase.from('prayer_history').insert({
              user_id: user.id,
              prayer_content: cleanedPrayer,
              category: selectedCategory  // Use actual selected category instead of hardcoded 'custom'
            });
            if (error) {
              console.error('Error saving prayer history:', error);
            } else {
              // Update daily prayer count
              setDailyPrayerCount(prev => prev + 1);
            }
          } catch (err) {
            console.error('Error saving prayer history:', err);
          }
        } else {
          // Increment guest prayer count (for both null user and guest user)
          incrementGuestPrayerCount();
        }
        
        setIsGenerating(false);
        goToScreen('prayer-view');
      }, 1200);
    } else {
      setIsGenerating(true);
      setTimeout(async () => {
        // Use dynamic generator for all categories with selected length
        const randomPrayer = generateDynamicPrayer(selectedCategory, prayerLength);
        const cleanedPrayer = cleanupPrayerText(randomPrayer);
        setCurrentPrayer(cleanedPrayer);
        
        // Set prayer info for title bar
        let verseReference = '';
        let customTopic = '';
        
        if (selectedCategory === 'bibleVerses' && randomPrayer) {
          // Extract verse reference from Bible verse prayer (format: "verse text" - Reference)
          const referenceMatch = randomPrayer.match(/" - ([^"\n]+)/);
          if (referenceMatch) {
            verseReference = referenceMatch[1];
          }
        } else if (selectedCategory === 'custom') {
          // For custom prayers, only show person's name if praying for someone
          if (prayerFor === 'someone' && personName) {
            customTopic = `Prayer for ${personName}`;
          } else {
            customTopic = 'Custom Prayer';
          }
        }
        // Note: For non-custom categories, customTopic remains empty
        
        setCurrentPrayerInfo({ category: selectedCategory, verseReference, customTopic });
        
        // Save to prayer history if user is logged in (but not guest)
        if (user && user.id !== 'guest' && supabase) {
          try {
            const { error } = await supabase.from('prayer_history').insert({
              user_id: user.id,
              prayer_content: cleanedPrayer,
              category: selectedCategory
            });
            if (error) {
              console.error('Error saving prayer history:', error);
            } else {
              // Update daily prayer count
              setDailyPrayerCount(prev => prev + 1);
            }
          } catch (err) {
            console.error('Error saving prayer history:', err);
          }
        } else {
          // Increment guest prayer count (for both null user and guest user)
          incrementGuestPrayerCount();
        }
        
        setIsGenerating(false);
        goToScreen('prayer-view');
      }, 800);
    }
  };

  const CategoryButton = ({ categoryKey, category }) => {
    const isCustom = categoryKey === 'custom';
    const isSelected = selectedCategory === categoryKey;
    
    // Icon gradient backgrounds
    const getIconGradient = () => {
      switch (categoryKey) {
        case 'gratitude':
          return 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)';
        case 'morning':
          return 'linear-gradient(135deg, #fef3c7 0%, #fde047 50%, #eab308 100%)';
        case 'bedtime':
          return 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #312e81 100%)';
        case 'healing':
          return 'linear-gradient(135deg, #dcfce7 0%, #22c55e 50%, #16a34a 100%)';
        case 'family':
          return 'linear-gradient(135deg, #fecaca 0%, #f87171 50%, #dc2626 100%)';
        case 'grace':
          return 'linear-gradient(135deg, #e0e7ff 0%, #8b5cf6 50%, #7c3aed 100%)';
        case 'bibleVerses':
          return 'linear-gradient(135deg, #fed7aa 0%, #fb923c 50%, #ea580c 100%)';
        default:
          return 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 50%, #64748b 100%)';
      }
    };
    
    // Ultra-detailed macOS-style icons
    const getDetailedIcon = () => {
      switch (categoryKey) {
        case 'gratitude':
          return (
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: 'relative', zIndex: 1 }}>
              <defs>
                <linearGradient id="gratitudeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {/* Heart shape */}
              <path d="M24,42 C24,42 6,30 6,18 C6,12 10,8 16,8 C19,8 22,10 24,13 C26,10 29,8 32,8 C38,8 42,12 42,18 C42,30 24,42 24,42 Z" 
                    fill="url(#gratitudeGrad)" filter="url(#glow)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
              {/* Sparkles */}
              <circle cx="18" cy="20" r="2" fill="#fff" opacity="0.8"/>
              <circle cx="30" cy="22" r="1.5" fill="#fff" opacity="0.6"/>
              <circle cx="24" cy="16" r="1" fill="#fff" opacity="0.9"/>
            </svg>
          );
        
        case 'morning':
          return (
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: 'relative', zIndex: 1 }}>
              <defs>
                <radialGradient id="sunGrad" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#fef3c7" />
                  <stop offset="70%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#eab308" />
                </radialGradient>
              </defs>
              {/* Sun rays */}
              {[0,45,90,135,180,225,270,315].map(angle => (
                <line key={angle} 
                      x1={24 + Math.cos(angle * Math.PI / 180) * 20} 
                      y1={24 + Math.sin(angle * Math.PI / 180) * 20}
                      x2={24 + Math.cos(angle * Math.PI / 180) * 16} 
                      y2={24 + Math.sin(angle * Math.PI / 180) * 16}
                      stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
              ))}
              {/* Sun circle */}
              <circle cx="24" cy="24" r="12" fill="url(#sunGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
              {/* Face */}
              <circle cx="20" cy="20" r="1.5" fill="#d97706"/>
              <circle cx="28" cy="20" r="1.5" fill="#d97706"/>
              <path d="M19,28 Q24,32 29,28" stroke="#d97706" strokeWidth="2" fill="none" strokeLinecap="round"/>
            </svg>
          );
          
        case 'bedtime':
          return (
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: 'relative', zIndex: 1 }}>
              <defs>
                <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#4f46e5" />
                  <stop offset="100%" stopColor="#312e81" />
                </linearGradient>
              </defs>
              {/* Crescent moon */}
              <path d="M30,8 C22,8 16,14 16,24 C16,34 22,40 30,40 C26,40 22,36 22,24 C22,12 26,8 30,8 Z" 
                    fill="url(#moonGrad)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
              {/* Stars */}
              {[[10,12],[38,16],[14,30],[36,32],[8,24]].map(([x,y], i) => (
                <g key={i}>
                  <path d={`M${x},${y-3} L${x+1},${y-1} L${x+3},${y} L${x+1},${y+1} L${x},${y+3} L${x-1},${y+1} L${x-3},${y} L${x-1},${y-1} Z`} 
                        fill="#fff" opacity={0.6 + i * 0.1}/>
                </g>
              ))}
            </svg>
          );
          
        case 'healing':
          return (
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: 'relative', zIndex: 1 }}>
              <defs>
                <linearGradient id="healingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#dcfce7" />
                  <stop offset="50%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>
              {/* Medical cross */}
              <rect x="20" y="8" width="8" height="32" fill="url(#healingGrad)" rx="2"/>
              <rect x="8" y="20" width="32" height="8" fill="url(#healingGrad)" rx="2"/>
              {/* Gentle glow */}
              <rect x="20" y="8" width="8" height="32" fill="rgba(255,255,255,0.2)" rx="2"/>
              <rect x="8" y="20" width="32" height="8" fill="rgba(255,255,255,0.2)" rx="2"/>
              {/* Healing particles */}
              <circle cx="12" cy="12" r="2" fill="#22c55e" opacity="0.6"/>
              <circle cx="36" cy="14" r="1.5" fill="#16a34a" opacity="0.7"/>
              <circle cx="14" cy="36" r="1" fill="#22c55e" opacity="0.8"/>
              <circle cx="34" cy="34" r="2" fill="#16a34a" opacity="0.5"/>
            </svg>
          );
          
        case 'family':
          return (
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: 'relative', zIndex: 1 }}>
              <defs>
                <linearGradient id="familyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fecaca" />
                  <stop offset="50%" stopColor="#f87171" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
              </defs>
              {/* Family figures */}
              {/* Parent 1 */}
              <circle cx="16" cy="16" r="4" fill="url(#familyGrad)"/>
              <rect x="12" y="20" width="8" height="12" fill="url(#familyGrad)" rx="2"/>
              {/* Parent 2 */}
              <circle cx="32" cy="16" r="4" fill="url(#familyGrad)"/>
              <rect x="28" y="20" width="8" height="12" fill="url(#familyGrad)" rx="2"/>
              {/* Child */}
              <circle cx="24" cy="26" r="3" fill="url(#familyGrad)"/>
              <rect x="21" y="29" width="6" height="8" fill="url(#familyGrad)" rx="2"/>
              {/* Hearts */}
              <path d="M24,40 C24,40 18,36 18,32 C18,30 19,29 21,29 C22,29 23,30 24,31 C25,30 26,29 27,29 C29,29 30,30 30,32 C30,36 24,40 24,40 Z" 
                    fill="#fff" opacity="0.8"/>
            </svg>
          );
          
        case 'grace':
          return (
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: 'relative', zIndex: 1 }}>
              <defs>
                <linearGradient id="graceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e0e7ff" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              {/* Dove silhouette */}
              <path d="M12,20 Q16,16 24,18 Q32,20 36,16 Q38,18 36,22 Q34,24 32,24 Q28,26 24,25 Q20,24 16,26 Q14,24 12,22 Q10,20 12,20 Z" 
                    fill="url(#graceGrad)"/>
              {/* Wing details */}
              <path d="M16,22 Q20,20 24,22 Q28,20 32,22" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"/>
              {/* Olive branch */}
              <path d="M24,25 Q26,28 28,30 Q30,32 32,30" stroke="#22c55e" strokeWidth="2" fill="none"/>
              <ellipse cx="29" cy="29" rx="2" ry="1" fill="#22c55e" opacity="0.8"/>
              <ellipse cx="31" cy="31" rx="1.5" ry="0.8" fill="#22c55e" opacity="0.8"/>
            </svg>
          );
          
        case 'bibleVerses':
          return (
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: 'relative', zIndex: 1 }}>
              <defs>
                <linearGradient id="bibleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fed7aa" />
                  <stop offset="50%" stopColor="#fb923c" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
              {/* Book cover */}
              <rect x="10" y="8" width="28" height="32" fill="url(#bibleGrad)" rx="2"/>
              <rect x="10" y="8" width="28" height="32" fill="rgba(255,255,255,0.1)" rx="2"/>
              {/* Cross on cover */}
              <rect x="22" y="16" width="4" height="16" fill="#fff" opacity="0.9" rx="1"/>
              <rect x="16" y="22" width="16" height="4" fill="#fff" opacity="0.9" rx="1"/>
              {/* Book spine */}
              <rect x="8" y="8" width="4" height="32" fill="#c2410c" rx="2"/>
              {/* Pages */}
              <rect x="12" y="10" width="24" height="28" fill="rgba(255,255,255,0.2)" rx="1"/>
              {/* Bookmark */}
              <rect x="32" y="8" width="3" height="16" fill="#dc2626"/>
              <path d="M32,24 L35,24 L33.5,20 Z" fill="#dc2626"/>
            </svg>
          );
          
        default:
          return (
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: 'relative', zIndex: 1 }}>
              <defs>
                <linearGradient id="defaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="50%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
              </defs>
              <circle cx="24" cy="24" r="16" fill="url(#defaultGrad)"/>
              <path d="M18,20 L30,20 M18,24 L30,24 M18,28 L26,28" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          );
      }
    };
    
    return (
      <button
        onClick={() => {
          setSelectedCategory(categoryKey);
          setShowCustomForm(isCustom);
          if (!isCustom) {
            setCurrentPrayer('');
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '20px',
          borderRadius: '20px',
          cursor: 'pointer',
          width: '100%',
          marginBottom: '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isSelected 
            ? 'rgba(59, 130, 246, 0.4)' 
            : 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isSelected 
            ? '1px solid rgba(255, 255, 255, 0.3)' 
            : '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: isSelected 
            ? '0 20px 40px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
            : '0 8px 25px -8px rgba(0, 0, 0, 0.3)',
          transform: isSelected ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)',
        }}
        onMouseOver={(e) => {
          if (!isSelected) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)';
            e.currentTarget.style.boxShadow = '0 12px 30px -8px rgba(0, 0, 0, 0.35)';
          }
        }}
        onMouseOut={(e) => {
          if (!isSelected) {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px -8px rgba(0, 0, 0, 0.3)';
          }
        }}
      >
        {/* 3D Icon Container */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: getIconGradient(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '20px',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Glossy highlight effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '50%',
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 100%)',
            borderRadius: '16px 16px 0 0'
          }} />
          
          {isCustom ? (
            <img src="/logo192.png" alt="Praying hands" style={{ 
              width: '32px', 
              height: '32px',
              filter: 'brightness(0) invert(1)',
              position: 'relative',
              zIndex: 1
            }} />
          ) : (
            getDetailedIcon()
          )}
        </div>
        
        {/* Text Content */}
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div style={{ 
            fontWeight: '600', 
            fontSize: '18px',
            color: 'white',
            marginBottom: '4px',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
          }}>
            {category.name}
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: 'rgba(255, 255, 255, 0.8)',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
          }}>
            {category.description}
          </div>
        </div>
        
        {/* Selection Indicator */}
        {isSelected && (
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ 
              width: '8px', 
              height: '8px', 
              background: 'rgba(255, 255, 255, 0.9)', 
              borderRadius: '50%',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }} />
          </div>
        )}
      </button>
    );
  };

  // User state is now managed by parent App component

  // OLD LOGIN CODE REMOVED - USING MOBILE SCREENS INSTEAD
  // Mobile screen router handles login state
  if (false && !user) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundImage: 'url(/111208-OO10MS-26.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1e40af',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          {/* Language Toggle */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
            <button
              onClick={() => changeLanguage(language === 'en' ? 'es' : 'en')}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: '500',
                color: 'rgba(255, 255, 255, 0.8)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(4px)'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 1)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              {language === 'en' ? '🇪🇸 Español' : '🇺🇸 English'}
            </button>
          </div>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#8b5cf6',
              marginBottom: '-10px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <img 
                src="/logo192.png" 
                alt="Praying Hands" 
                style={{
                  width: '72px',
                  height: '72px'
                }}
              />
            </div>
            <h1 style={{
              fontSize: '48px',
              fontWeight: '300',
              fontFamily: 'Georgia, "Times New Roman", Times, serif',
              background: 'linear-gradient(135deg, #4338ca, #7c3aed)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '8px',
              letterSpacing: '2px'
            }}>{t('appTitle')}</h1>
            <p style={{ color: '#6b7280', textAlign: 'center' }}>{t('appSubtitle')}</p>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <div style={{
                width: '96px',
                height: '4px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
                borderRadius: '2px'
              }}></div>
            </div>
          </div>

          {/* Login/Signup Form */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white', marginBottom: '8px', textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}>
                {showSignUp ? t('createAccount') : t('welcomeBack')}
              </h2>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '14px', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
                {showSignUp ? t('joinCommunity') : t('signInToContinue')}
              </p>
            </div>

            {authError && (
              <div style={{
                background: authError.includes('Check your email') ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: authError.includes('Check your email') ? 'rgba(134, 239, 172, 1)' : 'rgba(252, 165, 165, 1)',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px',
                textAlign: 'center',
                border: authError.includes('Check your email') ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}>
                {authError}
              </div>
            )}

            <form onSubmit={showSignUp ? handleSignUp : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {showSignUp && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'white', marginBottom: '8px', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
{t('fullName')}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('enterFullName')}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      fontSize: '16px',
                      textAlign: 'center',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    required
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'white', marginBottom: '8px', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
{t('emailAddress')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('enterEmail')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    fontSize: '16px',
                    textAlign: 'center',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'white', marginBottom: '8px', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
{t('password')}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('enterPassword')}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    fontSize: '16px',
                    textAlign: 'center',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                  required
                />
              </div>

              {showSignUp && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'white', marginBottom: '8px', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
{t('confirmPassword')}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('confirmYourPassword')}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      fontSize: '16px',
                      textAlign: 'center',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxSizing: 'border-box',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                style={{
                  width: '100%',
                  background: authLoading ? '#9ca3af' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: authLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => {
                  if (!authLoading) {
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.background = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
                  }
                }}
                onMouseOut={(e) => {
                  if (!authLoading) {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
                  }
                }}
              >
                {authLoading ? (showSignUp ? t('creatingAccount') : t('signingIn')) : (showSignUp ? t('createAccount') : t('signIn'))}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
                <span style={{ padding: '0 16px', color: '#6b7280', fontSize: '14px' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
              </div>

              {/* Continue as Guest Button - moved to top position */}
              <button
                onClick={() => {
                  setUser({ id: 'guest', email: 'guest@demo.com' });
                  setUserSession(null);
                  setShowSignUp(false);
                  setGuestPrayerCount(getGuestPrayerCount());
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  marginBottom: '12px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f9fafb';
                  e.target.style.color = '#374151';
                  e.target.style.borderColor = '#d1d5db';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#6b7280';
                  e.target.style.borderColor = '#e5e7eb';
                }}
              >
{t('continueAsGuest')}
              </button>

              {/* Google Sign In Button - moved to bottom position */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                style={{
                  width: '100%',
                  background: 'white',
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  border: '1px solid #d1d5db',
                  cursor: authLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  if (!authLoading) {
                    e.target.style.background = '#f9fafb';
                    e.target.style.borderColor = '#9ca3af';
                  }
                }}
                onMouseOut={(e) => {
                  if (!authLoading) {
                    e.target.style.background = 'white';
                    e.target.style.borderColor = '#d1d5db';
                  }
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
{t('continueWithGoogle')}
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {showSignUp ? t('alreadyHaveAccount') : t('dontHaveAccount')}
                <button
                  onClick={() => {
                    setShowSignUp(!showSignUp);
                    setAuthError('');
                  }}
                  style={{
                    color: '#6366f1',
                    fontWeight: '500',
                    marginLeft: '8px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#4338ca'}
                  onMouseOut={(e) => e.target.style.color = '#6366f1'}
                >
                  {showSignUp ? t('signIn') : t('signUp')}
                </button>
              </p>
            </div>


            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <div style={{
                  width: '48px',
                  height: '2px',
                  background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)',
                  borderRadius: '1px'
                }}></div>
              </div>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>
                Create an account to save your prayers
              </p>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px', fontStyle: 'italic' }}>
                Having trouble with Google sign-in on mobile? Try the Guest option above!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // OLD MAIN APP REMOVED - USING MOBILE SCREENS INSTEAD
  // Mobile screen router handles all states
  if (false) return (
    <div style={{
      minHeight: '100vh',
      background: `url('/111208-OO10MS-26.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      padding: '16px'
    }}>
      <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
        {/* Language Toggle */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
          <button
            onClick={() => changeLanguage(language === 'en' ? 'es' : 'en')}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backdropFilter: 'blur(4px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 1)';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.9)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            {language === 'en' ? '🇪🇸 Español' : '🇺🇸 English'}
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#8b5cf6',
              marginBottom: '-10px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <img 
                src="/logo192.png" 
                alt="Praying Hands" 
                style={{
                  width: '72px',
                  height: '72px'
                }}
              />
            </div>
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '300',
            color: 'white',
            marginBottom: '8px',
            letterSpacing: '2px',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
          }}>{t('appTitle')}</h1>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' }}>{t('appSubtitle')}</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <div style={{
              width: '96px',
              height: '4px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
              borderRadius: '2px'
            }}></div>
          </div>
          
          {/* User info */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px', margin: 0, textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
              Welcome, {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>


          {/* Usage Counter for all non-premium users */}
          {!isPremium && (
            <div style={{
              background: (userSession && user?.id !== 'guest' ? dailyPrayerCount : guestPrayerCount) >= 3 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)',
              border: `1px solid ${(userSession && user?.id !== 'guest' ? dailyPrayerCount : guestPrayerCount) >= 3 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`,
              borderRadius: '8px',
              padding: '12px 16px',
              marginTop: '16px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}>
              <div style={{
                color: (userSession && user?.id !== 'guest' ? dailyPrayerCount : guestPrayerCount) >= 3 ? 'rgba(252, 165, 165, 1)' : 'rgba(147, 197, 253, 1)',
                fontSize: '14px',
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}>
                {(userSession && user?.id !== 'guest' ? dailyPrayerCount : guestPrayerCount) >= 3 
                  ? '⚠️ Daily limit reached' 
                  : `🎯 ${3 - (userSession && user?.id !== 'guest' ? dailyPrayerCount : guestPrayerCount)} prayers left today`}
              </div>
              {(userSession && user?.id !== 'guest' ? dailyPrayerCount : guestPrayerCount) >= 3 && (
                <div style={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '12px',
                  marginTop: '4px'
                }}>
                  {(userSession && user?.id !== 'guest') ? 'Upgrade to Premium for unlimited prayers' : 'Sign up for unlimited prayers'}
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Categories */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '16px', textAlign: 'center', textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}>{t('chooseCategory')}</h2>
            {Object.entries(prayerCategories).map(([key, category]) => (
              <CategoryButton key={key} categoryKey={key} category={category} />
            ))}
          </div>

          {/* Prayer Display */}
          <div>
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {showCustomForm ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', gap: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: '#8b5cf6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                      <img src="/logo192.png" alt="Praying hands" style={{ width: '24px', height: '24px' }} />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'white', margin: 0, textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}>
                      Create Custom Prayer
                    </h2>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    {/* Who is this prayer for? */}
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'white', marginBottom: '8px', textAlign: 'center', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
                        This prayer is for:
                      </label>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                        <button
                          onClick={() => setPrayerFor('myself')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '2px solid',
                            borderColor: prayerFor === 'myself' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                            backgroundColor: prayerFor === 'myself' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                            color: prayerFor === 'myself' ? 'rgba(199, 210, 254, 1)' : 'rgba(255, 255, 255, 0.8)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <User size={18} />
                          <span>Myself</span>
                        </button>
                        <button
                          onClick={() => setPrayerFor('someone')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: '2px solid',
                            borderColor: prayerFor === 'someone' ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                            backgroundColor: prayerFor === 'someone' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                            color: prayerFor === 'someone' ? 'rgba(221, 214, 254, 1)' : 'rgba(255, 255, 255, 0.8)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Users size={18} />
                          <span>Someone else</span>
                        </button>
                      </div>
                    </div>

                    {/* Person's name */}
                    {prayerFor === 'someone' && (
                      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'white', marginBottom: '8px', textAlign: 'center', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
                          Person's name:
                        </label>
                        <input
                          type="text"
                          value={personName}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Limit name length and basic filtering
                            if (value.length <= 50) {
                              setPersonName(value);
                            }
                          }}
                          maxLength={50}
                          placeholder="Enter their name..."
                          style={{
                            width: '200px',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            textAlign: 'center',
                            outline: 'none'
                          }}
                        />
                      </div>
                    )}

                    {/* Special occasion */}
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'white', marginBottom: '8px', textAlign: 'center', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
                        Special occasion (optional):
                      </label>
                      <select
                        value={selectedOccasion}
                        onChange={(e) => setSelectedOccasion(e.target.value)}
                        style={{
                          width: '250px',
                          padding: '8px 12px',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '14px',
                          textAlign: 'center',
                          outline: 'none'
                        }}
                      >
                        <option value="">Select an occasion (optional)</option>
                        <option value="christmas">Christmas/Advent</option>
                        <option value="easter">Easter/Lent</option>
                        <option value="thanksgiving">Thanksgiving</option>
                        <option value="new-year">New Year</option>
                        <option value="birthday">Birthday</option>
                        <option value="wedding">Wedding/Anniversary</option>
                        <option value="graduation">Graduation</option>
                        <option value="new-job">New Job/Career</option>
                        <option value="travel">Travel/Journey</option>
                        <option value="pregnancy">Pregnancy/New Baby</option>
                        <option value="addiction">Addiction Recovery</option>
                        <option value="funeral">Funeral/Grief</option>
                        <option value="surgery">Hospital/Surgery</option>
                        <option value="illness">Illness/Disease</option>
                        <option value="mental-health">Mental Health</option>
                        <option value="relationship">Relationship Issues</option>
                        <option value="financial">Financial Struggles</option>
                        <option value="forgiveness">Forgiveness</option>
                        <option value="guidance">Seeking Guidance</option>
                        <option value="protection">Protection/Safety</option>
                        <option value="strength">Strength/Courage</option>
                        <option value="peace">Peace/Anxiety</option>
                      </select>
                    </div>

                    {/* Prayer length */}
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'white', marginBottom: '8px', textAlign: 'center', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
                        Prayer length:
                      </label>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <button
                          onClick={() => setPrayerLength('brief')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '2px solid',
                            borderColor: prayerLength === 'brief' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                            backgroundColor: prayerLength === 'brief' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                            color: prayerLength === 'brief' ? '#047857' : '#374151',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
{t('briefBeautiful')}
                        </button>
                        <button
                          onClick={() => setPrayerLength('medium')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '2px solid',
                            borderColor: prayerLength === 'medium' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                            backgroundColor: prayerLength === 'medium' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                            color: prayerLength === 'medium' ? '#4338ca' : '#374151',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
{t('perfectlyTimed')}
                        </button>
                        <button
                          onClick={() => setPrayerLength('comprehensive')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '2px solid',
                            borderColor: prayerLength === 'comprehensive' ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                            backgroundColor: prayerLength === 'comprehensive' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                            color: prayerLength === 'comprehensive' ? '#7c3aed' : '#374151',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
{t('richMeaningful')}
                        </button>
                      </div>
                    </div>

                    {/* Prayer request */}
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: 'white', marginBottom: '8px', textAlign: 'center', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
                        What would you like to pray about?
                      </label>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        width: '100%',
                        margin: '0 auto'
                      }}>
                        <textarea
                          value={customRequest}
                          onChange={(e) => {
                            const value = e.target.value;
                            // Limit input length
                            if (value.length <= 500) {
                              setCustomRequest(value);
                            }
                          }}
                          placeholder="Describe your prayer here..."
                          maxLength={500}
                          rows={3}
                          style={{
                            width: '100%',
                            maxWidth: '400px',
                            minWidth: '280px',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            resize: 'none',
                            outline: 'none',
                            boxSizing: 'border-box',
                            margin: '0 auto'
                          }}
                        />
                        <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '4px' }}>
                          {customRequest.length}/500 characters
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', textAlign: 'center', width: '100%' }}>
                      {prayerCategories[selectedCategory].name} Prayer
                    </h2>
                  </div>
                  
                  {/* Prayer length selection for all categories */}
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', textAlign: 'center' }}>
                      Prayer length:
                    </label>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                      <button
                        onClick={() => setPrayerLength('brief')}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '2px solid',
                          borderColor: prayerLength === 'brief' ? '#10b981' : '#d1d5db',
                          backgroundColor: prayerLength === 'brief' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                          color: prayerLength === 'brief' ? '#047857' : '#374151',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.2s ease'
                        }}
                      >
{t('briefBeautiful')}
                      </button>
                      <button
                        onClick={() => setPrayerLength('medium')}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '2px solid',
                          borderColor: prayerLength === 'medium' ? '#6366f1' : '#d1d5db',
                          backgroundColor: prayerLength === 'medium' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                          color: prayerLength === 'medium' ? '#4338ca' : '#374151',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.2s ease'
                        }}
                      >
{t('perfectlyTimed')}
                      </button>
                      <button
                        onClick={() => setPrayerLength('comprehensive')}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '2px solid',
                          borderColor: prayerLength === 'comprehensive' ? '#8b5cf6' : '#d1d5db',
                          backgroundColor: prayerLength === 'comprehensive' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                          color: prayerLength === 'comprehensive' ? '#7c3aed' : '#374151',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {t('richMeaningful')}
                      </button>
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', textAlign: 'center' }}>
                      {prayerLength === 'brief' && t('briefDesc')}
                      {prayerLength === 'medium' && t('mediumDesc')}
                      {prayerLength === 'comprehensive' && t('comprehensiveDesc')}
                    </p>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <button
                  onClick={generatePrayer}
                  disabled={isGenerating || (showCustomForm && !customRequest.trim())}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: (isGenerating || (showCustomForm && !customRequest.trim())) ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    background: (isGenerating || (showCustomForm && !customRequest.trim())) ? '#d1d5db' : (showCustomForm ? prayerCategories['custom'].color : prayerCategories[selectedCategory].color),
                    color: (isGenerating || (showCustomForm && !customRequest.trim())) ? '#6b7280' : 'white',
                    boxShadow: (isGenerating || (showCustomForm && !customRequest.trim())) ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transform: (isGenerating || (showCustomForm && !customRequest.trim())) ? 'scale(1)' : 'scale(1)'
                  }}
                  onMouseOver={(e) => {
                    if (!isGenerating) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.opacity = '0.9';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isGenerating) {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.opacity = '1';
                    }
                  }}
                >
                  <RefreshCw 
                    size={18} 
                    style={{ 
                      animation: isGenerating ? 'spin 1s linear infinite' : 'none' 
                    }} 
                  />
                  <span>{isGenerating ? t('generating') : t('generatePrayer')}</span>
                </button>
              </div>


              <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                {(currentPrayer && currentPrayer.trim() && !isGenerating) ? (
                  <div style={{ textAlign: 'center', width: '100%', maxWidth: '600px' }}>
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      padding: '24px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      margin: '0 auto 16px',
                      boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)'
                    }}>
                      <p style={{
                        fontSize: '18px',
                        color: 'white',
                        lineHeight: '1.6',
                        textAlign: 'center',
                        margin: 0,
                        textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
                      }}>
                        {currentPrayer}
                      </p>
                    </div>
                    
                    {/* Audio Controls */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '12px', 
                      marginBottom: '16px',
                      padding: '12px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      backdropFilter: 'blur(20px)',
                      WebkitBackdropFilter: 'blur(20px)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 4px 15px -4px rgba(0, 0, 0, 0.3)'
                    }}>
                      <Volume2 size={20} color="rgba(255, 255, 255, 0.8)" />
                      
                      {!isPlaying ? (
                        <button
                          onClick={() => speakPrayer(currentPrayer)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 12px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          title="Listen to prayer"
                        >
                          <Play size={16} />
                          Listen
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {!isPaused ? (
                            <button
                              onClick={pauseSpeech}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '8px 12px',
                                backgroundColor: '#f59e0b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                cursor: 'pointer'
                              }}
                              title="Pause"
                            >
                              <Pause size={16} />
                            </button>
                          ) : (
                            <button
                              onClick={resumeSpeech}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '8px 12px',
                                backgroundColor: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                cursor: 'pointer'
                              }}
                              title="Resume"
                            >
                              <Play size={16} />
                            </button>
                          )}
                          
                          <button
                            onClick={stopSpeech}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '8px 12px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '14px',
                              cursor: 'pointer'
                            }}
                            title="Stop"
                          >
                            <Square size={16} />
                          </button>
                        </div>
                      )}
                      
                      <button
                        onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px',
                          backgroundColor: 'transparent',
                          color: '#64748b',
                          border: '1px solid #cbd5e1',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'background-color 0.2s'
                        }}
                        title="Voice settings"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                    
                    {/* Voice Settings Panel */}
                    {showVoiceSettings && (
                      <div style={{
                        marginBottom: '16px',
                        padding: '16px',
                        background: 'rgba(15, 23, 42, 0.6)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        textAlign: 'center',
                        boxShadow: '0 4px 15px -4px rgba(0, 0, 0, 0.3)'
                      }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: 'white', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
                          Voice Settings
                        </h4>
                        
                        {/* Voice Quality Selection */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px', display: 'block', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
                            Voice Quality:
                          </label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setUseHumanVoice(false)}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                backgroundColor: !useHumanVoice ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                                color: !useHumanVoice ? 'white' : 'rgba(255, 255, 255, 0.8)',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              🤖 System
                            </button>
                            <button
                              onClick={() => setUseHumanVoice(true)}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                backgroundColor: useHumanVoice ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                                color: useHumanVoice ? 'white' : 'rgba(255, 255, 255, 0.8)',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              🎭 Human-like
                            </button>
                          </div>
                        </div>

                        {/* Voice Tier Selection */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '8px', display: 'block', textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>
                            Choose voice tier:
                          </label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setTtsProvider('browser')}
                              style={{
                                flex: 1,
                                padding: '10px 16px',
                                backgroundColor: ttsProvider === 'browser' ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                                color: ttsProvider === 'browser' ? 'white' : 'rgba(255, 255, 255, 0.8)',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              Free
                            </button>
                            <button
                              onClick={() => setTtsProvider('azure')}
                              style={{
                                flex: 1,
                                padding: '10px 16px',
                                backgroundColor: ttsProvider === 'azure' ? '#6366f1' : 'rgba(255, 255, 255, 0.1)',
                                color: ttsProvider === 'azure' ? 'white' : 'rgba(255, 255, 255, 0.8)',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '13px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              Premium
                            </button>
                          </div>
                        </div>

                        {/* System Voice Selection */}
                        {!useHumanVoice && (
                          <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                              Select System Voice:
                            </label>
                            <select
                              value={selectedVoice?.name || ''}
                              onChange={(e) => {
                                const voice = availableVoices.find(v => v.name === e.target.value);
                                setSelectedVoice(voice);
                              }}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '13px',
                                backgroundColor: 'white'
                              }}
                            >
                              {availableVoices
                                .filter(voice => voice.lang.startsWith('en'))
                                .map((voice) => (
                                  <option key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                  </option>
                                ))}
                            </select>
                          </div>
                        )}

                        {/* FREE TIER: System voices */}
                        {ttsProvider === 'browser' && (
                          <div style={{
                            textAlign: 'center',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '14px',
                            padding: '16px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }}>
                            🎤 Using system voices (Free tier)
                            <div style={{ fontSize: '12px', marginTop: '4px' }}>
                              {useHumanVoice ? 'Enhanced browser voices' : 'Standard device voices'}
                            </div>
                          </div>
                        )}

                        {/* PREMIUM TIER: Azure Cognitive Services Voices */}
                        {ttsProvider === 'azure' && (
                              <div>
                                <div style={{ 
                                  textAlign: 'center', 
                                  fontSize: '14px', 
                                  color: '#6366f1', 
                                  padding: '12px 20px',
                                  backgroundColor: '#f0f9ff',
                                  borderRadius: '8px',
                                  border: '1px solid #bfdbfe',
                                  marginBottom: '16px'
                                }}>
                                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>🎭</div>
                                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                                    Azure Premium Neural Voices
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.3' }}>
                                    High-quality neural voices with emotional range
                                  </div>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                                  <select 
                                    value={selectedVoice || 'en-US-AvaMultilingualNeural'}
                                    onChange={(e) => setSelectedVoice(e.target.value)}
                                    style={{
                                      gridColumn: '1 / -1',
                                      padding: '8px 12px',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '6px',
                                      fontSize: '14px',
                                      backgroundColor: 'white'
                                    }}
                                  >
                                    <optgroup label="Premium Female Voices">
                                      <option value="en-US-AvaMultilingualNeural">Ava - Warm & Expressive</option>
                                      <option value="en-US-EmmaMultilingualNeural">Emma - Gentle & Soothing</option>
                                      <option value="en-US-AriaNeural">Aria - Natural & Dynamic</option>
                                      <option value="en-US-JennyNeural">Jenny - Friendly & Clear</option>
                                    </optgroup>
                                    <optgroup label="Premium Male Voices">
                                      <option value="en-US-AndrewMultilingualNeural">Andrew - Professional & Clear</option>
                                      <option value="en-US-BrianMultilingualNeural">Brian - Engaging & Confident</option>
                                      <option value="en-US-DavisNeural">Davis - Professional & Polished</option>
                                      <option value="en-US-GuyNeural">Guy - Calm & Measured</option>
                                    </optgroup>
                                    <optgroup label="International">
                                      <option value="en-GB-SoniaNeural">Sonia - British Accent</option>
                                      <option value="en-GB-RyanNeural">Ryan - British Accent</option>
                                      <option value="en-AU-NatashaNeural">Natasha - Australian Accent</option>
                                    </optgroup>
                                  </select>
                                </div>
                                
                                <div style={{ textAlign: 'center', fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                                  💡 Premium neural voices provide natural speech with emotional expression
                                </div>
                              </div>
                            )}


                            
                            <div style={{ 
                              fontSize: '11px', 
                              color: '#9ca3af', 
                              marginTop: '8px', 
                              padding: '8px',
                              backgroundColor: '#f9fafb',
                              borderRadius: '4px',
                              border: '1px solid #f3f4f6'
                            }}>
                              💡 Choose your preferred voice tier above.
                            </div>

                        {!useHumanVoice && (
                          <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                              Select System Voice:
                            </label>
                            <select
                              value={selectedVoice?.name || ''}
                              onChange={(e) => {
                                const voice = availableVoices.find(v => v.name === e.target.value);
                                setSelectedVoice(voice);
                              }}
                              style={{
                                width: '100%',
                                padding: '6px 8px',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px'
                              }}
                            >
                              {availableVoices
                                .filter(voice => voice.lang.startsWith('en'))
                                .map((voice, index) => (
                                  <option key={index} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                  </option>
                                ))}
                            </select>
                            
                            <div style={{ marginTop: '8px' }}>
                              <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px', display: 'block' }}>
                                Speed: {speechRate}x
                              </label>
                              <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={speechRate}
                                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                                style={{ width: '100%' }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Share button */}
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <button
                        onClick={() => setShowShareModal(true)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 16px',
                          backgroundColor: '#6366f1',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#5856eb'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#6366f1'}
                      >
                        <Share2 size={16} />
                        Share this prayer
                      </button>
                      
                      {shareSuccess && (
                        <div style={{
                          marginTop: '8px',
                          padding: '4px 8px',
                          backgroundColor: '#dcfce7',
                          color: '#166534',
                          borderRadius: '4px',
                          fontSize: '12px',
                          display: 'inline-block'
                        }}>
                          {shareSuccess}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ color: '#6b7280', textAlign: 'center' }}>
                      <div style={{
                        width: '64px',
                        height: '2px',
                        background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)',
                        margin: '0 auto 8px'
                      }}></div>
                      <p style={{ fontSize: '14px', margin: 0 }}>May this prayer bring you peace and guidance</p>
                    </div>

                    {/* Prayer History and Sign Out buttons - also show when prayer is displayed */}
                    {user && (
                      <div style={{ 
                        marginTop: '24px', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <button
                          onClick={downloadPrayerImage}
                          disabled={!currentPrayer}
                          style={{
                            background: currentPrayer ? '#059669' : '#999',
                            border: 'none',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: currentPrayer ? 'pointer' : 'not-allowed',
                            transition: 'background-color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseOver={(e) => {
                            if (currentPrayer) e.target.style.backgroundColor = '#047857';
                          }}
                          onMouseOut={(e) => {
                            if (currentPrayer) e.target.style.backgroundColor = '#059669';
                          }}
                        >
                          Download Image
                        </button>
                        
                        <button
                          onClick={openPrayerHistory}
                          style={{
                            background: '#6366f1',
                            border: 'none',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#4f46e5'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#6366f1'}
                        >
                          {t('prayerHistory')}
                        </button>
                        
                        {/* Premium Status / Upgrade Button */}
                        {isPremium ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>
                            <Crown size={14} />
                            Premium
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowUpgradeModal(true)}
                            style={{
                              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              border: 'none',
                              color: 'white',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                          >
                            <Crown size={14} />
                            Upgrade
                          </button>
                        )}
                        
                        {/* Guest sign out button */}
                        {user && user.id === 'guest' && (
                          <button
                            onClick={handleSignOut}
                            style={{
                              background: '#dc2626',
                              border: 'none',
                              color: 'white',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                          >
                            Sign Out
                          </button>
                        )}
                        
                        {user && user.id !== 'guest' && (
                          <button
                            onClick={handleSignOut}
                            style={{
                              background: '#dc2626',
                              border: 'none',
                              color: 'white',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                          >
                            Sign Out
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: '#6b7280' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      background: prayerCategories[selectedCategory].color,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: prayerCategories[selectedCategory].color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {(selectedCategory === 'gratitude' || !selectedCategory) && (
                          <img 
                            src="/logo192.png" 
                            alt="Praying Hands" 
                            style={{ width: '36px', height: '36px', filter: 'brightness(0) invert(1)' }} 
                          />
                        )}
                        {selectedCategory === 'morning' && <Sun size={36} color="white" />}
                        {selectedCategory === 'bedtime' && <Moon size={36} color="white" />}
                        {selectedCategory === 'healing' && <Sparkles size={36} color="white" />}
                        {selectedCategory === 'family' && <Users size={36} color="white" />}
                        {selectedCategory === 'grace' && <Utensils size={36} color="white" />}
                        {selectedCategory === 'bibleVerses' && <Book size={36} color="white" />}
                        {selectedCategory === 'custom' && (
                          <img src="/logo192.png" alt="Praying hands" style={{ 
                            width: '43px', 
                            height: '43px',
                            filter: 'brightness(0) invert(1)'
                          }} />
                        )}
                      </div>
                    </div>
                    <p style={{ fontSize: '18px', marginBottom: '8px', textAlign: 'center' }}>
                      Ready to generate a {prayerCategories[selectedCategory].name.toLowerCase()} prayer
                    </p>
                    <p style={{ fontSize: '14px', textAlign: 'center', margin: 0 }}>
                      Click "Generate Prayer" to begin
                    </p>
                    
                    {/* Prayer History and Sign Out buttons */}
                    {user && (
                      <div style={{ 
                        marginTop: '16px', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}>
                        <button
                          onClick={downloadPrayerImage}
                          disabled={!currentPrayer}
                          style={{
                            background: currentPrayer ? '#059669' : '#999',
                            border: 'none',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: currentPrayer ? 'pointer' : 'not-allowed',
                            transition: 'background-color 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                          onMouseOver={(e) => {
                            if (currentPrayer) e.target.style.backgroundColor = '#047857';
                          }}
                          onMouseOut={(e) => {
                            if (currentPrayer) e.target.style.backgroundColor = '#059669';
                          }}
                        >
                          Download Image
                        </button>
                        
                        <button
                          onClick={openPrayerHistory}
                          style={{
                            background: '#6366f1',
                            border: 'none',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#4f46e5'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#6366f1'}
                        >
                          {t('prayerHistory')}
                        </button>
                        
                        {/* Premium Status / Upgrade Button */}
                        {isPremium ? (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                            color: 'white',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}>
                            <Crown size={14} />
                            Premium
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowUpgradeModal(true)}
                            style={{
                              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                              border: 'none',
                              color: 'white',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                          >
                            <Crown size={14} />
                            Upgrade
                          </button>
                        )}
                        
                        {/* Guest sign out button */}
                        {user && user.id === 'guest' && (
                          <button
                            onClick={handleSignOut}
                            style={{
                              background: '#dc2626',
                              border: 'none',
                              color: 'white',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                          >
                            Sign Out
                          </button>
                        )}
                        
                        {user && user.id !== 'guest' && (
                          <button
                            onClick={handleSignOut}
                            style={{
                              background: '#dc2626',
                              border: 'none',
                              color: 'white',
                              padding: '8px 16px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#b91c1c'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#dc2626'}
                          >
                            Sign Out
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


        <div style={{ marginTop: '32px', textAlign: 'center', color: '#6b7280', fontSize: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
            <div style={{
              width: '48px',
              height: '2px',
              background: 'linear-gradient(135deg, #a5b4fc, #c4b5fd)',
              borderRadius: '1px'
            }}></div>
          </div>
          <p style={{ margin: 0 }}>Take a moment to reflect, find peace, and connect with what matters most to you.</p>
        </div>
      </div>

      {/* Sharing Modal */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: 'white', textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}>
                Share this prayer
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            {/* Anonymous sharing toggle */}
            <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={shareAnonymously}
                  onChange={(e) => setShareAnonymously(e.target.checked)}
                  style={{ marginRight: '8px' }}
                />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  Share anonymously (your name won't be included)
                </span>
              </label>
            </div>

            {/* Audio Sharing */}
            {currentAudioBlob && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>
                  🎵 Share audio recording
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
                  <button
                    onClick={() => socialSharing.downloadAudio()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      backgroundColor: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    📥 Download MP3
                  </button>

                  <button
                    onClick={() => socialSharing.copyAudioInfo()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      backgroundColor: '#7c3aed',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    📋 Copy Info
                  </button>

                  <button
                    onClick={() => socialSharing.shareAudioToWhatsApp()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      backgroundColor: '#25d366',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    🎤 WhatsApp
                  </button>

                  <button
                    onClick={() => socialSharing.shareAudioToMessages()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 12px',
                      backgroundColor: '#007aff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    🎤 Messages
                  </button>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  backgroundColor: '#f3f4f6', 
                  padding: '8px', 
                  borderRadius: '4px' 
                }}>
                  💡 Generate audio first by clicking "Listen", then share the beautiful human-like voice recording!
                </div>
              </div>
            )}

            {/* Social Media Sharing */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>
                🌐 Share text on social media
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <button
                  onClick={() => {
                    // Instagram sharing
                    navigator.clipboard.writeText(`🙏 Beautiful prayer created with Help Me Pray app!\n\n${currentPrayer}\n\n#Prayer #Faith #HelpMePray\n\nDownload: helmpmeray.app`).then(() => {
                      alert('Prayer text copied! Now opening Instagram - paste this with your prayer.');
                      window.open('https://www.instagram.com/', '_blank');
                    });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    background: 'linear-gradient(135deg, #e4405f, #c13584)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <Instagram size={16} />
                  Instagram
                </button>
                
                <button
                  onClick={() => socialSharing.shareToWhatsApp(currentPrayer)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#25d366',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </button>
                
                <button
                  onClick={() => socialSharing.shareToFacebook(currentPrayer)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#1877f2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <Facebook size={16} />
                  Facebook
                </button>
                
                <button
                  onClick={() => socialSharing.shareToMessages(currentPrayer)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#007aff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <Smartphone size={16} />
                  Messages
                </button>
              </div>
            </div>

            {/* Personal Sharing */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '500', color: '#1f2937', marginBottom: '12px' }}>
                📧 Share with someone special
              </h4>
              <div style={{ marginBottom: '12px' }}>
                <input
                  type="email"
                  placeholder="Enter email address..."
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <textarea
                  placeholder="Add a personal message (optional)..."
                  value={personalMessage}
                  onChange={(e) => setPersonalMessage(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    resize: 'none',
                    outline: 'none'
                  }}
                />
              </div>
              <button
                onClick={() => {
                  // TODO: Implement email sharing
                  alert('Email sharing coming soon!');
                }}
                disabled={!recipientEmail}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: recipientEmail ? '#6366f1' : '#d1d5db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: recipientEmail ? 'pointer' : 'not-allowed',
                  transition: 'background-color 0.2s'
                }}
              >
                Send Prayer
              </button>
            </div>
            
            {/* Close button */}
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={() => setShowShareModal(false)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: 'rgba(255, 255, 255, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Prayer History Modal */}
      {showPrayerHistory && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '12px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, color: 'white', fontSize: '24px', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)' }}>
                {t('myPrayers')}
              </h2>
              <button
                onClick={() => setShowPrayerHistory(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: 'rgba(255, 255, 255, 0.8)',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{
              padding: '24px',
              maxHeight: '60vh',
              overflowY: 'auto'
            }}>
              {loadingHistory ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  {t('loadingPrayers')}
                </div>
              ) : prayerHistory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  {t('noPrayers')}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {prayerHistory.map((prayer, index) => (
                    <div key={index} style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '16px',
                      backgroundColor: '#f9fafb'
                    }}>
                      <div style={{
                        fontSize: '12px',
                        color: 'rgba(255, 255, 255, 0.8)',
                        marginBottom: '8px'
                      }}>
                        {t('createdOn')} {new Date(prayer.created_at).toLocaleString()}
                        {prayer.category && ` • ${prayer.category.charAt(0).toUpperCase() + prayer.category.slice(1)}`}
                      </div>
                      <div style={{
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.6',
                        color: '#374151'
                      }}>
                        {prayer.prayer_content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{
              padding: '24px',
              borderTop: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <button
                onClick={() => setShowPrayerHistory(false)}
                style={{
                  backgroundColor: '#6366f1',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '6px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{
              padding: '24px',
              textAlign: 'center'
            }}>
              <div style={{
                backgroundColor: '#fef3c7',
                color: '#d97706',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '48px'
              }}>
                👑
              </div>
              <h2 style={{ margin: '0 0 16px 0', color: '#1f2937', fontSize: '24px', fontWeight: 'bold' }}>
                Daily Limit Reached
              </h2>
              <p style={{ color: '#6b7280', marginBottom: '16px', lineHeight: '1.5' }}>
                You've used your {dailyPrayerCount}/3 free prayers today. Upgrade to Premium for unlimited prayers and premium voices!
              </p>
              
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
                textAlign: 'left'
              }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#1f2937', fontSize: '18px' }}>Premium Benefits:</h3>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#4b5563' }}>
                  <li>✨ Unlimited prayers</li>
                  <li>🎙️ Premium ElevenLabs voices</li>
                  <li>📚 Prayer history with search</li>
                  <li>🌍 Multiple languages</li>
                  <li>📤 Audio export & sharing</li>
                </ul>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    // TODO: Implement Stripe checkout
                    alert('Stripe integration coming soon! Check back tomorrow for your free prayers to reset.');
                  }}
                  style={{
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  Upgrade to Premium - $4.99/month
                </button>
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: 'rgba(255, 255, 255, 0.8)',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Upgrade Modal */}
      {/* <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      /> */}

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  // ===== MOBILE SCREEN ARCHITECTURE =====
  
  // Categories for mobile screens
  const categories = [
    { key: 'gratitude', name: t('gratitude') },
    { key: 'morning', name: t('morning') },
    { key: 'bedtime', name: t('bedtime') },
    { key: 'healing', name: t('healing') },
    { key: 'family', name: t('family') },
    { key: 'grace', name: t('grace') },
    { key: 'bibleVerses', name: t('bibleVerses') },
    { key: 'custom', name: t('custom') }
  ];

  // Mobile Screen Router
  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return renderLoginScreen();
      case 'prayer-selection':
        return renderPrayerSelectionScreen();
      case 'prayer-generation':
        return renderPrayerGenerationScreen();
      case 'prayer-view':
        return renderPrayerViewScreen();
      case 'prayer-sharing':
        return renderPrayerSharingScreen();
      case 'audio-sharing':
        return renderAudioSharingScreen();
      case 'image-sharing':
        return renderImageSharingScreen();
      case 'unified-sharing':
        return renderUnifiedSharingScreen();
      default:
        return renderLoginScreen();
    }
  };

  // Screen 1: Login Screen
  const renderLoginScreen = () => {
    if (user) {
      setCurrentScreen('prayer-selection');
      return null;
    }
    
    return (
      <div style={{
        minHeight: '100vh',
        backgroundImage: 'url(/111208-OO10MS-26.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1e40af',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* App Title */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              marginBottom: '8px'
            }}>
              <img 
                src="/prayhands.png" 
                alt="Praying hands" 
                style={{ 
                  width: '120px', 
                  height: '120px',
                  filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
                }} 
              />
              <h1 style={{ 
                color: 'white', 
                fontSize: '36px', 
                fontWeight: '600',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                margin: '0'
              }}>
                Help Me Pray App
              </h1>
            </div>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '16px',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' 
            }}>
              Find peace through prayer
            </p>
          </div>

          {/* Login Form */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '30px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
          }}>
            <div style={{ display: 'grid', gap: '15px' }}>
              <button
                onClick={handleGoogleSignIn}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              >
                <User size={20} />
                Continue with Google
              </button>
              
              <button
                onClick={() => setUser({ id: 'guest', email: 'guest@demo.com' })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
              >
                <UserCheck size={20} />
                Continue as Guest
              </button>

              {/* Divider */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                margin: '20px 0'
              }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.3)' }}></div>
                <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>or</span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.3)' }}></div>
              </div>

              {/* Email/Password Sign In Form */}
              {!showSignUp ? (
                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: 'white', 
                      marginBottom: '8px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' 
                    }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '16px',
                        backdropFilter: 'blur(10px)',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: 'white', 
                      marginBottom: '8px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' 
                    }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '16px',
                        backdropFilter: 'blur(10px)',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Enter your password"
                    />
                  </div>

                  {authError && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      color: '#fca5a5',
                      fontSize: '14px',
                      textAlign: 'center'
                    }}>
                      {authError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '12px',
                      border: 'none',
                      background: authLoading ? 'rgba(107, 114, 128, 0.6)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: authLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {authLoading ? 'Signing In...' : 'Sign In'}
                  </button>
                </form>
              ) : (
                // Sign Up Form
                <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: 'white', 
                      marginBottom: '8px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' 
                    }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '16px',
                        backdropFilter: 'blur(10px)',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: 'white', 
                      marginBottom: '8px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' 
                    }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '16px',
                        backdropFilter: 'blur(10px)',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: 'white', 
                      marginBottom: '8px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' 
                    }}>
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '16px',
                        backdropFilter: 'blur(10px)',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Enter your password"
                    />
                    {/* Password strength indicator */}
                    {password && (
                      <div style={{ marginTop: '8px' }}>
                        <div style={{ 
                          display: 'flex', 
                          gap: '2px', 
                          marginBottom: '6px' 
                        }}>
                          {[1, 2, 3, 4, 5].map((level) => {
                            const passwordStrength = (() => {
                              let score = 0;
                              if (password.length >= 8) score++;
                              if (/[A-Z]/.test(password)) score++;
                              if (/[a-z]/.test(password)) score++;
                              if (/\d/.test(password)) score++;
                              if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
                              return score;
                            })();
                            
                            return (
                              <div
                                key={level}
                                style={{
                                  height: '4px',
                                  flex: 1,
                                  borderRadius: '2px',
                                  background: level <= passwordStrength 
                                    ? passwordStrength <= 2 ? '#ef4444' 
                                      : passwordStrength <= 3 ? '#f59e0b' 
                                      : '#10b981'
                                    : 'rgba(255, 255, 255, 0.2)'
                                }}
                              />
                            );
                          })}
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: 'rgba(255, 255, 255, 0.7)' 
                        }}>
                          Password must contain: 8+ chars, uppercase, lowercase, number, special char
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: '500', 
                      color: 'white', 
                      marginBottom: '8px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' 
                    }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '16px',
                        backdropFilter: 'blur(10px)',
                        boxSizing: 'border-box'
                      }}
                      placeholder="Confirm your password"
                    />
                  </div>

                  {authError && (
                    <div style={{
                      background: authError.includes('✅') || authError.includes('Account created') 
                        ? 'rgba(16, 185, 129, 0.1)' 
                        : 'rgba(239, 68, 68, 0.1)',
                      border: authError.includes('✅') || authError.includes('Account created')
                        ? '1px solid rgba(16, 185, 129, 0.3)'
                        : '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      color: authError.includes('✅') || authError.includes('Account created')
                        ? '#6ee7b7'
                        : '#fca5a5',
                      fontSize: '14px',
                      textAlign: 'center'
                    }}>
                      {authError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={authLoading}
                    style={{
                      width: '100%',
                      padding: '16px',
                      borderRadius: '12px',
                      border: 'none',
                      background: authLoading ? 'rgba(107, 114, 128, 0.6)' : 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: authLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {authLoading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </form>
              )}

              {/* Sign Up / Sign In Toggle */}
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', margin: '0 0 8px 0' }}>
                  {showSignUp ? 'Already have an account?' : "Don't have an account?"}
                </p>
                <button
                  onClick={() => {
                    setShowSignUp(!showSignUp);
                    setAuthError('');
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setFullName('');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#60a5fa',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.color = '#3b82f6'}
                  onMouseOut={(e) => e.target.style.color = '#60a5fa'}
                >
                  {showSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Screen 2: Prayer Selection Screen
  const renderPrayerSelectionScreen = () => {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundImage: 'url(/111208-OO10MS-26.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1e40af',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            {/* App Title with Logo */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <img 
                src="/prayhands.png" 
                alt="Praying hands" 
                style={{ 
                  width: '80px', 
                  height: '80px',
                  filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
                }} 
              />
              <h1 style={{ 
                color: 'white', 
                fontSize: '28px', 
                fontWeight: '600',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                margin: '0'
              }}>
                Help Me Pray App
              </h1>
            </div>
            
            <h2 style={{ 
              color: 'white', 
              fontSize: '20px', 
              fontWeight: '600',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              marginBottom: '8px'
            }}>
              Choose Your Prayer
            </h2>
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.8)', 
              fontSize: '14px',
              textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)' 
            }}>
              Select a category that speaks to your heart
            </p>
          </div>

          {/* Category Buttons with Beautiful 3D Icons */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
            '@media (min-width: 768px)': {
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
            }
          }}>
            {categories.map((category) => {
              const categoryDescriptions = {
                gratitude: "Prayers for thanksgiving and expressing appreciation",
                morning: "Prayers to start your day with purpose and hope", 
                bedtime: "Prayers for reflection, rest, and peaceful sleep",
                healing: "Prayers for physical, emotional, and spiritual restoration",
                family: "Prayers for relationships and loved ones",
                grace: "Dedicated to blessing the meals",
                bibleVerses: "Prayers inspired by Scripture",
                custom: "Generate personalized prayers for any situation"
              };
              
              return (
                <button 
                  key={category.key} 
                  onClick={() => { 
                    setSelectedCategory(category.key); 
                    setShowCustomForm(true);  // ALL categories now show custom form
                    setCurrentScreen('prayer-generation');
                  }} 
                  style={{ 
                    padding: '0',
                    borderRadius: '18px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)',
                    transform: 'translateY(0)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.4), 0 6px 12px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  {/* Header Section - Darker Bluish Gray like Notes app */}
                  <div style={{
                    background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)',
                    padding: '12px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    borderTopLeftRadius: '16px',
                    borderTopRightRadius: '16px'
                  }}>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px'
                    }}>
                      <div>
                        {categoryIcons[category.key]}
                      </div>
                    </div>
                    <div style={{ 
                      fontWeight: '600',
                      fontSize: '16px',
                      color: '#ffffff',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
                      flex: 1,
                      textAlign: 'center',
                      lineHeight: '1.2'
                    }}>
                      {category.key === 'custom' ? (
                        <div style={{ lineHeight: '1.1', whiteSpace: 'pre-line' }}>
                          Create Custom{'\n'}Prayer
                        </div>
                      ) : (
                        category.name
                      )}
                    </div>
                  </div>

                  {/* Content Section - Black like Notes app */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.95)',
                    padding: '14px 20px',
                    borderBottomLeftRadius: '16px',
                    borderBottomRightRadius: '16px',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ 
                      fontSize: '13px',
                      color: 'white',
                      textAlign: 'center',
                      lineHeight: '1.4',
                      textShadow: '0 1px 3px rgba(0, 0, 0, 0.8)'
                    }}>
                      {categoryDescriptions[category.key]}
                    </span>
                  </div>
                </button>
            );
            })}
          </div>

          {/* Navigation and User Status - Same level, opposite sides */}
          <div style={{
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setUser(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '32px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.7'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              ←
            </button>
            
            {/* User Status Indicator */}
            {user && (
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                textAlign: 'right'
              }}>
                Signed in as {user.id === 'guest' ? 'Guest' : user.user_metadata?.full_name || user.email}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Screen 3: Prayer Generation Screen
  const renderPrayerGenerationScreen = () => {
    // No longer auto-generate since ALL categories now show custom form for user choice
    
    return (
      <div style={{
        minHeight: '100vh',
        backgroundImage: 'url(/111208-OO10MS-26.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1e40af',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          {/* App Title with Logo */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '40px'
          }}>
            <img 
              src="/prayhands.png" 
              alt="Praying hands" 
              style={{ 
                width: '80px', 
                height: '80px',
                filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
              }} 
            />
            <h1 style={{ 
              color: 'white', 
              fontSize: '28px', 
              fontWeight: '600',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              margin: '0'
            }}>
              Help Me Pray
            </h1>
          </div>
          
          {showCustomForm ? (
            // Custom Prayer Form - Now for ALL categories
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '0',  // Remove padding since header will have its own
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)',
              marginBottom: '20px',
              maxWidth: '400px',
              width: '100%',
              overflow: 'hidden'  // Ensure header bars fit cleanly
            }}>
              {/* Header Section - Match category button design */}
              <div style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                borderTopLeftRadius: '19px',
                borderTopRightRadius: '19px'
              }}>
                {/* Category icon with category color */}
                <div style={{ 
                  fontSize: '16px'
                }}>
                  {categoryIcons[selectedCategory] || categoryIcons.custom}
                </div>
                
                {/* Category-specific title */}
                <div style={{ 
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
                }}>
                  {selectedCategory === 'custom' 
                    ? 'Create Your Custom Prayer'
                    : `Customize Your ${categories.find(c => c.key === selectedCategory)?.name || 'Custom'} Prayer`
                  }
                </div>
              </div>

              {/* Content Section */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.95)',
                padding: '24px 30px 30px 30px'
              }}>

              {/* Show full customization options only for 'custom' category */}
              {selectedCategory === 'custom' && (
                <>
              {/* Prayer For Selection */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: 'rgba(255, 255, 255, 0.8)', marginBottom: '12px', fontSize: '14px' }}>
                  This prayer is for:
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={() => setPrayerFor('myself')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '2px solid',
                      borderColor: prayerFor === 'myself' ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)',
                      backgroundColor: prayerFor === 'myself' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Myself
                  </button>
                  <button
                    onClick={() => setPrayerFor('someone')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '2px solid',
                      borderColor: prayerFor === 'someone' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.2)',
                      backgroundColor: prayerFor === 'someone' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Someone Else
                  </button>
                </div>
              </div>

              {/* Person's Name Input */}
              {prayerFor === 'someone' && (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    marginBottom: '8px' 
                  }}>
                    Person's name:
                  </label>
                  <input
                    type="text"
                    value={personName}
                    onChange={(e) => setPersonName(e.target.value)}
                    placeholder="Enter their name..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              {/* Special Occasion Dropdown */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  marginBottom: '8px' 
                }}>
                  Special occasion (optional):
                </label>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Select an occasion (optional)</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="graduation">Graduation</option>
                  <option value="wedding">Wedding</option>
                  <option value="funeral">Funeral/Memorial</option>
                  <option value="illness">Illness</option>
                  <option value="surgery">Surgery</option>
                  <option value="pregnancy">Pregnancy</option>
                  <option value="retirement">Retirement</option>
                  <option value="moving">Moving/New Home</option>
                  <option value="addiction">Recovery/Addiction</option>
                </select>
              </div>

              {/* Prayer Request Text Area */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  marginBottom: '8px' 
                }}>
                  What would you like to pray about?
                </label>
                <textarea
                  value={customRequest}
                  onChange={(e) => setCustomRequest(e.target.value.slice(0, 500))}
                  placeholder="Describe what you'd like to pray about..."
                  style={{
                    width: '100%',
                    height: '120px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '14px',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{ 
                  fontSize: '12px', 
                  color: 'rgba(255, 255, 255, 0.6)', 
                  textAlign: 'right', 
                  marginTop: '4px' 
                }}>
                  {customRequest.length}/500 characters
                </div>
              </div>
                </>
              )}

              {/* Prayer Length Selection - Show for ALL categories */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  fontSize: '14px', 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  marginBottom: '12px',
                  textAlign: 'center'
                }}>
                  Prayer length:
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => setPrayerLength('brief')}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '2px solid',
                      borderColor: prayerLength === 'brief' ? 'rgba(16, 185, 129, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                      backgroundColor: prayerLength === 'brief' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: prayerLength === 'brief' ? '600' : '400',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>{t('briefBeautiful')}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>{t('briefDesc')}</div>
                  </button>
                  <button
                    onClick={() => setPrayerLength('medium')}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '2px solid',
                      borderColor: prayerLength === 'medium' ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                      backgroundColor: prayerLength === 'medium' ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: prayerLength === 'medium' ? '600' : '400',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>{t('perfectlyTimed')}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>{t('mediumDesc')}</div>
                  </button>
                  <button
                    onClick={() => setPrayerLength('comprehensive')}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '8px',
                      border: '2px solid',
                      borderColor: prayerLength === 'comprehensive' ? 'rgba(139, 92, 246, 0.8)' : 'rgba(255, 255, 255, 0.2)',
                      backgroundColor: prayerLength === 'comprehensive' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: prayerLength === 'comprehensive' ? '600' : '400',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: '600', marginBottom: '2px' }}>{t('richMeaningful')}</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>{t('comprehensiveDesc')}</div>
                  </button>
                </div>
              </div>

              {/* Generate Prayer Button */}
              <button
                onClick={generatePrayer}
                disabled={selectedCategory === 'custom' && !customRequest.trim()}
                style={{
                  width: '100%',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: (selectedCategory === 'custom' && !customRequest.trim()) ? 'rgba(107, 114, 128, 0.6)' : 'rgba(59, 130, 246, 0.8)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: (selectedCategory === 'custom' && !customRequest.trim()) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: (selectedCategory === 'custom' && !customRequest.trim()) ? 0.6 : 1,
                  marginBottom: '12px'
                }}
              >
                {(() => {
                  const buttonTextMap = {
                    gratitude: 'Generate A Prayer for Gratitude',
                    morning: 'Generate A Prayer to Start Your Day', 
                    bedtime: 'Generate A Prayer for a Good Night',
                    healing: 'Generate A Prayer for Healing',
                    family: 'Generate A Prayer for Family and Friends',
                    grace: 'Generate A Prayer for Saying Grace',
                    bibleVerses: 'Generate A Bible Verse Prayer',
                    custom: 'Generate A Custom Prayer'
                  };
                  return buttonTextMap[selectedCategory] || 'Generate Prayer';
                })()}
              </button>

              </div> {/* Close content section */}
            </div>
          ) : (
            <>
              <div style={{ 
                fontSize: '22px', 
                fontWeight: '500',
                marginBottom: '30px',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}>
                Generating your prayer...
              </div>
              <div style={{ 
                width: '60px', 
            height: '60px', 
            border: '4px solid rgba(255,255,255,0.3)', 
            borderTop: '4px solid white', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite', 
            margin: '0 auto' 
          }}></div>
          <div style={{
            fontSize: '14px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginTop: '8px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
          }}>
            Creating something beautiful for you...
          </div>
            </>
          )}
          
          {/* Navigation Arrow - Below content, aligned left */}
          <div style={{
            marginTop: '8px',
            textAlign: 'left'
          }}>
            <button
              onClick={() => setCurrentScreen('prayer-selection')}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '32px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.7'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              ←
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Screen 4: Prayer View/Share/Audio Screen
  const renderPrayerViewScreen = () => {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundImage: 'url(/111208-OO10MS-26.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1e40af',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          {/* App Title with Logo */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: '30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            <img 
              src="/prayhands.png" 
              alt="Praying hands" 
              style={{ 
                width: '80px', 
                height: '80px',
                filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
              }} 
            />
            <h1 style={{ 
              color: 'white', 
              fontSize: '28px', 
              fontWeight: '600',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              margin: '0'
            }}>
              Help Me Pray
            </h1>
          </div>

          {/* Prayer Display with Integrated Title Bar - Match Category Button Styling */}
          <div style={{
            padding: '0',
            borderRadius: '18px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            background: 'transparent',
            marginBottom: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Header Section - Prayer Title Bar */}
            {currentPrayerInfo.category && (
              <div style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px'
              }}>
                <div style={{ 
                  fontWeight: '600',
                  fontSize: '16px',
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.7)',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  {currentPrayerInfo.category === 'bibleVerses' && currentPrayerInfo.verseReference 
                    ? currentPrayerInfo.verseReference 
                    : currentPrayerInfo.category === 'custom' && currentPrayerInfo.customTopic
                    ? currentPrayerInfo.customTopic
                    : (() => {
                        const categoryNames = {
                          gratitude: 'A Prayer for Gratitude',
                          morning: 'A Prayer to Start Your Day', 
                          bedtime: 'A Prayer for a Good Night',
                          healing: 'A Prayer for Healing',
                          family: 'A Prayer for Family and Friends',
                          grace: 'A Prayer for Saying Grace',
                          bibleVerses: 'A Bible Verse Prayer',
                          custom: 'A Custom Prayer'
                        };
                        return categoryNames[currentPrayerInfo.category] || `${currentPrayerInfo.category.charAt(0).toUpperCase() + currentPrayerInfo.category.slice(1)} Prayer`;
                      })()
                  }
                </div>
              </div>
            )}
            
            {/* Content Section - Prayer Text */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.95)',
              padding: '30px',
              borderBottomLeftRadius: '16px',
              borderBottomRightRadius: '16px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}>
              <p style={{
                color: 'white',
                fontSize: '18px',
                lineHeight: '1.6',
                textAlign: 'center',
                margin: 0,
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.5)'
              }}>
                {currentPrayer}
              </p>
            </div>
          </div>

          {/* Action Buttons - Share, Logout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            {/* Share Prayer Button */}
            <button 
              onClick={() => setCurrentScreen('unified-sharing')}
              style={{ 
                padding: '16px',
                borderRadius: '15px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                background: 'rgba(59, 130, 246, 0.6)',
                backdropFilter: 'blur(20px)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Share2 size={20} />
              Share
            </button>

            {/* Logout Button */}
            <button 
              onClick={() => setUser(null)} 
              style={{ 
                padding: '16px',
                borderRadius: '15px',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.6)',
                backdropFilter: 'blur(20px)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              Logout
            </button>
          </div>
          
          {/* Navigation and User Status - Same level, opposite sides */}
          <div style={{
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => {
                setCurrentPrayer('');
                setSelectedCategory('');
                setPersonName('');
                setPrayerFor('myself');
                setCustomRequest('');
                setCurrentScreen('prayer-selection');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '32px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.7'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              ←
            </button>
            
            {/* User Status Indicator */}
            {user && (
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                textAlign: 'right'
              }}>
                Signed in as {user.id === 'guest' ? 'Guest' : user.user_metadata?.full_name || user.email}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Screen 5: Prayer Sharing Screen
  const renderPrayerSharingScreen = () => {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundImage: 'url(/111208-OO10MS-26.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1e40af',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            {/* App Title with Logo */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <img 
                src="/prayhands.png" 
                alt="Praying hands" 
                style={{ 
                  width: '80px', 
                  height: '80px',
                  filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
                }} 
              />
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '600', 
                color: 'white',
                margin: 0,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
              }}>
                Share Prayer
              </h1>
            </div>
          </div>

          {/* Share Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Share Image Option */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ 
                color: 'white', 
                fontSize: '18px', 
                fontWeight: '600',
                margin: '0 0 16px 0',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <Share2 size={20} color="#10b981" />
                Share Prayer Image
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: '14px',
                textAlign: 'center',
                margin: '0 0 16px 0' 
              }}>
                Download and share a beautiful image of your prayer
              </p>
              <button
                onClick={() => setCurrentScreen('unified-sharing')}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Image Sharing Options
              </button>
            </div>

            {/* Share Audio Option */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ 
                color: 'white', 
                fontSize: '18px', 
                fontWeight: '600',
                margin: '0 0 16px 0',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <Volume2 size={20} color="#8b5cf6" />
                Share Audio Prayer
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: '14px',
                textAlign: 'center',
                margin: '0 0 16px 0' 
              }}>
                Listen to your prayer and share the audio
              </p>
              <button
                onClick={() => setCurrentScreen('unified-sharing')}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Audio Sharing Options
              </button>
            </div>
          </div>

          {/* Navigation and User Status - Same level, opposite sides */}
          <div style={{
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setCurrentScreen('prayer-view')}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '32px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.7'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              ←
            </button>
            
            {/* User Status Indicator */}
            {user && (
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                textAlign: 'right'
              }}>
                Signed in as {user.id === 'guest' ? 'Guest' : user.user_metadata?.full_name || user.email}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Screen 6: Audio Sharing Screen  
  const renderAudioSharingScreen = () => {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundImage: 'url(/111208-OO10MS-26.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1e40af',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <img 
                src="/prayhands.png" 
                alt="Praying hands" 
                style={{ 
                  width: '80px', 
                  height: '80px',
                  filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
                }} 
              />
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '600', 
                color: 'white',
                margin: 0,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
              }}>
                Share Audio Prayer
              </h1>
            </div>
          </div>

          {/* Audio Player Controls */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '18px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <Volume2 size={20} color="#8b5cf6" />
              Audio Controls
            </h3>

            {/* Play/Pause Button */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {!isPlaying ? (
                <button
                  onClick={() => speakPrayer(currentPrayer)}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    border: 'none',
                    borderRadius: '50px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    padding: '16px 32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    margin: '0 auto',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  <Play size={20} />
                  Play Prayer
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button
                    onClick={pauseAudio}
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      border: 'none',
                      borderRadius: '50px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '12px 24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Pause size={16} />
                    Pause
                  </button>
                  <button
                    onClick={stopAudio}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      border: 'none',
                      borderRadius: '50px',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      padding: '12px 24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Square size={16} />
                    Stop
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sharing Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Download Audio */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ 
                color: 'white', 
                fontSize: '16px', 
                fontWeight: '600',
                margin: '0 0 16px 0',
                textAlign: 'center'
              }}>
                💾 Download Audio File
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: '14px',
                textAlign: 'center',
                margin: '0 0 16px 0' 
              }}>
                Save the audio prayer as an MP3 file
              </p>
              <button
                onClick={() => {
                  if (currentAudioBlob) {
                    const url = URL.createObjectURL(currentAudioBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `prayer-audio-${Date.now()}.mp3`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } else {
                    alert('Please play the audio first to generate the download file.');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Download MP3
              </button>
            </div>

            {/* Share to Social Media */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ 
                color: 'white', 
                fontSize: '16px', 
                fontWeight: '600',
                margin: '0 0 16px 0',
                textAlign: 'center'
              }}>
                📱 Share on Social Media
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: '14px',
                textAlign: 'center',
                margin: '0 0 16px 0' 
              }}>
                Share your prayer audio with friends and family
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <button
                  onClick={() => {
                    // WhatsApp sharing
                    const text = encodeURIComponent(`🎵 Listen to this beautiful prayer I created with Help Me Pray app!\n\n${currentPrayer.substring(0, 100)}...\n\nDownload: helmpmeray.app`);
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #25d366, #128c7e)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  WhatsApp
                </button>
                
                <button
                  onClick={() => {
                    // Instagram sharing (opens Instagram with encouragement to share)
                    navigator.clipboard.writeText(`🎵 Beautiful prayer audio created with Help Me Pray app!\n\n${currentPrayer}\n\n#Prayer #Faith #HelpMePray\n\nDownload: helpmepray.app`).then(() => {
                      alert('Prayer text copied! Now opening Instagram - share this with your downloaded audio.');
                      window.open('https://www.instagram.com/', '_blank');
                    });
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #e4405f, #c13584)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Instagram
                </button>
                
                <button
                  onClick={() => {
                    // Facebook sharing
                    const text = encodeURIComponent(`🎵 Beautiful prayer created with Help Me Pray app! ${currentPrayer.substring(0, 100)}...`);
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://helpmepray.app')}&quote=${text}`, '_blank');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #1877f2, #166fe5)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Facebook
                </button>
                
                <button
                  onClick={() => {
                    // Twitter sharing
                    const text = encodeURIComponent(`🎵 Beautiful prayer created with Help Me Pray app!\n\n${currentPrayer.substring(0, 150)}...\n\n#Prayer #Faith #HelpMePray`);
                    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent('https://helpmepray.app')}`, '_blank');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #1da1f2, #0d8bd9)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Twitter
                </button>
                
                <button
                  onClick={() => {
                    // Messages sharing (SMS)
                    const text = encodeURIComponent(`🎵 Listen to this beautiful prayer I created with Help Me Pray app!\n\n${currentPrayer.substring(0, 100)}...\n\nDownload: helpmepray.app`);
                    window.open(`sms:?body=${text}`, '_blank');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #34c759, #30d158)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Messages
                </button>
              </div>
            </div>
          </div>

          {/* Navigation and User Status - Same level, opposite sides */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setCurrentScreen('prayer-view')}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '32px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.7'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              ←
            </button>
            
            {/* User Status Indicator */}
            {user && (
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                textAlign: 'right'
              }}>
                Signed in as {user.id === 'guest' ? 'Guest' : user.user_metadata?.full_name || user.email}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Screen 7: Image Sharing Screen
  const renderImageSharingScreen = () => {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundImage: 'url(/111208-OO10MS-26.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#1e40af',
        padding: '20px'
      }}>
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <img 
                src="/prayhands.png" 
                alt="Praying hands" 
                style={{ 
                  width: '80px', 
                  height: '80px',
                  filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))'
                }} 
              />
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '600', 
                color: 'white',
                margin: 0,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
              }}>
                Share Prayer Image
              </h1>
            </div>
          </div>

          {/* Image Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Download Image */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ 
                color: 'white', 
                fontSize: '16px', 
                fontWeight: '600',
                margin: '0 0 16px 0',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                <Share2 size={20} color="#10b981" />
                Download Prayer Image
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: '14px',
                textAlign: 'center',
                margin: '0 0 16px 0' 
              }}>
                Save the beautiful prayer image to your device
              </p>
              <button
                onClick={() => downloadPrayerImage()}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Download Image
              </button>
            </div>

            {/* Share to Social Media */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{ 
                color: 'white', 
                fontSize: '16px', 
                fontWeight: '600',
                margin: '0 0 16px 0',
                textAlign: 'center'
              }}>
                📱 Share on Social Media
              </h3>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.8)', 
                fontSize: '14px',
                textAlign: 'center',
                margin: '0 0 16px 0' 
              }}>
                Share your prayer image with friends and family
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <button
                  onClick={() => {
                    // Generate image and share to WhatsApp
                    downloadPrayerImage();
                    setTimeout(() => {
                      const text = encodeURIComponent(`🖼️ Beautiful prayer image created with Help Me Pray app!\n\n${currentPrayer.substring(0, 100)}...\n\nDownload: helpmepray.app`);
                      window.open(`https://wa.me/?text=${text}`, '_blank');
                    }, 1000);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #25d366, #128c7e)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  WhatsApp
                </button>
                
                <button
                  onClick={() => {
                    // Instagram sharing (opens Instagram app or web)
                    const text = encodeURIComponent(`Beautiful prayer created with Help Me Pray app! 🙏\n\n#Prayer #Faith #HelpMePray #Inspiration`);
                    window.open(`https://www.instagram.com/`, '_blank');
                    // Also copy text for user to paste
                    navigator.clipboard.writeText(`Beautiful prayer created with Help Me Pray app! 🙏\n\n${currentPrayer}\n\n#Prayer #Faith #HelpMePray #Inspiration`);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #e4405f, #c13584)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Instagram
                </button>
                
                <button
                  onClick={() => {
                    // Facebook sharing
                    const text = encodeURIComponent(`🖼️ Beautiful prayer image created with Help Me Pray app!\n\n${currentPrayer.substring(0, 200)}...`);
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://helpmepray.app')}&quote=${text}`, '_blank');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #1877f2, #166fe5)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Facebook
                </button>
                
                <button
                  onClick={() => {
                    // WhatsApp sharing
                    const text = encodeURIComponent(`🖼️ Beautiful prayer image created with Help Me Pray app!\n\n${currentPrayer.substring(0, 100)}...\n\n#Prayer #Faith #HelpMePray\n\nDownload: helpmepray.app`);
                    window.open(`https://wa.me/?text=${text}`, '_blank');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #25d366, #128c7e)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  WhatsApp
                </button>
                
                <button
                  onClick={() => {
                    // Instagram sharing (opens Instagram with encouragement to share)
                    const text = encodeURIComponent(`🖼️ Beautiful prayer created with Help Me Pray app!\n\n#Prayer #Faith #HelpMePray\n\nDownload: helpmepray.app`);
                    // Instagram doesn't have direct URL sharing, so we'll copy text and open Instagram
                    navigator.clipboard.writeText(`🖼️ Beautiful prayer created with Help Me Pray app!\n\n${currentPrayer}\n\n#Prayer #Faith #HelpMePray\n\nDownload: helpmepray.app`).then(() => {
                      alert('Prayer text copied! Now opening Instagram - paste this with your downloaded image.');
                      window.open('https://www.instagram.com/', '_blank');
                    });
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #e4405f, #c13584)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Instagram
                </button>
                
                <button
                  onClick={() => {
                    // Messages sharing (SMS)
                    const text = encodeURIComponent(`🖼️ Beautiful prayer image created with Help Me Pray app!\n\n${currentPrayer.substring(0, 100)}...\n\nDownload: helpmepray.app`);
                    window.open(`sms:?body=${text}`, '_blank');
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #34c759, #30d158)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Messages
                </button>
              </div>
            </div>
          </div>

          {/* Navigation and User Status - Same level, opposite sides */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setCurrentScreen('prayer-view')}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '32px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.7'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              ←
            </button>
            
            {/* User Status Indicator */}
            {user && (
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                textAlign: 'right'
              }}>
                Signed in as {user.id === 'guest' ? 'Guest' : user.user_metadata?.full_name || user.email}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // UNIFIED SHARING SCREEN - Combines audio and image sharing
  const renderUnifiedSharingScreen = () => {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundImage: 'url(/111208-OO10MS-26.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Header */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{
              color: 'white',
              fontSize: '22px',
              fontWeight: '700',
              margin: '0 0 8px 0',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.8)'
            }}>
              📱 Share Your Prayer
            </h2>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              margin: '0',
              lineHeight: '1.4'
            }}>
              Download and share your prayer as audio, image, or both
            </p>
          </div>

          {/* Download Options */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 16px 0',
              textAlign: 'center'
            }}>
              💾 Download Your Prayer
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              {/* Download Audio */}
              <button
                onClick={() => {
                  if (currentAudioBlob) {
                    const url = URL.createObjectURL(currentAudioBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `prayer-audio-${Date.now()}.mp3`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  } else {
                    alert('Please play the audio first to generate the download file.');
                  }
                }}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                🎵 Audio MP3
              </button>

              {/* Download Image */}
              <button
                onClick={downloadPrayerImage}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'transform 0.2s'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                🖼️ Image PNG
              </button>
            </div>

            {/* Download Both Button */}
            <button
              onClick={() => {
                // Download both audio and image
                let downloadCount = 0;
                
                // Download audio
                if (currentAudioBlob) {
                  const audioUrl = URL.createObjectURL(currentAudioBlob);
                  const audioLink = document.createElement('a');
                  audioLink.href = audioUrl;
                  audioLink.download = `prayer-audio-${Date.now()}.mp3`;
                  document.body.appendChild(audioLink);
                  audioLink.click();
                  document.body.removeChild(audioLink);
                  URL.revokeObjectURL(audioUrl);
                  downloadCount++;
                } else {
                  alert('Please play the audio first to generate the download file.');
                  return;
                }
                
                // Download image (small delay to avoid browser blocking multiple downloads)
                setTimeout(() => {
                  downloadPrayerImage();
                  downloadCount++;
                }, 500);
                
                // Show success message
                setTimeout(() => {
                  alert('Both audio and image files have been downloaded!');
                }, 1000);
              }}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
              onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
            >
              📦 Download Both (Audio + Image)
            </button>
          </div>

          {/* Social Media Sharing */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.3)'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              textAlign: 'center'
            }}>
              📱 Share on Social Media
            </h3>
            <p style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '14px',
              textAlign: 'center',
              margin: '0 0 16px 0'
            }}>
              Share your prayer with friends and family
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <button
                onClick={() => {
                  // WhatsApp sharing
                  const text = encodeURIComponent(`🙏 Beautiful prayer created with Help Me Pray app!\n\n${currentPrayer.substring(0, 100)}...\n\nDownload: helmpmeray.app`);
                  window.open(`https://wa.me/?text=${text}`, '_blank');
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #25d366, #128c7e)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                WhatsApp
              </button>

              <button
                onClick={() => {
                  // Instagram sharing
                  navigator.clipboard.writeText(`🙏 Beautiful prayer created with Help Me Pray app!\n\n${currentPrayer}\n\n#Prayer #Faith #HelpMePray\n\nDownload: helmpmeray.app`).then(() => {
                    alert('Prayer text copied! Now opening Instagram - paste this with your downloaded content.');
                    window.open('https://www.instagram.com/', '_blank');
                  });
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #e4405f, #c13584)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Instagram
              </button>

              <button
                onClick={() => {
                  // Facebook sharing
                  const text = encodeURIComponent(`🙏 Beautiful prayer created with Help Me Pray app! ${currentPrayer.substring(0, 100)}...`);
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://helmpmeray.app')}&quote=${text}`, '_blank');
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #1877f2, #166fe5)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Facebook
              </button>

              <button
                onClick={() => {
                  // Messages sharing (SMS)
                  const text = encodeURIComponent(`🙏 Beautiful prayer created with Help Me Pray app!\n\n${currentPrayer.substring(0, 100)}...\n\nDownload: helmpmeray.app`);
                  window.open(`sms:?body=${text}`, '_blank');
                }}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #34c759, #30d158)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Messages
              </button>
            </div>
          </div>

          {/* Navigation and User Status */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <button
              onClick={() => setCurrentScreen('prayer-view')}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '32px',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '4px',
                transition: 'opacity 0.2s'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.7'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              ←
            </button>
            
            {/* User Status Indicator */}
            {user && (
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.6)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.8)',
                textAlign: 'right'
              }}>
                Signed in as {user.id === 'guest' ? 'Guest' : user.user_metadata?.full_name || user.email}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // MOBILE SCREEN ROUTER - Use this instead of the old complex UI
  return renderScreen();
};

// Main App component with subscription context
let appInitialized = false;
const App = () => {
  if (!appInitialized) {
    console.log('App component initializing...');
  console.log('🔥 HELP ME PRAY V2 - Development Version - Ready for experiments!');
    appInitialized = true;
  }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If Supabase is not configured, run in guest mode
    if (!supabase) {
      console.warn('Running in offline mode - no authentication available');
      setUser(null);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    }).catch((error) => {
      console.error('Error getting session:', error);
      setUser(null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#8b5cf6',
            marginBottom: '-10px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <img 
              src="/logo192.png" 
              alt="Praying Hands" 
              style={{
                width: '60px',
                height: '60px'
              }}
            />
          </div>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <HelpMePrayApp user={user} setUser={setUser} />
  );
};

export default App;