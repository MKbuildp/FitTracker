import 'react-native-gesture-handler';
import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar as RNStatusBar, Platform, AppState } from 'react-native';
import { TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTranslation } from './hooks/useTranslation';
import * as Font from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList, TypMereni } from './types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { CviceniProvider, useCviceni } from './context/CviceniContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ObdobniProvider } from './context/ObdobniContext';
import { PlatbyProvider, usePlatby } from './context/PlatbyContext';

// Importy obrazovek
import OpakovaniScreen from './screens/Opakovani/OpakovaniScreen';
import CasovkyScreen from './screens/Casovky/CasovkyScreen';
import PrehledScreen from './screens/Prehled/PrehledScreen';
import PridatCviceniScreen from './screens/PridatCviceni/PridatCviceniScreen';
import DetailCviceniScreen from './screens/DetailCviceni/DetailCviceniScreen';
import LanguageSelectionScreen from './screens/LanguageSelection/LanguageSelectionScreen';
import { WelcomeModal, PremiumModal } from './screens/Prehled/components';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

/** Spodní Tab navigace */
function HlavniTaby({ onOtevritPremium }: { onOtevritPremium: () => void }) {
  const { t } = useTranslation();
  
  return (
    <Tab.Navigator
      initialRouteName="Prehled"
      screenOptions={({ route }) => ({
        headerShown: false, // Vypneme hlavičky pro tab obrazovky
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Opakovani') {
            iconName = focused ? 'repeat' : 'repeat-outline';
          } else if (route.name === 'Casovky') {
            iconName = focused ? 'timer' : 'timer-outline';
          } else if (route.name === 'Prehled') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Casovky" 
        component={CasovkyScreen}
        options={{ title: t('nav.timers') }}
      />
      <Tab.Screen 
        name="Prehled" 
        children={() => <PrehledScreen onOtevritPremium={onOtevritPremium} />}
        options={{ title: t('nav.overview') }}
      />
      <Tab.Screen 
        name="Opakovani" 
        component={OpakovaniScreen}
        options={{ title: t('nav.repetitions') }}
      />
    </Tab.Navigator>
  );
}

/** Komponenta s překladovým kontextem pro Stack Navigator */
function AppContent() {
  const { t } = useTranslation();
  const { isLoading, isFirstTime, showWelcome, markWelcomeShown } = useLanguage();
  const { nacistData, stav } = useCviceni();
  const { jePremium } = usePlatby();
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  useEffect(() => {
    if (!isLoading && isFirstTime) {
      setShowLanguageSelection(true);
    } else {
      setShowLanguageSelection(false);
    }
  }, [isLoading, isFirstTime]);

  const handleLanguageComplete = async () => {
    setShowLanguageSelection(false);
    // Po výběru jazyka načti data s ukázkovými cvičeními
    await nacistData();
  };

  const handleWelcomePremium = () => {
    markWelcomeShown();
    setShowPremiumModal(true);
  };

  const handleWelcomeContinue = async () => {
    await markWelcomeShown();
  };

  const handleBuyPremium = () => {
    // Premium funkce jsou aktivní automaticky
    console.log('Premium funkce jsou automaticky aktivovány pro testovací build.');
    setShowPremiumModal(false);
  };

  const handleRestorePurchases = () => {
    // Premium funkce jsou aktivní automaticky
    console.log('Premium funkce jsou automaticky aktivovány pro testovací build.');
  };

  // Dočasné tlačítko pro smazání klíče welcome
  const smazatWelcomeKey = async () => {
    await AsyncStorage.removeItem('@cviceni_app_welcome_shown');
    alert('Klíč @cviceni_app_welcome_shown byl smazán. Restartujte aplikaci nebo změňte jazyk.');
  };

  const otevritPremium = () => setShowPremiumModal(true);

  // Handler pro přidání cvičení s omezením free verze
  const handleAddExercise = (typ: TypMereni) => {
    const pocet = stav.cviceni.filter(c => c.typMereni === typ).length;
    if (!jePremium && pocet >= 2) {
      setShowPremiumModal(true);
    } else {
      // navigation je dostupné v options, proto použijeme closure
      return (navigation: any) => navigation.navigate('PridatCviceni', { vychoziTyp: typ });
    }
  };

  if (isLoading) {
    // Můžeme přidat loading screen později
    return null;
  }

  if (showLanguageSelection) {
    return (
      <LanguageSelectionScreen 
        onComplete={handleLanguageComplete} 
      />
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { 
              backgroundColor: '#2563eb',
              // Android specifické opravy pro edge-to-edge
              ...(Platform.OS === 'android' && {
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
              }),
            },
            headerTintColor: '#fff',
            headerTitleStyle: { 
              fontWeight: Platform.OS === 'ios' ? 'bold' : '700',
              fontSize: 23, // Zvětšeno o ~28% (18 -> 23)
              color: '#fff',
            },
            headerTitleAlign: 'center',
            // Zajistíme, že header je vždy viditelný
            headerShown: true,
            // Android specifické opravy pro hlavičku
            ...(Platform.OS === 'android' && {
              headerShadowVisible: true,
              headerStatusBarHeight: Platform.OS === 'android' ? 0 : undefined,
            }),
          }}
        >
        <Stack.Screen 
          name="HlavniTaby"
          children={() => <HlavniTaby onOtevritPremium={otevritPremium} />}
          options={({ route, navigation }) => {
            // Získáme název aktuální tab obrazovky
            const routeName = getFocusedRouteNameFromRoute(route) ?? 'Prehled';
            
            // Nastavíme název hlavičky podle aktuální tab obrazovky
            let headerTitle = t('nav.overview');
            let headerRight = undefined;
            
            if (routeName === 'Casovky') {
              headerTitle = t('nav.timers');
              headerRight = () => (
                <TouchableOpacity
                  onPress={() => {
                    const pocet = stav.cviceni.filter(c => c.typMereni === 'cas').length;
                    if (!jePremium && pocet >= 2) {
                      setShowPremiumModal(true);
                    } else {
                      navigation.navigate('PridatCviceni', { vychoziTyp: 'cas' });
                    }
                  }}
                  style={{ marginRight: 8, padding: 8 }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add-outline" size={24} color="#fff" />
                </TouchableOpacity>
              );
            } else if (routeName === 'Opakovani') {
              headerTitle = t('nav.repetitions');
              headerRight = () => (
                <TouchableOpacity
                  onPress={() => {
                    const pocet = stav.cviceni.filter(c => c.typMereni === 'opakovani').length;
                    if (!jePremium && pocet >= 2) {
                      setShowPremiumModal(true);
                    } else {
                      navigation.navigate('PridatCviceni', { vychoziTyp: 'opakovani' });
                    }
                  }}
                  style={{ marginRight: 8, padding: 8 }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add-outline" size={24} color="#fff" />
                </TouchableOpacity>
              );
            } else if (routeName === 'Prehled') {
              headerRight = () => (
                <TouchableOpacity
                  onPress={() => {
                    // Bezpečné volání global funkce
                    const otevritNastaveni = (global as any).otevritNastaveni;
                    if (typeof otevritNastaveni === 'function') {
                      otevritNastaveni();
                    }
                  }}
                  style={{ marginRight: 8, padding: 8 }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="settings-outline" size={24} color="#fff" />
                </TouchableOpacity>
              );
            }
            
            return {
              headerTitle,
              headerShown: true,
              headerRight,
            };
          }}
        />
        <Stack.Screen 
          name="PridatCviceni" 
          component={PridatCviceniScreen}
          options={{ title: t('nav.addExercise') }}
        />
        <Stack.Screen 
          name="DetailCviceni" 
          component={DetailCviceniScreen}
          options={{ title: '' }} // Dynamicky nastaveno v komponentě
        />
        </Stack.Navigator>
      </NavigationContainer>
      
      <WelcomeModal
        viditelne={showWelcome}
        onZavrit={handleWelcomeContinue}
        onUpgradeToPremium={handleWelcomePremium}
        onPokracovat={handleWelcomeContinue}
      />
      
      <PremiumModal
        viditelne={showPremiumModal}
        onZavrit={() => setShowPremiumModal(false)}
        onKoupitPremium={handleBuyPremium}
        onObnovitNakupy={handleRestorePurchases}
      />
      {/* Dočasné tlačítko pro testování welcome modalu */}
      <TouchableOpacity
        onPress={smazatWelcomeKey}
        style={{ position: 'absolute', bottom: 30, right: 20, backgroundColor: '#f59e0b', padding: 14, borderRadius: 30, elevation: 4 }}
        activeOpacity={0.8}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Reset Welcome</Text>
      </TouchableOpacity>
    </>
  );
}

/** Hlavní aplikace s kořenovým Stack Navigatorem */
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts();
  }, []);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        // Expo vector icons jsou automaticky dostupné
      });
    } catch (error) {
      console.warn('Chyba při načítání fontů:', error);
    } finally {
      setFontsLoaded(true);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <RNStatusBar 
        backgroundColor="#2563eb" 
        barStyle="light-content" 
        translucent={false}
      />
      <LanguageProvider>
          <PlatbyProvider>
        <ObdobniProvider>
          <CviceniProvider>
            <AppContent />
          </CviceniProvider>
        </ObdobniProvider>
          </PlatbyProvider>
      </LanguageProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
