# FitTracker - Dokumentace projektu

*Poslední aktualizace: 29.06.2025*

[![EAS Build](https://github.com/username/fittracker/actions/workflows/eas-build.yml/badge.svg)](https://github.com/username/fittracker/actions/workflows/eas-build.yml)

> Tento dokument slouží jako centrální zdroj informací o projektu FitTracker. Obsahuje všechny klíčové informace o projektu, které by měly být pravidelně aktualizovány.

## Obsah
1. [Základní informace](#základní-informace)
2. [Technologie a konfigurace](#technologie-a-konfigurace)
3. [Struktura projektu](#struktura-projektu)
4. [Obrazovky a komponenty](#obrazovky-a-komponenty)
5. [Kontexty a globální stav](#kontexty-a-globální-stav)
6. [Hooks a utility](#hooks-a-utility)
7. [Styly a barvy](#styly-a-barvy)
8. [Build a deployment](#build-a-deployment)
9. [Git workflow](#git-workflow)
10. [Známé problémy a řešení](#známé-problémy-a-řešení)

## Základní informace

- **Název aplikace:** FitTracker
- **Popis:** Mobilní aplikace pro sledování cvičení, opakování a časových záznamů
- **Platforma:** React Native s Expo (Managed Workflow)
- **Cílové platformy:** Android, iOS
- **Jazyky:** Čeština (primární), Angličtina

## Technologie a konfigurace

- **React Native verze:** 0.79.3
- **Expo SDK:** 53
- **TypeScript:** Ano
- **Hlavní knihovny:**
  - React Navigation (v7.1.10, v7.3.14)
  - @react-native-async-storage/async-storage (v2.2.0)
  - Expo Localization (v16.1.5)
  - React Native Chart Kit (v6.12.0)
  - React Native Gesture Handler (v2.24.0)
  - React Native SVG (v15.12.0)
  - Další knihovny kompatibilní s Expo Go

## Struktura projektu

```
CviceniApp/
  - app.json               # Konfigurace Expo aplikace
  - App.tsx                # Hlavní komponenta aplikace
  - assets/                # Obrázky a ikony
  - components/            # Sdílené komponenty
  - context/               # React Context pro globální stav
  - docs/                  # Dokumentace
  - hooks/                 # Sdílené custom hooks
  - screens/               # Obrazovky aplikace
    - [NázevObrazovky]/    # Složka pro každou obrazovku
      - components/        # Komponenty specifické pro obrazovku
      - hooks/             # Hooks specifické pro obrazovku
      - types/             # TypeScript typy pro obrazovku
      - utils/             # Pomocné funkce pro obrazovku
      - [NázevObrazovky]Screen.tsx # Hlavní soubor obrazovky
  - translations/          # Překlady
  - types/                 # Sdílené TypeScript typy
  - utils/                 # Sdílené pomocné funkce
```

## Obrazovky a komponenty

### Prehled
- **Soubor:** `screens/Prehled/PrehledScreen.tsx`
- **Účel:** Hlavní obrazovka aplikace zobrazující přehled všech cvičení
- **Klíčové komponenty:**
  - `CelkoveStatistiky` - Zobrazuje souhrnné statistiky cvičení
  - `PrehledCviceni` - Seznam karet cvičení
  - `CelkovyProgressBar` - Ukazatel celkového pokroku
  - `NastaveniModal` - Modal pro nastavení aplikace
  - `PremiumModal` - Modal pro prémiové funkce (aktuálně skryto pro testovací build)
  - `WelcomeModal` - Úvodní modal pro nové uživatele

### Opakovani
- **Soubor:** `screens/Opakovani/OpakovaniScreen.tsx`
- **Účel:** Obrazovka pro sledování cvičení založených na opakování
- **Klíčové komponenty:**
  - `CviceniPolozka` - Položka cvičení v seznamu
  - `KruhovyUkazatelPokroku` - Vizuální indikátor pokroku
  - `PlovouciTlacitko` - Tlačítko pro přidání nového cvičení

### Casovky
- **Soubor:** `screens/Casovky/CasovkyScreen.tsx`
- **Účel:** Obrazovka pro sledování cvičení založených na čase
- **Klíčové komponenty:**
  - `CasovkaPolozka` - Položka časového cvičení v seznamu
  - `SeznamCasovek` - Seznam časových cvičení

### DetailCviceni
- **Soubor:** `screens/DetailCviceni/DetailCviceniScreen.tsx`
- **Účel:** Detailní zobrazení konkrétního cvičení s historií a nastavením
- **Klíčové komponenty:**
  - `StatistikyKomponenta` - Zobrazuje statistiky cvičení
  - `TydenKontejner` - Zobrazuje týdenní přehled cvičení
  - `HistorieModal` - Modal s historií cvičení
  - `NastaveniModal` - Modal pro nastavení cvičení
  - `PridatCas` / `PridatOpakovani` - Komponenty pro přidání záznamu

### PridatCviceni
- **Soubor:** `screens/PridatCviceni/PridatCviceniScreen.tsx`
- **Účel:** Formulář pro přidání nového cvičení
- **Klíčové komponenty:**
  - `FormularNazev` - Vstupní pole pro název cvičení
  - `BarvyVyber` - Výběr barvy cvičení
  - `DenniCilVyber` - Nastavení denního cíle
  - `SmerovaniVyber` - Výběr typu cvičení (čas/opakování)

### LanguageSelection
- **Soubor:** `screens/LanguageSelection/LanguageSelectionScreen.tsx`
- **Účel:** Obrazovka pro výběr jazyka aplikace

## Kontexty a globální stav

### CviceniContext
- **Soubor:** `context/CviceniContext.tsx`
- **Účel:** Správa stavu cvičení, CRUD operace
- **Klíčové funkce:**
  - `pridatCviceni` - Přidání nového cvičení
  - `upravitCviceni` - Úprava existujícího cvičení
  - `smazatCviceni` - Smazání cvičení
  - `pridatZaznam` - Přidání záznamu k cvičení

### ObdobniContext
- **Soubor:** `context/ObdobniContext.tsx`
- **Účel:** Správa časového období pro zobrazení dat
- **Klíčové funkce:**
  - `setAktualniObdobi` - Nastavení aktuálního období
  - `getPredchoziObdobi` / `getNasledujiciObdobi` - Navigace mezi obdobími

### LanguageContext
- **Soubor:** `context/LanguageContext.tsx`
- **Účel:** Správa jazykových nastavení aplikace
- **Klíčové funkce:**
  - `setLanguage` - Nastavení jazyka aplikace
  - `t` - Funkce pro překlad textů

### PlatbyContext
- **Soubor:** `context/PlatbyContext.tsx`
- **Účel:** Správa prémiových funkcí a plateb
- **Klíčové funkce:**
  - `jePremium` - Indikátor prémiového účtu (pro testovací build nastaveno na true)
  - `zakoupitPremium` - Funkce pro zakoupení prémiového účtu

## Hooks a utility

### useTranslation
- **Soubor:** `hooks/useTranslation.ts`
- **Účel:** Hook pro přístup k překladům

### useDetailCviceni
- **Soubor:** `screens/DetailCviceni/hooks/useDetailCviceni.ts`
- **Účel:** Hook pro logiku detailu cvičení

### usePridatCviceni
- **Soubor:** `screens/PridatCviceni/hooks/usePridatCviceni.ts`
- **Účel:** Hook pro logiku přidání cvičení

### ukladaniDat
- **Soubor:** `utils/ukladaniDat.ts`
- **Účel:** Funkce pro ukládání a načítání dat z lokálního úložiště

## Styly a barvy

### Základní barvy
- **Primární:** '#3498db' (modrá)
- **Sekundární:** '#2ecc71' (zelená)
- **Pozadí:** '#f5f5f5' (světle šedá)
- **Text:** '#333333' (tmavě šedá)
- **Chyba:** '#e74c3c' (červená)

### Styly komponent
- Většina stylů je definována inline v komponentách
- Sdílené styly jsou definovány v příslušných komponentách

## Build a deployment

### Lokální vývoj
- **Spuštění:** `npm start`
- **Testování:** Expo Go aplikace

### Build pro Google Play
- **Nástroj:** EAS Build (Expo Application Services)
- **Konfigurace:** `eas.json`
- **Keystore:** "FitTracker Production Keystore" (nakonfigurovaný na Expo serveru)
- **Příkaz:** `eas build --platform android --profile production --non-interactive --no-wait`
- **Verze aplikace:** 1.2.0 (versionCode 5)
- **Package name:** com.mkbuildp.fittracker
- **EAS Project ID:** 5a1020bb-0c33-42f4-82ab-b8920683f55c

### GitHub Actions workflow
- **Soubor:** `.github/workflows/eas-build.yml`
- **Účel:** Automatický build aplikace při push do main větve
- **Konfigurace:** Používá Expo GitHub Action a EAS Build s parametry `--non-interactive --no-wait`
- **Trigger:** Push do větve main nebo manuální spuštění (workflow_dispatch)
- **Požadavky:** Nastavený EXPO_TOKEN v GitHub Secrets (https://github.com/MKbuildp/FitTracker/settings/secrets/actions)

## Git workflow

- **Hlavní větev:** main
- **Vývojové větve:** feature/[název-funkce]
- **Hotfix větve:** hotfix/[název-opravy]
- **Commit konvence:** [typ]: [popis] (např. "feat: přidání nové obrazovky")

## Známé problémy a řešení

### Generování keystore
- **Problém:** "Generating a new Keystore is not supported in --non-interactive mode"
- **Řešení:** Použít existující keystore s parametrem `--no-wait`
- **Detaily:** Při automatizovaném buildu v GitHub Actions je nutné použít již existující keystore, který je nakonfigurovaný na Expo serveru ("FitTracker Production Keystore"). Parametr `--no-wait` umožňuje spustit build asynchronně bez čekání na dokončení.

### Context access might be invalid: EXPO_TOKEN
- **Problém:** GitHub Actions nemůže přistupovat k tajnému klíči EXPO_TOKEN
- **Řešení:** Vytvořit a nastavit EXPO_TOKEN v GitHub Secrets
- **Detaily:** 
  1. Vytvořit token na stránce https://expo.dev/settings/access-tokens
  2. Přidat token jako tajný klíč EXPO_TOKEN v GitHub repozitáři na stránce https://github.com/MKbuildp/FitTracker/settings/secrets/actions

### Premium funkce v testovacím buildu
- **Problém:** Potřeba skrýt prémiové funkce pro testovací build
- **Řešení:** Nastavení `jePremium` na `true` v `PlatbyContext.tsx` a úprava souvisejících komponent
- **Detaily:** Pro testovací účely byly všechny prémiové funkce zpřístupněny nastavením `jePremium` na `true` v kontextu. Zároveň byly upraveny komponenty `PrehledScreen.tsx` (skrytí PremiumModal) a `NastaveniModal.tsx` (odstranění sekce Premium).

### Zvýšení verze aplikace
- **Postup:**
  1. Upravit `version` a `versionCode` v `app.json`
  2. Vytvořit nový build pomocí EAS Build
  3. Odeslat na Google Play Console pomocí `eas submit`

### Testování v Expo Go
- **Omezení:** Některé nativní funkce nemusí být dostupné v Expo Go
- **Řešení:** Pro testování plné funkcionality je nutné vytvořit development build pomocí `eas build --profile development` 