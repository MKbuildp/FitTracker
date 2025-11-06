## 1. RYCHLÝ PŘEHLED

- **Název aplikace**: Quotidis (balíček `com.mkbuildp.activus`)
- **Účel**: Jednoduchý fitness tracker pro dvě metriky cvičení:
  - Opakování (počty)
  - Časovky (měřené v čase)
- **Klíčové funkce**:
  - Přehled dne s kalendářem a denní aktivitou
  - Seznam cvičení na opakování a časovky v oddělených záložkách
  - Detail cvičení (statistiky, přidávání záznamů, týdenní přehled, nastavení)
  - Přidání nového cvičení (název, směřování, denní cíl, barva)
  - Měsíční přehled s kalendářem a statistikami
  - Výběr jazyka při prvním spuštění (CS/EN)
  - Push notifikace s připomenutím k cvičení (nastavitelný čas)
- **Technologie**: Expo 54, React Native 0.81, React 19, React Navigation 7, AsyncStorage, expo-notifications, react-native-svg, react-native-chart-kit
- **Běh**: `npm start` (Expo), Android/iOS: `npm run android`/`npm run ios`
- **Build (EAS)**: `npm run build:android`, `npm run build:android:prod`, `npm run build:ios`, `npm run build:ios:prod`


## 2. ARCHITEKTURA A NAVIGACE

- Kořen: `App.tsx`
  - Poskytuje providery: `LanguageProvider`, `NotificationProvider`, `CviceniProvider`
  - `NavigationContainer` se Stack navigátorem a vnořenými Taby
- Navigace
  - Stack obrazovky:
    - `HlavniTaby` (obsahuje Tabs: `Casovky`, `Prehled`, `Opakovani`)
    - `PridatCviceni`
    - `DetailCviceni`
    - `MesicniPrehled`
  - Tab obrazovky:
    - `Casovky` (časově měřená cvičení)
    - `Prehled` (denní přehled + kalendář + nastavení cílů)
    - `Opakovani` (cvičení s počtem opakování)
- Onboarding
  - Při prvním spuštění se zobrazí `LanguageSelectionScreen`; po dokončení se načtou ukázková cvičení dle jazyka


## 3. STAV A DATA

- Globální stav cvičení: `context/CviceniContext.tsx`
  - Uchovává: seznam cvičení, seznam záznamů výkonů, stav načítání, globální denní cíle (počet opakování, počet dokončených cvičení)
  - Akce: přidat/úprava/smazat cvičení, přidat/smazat záznam, nastavit denní cíl, změnit barvu cvičení, hromadné nastavení cílů
  - Při prvním načtení zakládá ukázková cvičení dle jazyka (CS/EN)
- Globální stav notifikací: `context/NotificationContext.tsx`
  - Uchovává: nastavení notifikací (povoleno/vypnuto, časy připomínek), stav oprávnění, stav načítání
  - Akce: zapnout/vypnout notifikace, nastavit časy připomínek, zkontrolovat/získat oprávnění
  - Automaticky naplánuje denní notifikace podle nastavení
- Ukládání: `utils/ukladaniDat.ts`
  - AsyncStorage klíče: `cviceni`, `zaznamy`, `nastaveni_cilu`, `nastaveni_notifikaci`
  - Serializace dat s převodem `Date` ⇄ ISO string
- Správa notifikací: `utils/notifikace/`
  - `scheduler.ts`: plánování denních připomínek, kontrola oprávnění
  - `types.ts`: typy pro nastavení notifikací
  - Automatická aktualizace při změně jazyka
- Rozšířené ukládání (volitelné pro větší objemy): `utils/rozsireneUkladani.ts` (Expo FileSystem)
- Lokalizace: `context/LanguageContext.tsx`, `translations/{cs,en}.ts`, `hooks/useTranslation.ts`
  - `useTranslation()` vrací `t()` a `safeT()` s fallbackem


## 4. SLOŽKY A KONVENCE

- `components/`: znovupoužitelné UI
  - `CviceniKarta`: karta cvičení pro seznamy
  - `PozadiVzory`: dekorativní pozadí (kruhový, diagonální vzor)
  - `TabBar`: plovoucí tab navigace
  - `CasVyberModal`: modální okno pro výběr času (hodiny:minuty) s tlačítky +/-
