# Cursor Rules pro Projekt Mobilní Aplikace v React Native

*Poslední aktualizace: 17. prosince 2024*

## Persona a Styl Komunikace
- Komunikujeme VÝHRADNĚ česky. Rozumíš českým zadáním a odpovídáš vždy česky.
- Tvůj styl komunikace je nápomocný

## Základní Technologie a Platforma
- Tento projekt používá React Native s TypeScriptem.

## KLÍČOVÉ PRAVIDLO 1: Expo Managed Workflow
- **Vývojový Workflow:** Používám Expo Managed Workflow. Projekt spouštím pomocí `npm start` a testuji výhradně v aplikaci **Expo Go**.
- **Expo SDK 53:** Aktuální verze Expo SDK v projektu je 53. Tuto verzi **nesmíš měnit**.
- **Kompatibilita s Expo Go:** Toto je nejdůležitější bod. Veškerý vygenerovaný kód a všechny navržené knihovny musí být spustitelné přímo v aplikaci Expo Go. **Nepřidávej žádné knihovny ani kód, které vyžadují:**
    * Vlastní nativní moduly (custom native modules).
    * Nutnost sestavení vlastního development klienta (custom development build).
    * "Eject" z Expo Managed Workflow.
- **Knihovny:** Pokud potřebuješ přidat knihovny, preferuj ty přímo od Expo (`expo-...`) nebo takové, které jsou známé svou kompatibilitou s Expo Go a Managed Workflow (např. `react-navigation`). Ověř si jejich kompatibilitu s mou verzí Expo SDK.
- **Build:** Projekt musí zůstat kompatibilní s EAS Build pro pozdější generování `.aab`.
- Balíčky musí mít správné verze pro Expo SDK 53

## KLÍČOVÉ PRAVIDLO 2: Velikost souborů
- **Obecné soubory:** Optimální délka je 100-250 řádků. Nevytvářet soubory delší než 350 řádků kvůli snížené udržitelnosti.
- **React Native komponenty:** ideální délka je 50-200 řádků.
- Každá komponenta by měla mít jednu jasně definovanou funkci (Single Responsibility Principle).
- **Řešení pro velké soubory:** rozdělte je na menší, logické moduly.
- Vytvořte z částí kódu znovupoužitelné podkomponenty.
- Oddělte stavovou logiku nebo komplexní funkce do vlastních hooks.
- **Základní princip:** Čím kratší a cílenější soubor, tím snazší je jeho čtení, porozumění a údržba.

## KLÍČOVÉ PRAVIDLO 3: Česká Indexace
- Pro názvy komponent, funkcí, proměnných, tříd... POUŽÍVEJ čěštinu.
- Před definici každé nově vytvořené nebo významně upravené komponenty, funkce nebo třídy PŘIDEJ komentář (`/** ... */` nebo `//`) obsahující stručný popis pro vyhledávání.

## KLÍČOVÉ PRAVIDLO 4: Struktura a modularita obrazovek
### Základní principy
- Každá obrazovka musí být samostatným modulem s vlastní složkou
- Veškerá logika musí být oddělena od prezentační vrstvy
- Komponenty specifické pro obrazovku patří do její složky
- Maximální délka souborů je 200 řádků

### Struktura složky obrazovky
```
screens/
NázevObrazovky/ # Hlavní složka obrazovky
├── components/ # Komponenty specifické pro tuto obrazovku
│ ├── NázevKomponenty1.tsx # Jednotlivé komponenty
│ └── NázevKomponenty2.tsx
├── hooks/ # Hooky specifické pro tuto obrazovku
│ ├── useNázevHooku1.ts
│ └── useNázevHooku2.ts
├── utils/ # Pomocné funkce specifické pro obrazovku
│ └── helpers.ts
├── types/ # TypeScript typy pro tuto obrazovku
│ └── types.ts
├── NázevObrazovkyScreen.tsx # Shell komponenta
```

### Implementační postup pro přesun/vytvoření komponenty
#### 1. Přípravná fáze
- Identifikovat všechny importy a závislosti původní komponenty
- Zkopírovat celý původní kód komponenty
- Vytvořit novou adresářovou strukturu podle vzoru výše

#### 2. Rozdělení kódu (v tomto pořadí)
1. **Typy (`types/types.ts`)**
   - Vytvořit soubor pro typy
   - Přesunout všechna rozhraní a typy
   - Přidat typy pro hook (state a return typy)
   - Exportovat všechny typy

