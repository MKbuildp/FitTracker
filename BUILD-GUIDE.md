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
        "buildType": "app-bundle"
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
              "package": "com.mkbuildp.fittracker",
      "versionCode": 5
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

## 🚀 **Publikace na Google Play Store**

### **Příprava Google Play Console**

1. **Vytvoření účtu Google Play Developer**
   - Registrujte se na [play.google.com/console](https://play.google.com/console/)
   - Zaplaťte jednorázový poplatek $25 USD
   - Vyplňte všechny požadované informace o vývojáři

2. **Vytvoření nové aplikace**
   - V Google Play Console klikněte na "Vytvořit aplikaci"
   - Zadejte název aplikace, výchozí jazyk a typ aplikace (Aplikace nebo Hra)
   - **DŮLEŽITÉ**: V tuto chvíli NEZADÁVEJTE název balíčku (package name)!

### **Nastavení Google Play Android Developer API**

1. **Povolení API**
   - Přejděte na [Google Cloud Console](https://console.cloud.google.com/)
   - Vyberte svůj projekt nebo vytvořte nový
   - V menu vyberte "APIs & Services" > "Library"
   - Vyhledejte "Google Play Android Developer API"
   - Klikněte na "Enable" nebo "Povolit"
   - **POZNÁMKA**: Tento krok je KRITICKÝ pro úspěšné nahrání aplikace!

2. **Vytvoření servisního účtu**
   - V EAS je tento proces automatizován při prvním pokusu o submit
   - Při prvním spuštění `eas submit` budete vyzváni k vytvoření servisního účtu
   - Následujte pokyny v terminálu

### **Konfigurace EAS pro publikaci**

1. **Nastavení `eas.json`**
   - Pro první publikaci nastavte režim "draft" (koncept):
   ```json
   "submit": {
     "production": {
       "android": {
         "releaseStatus": "draft"
       }
     }
   }
   ```
   - Po úspěšném nastavení metadat můžete změnit na "completed"

2. **Nastavení credentials**
   - Spusťte `eas credentials` pro kontrolu nastavení
   - Ujistěte se, že máte správně nakonfigurovaný keystore
   - **NIKDY** neztraťte přístup k keystore! Je nezbytný pro všechny budoucí aktualizace!

### **První publikace**

1. **Vytvoření production buildu**
   ```bash
   eas build --platform android --profile production
   ```

2. **Odeslání do Google Play**
   ```bash
   eas submit -p android --latest
   ```

3. **Řešení častých problémů**
   - **API není povoleno**: Ujistěte se, že jste povolili Google Play Android Developer API
   - **Chybějící metadata**: Doplňte všechna povinná metadata v Google Play Console nebo použijte `releaseStatus: "draft"`
   - **Chyba podpisu**: Ujistěte se, že používáte správný keystore

### **Dokončení publikace v Google Play Console**

1. **Doplnění metadat**
   - Popis aplikace (krátký a dlouhý)
   - Screenshoty (min. 2 pro telefon, volitelně pro tablet)
   - Ikona aplikace ve vysokém rozlišení
   - Grafika pro obchod (feature graphic)
   - Kategorie a tagy
   - Kontaktní informace

2. **Nastavení ceny a distribuce**
   - Zvolte země pro distribuci
   - Nastavte zdarma nebo placenou aplikaci
   - Věkové hodnocení (vyplňte dotazník)

3. **Publikace**
   - Přejděte z režimu konceptu do produkce
   - Zvolte typ vydání (postupné nebo okamžité)
   - Potvrďte publikaci

### **Aktualizace aplikace**

1. **Zvýšení `versionCode`**
   - V `app.json` zvyšte hodnotu `versionCode` o 1
   - Volitelně aktualizujte `version` pro uživatelsky viditelnou verzi

2. **Vytvoření nového buildu**
   ```bash
   eas build --platform android --profile production
   ```

3. **Odeslání aktualizace**
   ```bash
   eas submit -p android --latest
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