- `screens/`: obrazovky rozdělené dle funkcí
  - `Prehled/` (denní přehled, kalendář, nastavení cílů, nastavení notifikací)
  - `Opakovani/` (seznam opakovacích cvičení)
  - `Casovky/` (seznam časovek)
  - `DetailCviceni/` (statistiky, přidávání záznamů, týdenní kontejner, nastavení)
  - `MesicniPrehled/` (měsíční kalendář a statistiky)
  - `PridatCviceni/` (formulář pro vytvoření cvičení)
  - `LanguageSelection/` (výběr jazyka při prvním spuštění)
- `context/`: globální stav (`CviceniContext`, `LanguageContext`, `NotificationContext`)
- `hooks/`: sdílené hooky (`useTranslation`, `useKalendarData`, aj.)
- `src/styles/`: design tokeny a responzivní systém (`theme.ts`)
- `translations/`: překlady, klíče odvozené z `cs.ts`
- `utils/`: ukládání dat a pomocné utility

Dodržuj Pravidlo 10: nové soubory vkládej do odpovídající existující složky a drž separaci zodpovědností.


## 5. DESIGN SYSTÉM A RESPONSIVITA

- Zdroje: `src/styles/theme.ts`
  - `responsiveSpacingValues`: xxs, xs, sm, md, lg, xl, xxl
  - `responsiveTypography`: předdefinované velikosti textu (title, subtitle, body, atd.)
  - `responsiveComponents`: výšky, rádiusy, velikosti ikon, apod.
  - Funkce: `responsiveSize`, `responsiveFontSize`, `responsiveSpacing`
- Použití:
  - VŽDY používej tokeny pro rozestupy a typografii
  - Nepoužívej pevné px hodnoty; RN pracuje v dp, škáluj přes tokeny/helpery
  - Rozvržení vždy přes Flexbox; pro mezery preferuj `margin` nebo `gap` (pokud podporováno)


## 6. PŘÍSTUPNOST (a11y)

- Interaktivní prvky musí mít nastavené `accessibilityRole` a `accessibilityLabel`
- Kontrast a čitelnost: dodržuj barevné kontrasty, texty škáluj přes `responsiveTypography`
- Navigační prvky (TabBar, hlavičky) mají být srozumitelně popsané v rámci překladů


## 7. REUSE A STYLING KONVENCE

- Než vytvoříš novou komponentu, zkontroluj `components/` a komponenty ve `screens/*/components`
- Pokud existuje podobná komponenta, znovupoužij ji; zákaz duplikace funkčnosti a stylu
- Styly drž u komponenty (StyleSheet nebo dedikovaný `*.styles.ts` v téže složce)
- Inline styly používej pouze pro dynamické hodnoty (např. barva dle stavu)
- **Opakovaně použitelné komponenty**:
  - `CasVyberModal`: pro výběr času (hodiny:minuty) kdekoli v aplikaci
  - Použití: import z `components/CasVyberModal`, props: `viditelne`, `onZavrit`, `vychoziCas`, `onUlozit`, `nadpis`


## 8. OBRAZOVKY – SHRNUTÍ

- `PrehledScreen`
  - Zobrazuje denní přehled, kalendář týdne, denní aktivitu, modaly pro nastavení a cíle
  - Využívá `useKalendarData`, `NastaveniModal`, `NastaveniCiluModal`, `NastaveniNotifikaciModal`
- `OpakovaniScreen`
  - Seznam cvičení s typem měření „opakovani“ (FlatList, karta `CviceniKarta`)
- `CasovkyScreen`
  - Seznam cvičení s typem měření „cas“ (filtrování přes `helpers.ts`)
- `DetailCviceniScreen`
  - Statistiky, přidání záznamu (opakování/čas), týdenní přehled, nastavení cvičení
- `PridatCviceniScreen`
  - Formulář: název, směřování (u času), denní cíl, barva, uložení do globálního stavu
- `MesicniPrehledScreen`
  - Měsíční kalendář, sumární statistiky, plovoucí `TabBar`
- `LanguageSelectionScreen`
  - Volba jazyka při prvním spuštění, následně inicializace ukázkových dat


## 9. TYPY A MODELY