2. **Hook (`hooks/useNázevKomponenty.ts`)**
   - Vytvořit hook se stejnou funkcionalitou
   - Přesunout veškerou logiku z komponenty
   - Přesunout všechny useState a useEffect
   - Přesunout všechny handlery a pomocné funkce
   - Vrátit objekt s daty a handlery

3. **Komponenta (`components/NázevKomponenty.tsx`)**
   - Zachovat pouze prezentační vrstvu (JSX)
   - Použít hook pro veškerou logiku
   - Importovat typy z types.ts
   - Zachovat styly v komponentě

#### 3. Aktualizace importů
- Aktualizovat cesty ke všem importům v nových souborech
- Upravit importy v souborech, které používají komponentu
- Zkontrolovat relativní cesty (../../)

#### 4. Testování a ověření
- Vizuálně porovnat novou implementaci s původní
- Ověřit všechny funkcionality
- Zkontrolovat, že nedošlo k regresím

#### 5. Dokončení
- Odstranit původní soubor až po ověření funkčnosti
- Aktualizovat dokumentaci (pokud existuje)
- Commitnout změny s popisným komentářem

### Pravidla pro přesun
1. **Zachování funkčnosti**
   - Nová implementace musí být vizuálně identická
   - Veškerá funkcionalita musí zůstat zachována
   - Všechny props musí zůstat stejné

2. **Čistota kódu**
   - Každý soubor má jednu odpovědnost
   - Prezentační komponenta neobsahuje logiku
   - Hook obsahuje veškerou logiku
   - Typy jsou centralizované v types.ts

3. **Pojmenování a struktura**
   - Používat české názvy funkcí a proměnných
   - Dodržovat konzistentní formátování
   - Zachovat strukturu složek podle vzoru
   - Dokumentovat komponenty a funkce

## KLÍČOVÉ PRAVIDLO 5: Preferování funkcionálních komponent a Hooks
### Pravidlo: Používání funkcionálních komponent a Hooks
Při vytváření nových React Native komponent **striktně dodržuj následující:**
1. **Vždy preferuj** funkcionální komponenty (`function MyComponent() { ... }` nebo `const MyComponent = () => { ... }`) před třídními komponentami.
2. Pro správu stavu a vedlejších efektů ve funkcionálních komponentách **používej React Hooks** (`useState`, `useEffect`, `useContext`, `useCallback`, `useMemo`, atd.).
3. **Nepoužívej** starší lifecycle metody třídních komponent, pokud k tomu není specifický, oprávněný důvod.

### Proč:
- **Jednodušší kód:** Funkcionální komponenty s Hooks jsou často kratší a snáze čitelné.
- **Snadnější sdílení logiky:** Custom Hooks umožňují elegantně sdílet stavovou logiku mezi komponentami.
- **Lepší optimalizace:** Hooks jako `useMemo` a `useCallback` poskytují přímé nástroje pro optimalizaci výkonu.
- **Moderní standard:** Ekosystém Reactu (včetně React Native) se primárně zaměřuje na funkcionální komponenty a Hooks.

## KLÍČOVÉ PRAVIDLO 6: Optimalizace výkonu
### Pravidlo: Proaktivní optimalizace výkonu
Při vývoji komponent, zejména těch, které se často překreslují nebo zobrazují seznamy, **aktivně zvažuj a aplikuj následující optimalizace:**
1. **Obal komponenty pomocí `React.memo`**, pokud přijímají props a neměly by se zbytečně překreslovat.
2. **Používej `useCallback`** pro funkce, které předáváš jako props do optimalizovaných komponent.
3. Při použití `FlatList` nebo `SectionList`:
   - **Vždy poskytni `keyExtractor`**, který vrací unikátní stringový klíč pro každou položku.
   - Pokud je to možné a výška položek je konstantní, použij `getItemLayout`.
   - Optimalizuj renderování položek seznamu pomocí `React.memo`.
   - Zvaž použití `initialNumToRender`, `maxToRenderPerBatch`, `windowSize` pro optimalizaci renderování velkých seznamů.

### Proč:
- **Plynulost aplikace:** Zbytečné překreslování komponent je častou příčinou zasekávání a pomalé odezvy UI.
- **Efektivita seznamů:** `FlatList` je výkonný, ale neoptimalizované použití může vést k problémům s pamětí a výkonem.

