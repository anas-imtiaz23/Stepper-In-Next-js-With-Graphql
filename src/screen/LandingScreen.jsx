import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Image,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

const LandingScreen = ({ navigation }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const heroImages = [
    require('../../assets/Hero-4.webp'),
    require('../../assets/hero-5.webp'),
    require('../../assets/hero-6.webp'),
    require('../../assets/hero-7.webp'),
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
        );
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const faqs = [
    {
      question: "What is the Pakistan Energy Label for fans?",
      answer: "The Pakistan Energy Label is a regulatory requirement that provides information about the energy efficiency of fans, helping consumers make informed decisions."
    },
    {
      question: "Who is required to apply for the Pakistan Energy Label for fans?",
      answer: "All manufacturers, importers, and sellers of fans in Pakistan are required to register their products and obtain the Pakistan Energy Label."
    },
    {
      question: "How can I apply for the Pakistan Energy Label for fans?",
      answer: "You can apply through the NEECA portal by registering your company, submitting required documents, and getting your fans tested at authorized laboratories."
    },
    {
      question: "My fan model was previously registered with the voluntary labelling scheme of ECF/NEECA, will I get any incentive while registering with Pakistan Energy Label Regulations for fans?",
      answer: "Yes, previously registered models may get expedited processing or reduced fees as per NEECA's transition policy."
    },
    {
      question: "What documents are needed for registration?",
      answer: "Required documents include company registration, product test reports from authorized labs, technical specifications, and manufacturing details."
    },
    {
      question: "What are the applicable fees for Pakistan Energy Label registration?",
      answer: "Fees vary based on the number of models and type of registration. Please check the NEECA website for the current fee structure."
    },
    {
      question: "What performance standards do fans need to meet to qualify for the label?",
      answer: "Fans must meet the minimum energy performance standards (MEPS) as defined in the Pakistan Standards & Quality Control Authority (PSQCA) standards."
    },
    {
      question: "How is the Pakistan Energy Label's star rating determined?",
      answer: "Star ratings are determined based on the fan's energy efficiency ratio, with 1-star being the minimum and 5-star being the most efficient."
    },
    {
      question: "Who conducts the testing for compliance?",
      answer: "Testing must be conducted at NEECA-approved or recognized laboratories that follow standardized testing procedures."
    },
    {
      question: "What information is displayed on the Pakistan Energy Label?",
      answer: "The label displays energy consumption, star rating, model information, and comparative energy usage data."
    }
  ];

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const handleNavigation = (screen) => {
    if (screen === 'SIGNUP') {
      navigation.navigate('SIGNUP');
    } else {
      navigation.navigate('LOGIN');
    }
  };

  const handleLinkPress = () => {
    navigation.navigate('LOGIN');
  };

  return (
    <SafeAreaView style={{ 
      flex: 1, 
      backgroundColor: '#ffffff',
    }}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={false}
        style={{ flex: 1 }}
      >
        {/* Header - EXACT PIXEL PERFECT MATCH */}
        <View style={{
          width: '100%',
          position: 'fixed',
          top: 0,
          zIndex: 20,
          backgroundColor: '#ffffff',
        }}>
          {/* w-full h-[100px] flex items-center bg-white shadow-super-large */}
          <View style={{
            width: '100%',
            height: 100,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 5,
            ...(isWeb && {
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            })
          }}>
            {/* lg:w-full flex lg:justify-around w-[85%] justify-between items-center */}
            <View style={{
              flexDirection: 'row',
              width: '85%',
              marginHorizontal: 'auto',
              justifyContent: 'space-between',
              alignItems: 'center',
              ...(isWeb && { 
                maxWidth: 1400,
              })
            }}>
              {/* Logo - md:w-[70px] w-[50px] h-[50px] md:h-[70px] object-cover pl-2 */}
              <View style={{
                width: isWeb ? 70 : 50,
                height: isWeb ? 70 : 50,
                marginLeft:76,
                paddingBottom:8,
                paddingLeft: 8, // pl-2 = 8px exact
              }}>
                <Image 
                  source={require('../../assets/neeca-logo.webp')}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    resizeMode: 'contain',
                  }}
                />
              </View>

              {/* flex items-center - THIS CONTAINS ALL NAVIGATION ELEMENTS */}
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
              }}>
                {/* Desktop Navigation - ALL ELEMENTS IN ONE ROW */}
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  display: isWeb ? 'flex' : 'none',
                }}>
                  {/* Navigation Links - WITH EXACT SPACING */}
                  <View style={{
                    flexDirection: 'row',
                    gap: 36, // gap-9 = 36px exact
                    // marginRight: 10, // mr-8 = 32px exact
                    alignItems: 'center',
                  }}>
                    <TouchableOpacity onPress={handleLinkPress}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: '#F9662E',
                        // marginleft:'23', // text-primary exact
                      }}>Home</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLinkPress}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: '#9ca3af', // text-gray-400 exact
                      }}>News</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLinkPress}>
                      <Text style={{
                        fontSize: 16,
                        fontWeight: '500',
                        color: '#9ca3af', // text-gray-400 exact
                      }}>Products</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Auth Buttons - WITH EXACT SPACING */}
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 24, // gap between Register button and Sign in (exact)
                  }}>
                    {/* Register Button - EXACT STYLING */}
                    <TouchableOpacity
                      onPress={() => handleNavigation('SIGNUP')}
                      style={{
                        backgroundColor: '#F9662E',
                        borderRadius: 5.6, // rounded-[5.6px] exact
                        paddingVertical: isWeb ? 6 : 8, // lg:py-[6px] py-2
                        paddingHorizontal: 12, // lg:px-[12px] px-3
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 8, // gap-2 exact
                      }}
                    >
                      <Text style={{
                        color: '#ffffff',
                        fontWeight: '600',
                        fontSize: isWeb ? 16 : 12, // lg:text-base text-xs
                      }}>
                        Register a company
                      </Text>
                      <Image 
                        source={require('../../assets/arrow-right1.svg')}
                        style={{ width: 16, height: 16 }}
                      />
                    </TouchableOpacity>

                    {/* Sign in Link */}
                    <TouchableOpacity onPress={() => handleNavigation('LOGIN')}>
                      <Text style={{
                        color: '#9ca3af',
                        fontWeight: '500',
                        marginRight:90,
                        fontSize: isWeb ? 16 : 14, // lg:text-base text-sm
                      }}>
                        Sign in
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Mobile Menu Button - absolute right-4 lg:hidden */}
                <TouchableOpacity 
                  style={{ 
                    display: isWeb ? 'none' : 'flex',
                    position: 'absolute',
                    right: 16, // right-4 = 16px exact
                    width: 24,
                    height: 24,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Ionicons name="menu" size={24} color="#F9662E" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Mobile Menu */}
          {mobileMenuOpen && !isWeb && (
            <View style={{
              position: 'absolute',
              top: 100,
              width: '100%',
              zIndex: 20,
            }}>
              <View style={{ 
                backgroundColor: '#F9662E',
                paddingVertical: 20,
                paddingHorizontal: 16,
                width: '100%',
              }}>
                <TouchableOpacity
                  onPress={() => {
                    handleLinkPress();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(255,255,255,0.2)',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#ffffff',
                  }}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleLinkPress();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(255,255,255,0.2)',
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#ffffff',
                  }}>News</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleLinkPress();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    paddingVertical: 12,
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#ffffff',
                  }}>Products</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Spacer for fixed header */}
        <View style={{ height: 100 }} />

        {/* Hero Section */}
        <View style={{
          backgroundColor: '#FFF6F3',
          paddingBottom: 40,
          width: '100%',
        }}>
          <View style={{
            paddingTop: 24,
            paddingHorizontal: isWeb ? 40 : 16,
            ...(isWeb && { maxWidth: 1400, marginHorizontal: 'auto', width: '100%' })
          }}>
            {/* Title */}
            <Text style={{
              textAlign: 'center',
              fontSize: isWeb ? 48 : 24,
              fontWeight: '600',
              color: '#374151',
              marginTop: 48,
            }}>
              Lighten up your life with quality.
            </Text>

            {/* Subtitle */}
            <Text style={{
              fontSize: isWeb ? 18 : 14,
              textAlign: 'center',
              color: '#374151',
              fontWeight: '500',
              marginTop: 28,
              lineHeight: isWeb ? 28 : 20,
            }}>
              Get the mental satisfaction of{' '}
              <Text style={{ borderBottomWidth: 2, borderBottomColor: '#F9662E' }}>
                importing
              </Text>{' '}
              and{' '}
              <Text style={{ borderBottomWidth: 2, borderBottomColor: '#F9662E' }}>
                selling
              </Text>{' '}
              your product legally, regulated for energy efficiency.
            </Text>

            {/* Features */}
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: isWeb ? 32 : 12,
              marginTop: 40,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Image 
                  source={require('../../assets/tick.webp')}
                  style={{ width: 20, height: 20, opacity: 0.9 }}
                />
                <Text style={{ fontSize: isWeb ? 14 : 12, color: '#374151' }}>
                  Simple registration
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Image 
                  source={require('../../assets/tick.webp')}
                  style={{ width: 20, height: 20, opacity: 0.9 }}
                />
                <Text style={{ fontSize: isWeb ? 14 : 12, color: '#374151' }}>
                  Statistics Dashboard
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Image 
                  source={require('../../assets/tick.webp')}
                  style={{ width: 20, height: 20, opacity: 0.9 }}
                />
                <Text style={{ fontSize: isWeb ? 14 : 12, color: '#374151' }}>
                  Products & orders management
                </Text>
              </View>
            </View>

            {/* Hero Image Slider */}
            <View style={{
              marginTop: isWeb ? 80 : 28,
              backgroundColor: '#ffffff',
              borderRadius: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              padding: 12,
              width: isWeb ? '80%' : '100%',
              alignSelf: 'center',
            }}>
              <Animated.View style={{
                width: '100%',
                height: isWeb ? 400 : 200,
                borderRadius: 8,
                overflow: 'hidden',
                opacity: fadeAnim,
              }}>
                <Image
                  source={heroImages[currentImageIndex]}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                  }}
                />
              </Animated.View>
            </View>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={{
          width: '100%',
          paddingHorizontal: isWeb ? 160 : 16,
          marginTop: 40,
          paddingBottom: 20,
          ...(isWeb && { maxWidth: 1400, marginHorizontal: 'auto' })
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: isWeb ? 14 : 12,
              color: '#F9662E',
              backgroundColor: '#ffefe9',
              borderRadius: 999,
              paddingHorizontal: 24,
              paddingVertical: 4,
              fontWeight: '600',
              marginBottom: 12,
              overflow: 'hidden',
            }}>
              FAQ's
            </Text>
            <Text style={{
              fontSize: isWeb ? 30 : 18,
              color: '#1f2937',
              textAlign: 'center',
              fontWeight: '500',
            }}>
              Frequently Asked Questions
            </Text>
          </View>

          <View style={{ 
            marginTop: isWeb ? 80 : 40,
            paddingHorizontal: isWeb ? 208 : 0
          }}>
            {faqs.map((faq, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => toggleFaq(index)}
                activeOpacity={0.7}
                style={{
                  borderWidth: 1,
                  borderColor: '#e5e7eb',
                  padding: isWeb ? 24 : 16,
                  marginBottom: 8,
                  borderRadius: 4,
                }}
              >
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    flex: 1,
                    fontSize: isWeb ? 20 : 14,
                    fontWeight: '500',
                    color: '#4b5563',
                    paddingRight: 16,
                  }}>
                    {faq.question}
                  </Text>
                  <Text style={{
                    fontSize: isWeb ? 24 : 18,
                    color: '#4b5563',
                  }}>
                    {openFaq === index ? '−' : '+'}
                  </Text>
                </View>

                {openFaq === index && (
                  <Text style={{
                    marginTop: 12,
                    color: '#6b7280',
                    fontSize: isWeb ? 16 : 13,
                    lineHeight: isWeb ? 24 : 18,
                  }}>
                    {faq.answer}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={{
          backgroundColor: '#15151d',
          width: '100%',
          paddingHorizontal: isWeb ? 120 : 10,
          paddingTop: 32,
          paddingBottom: 20,
          marginTop: 40,
        }}>
          <View style={{
            borderBottomWidth: 1,
            borderBottomColor: '#9ca3af',
            paddingBottom: 24,
            ...(isWeb && { maxWidth: 1200, marginHorizontal: 'auto', width: '100%' })
          }}>
            <View style={{
              flexDirection: isWeb ? 'row' : 'column',
              justifyContent: 'space-between',
              alignItems: isWeb ? 'flex-start' : 'center',
            }}>
              {/* Logo and Description */}
              <View style={{
                alignItems: isWeb ? 'flex-start' : 'center',
                marginBottom: isWeb ? 0 : 24,
              }}>
                <Image 
                  source={require('../../assets/neeca-logo.webp')}
                  style={{ width: 85, height: 85, resizeMode: 'contain' }}
                />
                <Text style={{
                  color: '#9ca3af',
                  fontSize: 16,
                  textAlign: isWeb ? 'left' : 'center',
                  maxWidth: 350,
                  marginLeft: isWeb ? 14 : 0,
                }}>
                  Legally import and sell a product regulated for energy efficiency.
                </Text>
              </View>

              {/* Quick Links */}
              <View>
                <Text style={{
                  color: '#e5e7eb',
                  fontSize: 18,
                  fontWeight: '500',
                  textAlign: isWeb ? 'left' : 'center',
                  marginBottom: 12,
                }}>
                  Quick Links
                </Text>
                <View style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: isWeb ? 400 : '100%',
                }}>
                  {[
                    'Home',
                    'About',
                    'Tips',
                    'News',
                    "FAQ's",
                    'Products'
                  ].map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{ 
                        width: '50%', 
                        paddingVertical: 4,
                        alignItems: isWeb ? 'flex-start' : 'center',
                      }}
                      onPress={handleLinkPress}
                    >
                      <Text style={{
                        color: '#9ca3af',
                        fontWeight: '500',
                        fontSize: 16,
                      }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Social and Contact */}
              <View style={{
                alignItems: isWeb ? 'flex-start' : 'center',
                marginTop: isWeb ? 0 : 24,
              }}>
                <View style={{
                  flexDirection: 'row',
                  gap: 16,
                  marginBottom: 16,
                }}>
                  <Image 
                    source={require('../../assets/fb.svg')}
                    style={{ width: 24, height: 24 }}
                  />
                  <Image 
                    source={require('../../assets/tw.svg')}
                    style={{ width: 24, height: 24 }}
                  />
                </View>

                <View style={{
                  flexDirection: isWeb ? 'row' : 'column',
                  alignItems: 'center',
                  gap: isWeb ? 12 : 8,
                }}>
                  <TouchableOpacity onPress={handleLinkPress}>
                    <Text style={{ color: '#9ca3af', fontSize: 16 }}>
                      info@neeca.gov.pk
                    </Text>
                  </TouchableOpacity>
                  {isWeb && <Text style={{ color: '#ffffff' }}>|</Text>}
                  <TouchableOpacity onPress={handleLinkPress}>
                    <Text style={{ color: '#9ca3af', fontSize: 16 }}>
                      051-9206001
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <Text style={{
            color: '#9ca3af',
            fontSize: 14,
            textAlign: 'right',
            marginTop: 16,
            ...(isWeb && { maxWidth: 1200, marginHorizontal: 'auto', width: '100%' })
          }}>
            © Copyright 2022. Neeca inc.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LandingScreen;