- Sdílené typy jsou v `types/` (např. `Cviceni`, `ZaznamVykonu`, `RootStackParamList`)
- Cvičení: id, název, typ měření (`opakovani`|`cas`), směřování, datum vytvoření, denní cíl, barva, příznak cíle
- Záznam výkonu: id, hodnota, datum/čas, vazba na `cviceniId`


## 10. PŘEKLADY A JAZYKY

- Jazyky: `cs`, `en` (výchozí `cs`)
- `translations/index.ts` exportuje `translations`, typ `Language` a `TranslationKey`
- Použití v kódu: `const { t, safeT } = useTranslation()`
- **Nové klíče pro notifikace** (sekce `notifications.*`):
  - `notifications.title`, `notifications.enabled`, `notifications.configure`
  - `notifications.reminderTimes`, `notifications.hours`, `notifications.minutes`
  - `notifications.selectTime`, `notifications.addReminder`
  - A další (viz `translations/{cs,en}.ts`)


## 11. BUILD A SPUŠTĚNÍ

- Spuštění:
  - `npm start` (Expo vývojový server)
  - `npm run android` / `npm run ios` / `npm run web`
- Build (EAS):
  - Preview: `npm run build:android`, `npm run build:ios`, `npm run build:all`
  - Production: `npm run build:android:prod`, `npm run build:ios:prod`
- Konfigurace Expo: `app.json` (ikony, splash, edge-to-edge, balíčky, permissions)
  - Plugin `expo-notifications` pro push notifikace


## 12. STANDARDY KÓDU

- React/TypeScript, vyhýbat se nadměrným `any`, preferovat jasné typy veřejných API
- Ovlivnitelná logika přes guard clauses, minimalizuj try/catch bez smysluplné práce s chybami
- Krátké, výstižné a sémantické názvy proměnných/funkcí (čitelnost > zkratky)
- Nezavádět mrtvý kód a nepoužívané importy; při refaktoringu čistit


## 13. TESTY (DOPORUČENÍ)

- Jednotkové testy pro:
  - Reducer a akce v `CviceniContext`
  - `ukladaniDat` (serializace/deserializace, výchozí hodnoty, chyby)
  - Doménové helpery (např. `screens/*/utils/helpers.ts`)
- Komponentní testy:
  - Render a interakce (přidání záznamu, změna cíle, prázdné stavy)


## 14. PŘÍSTUPOVÁ PRAVIDLA A REGRESE

- Před nasazením ověřit, že změny neporušují dříve řešené chyby (viz níže)
- Při aktivaci „Klíčového pravidla 6 – Stabilita buildu“ před změnami v chráněných souborech žádat explicitní potvrzení


## 15. BUILD_FAILURE_HISTORY

- (zatím prázdné)


## 16. PŘÍSPĚVKY A DOPORUČENÍ PRO ROZVOJ

- Před přidáním nové UI komponenty vždy hledat reuse
- Dodržuj design tokeny (`src/styles/theme.ts`) pro rozměry, mezery a typografii
- Doplňovat `accessibilityRole`/`accessibilityLabel` pro interaktivní prvky
- Při úpravách navigace kontrolovat názvy překladových klíčů v `translations/*`
- Pro výběr času použij komponentu `CasVyberModal` z `components/`

## 17. NOTIFIKACE

- **Implementace**: Push notifikace pomocí `expo-notifications`
- **Funkce**: Připomenutí k cvičení v nastavitelný čas (denní připomínky)
- **Nastavení**: 
  - Zapnout/vypnout notifikace
  - Nastavit až 5 připomínek denně (každá s vlastním časem)
  - Časy se nastavují pomocí modálního okna `CasVyberModal`
- **Kontext**: `NotificationContext` spravuje nastavení a automaticky plánuje notifikace
- **Ukládání**: Nastavení se ukládá do AsyncStorage pod klíčem `nastaveni_notifikaci`
- **Oprávnění**: Aplikace automaticky žádá o oprávnění při prvním použití
- **Struktura**:
  - `context/NotificationContext.tsx`: kontext pro správu notifikací
  - `utils/notifikace/scheduler.ts`: plánování a správa notifikací
  - `utils/notifikace/types.ts`: typy pro nastavení
  - `screens/Prehled/components/NastaveniNotifikaciModal.tsx`: UI pro nastavení



