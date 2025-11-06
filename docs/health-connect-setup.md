# Android Health Connect - Nastavení a Implementace

## 📱 Co je Health Connect?

Health Connect je moderní platforma od Googlu a Samsungu pro zdravotní a fitness data na Androidu. **Nahrazuje Google Fit API**, které končí 30. června 2025.

### Klíčové výhody:
- ✅ **Dlouhodobá podpora** (Google Fit končí 2025)
- ✅ **Bezpečnější** - data lokálně na zařízení
- ✅ **Granularní oprávnění** - uživatel kontroluje každý typ dat
- ✅ **Integrováno v Androidu 14+**
- ✅ **Dostupné pro Android 9-13** (z Play Store)

---

## 📊 AKTUÁLNÍ STAV IMPLEMENTACE

### ✅ Hotovo (Fáze 1 - Příprava)

1. **Config Plugin** (`app.plugin.js`)
   - ✅ Přidává oprávnění `READ_STEPS` a `WRITE_STEPS` do `AndroidManifest.xml`
   - ✅ Přidává Health Connect SDK závislost do `build.gradle`
   - ✅ Přidává package query pro Health Connect aplikaci
   - ✅ Plugin je přidán do `app.json`

2. **TypeScript Wrapper** (`utils/healthConnect.ts`)
   - ✅ Rozhraní a funkce pro Health Connect API
   - ✅ Správa oprávnění
   - ✅ Čtení a zápis kroků
   - ⚠️ Funkce jsou připravené, ale volají TODO (čekají na nativní modul)

3. **Hook** (`hooks/useSteps.ts`)
   - ✅ Upraven pro Health Connect na Androidu
   - ✅ Fallback na expo-sensors Pedometer
   - ✅ iOS: používá expo-sensors Pedometer (funguje)

4. **Dokumentace**
   - ✅ Tento dokument
   - ✅ Instrukce pro další kroky

### ⚠️ Zbývá (Fáze 2 - Nativní implementace)

1. **Nativní modul** (Kotlin/Java)
   - ❌ Modul pro komunikaci s Health Connect SDK
   - ❌ Bridge mezi React Native a Health Connect
   - ❌ Implementace všech funkcí z `utils/healthConnect.ts`

---

## 📋 Požadavky