## KLÍČOVÉ PRAVIDLO 7: Přehled projektu
### Struktura projektu
- Kompletní struktura projektu (kromě node_modules) musí být pravidelně aktualizována v souboru `/docs/project-structure.md`
- Aktualizace struktury se provádí:
  - Po přidání nové feature (složky, komponenty)
  - Po významné změně struktury
  - Minimálně jednou týdně při aktivním vývoji
- Struktura musí obsahovat:
  - Všechny složky a jejich hierarchii
  - Všechny soubory (kromě node_modules)
  - Krátký popis účelu hlavních složek
  - Datum poslední aktualizace

### Účel
- Udržení přehledu o projektu
- Snadnější orientace pro nové členy týmu
- Dokumentace růstu a změn projektu
- Prevence duplicit a nekonzistencí

## KLÍČOVÉ PRAVIDLO 8: Správa verzí s Git
### Pravidlo: Kontrola Git operací
- **NIKDY** neprováděj Git operace (`git add`, `git commit`, `git push`) automaticky
- Git operace se provádějí **POUZE na explicitní žádost** uživatele
- Před každou Git operací **informuj uživatele** o tom, co se bude dělat
- Uživatel **VŽDY** rozhoduje o:
  - Kdy se změny commitnou
  - Jaký commit message se použije
  - Kdy se změny pushnou na remote repository

### Doporučené workflow:
1. Proveď změny v kódu
2. Informuj uživatele o provedených změnách
3. **Čekej na pokyn** k Git operacím
4. Proveď Git operace pouze po schválení uživatelem

### Výjimky:
- **Žádné výjimky** - vždy čekej na explicitní souhlas uživatele

## KLÍČOVÉ PRAVIDLO 9: Nastavení vývojového prostředí
### Pravidlo: Konfigurace externích služeb a nástrojů
Při tvorbě nové aplikace nebo nastavování vývojového prostředí je nutné nakonfigurovat následující služby a nástroje, které **nelze vygenerovat automaticky**:

### 🔧 Povinné manuální konfigurace:
1. **Git Repository**
   - Vytvoření GitHub/GitLab repository
   - Nastavení SSH klíčů nebo Personal Access Tokens
   - Konfigurace Git identity (`git config user.name` a `git config user.email`)

2. **Expo Account**
   - Registrace Expo účtu na https://expo.dev
   - Získání Expo Auth Token pro CLI
   - Nastavení Project ID v `app.json`

3. **Google Play Console**
   - Registrace Google Play Developer účtu ($25 jednorázový poplatek)
   - Vytvoření nové aplikace v konzoli
   - Získání licenčního klíče pro in-app purchases (pokud potřeba)

4. **Apple Developer Program** (pro iOS)
   - Registrace Apple Developer účtu ($99/rok)
   - Vytvoření App ID a provisioning profiles
   - Konfigurace certificates

5. **EAS Build**
   - Nastavení EAS CLI
   - Konfigurace `eas.json`
   - Nastavení credentials (keystore pro Android, certificates pro iOS)

6. **GitHub Actions** (pro CI/CD)
   - Nastavení GitHub Secrets:
     - `EXPO_TOKEN`
     - Další API klíče podle potřeby
   - Konfigurace workflow souborů

### 📋 Kontrolní seznam před zahájením vývoje:
- [ ] Git repository vytvořen a nakonfigurován
- [ ] Expo účet registrován a token nastaven
- [ ] Google Play Console účet (pro Android publikování)
- [ ] Apple Developer účet (pro iOS publikování)
- [ ] EAS Build nakonfigurován
- [ ] CI/CD pipeline nastaven (pokud potřeba)

### 🚨 Důležité upozornění:
- **Vždy informuj uživatele** o potřebě těchto manuálních konfigurací
- **Poskytni konkrétní kroky** pro každou konfiguraci
- **Ověř dostupnost** všech potřebných účtů před pokračováním
- **Dokumentuj** všechny konfigurace pro budoucí reference

### 💡 Tipy pro efektivní setup:
- Vytvořte checklist pro nové projekty
- Udržujte aktuální dokumentaci všech potřebných konfigurací
- Zálohujte důležité konfigurace (keystore, certificates)
- Používejte environment variables pro citlivé údaje 