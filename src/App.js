import React, { useState, useEffect } from 'react';
import { Heart, Sun, Moon, Users, Sparkles, RefreshCw, User, Send, Utensils, Volume2, Play, Pause, Square } from 'lucide-react';
import { supabase } from './supabaseClient';
import { SubscriptionProvider, useSubscription } from './SubscriptionContext';

const PrayerAppContent = ({ user: propUser }) => {
  const { isPremium } = useSubscription();
  const [selectedCategory, setSelectedCategory] = useState('gratitude');
  const [currentPrayer, setCurrentPrayer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  
  // Authentication state (managed by parent wrapper)
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  
  // Text-to-Speech state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [ttsProvider, setTtsProvider] = useState('browser');
  const [selectedVoice, setSelectedVoice] = useState('en-US-AvaMultilingualNeural');
  const [currentAudio, setCurrentAudio] = useState(null);
  
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

  // Use passed user prop or create guest user
  const [user, setUser] = useState(propUser || { id: 'guest', email: '', isGuest: true });

  // Authentication functions
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
        },
      },
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setAuthError('Check your email for a verification link!');
    }

    setAuthLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError('');

    if (!supabase) {
      setAuthError('Authentication not available in offline mode');
      setAuthLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Google sign-in error:', error);
      setAuthError('Failed to sign in with Google');
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
    } else {
      setUser(null);
    }
  };

  const continueAsGuest = () => {
    setUser({ id: 'guest', email: '', isGuest: true });
  };

  // Text-to-Speech functions
  const speakPrayer = async (text) => {
    try {
      // Stop any currently playing audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setCurrentAudio(null);
      }

      setIsPlaying(true);
      setIsPaused(false);

      // Use Azure TTS for premium users, browser TTS for others
      if (isPremium && ttsProvider === 'azure') {
        await speakWithAzureTTS(text);
      } else {
        await speakWithBrowserTTS(text);
      }
    } catch (error) {
      console.error('Error speaking prayer:', error);
      setIsPlaying(false);
    }
  };

  const speakWithAzureTTS = async (text) => {
    try {
      const response = await fetch('/api/azure-tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voiceName: selectedVoice,
          speakingRate: 0.9,
          pitch: 0
        }),
      });

      if (!response.ok) {
        throw new Error('Azure TTS request failed');
      }

      const data = await response.json();
      
      if (data.success) {
        // Convert base64 audio to playable format
        const audioBlob = new Blob([Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))], {
          type: 'audio/mpeg'
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        setCurrentAudio(audio);
        
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error('Azure TTS Error:', error);
      // Fallback to browser TTS
      await speakWithBrowserTTS(text);
    }
  };

  const speakWithBrowserTTS = async (text) => {
    return new Promise((resolve, reject) => {
      if (!window.speechSynthesis) {
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      // Try to use a good quality voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Enhanced') || 
        voice.name.includes('Premium') ||
        voice.name.includes('Neural')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
        resolve();
      };

      utterance.onerror = (event) => {
        setIsPlaying(false);
        reject(new Error(event.error));
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  const pauseAudio = () => {
    if (currentAudio && isPlaying) {
      currentAudio.pause();
      setIsPaused(true);
      setIsPlaying(false);
    } else if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const resumeAudio = () => {
    if (currentAudio && isPaused) {
      currentAudio.play();
      setIsPaused(false);
      setIsPlaying(true);
    } else if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
    }
    
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Dynamic prayer components for generating unique prayers
  const prayerTemplates = {
    gratitude: {
      openings: [
        "Thank you for the gift of",
        "I am grateful for",
        "My heart overflows with gratitude for",
        "I give thanks for",
        "Blessed be the gift of",
        "I appreciate the blessing of"
      ],
      subjects: [
        "this new day and all the opportunities it brings",
        "the love that surrounds me",
        "my health, my family, and my ability to make a difference",
        "the simple joys and everyday miracles",
        "the strength you provide during difficult times",
        "the wisdom gained through life's experiences",
        "the beauty found in ordinary moments",
        "the grace that carries me through each day"
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
        "As I begin this new day,",
        "With the dawn of this morning,",
        "As sunlight breaks through,",
        "At the start of this fresh day,",
        "With renewed hope this morning,",
        "As I welcome this new beginning,"
      ],
      subjects: [
        "fill my heart with hope and my mind with clarity",
        "grant me strength for today's challenges and wisdom for decisions",
        "help me approach each moment with presence and purpose",
        "guide my steps and let me be a source of light to others",
        "give me patience for difficulties and joy in small victories",
        "inspire me to live with intention and compassion",
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
        "As this day comes to a close,",
        "In the quiet of this evening,",
        "As night falls gently,",
        "At the end of this day,",
        "In these peaceful moments,",
        "As I prepare for rest,"
      ],
      subjects: [
        "I reflect on the moments of grace and growth",
        "I release the worries and burdens of today",
        "I find peace in your constant presence",
        "I surrender my concerns to your loving care",
        "I cherish the blessings this day has brought",
        "I seek forgiveness for any mistakes I've made"
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
        "Divine Healer,",
        "Source of all comfort,",
        "God of restoration,",
        "Loving Father,",
        "Great Physician,",
        "Merciful God,"
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
        "Loving God,",
        "Creator of families,",
        "Source of all love,",
        "Divine Father,",
        "God of relationships,",
        "Heavenly Parent,"
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
        "Gracious God,",
        "Generous Provider,",
        "Source of all good gifts,",
        "Heavenly Father,",
        "Creator and Sustainer,",
        "Lord of the harvest,"
      ],
      subjects: [
        "we thank you for this meal and the hands that prepared it",
        "bless this food to our bodies and our fellowship to your glory",
        "we are grateful for your provision and the abundance before us",
        "thank you for bringing us together around this table",
        "bless those who do not have enough and help us to share",
        "we acknowledge that every good gift comes from you",
        "thank you for the farmers, workers, and all who made this meal possible"
      ],
      closings: [
        "May this food nourish our bodies and strengthen us to serve you.",
        "Use us to be a blessing to others as you have blessed us.",
        "Help us to always remember those in need.",
        "May our gratitude overflow into acts of kindness.",
        "Bless this time of fellowship and conversation.",
        "Thank you for your constant care and provision."
      ]
    }
  };

  const prayerCategories = {
    gratitude: {
      icon: Heart,
      name: 'Gratitude',
      description: 'Prayers for thanksgiving and expressing appreciation',
      color: 'bg-indigo-500'
    },
    morning: {
      icon: Sun,
      name: 'Morning',
      description: 'Prayers to start your day with purpose and hope',
      color: 'bg-amber-500'
    },
    bedtime: {
      icon: Moon,
      name: 'Bedtime',
      description: 'Prayers for reflection, rest, and peaceful sleep',
      color: 'bg-rose-500'
    },
    healing: {
      icon: Sparkles,
      name: 'Healing',
      description: 'Prayers for physical, emotional, and spiritual restoration',
      color: 'bg-emerald-500'
    },
    family: {
      icon: Users,
      name: 'Family & Friends',
      description: 'Prayers for relationships and loved ones',
      color: 'bg-purple-500'
    },
    grace: {
      icon: Utensils,
      name: 'Grace',
      description: 'Dedicated to blessing the meals',
      color: 'bg-orange-500'
    },
    custom: {
      icon: Send,
      name: 'Create Custom Prayer',
      description: 'Generate personalized prayers for any situation',
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500'
    }
  };

  // Function to generate unique prayers
  const generateDynamicPrayer = (category) => {
    const templates = prayerTemplates[category];
    if (!templates) return "Prayer not found.";
    
    const randomOpening = templates.openings[Math.floor(Math.random() * templates.openings.length)];
    const randomSubject = templates.subjects[Math.floor(Math.random() * templates.subjects.length)];
    const randomClosing = templates.closings[Math.floor(Math.random() * templates.closings.length)];
    
    return `${randomOpening} ${randomSubject}. ${randomClosing}`;
  };

  const occasions = {
    'christmas': 'Christmas/Advent',
    'easter': 'Easter/Lent', 
    'thanksgiving': 'Thanksgiving',
    'addiction': 'Addiction Recovery',
    'funeral': 'Funeral/Grief',
    'surgery': 'Hospital/Surgery'
  };


  const generateCustomPrayer = (request, isForSelf, name, length, occasion = '') => {
    let prayerTemplate = "";

    if (occasion === 'addiction') {
      if (isForSelf) {
        prayerTemplate = `Heavenly Father, I come to you broken and in desperate need of your healing power. Lord, I confess that I cannot overcome this addiction on my own - I need your divine intervention. Break the chains that bind me and set me free from this destructive cycle. Give me strength for each moment of temptation and surround me with people who will support my recovery. I trust in your power to make me new. Amen.`;
      } else {
        const personRef = name || 'this person';
        const possessive = name ? name + "'s" : 'their';
        const objectPronoun = name || 'them';
        
        prayerTemplate = `Compassionate God, I come to you with a heavy heart, lifting up ${personRef} who is battling addiction. Lord, you see the pain and bondage that they are experiencing. I ask for your divine intervention in ${possessive} life. Break the chains that bind ${objectPronoun} and give ${objectPronoun} strength to overcome this destructive cycle. Surround ${objectPronoun} with people who will support ${possessive} recovery journey with love and without judgment. We trust in your power to redeem and restore ${objectPronoun}. Amen.`;
      }
    } else {
      if (isForSelf) {
        prayerTemplate = `Dear God, I bring my heart and this request before you. Please hear my prayer and respond according to your perfect will and timing. Grant me faith to trust in your goodness, even when I cannot see the way forward. Fill me with your love, peace, and hope. Amen.`;
      } else {
        const personRef = name || 'this person';
        const possessive = name ? name + "'s" : 'their';
        const objectPronoun = name || 'them';
        
        prayerTemplate = `Loving Father, I lift up ${personRef} to you in prayer. Please hear this prayer and move in ${possessive} situation according to your perfect will. Bless ${objectPronoun} with your presence and fill ${possessive} heart with hope. Surround ${objectPronoun} with your love and the support of caring people. Amen.`;
      }
    }
    
    return prayerTemplate;
  };

  const generatePrayer = () => {
    if (selectedCategory === 'custom') {
      if (!customRequest.trim()) return;
      
      setIsGenerating(true);
      setTimeout(() => {
        const isForSelf = prayerFor === 'myself';
        const customPrayer = generateCustomPrayer(customRequest, isForSelf, personName, prayerLength, selectedOccasion);
        setCurrentPrayer(customPrayer);
        setIsGenerating(false);
      }, 1200);
    } else {
      setIsGenerating(true);
      setTimeout(() => {
        const dynamicPrayer = generateDynamicPrayer(selectedCategory);
        setCurrentPrayer(dynamicPrayer);
        setIsGenerating(false);
      }, 800);
    }
  };

  const CategoryButton = ({ categoryKey, category }) => {
    const IconComponent = category.icon;
    const isCustom = categoryKey === 'custom';
    return (
      <button
        onClick={() => {
          setSelectedCategory(categoryKey);
          setShowCustomForm(isCustom);
          if (!isCustom) {
            setCurrentPrayer('');
          }
        }}
        className={`flex items-center justify-center p-4 rounded-xl transition-all duration-200 w-full ${
          selectedCategory === categoryKey
            ? isCustom 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105'
              : `${category.color} text-white shadow-lg transform scale-105`
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
      >
        <div className="text-center">
          <div className="flex items-center justify-center font-semibold text-lg">
            <IconComponent size={24} />
            <span className="ml-2">{category.name}</span>
          </div>
          <div className="text-sm mt-1 opacity-90">{category.description}</div>
        </div>
      </button>
    );
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
            <RefreshCw size={32} className="text-white animate-spin" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Login/Signup Landing Page
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6">
              <span className="text-4xl">🙏</span>
            </div>
            <h1 className="text-5xl font-light bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 tracking-wider">Help Me Pray</h1>
            <p className="text-gray-600 text-center">Find inspiration and guidance through meaningful prayers</p>
            <div className="flex justify-center mt-4">
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full"></div>
            </div>
          </div>

          {/* Login/Signup Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                {showSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p className="text-gray-600 text-sm">
                {showSignUp ? 'Join our prayer community' : 'Sign in to continue your prayer journey'}
              </p>
            </div>

            {authError && (
              <div className={`p-3 rounded-lg text-sm text-center ${
                authError.includes('Check your email') 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}>
                {authError}
              </div>
            )}

            <form onSubmit={showSignUp ? handleSignUp : handleLogin} className="space-y-4">
              {showSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                  required
                />
              </div>

              {showSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 shadow-lg ${
                  authLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105'
                }`}
              >
                {authLoading 
                  ? (showSignUp ? 'Creating Account...' : 'Signing In...') 
                  : (showSignUp ? 'Create Account' : 'Sign In')
                }
              </button>

              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <div className="px-3 text-gray-500 text-sm">or</div>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className={`w-full py-3 px-6 rounded-lg font-medium border transition-all duration-200 shadow-lg flex items-center justify-center space-x-2 ${
                  authLoading 
                    ? 'bg-gray-100 border-gray-300 cursor-not-allowed text-gray-400'
                    : 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 text-gray-700'
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {showSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => setShowSignUp(!showSignUp)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium ml-2"
                >
                  {showSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={continueAsGuest}
                className="text-gray-500 hover:text-gray-700 text-sm underline"
              >
                🙏 Continue as Guest
              </button>
            </div>

            <div className="mt-6 text-center">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full"></div>
              </div>
              <p className="text-xs text-gray-500">
                Join thousands finding peace through prayer
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Prayer App (after login)
  return (
    <SubscriptionProvider user={user}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* User Menu */}
        {user && (
          <div className="flex justify-end mb-4">
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {user.isGuest ? 'Guest User' : user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-gray-500">
                  {user.isGuest ? 'Browsing as guest' : 'Signed in'}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm transition-colors"
              >
                {user.isGuest ? 'Sign In' : 'Sign Out'}
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
              <span className="text-4xl">🙏</span>
            </div>
          </div>
          <h1 className="text-5xl font-light bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 tracking-wider">Help Me Pray</h1>
          <p className="text-gray-600 text-center">Find inspiration and guidance through meaningful prayers</p>
          <div className="flex justify-center mt-4">
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Categories */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Choose a Category</h2>
            {Object.entries(prayerCategories).map(([key, category]) => (
              <CategoryButton key={key} categoryKey={key} category={category} />
            ))}
          </div>

          {/* Prayer Display / Custom Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {showCustomForm ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 text-center w-full">Create Custom Prayer</h2>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {/* Who is this prayer for? */}
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        This prayer is for:
                      </label>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => setPrayerFor('myself')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                            prayerFor === 'myself'
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <User size={18} />
                          <span>Myself</span>
                        </button>
                        <button
                          onClick={() => setPrayerFor('someone')}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all ${
                            prayerFor === 'someone'
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Users size={18} />
                          <span>Someone else</span>
                        </button>
                      </div>
                    </div>

                    {/* Person's name */}
                    {prayerFor === 'someone' && (
                      <div className="text-center">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Person's name:
                        </label>
                        <div className="flex justify-center">
                          <input
                            type="text"
                            value={personName}
                            onChange={(e) => setPersonName(e.target.value)}
                            placeholder="Enter their name..."
                            className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-center"
                          />
                        </div>
                      </div>
                    )}

                    {/* Occasion/Holiday dropdown */}
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special occasion or holiday (optional):
                      </label>
                      <div className="flex justify-center">
                        <select
                          value={selectedOccasion}
                          onChange={(e) => setSelectedOccasion(e.target.value)}
                          className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center"
                        >
                          <option value="">Select an occasion (optional)</option>
                          <option value="christmas">Christmas/Advent</option>
                          <option value="easter">Easter/Lent</option>
                          <option value="thanksgiving">Thanksgiving</option>
                          <option value="addiction">Addiction Recovery</option>
                          <option value="funeral">Funeral/Grief</option>
                          <option value="surgery">Hospital/Surgery</option>
                        </select>
                      </div>
                      {selectedOccasion && (
                        <p className="text-xs text-indigo-600 mt-1 text-center">
                          Your prayer will include special context for {occasions[selectedOccasion]}
                        </p>
                      )}
                    </div>

                    {/* Prayer length */}
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prayer length:
                      </label>
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => setPrayerLength('brief')}
                          className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                            prayerLength === 'brief'
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          Brief
                        </button>
                        <button
                          onClick={() => setPrayerLength('medium')}
                          className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                            prayerLength === 'medium'
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          Standard
                        </button>
                        <button
                          onClick={() => setPrayerLength('comprehensive')}
                          className={`px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                            prayerLength === 'comprehensive'
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          Comprehensive
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-center">
                        {prayerLength === 'brief' && 'A short, focused prayer (1-2 sentences)'}
                        {prayerLength === 'medium' && 'A standard prayer with good depth (1-2 paragraphs)'}
                        {prayerLength === 'comprehensive' && 'A detailed, thorough prayer (multiple paragraphs)'}
                      </p>
                    </div>

                    {/* Prayer request */}
                    <div className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What would you like to pray for?
                      </label>
                      <div className="flex justify-center">
                        <textarea
                          value={customRequest}
                          onChange={(e) => setCustomRequest(e.target.value)}
                          placeholder="Describe your prayer request in detail..."
                          rows={3}
                          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-center"
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800 text-center w-full">
                    {prayerCategories[selectedCategory].name} Prayer
                  </h2>
                </div>
              )}

              <div className="flex justify-center mb-6">
                <button
                  onClick={generatePrayer}
                  disabled={isGenerating || (showCustomForm && !customRequest.trim())}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    isGenerating || (showCustomForm && !customRequest.trim())
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : showCustomForm
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 shadow-lg'
                        : `${prayerCategories[selectedCategory].color} text-white hover:opacity-90 transform hover:scale-105 shadow-lg`
                  }`}
                >
                  <RefreshCw size={18} className={isGenerating ? 'animate-spin' : ''} />
                  <span>{isGenerating ? 'Generating...' : 'Generate Prayer'}</span>
                </button>
              </div>

              <div className="min-h-[200px] flex items-center justify-center">
                {currentPrayer ? (
                  <div className="text-center">
                    <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-xl mb-4 border border-indigo-100">
                      <p className="text-lg text-gray-700 leading-relaxed text-center">
                        {currentPrayer}
                      </p>
                    </div>
                    
                    {/* Audio Controls */}
                    <div className="flex justify-center space-x-3 mb-4">
                      {!isPlaying && !isPaused ? (
                        <button
                          onClick={() => speakPrayer(currentPrayer)}
                          className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                        >
                          <Volume2 size={18} />
                          <span>Listen</span>
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          {isPlaying ? (
                            <button
                              onClick={pauseAudio}
                              className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                            >
                              <Pause size={18} />
                              <span>Pause</span>
                            </button>
                          ) : (
                            <button
                              onClick={resumeAudio}
                              className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
                            >
                              <Play size={18} />
                              <span>Resume</span>
                            </button>
                          )}
                          <button
                            onClick={stopAudio}
                            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors shadow-md"
                          >
                            <Square size={18} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Voice Settings for Premium Users */}
                    {isPremium && (
                      <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                        <div className="text-center">
                          <h4 className="text-sm font-semibold text-purple-800 mb-2">Premium Voice Options</h4>
                          <div className="flex justify-center space-x-4 mb-3">
                            <button
                              onClick={() => setTtsProvider('browser')}
                              className={`px-3 py-1 rounded-md text-xs transition-colors ${
                                ttsProvider === 'browser'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white text-purple-600 hover:bg-purple-100'
                              }`}
                            >
                              Browser Voice
                            </button>
                            <button
                              onClick={() => setTtsProvider('azure')}
                              className={`px-3 py-1 rounded-md text-xs transition-colors ${
                                ttsProvider === 'azure'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-white text-purple-600 hover:bg-purple-100'
                              }`}
                            >
                              Azure Premium
                            </button>
                          </div>
                          {ttsProvider === 'azure' && (
                            <select
                              value={selectedVoice}
                              onChange={(e) => setSelectedVoice(e.target.value)}
                              className="text-xs px-2 py-1 border rounded-md bg-white"
                            >
                              <option value="en-US-AvaMultilingualNeural">Ava (Warm Female)</option>
                              <option value="en-US-AndrewMultilingualNeural">Andrew (Professional Male)</option>
                              <option value="en-US-EmmaMultilingualNeural">Emma (Gentle Female)</option>
                              <option value="en-US-BrianMultilingualNeural">Brian (Friendly Male)</option>
                              <option value="en-US-AriaNeural">Aria (Expressive Female)</option>
                              <option value="en-US-DavisNeural">Davis (Professional Male)</option>
                            </select>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-gray-500 text-center">
                      <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 mx-auto mb-2"></div>
                      <p className="text-sm">May this prayer bring you peace and guidance</p>
                      {isPremium && ttsProvider === 'azure' && (
                        <p className="text-xs text-purple-600 mt-1">Using premium Azure neural voice</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <div className={`w-16 h-16 ${showCustomForm ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : prayerCategories[selectedCategory].color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      {React.createElement(prayerCategories[selectedCategory].icon, { size: 32, className: 'text-white' })}
                    </div>
                    <p className="text-lg mb-2 text-center">
                      {showCustomForm 
                        ? 'Ready to create your custom prayer' 
                        : `Ready to generate a ${prayerCategories[selectedCategory].name.toLowerCase()} prayer`}
                    </p>
                    <p className="text-sm text-center">
                      {showCustomForm 
                        ? 'Fill out the form and click "Generate Prayer"'
                        : 'Click "Generate Prayer" to begin'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full"></div>
          </div>
          <p>Take a moment to reflect, find peace, and connect with what matters most to you.</p>
        </div>
      </div>
    </div>
    </SubscriptionProvider>
  );
};

// Main App wrapper that handles authentication and subscription context
const HelpMePrayApp = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
            <RefreshCw size={32} className="text-white animate-spin" />
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <SubscriptionProvider user={user}>
        <PrayerAppContent user={user} />
      </SubscriptionProvider>
    );
  } else {
    return <PrayerAppContent user={null} />;
  }
};

export default HelpMePrayApp;
