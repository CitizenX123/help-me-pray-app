import React, { useState, useEffect } from 'react';
import { Heart, Sun, Moon, Users, Sparkles, RefreshCw, User, Utensils } from 'lucide-react';

const HelpMePrayApp = () => {
  const [selectedCategory, setSelectedCategory] = useState('gratitude');
  const [currentPrayer, setCurrentPrayer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const translations = {
    en: {
      appTitle: "Help Me Pray",
      appSubtitle: "Find inspiration and guidance through meaningful prayers",
      chooseCategory: "Choose a Category",
      generatePrayer: "Generate Prayer", 
      generating: "Generating...",
      gratitude: "Gratitude",
      morning: "Morning",
      bedtime: "Bedtime",
      healing: "Healing",
      family: "Family & Friends",
      grace: "Grace",
      continueAsGuest: "🙏 Continue as Guest",
      gratitudeDesc: "Prayers for thanksgiving and expressing appreciation",
      morningDesc: "Prayers to start your day with purpose and hope",
      bedtimeDesc: "Prayers for reflection, rest, and peaceful sleep",
      healingDesc: "Prayers for physical, emotional, and spiritual restoration",
      familyDesc: "Prayers for relationships and loved ones", 
      graceDesc: "Dedicated to blessing the meals"
    }
  };

  const t = (key) => translations['en'][key] || key;

  const categoryIcons = {
    gratitude: Heart,
    morning: Sun,
    bedtime: Moon,
    healing: Sparkles,
    family: Users,
    grace: Utensils
  };

  const prayers = {
    gratitude: [
      "Heavenly Father, we come before You with hearts full of gratitude. Thank You for the countless blessings You have bestowed upon us each day. Help us to always remember Your goodness and to live with thankful hearts. In Your holy name we pray, Amen.",
      "Lord, we thank You for Your endless love and mercy. For every breath we take, every smile we share, and every moment of joy - we are grateful. May our lives be a testament to Your grace. Amen."
    ],
    morning: [
      "Dear God, as we begin this new day, we ask for Your guidance and protection. Fill our hearts with Your peace and our minds with Your wisdom. Help us to serve You and others with love throughout this day. In Jesus' name we pray, Amen.",
      "Lord, thank You for the gift of this new morning. As the sun rises, may Your light shine through us. Grant us strength, courage, and compassion for whatever this day may bring. Amen."
    ],
    bedtime: [
      "Peaceful Father, as we prepare for rest, we thank You for watching over us today. Forgive us for any wrongs we have done and help us to wake refreshed and ready to serve You tomorrow. Grant us peaceful sleep under Your loving care. Amen.",
      "Lord, as this day comes to an end, we place our worries and concerns in Your hands. Watch over our loved ones and keep us safe through the night. May we rest in Your peace. Amen."
    ],
    healing: [
      "Great Physician, we come to You seeking healing and restoration. Touch our bodies, minds, and spirits with Your healing power. Grant strength to the weary and comfort to those in pain. We trust in Your perfect will and timing. Amen.",
      "Lord, You are our healer and our hope. We pray for those who are suffering, that they may find relief and restoration in You. Bring healing where there is sickness and peace where there is turmoil. Amen."
    ],
    family: [
      "Loving God, we lift up our families and friends to You. Strengthen our bonds of love and help us to support one another through all of life's seasons. Protect those we hold dear and guide us in showing Your love to them each day. Amen.",
      "Heavenly Father, thank You for the gift of family and friendship. Help us to be patient, kind, and forgiving with one another. May our relationships reflect Your love and bring glory to Your name. Amen."
    ],
    grace: [
      "Blessed Lord, we thank You for this food before us and for the hands that prepared it. Bless this meal and nourish our bodies so that we may serve You with strength. We are grateful for Your provision. In Jesus' name, Amen.",
      "Dear God, we gather around this table with grateful hearts. Thank You for Your abundant provision and for bringing us together. Bless this food and our fellowship. May we always remember those in need. Amen."
    ]
  };

  const generatePrayer = () => {
    setIsGenerating(true);
    
    // Simulate prayer generation
    setTimeout(() => {
      const categoryPrayers = prayers[selectedCategory] || prayers.gratitude;
      const randomPrayer = categoryPrayers[Math.floor(Math.random() * categoryPrayers.length)];
      setCurrentPrayer(randomPrayer);
      setIsGenerating(false);
    }, 1500);
  };

  const CategoryCard = ({ category, icon: Icon, description, isSelected, onClick }) => (
    <div
      onClick={onClick}
      style={{
        padding: '20px',
        borderRadius: '12px',
        border: isSelected ? '2px solid #8b5cf6' : '2px solid #e5e7eb',
        backgroundColor: isSelected ? '#f3f4f6' : 'white',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s ease',
        boxShadow: isSelected ? '0 4px 12px rgba(139, 92, 246, 0.15)' : '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}
      onMouseOver={(e) => {
        if (!isSelected) {
          e.target.style.borderColor = '#8b5cf6';
          e.target.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseOut={(e) => {
        if (!isSelected) {
          e.target.style.borderColor = '#e5e7eb';
          e.target.style.transform = 'translateY(0px)';
        }
      }}
    >
      <Icon size={32} color={isSelected ? '#8b5cf6' : '#6b7280'} style={{ marginBottom: '12px' }} />
      <h3 style={{
        margin: '0 0 8px 0',
        fontSize: '18px',
        fontWeight: '600',
        color: isSelected ? '#8b5cf6' : '#374151'
      }}>
        {t(category)}
      </h3>
      <p style={{
        margin: 0,
        fontSize: '14px',
        color: '#6b7280',
        lineHeight: '1.4'
      }}>
        {description}
      </p>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          color: 'white',
          padding: '40px 30px',
          textAlign: 'center'
        }}>
          <h1 style={{
            margin: '0 0 10px 0',
            fontSize: '2.5rem',
            fontWeight: '700',
            letterSpacing: '-0.025em'
          }}>
            {t('appTitle')}
          </h1>
          <p style={{
            margin: 0,
            fontSize: '1.1rem',
            opacity: 0.9
          }}>
            {t('appSubtitle')}
          </p>
        </div>

        <div style={{ padding: '40px 30px' }}>
          {!currentPrayer ? (
            <>
              <h2 style={{
                textAlign: 'center',
                marginBottom: '30px',
                fontSize: '1.5rem',
                color: '#374151'
              }}>
                {t('chooseCategory')}
              </h2>

              {/* Category Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '40px'
              }}>
                {Object.entries({
                  gratitude: { icon: Heart, desc: t('gratitudeDesc') },
                  morning: { icon: Sun, desc: t('morningDesc') },
                  bedtime: { icon: Moon, desc: t('bedtimeDesc') },
                  healing: { icon: Sparkles, desc: t('healingDesc') },
                  family: { icon: Users, desc: t('familyDesc') },
                  grace: { icon: Heart, desc: t('graceDesc') }
                }).map(([category, { icon, desc }]) => (
                  <CategoryCard
                    key={category}
                    category={category}
                    icon={icon}
                    description={desc}
                    isSelected={selectedCategory === category}
                    onClick={() => setSelectedCategory(category)}
                  />
                ))}
              </div>

              {/* Generate Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={generatePrayer}
                  disabled={isGenerating}
                  style={{
                    backgroundColor: isGenerating ? '#9ca3af' : '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    padding: '16px 32px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: '600',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    margin: '0 auto'
                  }}
                  onMouseOver={(e) => {
                    if (!isGenerating) {
                      e.target.style.backgroundColor = '#7c3aed';
                      e.target.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isGenerating) {
                      e.target.style.backgroundColor = '#8b5cf6';
                      e.target.style.transform = 'translateY(0px)';
                    }
                  }}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                      {t('generating')}
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      {t('generatePrayer')}
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Prayer Display */}
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '30px',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                marginBottom: '30px'
              }}>
                <p style={{
                  fontSize: '18px',
                  lineHeight: '1.8',
                  color: '#374151',
                  margin: 0,
                  fontStyle: 'italic'
                }}>
                  {currentPrayer}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setCurrentPrayer('')}
                  style={{
                    backgroundColor: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#7c3aed';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#8b5cf6';
                  }}
                >
                  ← Back to Categories
                </button>

                <button
                  onClick={generatePrayer}
                  disabled={isGenerating}
                  style={{
                    backgroundColor: isGenerating ? '#9ca3af' : '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    if (!isGenerating) {
                      e.target.style.backgroundColor = '#059669';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isGenerating) {
                      e.target.style.backgroundColor = '#10b981';
                    }
                  }}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={16} />
                      Generate Another
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Add spinning animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const App = () => {
  return <HelpMePrayApp />;
};

export default App;