1. **Android zařízení** s Android 9 nebo novějším
2. **Health Connect aplikace**:
   - Android 14+: integrováno v systému
   - Android 9-13: nainstalovat z [Google Play Store](https://play.google.com/store/apps/details?id=com.google.android.apps.healthdata)
3. **Expo projekt** s config pluginem (✅ hotovo)
   - Pro nativní modul: **Custom development build** nebo **Bare Workflow**

---

## 🔧 FÁZE 1: Příprava (✅ HOTOVO)

### Co bylo uděláno:

1. **Config Plugin vytvořen** (`app.plugin.js`)
   - Automaticky přidává oprávnění do `AndroidManifest.xml`
   - Automaticky přidává Health Connect SDK závislost do `build.gradle`
   - Automaticky přidává package query pro Health Connect

2. **TypeScript wrapper** (`utils/healthConnect.ts`)
   - Struktura funkcí připravena
   - Funkce vrací `null` nebo `false` (čekají na nativní implementaci)

3. **Hook upraven** (`hooks/useSteps.ts`)
   - Zkouší Health Connect na Androidu
   - Fallback na expo-sensors Pedometer

### Build s přípravou:

```bash
npm install
npm run build:android
```

**Výsledek:** Build bude obsahovat oprávnění a závislosti, ale Health Connect ještě nebude fungovat (chybí nativní modul).

---

## 🚀 FÁZE 2: Nativní implementace (⏳ ZBÝVÁ)

Po úspěšném buildu z Fáze 1 je potřeba implementovat nativní modul.

### Možnosti:

#### Varianta A: Custom Development Build (doporučeno)
- Zachovává managed workflow
- Vyžaduje přístup k nativním souborům pouze při buildu

#### Varianta B: Bare Workflow
- Plný přístup k nativnímu kódu
- `expo prebuild` vytvoří složky `android/` a `ios/`
- Více kontroly, ale složitější správa

### Postup po buildu:

#### Krok 1: Vytvořit nativní modul

**Poznámka:** Pokud používáte managed workflow, musíte nejdřív vytvořit custom development build nebo přejít na bare workflow.

**Pro bare workflow:**
```bash
npx expo prebuild
```
Tím se vytvoří složka `android/` s nativním projektem.

**Vytvořte soubor:**
```
android/app/src/main/java/com/mkbuildp/activus/HealthConnectModule.kt
```

#### Implementace nativního modulu (Kotlin)

```kotlin
// android/app/src/main/java/com/mkbuildp/activus/HealthConnectModule.kt
package com.mkbuildp.activus

import android.app.Activity
import android.content.Intent
import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.PermissionController
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.StepsRecord
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.time.TimeRangeFilter
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.temporal.ChronoUnit

class HealthConnectModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    private val healthConnectClient: HealthConnectClient? by lazy {
        try {
            HealthConnectClient.getOrCreate(reactContext)
        } catch (e: Exception) {
            null
        }
    }
    
    private var permissionPromise: Promise? = null
    
    private val activityEventListener = object : BaseActivityEventListener() {
        override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
            if (requestCode == PERMISSION_REQUEST_CODE) {
                permissionPromise?.let { promise ->
                    CoroutineScope(Dispatchers.IO).launch {
                        try {
                            val permissions = setOf(
                                HealthPermission.getReadPermission(StepsRecord::class)
                            )
                            val granted = healthConnectClient?.permissionController
                                ?.getGrantedPermissions(permissions) ?: emptySet()
                            promise.resolve(granted.size == permissions.size)
                        } catch (e: Exception) {
                            promise.reject("ERROR", e.message ?: "Unknown error")
                        }
                    }
                    permissionPromise = null
                }
            }
        }
    }
    
    init {
        reactContext.addActivityEventListener(activityEventListener)
    }
    
    override fun getName(): String {
        return "HealthConnectModule"
    }
    
    @ReactMethod
    fun isAvailable(promise: Promise) {
        promise.resolve(healthConnectClient != null)
    }
    
    @ReactMethod
    fun requestPermissions(promise: Promise) {
        permissionPromise = promise
        
        CoroutineScope(Dispatchers.Main).launch {
            try {
                val permissions = setOf(
                    HealthPermission.getReadPermission(StepsRecord::class)
                )
                
                val permissionController: PermissionController = 
                    healthConnectClient?.permissionController 
                        ?: run {
                            promise.reject("ERROR", "Health Connect není dostupné")
                            return@launch
                        }
                
                val granted = permissionController.getGrantedPermissions(permissions)
                
                if (granted.size == permissions.size) {
                    promise.resolve(true)
                    permissionPromise = null
                } else {
                    // Zobrazit dialog pro oprávnění
                    val requestPermissionIntent = permissionController.createRequestPermissionsResultContract()
                        .createIntent(reactApplicationContext, permissions.toList())
                    
                    val activity = currentActivity
                    if (activity != null) {
                        activity.startActivityForResult(requestPermissionIntent, PERMISSION_REQUEST_CODE)
                    } else {
                        promise.reject("ERROR", "Aktivita není dostupná")
                        permissionPromise = null
                    }
                }
            } catch (e: Exception) {
                promise.reject("ERROR", e.message ?: "Unknown error")
                permissionPromise = null
            }
        }
    }
    
    @ReactMethod
    fun getDailySteps(dateMillis: Long, promise: Promise) {
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val client = healthConnectClient ?: run {
                    promise.reject("ERROR", "Health Connect není dostupné")
                    return@launch
                }
                
                val date = Instant.ofEpochMilli(dateMillis)
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate()
                
                val startOfDay = date.atStartOfDay(ZoneId.systemDefault()).toInstant()
                val endOfDay = startOfDay.plus(1, ChronoUnit.DAYS)
                
                val request = ReadRecordsRequest(
                    StepsRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(startOfDay, endOfDay)
                )
                
                val response = client.readRecords(request)
                val totalSteps = response.records.sumOf { it.count }
                
                promise.resolve(totalSteps.toDouble())
            } catch (e: Exception) {
                promise.reject("ERROR", e.message ?: "Unknown error")
            }
        }
    }
    
    companion object {
        private const val PERMISSION_REQUEST_CODE = 1001
    }
}
```

---

## 📝 DETAILLNÍ POSTUP PRO FÁZI 2

### Krok 1: Přechod na bare workflow (pokud potřebujete přístup k nativnímu kódu)

```bash
npx expo prebuild
```

Tím se vytvoří složky `android/` a `ios/` s nativními projekty.

**Poznámka:** Pokud používáte custom development build, můžete nativní soubory stáhnout z EAS Build.

### Krok 2: Implementovat nativní modul

Vytvořte soubor podle kódu výše a implementujte všechny metody:
- `isAvailable()` - kontrola dostupnosti Health Connect
- `requestPermissions()` - žádost o oprávnění
- `getDailySteps()` - čtení denních kroků

### Krok 3: Vytvořit React Native Bridge

Vytvořte soubor:
```
android/app/src/main/java/com/mkbuildp/activus/HealthConnectPackage.kt
```

```kotlin
package com.mkbuildp.activus

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class HealthConnectPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        return listOf(HealthConnectModule(reactContext))
    }

    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }
}
```

A přidejte do `MainApplication.kt`:
```kotlin
packages.add(HealthConnectPackage())
```

### Krok 4: Propojit TypeScript wrapper s nativním modulem

Upravte `utils/healthConnect.ts` - nahraďte všechny TODO volání nativního modulu:

```typescript
import { NativeModules, Platform } from 'react-native';

const { HealthConnectModule } = NativeModules;

export const isHealthConnectAvailable = async (): Promise<boolean> => {
  if (Platform.OS !== 'android' || !HealthConnectModule) {
    return false;
  }
  try {
    return await HealthConnectModule.isAvailable();
  } catch (error) {
    console.error('Health Connect check error:', error);
    return false;
  }
};

export const requestHealthConnectPermissions = async (
  permissions: HealthConnectPermission[]
): Promise<HealthConnectPermissionResult> => {
  if (!HealthConnectModule) {
    return {
      granted: false,
      deniedPermissions: permissions,
    };
  }
  
  try {
    const granted = await HealthConnectModule.requestPermissions();
    return {
      granted,
      deniedPermissions: granted ? undefined : permissions,
    };
  } catch (error) {
    console.error('Health Connect permission error:', error);
    return {
      granted: false,
      deniedPermissions: permissions,
    };
  }
};

export const getHealthConnectSteps = async (date: Date): Promise<HealthConnectSteps | null> => {
  if (!HealthConnectModule) {
    return null;
  }
  
  try {
    const dateMillis = date.getTime();
    const steps = await HealthConnectModule.getDailySteps(dateMillis);
    
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return {
      steps: Math.round(steps),
      date,
      startTime: startOfDay,
      endTime: endOfDay,
    };
  } catch (error) {
    console.error('Health Connect get steps error:', error);
    return null;
  }
};
```

### Krok 5: Testování

1. Build aplikace: `npm run build:android`
2. Nainstalujte na zařízení s Health Connect
3. Otestujte čtení kroků

---

## 🔗 Propojení s existujícím kódem

### Soubory, které jsou připravené:

1. **`hooks/useSteps.ts`** - již volá Health Connect funkce
2. **`utils/healthConnect.ts`** - obsahuje TODO, které je potřeba nahradit nativními voláními
3. **`app.plugin.js`** - již přidává oprávnění a závislosti

### Co je potřeba udělat:

1. Implementovat nativní modul (Kotlin)
2. Vytvořit React Native bridge
3. Upravit `utils/healthConnect.ts` - nahradit TODO voláním nativního modulu
4. Otestovat

---

## 📚 Aktuální stav implementace

- ✅ Config plugin vytvořen (`app.plugin.js`)
- ✅ TypeScript wrapper připraven (`utils/healthConnect.ts`)
- ✅ Hook připraven pro integraci (`hooks/useSteps.ts`)
- ✅ Dokumentace připravena
- ⚠️ Nativní modul **není implementován** (vyžaduje bare workflow nebo custom build)
- ⚠️ React Native bridge **není vytvořen**
- ⚠️ TypeScript wrapper **čeká na nativní implementaci**

---

## 🚀 Rychlý start po buildu

1. **Vytvořit nativní modul** (viz kód výše)
2. **Vytvořit React Native bridge** (viz kód výše)
3. **Upravit `utils/healthConnect.ts`** - nahradit TODO nativními voláními
4. **Build a test:** `npm run build:android`

## 📖 Dokumentace

- [Oficiální dokumentace Health Connect](https://developer.android.com/health-and-fitness/guides/health-connect)
- [Health Connect API Reference](https://developer.android.com/reference/androidx/health/connect/client/package-summary)
- [Migrace z Google Fit na Health Connect](https://android-developers.googleblog.com/2024/05/evolving-health-on-android-migrating-from-google-fit-apis-to-android-health.html)

## ⚠️ Důležité poznámky

1. **Health Connect musí být nainstalováno** na zařízení uživatele
2. **Oprávnění jsou granularní** - uživatel může povolit/zakázat každý typ dat zvlášť
3. **Data jsou lokální** - ukládají se na zařízení, ne v cloudu
4. **Android 14+** má Health Connect integrováno v systému

