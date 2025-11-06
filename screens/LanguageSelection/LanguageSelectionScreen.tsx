import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguage } from '../../translations';
import { responsiveTypography, responsiveSpacingValues } from '../../src/styles/theme';

/** Obrazovka pro první výběr jazyka */
const LanguageSelectionScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { setLanguage } = useLanguage();
  const [vybiraJazyk, setVybiraJazyk] = useState(false);

  const handleLanguageSelect = async (language: SupportedLanguage) => {
    try {
      setVybiraJazyk(true);
      await setLanguage(language);
      onComplete();
    } catch (error) {
      console.error('Chyba při nastavování jazyka:', error);
      setVybiraJazyk(false);
    }
  };

  return (
    <SafeAreaView style={styly.kontejner}>
      <StatusBar backgroundColor="#2563eb" barStyle="light-content" />
      <View style={styly.obsah}>
        {/* Header s ikonou */}
        <View style={styly.header}>
          <Ionicons name="globe-outline" size={80} color="#2563eb" />
                  <Text style={styly.nadpis}>Vítejte v Quotidis</Text>
        <Text style={styly.nadpisEn}>Welcome to Quotidis</Text>
          <Text style={styly.popis}>
            Vyberte si jazyk aplikace{'\n'}
            Choose your app language
          </Text>
        </View>

        {/* Jazykové tlačítka */}
        <View style={styly.jazykyKontejner}>
          <TouchableOpacity
            style={[styly.jazykTlacitko, vybiraJazyk && styly.jazykTlacitkoDisabled]}
            onPress={() => handleLanguageSelect('cs')}
            disabled={vybiraJazyk}
            activeOpacity={0.8}
          >
            <Text style={styly.vlajka}>🇨🇿</Text>
            <View style={styly.jazykInfo}>
              <Text style={styly.jazykNazev}>Čeština</Text>
              <Text style={styly.jazykPopis}>Český jazyk</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styly.jazykTlacitko, vybiraJazyk && styly.jazykTlacitkoDisabled]}
            onPress={() => handleLanguageSelect('en')}
            disabled={vybiraJazyk}
            activeOpacity={0.8}
          >
            <Text style={styly.vlajka}>🇬🇧</Text>
            <View style={styly.jazykInfo}>
              <Text style={styly.jazykNazev}>English</Text>
              <Text style={styly.jazykPopis}>English language</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Footer info */}
        <View style={styly.footer}>
          <Text style={styly.footerText}>
            Jazyk můžete kdykoli změnit v nastavení{'\n'}
            You can change language anytime in settings
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styly = StyleSheet.create({
  kontejner: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  obsah: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: responsiveSpacingValues.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: responsiveSpacingValues.xxl,
  },
  nadpis: {
    fontSize: responsiveTypography.languageTitle.fontSize,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: responsiveSpacingValues.lg,
    textAlign: 'center',
  },
  nadpisEn: {
    fontSize: responsiveTypography.languageSubtitle.fontSize,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: responsiveSpacingValues.sm,
    textAlign: 'center',
  },
  popis: {
    fontSize: responsiveTypography.languageDescription.fontSize,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: responsiveSpacingValues.md,
    lineHeight: 24,
  },
  jazykyKontejner: {
    gap: responsiveSpacingValues.md,
  },
  jazykTlacitko: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: responsiveSpacingValues.lg,
    borderRadius: responsiveSpacingValues.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  jazykTlacitkoDisabled: {
    opacity: 0.6,
  },
  vlajka: {
    fontSize: 32,
    marginRight: responsiveSpacingValues.md,
  },
  jazykInfo: {
    flex: 1,
  },
  jazykNazev: {
    fontSize: responsiveTypography.languageButton.fontSize,
    fontWeight: '600',
    color: '#1f2937',
  },
  jazykPopis: {
    fontSize: responsiveTypography.languageButtonDescription.fontSize,
    color: '#6b7280',
    marginTop: 2,
  },
  footer: {
    marginTop: responsiveSpacingValues.xxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: responsiveTypography.languageButtonDescription.fontSize,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default LanguageSelectionScreen; 