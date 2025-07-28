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
    evening: {
      icon: Moon,
      name: 'Evening',
      description: 'Prayers for reflection, rest, and peaceful sleep',
      color: '#f43f5e',
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
    custom: {
      icon: Send,
      name: 'Create Custom Prayer',
      description: 'Generate personalized prayers for any situation',
      color: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
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
          backgroundColor: isSelected ? (isCustom ? '#6366f1' : category.color) : '#f3f4f6',
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

  // Login/Signup Landing Page
  if (!isLoggedIn) {
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
              marginBottom: '24px'
            }}>
              <Heart size={40} color="white" />
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
                {showSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {showSignUp ? 'Join our prayer community' : 'Sign in to continue your prayer journey'}
              </p>
            </div>

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
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.background = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.background = 'linear-gradient(135deg, #6366f1, #8b5cf6)';
                }}
              >
                {showSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>
                {showSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  onClick={() => setShowSignUp(!showSignUp)}
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

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                onClick={() => setIsLoggedIn(true)}
                style={{
                  color: '#6b7280',
                  fontSize: '14px',
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.color = '#374151'}
                onMouseOut={(e) => e.target.style.color = '#6b7280'}
              >
                Continue as Demo User
              </button>
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
              marginBottom: '16px'
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
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', textAlign: 'center', width: '100%' }}>
                  {prayerCategories[selectedCategory].name} Prayer
                </h2>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                <button
                  onClick={generatePrayer}
                  disabled={isGenerating}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '500',
                    border: 'none',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    backgroundColor: isGenerating ? '#d1d5db' : prayerCategories[selectedCategory].color,
                    color: isGenerating ? '#6b7280' : 'white',
                    boxShadow: isGenerating ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transform: isGenerating ? 'scale(1)' : 'scale(1)'
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
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #eef2ff, #f3e8ff, #fef7f7)',
                      padding: '24px',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      border: '1px solid #c7d2fe'
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
                      backgroundColor: prayerCategories[selectedCategory].color,
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