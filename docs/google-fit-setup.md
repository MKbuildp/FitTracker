# Google Fit API - Nastavení a Implementace

## ⚠️ DŮLEŽITÉ UPOZORNĚNÍ - ZASTARALÉ

**Tento dokument je zastaralý.** Projekt byl migrován na **Android Health Connect**.

Google Fit API bude ukončeno **30. června 2025**. Viz dokumentace: [`health-connect-setup.md`](./health-connect-setup.md)

Tato implementace je připravena pro Google Fit API, ale pro dlouhodobou udržitelnost zvažte migraci na Health Connect.

## Požadavky

1. **Expo Managed Workflow s config pluginem** (aktuální implementace)
   - Nebo **Bare Workflow** pro plnou integraci nativního kódu

2. **Google Cloud Console projekt**
   - OAuth 2.0 credentials
   - Google Fit API povoleno

3. **Google účet na zařízení**
   - Uživatel musí být přihlášen k Google účtu

## Postup nastavení

### 1. Google Cloud Console Setup

1. Přejděte na [Google Cloud Console](https://console.cloud.google.com/)
2. Vytvořte nový projekt nebo vyberte existující
3. Povolte **Fitness API**:
   - V navigaci: **APIs & Services** → **Library**
   - Vyhledejte "Fitness API"
   - Klikněte **Enable**

### 2. OAuth 2.0 Credentials

1. V navigaci: **APIs & Services** → **Credentials**
2. Klikněte **Create Credentials** → **OAuth client ID**
3. Vyberte **Android** jako typ aplikace
4. Zadejte:
   - **Package name**: `com.mkbuildp.activus`
   - **SHA-1 certificate fingerprint**: Získejte pomocí:
     ```bash
     keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
     ```
5. Stáhněte `google-services.json` a umístěte do projektu

### 3. Nastavení v app.json

Přidejte do `app.json` sekci `extra`:

```json
{
  "expo": {
    "extra": {
      "googleFit": {
        "clientId": "YOUR_CLIENT_ID.apps.googleusercontent.com",
        "scopes": [
          "https://www.googleapis.com/auth/fitness.activity.read"
        ]
      }
    }
  }
}
```

### 4. Build aplikace

Po přidání config pluginu musíte vytvořit nový build:

```bash
npm run build:android
```

Config plugin automaticky přidá potřebné závislosti do nativního projektu.

## Implementace nativního modulu

Pro plnou funkčnost je potřeba vytvořit nativní modul. V managed workflow to vyžaduje:

1. **Custom development build** s config pluginem
2. Nebo **přechod na bare workflow** (`expo prebuild`)

### Nativní modul (Kotlin/Java)

```kotlin
// android/app/src/main/java/com/mkbuildp/activus/GoogleFitModule.kt
package com.mkbuildp.activus

import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.fitness.Fitness
import com.google.android.gms.fitness.data.DataType
import com.google.android.gms.fitness.request.DataReadRequest
import java.util.concurrent.TimeUnit

class GoogleFitModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    @ReactMethod
    fun getDailySteps(date: Long, promise: Promise) {
        // Implementace čtení kroků z Google Fit
        // ...
    }
}
```

## Aktuální stav implementace

- ✅ Config plugin vytvořen (`app.plugin.js`)
- ✅ TypeScript wrapper připraven (`utils/googleFit.ts`)
- ✅ Hook připraven pro integraci (`hooks/useSteps.ts`)
- ⚠️ Nativní modul **není implementován** (vyžaduje bare workflow nebo custom build)

## Další kroky

1. Nastavit Google Cloud Console (viz výše)
2. Vytvořit custom development build s config pluginem
3. Implementovat nativní modul pro komunikaci s Google Fit SDK
4. Otestovat na fyzickém zařízení s Google účtem

## Alternativa: Android Health Connect

Zvažte migraci na **Android Health Connect**, který:
- Je doporučený Google
- Má delší budoucnost (Google Fit končí 2025)
- Je bezpečnější a modernější
- Vyžaduje podobnou implementaci (nativní modul)

