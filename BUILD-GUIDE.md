# 🏋️ FitTracker - Průvodce Buildem

*Kompletní průvodce pro vytvoření Android APK*

## 🚀 Rychlý Start

### 1. **První setup (jednorázově)**
```batch
# Spusť setup skript
build-setup.bat
```

### 2. **Vytvoření APK**
```batch
# Hlavní build skript
create-apk.bat
```

## 📋 Detailní Instrukce

### 🔧 **Požadavky**
- **Node.js** LTS verze (doporučeno 18.x nebo novější)
- **Windows** s PowerShell nebo Command Prompt
- **Internetové připojení** (pro Expo cloud build)
- **Expo účet** (zdarma registrace na expo.dev)

### 📦 **Instalace (automatická)**

Skript `build-setup.bat` automaticky nainstaluje:
- ✅ Expo CLI (`@expo/cli`)
- ✅ EAS CLI (`eas-cli`)
- ✅ Projekt závislosti (`npm install`)
- ✅ Přihlášení k Expo účtu

### 🎯 **Typy Buildů**

#### 📱 **Preview Build** (doporučeno pro testování)
- ⚡ Rychlejší build (5-10 minut)
- 🧪 Ideální pro testování funkcionalita
- 📦 APK pro instalaci na zařízení
```batch
npm run build:android
```

#### 🚀 **Production Build** (finální verze)
- 🎯 Optimalizovaný pro distribuci
- 🔒 Připravený pro Google Play Store
- ⏱️ Delší build čas (10-20 minut)
```batch
npm run build:android:prod
```

## 📱 **Proces Buildu**

### **Krok 1: Příprava**
```batch
# Automatická kontrola a setup
build-setup.bat
```

### **Krok 2: Build**
```batch
# Interaktivní build s výběrem typu
create-apk.bat
```

### **Krok 3: Stažení APK**
1. 🌐 Přejdi na [expo.dev](https://expo.dev/)
2. 🔍 Najdi projekt "FitTracker"
3. 📦 V sekci "Builds" klikni na nejnovější build
4. ⬇️ Stáhni APK soubor
5. 📱 Nainstaluj na Android zařízení

## 🛠️ **Alternativní Příkazy**

### **NPM Skripty**
```bash
# Preview buildy
npm run build:android          # Android APK (preview)
npm run build:ios             # iOS IPA (preview)
npm run build:all             # Oba platforms (preview)

# Production buildy  
npm run build:android:prod    # Android APK (production)
npm run build:ios:prod       # iOS IPA (production)

# Submit do store
npm run submit:android        # Google Play Store
npm run submit:ios           # Apple App Store
```

### **Přímé EAS příkazy**
```bash
# Konfigurace (jednorázově)
eas build:configure

# Preview buildy
eas build --platform android --profile preview
eas build --platform ios --profile preview

# Production buildy
eas build --platform android --profile production
eas build --platform ios --profile production

# Status a informace
eas project:info
eas build:list
```

## 🔐 **Správa Účtu**

### **Přihlášení**
```bash
expo login
```

### **Kontrola stavu**
```bash
expo whoami
eas project:info
```

### **Odhlášení**
```bash
expo logout
```

## 📊 **Sledování Buildu**

### **Web Dashboard**
- 🌐 **URL**: https://expo.dev/
- 📱 **Sekce**: "Projects" → "FitTracker" → "Builds"
- ⏱️ **Real-time**: Sledování pokroku buildu
- 📧 **Notifikace**: Email po dokončení

### **CLI Monitoring**
```bash
# Seznam všech buildů
eas build:list

# Detail konkrétního buildu
eas build:view [BUILD_ID]

# Sledování běžícího buildu
eas build:list --status=in-progress
```

## 🎯 **Konfigurace Buildů**

### **EAS Profily** (`eas.json`)
```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### **App Konfigurace** (`app.json`)
```json
{
  "expo": {
      "name": "FitTracker",
  "slug": "fittracker",
    "android": {
              "package": "com.fittracker.fitness",
      "versionCode": 1
    }
  }
}
```

## 🐛 **Řešení Problémů**

### **Časté Chyby**

#### ❌ "Not logged in to Expo"
```bash
expo login
```

#### ❌ "Project not configured"
```bash
eas build:configure
```

#### ❌ "Build failed"
1. Zkontroluj chyby v logu
2. Zkus `npm install`
3. Zkus `expo doctor` pro diagnostiku

#### ❌ "Network error"
1. Zkontroluj internetové připojení
2. Zkus VPN pokud máš firemní síť
3. Restartuj terminál

### **Diagnostické Příkazy**
```bash
# Kontrola projektu
expo doctor

# Kontrola EAS
eas --version
eas project:info

# Kontrola závislostí
npm outdated
npm audit
```

## 📈 **Optimalizace**

### **Rychlejší Buildy**
- 🎯 Používej **preview** profil pro testování
- 📦 Minimalizuj velikost assets
- 🔧 Používej `.easignore` pro vyloučení nepotřebných souborů

### **Menší APK**
- 🗜️ Optimalizuj obrázky
- 📦 Odstraň nepoužívané závislosti
- 🎯 Používej `proguard` pro minifikaci

## 🔒 **Bezpečnost**

### **Credentials**
- 🔐 EAS automaticky spravuje signing certificates
- 🛡️ Nevkládej API klíče do kódu
- 🔒 Používej Expo Secrets pro citlivé údaje

### **Permissions**
```json
"android": {
  "permissions": [
    "INTERNET"
  ]
}
```

## 📚 **Další Zdroje**

- 📖 **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- 🎥 **Video Tutorials**: https://expo.dev/learn
- 💬 **Discord**: https://chat.expo.dev/
- 🆘 **Support**: https://expo.dev/support

## ✅ **Checklist před Buildem**

- [ ] ✅ Node.js nainstalován
- [ ] 📦 `npm install` dokončen
- [ ] 🔐 Přihlášen k Expo (`expo whoami`)
- [ ] ⚙️ EAS nakonfigurován (`eas project:info`)
- [ ] 🌐 Internetové připojení aktivní
- [ ] 📱 Typ buildu vybrán (preview/production)

---

**🏋️ Úspěšný build = Funkční FitTracker APK!** 💪

*Pro další pomoc kontaktuj tým nebo použij oficiální Expo podporu.* 