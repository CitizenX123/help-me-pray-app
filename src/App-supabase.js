import React, { useState, useEffect } from 'react';
import { Heart, Sun, Moon, Users, Sparkles, RefreshCw, User, Send, Utensils, Share2, Copy, MessageCircle, Facebook, Twitter, Smartphone, Instagram, Volume2, Play, Pause, Square, Settings, Crown, Book } from 'lucide-react';
import { supabase } from './supabaseClient';
// Force cache bust v2.3
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
    bibleVerses: "Bible",
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
    continueAsGuest: "🙏 Continue as Guest",
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
    bibleVerses: "Biblia",
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
  // const { isPremium, upgradeToPremiun } = useSubscription();
  const [selectedCategory, setSelectedCategory] = useState('gratitude');
  
  // Clear prayer when category changes to force icon display
  useEffect(() => {
    setCurrentPrayer('');
  }, [selectedCategory]);
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
  const [useHumanVoice, setUseHumanVoice] = useState(true);
  const [humanVoiceType, setHumanVoiceType] = useState('nurturing');
  const [googleVoiceType, setGoogleVoiceType] = useState('warm');
  const [ttsProvider, setTtsProvider] = useState('browser'); // Default to browser, premium users can upgrade
  // Google Cloud TTS voices to match ElevenLabs selection
  const googleCloudVoices = {
    warm: {
      name: 'Grace - Warm',
      description: 'Gentle, soothing American voice',
      voiceName: 'en-US-Neural2-F',
      languageCode: 'en-US',
      gender: 'FEMALE'
    },
    confident: {
      name: 'David - Confident', 
      description: 'Strong, reassuring male voice',
      voiceName: 'en-US-Neural2-D',
      languageCode: 'en-US',
      gender: 'MALE'
    },
    gentle: {
      name: 'Emma - Gentle',
      description: 'Soft, caring female voice',
      voiceName: 'en-US-Neural2-H',
      languageCode: 'en-US', 
      gender: 'FEMALE'
    },
    steady: {
      name: 'Michael - Steady',
      description: 'Calm, dependable voice',
      voiceName: 'en-US-Neural2-I',
      languageCode: 'en-US',
      gender: 'MALE'
    },
    serena: {
      name: 'Serena - Peaceful',
      description: 'Tranquil, meditative voice',
      voiceName: 'en-US-Neural2-G',
      languageCode: 'en-US',
      gender: 'FEMALE'
    },
    brian: {
      name: 'Brian - Thoughtful',
      description: 'Reflective, wise voice',
      voiceName: 'en-US-Neural2-J',
      languageCode: 'en-US',
      gender: 'MALE'
    },
    aria: {
      name: 'Aria - Uplifting',
      description: 'Inspiring, hopeful voice',
      voiceName: 'en-US-Neural2-C',
      languageCode: 'en-US',
      gender: 'FEMALE'
    },
    compassionate: {
      name: 'Samuel - Compassionate',
      description: 'Understanding, empathetic voice',
      voiceName: 'en-US-Neural2-A',
      languageCode: 'en-US',
      gender: 'MALE'
    }
  };
  const [currentAudioBlob, setCurrentAudioBlob] = useState(null);
  const [audioElement, setAudioElement] = useState(null);

  // Subscription and usage tracking state
  const [userSession, setUserSession] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  
  // Set premium status for Google logged-in users
  useEffect(() => {
    if (user && user.id !== 'guest') {
      setIsPremium(true); // Google logged-in users get premium features
    } else {
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

  // Only restrict non-premium users from premium features
  useEffect(() => {
    if (!isPremium && (ttsProvider === 'elevenlabs' || ttsProvider === 'google')) {
      setTtsProvider('browser');
    }
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
    strength: {
      openings: [
        "Dios Todopoderoso,",
        "Señor,",
        "Padre Celestial,",
        "Querido Dios,",
        "Padre Nuestro,",
        "Dios,"
      ],
      subjects: [
        "en este momento de necesidad, busco tu fuerza y sabiduría",
        "cuando me siento débil, recuerdo que tu poder se perfecciona en mi debilidad",
        "ayúdame a encontrar valor en medio de la incertidumbre",
        "dame la resistencia para perseverar a través de los desafíos",
        "fortalece mi fe cuando las dudas nublan mi mente",
        "ayúdame a confiar en tu plan incluso cuando no puedo ver el camino"
      ],
      closings: [
        "Que tu fuerza sea mi refugio y mi roca.",
        "En ti encuentro el valor para enfrentar cualquier tormenta.",
        "Ayúdame a caminar en fe, no en temor.",
        "Que tu paz calme mi espíritu ansioso.",
        "Dame la gracia para confiar en tu tiempo perfecto.",
        "Fortalece mi corazón para los días venideros."
      ]
    },
    peace: {
      openings: [
        "Príncipe de Paz,",
        "Señor,",
        "Padre Celestial,",
        "Dios,",
        "Querido Señor,",
        "Padre Nuestro,"
      ],
      subjects: [
        "en medio del caos de la vida, busco tu paz que sobrepasa todo entendimiento",
        "calma las tormentas en mi corazón y mente",
        "ayúdame a encontrar serenidad en tu presencia",
        "que tu paz fluya a través de mí hacia otros",
        "en momentos de ansiedad, recuérdame de tu control soberano",
        "ayúdame a descansar en la seguridad de tu amor"
      ],
      closings: [
        "Que tu paz guarde mi corazón y pensamientos.",
        "En ti encuentro el descanso que mi alma anhela.",
        "Ayúdame a ser un portador de tu paz a otros.",
        "Que la tranquilidad de tu espíritu llene mi ser.",
        "Dame la serenidad para aceptar lo que no puedo cambiar.",
        "Que tu paz perfecta reine en mi vida."
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
    }
  };

  // Function to ensure prayer uniqueness
  const generateUniquePrayer = (generatorFunction, maxAttempts = 50) => {
    let attempts = 0;
    let prayer = '';
    
    do {
      prayer = generatorFunction();
      attempts++;
      
      // If we've tried many times and still getting duplicates, 
      // clear some old prayers and try again
      if (attempts > maxAttempts) {
        const usedArray = Array.from(usedPrayers);
        // Keep only the most recent 100 prayers to allow some recycling of very old prayers
        if (usedArray.length > 100) {
          const recentPrayers = new Set(usedArray.slice(-50));
          setUsedPrayers(recentPrayers);
        }
        break;
      }
    } while (usedPrayers.has(prayer) && attempts < maxAttempts);
    
    // Add the new prayer to used prayers
    setUsedPrayers(prev => new Set([...prev, prayer]));
    
    return prayer;
  };

  // Internal prayer generator (called by uniqueness checker)
  const generatePrayerInternal = (category, length = 'medium') => {
    // Special handling for Bible Verses category
    if (category === 'bibleVerses') {
      const bibleVerses = [
        {
          verse: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
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
          verse: "Cast all your anxiety on him because he cares for you.",
          reference: "1 Peter 5:7 (NLT)",
          theme: "God's care and peace",
          prayer: "Caring Father, we come to you carrying the weight of our worries and fears. This verse reminds us that we don't have to bear these burdens alone. You invite us to cast our anxieties on you because you truly care for us. Help us to let go of the things that trouble our hearts and minds. Replace our anxiety with your perfect peace, and help us to trust in your loving care for every detail of our lives. Amen."
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
          verse: "Give all your worries and cares to God, for he cares about you.",
          reference: "1 Peter 5:7 (NLT)",
          theme: "God's care and provision",
          prayer: "Loving Father, you invite us to bring all our worries and cares to you because you truly care about every aspect of our lives. Help us to release our grip on the things that burden us and place them in your capable hands. Teach us to trust in your care and provision. When anxiety tries to overwhelm us, remind us of this beautiful invitation to find rest in you. Thank you for caring about both our big concerns and our smallest worries. Amen."
        },
        {
          verse: "And I am convinced that nothing can ever separate us from God's love. Neither death nor life, neither angels nor demons, neither our fears for today nor our worries about tomorrow—not even the powers of hell can separate us from God's love.",
          reference: "Romans 8:38 (NLT)",
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
      // Brief: One paragraph with multiple sentences - beautiful but concise
      const connectors = language === 'es' ? 
        ['Y también', 'Además', 'Asimismo', 'Por favor'] :
        ['And also', 'Please also', 'Additionally', 'Furthermore'];
      
      const randomOpening = templates.openings[Math.floor(Math.random() * templates.openings.length)];
      const randomConnector = connectors[Math.floor(Math.random() * connectors.length)];
      const randomSubject1 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      let randomSubject2 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      
      // Ensure different subjects
      while (randomSubject2 === randomSubject1) {
        randomSubject2 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      }
      
      const randomClosing = templates.closings[Math.floor(Math.random() * templates.closings.length)];
      
      return `${randomOpening} ${randomSubject1}. ${randomConnector}, ${randomSubject2}. ${randomClosing} ${t('finalClosingShort')}`;
      
    } else if (length === 'medium') {
      // Medium: 2-3 paragraphs (moved from comprehensive) - add transitions and connectors
      const transitions = language === 'es' ? 
        ['Por tanto', 'En consecuencia', 'Así mismo', 'De esta manera', 'Por ello'] :
        ['Therefore', 'Consequently', 'Thus', 'In this way', 'Hence'];
      
      const randomOpening = templates.openings[Math.floor(Math.random() * templates.openings.length)];
      const randomTransition = transitions[Math.floor(Math.random() * transitions.length)];
      const randomSubject1 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      let randomSubject2 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      let randomSubject3 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      let randomSubject4 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      
      // Ensure different subjects
      while (randomSubject2 === randomSubject1) {
        randomSubject2 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      }
      while (randomSubject3 === randomSubject1 || randomSubject3 === randomSubject2) {
        randomSubject3 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      }
      while (randomSubject4 === randomSubject1 || randomSubject4 === randomSubject2 || randomSubject4 === randomSubject3) {
        randomSubject4 = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      }
      
      const randomClosing1 = templates.closings[Math.floor(Math.random() * templates.closings.length)];
      let randomClosing2 = templates.closings[Math.floor(Math.random() * templates.closings.length)];
      let randomClosing3 = templates.closings[Math.floor(Math.random() * templates.closings.length)];
      
      while (randomClosing2 === randomClosing1) {
        randomClosing2 = templates.closings[Math.floor(Math.random() * templates.closings.length)];
      }
      while (randomClosing3 === randomClosing1 || randomClosing3 === randomClosing2) {
        randomClosing3 = templates.closings[Math.floor(Math.random() * templates.closings.length)];
      }
      
      return `${randomOpening} ${randomSubject1}. ${randomSubject2}. ${t('comprehensiveMiddle1')}

${randomSubject3}. ${randomSubject4}. ${t('comprehensiveMiddle2')}

${randomTransition}, ${randomClosing1} ${randomClosing2} ${randomClosing3} ${t('finalClosingLong')}`;
      
    } else {
      // Comprehensive: 4-5 paragraphs (Rich & Meaningful) - extensive prayer
      const transitions = language === 'es' ? 
        ['Por tanto', 'En consecuencia', 'Así mismo', 'De esta manera', 'Por ello', 'Además', 'También'] :
        ['Therefore', 'Consequently', 'Thus', 'In this way', 'Hence', 'Furthermore', 'Moreover'];
      
      const reflectionPhrases = language === 'es' ? [
        'Reflexiono sobre tu bondad infinita y tu amor inagotable',
        'Medito en tu fidelidad que nunca falla',
        'Contemplo tu gracia que nos sostiene cada día',
        'Pienso en tu misericordia que se renueva cada mañana',
        'Considero tu sabiduría que guía nuestros pasos'
      ] : [
        'I reflect on your infinite goodness and unfailing love',
        'I meditate on your faithfulness that never fails',
        'I contemplate your grace that sustains us each day',
        'I think about your mercy that is renewed every morning',
        'I consider your wisdom that guides our steps'
      ];

      const gratitudePhrases = language === 'es' ? [
        'Mi corazón se llena de gratitud por todas las bendiciones que derramas sobre nosotros',
        'Te doy gracias por tu presencia constante en nuestras vidas',
        'Reconozco con humildad todos los dones que nos has otorgado',
        'Mi alma se regocija en tu amor y provisión continua',
        'Agradezco profundamente por tu cuidado y protección'
      ] : [
        'My heart fills with gratitude for all the blessings you pour upon us',
        'I thank you for your constant presence in our lives',
        'I humbly acknowledge all the gifts you have bestowed upon us',
        'My soul rejoices in your love and continuous provision',
        'I deeply appreciate your care and protection'
      ];
      
      const randomOpening = templates.openings[Math.floor(Math.random() * templates.openings.length)];
      const randomTransition1 = transitions[Math.floor(Math.random() * transitions.length)];
      const randomTransition2 = transitions[Math.floor(Math.random() * transitions.length)];
      const randomReflection = reflectionPhrases[Math.floor(Math.random() * reflectionPhrases.length)];
      const randomGratitude = gratitudePhrases[Math.floor(Math.random() * gratitudePhrases.length)];
      
      // Get 6 different subjects for a longer prayer
      const subjects = [];
      while (subjects.length < 6) {
        const randomSubject = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
        if (!subjects.includes(randomSubject)) {
          subjects.push(randomSubject);
        }
      }
      
      // Get 4 different closings
      const closings = [];
      while (closings.length < 4) {
        const randomClosing = templates.closings[Math.floor(Math.random() * templates.closings.length)];
        if (!closings.includes(randomClosing)) {
          closings.push(randomClosing);
        }
      }
      
      return `${randomOpening} ${subjects[0]}. ${subjects[1]}. ${t('comprehensiveMiddle1')}

${subjects[2]}. ${subjects[3]}. ${randomReflection}.

${randomTransition1}, ${subjects[4]}. ${subjects[5]}. ${t('comprehensiveMiddle2')}

${randomGratitude}. ${randomTransition2}, ${closings[0]} ${closings[1]}

${closings[2]} ${closings[3]} ${t('finalClosingLong')}`;
    }
  };

  // Public function that ensures uniqueness
  const generateDynamicPrayer = (category, length = 'medium') => {
    return generateUniquePrayer(() => generatePrayerInternal(category, length));
  };

  const prayerCategories = {
    gratitude: {
      icon: Heart,
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

  const handleSignUp = async (e) => {
    e.preventDefault();
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

    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setAuthError('Check your email for the confirmation link!');
      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
    }
    setAuthLoading(false);
  };

  const handleSignOut = async () => {
    if (!supabase) {
      console.warn('Cannot sign out - authentication not available in offline mode');
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
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
    
    // Filter the person's name
    const filteredName = name ? filterContent(name) : name;
    if (filteredName === null) {
      return t('inappropriateName');
    }
    
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
        const personRef = filteredName || (language === 'es' ? 'esta persona' : 'this person');
        const possessive = filteredName ? (language === 'es' ? `de ${filteredName}` : filteredName + "'s") : (language === 'es' ? 'su' : 'their');
        const objectPronoun = filteredName || (language === 'es' ? 'él/ella' : 'them');
        
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
      const randomMiddle = customMiddles[Math.floor(Math.random() * customMiddles.length)];
      const randomClosing = customClosings[Math.floor(Math.random() * customClosings.length)];

      if (isForSelf) {
        if (language === 'es') {
          prayerTemplate = `${randomOpening} vengo ante ti con este pedido: ${filteredRequest}. ${randomMiddle} ${randomClosing} Lléname con tu amor, paz y esperanza mientras espero tu respuesta. Amén.`;
        } else {
          prayerTemplate = `${randomOpening} I come before you with this request: ${filteredRequest}. ${randomMiddle} ${randomClosing} Fill me with your love, peace, and hope as I await your answer. Amen.`;
        }
      } else {
        const personRef = filteredName || (language === 'es' ? 'esta persona' : 'this person');
        const possessive = filteredName ? (language === 'es' ? `de ${filteredName}` : filteredName + "'s") : (language === 'es' ? 'su' : 'their');
        const objectPronoun = filteredName || (language === 'es' ? 'él/ella' : 'them');
        
        if (language === 'es') {
          prayerTemplate = `${randomOpening} elevo a ${personRef} ante ti en oración con este pedido: ${filteredRequest}. ${randomMiddle} Bendice a ${objectPronoun} con tu presencia y llena ${possessive} corazón con esperanza. ${randomClosing} Rodea a ${objectPronoun} con tu amor y el apoyo de personas que se preocupan. Amén.`;
        } else {
          prayerTemplate = `${randomOpening} I lift up ${personRef} to you in prayer with this request: ${filteredRequest}. ${randomMiddle} Bless ${objectPronoun} with your presence and fill ${possessive} heart with hope. ${randomClosing} Surround ${objectPronoun} with your love and the support of caring people. Amen.`;
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
  
  // Human-like voice configurations
  const humanVoices = {
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
    
    // Restrict premium voices to premium users only
    if ((ttsProvider === 'google' || ttsProvider === 'elevenlabs') && !isPremium) {
      console.log('Non-premium user trying premium voice, falling back to system');
      speakWithSystemVoice(text);
      return;
    }
    
    switch (ttsProvider) {
      case 'google':
        await speakWithGoogleCloud(text);
        break;
      case 'elevenlabs':
        if (useHumanVoice) {
          await speakWithHumanVoice(text);
        } else {
          speakWithSystemVoice(text);
        }
        break;
      case 'browser':
      default:
        speakWithSystemVoice(text);
        break;
    }
  };

  const speakWithHumanVoice = async (text) => {
    try {
      console.log('Attempting human voice with:', humanVoiceType);
      console.log('API Key available:', !!process.env.REACT_APP_ELEVENLABS_API_KEY);
      
      // Check if API key is configured
      console.log('ElevenLabs API Key:', process.env.REACT_APP_ELEVENLABS_API_KEY ? 'Present' : 'Missing');
      if (!process.env.REACT_APP_ELEVENLABS_API_KEY || process.env.REACT_APP_ELEVENLABS_API_KEY === 'your_elevenlabs_key_here') {
        throw new Error('Premium voices are temporarily unavailable. Please contact support to enable this feature.');
      }
      
      setIsPlaying(true);
      setIsPaused(false);

      console.log('humanVoiceType:', humanVoiceType);
      console.log('Available humanVoices keys:', Object.keys(humanVoices));
      const voiceConfig = humanVoices[humanVoiceType];
      console.log('voiceConfig:', voiceConfig);
      if (!voiceConfig) {
        throw new Error(`Voice configuration not found for: ${humanVoiceType}`);
      }
      console.log('Using voice config:', voiceConfig.name);
      
      // Truncate text for demo if too long (ElevenLabs has character limits)
      const truncatedText = text.length > 2500 ? text.substring(0, 2500) + '...' : text;
      
      console.log('Making ElevenLabs API request to voice:', voiceConfig.voiceId);
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/' + voiceConfig.voiceId, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': process.env.REACT_APP_ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: truncatedText,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: voiceConfig.stability,
            similarity_boost: voiceConfig.similarity_boost,
            style: voiceConfig.style,
            use_speaker_boost: voiceConfig.use_speaker_boost
          }
        })
      });

      console.log('ElevenLabs response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs API error:', response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const audioBlob = await response.blob();
      console.log('Audio blob size:', audioBlob.size);
      
      // Save the audio blob and URL for sharing
      setCurrentAudioBlob(audioBlob);
      
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      setAudioElement(audio);
      
      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
        setAudioElement(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
        setIsPaused(false);
        setAudioElement(null);
        URL.revokeObjectURL(audioUrl);
        // Fallback to system voice
        alert('Human voice failed, using system voice as fallback');
        speakWithSystemVoice(text);
      };
      
      console.log('Starting audio playback...');
      await audio.play();
      console.log('Human voice playback started successfully!');
      
    } catch (error) {
      console.error('Human voice failed, falling back to system voice:', error);
      if (error.message.includes('temporarily unavailable')) {
        alert(`${error.message} Using system voice instead.`);
      } else {
        alert(`Premium voice error: ${error.message}. Using system voice as fallback.`);
      }
      setIsPlaying(false);
      setIsPaused(false);
      // Fallback to system voice
      speakWithSystemVoice(text);
    }
  };

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

  // Google Cloud Text-to-Speech functions
  // eslint-disable-next-line no-unused-vars
  const getGoogleCloudVoices = async () => {
    try {
      const response = await fetch('/api/google-voices');
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // setGoogleVoices(data.voices); // This function doesn't exist, removing
        }
      }
    } catch (error) {
      console.error('Error fetching Google Cloud voices:', error);
      // Fallback to system voices
      setTtsProvider('browser');
    }
  };

  const speakWithGoogleCloud = async (text) => {
    try {
      console.log('Attempting Google Cloud TTS...');
      setIsPlaying(true);
      setIsPaused(false);
      
      const selectedGoogleVoice = googleCloudVoices[googleVoiceType];
      
      const requestBody = {
        text,
        languageCode: selectedGoogleVoice.languageCode,
        voiceName: selectedGoogleVoice.voiceName,
        ssmlGender: selectedGoogleVoice.gender,
        speakingRate: speechRate
      };

      console.log('Making Google TTS API request with:', requestBody);
      const response = await fetch('/.netlify/functions/google-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });
      console.log('Google TTS API response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Convert base64 audio to blob and play
          const audioData = atob(data.audioContent);
          const audioArray = new Uint8Array(audioData.length);
          for (let i = 0; i < audioData.length; i++) {
            audioArray[i] = audioData.charCodeAt(i);
          }
          
          const audioBlob = new Blob([audioArray], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          const audio = new Audio(audioUrl);
          setAudioElement(audio);
          
          audio.onplay = () => {
            setIsPlaying(true);
            setIsPaused(false);
          };
          
          audio.onended = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setAudioElement(null);
            URL.revokeObjectURL(audioUrl);
          };
          
          audio.onerror = (e) => {
            console.error('Audio playback error:', e);
            setIsPlaying(false);
            setIsPaused(false);
            setAudioElement(null);
            URL.revokeObjectURL(audioUrl);
            // Fallback to system voice
            speakWithSystemVoice(text);
          };
          
          await audio.play();
        }
      } else {
        throw new Error('Google Cloud TTS API request failed');
      }
      
    } catch (error) {
      console.error('Google Cloud TTS error:', error);
      setIsPlaying(false);
      setIsPaused(false);
      // Fallback to system voice
      speakWithSystemVoice(text);
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

    if (selectedCategory === 'custom') {
      if (!customRequest.trim()) return;
      
      setIsGenerating(true);
      setTimeout(async () => {
        const isForSelf = prayerFor === 'myself';
        const customPrayer = generateCustomPrayer(customRequest, isForSelf, personName, prayerLength, selectedOccasion);
        const cleanedPrayer = cleanupPrayerText(customPrayer);
        setCurrentPrayer(cleanedPrayer);
        
        // Save to prayer history if user is logged in (but not guest)
        if (user && user.id !== 'guest' && supabase) {
          try {
            const { error } = await supabase.from('prayer_history').insert({
              user_id: user.id,
              prayer_content: cleanedPrayer,
              category: 'custom'
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
      }, 1200);
    } else {
      setIsGenerating(true);
      setTimeout(async () => {
        // Use dynamic generator for all categories with selected length
        const randomPrayer = generateDynamicPrayer(selectedCategory, prayerLength);
        const cleanedPrayer = cleanupPrayerText(randomPrayer);
        setCurrentPrayer(cleanedPrayer);
        
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
      }, 800);
    }
  };

  const CategoryButton = ({ categoryKey, category }) => {
    const IconComponent = category.icon;
    const isCustom = categoryKey === 'custom';
    const isSelected = selectedCategory === categoryKey;
    
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
          justifyContent: 'center',
          padding: '16px',
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          marginBottom: '12px',
          transition: 'all 0.2s ease',
          background: isSelected ? category.color : '#f3f4f6',
          color: isSelected ? 'white' : '#374151',
          boxShadow: isSelected ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
          transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        }}
        onMouseOver={(e) => {
          if (!isSelected) {
            e.target.style.backgroundColor = '#e5e7eb';
          }
        }}
        onMouseOut={(e) => {
          if (!isSelected) {
            e.target.style.backgroundColor = '#f3f4f6';
          }
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '18px' }}>
            {isCustom ? (
              <img src="/logo192.png" alt="Praying hands" style={{ 
                width: '24px', 
                height: '24px',
                filter: isSelected ? 'brightness(0) invert(1)' : 'brightness(0)' 
              }} />
            ) : (
              <IconComponent size={24} />
            )}
            <span style={{ marginLeft: '8px' }}>{category.name}</span>
          </div>
          <div style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9 }}>{category.description}</div>
        </div>
      </button>
    );
  };

  // User state is now managed by parent App component

  // Login/Signup Landing Page
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #dbeafe, #e0e7ff, #fce7f3)',
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
                color: '#374151',
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
                  width: '60px',
                  height: '60px'
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
            backgroundColor: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '32px',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '8px' }}>
                {showSignUp ? t('createAccount') : t('welcomeBack')}
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {showSignUp ? t('joinCommunity') : t('signInToContinue')}
              </p>
            </div>

            {authError && (
              <div style={{
                backgroundColor: authError.includes('Check your email') ? '#d1fae5' : '#fee2e2',
                color: authError.includes('Check your email') ? '#065f46' : '#991b1b',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '14px',
                textAlign: 'center'
              }}>
                {authError}
              </div>
            )}

            <form onSubmit={showSignUp ? handleSignUp : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {showSignUp && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
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
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      textAlign: 'center',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                    required
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
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
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    textAlign: 'center',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
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
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    textAlign: 'center',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                  onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                  required
                />
              </div>

              {showSignUp && (
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
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
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px',
                      textAlign: 'center',
                      outline: 'none',
                      transition: 'border-color 0.2s ease',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                    onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
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

              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                style={{
                  width: '100%',
                  background: 'white',
                  color: '#374151',
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

            {/* Guest Access Button */}
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                onClick={() => {
                  setUser({ id: 'guest', email: 'guest@demo.com' });
                  setUserSession(null);
                  setShowSignUp(false);
                  setGuestPrayerCount(getGuestPrayerCount());
                }}
                style={{
                  background: 'transparent',
                  color: '#6b7280',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontWeight: '400',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px'
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

  // Main Prayer App (after login)
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #dbeafe, #e0e7ff, #fce7f3)',
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
                  width: '60px',
                  height: '60px'
                }}
              />
            </div>
          </div>
          <h1 style={{
            fontSize: '48px',
            fontWeight: '300',
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
          
          {/* User info */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Welcome, {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>

          {/* Usage Counter for all non-premium users */}
          {!isPremium && (
            <div style={{
              backgroundColor: (userSession && user?.id !== 'guest' ? dailyPrayerCount : guestPrayerCount) >= 3 ? '#fef2f2' : '#f0f9ff',
              border: `1px solid ${(userSession && user?.id !== 'guest' ? dailyPrayerCount : guestPrayerCount) >= 3 ? '#fecaca' : '#bae6fd'}`,
              borderRadius: '8px',
              padding: '12px 16px',
              marginTop: '16px',
              textAlign: 'center'
            }}>
              <div style={{
                color: (userSession && user?.id !== 'guest' ? dailyPrayerCount : guestPrayerCount) >= 3 ? '#dc2626' : '#0369a1',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {(userSession && user?.id !== 'guest' ? dailyPrayerCount : guestPrayerCount) >= 3 
                  ? '⚠️ Daily limit reached' 
                  : `🎯 ${3 - (userSession && user?.id !== 'guest' ? dailyPrayerCount : guestPrayerCount)} prayers left today`}
              </div>
              {(userSession && user?.id !== 'guest' ? dailyPrayerCount : guestPrayerCount) >= 3 && (
                <div style={{
                  color: '#6b7280',
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
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', textAlign: 'center' }}>{t('chooseCategory')}</h2>
            {Object.entries(prayerCategories).map(([key, category]) => (
              <CategoryButton key={key} categoryKey={key} category={category} />
            ))}
          </div>

          {/* Prayer Display */}
          <div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '32px',
              border: '1px solid #e5e7eb'
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
                      <img src="/logo192.png" alt="Praying hands" style={{ width: '20px', height: '20px' }} />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
                      Create Custom Prayer
                    </h2>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    {/* Who is this prayer for? */}
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', textAlign: 'center' }}>
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
                            borderColor: prayerFor === 'myself' ? '#6366f1' : '#d1d5db',
                            backgroundColor: prayerFor === 'myself' ? '#eef2ff' : 'white',
                            color: prayerFor === 'myself' ? '#4338ca' : '#374151',
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
                            borderColor: prayerFor === 'someone' ? '#8b5cf6' : '#d1d5db',
                            backgroundColor: prayerFor === 'someone' ? '#f3e8ff' : 'white',
                            color: prayerFor === 'someone' ? '#7c3aed' : '#374151',
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
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', textAlign: 'center' }}>
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
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', textAlign: 'center' }}>
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
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', textAlign: 'center' }}>
                        Prayer length:
                      </label>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <button
                          onClick={() => setPrayerLength('brief')}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            border: '2px solid',
                            borderColor: prayerLength === 'brief' ? '#10b981' : '#d1d5db',
                            backgroundColor: prayerLength === 'brief' ? '#d1fae5' : 'white',
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
                            borderColor: prayerLength === 'medium' ? '#6366f1' : '#d1d5db',
                            backgroundColor: prayerLength === 'medium' ? '#eef2ff' : 'white',
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
                            borderColor: prayerLength === 'comprehensive' ? '#8b5cf6' : '#d1d5db',
                            backgroundColor: prayerLength === 'comprehensive' ? '#f3e8ff' : 'white',
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
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px', textAlign: 'center' }}>
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
                          backgroundColor: prayerLength === 'brief' ? '#ecfdf5' : 'white',
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
                          backgroundColor: prayerLength === 'medium' ? '#eef2ff' : 'white',
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
                          backgroundColor: prayerLength === 'comprehensive' ? '#f3e8ff' : 'white',
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
                      background: 'linear-gradient(135deg, #eef2ff, #f3e8ff, #fef7f7)',
                      padding: '24px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      border: '1px solid #c7d2fe',
                      margin: '0 auto 16px'
                    }}>
                      <p style={{
                        fontSize: '18px',
                        color: '#374151',
                        lineHeight: '1.6',
                        textAlign: 'center',
                        margin: 0
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
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <Volume2 size={20} color="#64748b" />
                      
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
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        textAlign: 'left'
                      }}>
                        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                          Voice Settings
                        </h4>
                        
                        {/* Voice Type Toggle */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
                            Voice Quality:
                          </label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setUseHumanVoice(true)}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                backgroundColor: useHumanVoice ? '#10b981' : '#f3f4f6',
                                color: useHumanVoice ? 'white' : '#6b7280',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              🎭 Human-like
                            </button>
                            <button
                              onClick={() => setUseHumanVoice(false)}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                backgroundColor: !useHumanVoice ? '#10b981' : '#f3f4f6',
                                color: !useHumanVoice ? 'white' : '#6b7280',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              🤖 System
                            </button>
                          </div>
                        </div>

                        {/* Voice Tier Selection */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
                            Choose voice tier:
                          </label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setTtsProvider('browser')}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                backgroundColor: ttsProvider === 'browser' ? '#10b981' : '#f3f4f6',
                                color: ttsProvider === 'browser' ? 'white' : '#6b7280',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              Free
                            </button>
                            <button
                              onClick={() => setTtsProvider('google')}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                backgroundColor: ttsProvider === 'google' ? '#3b82f6' : '#f3f4f6',
                                color: ttsProvider === 'google' ? 'white' : '#6b7280',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              Standard $4.99
                            </button>
                            <button
                              onClick={() => setTtsProvider('elevenlabs')}
                              style={{
                                flex: 1,
                                padding: '8px 12px',
                                backgroundColor: ttsProvider === 'elevenlabs' ? '#6366f1' : '#f3f4f6',
                                color: ttsProvider === 'elevenlabs' ? 'white' : '#6b7280',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              Premium $7.99
                            </button>
                          </div>
                        </div>

                        {/* FREE TIER: No voice selection */}
                        {ttsProvider === 'browser' && (
                          <div style={{
                            textAlign: 'center',
                            color: '#6b7280',
                            fontSize: '14px',
                            padding: '20px',
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb'
                          }}>
                            🎤 Using system voices (Free tier)
                            <div style={{ fontSize: '12px', marginTop: '4px' }}>
                              No voice selection needed
                            </div>
                          </div>
                        )}

                        {/* PREMIUM TIER: ElevenLabs Voices */}
                        {ttsProvider === 'elevenlabs' && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {Object.entries(humanVoices).map(([key, voice]) => (
                                  <button
                                    key={key}
                                    onClick={() => setHumanVoiceType(key)}
                                    style={{
                                      padding: '12px',
                                      backgroundColor: humanVoiceType === key ? '#eef2ff' : '#ffffff',
                                      border: humanVoiceType === key ? '2px solid #6366f1' : '1px solid #e5e7eb',
                                      borderRadius: '6px',
                                      textAlign: 'left',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '2px' }}>
                                      {voice.name}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                      {voice.description}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* STANDARD TIER: Google Cloud TTS Voices */}
                            {ttsProvider === 'google' && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {Object.entries(googleCloudVoices).map(([key, voice]) => (
                                  <button
                                    key={key}
                                    onClick={() => setGoogleVoiceType(key)}
                                    style={{
                                      padding: '12px',
                                      backgroundColor: googleVoiceType === key ? '#dbeafe' : '#ffffff',
                                      border: googleVoiceType === key ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                      borderRadius: '6px',
                                      textAlign: 'left',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <div style={{ fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '2px' }}>
                                      {voice.name}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                      {voice.description}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* FREE TIER: No voice selection */}
                            {ttsProvider === 'browser' && (
                              <div style={{
                                textAlign: 'center',
                                color: '#6b7280',
                                fontSize: '14px',
                                padding: '20px',
                                backgroundColor: '#f9fafb',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb'
                              }}>
                                🎤 Using system voices (Free tier)
                                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                                  Choose Standard or Premium for more voice options
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
                              background: 'none',
                              border: '1px solid #d1d5db',
                              color: '#6b7280',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#f9fafb';
                              e.target.style.borderColor = '#9ca3af';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.borderColor = '#d1d5db';
                            }}
                          >
                            Sign Out
                          </button>
                        )}
                        
                        {user && user.id !== 'guest' && (
                          <button
                            onClick={handleSignOut}
                            style={{
                              background: 'none',
                              border: '1px solid #d1d5db',
                              color: '#6b7280',
                              padding: '12px 20px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              minHeight: '44px',
                              minWidth: '100px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#f9fafb';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                            }}
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
                        backgroundColor: selectedCategory === 'custom' ? '#6366f1' : prayerCategories[selectedCategory].color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {(selectedCategory === 'gratitude' || !selectedCategory) && <Heart size={36} color="white" />}
                        {selectedCategory === 'morning' && <Sun size={36} color="white" />}
                        {selectedCategory === 'bedtime' && <Moon size={36} color="white" />}
                        {selectedCategory === 'healing' && <Sparkles size={36} color="white" />}
                        {selectedCategory === 'family' && <Users size={36} color="white" />}
                        {selectedCategory === 'grace' && <Utensils size={36} color="white" />}
                        {selectedCategory === 'bibleVerses' && <Book size={36} color="white" />}
                        {selectedCategory === 'custom' && (
                          <img src="/logo192.png" alt="Praying hands" style={{ 
                            width: '36px', 
                            height: '36px',
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
                              background: 'none',
                              border: '1px solid #d1d5db',
                              color: '#6b7280',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#f9fafb';
                              e.target.style.borderColor = '#9ca3af';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                              e.target.style.borderColor = '#d1d5db';
                            }}
                          >
                            Sign Out
                          </button>
                        )}
                        
                        {user && user.id !== 'guest' && (
                          <button
                            onClick={handleSignOut}
                            style={{
                              background: 'none',
                              border: '1px solid #d1d5db',
                              color: '#6b7280',
                              padding: '12px 20px',
                              borderRadius: '6px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              minHeight: '44px', 
                              minWidth: '100px',
                              touchAction: 'manipulation',
                              WebkitTapHighlightColor: 'transparent'
                            }}
                            onMouseOver={(e) => {
                              e.target.style.backgroundColor = '#f3f4f6';
                            }}
                            onMouseOut={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                            }}
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
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
                Share this prayer
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
                  padding: '4px'
                }}
              >
                ×
              </button>
            </div>

            {/* Anonymous sharing toggle */}
            <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
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
                  color: '#6b7280', 
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
                  onClick={() => socialSharing.copyToClipboard(currentPrayer)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#6b7280',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <Copy size={16} />
                  Copy
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
                  onClick={() => socialSharing.shareToTwitter(currentPrayer)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#1da1f2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <Twitter size={16} />
                  Twitter
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
                
                <button
                  onClick={() => socialSharing.shareToInstagram(currentPrayer)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    backgroundColor: '#E4405F',
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
                  color: '#374151',
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
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ margin: 0, color: '#1f2937', fontSize: '24px', fontWeight: 'bold' }}>
                {t('myPrayers')}
              </h2>
              <button
                onClick={() => setShowPrayerHistory(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#6b7280',
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
                        color: '#6b7280',
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
            backgroundColor: 'white',
            borderRadius: '12px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
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
                    color: '#374151',
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
};

// Main App component with subscription context
let appInitialized = false;
const App = () => {
  if (!appInitialized) {
    console.log('App component initializing...');
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