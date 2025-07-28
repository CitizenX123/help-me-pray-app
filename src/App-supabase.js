import React, { useState, useEffect } from 'react';
import { Heart, Sun, Moon, Users, Sparkles, RefreshCw, User, Send, Utensils, Share2, Copy, MessageCircle, Facebook, Twitter, Smartphone, Instagram, Volume2, Play, Pause, Square, Settings } from 'lucide-react';
import { supabase } from './supabaseClient';

const HelpMePrayApp = () => {
  const [selectedCategory, setSelectedCategory] = useState('gratitude');
  const [currentPrayer, setCurrentPrayer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [user, setUser] = useState(null);
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
  
  // Prayer sharing state
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareAnonymously, setShareAnonymously] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [shareSuccess, setShareSuccess] = useState('');
  
  // Text-to-speech state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [speechRate, setSpeechRate] = useState(1);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [useHumanVoice, setUseHumanVoice] = useState(true);
  const [humanVoiceType, setHumanVoiceType] = useState('compassionate');
  const [audioElement, setAudioElement] = useState(null);
  const [currentAudioBlob, setCurrentAudioBlob] = useState(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);

  // Check for existing session on component mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  // Function to generate unique prayers with length options
  const generateDynamicPrayer = (category, length = 'medium') => {
    const templates = prayerTemplates[category];
    if (!templates) return null;
    
    if (length === 'brief') {
      // Brief: Opening + Subject only (1 sentence)
      const randomOpening = templates.openings[Math.floor(Math.random() * templates.openings.length)];
      const randomSubject = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
      return `${randomOpening} ${randomSubject}.`;
      
    } else if (length === 'medium') {
      // Standard: 2 paragraphs minimum
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
      
      const randomClosing1 = templates.closings[Math.floor(Math.random() * templates.closings.length)];
      let randomClosing2 = templates.closings[Math.floor(Math.random() * templates.closings.length)];
      while (randomClosing2 === randomClosing1) {
        randomClosing2 = templates.closings[Math.floor(Math.random() * templates.closings.length)];
      }
      
      return `${randomOpening} ${randomSubject1}. ${randomSubject2}. ${randomSubject3}.

${randomClosing1} ${randomClosing2} In your holy name we pray, Amen.`;
      
    } else {
      // Comprehensive: 2-3 paragraphs
      const randomOpening = templates.openings[Math.floor(Math.random() * templates.openings.length)];
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
      
      return `${randomOpening} ${randomSubject1}. ${randomSubject2}. We come before you with humble hearts, acknowledging your sovereignty and grace in our lives.

${randomSubject3}. ${randomSubject4}. We trust in your perfect timing and your infinite wisdom, knowing that you work all things together for our good.

${randomClosing1} ${randomClosing2} ${randomClosing3} We offer this prayer in faith, believing in your goodness and love. In Jesus' name we pray, Amen.`;
    }
  };

  const prayerCategories = {
    gratitude: {
      icon: Heart,
      name: 'Gratitude',
      description: 'Prayers for thanksgiving and expressing appreciation',
      color: '#6366f1',
      prayers: [
        "Thank you for the gift of this new day and all the opportunities it brings. Help me to see beauty in the ordinary moments and find joy in simple pleasures.",
        "I am grateful for the love that surrounds me, the roof over my head, and the food on my table. May I never take these blessings for granted.",
        "Thank you for my health, my family, and the ability to make a positive difference in the world. Guide me to use these gifts wisely."
      ]
    },
    morning: {
      icon: Sun,
      name: 'Morning',
      description: 'Prayers to start your day with purpose and hope',
      color: '#f59e0b',
      prayers: [
        "As I begin this new day, fill my heart with hope and my mind with clarity. Guide my steps and help me be a source of light to others.",
        "Grant me strength for today's challenges and wisdom for today's decisions. May I approach each task with patience and purpose.",
        "Help me to start this day with a grateful heart and an open mind. May I be present in each moment and kind in every interaction."
      ]
    },
    bedtime: {
      icon: Moon,
      name: 'Bedtime',
      description: 'Prayers for reflection, rest, and peaceful sleep',
      color: '#1e293b',
      prayers: [
        "As I prepare for sleep, I reflect on the moments of grace and growth from today. Help me learn from today's experiences and rest in Your peace.",
        "Thank you for carrying me through another day. Forgive me for any mistakes I've made and help me do better tomorrow.",
        "Grant me peaceful sleep and healing rest. May tomorrow bring new opportunities to serve and to love more deeply."
      ]
    },
    healing: {
      icon: Sparkles,
      name: 'Healing',
      description: 'Prayers for physical, emotional, and spiritual restoration',
      color: '#10b981',
      prayers: [
        "Grant healing to all who are suffering - in body, mind, or spirit. Bring comfort to the afflicted and strength to those who care for them.",
        "Help me heal from past hurts and find the courage to forgive. May I release resentment and embrace peace in my heart.",
        "Restore what is broken within me and around me. Give me patience with the healing process and hope for better days ahead."
      ]
    },
    family: {
      icon: Users,
      name: 'Family & Friends',
      description: 'Prayers for relationships and loved ones',
      color: '#8b5cf6',
      prayers: [
        "Bless my family with love, understanding, and unity. Help us support each other through life's joys and challenges.",
        "Watch over my friends and loved ones wherever they may be. Keep them safe, healthy, and surrounded by your love.",
        "Help me be a better family member and friend. Give me patience, kindness, and the wisdom to know when to speak and when to listen."
      ]
    },
    grace: {
      icon: Utensils,
      name: 'Grace',
      description: 'Dedicated to blessing the meals',
      color: '#8b4513',
      prayers: [
        "Lord, we thank you for this meal and the hands that prepared it. May this food nourish our bodies and strengthen us to serve you.",
        "God, bless this food to our bodies and our fellowship to your glory. Use us to be a blessing to others as you have blessed us.",
        "Our Father, we are grateful for your provision and the abundance before us. Help us to always remember those in need."
      ]
    },
    custom: {
      icon: Send,
      name: 'Create Custom Prayer',
      description: 'Generate personalized prayers for any situation',
      color: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
      prayers: []
    }
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

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
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
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

  const generateCustomPrayer = (request, isForSelf, name, length, occasion = '') => {
    // Filter the prayer request
    const filteredRequest = filterContent(request);
    if (filteredRequest === null) {
      return "We're sorry, but your prayer request contains inappropriate content. Please revise your request to focus on positive, respectful language that honors the spirit of prayer.";
    }
    
    // Filter the person's name
    const filteredName = name ? filterContent(name) : name;
    if (filteredName === null) {
      return "We're sorry, but the name you entered contains inappropriate content. Please use a respectful name.";
    }
    
    let prayerTemplate = "";

    if (occasion === 'addiction') {
      if (isForSelf) {
        prayerTemplate = `Heavenly Father, I come to you broken and in desperate need of your healing power. Lord, I confess that I cannot overcome this addiction on my own - I need your divine intervention. Break the chains that bind me and set me free from this destructive cycle. Give me strength for each moment of temptation and surround me with people who will support my recovery. I trust in your power to make me new. Amen.`;
      } else {
        const personRef = filteredName || 'this person';
        const possessive = filteredName ? filteredName + "'s" : 'their';
        const objectPronoun = filteredName || 'them';
        
        prayerTemplate = `Compassionate God, I come to you with a heavy heart, lifting up ${personRef} who is battling addiction. Lord, you see the pain and bondage that they are experiencing. I ask for your divine intervention in ${possessive} life. Break the chains that bind ${objectPronoun} and give ${objectPronoun} strength to overcome this destructive cycle. Surround ${objectPronoun} with people who will support ${possessive} recovery journey with love and without judgment. We trust in your power to redeem and restore ${objectPronoun}. Amen.`;
      }
    } else {
      if (isForSelf) {
        prayerTemplate = `Dear God, I bring my heart and this request before you. Please hear my prayer and respond according to your perfect will and timing. Grant me faith to trust in your goodness, even when I cannot see the way forward. Fill me with your love, peace, and hope. Amen.`;
      } else {
        const personRef = filteredName || 'this person';
        const possessive = filteredName ? filteredName + "'s" : 'their';
        const objectPronoun = filteredName || 'them';
        
        prayerTemplate = `Loving Father, I lift up ${personRef} to you in prayer. Please hear this prayer and move in ${possessive} situation according to your perfect will. Bless ${objectPronoun} with your presence and fill ${possessive} heart with hope. Surround ${objectPronoun} with your love and the support of caring people. Amen.`;
      }
    }
    
    return prayerTemplate;
  };

  // Social sharing functions
  const formatPrayerForSharing = (prayer, includeAttribution = true) => {
    const appBranding = "\n\n🙏 Generated with Help Me Pray\nDownload: helpmepray.app";
    const attribution = shareAnonymously ? "" : (user ? `\n\nShared by ${user.user_metadata?.full_name || 'a friend'}` : "");
    
    return `${prayer}${includeAttribution ? attribution : ""}${appBranding}`;
  };
  
  // Human-like voice configurations
  const humanVoices = {
    compassionate: {
      name: 'Compassionate Reader',
      description: 'Warm, gentle voice perfect for prayers',
      voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam (ElevenLabs)
      stability: 0.5,
      similarity_boost: 0.8,
      style: 0.0,
      use_speaker_boost: true
    },
    nurturing: {
      name: 'Nurturing Guide',
      description: 'Soft, caring maternal voice',
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella (ElevenLabs)
      stability: 0.6,
      similarity_boost: 0.7,
      style: 0.1,
      use_speaker_boost: true
    },
    peaceful: {
      name: 'Peaceful Spirit',
      description: 'Calm, meditative voice for reflection',
      voiceId: 'ErXwobaYiN019PkySvjV', // Antoni (ElevenLabs)
      stability: 0.7,
      similarity_boost: 0.6,
      style: 0.0,
      use_speaker_boost: true
    }
  };

  // Text-to-speech functions
  const speakPrayer = async (text) => {
    if (useHumanVoice) {
      await speakWithHumanVoice(text);
    } else {
      speakWithSystemVoice(text);
    }
  };

  const speakWithHumanVoice = async (text) => {
    try {
      console.log('Attempting human voice with:', humanVoiceType);
      console.log('API Key available:', !!process.env.REACT_APP_ELEVENLABS_API_KEY);
      
      setIsPlaying(true);
      setIsPaused(false);

      const voiceConfig = humanVoices[humanVoiceType];
      console.log('Using voice config:', voiceConfig.name);
      
      // Truncate text for demo if too long (ElevenLabs has character limits)
      const truncatedText = text.length > 2500 ? text.substring(0, 2500) + '...' : text;
      
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
      setCurrentAudioUrl(audioUrl);
      
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
      alert(`Human voice error: ${error.message}. Using system voice as fallback.`);
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

  const generatePrayer = async () => {
    if (selectedCategory === 'custom') {
      if (!customRequest.trim()) return;
      
      setIsGenerating(true);
      setTimeout(async () => {
        const isForSelf = prayerFor === 'myself';
        const customPrayer = generateCustomPrayer(customRequest, isForSelf, personName, prayerLength, selectedOccasion);
        setCurrentPrayer(customPrayer);
        
        // Save to prayer history if user is logged in
        if (user) {
          await supabase.from('prayer_history').insert({
            user_id: user.id,
            prayer_content: customPrayer,
            category: 'custom',
            occasion: selectedOccasion,
            prayer_for: prayerFor,
            person_name: personName
          });
        }
        
        setIsGenerating(false);
      }, 1200);
    } else {
      setIsGenerating(true);
      setTimeout(async () => {
        // Use dynamic generator for all categories with selected length
        const randomPrayer = generateDynamicPrayer(selectedCategory, prayerLength);
        setCurrentPrayer(randomPrayer);
        
        // Save to prayer history if user is logged in
        if (user) {
          await supabase.from('prayer_history').insert({
            user_id: user.id,
            prayer_content: randomPrayer,
            category: selectedCategory
          });
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
            <IconComponent size={24} />
            <span style={{ marginLeft: '8px' }}>{category.name}</span>
          </div>
          <div style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9 }}>{category.description}</div>
        </div>
      </button>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #dbeafe, #e0e7ff, #fce7f3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '50%',
            marginBottom: '-10px'
          }}>
            <Heart size={40} color="white" />
          </div>
          <p style={{ fontSize: '18px', color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

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
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '50%',
              marginBottom: '-10px'
            }}>
              <Heart size={40} color="white" />
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
            }}>Help Me Pray</h1>
            <p style={{ color: '#6b7280', textAlign: 'center' }}>Find inspiration and guidance through meaningful prayers</p>
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
                {showSignUp ? 'Create Account' : 'Welcome'}
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {showSignUp ? 'Join our prayer community' : 'Sign in to begin your prayer journey'}
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
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
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
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
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
                {authLoading ? (showSignUp ? 'Creating Account...' : 'Signing In...') : (showSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {showSignUp ? 'Already have an account?' : "Don't have an account?"}
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
                  {showSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
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
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '50%',
              marginBottom: '-10px'
            }}>
              <Heart size={40} color="white" />
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
          }}>Help Me Pray</h1>
          <p style={{ color: '#6b7280', textAlign: 'center' }}>Find inspiration and guidance through meaningful prayers</p>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
            <div style={{
              width: '96px',
              height: '4px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899)',
              borderRadius: '2px'
            }}></div>
          </div>
          
          {/* User info and sign out */}
          <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
              Welcome, {user?.user_metadata?.full_name || user?.email}
            </p>
            <button
              onClick={handleSignOut}
              style={{
                background: 'none',
                border: '1px solid #d1d5db',
                color: '#6b7280',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer'
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
          </div>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Categories */}
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '16px', textAlign: 'center' }}>Choose a Category</h2>
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', textAlign: 'center', width: '100%' }}>
                      Create Custom Prayer
                    </h2>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    {/* Who is this prayer for? */}
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
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
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
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
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
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
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
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
                          Brief
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
                          Standard
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
                          Comprehensive
                        </button>
                      </div>
                    </div>

                    {/* Prayer request */}
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                        What would you like to pray about?
                      </label>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div>
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
                              width: '400px',
                              padding: '8px 12px',
                              border: '1px solid #d1d5db',
                              borderRadius: '8px',
                              fontSize: '14px',
                              resize: 'none',
                              outline: 'none'
                            }}
                          />
                          <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '4px' }}>
                            {customRequest.length}/500 characters
                          </div>
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
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
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
                        Brief
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
                        Standard
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
                        Comprehensive
                      </button>
                    </div>
                    <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', textAlign: 'center' }}>
                      {prayerLength === 'brief' && 'A short, focused prayer (1 sentence)'}
                      {prayerLength === 'medium' && 'A standard prayer with good depth (2 paragraphs)'}
                      {prayerLength === 'comprehensive' && 'A detailed, thorough prayer (2-3 paragraphs)'}
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
                  <span>{isGenerating ? 'Generating...' : 'Generate Prayer'}</span>
                </button>
              </div>

              <div style={{ minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {currentPrayer ? (
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

                        {useHumanVoice ? (
                          <div style={{ marginBottom: '12px' }}>
                            <label style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px', display: 'block' }}>
                              Choose a compassionate voice:
                            </label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                            <div style={{ 
                              fontSize: '11px', 
                              color: '#9ca3af', 
                              marginTop: '8px', 
                              padding: '8px',
                              backgroundColor: '#f9fafb',
                              borderRadius: '4px',
                              border: '1px solid #f3f4f6'
                            }}>
                              💡 Human-like voices provide natural, compassionate speech perfect for prayers. Falls back to system voice if unavailable.
                            </div>
                          </div>
                        ) : (
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
                      {React.createElement(prayerCategories[selectedCategory].icon, { size: 32, color: 'white' })}
                    </div>
                    <p style={{ fontSize: '18px', marginBottom: '8px', textAlign: 'center' }}>
                      Ready to generate a {prayerCategories[selectedCategory].name.toLowerCase()} prayer
                    </p>
                    <p style={{ fontSize: '14px', textAlign: 'center', margin: 0 }}>
                      Click "Generate Prayer" to begin
                    </p>
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

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default HelpMePrayApp;