import React, { useState } from 'react';
import { Heart, Sun, Moon, Users, Sparkles, RefreshCw, User, Send } from 'lucide-react';

const HelpMePrayApp = () => {
  const [selectedCategory, setSelectedCategory] = useState('gratitude');
  const [currentPrayer, setCurrentPrayer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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

  const prayerCategories = {
    gratitude: {
      icon: Heart,
      name: 'Gratitude',
      description: 'Prayers for thanksgiving and expressing appreciation',
      color: 'bg-indigo-500',
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
      color: 'bg-amber-500',
      prayers: [
        "As I begin this new day, fill my heart with hope and my mind with clarity. Guide my steps and help me be a source of light to others.",
        "Grant me strength for today's challenges and wisdom for today's decisions. May I approach each task with patience and purpose.",
        "Help me to start this day with a grateful heart and an open mind. May I be present in each moment and kind in every interaction."
      ]
    },
    evening: {
      icon: Moon,
      name: 'Evening',
      description: 'Prayers for reflection, rest, and peaceful sleep',
      color: 'bg-rose-500',
      prayers: [
        "As this day comes to a close, I reflect on the moments of grace and growth. Help me learn from today's experiences and rest in peace.",
        "Thank you for carrying me through another day. Forgive me for any mistakes I've made and help me do better tomorrow.",
        "Grant me peaceful sleep and healing rest. May tomorrow bring new opportunities to serve and to love more deeply."
      ]
    },
    healing: {
      icon: Sparkles,
      name: 'Healing',
      description: 'Prayers for physical, emotional, and spiritual restoration',
      color: 'bg-emerald-500',
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
      color: 'bg-purple-500',
      prayers: [
        "Bless my family with love, understanding, and unity. Help us support each other through life's joys and challenges.",
        "Watch over my friends and loved ones wherever they may be. Keep them safe, healthy, and surrounded by your love.",
        "Help me be a better family member and friend. Give me patience, kindness, and the wisdom to know when to speak and when to listen."
      ]
    },
    custom: {
      icon: Send,
      name: 'Create Custom Prayer',
      description: 'Generate personalized prayers for any situation',
      color: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      prayers: []
    }
  };

  const occasions = {
    'christmas': 'Christmas/Advent',
    'easter': 'Easter/Lent', 
    'thanksgiving': 'Thanksgiving',
    'addiction': 'Addiction Recovery',
    'funeral': 'Funeral/Grief',
    'surgery': 'Hospital/Surgery'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setIsLoggedIn(true);
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (email && password && confirmPassword && fullName && password === confirmPassword) {
      setIsLoggedIn(true);
    }
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
        const prayers = prayerCategories[selectedCategory].prayers;
        const randomPrayer = prayers[Math.floor(Math.random() * prayers.length)];
        setCurrentPrayer(randomPrayer);
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

  // Login/Signup Landing Page
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-6">
              <Heart size={40} className="text-white" />
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
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 px-6 rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                {showSignUp ? 'Create Account' : 'Sign In'}
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
                onClick={() => setIsLoggedIn(true)}
                className="text-gray-500 hover:text-gray-700 text-sm underline"
              >
                Continue as Demo User
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
              <Heart size={40} className="text-white" />
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
                    <div className="text-gray-500 text-center">
                      <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300 mx-auto mb-2"></div>
                      <p className="text-sm">May this prayer bring you peace and guidance</p>
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
  );
};

export default HelpMePrayApp;
