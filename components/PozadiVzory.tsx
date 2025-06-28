import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Získání rozměrů obrazovky
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/** Ikony statistik pro Přehled obrazovku */
export const TeckovanyVzor: React.FC = () => {
  const ikony = [];
  const mezera = 13; // Mezera od kraje k centru ikony
  const dostupnaSirka = screenWidth - 2 * mezera; // Šířka pro rozmístění ikon
  const pocetSloupcu = Math.floor(dostupnaSirka / 45) + 1; // +1 pro první ikonu
  const rozestupX = dostupnaSirka / (pocetSloupcu - 1); // Rozestup mezi centry ikon
  const pocetRadku = Math.ceil(screenHeight / 60);
  
  for (let i = 0; i < pocetSloupcu * pocetRadku; i++) {
    const sloupec = i % pocetSloupcu;
    const radek = Math.floor(i / pocetSloupcu);
    
    ikony.push(
      <Ionicons
        key={i}
        name="trending-up"
        size={30}
        color="rgba(156, 163, 175, 0.15)"
        style={{
          position: 'absolute',
          left: mezera + sloupec * rozestupX - 15, // 10px mezera + pozice - polovina ikony
          top: radek * 60 + 1, // Horní mezera zmenšena na 1px
        }}
      />
    );
  }

  return <View style={styly.pozadiKontejner}>{ikony}</View>;
};

/** Ikony časovek pro Časovky obrazovku */
export const DiagonalniVzor: React.FC = () => {
  const ikony = [];
  const mezera = 13;
  const dostupnaSirka = screenWidth - 2 * mezera;
  const pocetSloupcu = Math.floor(dostupnaSirka / 45) + 1;
  const rozestupX = dostupnaSirka / (pocetSloupcu - 1);
  const pocetRadku = Math.ceil(screenHeight / 60);
  
  for (let i = 0; i < pocetSloupcu * pocetRadku; i++) {
    const sloupec = i % pocetSloupcu;
    const radek = Math.floor(i / pocetSloupcu);
    
    ikony.push(
      <Ionicons
        key={i}
        name="timer-outline"
        size={30}
        color="rgba(156, 163, 175, 0.15)"
        style={{
          position: 'absolute',
          left: mezera + sloupec * rozestupX - 15, // 10px mezera + pozice - polovina ikony
          top: radek * 60 + 1, // Horní mezera zmenšena na 1px
        }}
      />
    );
  }

  return <View style={styly.pozadiKontejner}>{ikony}</View>;
};

/** Ikony opakování pro Opakování obrazovku */
export const KruhovyVzor: React.FC = () => {
  const ikony = [];
  const mezera = 13;
  const dostupnaSirka = screenWidth - 2 * mezera;
  const pocetSloupcu = Math.floor(dostupnaSirka / 45) + 1;
  const rozestupX = dostupnaSirka / (pocetSloupcu - 1);
  const pocetRadku = Math.ceil(screenHeight / 60);
  
  for (let i = 0; i < pocetSloupcu * pocetRadku; i++) {
    const sloupec = i % pocetSloupcu;
    const radek = Math.floor(i / pocetSloupcu);
    
    ikony.push(
      <Ionicons
        key={i}
        name="repeat"
        size={30}
        color="rgba(156, 163, 175, 0.15)"
        style={{
          position: 'absolute',
          left: mezera + sloupec * rozestupX - 15, // 10px mezera + pozice - polovina ikony
          top: radek * 60 + 1, // Horní mezera zmenšena na 1px
        }}
      />
    );
  }

  return <View style={styly.pozadiKontejner}>{ikony}</View>;
};

const styly = StyleSheet.create({
  pozadiKontejner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f9fafb', // Světle šedé pozadí
    zIndex: 0,
  },
}); 