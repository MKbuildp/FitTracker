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
import { SystemBars } from 'react-native-edge-to-edge';

import { CviceniProvider, useCviceni } from './context/CviceniContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';


// Importy obrazovek
import OpakovaniScreen from './screens/Opakovani/OpakovaniScreen';
import CasovkyScreen from './screens/Casovky/CasovkyScreen';
import PrehledScreen from './screens/Prehled/PrehledScreen';
import PridatCviceniScreen from './screens/PridatCviceni/PridatCviceniScreen';
import DetailCviceniScreen from './screens/DetailCviceni/DetailCviceniScreen';
import LanguageSelectionScreen from './screens/LanguageSelection/LanguageSelectionScreen';
import MesicniPrehledScreen from './screens/MesicniPrehled/MesicniPrehledScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

/** Spodní Tab navigace */
function HlavniTaby() {
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
        tabBarActiveTintColor: '#ffffff', // Bílá barva pro aktivní záložku
        tabBarInactiveTintColor: '#ffffff', // Bílá barva pro neaktivní záložku
        tabBarStyle: {
          backgroundColor: '#2563eb', // Modré pozadí jako hlavička
          borderTopWidth: 0, // Odstraníme horní hranu
          elevation: 8, // Android stín
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
      })}
    >
      <Tab.Screen 
        name="Casovky" 
        component={CasovkyScreen}
        options={{ title: t('nav.timers') }}
      />
      <Tab.Screen 
        name="Prehled" 
        component={PrehledScreen}
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
  const { isLoading, isFirstTime, markWelcomeShown } = useLanguage();
  const { nacistData, stav } = useCviceni();
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);

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
    await markWelcomeShown();
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
          component={HlavniTaby}
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
                    navigation.navigate('PridatCviceni', { vychoziTyp: 'cas' });
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
                    navigation.navigate('PridatCviceni', { vychoziTyp: 'opakovani' });
                  }}
                  style={{ marginRight: 8, padding: 8 }}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add-outline" size={24} color="#fff" />
                </TouchableOpacity>
              );
            } else if (routeName === 'Prehled') {
              headerRight = () => (
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('MesicniPrehled');
                    }}
                    style={{ marginRight: 8, padding: 8 }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="calendar-outline" size={24} color="#fff" />
                  </TouchableOpacity>
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
                </View>
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
          options={{ 
            title: '', // Dynamicky nastaveno v komponentě
            headerBackVisible: false, // Odstraníme šipku zpět
          }}
        />
        <Stack.Screen 
          name="MesicniPrehled" 
          component={MesicniPrehledScreen}
          options={{ 
            title: t('nav.monthlyOverview'),
            headerBackVisible: false, // Odstraníme šipku zpět
          }}
        />
        </Stack.Navigator>
      </NavigationContainer>
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
      // Fonty se nepodařilo načíst, ale aplikace může pokračovat
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
      <SystemBars style="light" />
      <LanguageProvider>
        <NotificationProvider>
          <CviceniProvider>
            <AppContent />
          </CviceniProvider>
        </NotificationProvider>
      </LanguageProvider>
    </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
